"""Initial desk block-out construction, run inside the single live Blender session.

desk.blend is the editable source of truth. This script records the initial
proportion estimates; do not rerun it over a reviewed or hand-edited scene.
The layout recipe below uses (right, up, back), meters. This is a construction
convention, not a glTF frame: glTF positive Z points toward the chair.
"""

import math
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parent


def xyz(point):
    """Recipe (right, up, back) to Blender (+X right, +Y back, +Z up)."""
    x, y, z = point
    return Vector((x, z, y))


def finish(obj, name, tone=0.45):
    obj.name = name
    obj.color = (tone, tone, tone, 1)
    return obj


def box(name, center, size, tone=0.45, yaw=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=xyz(center))
    obj = finish(bpy.context.object, name, tone)
    obj.dimensions = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.rotation_euler.z = -math.radians(yaw)
    return obj


def rod(name, start, end, radius, tone=0.32, vertices=16):
    start, end = xyz(start), xyz(end)
    delta = end - start
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices, radius=radius, depth=delta.length,
        location=(start + end) / 2,
    )
    obj = finish(bpy.context.object, name, tone)
    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = delta.to_track_quat('Z', 'Y')
    return obj


def ellipsoid(name, center, size, tone=0.4):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, location=xyz(center))
    obj = finish(bpy.context.object, name, tone)
    obj.scale = (size[0] / 2, size[2] / 2, size[1] / 2)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return obj


def quad(name, center, width, height, tone=0.62, yaw=0):
    # Bottom-left, bottom-right, top-right, top-left viewed from the chair.
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(
        [(-width/2, 0, -height/2), (width/2, 0, -height/2),
         (width/2, 0, height/2), (-width/2, 0, height/2)], [], [(0, 1, 2, 3)]
    )
    mesh.uv_layers.new(name='UVMap')
    for loop, uv in zip(mesh.uv_layers.active.data, [(0,0), (1,0), (1,1), (0,1)]):
        loop.uv = uv
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = xyz(center)
    obj.rotation_euler.z = -math.radians(yaw)
    return finish(obj, name, tone)


def combine(name, objects):
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    obj = bpy.context.object
    obj.name = name
    return obj


def anchor(name, position, target, fov, path='direct'):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.empty_display_type = 'ARROWS'
    obj.empty_display_size = 0.10
    obj.location = xyz(position)
    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = (xyz(target) - obj.location).to_track_quat('-Z', 'Y')
    obj['fov'] = fov  # Vertical degrees, matching Three.js PerspectiveCamera.
    obj['path'] = path
    camera_data = bpy.data.cameras.new('review_' + name)
    camera_data.sensor_fit = 'VERTICAL'
    camera_data.sensor_height = 32
    camera_data.lens = 32 / (2 * math.tan(math.radians(fov / 2)))
    camera_data.clip_start = 0.01
    camera_data.clip_end = 50
    camera = bpy.data.objects.new('review_' + name, camera_data)
    bpy.context.collection.objects.link(camera)
    camera.parent = obj
    return obj


if bpy.data.filepath or set(bpy.data.objects) - {
    bpy.data.objects.get('Cube'), bpy.data.objects.get('Camera'), bpy.data.objects.get('Light')
}:
    raise RuntimeError('Seed script requires the untouched startup scene. Open desk.blend to edit it.')

for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)
for material in list(bpy.data.materials):
    bpy.data.materials.remove(material)

scene = bpy.context.scene
scene.name = 'Desk block-out'
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1
scene['stage'] = 'Block-out awaiting Pau framing approval; no materials or bakes'
scene['coordinate_convention'] = 'gltf_x_right_y_up_z_toward_chair'
scene['dimensions_note'] = 'Desk 2.10 x 0.64 m estimated from photos; top 0.74 m; monitors 24.1 and 27 inches.'

# Room shell with an actual window opening; the shade is raised.
box('floor', (-0.68, -0.045, -0.65), (3.40, 0.09, 2.40), .55)
box('wall_back_below_sill', (-0.68, .465, .35), (3.40, .93, .08), .76)
box('wall_back_above_window', (-0.68, 2.465, .35), (3.40, .33, .08), .76)
box('wall_back_left', (-1.82, 1.615, .35), (1.12, 1.37, .08), .76)
box('wall_back_right', (.4375, 1.615, .35), (1.045, 1.37, .08), .76)
box('wall_right', (1.0, 1.30, -.66), (.08, 2.60, 2.10), .72)
box('baseboard_back', (-.68, .045, .298), (3.40, .09, .025), .83)
box('baseboard_right', (.95, .045, -.66), (.025, .09, 2.10), .83)
box('window_sill', (-.67, .947, .24), (1.22, .035, .24), .82)
quad('glass_window', (-.67, 1.63, .36), 1.15, 1.30, .90)
for side, x in [('left', -1.26), ('right', -.08)]:
    box('window_frame_' + side, (x, 1.63, .30), (.035, 1.37, .075), .86)
    box('strip_window_' + side, (x, 1.63, .252), (.008, 1.32, .008), .98)
