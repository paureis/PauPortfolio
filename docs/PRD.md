# PRD: Alvaro Reis portfolio site

Version 1.0, September 10, 2026
Owner: Alvaro "Pau" Reis
Prepared from a grill-me planning session with Claude Fable 5.1

---

## Problem statement

Job applications keep asking for a personal website, and Pau has nothing he is willing to put in that field. His resume already tells the story of an AI engineer who shipped a production multi-tenant SaaS alone, but a resume cannot show how he works, what he is like, or that he can build something that looks and feels finished. Existing portfolio templates look like everyone else's and read as AI-generated, which is the wrong signal for someone whose differentiator is disciplined agentic development.

The site needs to do one job: make a hiring manager for AI, agentic-systems, cloud, or software engineering roles want to talk to him, within the thirty seconds they give a portfolio link, on whatever device they open it on.

## Solution

A single-page, self-hosted portfolio built as a stylized 3D recreation of Pau's actual home desk in Miramar, Florida, at around 7pm. The visitor lands on a wide view of the desk. Scrolling commits the camera to the main monitor, where selected work is shown as windows on the screen. A tab, a click on the other screen, or the keyboard swings the camera across the desk to the second monitor, where the "how I work" story lives. From there the camera visits the wall (credentials), the sill and the PC (off the clock), and ends at the window at dusk (contact).

The page underneath is a normal HTML document. Every word of content is real text, selectable, indexable, and readable with the 3D layer removed. The 3D earns attention; it never carries information on its own.

The visual language is warm room light from the desk lamp and the screens, a South Florida sunset through the window (teal at the top, coral at the horizon), and the RGB glow that already lives in the PC case and keyboard. Miami Vice stays subtle: it is a place, not a theme.

The site is built by two coding agents in parallel, Claude Code and OpenAI Codex, with Impeccable enforcing design quality, and it says so. The site is its own proof of the workflow it describes.

## Positioning

Hero line, working version:

> AI engineer. I build agentic systems that ship to production, usually from this desk.

Supporting line: "Sole engineer on a multi-tenant recruiting platform used by two healthcare organizations."

The tail after "production" is the playful part and can change. Alternates considered: "Then I go outside, because it's Florida and the weather is doing its thing." and "When the pipeline isn't running, I probably am. Soccer, mostly."

## Audience and success criteria

Primary audience: hiring managers and recruiters for AI engineer, agentic systems, cloud, DevOps, and software engineering roles. Secondary: networking contacts in the Miami tech scene, and anyone who lands on the site from LinkedIn or GitHub.

The site succeeds if:

- A recruiter on a phone, over cellular, can read the positioning, see the headline project, and download the resume within 30 seconds, without discovering anything.
- A hiring manager on a laptop remembers the monitor switch a day later.
- Nobody says "this looks AI-generated." Impeccable's detector reports zero findings on every merged change.
- Lighthouse performance stays above 85 on mobile and 95 on desktop with the 3D scene loaded.
- The URL can go in the "personal website" field of every application without a second thought.

---

## Story arc and camera stations

The page is a sequence of stations. Each station is a camera position in the room, a section of HTML content, and a set of triggers. Scrolling is always the default path through all of them. Clicks, tabs, and keyboard are shortcuts, never the only way.

| Order | Station | Room anchor | Content |
|---|---|---|---|
| 1 | Wide | Whole desk from the chair, slightly above eye level | Hero: name, positioning line, supporting line, primary actions (See the work, Download resume) |
| 2 | Main monitor | The Zowie 24.1" in the center, webcam on top | Selected work, presented as windows on the screen: Talent Scout Pro, Forward Thinkers Consulting, NEO Consulting Group, Cyberse |
| 3 | Side monitor | The 27" on the left, angled toward the chair | How I work: the agentic lifecycle, the skill library, cross-model review, the note that this site was built this way. GitHub activity lives here too. |
| 4 | Wall | Right wall near the dartboard | Credentials, framed on the wall in the stylized version. The dartboard stays. |
| 5 | Desk end | The PC case, the bottle, the controller, the pink mouse on the pad, the figures on the sill | Off the clock: Counter-Strike (Faceit level 10), soccer, training, South Florida. Languages. |
| 6 | Window | The window behind the side monitor, shade up, dusk outside | Contact: email, LinkedIn, GitHub, resume download. |

