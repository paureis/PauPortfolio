# SETUP.md: how the workspace is set up

This is the one-time setup as it actually is, recorded after it was done. The day-to-day routine is `docs/LOOP.md`; nothing here repeats it. If you rebuild the machine, this is the list.

---

## 0. Repository

Public GitHub repository `paureis/PauPortfolio`. Public is part of the pitch: the "how I work" section says the site was built by two agents, and the commit history and PR reviews are the proof.

`main` is protected: pull request required, the `Build` check required and up to date, conversation resolution required, no force pushes, no deletions, enforced for admins. Required approvals is zero because both agents and Pau share one GitHub account and GitHub does not count the author's own approval. The reviewing agent's verdict, posted as a PR comment, is the gate.

`reference/` holds the five desk photos for the Blender lane and is gitignored. It never reaches the remote.

---

## 1. Three checkouts

One clone and two worktrees, side by side:

```
C:\PauPortfolio          main. Pau reviews, merges, and runs sync and ship here.
C:\PauPortfolio-claude   Claude Code's worktree, resting branch claude/workspace.
C:\PauPortfolio-codex    Codex's worktree, resting branch codex/workspace.
```

Created from the clone with:

```powershell
git worktree add ..\PauPortfolio-claude -b claude/workspace
git worktree add ..\PauPortfolio-codex -b codex/workspace
```

Each agent branches per issue from `main` inside its own worktree (`claude/2-content-model`, `codex/3-scene-blockout`) and opens a PR. AGENTS.md makes each agent check its own folder at session start and stop if it is in the wrong one.

---

## 2. Where each agent runs

- **Claude Code** runs in a Cursor terminal tab opened on `C:\PauPortfolio-claude`. The `cc` command from `profile.ps1` puts you there and starts it.
- **Codex** runs in the Codex desktop app, project PauPortfolio, pointed at the `C:\PauPortfolio-codex` worktree, Local mode. There is no Codex terminal tab.
- **Pau** works from a Cursor terminal tab on `C:\PauPortfolio`. Cursor is only the editor.

---

## 3. Impeccable

Installed from the universal zip and committed to the repository, so both agents read the same skill files: `.claude/` for Claude Code, `.codex/` and `.agents/` for Codex, `.cursor/` for Cursor. Each carries the skill, the subagent definitions, and a hooks file. The design hook runs on UI edits in both agents' installs and reports findings as they work.

`PRODUCT.md` was written through `/impeccable init` with answers from the PRD. `DESIGN.md` and `.impeccable/design.json` record the visual system; Issue 2 rewrites `DESIGN.md` from the built document page. `npx impeccable update` refreshes the installs.

---

## 4. Blender and its MCP server

Still to do before Issue 3 starts. As of Issue 2 neither agent has a `blender` MCP server registered.

1. Install Blender from blender.org.
2. Install the blender-mcp add-on (verify the steps against github.com/ahujasid/blender-mcp; they change), enable it under Edit > Preferences > Add-ons, then press N in the 3D viewport, open the BlenderMCP tab, and click Connect. It reports running on port 9876.
3. Register it with Codex: `codex mcp add blender -- uvx blender-mcp`, then `codex mcp list` to confirm. The desktop app shares `~/.codex/config.toml` with the CLI. Codex starts the server; nobody runs `uvx blender-mcp` by hand.

Rules of the road:

- Blender is a single live session. Only the 3D lane touches it, one session at a time.
- Blender must be open with the add-on connected before Codex's session starts.
- Codex renders and looks at the render. Pau looks too and says what is wrong in plain terms.

---

## 5. Azure Static Web Apps

Resource group `pauportfolio-rg` in East US 2, Static Web App `pauportfolio-swa` on the Free plan, tagged `project=pauportfolio`, with no linked source. All deploys come from the GitHub Actions workflow in `.github/workflows/build-and-deploy.yml` using the repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN`.

- Every push to every branch runs the checks and the static build.
- A push to `main` deploys production at `gentle-forest-0a9db720f.3.azurestaticapps.net`.
- Every pull request gets a preview at `gentle-forest-0a9db720f-<PR number>.eastus2.3.azurestaticapps.net`, posted on the PR and removed when it closes. That is where cross-review happens.

The subscription also hosts unrelated `tspro-*` resource groups. Portfolio resources never go there.

---

## 6. Domain

Not bought yet. Preferred `alvaroreis.dev`, then `paureis.dev`, then `alpaureis.com`. Buy from Cloudflare Registrar or Namecheap (Azure's own domain purchase does not offer `.dev`), add it as a custom domain on the Static Web App, create the records it asks for, and Azure issues the certificate. This is Issue 12.

---

## 7. GitHub token for the nightly activity refresh

The default `GITHUB_TOKEN` in Actions can usually read the public contribution calendar through the GraphQL API. Codex tries that first in Issue 7. If it cannot, create a fine-grained personal access token with read-only access to the profile and add it as a repository secret named `CONTRIBUTIONS_TOKEN`. Because `main` requires a pull request, the workflow opens a PR with the refreshed data rather than pushing to `main`.

---

## 8. Issues

`docs/ISSUES.md` is the source; one GitHub issue per section, numbered to match, labeled `lane:claude` or `lane:codex`.

---

## 9. Pau's ops folder

`C:\Users\pau\pau-ops` holds the routine's scripts. It is outside the repository on purpose: it knows the absolute paths of all three checkouts.

| File | Does |
|---|---|
| `profile.ps1` | Paste into `$PROFILE`. Defines `pp`, `cc`, `sync`, `ship`. |
| `sync.ps1` | Brings all three checkouts up to `origin/main`. Leaves a lane alone if it is mid-issue on an unmerged branch. |
| `ship.ps1 -Pr <n>` | Resolves open review threads, squash-merges the PR, deletes the remote branch, then runs `sync`. |
| `LOOP.md` | The routine. A copy lives at `docs/LOOP.md` so both agents can read it. |

When `LOOP.md` changes in `pau-ops`, copy it to `docs/LOOP.md` in the next PR.
