# SETUP.md: getting the workspace ready

These are the steps you do by hand, once, before either agent starts. Everything is terminal-first. Cursor is only your editor. Budget an evening.

Commands below are what the tools documented as of September 2026. Where a step says "verify against the README," do that, because agent tooling changes monthly.

---

## 0. Decide the repo name and make it

Create a public GitHub repository. Public is part of the pitch: the "how I work" section says the site was built by two agents, and the commit history and PR reviews are the proof. Suggested name: `alvaroreis.dev` or `portfolio`.

```bash
gh repo create alvaroreis.dev --public --clone
cd alvaroreis.dev
```

Add the workspace files from this handoff bundle into the repo root:

```
AGENTS.md            # shared working instructions, read by Codex
CLAUDE.md            # imports AGENTS.md, read by Claude Code
docs/PRD.md          # the PRD
docs/SCENE-CONTRACT.md
docs/ISSUES.md       # paste into GitHub Issues (step 7)
reference/           # your five desk photos, gitignored (see below)
```

Add `reference/` to `.gitignore` before the first commit. The photos are for the Blender lane on your machine, not for the public repo.

Commit and push. The scaffold (Next.js, Impeccable init, CI) is Issue 1 and Claude Code does it; you don't hand-scaffold anything.

---

## 1. Worktrees: one per agent

Both agents work on the same repo at the same time, so each gets its own checkout and its own branches. Never run both agents in the same directory.

```bash
# from the repo root
git worktree add ../alvaroreis.dev-claude -b claude/workspace
git worktree add ../alvaroreis.dev-codex -b codex/workspace
```

You'll have three folders side by side:

```
alvaroreis.dev/          # main, where you review and merge
alvaroreis.dev-claude/   # Claude Code runs here
alvaroreis.dev-codex/    # Codex runs here
```

Each agent creates a branch per issue from `main` inside its own worktree (`claude/2-content-model`, `codex/3-scene-blockout`) and opens a PR. Branch naming convention: `<agent>/<issue-number>-<short-slug>`.

---

## 2. Impeccable for both agents

Run the installer once per agent. It detects the tool and installs the right build.

```bash
npx impeccable install
```

Pick Claude Code, then run it again and pick Codex CLI. For Claude Code the installer may instead tell you to open `/plugin`, choose Discover, and install Impeccable from the marketplace; either path is fine.

Then, in the Claude worktree, start Claude Code and run:

```
/impeccable init
```

This writes `PRODUCT.md` and `DESIGN.md`. Answer its questions from the PRD (audience, purpose, principles). Commit both files to `main` before Codex starts, so both agents read the same design system. This is also part of Issue 1, so Claude Code will prompt you through it.

Later, `npx impeccable update` keeps both installs current.

---

## 3. Blender and its MCP server

### Install Blender

Download from blender.org. If you can get 5.1 or newer, use the official Blender Lab MCP add-on. If you're on an older version, the community server works on 3.0+.

### Option A: official Blender Lab MCP (Blender 5.1+)

Follow the setup on the Blender Lab MCP page. Note the quirk: with drag-and-drop install you do it twice, first to add the Blender Lab extension repository, second to install the MCP add-on itself. Then register the server with each agent using the server details from that page.

### Option B: community blender-mcp (any recent Blender)

Verify the exact commands against the README at github.com/ahujasid/blender-mcp; they change.

1. Install `uv` if you don't have it.
2. In Blender: install the add-on from the repo, enable it under Edit > Preferences > Add-ons, then press N in the 3D viewport, open the BlenderMCP tab, and click Connect. It should report running on port 9876.
3. Register with each agent from its worktree:

```bash
# Claude Code
claude mcp add blender -- uvx blender-mcp

# Codex CLI (also covers the Codex desktop app and IDE extension; they share ~/.codex/config.toml)
codex mcp add blender -- uvx blender-mcp
codex mcp list   # blender should show as enabled
```

Don't run `uvx blender-mcp` yourself in a terminal; the agent starts it.

### Rules of the road

