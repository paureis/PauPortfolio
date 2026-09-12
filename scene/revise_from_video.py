"""One-time video layout revision. desk.blend remains the editable source.

Run in the live Blender session on the pre-video block-out. Coordinates below
are glTF (right, up, toward chair), in meters. No materials are authored.
"""
import math
from pathlib import Path
import bpy
from mathutils import Vector, Matrix

ROOT = Path(__file__).resolve().parent
if Path(bpy.data.filepath).resolve() != (ROOT / 'desk.blend').resolve():
    raise RuntimeError('Open scene/desk.blend first')
if bpy.context.scene.get('video_layout_revision'):
    raise RuntimeError('Revision already applied; edit the saved source instead')
# Reuse only construction helpers, never the startup-scene recipe.
exec((ROOT / 'blockout.py').read_text().split('if bpy.data.filepath or')[0])
def xyz(point):
    x, y, z = point
    return Vector((x, -z, y))

def remove(prefixes):
    for obj in list(bpy.data.objects):
        if any(obj.name.startswith(p) for p in prefixes):
            bpy.data.objects.remove(obj, do_unlink=True)

def shift(obj, delta):
    obj.matrix_world = Matrix.Translation(xyz(delta)) @ obj.matrix_world

def cable(name, points, radius=.0015, tone=.70):
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions = '3D'
    curve.bevel_depth = radius
    curve.bevel_resolution = 2
    spline = curve.splines.new('POLY')
    spline.points.add(len(points)-1)
    for dest, point in zip(spline.points, points):
        dest.co = (*xyz(point), 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    return finish(obj, name, tone)

def aim(name, position, target, fov):
    obj = bpy.data.objects[name]
    obj.location = xyz(position)
    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = (xyz(target)-obj.location).to_track_quat('-Z', 'Y')
    obj['fov'] = fov

top = .73025
remove(['desk_', 'monitor_', 'screen_', 'webcam', 'mic_', 'microphone', 'boom_',
        'case_', 'glass_case', 'wifi_', 'bottle_', 'controller_'])
box('desk_top', (.08, top-.017, .10), (2.00025, .034, .600075), .26)
for i, (x,z) in enumerate([(-.83,.31),(-.83,-.10),(.99,.31),(.99,-.10),(.08,0)]):
    rod('desk_leg_'+str(i), (x,.015,z), (x,top-.034,z), .025, .24)

for kind, center, width, height, yaw in [
    ('main',(0,.985,0),.534,.300,0),
    ('side',(-.555,1.035,.03),.598,.336,-25),
]:
    x,y,z = center
    normal = Vector((-math.sin(math.radians(yaw)),0,math.cos(math.radians(yaw))))
    face = Vector(center)+normal*.023
    box('monitor_'+kind+'_body', center, (width+.024,height+.032,.044),.22,yaw)
    quad('screen_'+kind, face,width,height,.61,yaw)
    rod('monitor_'+kind+'_stem',(x,top+.014,z-.025),(x,y-.035,z-.025),.021,.28)
    if kind == 'main':
        box('monitor_main_base',(0,top+.011,0),(.225,.022,.18),.31)
        box('webcam',(x,y+height/2+.04,z),(.087,.035,.035),.30)
        rod('webcam_lens',(x,y+height/2+.04,z+.018),(x,y+height/2+.04,z+.022),.009,.14)
        for i, xx in enumerate([-.075,.075]):
            rod('monitor_base_accessory_'+str(i),(xx,top+.023,.04),(xx,top+.03,.04),.023,.4)
    else:
        rod('monitor_side_base',(x,top+.002,z),(x,top+.018,z),.122,.31,32)
    aim('cam_'+kind+'_monitor', Vector(center)+normal*(.645 if kind=='main' else .720),face,38)

for name in ['keyboard_body','keys_rgb','mouse','mouse_split','mousepad']:
    shift(bpy.data.objects[name],(-.025,-.00975,0))

box('mic_clamp',(-.83,top-.005,.389),(.047,.07,.053),.32)
rod('boom_mount',(-.83,top+.01,.377),(-.83,top+.065,.377),.016,.32)
points=[(-.83,top+.05,.377),(-.815,1.19,.36),(-.31,1.075,.30)]
for i in range(2):
    for j, offset in enumerate([-.012,.012]):
        a,b=xyz(points[i]),xyz(points[i+1])
        a.y+=offset; b.y+=offset
        obj=box('boom_%s_%s'%(i,j),(0,0,0),(.012,(b-a).length,.008),.29)
        obj.location=(a+b)/2
        obj.rotation_mode='QUATERNION'
        obj.rotation_quaternion=(b-a).to_track_quat('Z','Y')
rod('microphone',(-.33,1.035,.295),(-.19,1.15,.26),.029,.28,24)
axis=(xyz((-.19,1.15,.26))-xyz((-.33,1.035,.295))).normalized()
u=axis.cross(Vector((0,0,1))).normalized(); v=axis.cross(u)
for j, fraction in enumerate([.18,.43]):
    center=xyz((-.33,1.035,.295))+axis*(.184*fraction)
    ring=[]
    for i in range(33):
        p=center+.043*(u*math.cos(i*math.tau/32)+v*math.sin(i*math.tau/32))
        ring.append((p.x,p.z,-p.y))
    cable('mic_shock_ring_'+str(j),ring,.003,.40)
for i, (x,h) in enumerate([(-.33,.83),(-.30,.81)]):
    cable('iem_cable_'+str(i),[(-.40,1.105,.30),(-.385,1.12,.32),(-.37,1.04,.335),(x,h+.025,.35),(x+.014,h,.35)])
    ellipsoid('iem_earpiece_'+str(i),(x+.014,h,.35),(.016,.011,.012),.76)
cable('iem_lead',[(-.40,1.105,.30),(-.415,.96,.34),(-.42,.74,.40),(-.43,.52,.43)],.0013)

# PC local broad side faces the chair, narrow two-fan front is at right.
before=set(bpy.data.objects)
box('case_base',(0,top+.055,0),(.43,.11,.21),.80)
box('case_top',(0,top+.447,0),(.43,.026,.21),.80)
box('case_back',(0,top+.274,-.105),(.43,.34,.012),.32)
box('case_end',(-.209,top+.274,0),(.012,.34,.21),.32)
side=quad('case_side_panel',(0,top+.274,.109),.418,.334,.55)
end=quad('case_front_panel',(.219,top+.274,0),.208,.334,.55,-90)
combine('glass_case',[side,end])
for i,(x,z) in enumerate([(-.215,.109),(.219,.109),(.219,-.105)]):
    rod('case_panel_edge_'+str(i),(x,top+.11,z),(x,top+.434,z),.005,.39)
box('case_gpu',(-.025,top+.19,0),(.275,.047,.09),.43)
rod('case_pump',(-.05,top+.32,-.08),(-.05,top+.32,-.05),.036,.47,24)
rod('case_fan',(-.145,top+.35,-.09),(-.145,top+.35,-.07),.048,.49,24)
for i,h in enumerate([.21,.345]):
    rod('case_front_fan_'+str(i),(.19,top+h,0),(.20,top+h,0),.064,.51,32)
    rod('case_front_hub_'+str(i),(.20,top+h,0),(.205,top+h,0),.024,.30,24)
box('wifi_antenna_base',(-.16,top+.464,-.065),(.05,.01,.04),.35)
rod('wifi_antenna',(-.16,top+.465,-.065),(-.175,top+.615,-.065),.006,.33)
transform=Matrix.Translation(xyz((.81,0,.015))) @ Matrix.Rotation(math.radians(-35),4,'Z')
for obj in set(bpy.data.objects)-before:
    obj.matrix_world=transform @ obj.matrix_world
rod('bottle_body',(.70,top+.006,.30),(.70,top+.266,.30),.046,.33,24)
rod('bottle_lid',(.70,top+.266,.30),(.70,top+.296,.30),.036,.29,24)
ellipsoid('controller_body',(.94,top+.025,.31),(.15,.035,.064),.33)
for i,x in enumerate([.888,.992]):
    ellipsoid('controller_grip_'+str(i),(x,top+.025,.338),(.05,.045,.080),.33)
for i,x in enumerate([.917,.963]):
    rod('controller_stick_'+str(i),(x,top+.038,.336),(x,top+.051,.336),.009,.23)

# Shift the existing opening and its sill contents together; extend right wall.
for obj in list(bpy.data.objects):
    if obj.name.startswith(('window_','glass_window','strip_window','roller_shade','collectible_','sill_','diffuser_')):
        shift(obj,(.10,-.047,0))
shift(bpy.data.objects['frames_credentials'],(.14,0,0))
shift(bpy.data.objects['wall_right'],(.14,0,0))
shift(bpy.data.objects['baseboard_right'],(.14,0,0))
for name in ['wall_back_left','wall_back_right']:
    shift(bpy.data.objects[name],(.10,0,0))
for name in ['dartboard_rim','dartboard_face','dartboard_center']:
    shift(bpy.data.objects[name],(-.08,-.05,0))

aim('cam_wide',(.10,1.55,2.90),(.10,1.06,0),40)
aim('cam_desk_end',(-.35,1.17,.95),(.65,.99,.03),54)
aim('cam_window',(-.57,1.88,.35),(-.57,1.54,-.32),94)
camera_data=bpy.data.cameras.new('review_top_down')
camera_data.type='ORTHO'; camera_data.ortho_scale=2.65
camera=bpy.data.objects.new('review_top_down',camera_data)
bpy.context.collection.objects.link(camera)
camera.location=xyz((.08,3.5,.10))
camera.rotation_euler=(0,0,0)
scene=bpy.context.scene
scene.camera=bpy.data.objects['review_cam_wide']
scene['video_layout_revision']=1
scene['dimensions_note']='Measured Lagkapten: 2.00025 x 0.600075 m; top 0.73025 m. Five legs. Other dimensions estimated from video.'
scene['stage']='Video-based block-out awaiting layout review; no materials or bakes'
scene['revision_note']='Video: monitor spacing, tall front-left mic, IEMs, right-facing PC front, bottle left of controller, fifth leg.'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'desk.blend'))
print('Saved video layout revision')
