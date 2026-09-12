# Desk scene

`desk.blend` is the committed source of truth for the Issue 3 block-out export.
Pau approved the geometry and authorized export after Codex inspected the final
two anchor corrections. Neutral gray material slots make the block-out usable
in glTF. Final surface materials, lighting bakes, and KTX2 images are deferred;
this is not the finished dusk scene.

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

The coordinate correction is approved by Pau and documented in PR #15,
which must merge before this export PR is merged. This branch does not edit the shared
contract. The corrected convention is used by the source, GLBs, and manifest.

The Lagkapten desk uses Pau's measurements: 78¾ by 23⅝ inches, with a top
28¾ inches above the floor (2.00025 by 0.600075 by 0.73025 m). It has four
outer cylindrical legs and a fifth central support, with no drawers.
Monitor faces are 0.534 by 0.300 m (main) and 0.598 by 0.336 m (side).
Other dimensions remain visual estimates from the photos and room video.

The video revision brings the monitors closer together, raises the mic arm
from the front-left clamp, and adds hanging IEMs. Pau's follow-up review squares
the PC to the back wall, with its glass side chairward, the bottle between the
case and right wall, and the controller in front of the case. The case now sits
10.5 cm farther back, leaving a 3 cm gap behind the mousepad. The bottle is
aligned with the case's depth center, fully beside its footprint. Sill objects remain
generic shapes. The couch is a coarse mass on the left. The video and its
extracted reference frames remain ignored modeling inputs.

All six named anchors exist with `fov` and `path` custom properties. All nine
named addressable surfaces exist, each with one neutral material slot.
The two screen faces are planar quads with 0-to-1 UVs.

`review/` contains six anchor renders plus an orthographic top-down layout view,
all 1440 by 900. The latest review refreshes wide, window, desk end, and top-down.
Side monitor, main monitor, and wall retain the preceding review images and their
approved camera transforms. Shades of gray are
viewport object colors used for distinguishing geometry, not final materials.
Workbench cast shadows are disabled so they do not obscure the block-out.
Case glass is temporarily hidden during rendering to expose its interior; the
actual addressable mesh remains in the source. Screens and the window are blank.

- `wide.png`: camera 1.35 m high, offset 0.60 m left of the chair center,
  both screen faces visible. Window behind the side display; couch cropped
  at lower left. The mic still overlaps the main display's upper-left margin.
- `main_monitor.png`: square-on main display, about 70% of frame height, webcam above.
- `side_monitor.png`: camera at screen-center height and perpendicular to the
  screen, which fills 70% of image height. Camera sits 0.20 m from the face,
  between screen and arm, with a 100.39-degree vertical FOV to preserve coverage.
  The mic is outside the frame. The arriving camera path will need to clear it.
- `wall.png`: six empty frames in two rows with the dartboard beside them.
- `desk_end.png`: case, bottle, controller, mouse/pad, and keyboard. The monitors
  obscure the sill figures from this low angle; they are visible in other views.
- `window.png`: centered window with both side edges and margins, sill in the
  bottom fifth. Elevated long-lens position `(-0.57, 14.0, 3.0)`, vertical FOV
  4.2 degrees; orientation is recorded in the manifest. A small monitor corner
  remains at the bottom edge. The web lane must consider the long camera travel
  and FOV change when implementing transitions. No objects are hidden by station.
- `top_down.png`: desk footprints, monitor angles, PC orientation, and mic clamp.
- `export_wide.png`: the decoded full GLB rendered in a temporary Blender scene;
  uses material colors rather than the source's viewport object colors.

All seven images were rendered and visually inspected in the video revision;
the four requested follow-up views were rendered and inspected again.
Live Blender assertions checked the required names, measured tabletop dimensions,
five legs, and both planar screen quads with UV layers. These checks are not the
export manifest validator, which remains part of the post-approval work.
Follow-up assertions also verify the case is square to the world axes and the
side anchor is level, perpendicular, and gives exactly 70% screen height.
The latest checks confirm the 3 cm pad clearance, case containment on the desktop,
and bottle footprint fully beside the case. The corresponding renders were
visually inspected. The source and decoded GLB screen corners agree within
0.004 mm after Draco compression.

## Export and CI

In the single live Blender session, after saving and committing `desk.blend`:

```python
import runpy
runpy.run_path(r'C:\PauPortfolio-codex\scene\export.py', run_name='__main__')
```

The exporter refuses a source that differs from `HEAD:scene/desk.blend`. It
reloads that source, converts curves in the export copy, generates compressed
GLBs and the manifest, and reopens the saved source without saving temporary
changes. Camera pose empties preserve local -Z forward and +Y up in glTF.
`exportedAt` is the source commit time, so repeated exports are deterministic.
Use the script path in your own worktree if it differs from the example.

| Tier | Geometry | Texture slot | Current bytes |
|---|---|---|---|
| Full | `desk.glb` | `ktx2-2k` | 211,484 |
| Reduced | `desk.glb` (shared) | `ktx2-1k` | 211,484 |
| Minimal | `desk-lite.glb` | `ktx2-512` | 153,496 |

There are zero textures at this block-out milestone. Texture directories contain
an explicit generated note; they do not pretend to contain final KTX2 bakes.
Minimal removes sill collectibles, diffuser, couch, foam roller, and IEM cable
detail. All tiers retain the six anchors and nine addressable surfaces.

`npm run check:manifest` is mandatory through `npm run check` in build CI. It
fails on missing manifests/names, stale source or artifact hashes, mismatched
GLB anchors/screen geometry, unsafe paths, absent tiers, missing compression,
invalid buffers, exported cameras/lights, or budget violations. The checker is
explicitly scoped to the block-out stage; the final bake milestone must extend
its texture validation. `npm run test:manifest` exercises real export fixtures
with deliberately broken names, transforms, assets, and paths.

Verified locally: `npm run check` (39 manifest tests and 43 existing tests),
`npm run build`, byte-identical repeated exports, and a successful GLB re-import
and render using `verify_export.py`. The build needed network access for the
existing Google Fonts. No browser scene-loading, fade-in, Lighthouse, or final
lighting claim is made; the web app does not consume this GLB until Issue 4.

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
