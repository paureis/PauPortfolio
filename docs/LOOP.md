# LOOP.md: the one routine

Three places. Four commands. One loop per issue. If something isn't in here, it isn't part of the routine.

## Places

| Name | What it is | What happens there |
|---|---|---|
| **me** | Cursor terminal tab, in `C:\PauPortfolio` | Your commands only: `sync`, `ship`, `gh`, `az` |
| **claude** | Cursor terminal tab, in `C:\PauPortfolio-claude`, running Claude Code | Claude's issues and Claude's reviews of Codex's PRs |
| **codex** | The Codex desktop app, project PauPortfolio (the `PauPortfolio-codex` worktree), Local | Codex's issues and Codex's reviews of Claude's PRs |

Close the `codex` terminal tab in Cursor. It's replaced by the app.

## Commands (from the **me** tab)

| Command | Does |
|---|---|
| `pp` | Go to your folder |
| `cc` | Go to the Claude worktree and start Claude Code |
| `sync` | Bring all three checkouts up to `main`. Safe any time; skips a lane mid-issue. |
| `ship 14` | Resolve review threads, squash-merge PR #14, delete its branch, then `sync` |

## Session rules

- **One Claude Code session per issue.** Start it with `cc`. Keep it open through review fixes. `/exit` right after `ship`.
- **One Codex chat per task.** "New chat" in the app for each review and each issue. Don't reuse.
- **Don't `cd`.** `cc` puts Claude in its folder; the app is pinned to Codex's folder; `pp` puts you in yours.

## The loop (per issue)

1. **Kickoff.** In the implementer's place (**claude** or **codex**), paste the kickoff prompt for the issue. It states a plan and waits.
2. **Approve.** Read the plan. Say "approve" or say what to change.
3. **Wait.** It works, opens a PR, and stops. It tells you the PR number.
4. **Review.** In the *other* place, start a new session or chat and paste the review prompt with that PR number.
5. **Fix, if needed.** If the reviewer wants changes, go back to the implementer's session and paste the "address review" prompt. Then repeat step 4.
6. **Ship.** When the reviewer says it would merge: in **me**, run `ship <PR number>`.
7. **Close.** `/exit` the Claude session if Claude was the implementer. Next issue.

Two issues can be in flight at once, one per lane. Each one follows its own loop.

## The prompts

**Kickoff (Claude Code, in claude):**
```
Issue <N-1> has merged. Read AGENTS.md, then docs/PRD.md, PRODUCT.md, and DESIGN.md. You are the web lane.
Take Issue <N>: <title>. Before writing anything, tell me your plan as a short numbered list and wait for my approval.
When the issue is done, open a PR and stop; Codex reviews it.
```

**Kickoff (Codex, in codex, New chat):**
```
Read AGENTS.md, then docs/PRD.md and docs/SCENE-CONTRACT.md. You are the 3D and data lane.
Take Issue <N>: <title>. Before writing anything, confirm you're in the PauPortfolio-codex worktree, tell me your plan as a short numbered list, and wait for my approval.
When the issue is done, open a PR and stop; Claude Code reviews it.
```

**Review (either, in the other place, fresh session):**
```
Review PR #<n> cold. You have no prior context on this change; read the PR description, the full diff, and AGENTS.md's definition of done. If a previous review comment lists requested changes, confirm each is actually resolved in the current commits. Check the preview URL. Post your verdict with gh pr review as a comment, and state plainly whether you would merge it. Be specific and short.
```

**Address review (implementer's existing session):**
```
The reviewer commented on PR #<n> and requested changes. Read the comment with gh, address every point on the same branch, push, and tell me when it's done. If you disagree with a point, say why instead of changing it.
```

## When something looks off

- Not sure where the worktrees are: `sync`, read the status block at the end.
- A merge is blocked: `gh pr view <n> --web`, look at the merge box. `ship` already resolves threads; anything else, read the message.
- An agent seems to be in the wrong folder: ask it `git rev-parse --show-toplevel`. AGENTS.md tells it to check this itself at session start once Issue 2 merges.
