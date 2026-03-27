# Runtime Profile Compatibility

This document makes AutoMindLab runtime ownership explicit across supported and planned runtime surfaces.

## Source of truth

- `config/runtime-profiles/openclaw.enterprise-host-worker.json`
- `config/runtime-profiles/nemoclaw.enterprise-host-worker.json`
- `config/schemas/runtime-topology-profile.schema.json`
- `scripts/validate-runtime-topology-profiles.mjs`

## Current profiles

- `OpenClaw`
  - status: `fixture-validated`
  - current repo support: bootstrap script, topology writer, runtime doctor, worker status flow, fixture smoke harness
  - evidence path: `scripts/configure-openclaw-agents.sh`, `scripts/runtime-doctor.sh`, `scripts/openclaw-fixture-smoke.mjs`

- `NemoClaw`
  - status: `contract-validated`
  - current repo support: typed topology contract only
  - evidence path: `config/runtime-profiles/nemoclaw.enterprise-host-worker.json` and `scripts/validate-runtime-topology-profiles.mjs`
  - explicit limitation: this repo does not claim a shipped NemoClaw gateway, bootstrap script, or live runtime proof

## Shared enterprise rules

- the host owns external channels
- the worker stays isolated and never becomes the default agent
- delegation uses `config/schemas/worker-task.schema.json` and `config/schemas/worker-result.schema.json`
- downstream products own persistence and business workflow outcomes
- irreversible actions require operator-visible escalation when uncertainty remains high

## Why profiles matter

Runtime profiles give downstream teams and operators a stable contract for:

- what topology AutoMindLab expects
- which runtime surface is actually implemented
- which validation level has been achieved
- what still remains advisory or unproven

## Validation

Run:

```bash
node scripts/validate-runtime-topology-profiles.mjs
```

For OpenClaw changes, also run:

```bash
node scripts/openclaw-fixture-smoke.mjs
```
