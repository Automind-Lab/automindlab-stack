# GitHub Automation

This repository ships with a small but useful GitHub automation stack.

## Included workflows

### `ci.yml`
Runs on pushes and pull requests.
Checks:
- diagnostic-service package metadata
- JavaScript syntax for the diagnostic service
- council seat count
- presence of key runtime files

### `repo-health.yml`
Runs on a weekly schedule and on demand.
Checks:
- required directories exist
- council seat count is visible in logs
- key shell scripts parse correctly

### `codeql.yml`
Runs CodeQL analysis for JavaScript.
This gives the repository a baseline static-analysis security pass on the service code.

## Dependabot
Dependabot is configured for:
- GitHub Actions dependencies
- npm dependencies under `services/diagnostic`

## Why this is the right baseline
This project currently needs:
- fast validation of repository shape
- basic security analysis
- regular dependency hygiene
- operational sanity checks for runtime scaffolding

That gives good signal without turning the repo into CI theater.