box('window_frame_top', (-.67, 2.30, .30), (1.215, .04, .075), .86)
rod('roller_shade_raised', (-1.23, 2.27, .26), (-.11, 2.27, .26), .032, .82)
box('strip_wall', (.32, 1.48, .298), (.012, .48, .012), .98)

# Long shallow table, main monitor stand at X=Z=0 and top at 0.74 m.
box('desk_top', (-.11, .722, -.08), (2.10, .036, .64), .26)
for i, (x, z) in enumerate([(-1.07, -.31), (-1.07, .17), (.85, -.31), (.85, .17)]):
    rod('desk_leg_' + str(i), (x, .015, z), (x, .704, z), .026, .24)


def monitor(kind, center, width, height, yaw):
    x, y, z = center
    angle = math.radians(yaw)
    # Face is toward local -Z; move slightly out from the bezel.
    normal = Vector((-math.sin(angle), 0, -math.cos(angle)))
    face = Vector(center) + normal * .023
    box('monitor_' + kind + '_body', center, (width+.024, height+.032, .044), .22, yaw)
    quad('screen_' + kind, face, width, height, .61, yaw)
    rod('monitor_' + kind + '_stem', (x, .759, z+.025), (x, y-.035, z+.025), .021, .28)
    if kind == 'main':
        box('monitor_main_base', (0, .751, 0), (.225, .022, .18), .31)
        box('webcam', (x, y+height/2+.04, z), (.087, .035, .035), .30)
        rod('webcam_lens', (x, y+height/2+.04, z-.018),
            (x, y+height/2+.04, z-.022), .009, .14)
    else:
        rod('monitor_side_base', (x, .742, z), (x, .758, z), .122, .31, 32)


monitor('main', (0, 1.105, 0), .534, .300, 0)
monitor('side', (-.635, 1.15, .015), .598, .336, -20)

# Keyboard and key tops remain coarse enough to judge their footprint.
box('keyboard_body', (-.015, .753, -.265), (.365, .025, .14), .29)
keys = []
for row in range(5):
    for col in range(17):
        if row == 0 and 4 <= col <= 8:
            continue
        keys.append(box('key', (-.183+col*.021, .770, -.317+row*.023), (.017, .008, .018), .48))
keys.append(box('space_bar', (-.057, .770, -.317), (.101, .008, .018), .48))
combine('keys_rgb', keys)
box('mousepad', (.45, .743, -.21), (.49, .006, .33), .32)
ellipsoid('mouse', (.335, .765, -.24), (.061, .038, .117), .68)
rod('mouse_split', (.335, .784, -.292), (.335, .784, -.233), .001, .30, 8)

# Controller mass and handles; generic, unbranded geometry.
ellipsoid('controller_body', (.66, .765, -.12), (.15, .035, .064), .33)
for i, x in enumerate([.608, .712]):
    ellipsoid('controller_grip_' + str(i), (x, .765, -.148), (.05, .045, .080), .33)
for i, x in enumerate([.637, .683]):
    rod('controller_stick_' + str(i), (x, .778, -.146), (x, .791, -.146), .009, .23)

# Front-left clamp with the arm reaching inward below the screen faces.
box('mic_clamp', (-1.08, .735, -.389), (.047, .070, .053), .32)
rod('boom_mount', (-1.08, .752, -.377), (-1.08, .802, -.377), .016, .32)
arm_points = [(-1.08, .790, -.377), (-1.08, .975, -.377), (-.34, .865, -.170)]
for i in range(2):
    a, b = Vector(arm_points[i]), Vector(arm_points[i+1])
    for j, offset in enumerate([-.010, .010]):
        rod('boom_%s_%s' % (i, j), a+Vector((offset,0,0)), b+Vector((offset,0,0)), .006, .29)
rod('mic_shock_mount', (-.34, .865, -.170), (-.275, .914, -.150), .029, .39)
rod('microphone', (-.35, .856, -.173), (-.25, .934, -.144), .023, .28, 24)

# Case broad glass side faces the chair; the narrower front faces inward.
box('case_base', (.70, .795, .105), (.43, .11, .21), .80)
box('case_top', (.70, 1.192, .105), (.43, .026, .21), .80)
box('case_back', (.70, 1.014, .212), (.43, .37, .012), .32)
box('case_end', (.909, 1.014, .105), (.012, .37, .21), .32)
glass_front = quad('case_side_panel', (.70, 1.015, -.004), .418, .34, .55)
glass_end = quad('case_front_panel', (.479, 1.015, .10), .208, .34, .55, 90)
combine('glass_case', [glass_front, glass_end])
for i, (x, z) in enumerate([(.48, -.006), (.915, -.006), (.48, .211)]):
    rod('case_panel_edge_' + str(i), (x, .846, z), (x, 1.18, z), .005, .39)
