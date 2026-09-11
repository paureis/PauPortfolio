# ISSUES.md

Twelve vertical slices from `docs/PRD.md`. Each crosses every layer it touches and can be verified on its own. Lanes follow AGENTS.md. AFK means an agent can complete it without a human decision; HITL means Pau reviews something by eye before it's done. Section numbers match the GitHub issue numbers in this repository.

Dependency order:

```
1 ──┬── 2 ──── 4 ──┐
    │              ├── 5 ──┬── 9 ──┐
    └── 3 ──┬── 6 ─┘       │       ├── 12
            └── 7 ──── 8 ──┘       │
                           10 ─────┘
                           11 ─────┘
```

---

## 1. Workspace and deploy pipeline
**Lane:** Claude Code
**Type:** HITL (Impeccable init questions, Azure token)
**Blocked by:** nothing

### Description
The repository goes from empty to a deployable Next.js static-export app with a placeholder page, Impeccable initialized, CI building on every push, pull-request preview deployments on Azure Static Web Apps, and the folder layout from AGENTS.md in place. The placeholder page already shows the name and positioning line as real HTML so the site is never blank.

### Acceptance criteria
- [ ] `npm run build` produces a static export with no server-only features.
- [ ] `PRODUCT.md` and `DESIGN.md` exist, written through `/impeccable init` with answers taken from the PRD.
- [ ] Pushing to `main` deploys to the Static Web App in under two minutes with no manual steps.
- [ ] Opening a PR produces a preview URL in the PR.
- [ ] The Impeccable design hook runs on UI edits in both agents' installs.
- [ ] `reference/` is gitignored and absent from the remote.
- [ ] A test runner exists and runs an example test in CI.

---

## 2. Content model, validation, and the document fallback
**Lane:** Claude Code
**Type:** AFK
**Blocked by:** 1

### Description
All site content lives in one typed source: profile, positioning and tail line, four work entries (Talent Scout Pro, Forward Thinkers Consulting, NEO Consulting Group, Cyberse), the experience timeline, how-I-work (lifecycle, practice, curated repos), credentials with earned or in-progress status, off the clock, contact. A validation step fails the build on invalid content. The whole site renders as a plain, well-typeset, fully readable page from this source, in station order, with a still image placeholder where the scene will go. This page is the fallback for every visitor without WebGL and is also a shippable portfolio on its own.

### Acceptance criteria
- [ ] Every content item from the PRD's story arc appears on the page, in order, as real text.
- [ ] Talent Scout Pro and Forward Thinkers Consulting are separate entries and contain nothing on the PRD's out-of-scope list.
- [ ] AZ-104 shows as in progress; all other credentials show earned dates and verification links.
- [ ] Build fails for: earned credential without date, in-progress credential with date, work entry without outcomes, credential without verification link, missing contact field. Each has a test fixture.
- [ ] A rendered-page test asserts every content item is present in order.
- [ ] No phone number anywhere in the output.
- [ ] Impeccable detector: zero findings. Lighthouse mobile at or above 95 on this page (no scene yet).
- [ ] Resume PDF downloads from the contact section.

---

## 3. Scene block-out, export pipeline, and manifest check
**Lane:** Codex
**Type:** HITL (Pau reviews renders against the photos)
**Blocked by:** 1

### Description
The room is blocked out in Blender from the PRD's room layout and the reference photos: desk, both monitors, boom arm and mic, webcam, keyboard, pad and mouse, controller, case, bottle, window and sill with generic figures, dartboard, LED strips, credential frames. Every camera anchor and addressable surface from the scene contract exists and is named correctly. An export script produces the compressed GLB and the manifest. A build check in CI fails if any contract name is missing. The web app loads the GLB behind the fallback page at the wide station and fades it in.