The monitor switch (station 2 to station 3 and back) is the signature interaction. The camera should travel across the desk in a single committed move, not a cut and not a drift, and the content on the arriving screen should already be there when the camera lands.

---

## Room layout (from photos)

This section is the reference for the Blender scene. Stylized means proportions and placement are faithful; surface detail is simplified; screen contents and any personal or third-party imagery are replaced.

**Desk.** Long black IKEA table with black cylindrical legs, set into a corner. The back edge runs along a textured white wall; the right end meets the perpendicular right wall. Wood-look laminate floor. White marble baseboard trim along the wall.

**Left to right on the desk.**

1. 27" 240Hz monitor (Acer), on a round stand, angled inward toward the chair. This is the side monitor.
2. Boom arm clamped to the back edge between the monitors, holding a HyperX QuadCast 2 in a shock mount, lights off. The arm sits in front of and slightly below the screens from the chair's point of view.
3. Zowie 24.1" 400Hz monitor, centered, on a flat rectangular stand. Logitech webcam on top. A tall reed diffuser (black sticks in a glass jar) stands on the sill behind and just left of it. This is the main monitor.
4. Black TKL mechanical keyboard with RGB backlight (pink and blue), centered under the main monitor.
5. Large black cloth mousepad (Artisan) to the right of the keyboard, with a pink honeycomb-shell gaming mouse.
6. PlayStation DualSense controller, black, at the right side of the pad.
7. NZXT H510 Elite at the far right end of the desk against the right wall: white top and bottom, black tempered glass front and side, NZXT Kraken pump cap visible, GPU with visible branding, a small red numeric readout inside, a WiFi antenna on top.
8. 40 oz black Takeya Sport bottle beside the case.

**Walls and window.** A large window is directly behind the side monitor, left of the main monitor, with a white roller shade. Vertical LED light strips run down both sides of the window frame. The sill is white marble and holds three FiGPiN collectible figures in cases, a small Among Us figure, and a supplement bottle. A dartboard hangs on the right wall above and to the right of the case. A short vertical LED strip runs on the wall behind the main monitor.

**Beyond the desk.** A grey couch and a green foam roller sit to the left of the desk with a poster above. To the right beyond the corner: a grey shelf with a router, a figure, and a wall-mounted TV. These are out of frame for every station except possibly the wide shot and can be omitted or blocked in as low-detail masses.

**What changes in the stylized version.** Screen contents are replaced with the site's own content. Figures and any licensed characters become generic collectible shapes. Brand marks on the GPU, mouse, and pad are removed. Credentials are added as framed items on the right wall, which the real room does not have. The window shows a South Florida sunset instead of a closed shade.

---

## User stories

### Arrival and hero

1. As a recruiter on a phone over cellular, I want the page to show the name, positioning line, and a resume button within two seconds, so that I can decide whether to keep reading before the 3D scene has even loaded.
2. As a hiring manager, I want to understand what Pau does in one sentence, so that I can place him against the role I'm filling.
3. As a visitor, I want the wide desk view to feel like a real room I could sit down in, so that the site feels personal rather than templated.
4. As a visitor with a mouse, I want the scene to respond subtly to my cursor, so that it feels alive without being distracting.
5. As a visitor, I want a clear signal that the page continues below, so that I know to scroll.

### Navigation and camera

