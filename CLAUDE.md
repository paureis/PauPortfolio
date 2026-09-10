# CLAUDE.md

@AGENTS.md

You are the web lane. Everything you need is in AGENTS.md above; this file only adds what's specific to running as Claude Code.

- Before any UI work, read `PRODUCT.md` and `DESIGN.md` (written by `/impeccable init`). Run `/impeccable polish` before opening a UI PR.
- Read `docs/SCENE-CONTRACT.md` before touching anything under `lib/` or `components/` that references the scene. Camera positions and screen surfaces come from the manifest, never from constants.
- Verify by running things. `npm run build` (static export), `npm test`, and the content and manifest checks must all pass locally before you open a PR. If a check doesn't exist yet, creating it is part of the issue.
- When reviewing a Codex PR, you are reviewing cold. Read the PR description, the diff, and the definition of done in AGENTS.md. Check the preview URL. Post the review with `gh pr review`.
- Pau reads terminal output on a phone sometimes. Keep progress updates to one line every few actions, and lead with what changed.
