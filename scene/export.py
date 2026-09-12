"""Export committed desk.blend in the single live Blender session.

Run with runpy.run_path(..., run_name='__main__'). Reloads the committed source
before and after export; transient curve conversion never changes desk.blend.
"""
import hashlib
import json
import math
import struct
import subprocess
from pathlib import Path

import bpy
from mathutils import Matrix

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'scene' / 'desk.blend'
OUTPUT = ROOT / 'public' / 'scene'
ANCHORS = ('cam_wide', 'cam_main_monitor', 'cam_side_monitor', 'cam_wall',
           'cam_desk_end', 'cam_window')
SURFACES = ('screen_main', 'screen_side', 'glass_case', 'glass_window',
            'strip_window_left', 'strip_window_right', 'strip_wall',
            'keys_rgb', 'frames_credentials')
LITE_DROP = ('collectible_', 'sill_', 'diffuser_', 'couch_', 'foam_roller',
             'iem_cable_', 'iem_lead')
TO_GLTF = Matrix.Rotation(-math.pi / 2, 4, 'X')


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT,
        creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))


def digest(data):
    return hashlib.sha256(data).hexdigest()


def vector(v):
    return [round(float(x), 8) for x in v]


def read_glb(path):
    data = path.read_bytes()
    magic, version, length = struct.unpack_from('<III', data)
    assert magic == 0x46546C67 and version == 2 and length == len(data)
    size, kind = struct.unpack_from('<II', data, 12)
    assert kind == 0x4E4F534A
    return json.loads(data[20:20+size]), data[20+size:]


def normalize_anchors(path, anchors, blend_hash):
    document, tail = read_glb(path)
    # Mesh local axes are converted by glTF's exporter. Camera pose empties
    # instead retain local -Z forward / +Y up, as specified by the contract.
    # Normalize these leaf nodes to the source-derived camera poses.
    for node in document['nodes']:
        if node.get('name') in anchors:
            pose = anchors[node['name']]
            assert not node.get('children')
            node.pop('matrix', None)
            node['translation'] = pose['position']
            node['rotation'] = pose['quaternion']
            node['scale'] = [1, 1, 1]
            node['extras'] = {'fov': pose['fov'], 'path': pose['path']}
    document['asset']['extras'] = {'blendHash': blend_hash, 'stage': 'blockout'}
    assert 'KHR_draco_mesh_compression' in document.get('extensionsRequired', [])
    encoded = json.dumps(document, separators=(',', ':'), sort_keys=True).encode()
    encoded += b' ' * (-len(encoded) % 4)
    path.write_bytes(struct.pack('<III', 0x46546C67, 2, 20+len(encoded)+len(tail))
        + struct.pack('<II', len(encoded), 0x4E4F534A) + encoded + tail)


