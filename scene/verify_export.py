"""Decode the exported GLB in a temporary scene and verify screen geometry.

Run inside the live Blender session. Restores desk.blend without saving changes.
"""
import contextlib
import io
import math
from pathlib import Path
import bpy

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'desk.blend'
bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
expected = {name: [obj.matrix_world @ v.co for v in obj.data.vertices]
            for name in ('screen_main','screen_side')
            for obj in [bpy.data.objects[name]]}
wide = bpy.data.objects['cam_wide'].matrix_world.copy()
fov = bpy.data.objects['cam_wide']['fov']
try:
    window = bpy.context.window_manager.windows[0]
    scene = bpy.data.scenes.new('Export verification')
    window.scene = scene
    area = next(a for a in window.screen.areas if a.type == 'VIEW_3D')
    region = next(r for r in area.regions if r.type == 'WINDOW')
    with bpy.context.temp_override(window=window, area=area, region=region):
        with contextlib.redirect_stdout(io.StringIO()):
            bpy.ops.import_scene.gltf(filepath=str(ROOT.parent/'public/scene/desk.glb'))
        bpy.context.view_layer.update()
        for name, corners in expected.items():
            obj = next(o for o in scene.objects if o.name.split('.')[0] == name)
            actual = [obj.matrix_world @ v.co for v in obj.data.vertices]
            error = max(min((a-b).length for a in actual) for b in corners)
            assert error < .0001, (name, error)
            print(name, 'decoded corner error:', error, 'meters')
        glass = next(o for o in scene.objects if o.name.split('.')[0]=='glass_case')
        glass.hide_render = True  # Same workbench review convention as source.
        camera_data = bpy.data.cameras.new('Export verification camera')
        camera_data.sensor_fit = 'VERTICAL'
        camera_data.sensor_height = 32
        camera_data.lens = 32/(2*math.tan(math.radians(fov/2)))
        camera = bpy.data.objects.new('Export verification camera',camera_data)
        scene.collection.objects.link(camera)
        camera.matrix_world = wide
        scene.camera = camera
        scene.render.engine = 'BLENDER_WORKBENCH'
        scene.display.shading.color_type = 'MATERIAL'
        scene.display.shading.light = 'STUDIO'
        scene.display.shading.show_shadows = False
        scene.display.shading.show_cavity = True
        scene.view_settings.view_transform = 'Standard'
        scene.render.resolution_x,scene.render.resolution_y = 1440,900
        scene.render.resolution_percentage = 100
        scene.render.filepath = str(ROOT/'review/export_wide.png')
        bpy.ops.render.render(write_still=True)
finally:
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
