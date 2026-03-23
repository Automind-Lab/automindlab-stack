# GitHub Automation

This repository includes a practical automation baseline.

## Workflows

### `ci.yml`
Runs on pushes and pull requests.
It checks:
- diagnostic package metadata
- JavaScript syntax
- exact council seat count
- Pump Specialist markers
- diagnostic module resolution
- diagnostic install and tests
- presence of important runtime files

### `repo-health.yml`
Runs weekly and on demand.
It checks:
- required runtime directories
- exact council seat count
- Pump Specialist markers
- diagnostic module resolution
- shell script syntax

### `codeql.yml`
Runs CodeQL analysis for JavaScript.

## Dependabot
Dependabot is enabled for:
- GitHub Actions
- npm dependencies in `services/diagnostic`

## Goal
Keep the runtime coherent, testable, and easier to maintain.
