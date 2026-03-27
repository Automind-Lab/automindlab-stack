# Git Hooks

This directory holds tracked local hooks for `automindlab-stack`.

## Current hooks

- `post-push`
  - checks whether the current non-default branch already has a PR
  - if not, it opens a draft PR through GitHub CLI

## Install

Run:

```bash
bash ./scripts/install-git-hooks.sh
```

This sets:

- `git config core.hooksPath .githooks`

The hook is intentionally local to the clone.
It is tracked here so the behavior is reviewable and reusable across machines.
