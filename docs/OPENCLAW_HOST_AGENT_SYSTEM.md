# OpenClaw Host / Agent System

This repository uses a split OpenClaw topology for AutoMindLab.

## Intended topology

- `automind-host`
  - host-facing conversational runtime
  - default agent
  - sandbox mode `off`
  - owns external channel bindings

- `automind-worker`
  - dedicated sandbox worker
  - sandbox mode `all`
  - sandbox scope `agent`
  - executes delegated isolated work

## Why this split exists

The host should stay stable, conversational, and channel-safe.
The worker should handle isolated execution without becoming the public face of the runtime.

## One-shot setup

From the repo root:

```bash
./scripts/configure-openclaw-agents.sh
```

Then restart the gateway:

```bash
openclaw gateway restart
```

## What the script does

- seeds OpenClaw workspaces from repository bootstrap files
- creates a dedicated host workspace and worker workspace
- writes host and worker identities
- configures `automind-host` with sandbox mode `off`
- configures `automind-worker` with sandbox mode `all`
- restores front-door bindings to the host agent

## Delegation protocol

The host-to-worker handoff is documented in `docs/WORKER_DELEGATION_PROTOCOL.md`.
Use that protocol whenever the host delegates isolated execution to the worker.

The runtime profile source of truth also lives in `docs/RUNTIME_PROFILE_COMPATIBILITY.md` and `config/runtime-profiles/openclaw.enterprise-host-worker.json`.

## Verification

```bash
openclaw agents list --bindings
openclaw agents bindings
openclaw sandbox explain
node scripts/openclaw-fixture-smoke.mjs
```

Expected shape:
- `automind-host` exists and is the default agent
- `automind-host` shows effective sandbox mode `off`
- `automind-worker` exists as a separate worker agent
- external bindings remain on the host agent
- fixture smoke passes when using the repo-provided mock OpenClaw harness

## Optional auxiliary services

`deployments/openclaw/compose.yaml` contains optional auxiliary services only.
It does not create the OpenClaw worker itself.
The worker is created and used through OpenClaw.
