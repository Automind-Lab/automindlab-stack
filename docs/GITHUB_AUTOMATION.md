# GitHub Automation

This repository includes a practical automation baseline that matches the current AutoMindLab repo surfaces.

## Contract

The current machine-readable automation contract lives in:

- `config/github/automation-contract.json`
- `.github/autonomy/execution-policy.json`

Validate it with:

- `node scripts/validate-github-automation.mjs`
- `node scripts/github-autonomy-selftest.mjs`

## Workflows

### `issue-to-pr.yml`

The issue-to-PR scaffold is governed by the automation contract and policy file.
It uses:

- `scripts/github-issue-planner.sh`
- `scripts/github-policy-check.sh`
- `scripts/github-change-executor.sh`
- `scripts/github-verifier.sh`
- `scripts/render-github-plan-comment.mjs`
- `scripts/render-github-pr-body.mjs`

### `ci.yml`

Runs on pushes and pull requests.
It checks:

- diagnostic package metadata
- JavaScript syntax
- exact council seat count
- Pump Specialist markers
- repo operating-system files
- skill registry and baseline pack
- routine pack
- workflow configs
- worker delegation contracts
- GitHub automation contract and self-test
- downstream sync manifest
- OpenClaw fixture smoke
- diagnostic install and tests

### `repo-health.yml`

Runs weekly and on demand.
It checks:

- required runtime directories
- exact council seat count
- Pump Specialist markers
- repo operating-system validator
- workflow validator
- worker delegation contract validator
- diagnostic module resolution

### `ona-skills-validation.yml`

Validates:

- `.ona/skills/index.json`
- skill markdown structure
- `config/skills/automindlab-baseline-pack.json`

### `workflow-config-validation.yml`

Validates:

- `config/workflows/*.json`
- entry-skill references
- worker step timeouts
- output declarations

### `example-contract-validation.yml`

Validates:

- worker delegation contract examples
- diagnostic example contracts

### `codeql.yml`

Runs CodeQL analysis for JavaScript.

## Dependabot

Dependabot is enabled for:

- GitHub Actions
- npm dependencies in `services/diagnostic`

## Goal

Keep the runtime coherent, testable, and easier to maintain without hiding operational drift in stale docs or one-off scripts.