6. As a visitor, I want scrolling to move me through every section in order, so that I never have to discover a hidden control to see the whole site.
7. As a visitor, I want the camera to commit to the main monitor when I scroll past the hero, so that the work section fills my view.
8. As a visitor, I want to click the other monitor, press Tab, or use a visible "How I work" control to swing the camera to the second screen, so that the switch feels like a deliberate move I made.
9. As a visitor, I want the content on the arriving screen to already be there when the camera lands, so that the transition never shows a blank screen.
10. As a visitor, I want to scroll back up and have the camera return along the same path, so that the site feels consistent in both directions.
11. As a keyboard-only visitor, I want to move between stations with the keyboard and see a visible focus indicator, so that I can use the site without a mouse.
12. As a visitor who scrolls fast, I want the camera to catch up smoothly rather than jitter or skip, so that the experience holds together under impatient use.
13. As a visitor mid-transition, I want to be able to interrupt with a new scroll or click, so that the site never locks me into an animation.
14. As a visitor, I want a persistent, minimal navigation with the section names, so that I can jump directly to Work, How I work, Credentials, Off the clock, or Contact.

### Work

15. As a hiring manager, I want Talent Scout Pro presented first with the outcomes that matter (sourcing time from 12 hours to under 8 minutes, two healthcare tenants, zero client-reported errors since launch), so that I see impact before implementation.
16. As a hiring manager, I want the engineering decisions behind Talent Scout Pro (event-driven pipeline on Azure Functions and Storage Queues, Redis-based distributed rate limiting, tenant isolation, sub-two-minute deploys), so that I can judge depth.
17. As Pau, I want Talent Scout Pro to stay at resume-level detail with no product name, domain, screenshots, schema, prompt design, or pricing, so that the idea and the client are protected.
18. As a hiring manager, I want Forward Thinkers Consulting shown as a separate engagement (production deployment for healthcare clients, US data residency, Entra ID SSO, environment provisioning and cost), so that I understand the client work as distinct from the product.
19. As a hiring manager, I want the NEO Consulting internship shown as a compact second case study (address-matching microservice, deterministic scoring with LLM fallback, 40% fewer external calls, latency from 800 to 450 ms), so that I see a pattern rather than a single project.
20. As a visitor, I want Cyberse shown as Pau's web studio with a link to cyberse.us, so that I know he also builds sites for clients.
21. As a visitor, I want each work item to open in place on the screen (expand, not navigate away), so that I stay in the room.
22. As a visitor, I want a short timeline strip of experience (Community Care Plan, NEO, Forward Thinkers) so that the chronology is clear without another case study.

### How I work

23. As a hiring manager for an AI role, I want to see the five-phase agentic lifecycle (plan, implement, independent review, verify, close out), so that I understand how Pau ships with agents.
24. As a hiring manager, I want to see that Pau maintains a library of 20-plus reusable agent skills and runs cross-model review across Claude, Codex, and Cursor, so that I see this is a practice, not a claim.
25. As a visitor, I want to read that this site itself was built with Claude Code and Codex working in parallel, so that the site is evidence of the process.
26. As a visitor, I want to see recent GitHub activity rendered in the site's own style, so that I can tell Pau is actively building.
27. As a visitor, I want three or four curated repositories linked from this section, so that I can go look at real code.
28. As Pau, I want the GitHub data to refresh nightly without me touching anything, so that the site never shows a stale calendar.

### Credentials

29. As a recruiter screening for cloud roles, I want the headline certifications (AWS Solutions Architect Associate, Azure AI Engineer Associate, Claude Certified Architect Professional) visually prioritized over the fundamentals, so that I see the strongest ones first.
30. As a recruiter, I want each credential to link to its verification page, so that I can confirm it in one click.
31. As Pau, I want AZ-104 to display as "in progress" until it is earned and then flip to earned by changing one field, so that the site never claims a credential I do not hold.
32. As a hiring manager, I want the education line (UCF B.S. Information Technology 2025, Georgia Tech OMSCS starting Spring 2027) alongside the certifications, so that the full picture is in one place.

### Off the clock

33. As a visitor, I want a short, visual view of who Pau is outside work (Counter-Strike at Faceit level 10, soccer, training, South Florida), so that he reads as a person and not a resume.
34. As a visitor, I want this section to take no more than one viewport, so that it stays a hook rather than a distraction.
35. As a visitor, I want to see that Pau is fluent in English and Spanish, so that bilingual roles are an obvious fit.

### Contact

