# AGENTS.md

Working instructions for every coding agent on this repository. Claude Code reads this through CLAUDE.md; Codex reads it directly. If you are an agent, read this whole file before your first action, then read `docs/PRD.md` and `docs/SCENE-CONTRACT.md`.

## What this is

A single-page portfolio site for Alvaro "Pau" Reis, an AI engineer in Miramar, Florida. The site is a stylized 3D recreation of his real home desk around 7pm, with a normal HTML document underneath. Scrolling moves a camera between six stations (wide, main monitor, side monitor, wall, desk end, window). The signature interaction is the monitor switch: a tab, click, or keypress swings the camera across the desk from one monitor to the other.

The audience is hiring managers for AI, agentic-systems, cloud, and software engineering roles. The site must be fully usable on a phone with the 3D layer removed. The 3D earns attention; it never carries information.

The site is built by two agents in parallel, Claude Code and OpenAI Codex, and says so. The repository is public and is part of the pitch. Work as if a hiring manager will read your commits and PR reviews, because one will.

## Lanes

Work is split by file ownership. Stay in your lane unless a PR review requires a small cross-lane fix, in which case say so in the PR.

**Claude Code: the web lane.** The Next.js app, the React Three Fiber scene code, the camera director, the content model and its validation, monitor surfaces, the document fallback, accessibility, the credentials, off-the-clock, and contact sections, Impeccable passes, and the GitHub activity renderer.

**Codex: the 3D and data lane.** The Blender project, materials, lighting and bakes, GLB export and compression, the scene manifest and its build check, the nightly GitHub activity workflow and its normalizer, and performance tooling for assets.

Both lanes share `docs/SCENE-CONTRACT.md`. The web lane consumes it; the 3D lane produces it. Neither changes it without a PR titled "Scene contract change" that the other lane reviews.

## Workflow

1. Work only inside your own git worktree. Never run in the other agent's worktree or on `main` directly.
2. One issue at a time. Take the lowest-numbered issue in your lane whose blockers are merged. Say which one you're taking before you start.
3. Branch from `main`: `<agent>/<issue-number>-<short-slug>`.
4. Before you write code, state your plan as a short numbered list and wait for approval from Pau.
5. Commit in small, described steps. Commit messages say what changed and why, in plain language, no emoji, no prefixes.
6. Open a PR with `gh pr create`. The description covers: what the issue asked for, what you did, what you didn't do and why, how you verified it, and the preview URL. Then stop.
7. The other agent reviews cold. Address every comment or explain why not. Pau merges.
8. After merge, delete the branch and pull `main` into your worktree before starting the next issue.

Never merge your own PR. Never force-push a shared branch. Never rewrite history on `main`.

## Definition of done

A PR is done when all of the following are true. Check them yourself before you open it; the reviewer will check them again.

- Impeccable's detector reports zero findings on any UI you touched.
- Content validation passes.
- The scene manifest check passes.
- Lighthouse on the preview URL: mobile performance at or above 85, desktop at or above 95. If your change can't affect this, say so instead of running it.
- The page reads correctly, in order, with the canvas removed.
- Tests for anything the PRD says gets tests are written and green.
- The PR description is honest about what was verified by running it versus by reading it.

## Design rules

Impeccable's `DESIGN.md` and `PRODUCT.md` are the visual and product system. Read them before any UI work. Use `/impeccable polish` before opening a UI PR and `/impeccable critique` if you're unsure about a choice.

Beyond what Impeccable catches:

- Warm dark room base, never pure black or a tinted near-black standing in for black. Cream text. Lamp-amber accent. Coral and teal only where the window's light would reach. Screen blue-white and RGB pink and blue only on objects that emit them.
- One display family, one body family. No italic serif accents. No monospace for labels or data.
- One orchestrated camera move per station change. No fade-and-slide entrances on individual elements. Hover effects only on interactive things.
- Copy in first person, sentence case, plain verbs. No eyebrows, no all-caps labels, no numbered markers except on the lifecycle and the timeline, which actually are sequences.
- Nothing that reads as "Miami Vice theme": no neon type, chrome, palm silhouettes, or retro grids. The sunset through the window is the whole reference.

## Content rules

These are hard rules. A PR that violates them gets rejected regardless of quality.

- Talent Scout Pro is described at resume level only: outcomes and engineering decisions. No product name beyond "Talent Scout Pro," no domain, no screenshots, no schema, no prompt or evaluation design, no pricing, no client names beyond "two healthcare organizations."
- Talent Scout Pro (Pau's solo product) and Forward Thinkers Consulting (the client engagement) are separate work entries.
- No phone number anywhere on the site. The resume PDF carries it.
- AZ-104 is "in progress" until Pau changes its status. Never mark a credential earned without an earned date and a verification link.
- Every credential links to its verification page.
- Screen contents in the 3D scene are the site's own content, never captures of real apps. No third-party characters or logos on the collectible figures; make them generic shapes.
- Real photos in `reference/` are for modeling only and are gitignored. Never commit them, never derive textures from them that reproduce screen contents or personal images.
- Contact is email, LinkedIn, GitHub, resume download. No contact form.

## Blender rules (3D lane)

- Blender is a single live session. Only the 3D lane touches it, and only one session at a time.
- The `.blend` file is the source of truth. The GLB and manifest are build artifacts produced by the export script, never edited by hand.
- Name every camera empty and every addressable mesh exactly as `docs/SCENE-CONTRACT.md` specifies. The manifest check will fail otherwise.
- Render and look at your render before you report it done. Describe what you see, not what you intended.
- Block-out first (correct proportions, placement, and camera framing from every station), then materials, then lighting and bakes. Don't polish geometry before the framing is approved.
- Budgets: GLB under 4 MB compressed; textures under 6 MB across all quality tiers.

## Things that go wrong

- Editing the other lane's files "just to unblock yourself." Open an issue or say it in your PR instead.
- Hardcoding a camera position in the web lane instead of reading it from the manifest.
- Committing a GLB that was exported from an uncommitted `.blend` state.
- Claiming a Lighthouse score or a test result you didn't actually run.
- Writing the site's copy in marketing voice. Pau writes like a person; the site does too.
- Adding a loader, a splash screen, or a "click to enter." The HTML renders first, always; the scene fades in when ready.

## Where things live

Keep to this layout so both agents can find each other's work. Adjust only through a PR that updates this section.

```
app/            Next.js app (web lane)
components/     React and R3F components (web lane)
content/        typed content source and validation (web lane)
lib/            camera director, quality tiers, helpers (web lane)
scene/          Blender project, export script, bake outputs (3D lane)
public/scene/   exported GLB, textures, manifest (3D lane output, web lane input)
public/data/    nightly GitHub activity JSON (3D lane output, web lane input)
docs/           PRD, scene contract, issues, decisions
reference/      desk photos, gitignored
.github/        workflows: build and deploy, nightly data refresh
```