### Acceptance criteria
- [ ] Renders from all six anchors are reviewed by Pau and match the photos in proportion and placement.
- [ ] All six anchors and all addressable surfaces exist with exact contract names and required custom properties.
- [ ] The export script is repeatable from the committed `.blend` and writes `manifest.json` with anchors, surface corners, tiers, and `blendHash`.
- [ ] The manifest check fails CI when a name is removed, with a message naming it.
- [ ] Full-tier GLB under 4 MB; a placeholder lite tier exists even if identical.
- [ ] The wide shot renders in the browser over the fallback page, fading in after HTML paint, with no layout shift.

---

## 4. Camera director with scroll-driven stations
**Lane:** Claude Code
**Type:** AFK
**Blocked by:** 2 (can start against a placeholder manifest before 3 merges)

### Description
The camera director state machine drives the camera through all six stations from scroll position, reading positions and orientations from the manifest. Transitions are interruptible and reversible. Keyboard navigation moves between stations. Reduced motion swaps flights for crossfades. Persistent minimal navigation lists the sections and jumps to them. Content for each station is positioned in its document location; the monitor-projection comes later.

### Acceptance criteria
- [ ] Unit tests cover: forward and backward through every station; keyboard order; interrupting an in-flight move retargets it; reduced motion emits crossfades; invalid transitions are rejected.
- [ ] Scrolling the page visits every station in order and back, with no jitter under fast scrolling.
- [ ] Section navigation jumps directly to any station.
- [ ] A visible focus indicator exists on every interactive element; the whole page is operable by keyboard.
- [ ] No camera position or orientation is hardcoded; deleting the manifest fails the build, not the runtime.

---

## 5. Monitor surfaces and the monitor switch
**Lane:** Claude Code
**Type:** HITL (the feel of the switch is judged by eye)
**Blocked by:** 3, 4

### Description
At the main-monitor station, the work content is projected onto the Zowie's screen surface as real DOM and shows the four work entries as expandable windows. At the side-monitor station, the how-I-work content sits on the 27". Clicking the other monitor, pressing Tab, or choosing the section swings the camera across the desk along an arc. The arriving screen already shows its content when the camera lands. Away from a monitor station, each region returns to its document position so reading order is unchanged.

### Acceptance criteria
- [ ] Text on both screens is selectable and focusable, and screen readers encounter it in document order.
- [ ] Work entries expand in place; Talent Scout Pro first.
- [ ] Tab, click on the other screen, and the section control all trigger the switch; the switch is interruptible.
- [ ] No blank screen is visible at any point during the switch.
- [ ] Rotating or resizing reframes both screens without breaking projection.
- [ ] Pau signs off on the switch's timing and path.

---

## 6. Lighting, bakes, window sunset, emissives, and quality tiers
**Lane:** Codex
**Type:** HITL (render review)
**Blocked by:** 3

### Description
The room gets its final materials and baked lighting: warm lamp and screen light, sunset through the window, RGB glow in the case and keyboard, LED strips. Three quality tiers export per the contract, the lite tier dropping detail objects. The web renderer picks a tier from device capability. Only the contract's emissive surfaces are lit at runtime.

### Acceptance criteria
- [ ] Renders from all six anchors approved by Pau against the PRD's visual system (subtle Miami Vice, no neon theme).
- [ ] Full, reduced, and minimal tiers export within budget; combined textures under 6 MB.
- [ ] A mid-range phone runs the minimal tier at a steady frame rate without thermal stutter for a full scroll-through.
- [ ] Emissive surfaces respond to palette values set by the web lane.

---

## 7. Nightly GitHub activity data
**Lane:** Codex
**Type:** AFK
**Blocked by:** 1

### Description
A scheduled workflow fetches Pau's contribution calendar and a few recent-activity numbers from the GitHub GraphQL API, normalizes them into a JSON file in the public data folder, commits it, and triggers a rebuild. A committed fixture ships first so the web lane can build against it before the workflow runs.