36. As a recruiter, I want email, LinkedIn, and GitHub links plus a resume PDF download, so that I can reach out or save the resume immediately.
37. As Pau, I want my phone number kept off the site, so that the site does not become a spam source; the resume PDF carries it.
38. As a visitor, I want copying the email address to give a small confirmation, so that I know it worked.
39. As a visitor at the end of the page, I want a clear sense that I've reached the end, so that I don't keep scrolling looking for more.

### Fallback, accessibility, and performance

40. As a visitor on a device without WebGL, I want the full site as a readable page with a still image of the desk, so that nothing is missing.
41. As a visitor who has reduced motion enabled, I want camera flights replaced by crossfades and no autonomous motion, so that the site respects my setting.
42. As a screen reader user, I want every section, heading, and control announced in reading order, so that the 3D layer is invisible to me and the content is complete.
43. As a visitor on a mid-range phone, I want a lighter version of the scene (fewer effects, smaller textures) that still performs, so that the site doesn't stutter or drain my battery.
44. As a visitor on a slow connection, I want the HTML content to render before the 3D assets finish loading, with the scene fading in when ready, so that I'm never staring at a loader.
45. As a visitor, I want the page to be under a strict weight budget, so that it loads fast anywhere.
46. As a visitor sharing the link, I want a proper preview image and title on LinkedIn, Slack, and iMessage, so that the link looks intentional.
47. As a visitor, I want the site to work in current Chrome, Safari, Firefox, and Edge on desktop and mobile, so that I am not told to switch browsers.
48. As a visitor who resizes or rotates, I want the scene to reframe without breaking the layout, so that the site holds up.
49. As a visitor, I want no cookie banner and no tracking beyond basic privacy-friendly page counts, so that the site respects me.

### Maintenance (Pau's stories)

50. As Pau, I want all content in one typed source file, so that updating a project, adding a certification, or changing the tail line never touches component code.
51. As Pau, I want a build that fails if content is invalid (missing verification link, earned cert without a date, work item without outcomes), so that I cannot ship a broken section.
52. As Pau, I want the Blender file to be the single source for the 3D scene and the GLB to be a generated artifact, so that the scene is never edited in two places.
53. As Pau, I want a build check that fails if the exported scene is missing an anchor the site expects, so that a Blender change cannot silently break a camera station.
54. As Pau, I want pushing to main to deploy in under two minutes with no manual steps, so that updates are painless.
55. As Pau, I want pull requests to get a preview deployment, so that I can review agent work on a real URL before merging.
56. As Pau, I want both agents to read the same working instructions, design system, and scene contract, so that the output looks like one person built it.
57. As Pau, I want every merged change to have been reviewed by the other agent, so that nothing lands without a second opinion.

---

## Implementation decisions

### Stack

- Next.js with static export, TypeScript. Chosen because it's what Pau builds with daily, the repository will be read by hiring managers, and static output keeps hosting trivial.
- React Three Fiber and drei for the 3D layer. The scene, camera, and screens are React components both agents can edit.
- GSAP with ScrollTrigger for camera choreography and the monitor switch. Lenis for smooth scrolling.
- Plain CSS with custom properties as the styling layer. Impeccable's design tokens map directly onto it.
- Impeccable installed for both Claude Code and Codex, initialized so the repository carries a PRODUCT.md (who the site is for and what it must do) and a DESIGN.md (the visual system). The design hook runs on UI edits so slop is caught as agents work, not at review.

### Modules

**Scene source (Blender).** The Blender project containing the room. Named empties for every camera station (wide, main monitor, side monitor, wall, desk end, window). Named meshes for every surface the site needs to address (main screen, side screen, case glass, window glass, the wall area where credentials hang). Lighting baked to textures so the browser does minimal real-time lighting. An export step that produces a compressed GLB (Draco or meshopt geometry, KTX2 textures) and a manifest listing every anchor and surface with its name and transform. The manifest is the contract between the 3D lane and the web lane. Only one agent works in Blender at a time because it is a single live session.