box('case_gpu', (.71, .93, .07), (.275, .047, .09), .43)
rod('case_pump', (.70, 1.065, .145), (.70, 1.065, .116), .036, .47, 24)
rod('case_fan', (.85, 1.087, .143), (.85, 1.087, .125), .048, .49, 24)
box('case_numeric_readout', (.76, 1.145, .112), (.023, .012, .005), .76)
box('wifi_antenna_base', (.86, 1.209, .16), (.05, .01, .04), .35)
rod('wifi_antenna', (.86, 1.21, .16), (.845, 1.36, .16), .006, .33)
rod('bottle_body', (.835, .746, -.185), (.835, 1.006, -.185), .046, .33, 24)
rod('bottle_lid', (.835, 1.006, -.185), (.835, 1.036, -.185), .036, .29, 24)

# Sill collectibles use generic forms. Clear-case edges show their silhouettes.
for i, x in enumerate([-1.17, -1.06, -.95]):
    box('collectible_base_' + str(i), (x, .977, .21), (.077, .014, .063), .46)
    ellipsoid('collectible_head_' + str(i), (x, 1.069, .21), (.036, .036, .034), .56)
    box('collectible_body_' + str(i), (x, 1.025, .21), (.030, .053, .026), .52)
    for j, dx in enumerate([-.04, .04]):
        rod('collectible_case_%s_%s' % (i,j), (x+dx, .97, .172), (x+dx, 1.115, .172), .002, .69, 8)
    box('collectible_case_top_' + str(i), (x, 1.115, .202), (.084, .004, .064), .69)
ellipsoid('sill_generic_figure', (-.835, 1.007, .20), (.056, .077, .047), .52)
rod('sill_small_bottle', (-.745, .965, .20), (-.745, 1.055, .20), .025, .41)
rod('diffuser_jar', (-.16, .965, .20), (-.16, 1.04, .20), .024, .58)
for i in range(6):
    dx = (i-2.5)*.007
    rod('diffuser_reed_' + str(i), (-.16+dx*.3, 1.01, .20), (-.16+dx*1.5, 1.235+(.014 if i%2 else 0), .20), .002, .33, 8)

# Dartboard on the rear wall right of the window; frames on the adjoining wall.
rod('dartboard_rim', (.66, 1.85, .314), (.66, 1.85, .288), .22, .34, 48)
rod('dartboard_face', (.66, 1.85, .287), (.66, 1.85, .284), .196, .60, 48)
rod('dartboard_center', (.66, 1.85, .283), (.66, 1.85, .280), .020, .32, 24)
frames = []
for row, h in enumerate([1.45, 1.81]):
    for col, z in enumerate([-.34, -.63, -.92]):
        frames.extend([
            box('frame_top', (.932, h+.147, z), (.026, .018, .23), .42),
            box('frame_bottom', (.932, h-.147, z), (.026, .018, .23), .42),
            box('frame_left', (.932, h, z-.115), (.026, .312, .018), .42),
            box('frame_right', (.932, h, z+.115), (.026, .312, .018), .42),
        ])
combine('frames_credentials', frames)

# Surroundings remain simple masses, only relevant to the wide shot.
box('couch_seat', (-1.86, .34, -.13), (.95, .22, .67), .48)
box('couch_back', (-1.86, .69, .14), (.95, .50, .15), .50)
rod('foam_roller', (-1.48, .46, -.01), (-1.53, .89, .075), .064, .60)

anchor('cam_wide', (-.72, 1.63, -2.85), (-.42, 1.12, .03), 40)
anchor('cam_main_monitor', (0, 1.105, -.645), (0, 1.105, -.023), 38, 'arc')
side_normal = Vector((math.sin(math.radians(20)), 0, -math.cos(math.radians(20))))
side_center = Vector((-.635, 1.15, .015))
anchor('cam_side_monitor', side_center+side_normal*.720, side_center, 38, 'arc')
anchor('cam_wall', (-.68, 1.40, -1.02), (.84, 1.70, -.10), 46, 'arc')
anchor('cam_desk_end', (-.42, .98, -.91), (.45, .97, .04), 54)
anchor('cam_window', (-.67, 1.94, -.35), (-.67, 1.64, .32), 94)

scene.render.engine = 'BLENDER_WORKBENCH'
scene.display.shading.light = 'STUDIO'
scene.display.shading.studiolight_rotate_z = .35
scene.display.shading.color_type = 'OBJECT'
scene.display.shading.show_shadows = False
scene.display.shading.show_cavity = True
scene.display.shading.cavity_type = 'BOTH'
scene.display.shading.curvature_ridge_factor = 1.15
scene.display.shading.curvature_valley_factor = 1.0
scene.display.shading.show_object_outline = False
scene.display.shading.background_type = 'WORLD'
scene.world.color = (.22, .22, .22)
scene.render.resolution_x = 1440
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.film_transparent = False
scene.camera = bpy.data.objects['review_cam_wide']
scene.view_settings.view_transform = 'Standard'
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.object.select_all(action='DESELECT')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / 'desk.blend'))
print('Saved block-out:', len(scene.objects), 'objects; no materials or textures.')
