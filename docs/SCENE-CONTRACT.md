# SCENE-CONTRACT.md

The interface between the 3D lane (Blender, Codex) and the web lane (React Three Fiber, Claude Code). The 3D lane produces what's described here; the web lane consumes it and nothing else. Changing this file requires a PR titled "Scene contract change" reviewed by the other lane.

## Units and orientation

- Meters. 1 Blender unit = 1 meter. The desk top is about 0.74 m above the floor.
- Blender's default orientation (Z up) is converted on export to glTF's Y up. Anchor transforms in the manifest are in glTF space, so the web lane never converts.
- World origin is at floor level, directly below the center of the main monitor's stand. In glTF space, the chair is at positive Z (toward the viewer); the back wall is at negative Z; the right wall and the PC are at positive X. With Y up, this keeps the room's left and right correct from the chair.
- In Blender, +X is right, +Y points toward the back wall, and +Z is up. Export converts Blender `(x, y, z)` to glTF `(x, z, -y)`. The web lane consumes the exported transforms without an additional axis flip.

## Camera anchors

Each is an empty in the Blender file. Its location is the camera position; its rotation is the camera orientation (looking down its local negative Z). Each anchor also carries a custom property `fov` in vertical degrees.

| Name | Station | Framing intent |
|---|---|---|
| `cam_wide` | 1, hero | Whole desk from just above the chair's eye line, both monitors, keyboard, the case on the right, window visible behind the side monitor. Content sits left of center on desktop, so bias the desk to the right third. |
| `cam_main_monitor` | 2, work | The Zowie fills roughly 70% of the viewport height, square-on, webcam visible at the top edge. |
| `cam_side_monitor` | 3, how I work | The 27" fills roughly 70% of viewport height, square-on to its angled face, with a sliver of window at its left edge. |
| `cam_wall` | 4, credentials | The corner above the case: dartboard on the rear-wall section immediately right of the window, with the framed credentials on the adjoining right wall; camera slightly below eye level looking up. |
| `cam_desk_end` | 5, off the clock | Low, close to desk level, looking along the desk toward the case: controller, mouse on the pad, bottle, case glass, sill figures in the background. |
| `cam_window` | 6, contact | The window fills the frame, shade up, dusk outside; the sill and its figures along the bottom edge. |

Every anchor must exist. The web lane's manifest check fails the build if one is missing or misnamed.

The 3D lane also sets a `path` custom property on each anchor: `direct` (straight interpolation is fine) or `arc` (the camera should swing out from the desk while traveling, used for the monitor switch and for main monitor to wall). The camera director decides durations; the anchors only describe geometry.

## Addressable surfaces

Meshes the web lane needs to find by name. Each is a single mesh with a single material.

| Name | What it is | What the web lane does with it |
|---|---|---|
| `screen_main` | The Zowie's display face, a flat quad, UVs 0 to 1 across the visible area | Maps the main-monitor HTML region onto it; emissive material driven by the site |
| `screen_side` | The 27"'s display face, same rules | Maps the side-monitor HTML region onto it |
| `glass_case` | The H510 Elite's front and side tempered glass | Emissive RGB glow tint, subtle |
| `glass_window` | The window pane | Sunset gradient and time-of-day glow |
| `strip_window_left`, `strip_window_right`, `strip_wall` | The three LED strips | Emissive, color set by the site's palette |
| `keys_rgb` | The keyboard's key-cap tops as one mesh | Emissive pink and blue |
| `frames_credentials` | The framed area on the right wall (empty frames; contents are HTML) | Positions the credentials HTML region |

Screen quads must be planar, rectangular, and have their normal facing the chair. Their world-space corners are also written to the manifest so the web lane can project HTML onto them without inspecting geometry.

## Manifest

The export script writes `public/scene/manifest.json` next to the GLB. Shape:

```json
{
  "version": 1,
  "glb": "desk.glb",
  "exportedAt": "2026-09-20T02:14:00Z",
  "blendHash": "…",
  "anchors": {
    "cam_wide": { "position": [x, y, z], "quaternion": [x, y, z, w], "fov": 38, "path": "direct" }
  },
  "surfaces": {
    "screen_main": { "corners": [[x,y,z],[x,y,z],[x,y,z],[x,y,z]], "width": 0.53, "height": 0.30 }
  },
  "tiers": {
    "full":    { "glb": "desk.glb",      "textures": "ktx2-2k" },
    "reduced": { "glb": "desk.glb",      "textures": "ktx2-1k" },
    "minimal": { "glb": "desk-lite.glb", "textures": "ktx2-512" }
  },
  "budgets": { "glbBytes": 4194304, "textureBytes": 6291456 }
}
```

`blendHash` is a hash of the `.blend` file at export time. The manifest check warns if the committed `.blend` doesn't match, which catches a GLB exported from uncommitted work.

## Export requirements

- glTF 2.0 binary (`.glb`), geometry compressed (Draco or meshopt, one or the other for the whole file), textures as KTX2.
- Lighting baked to textures for the room, desk, and objects. Only the emissive surfaces above are lit at runtime.
- No cameras or lights exported into the GLB; anchors are empties, lights are the web lane's concern.
- Three tiers as listed in the manifest. `desk-lite.glb` drops the sill figures, the reed diffuser, the router shelf, the couch, and cable detail.
- Custom properties on empties are exported (enable "Custom Properties" in the glTF exporter).

## Stylization rules

- Proportions and placement follow the room layout section of the PRD and the reference photos.
- Screen contents are blank emissive surfaces; the site draws on them.
- Collectible figures are generic shapes in clear cases. No licensed characters.
- No brand marks on the mouse, pad, GPU, or bottle. The NZXT case shape and the Kraken pump cap are fine as shapes.
- Credentials frames on the right wall are an addition to the real room. Six frames, two rows, near the dartboard, sized for the HTML that will sit on them.
- The window shows dusk: teal to coral gradient, no visible landscape detail required beyond a soft horizon.

## Change process

If the web lane needs a new anchor or surface, it opens an issue describing the framing or surface and why. The 3D lane adds it, updates this file and the manifest in the same PR, and the web lane reviews. If the 3D lane wants to rename or move something the web lane reads, same process in reverse.