**Scene renderer.** Loads the GLB and manifest, exposes anchors and screens to the rest of the app, and picks a quality tier from device capability (full effects on desktop, reduced on laptops and tablets, minimal on phones). If WebGL is unavailable or the load fails, it renders a still image of the wide shot and hands the page over to the document fallback. Real-time lighting is limited to a few emissive surfaces (screens, RGB, LED strips) and the window glow, which shift subtly with the time-of-day feel.

**Camera director.** A pure state machine. It knows the ordered list of stations, the current station, the allowed transitions, and how each input (scroll progress, tab, click on a screen, keyboard) maps to a transition. It emits "go to station X along path P over duration D" and nothing else; GSAP executes. Transitions are interruptible: a new input retargets the in-flight move rather than queuing behind it. Reduced motion swaps flights for crossfades at the same points. This module has no knowledge of Three.js or the DOM and is fully unit-testable.

**Content model.** One typed content source containing: profile (name, positioning line, tail line, supporting line, location, languages), work entries (title, organization, role, dates, one-line summary, outcomes, decisions, links, visibility rules), how-I-work (lifecycle phases, practice notes, curated repositories), credentials (name, issuer, status earned or in progress, earned date, expiry, verification link, tier), off-the-clock items, contact. A validation step runs at build and fails on missing required fields, an earned credential without a date, or a work entry without at least one outcome. Components render only from this model.

**Monitor surfaces.** Each screen is a mesh in the scene and an HTML region in the document. When the camera is at a monitor station, the HTML region is positioned and scaled to sit on the screen and remains real DOM (selectable, focusable). Away from that station the region collapses to its normal document position so the fallback reading order is preserved. The main screen hosts work as expandable windows; the side screen hosts how-I-work and GitHub activity.

**GitHub activity.** A scheduled job (nightly) that calls the GitHub GraphQL API with a repository secret, normalizes the contribution calendar and a small set of recent-activity numbers into a JSON file, commits it, and triggers a rebuild. A renderer draws the calendar in the site's own palette and type. Curated repositories are a hand-maintained list in the content model, not fetched.

**Document fallback.** The full page as a plain, well-typeset document: the same content, in the same order, with the wide-shot still as the only image. This is also what search engines, screen readers, and reduced-motion visitors get. It is built first, before any 3D work, so the site is shippable at every stage.

**Build and deploy.** GitHub Actions builds the static export on every push. Pull requests deploy to Azure Static Web Apps preview environments; main deploys to production. Custom domain (alvaroreis.dev preferred, pending availability) purchased through a standard registrar and pointed at the Static Web App. A second scheduled workflow handles the nightly GitHub data refresh.

**Agent workspace.** AGENTS.md (read by Codex) and CLAUDE.md (read by Claude Code) carry identical working instructions: the lanes, the scene contract, the review rule, the Blender rule, the definition of done. Each agent works in its own git worktree on its own branch. Claude Code's lane is the web app: Next.js, R3F scene code, camera director, content, monitor surfaces, fallback, Impeccable passes. Codex's lane is the 3D and data pipeline: Blender scene, bakes, GLB export and compression, manifest, the GitHub data workflow. Every pull request is reviewed by the other agent with no prior context before merge.

### Definition of done for any change

- Impeccable detector reports zero findings.
- Content validation passes.
- Anchor manifest check passes.
- Lighthouse mobile performance at or above 85, desktop at or above 95, on the preview URL.
- The page reads correctly with the canvas removed.
- Reviewed and approved by the other agent.

### Performance budgets

- Scene GLB under 4 MB compressed; textures under 6 MB total across all tiers.
- Total JavaScript under 500 KB gzipped, with Three.js and GSAP the only large dependencies.
- First contentful paint under 1.5 s and largest contentful paint under 2.5 s on a simulated 4G phone, measured on the fallback content, before the scene loads.
- No layout shift when the scene fades in.

### Visual system (input to Impeccable's DESIGN.md)