### Acceptance criteria
- [ ] Workflow runs nightly and on manual dispatch, commits only when data changed.
- [ ] Normalizer tests: recorded response produces expected shape; empty calendar handled; partial or errored response keeps the previous file rather than writing an empty one.
- [ ] Works with the default Actions token, or documents the fine-grained token fallback.
- [ ] A fixture JSON is committed.

---

## 8. GitHub activity and curated repos on the side monitor
**Lane:** Claude Code
**Type:** AFK
**Blocked by:** 5, 7

### Description
The contribution calendar renders in the site's palette and type on the side monitor beneath the how-I-work content, with three or four curated repositories from the content model linked below it. A stale or missing data file degrades to hiding the calendar, never to an error.

### Acceptance criteria
- [ ] Calendar renders from the fixture and from live data with identical layout.
- [ ] Missing or malformed data hides the calendar and logs nothing to the user.
- [ ] Curated repos come from the content model and link out.
- [ ] Impeccable detector: zero findings.

---

## 9. Credentials wall, off the clock, and contact stations
**Lane:** Claude Code
**Type:** AFK
**Blocked by:** 5, 6

### Description
Credentials render on the wall frames at the wall station, headline tier prominent, each linking to verification, AZ-104 in progress, education alongside. Off the clock sits at the desk-end station in one viewport: Counter-Strike (Faceit level 10), soccer, training, South Florida, languages. Contact sits at the window station with email copy confirmation, LinkedIn, GitHub, resume download, and a clear end of page.

### Acceptance criteria
- [ ] Credentials tiers visually distinct; every one links to its verification page; flipping AZ-104 is a one-field change.
- [ ] Off the clock fits one viewport on desktop and phone.
- [ ] Copying the email shows a small confirmation.
- [ ] The page has an unmistakable end.
- [ ] Impeccable detector: zero findings.

---

## 10. No-WebGL poster, reduced motion, and accessibility pass
**Lane:** Claude Code
**Type:** AFK
**Blocked by:** 5

### Description
Without WebGL or on load failure, the site shows a still of the wide shot and the document page; nothing is missing. With reduced motion, no autonomous motion runs and station changes crossfade. A full keyboard and screen-reader pass confirms reading order and focus across every station, including projected screens.

### Acceptance criteria
- [ ] With WebGL disabled in the browser, the page is complete and Lighthouse accessibility is at or above 95.
- [ ] With reduced motion enabled, no camera flight or autonomous animation plays.
- [ ] A screen reader reads every section in story-arc order with no orphaned content.
- [ ] Scene load failure is caught and falls back without console errors reaching the user.

---

## 11. Social preview, metadata, and privacy-friendly counts
**Lane:** Claude Code
**Type:** AFK
**Blocked by:** 6

### Description
The link previews correctly on LinkedIn, Slack, and iMessage with a rendered image of the desk, a proper title and description, and structured person data for search engines. Basic page counting is added without cookies or a banner.

### Acceptance criteria
- [ ] Open Graph and Twitter card images and text validate in the standard preview debuggers.
- [ ] Person structured data validates.
- [ ] No cookies are set; no consent banner exists.

---

## 12. Performance verification and launch
**Lane:** both, Pau merges
**Type:** HITL
**Blocked by:** 8, 9, 10, 11

### Description
The site is measured against every budget in the PRD on real devices and current browsers, the domain goes live, and the final content check is done. AZ-104 is flipped if the result is in.

### Acceptance criteria
- [ ] Lighthouse mobile at or above 85 and desktop at or above 95 on production with the scene loaded.
- [ ] Total JS under 500 KB gzipped; GLB and textures within budget.
- [ ] Verified in current Chrome, Safari, Firefox, and Edge on desktop and on iOS and Android.
- [ ] Custom domain resolves with valid TLS; the Azure default hostname redirects to it.
- [ ] A final read-through by Pau of every word on the page.
- [ ] The URL is in the "personal website" field of the next application.
