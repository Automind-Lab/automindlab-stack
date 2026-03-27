# Operator Surface Contract

This document defines the reusable operator/admin surface for `automindlab-stack`.

## Why this exists

Recent `bmo-stack` work added a Windows workstation app with a structured action manifest and supervised command model.
The enterprise translation here is not a desktop shell.
The enterprise translation is a UI-neutral manifest that any future admin surface can consume.

## Source of truth

- `config/operator/operator-surface-manifest.json`
- `config/operator/operator-command-policy.json`
- `config/schemas/operator-surface-manifest.schema.json`
- `config/schemas/operator-command-policy.schema.json`
- `scripts/validate-operator-surfaces.mjs`
- `scripts/run-operator-action.mjs`

## What belongs here

This manifest can describe:

- operator-visible document shortcuts
- approved validation and recovery actions
- runtime profile references
- skill shortcuts for local playbooks
- reusable service and contract surfaces

This repo does not ship a direct AutoMindLab desktop app here.
Any future desktop, web admin console, or host shell should consume this contract instead of becoming the source of truth itself.

## Current action model

Actions are intentionally limited to reviewed repo entrypoints such as:

- `node scripts/validate-repo-operating-system.mjs`
- `bash ./scripts/worker-status.sh`
- `node scripts/validate-capability-intake.mjs`
- `npm test --prefix services/diagnostic`
- `bash ./scripts/configure-openclaw-agents.sh`

Prompt-required actions remain explicit in the manifest and policy.

## Runner behavior

Use:

```bash
node scripts/run-operator-action.mjs list
node scripts/run-operator-action.mjs describe doctor-plus
node scripts/run-operator-action.mjs run doctor-plus
node scripts/run-operator-action.mjs run configure-openclaw-agents --approve
```

The runner will:

- refuse unknown actions
- check the manifest-backed approval mode
- require `--approve` for prompt-gated actions
- refuse denied actions

## Translation rule

The direct BMO Windows workstation remains a BMO-local/operator surface.
What enters AutoMindLab is the reusable contract behind it:

- typed operator actions
- typed approval policy
- repo-visible validation
- runtime-owner boundaries

## Current translation status

- translated from BMO: manifest-backed action discovery, approval-gated action execution, document shortcuts, skill shortcuts
- intentionally rejected from direct import: WinForms UI, local task shell ownership, local app packaging
