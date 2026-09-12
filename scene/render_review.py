"""Render the saved source's six camera anchors, without authoring materials.

Run in the live Blender session. Render visibility and filepath changes below
are restored, leaving desk.blend unchanged.
"""

from pathlib import Path
import math
import bpy


STATIONS = ('wide', 'main_monitor', 'side_monitor', 'wall', 'desk_end', 'window')


def render_station(station):
    if station not in STATIONS:
        raise ValueError('Unknown station: ' + station)
    scene = bpy.context.scene
    directory = Path(bpy.data.filepath).parent / 'review'
    directory.mkdir(exist_ok=True)
    previous_camera, previous_path = scene.camera, scene.render.filepath
    glass = bpy.data.objects['glass_case']
    previous_visibility = glass.hide_render
    camera = bpy.data.objects['review_cam_' + station]
    previous_lens = camera.data.lens
    try:
        # Workbench has no authored glass material. Hide only these two panes
        # for review, leaving their edge geometry and case internals visible.
        glass.hide_render = True
        scene.camera = camera
        fov = bpy.data.objects['cam_' + station]['fov']
        camera.data.lens = camera.data.sensor_height / (2 * math.tan(math.radians(fov / 2)))
        scene.render.filepath = str(directory / (station + '.png'))
        bpy.ops.render.render(write_still=True)
        print('Rendered', station, 'to', scene.render.filepath)
    finally:
        scene.camera = previous_camera
        scene.render.filepath = previous_path
        glass.hide_render = previous_visibility
        camera.data.lens = previous_lens


def render_top_down():
    scene = bpy.context.scene
    previous_camera, previous_path = scene.camera, scene.render.filepath
    glass = bpy.data.objects['glass_case']
    previous_visibility = glass.hide_render
    try:
        scene.camera = bpy.data.objects['review_top_down']
        glass.hide_render = True
        scene.render.filepath = str(Path(bpy.data.filepath).parent / 'review' / 'top_down.png')
        bpy.ops.render.render(write_still=True)
    finally:
        scene.camera, scene.render.filepath = previous_camera, previous_path
        glass.hide_render = previous_visibility


if __name__ == '__main__':
    for station in STATIONS:
        render_station(station)
    if bpy.data.objects.get('review_top_down'):
        render_top_down()
