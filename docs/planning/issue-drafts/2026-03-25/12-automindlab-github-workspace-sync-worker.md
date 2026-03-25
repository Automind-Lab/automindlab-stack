# Title

github: add GitHub-to-OpenClaw workspace sync worker for AutoMindLab

# Labels

github, automation, sync, automindlab, enterprise, priority:P1

## Summary
Add a sync worker that keeps the GitHub repo state and the AutoMindLab OpenClaw host/worker workspaces aligned after approved repository changes.

## Problem
The repo can seed and configure host and worker workspaces, but the desired GitHub-first autonomous workflow needs the runtime workspace to update automatically after merge.

## Goal
Ensure GitHub becomes the source of operational change while runtime workspaces stay current automatically.

## Scope
- pull latest approved repo state after merge
- sync context and agent guidance files into OpenClaw workspaces
- post status back to GitHub

## Proposed files
- `.github/workflows/workspace-sync-on-merge.yml`
- `scripts/sync-openclaw-workspaces.sh`
- `docs/WORKSPACE_SYNC_AUTOMATION.md`

## Tasks
- [ ] Define what files are synced to host and worker workspaces
- [ ] Define merge-triggered sync behavior
- [ ] Add status output for success, partial sync, and failure
- [ ] Document how sync avoids overwriting protected runtime state
- [ ] Add a manual re-sync trigger for recovery

## Acceptance criteria
- [ ] Merged GitHub changes can update the OpenClaw workspace automatically
- [ ] Sync status is visible in GitHub
- [ ] Protected runtime state is not clobbered by repo sync
- [ ] Operators can re-run sync safely