- Palette: warm dark room base (not pure or tinted black), cream text, a lamp-amber warm accent, sunset coral and teal used only where the window and its light reach, screen blue-white and RGB pink and blue used only on the objects that emit them.
- Type: one display family with personality for headings and names, one quiet sans for body. No italic serif accents, no monospace for labels.
- Motion: one orchestrated camera move per station change. No per-element fade-and-slide entrances. Hover states only on things that are interactive.
- Copy: sentence case, plain verbs, first person, no eyebrows or numbered section labels except where content is actually a sequence (the lifecycle and the timeline).

---

## Testing decisions

A good test here checks external behavior a visitor or Pau would notice, not implementation detail. Tests are written for:

- **Camera director.** Given a station and an input, assert the emitted transition. Cover: scrolling forward and backward through every station, tab and click switching between the monitors from each of them, keyboard navigation order, interrupting an in-flight transition, reduced-motion mode emitting crossfades, and rejecting invalid transitions. This is the highest-value suite because the mechanic is the site.
- **Content model validation.** A valid fixture passes. Each rule has a failing fixture: earned credential without a date, in-progress credential with a date, work entry with no outcomes, missing verification link, missing contact field. The build must fail, not warn.
- **GitHub activity normalizer.** Given a recorded API response, the output JSON matches the expected shape, handles an empty calendar, and handles a partial or errored response by keeping the previous file rather than writing an empty one.
- **Anchor manifest check.** Given a manifest, assert that every station and screen the app references exists; a missing anchor fails the build with a message naming it.
- **Document fallback.** A rendered-page test asserts that every content item in the model appears in the HTML in the expected order with the canvas removed.

Not tested by code: Blender output, GSAP tween feel, and visual quality. Those are verified by eye on the preview URL and by Impeccable's detector.

---

## Out of scope

- Blog, articles, or a CMS. The site is a single page with content in the repository.
- Any backend, database, or contact form. Contact is mailto and links.
- Talent Scout Pro screenshots, product name, domain, schema, prompts, evaluation logic, pricing, or client names beyond "two healthcare organizations."
- The Neo Log Analyst project and the Forward Thinkers marketing site as case studies (Cyberse links out instead).
- Phone number anywhere on the site.
- A "loud" Miami Vice treatment: neon type, chrome, palm silhouettes, retro grids.
- A full free-roam 3D experience or any content that exists only inside the scene.
- Light/dark mode toggle. The room has one time of day.
- Multi-language versions of the site.
- Analytics beyond privacy-friendly page counts.
- Photogrammetry or scanning of the real desk.
- Listing AZ-104 as earned before it is.

---

## Further notes

**Delivery order.** Build in this sequence so the site is shippable at every step:

1. Workspace: repository, worktrees, AGENTS.md and CLAUDE.md, Impeccable init, Blender and its MCP server registered with both agents, Azure Static Web App and CI, domain purchase.
2. Document first: content model, validation, and the full fallback page, typeset and reviewed with Impeccable. This alone is a usable portfolio.
3. Scene: Blender block-out from the room layout section and photos, review renders, bake, export, manifest. In parallel, the scene renderer with a placeholder GLB.
4. Camera director and monitor surfaces, wired to the real scene. The monitor switch is the acceptance test for this phase.
5. GitHub activity, credentials wall, off the clock, contact, quality tiers, and polish passes.
6. Performance verification against budgets, cross-browser and device checks, launch.

**Domain.** alvaroreis.dev is preferred because it matches the name on the resume and certifications. Verify availability before committing. paureis.dev (GitHub handle) and alpaureis.com (LinkedIn handle) are fallbacks.

**AZ-104.** The retake is scheduled for September 14. The credential slot ships as "in progress" and flips to earned with a one-field change once the result is in.

**Photos.** The five reference photos are the modeling source for the Blender lane and should be kept in the repository's reference folder. They are not published.

**Blender expectations.** Agents handle block-out, materials, lighting, camera, and export well. They handle organic detail poorly. The room is almost entirely boxes, cylinders, and flat panels, which is the good case. Collectible figures on the sill should be simplified to generic shapes rather than modeled faithfully.

**The site as proof.** The "how I work" section states that the site was built with Claude Code and Codex in parallel using the lifecycle it describes. The repository, commit history, and pull request reviews should make that claim easy to verify for anyone who looks.
