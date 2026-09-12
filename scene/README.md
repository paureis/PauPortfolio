# Desk scene

`desk.blend` is the source of truth. It is currently a grayscale block-out,
awaiting Pau's review of proportions, placement, and camera framing. It has no
authored materials, textures, lighting bakes, or exported GLB yet.

Issue 3's agreed deliverables are this source, the compressed GLB, the generated
manifest, and the manifest check in CI. Browser loading and fade-in belong to
Claude Code's Issue 4 and are excluded from this lane's PR.

## Review checkpoint

Pau approved correcting the glTF convention to chair at positive Z, back wall
at negative Z, and right wall at positive X, with Y up. The saved scene and all
six camera anchors now use that convention. Blender uses +X right, +Y back,
and +Z up; export converts `(x, y, z)` to glTF `(x, z, -y)`.

The revised block-out also follows Pau's placement corrections: the mic clamp
is at the front-left end of the desk with the arm reaching inward, and the
dartboard is on the rear-wall section immediately right of the window. Six
credential frames remain on the adjoining right wall. These changes are
documented in a separate "Scene contract change" PR for Claude's review.

The coordinate correction is approved; the revised framing is still awaiting
Pau's review. No export or materials work has started.

The Lagkapten desk uses Pau's measurements: 78¾ by 23⅝ inches, with a top
28¾ inches above the floor (2.00025 by 0.600075 by 0.73025 m). It has four
outer cylindrical legs and a fifth central support, with no drawers.
Monitor faces are 0.534 by 0.300 m (main) and 0.598 by 0.336 m (side).
Other dimensions remain visual estimates from the photos and room video.

The video revision brings the monitors closer together, raises the mic arm
from the front-left clamp, and adds hanging IEMs. Pau's follow-up review squares
the PC to the back wall, with its glass side chairward, the bottle between the
case and right wall, and the controller in front of the case. Sill objects remain
generic shapes. The couch is a coarse mass on the left. The video and its
extracted reference frames remain ignored modeling inputs.

All six named anchors exist with `fov` and `path` custom properties. All nine
named addressable surfaces exist. Material slots are deferred until after
framing review. The two screen faces are planar quads with 0-to-1 UVs.

`review/` contains six anchor renders plus an orthographic top-down layout view,
all 1440 by 900. The latest review refreshes wide, side monitor, window, desk end,
and top-down. Main monitor and wall retain the preceding review images and their
approved camera transforms. Shades of gray are
viewport object colors used for distinguishing geometry, not final materials.
Workbench cast shadows are disabled so they do not obscure the block-out.
Case glass is temporarily hidden during rendering to expose its interior; the
actual addressable mesh remains in the source. Screens and the window are blank.

- `wide.png`: desk biased right, with the window and back wall at the left;
  the couch is cropped to the lower-left corner.
- `main_monitor.png`: square-on main display, about 70% of frame height, webcam above.
- `side_monitor.png`: camera at screen-center height and perpendicular to the
  screen, which fills 70% of image height. Camera sits 0.20 m from the face,
  between screen and arm, with a 100.39-degree vertical FOV to preserve coverage.
  The mic is outside the frame. The arriving camera path will need to clear it.
- `wall.png`: six empty frames in two rows with the dartboard beside them.
- `desk_end.png`: case, bottle, controller, mouse/pad, and keyboard. The monitors
  obscure the sill figures from this low angle; they are visible in other views.
- `window.png`: requested 35-degree trial, camera 1.32 m high, about 6 degrees
  upward pitch. Vertical convergence is mild, but the monitors obscure the sill.
  This does not yet meet the requested clear-sill/no-monitor composition.
- `top_down.png`: desk footprints, monitor angles, PC orientation, and mic clamp.
- `window_clear_sill_option.png`: unsaved alternative anchor at glTF
  `(-0.57, 1.45, 0.05)`, looking level toward the rear wall, vertical FOV 134.
  This tests clearing the monitors while retaining vertical window edges;
  nearby sill objects have exaggerated perspective and a monitor edge remains
  at lower right, so this alternative also fails the clear-sill requirement.
  It is not the saved
  `cam_window` and requires Pau's decision to relax the requested lens/height.

All seven images were rendered and visually inspected in the video revision;
the four requested follow-up views were rendered and inspected again.
Live Blender assertions checked the required names, measured tabletop dimensions,
five legs, and both planar screen quads with UV layers. These checks are not the
export manifest validator, which remains part of the post-approval work.
Follow-up assertions also verify the case is square to the world axes and the
side anchor is level, perpendicular, and gives exactly 70% screen height.

## Working in Blender

Open `desk.blend` in the single live Blender session. Edit and save that file.
The `review_cam_*` cameras are children of the corresponding `cam_*` empties;
their local transforms are identity, so review views follow the anchor geometry.
FOV is vertical, in degrees.

To render all six views in the live session:

```python
import runpy
from pathlib import Path
import bpy

runpy.run_path(str(Path(bpy.data.filepath).with_name('render_review.py')), run_name='__main__')
```

`blockout.py` records the initial seed geometry and refuses to run over an
existing saved scene. It is not an export source and does not reproduce later
edits to `desk.blend`. The export pipeline will read the committed `.blend`.
`revise_from_video.py` records the one-time video revision and refuses to run
twice. Subsequent review camera adjustments are saved in `desk.blend`.