- Blender is a single live session. Only one agent works in it at a time. By default that's Codex (see AGENTS.md).
- Blender must be open with the add-on connected before the agent's session starts.
- The agent asks Blender to render and looks at the render. You look at the render too. If it's wrong, say what's wrong in plain terms ("the second monitor is too far from the first," "the window should be taller than the monitor").

---

## 4. Azure Static Web Apps

Do this after Issue 1 produces a buildable Next.js static export, or do it now against an empty app and let CI fill it in.

1. In the Azure portal (or `az staticwebapp create`), create a Static Web App on the Free plan in East US 2, source GitHub, pointing at the repo and the `main` branch.
2. Build settings: app location `/`, output location `out`, no API.
3. Azure adds a GitHub Actions workflow and the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to the repo. Claude Code will adjust the workflow in Issue 1 to build the static export correctly.
4. Preview environments for pull requests are on by default; each PR gets its own URL. That's where cross-review happens.

---

## 5. Domain

Check availability for `alvaroreis.dev` first, then `paureis.dev`, then `alpaureis.com`. Buy from Cloudflare Registrar or Namecheap (Azure's own domain purchase doesn't offer `.dev`).

Point it at the Static Web App: in the portal, add a custom domain, then create the CNAME (for `www` or a subdomain) or the ALIAS/A records it asks for at the registrar. Azure issues the TLS certificate automatically. `.dev` is HTTPS-only, which is fine here.

---

## 6. GitHub token for the nightly activity refresh

The default `GITHUB_TOKEN` that Actions provides can usually read your public contribution calendar through the GraphQL API. Codex will try that first in Issue 7. If it can't, create a fine-grained personal access token with read-only access to your profile and add it as a repository secret named `CONTRIBUTIONS_TOKEN`.

---

## 7. Create the issues

Open `docs/ISSUES.md` and create one GitHub issue per entry. Label each with `lane:claude` or `lane:codex` as marked, and add the `blocked-by` numbers to the issue body once you know them.

```bash
gh issue create --title "..." --body-file <(sed -n '/## 1\./,/## 2\./p' docs/ISSUES.md) --label lane:claude
```

Or paste them by hand; there are eleven.

---

## 8. Kick off

Start Claude Code in its worktree and paste the kickoff prompt at the bottom of this file. Start Codex in its worktree and paste its prompt. Both prompts tell the agent to read AGENTS.md first and to stop and confirm its plan before touching anything.

Order matters for the first two days:

1. Claude Code: Issue 1 (workspace and deploy). Codex waits, or does Blender install checks.
2. After Issue 1 merges: Claude Code takes Issue 2 (content and fallback page). Codex takes Issue 3 (scene block-out). These run in parallel.
3. From there, each agent pulls the next issue in its lane whose blockers are done.

---

## Kickoff prompt: Claude Code

```
Read AGENTS.md, then docs/PRD.md and docs/SCENE-CONTRACT.md. You are the web lane.

Before doing anything else, tell me:
1. What you understand the project to be, in three sentences.
2. Which issue you're taking and why it's unblocked.
3. Your plan for that issue as a short numbered list.
Then wait for my approval.

Start with Issue 1: workspace and deploy. When it's done, open a PR and stop; Codex reviews it.
```

## Kickoff prompt: Codex

```
Read AGENTS.md, then docs/PRD.md and docs/SCENE-CONTRACT.md. You are the 3D and data lane.

Before doing anything else, tell me:
1. What you understand the project to be, in three sentences.
2. Confirm you can reach Blender through the MCP server (ping it).
3. Which issue you're taking and your plan as a short numbered list.
Then wait for my approval.

Issue 3 (scene block-out) is yours once Issue 1 has merged. Until then, verify the Blender connection and read the room layout section of the PRD and the reference photos in reference/.
```

## Review prompt (either agent, for the other's PR)

```
Review PR #<n> cold. You have no prior context on this change; read the PR description, the diff, and AGENTS.md's definition of done. Check the preview URL if one exists. Post a review with gh pr review: request changes for anything that violates the definition of done, the scene contract, or the content rules in AGENTS.md; approve only if you'd merge it yourself. Be specific and short.
```
