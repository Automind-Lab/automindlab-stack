# Operator Approval Policy

This document explains the approval posture for manifest-backed operator actions.

## Source of truth

- `config/operator/operator-command-policy.json`
- `config/operator/operator-surface-manifest.json`
- `scripts/validate-operator-surfaces.mjs`
- `scripts/run-operator-action.mjs`

## Goals

- keep operator actions explicit and reviewable
- allow safe validation paths without friction
- force approval for runtime-changing actions
- block broad or unsafe local shell behavior from becoming a default enterprise surface

## Approval modes

- `allow`
  - safe validation or inspection action
  - no extra confirmation required by the runner
- `prompt`
  - action changes runtime state, workspace state, or another bounded operational surface
  - runner requires `--approve`
- `deny`
  - action is not allowed through the manifest-backed operator path

## Current capability posture

- runtime inspection and validation: `allow`
- repo validation and service validation: `allow`
- governance validation: `allow`
- runtime reconfiguration: `prompt`
- repo mutation: `prompt`
- system install and elevation: `deny`

## Blocked command classes

The policy explicitly blocks patterns such as:

- destructive filesystem deletion
- silent execution-policy changes
- shell-expression injection
- raw system service mutation
- raw registry mutation
- destructive Git resets and cleans
- casual network mutation commands outside reviewed repo flows

## Enterprise boundary

This policy is the enterprise equivalent of BMO's local workstation approval map.
It should remain:

- repo-owned
- typed
- validator-backed
- safe by default

It should not become an unreviewed shortcut to full host control.
