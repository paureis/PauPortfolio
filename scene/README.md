# Desk scene

`desk.blend` is the source of truth. It is currently a grayscale block-out,
awaiting Pau's review of proportions, placement, and camera framing. It has no
authored materials, textures, lighting bakes, or exported GLB yet.

Issue 3's agreed deliverables are this source, the compressed GLB, the generated
manifest, and the manifest check in CI. Browser loading and fade-in belong to
Claude Code's Issue 4 and are excluded from this lane's PR.

## Review checkpoint

The initial build follows the coordinate signs in `docs/SCENE-CONTRACT.md`:
glTF Y up, chair at negative Z, back wall at positive Z, and case/right wall at
positive X. This creates a left/right reversal from the chair's view in a
right-handed camera system. The renders expose this unresolved contract issue;
they are not approved framing or export-ready assets.

The proposed correction is chair at positive Z and back wall at negative Z,
keeping the right wall at positive X. Pau's decision is pending. The shared
contract requires its own "Scene contract change" PR reviewed by the web lane.
No contract edits have been made at this checkpoint.

The desk is estimated at 2.10 m wide and 0.64 m deep; its top is 0.74 m above
the floor. Monitor faces are 0.534 by 0.300 m (main) and 0.598 by 0.336 m (side).
The remaining dimensions are photo-based estimates, not measured furniture.

All six named anchors exist with `fov` and `path` custom properties. All nine
named addressable surfaces exist. Material slots are deferred until after
framing review. The two screen faces are planar quads with 0-to-1 UVs.

`review/` contains the six 1440-by-900 Workbench renders. Shades of gray are
viewport object colors used for distinguishing geometry, not final materials.
Case glass is temporarily hidden during rendering to expose its interior; the
actual addressable mesh remains in the source. Screens and the window are blank.

- `wide.png`: whole desk, both monitors, case, and window; couch is a coarse mass.
- `main_monitor.png`: square-on main display, about 70% of frame height, webcam above.
- `side_monitor.png`: square-on side display, about 70%; boom arm below the display.
- `wall.png`: six empty frames in two rows with the dartboard beside them.
- `desk_end.png`: case, bottle, controller, mouse/pad, and keyboard. The monitors
  obscure the sill figures from this low angle; they are visible in other views.
- `window.png`: elevated window view to see the sill over the monitors; camera
  pitch and the amount of monitor foreground remain review decisions.

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