def export():
    if bpy.data.is_dirty:
        raise RuntimeError('Save and commit live Blender edits before exporting')
    source_bytes = SOURCE.read_bytes()
    if source_bytes != git('show', 'HEAD:scene/desk.blend'):
        raise RuntimeError('Commit scene/desk.blend before exporting it')
    source_hash = digest(source_bytes)
    exported_at = git('log', '-1', '--format=%cI', '--', 'scene/desk.blend').decode().strip()
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    try:
        anchors, surfaces = {}, {}
        for name in ANCHORS:
            obj = bpy.data.objects[name]
            assert obj.type == 'EMPTY' and obj.parent is None
            position, rotation, scale = (TO_GLTF @ obj.matrix_world).decompose()
            assert all(abs(x-1) < 1e-6 for x in scale)
            assert 0 < obj['fov'] < 180 and obj['path'] in ('direct', 'arc')
            anchors[name] = {'position': vector(position),
                'quaternion': vector((rotation.x, rotation.y, rotation.z, rotation.w)),
                'fov': float(obj['fov']), 'path': obj['path']}
        for name in SURFACES:
            obj = bpy.data.objects[name]
            assert obj.type == 'MESH' and len(obj.data.materials) == 1
            points = [TO_GLTF @ obj.matrix_world @ v.co for v in obj.data.vertices]
            surfaces[name] = {'bounds': {
                'min': vector([min(p[i] for p in points) for i in range(3)]),
                'max': vector([max(p[i] for p in points) for i in range(3)])}}
            if name.startswith('screen_'):
                assert len(points) == 4 and len(obj.data.polygons) == 1
                assert obj.data.uv_layers.active is not None
                corners = [TO_GLTF @ obj.matrix_world @ obj.data.vertices[i].co
                           for i in obj.data.polygons[0].vertices]
                surfaces[name].update(corners=[vector(p) for p in corners],
                    width=round((corners[1]-corners[0]).length, 8),
                    height=round((corners[3]-corners[0]).length, 8))
        # Curve cables become real mesh geometry in the build artifact only.
        curves = [o for o in bpy.context.scene.objects if o.type == 'CURVE']
        depsgraph = bpy.context.evaluated_depsgraph_get()
        for obj in curves:
            mesh = bpy.data.meshes.new_from_object(obj.evaluated_get(depsgraph),
                                                   depsgraph=depsgraph)
            name, matrix = obj.name, obj.matrix_world.copy()
            replacement = bpy.data.objects.new(name + '_export', mesh)
            bpy.context.scene.collection.objects.link(replacement)
            replacement.matrix_world = matrix
            bpy.data.objects.remove(obj, do_unlink=True)
            replacement.name = name
        for filename, minimal in [('desk.glb', False), ('desk-lite.glb', True)]:
            bpy.ops.object.select_all(action='DESELECT')
            for obj in bpy.context.scene.objects:
                include = obj.type == 'MESH' or obj.name in ANCHORS
                if minimal and obj.name.startswith(LITE_DROP):
                    include = False
                obj.select_set(include)
            path = OUTPUT / filename
            window = bpy.context.window_manager.windows[0]
            area = next(a for a in window.screen.areas if a.type == 'VIEW_3D')
            region = next(r for r in area.regions if r.type == 'WINDOW')
            with bpy.context.temp_override(window=window, area=area, region=region):
                bpy.ops.export_scene.gltf(filepath=str(path), export_format='GLB',
                    use_selection=True, export_yup=True, export_apply=True,
                    export_extras=True, export_cameras=False, export_lights=False,
                    export_materials='EXPORT', export_draco_mesh_compression_enable=True,
                    export_draco_mesh_compression_level=6,
                    export_draco_position_quantization=16)
            normalize_anchors(path, anchors, source_hash)
            assert path.stat().st_size < 4194304
        # These slots deliberately contain no textures in the block-out milestone.
        # Final bake work will populate them with KTX2, never reference photos.
        for directory in ('ktx2-2k', 'ktx2-1k', 'ktx2-512'):
            slot = OUTPUT / directory
            slot.mkdir(exist_ok=True)
            (slot / 'README.txt').write_text(
                'Block-out tier: zero textures. Reserved for final KTX2 bakes.\n')
        manifest = {'version': 1, 'stage': 'blockout', 'glb': 'desk.glb',
            'exportedAt': exported_at, 'blendHash': source_hash,
            'anchors': anchors, 'surfaces': surfaces,
            'tiers': {'full': {'glb': 'desk.glb', 'textures': 'ktx2-2k'},
                      'reduced': {'glb': 'desk.glb', 'textures': 'ktx2-1k'},
                      'minimal': {'glb': 'desk-lite.glb', 'textures': 'ktx2-512'}},
            'budgets': {'glbBytes': 4194304, 'textureBytes': 6291456},
            'artifacts': {name: {'sha256': digest((OUTPUT/name).read_bytes()),
                                 'bytes': (OUTPUT/name).stat().st_size}
                          for name in ('desk.glb', 'desk-lite.glb')}}
        (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
        print('Exported committed source', source_hash)
    finally:
        bpy.ops.wm.open_mainfile(filepath=str(SOURCE))


if __name__ == '__main__':
    export()
