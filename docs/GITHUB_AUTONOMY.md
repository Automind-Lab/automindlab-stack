# GitHub Autonomy for AutoMindLab

This document defines the GitHub-first execution model for `automindlab-stack`.

## Goal

Operate enterprise runtime upgrades from GitHub issues and pull requests instead of ad hoc local work.

## Contract surfaces

- `config/github/automation-contract.json`
- `.github/autonomy/execution-policy.json`
- `scripts/validate-github-automation.mjs`
- `scripts/github-autonomy-selftest.mjs`

## Control loop

1. Open or label an issue.
2. Run the issue-to-PR workflow.
3. Planner worker produces a scoped plan and posts it back to the issue.
4. Policy worker evaluates whether the requested change is allowed for autonomous execution.
5. Executor worker runs on a self-hosted runner when autonomy is enabled.
6. Verifier worker posts a structured verification result.
7. A draft PR is opened.
8. After merge, the workspace sync workflow updates the local OpenClaw workspaces.

## Required labels

- `autonomy:ready`
- `autonomy:needs-human`
- `risk:high`

## Required repo variables

- `AUTOMIND_AUTONOMY_EXECUTION_ENABLED`
- `AUTOMINDLAB_GITHUB_AUTONOMY_EXECUTOR`
- `AUTOMIND_WORKSPACE_SYNC_ENABLED`
- `AUTOMIND_HOST_WORKSPACE`
- `AUTOMIND_WORKER_WORKSPACE`
- `OPENCLAW_HOME`

## Runner requirements

The execution and sync jobs must run on a self-hosted runner that has:

- git
- gh
- bash
- node
- rsync
- access to the local OpenClaw workspaces
- any local executor command referenced by `AUTOMINDLAB_GITHUB_AUTONOMY_EXECUTOR`

## Safety rules

- Never write directly to the default branch.
- Never auto-apply secret, tenant-scope, or production-only changes.
- Always run policy evaluation before execution.
- Always verify before opening a PR.
- Always preserve protected runtime state during workspace sync.
- Scopes blocked by `.github/autonomy/execution-policy.json` require human review even if the issue carries `autonomy:ready`.

## Current scaffold

- `.github/workflows/issue-to-pr.yml`
- `.github/workflows/workspace-sync-on-merge.yml`
- `scripts/github-issue-planner.sh`
- `scripts/github-policy-check.sh`
- `scripts/github-change-executor.sh`
- `scripts/github-verifier.sh`
- `scripts/validate-repo-operating-system.mjs`
- `scripts/validate-workflows.mjs`
- `scripts/sync-openclaw-workspaces.sh`

## Validation

- `node scripts/validate-github-automation.mjs`
- `node scripts/github-autonomy-selftest.mjs`
- `node scripts/validate-downstream-sync.mjs`
