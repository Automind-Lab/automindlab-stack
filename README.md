# AutoMindLab Stack

AutoMindLab Stack is the enterprise runtime, host/worker system, and reusable contract layer for business-facing OpenClaw deployments.

`bmo-stack` is a reference implementation only.
This repository owns the AutoMindLab-native translation of the useful operating-system, diagnostic, skill, and automation capabilities that matter here.

## Startup surface

Read these first when operating AutoMindLab from this repo:

1. `AGENTS.md`
2. `RUNBOOK.md`
3. `context/BOOTSTRAP.md`
4. `context/identity/IDENTITY.md`
5. `context/identity/SOUL.md`
6. `context/council/COUNCIL_OF_13.md`
7. `TASK_STATE.md`
8. `WORK_IN_PROGRESS.md`
9. `.ona/skills/INDEX.md`
10. `docs/NETWORK_POLICY.md` when the task touches external access or approvals

## What this repository owns

- the Council of 13 enterprise council
- specialist agents such as Pump Specialist
- the AutoMindLab OpenClaw host / worker split
- repo operating-system files such as the runbook, task state, and routines pack
- runtime diagnostics, recovery flows, and workflow validation
- GitHub automation for validation and repository health
- reusable service contracts for downstream consumer products

## Boundary model

### AutoMindLab Stack owns

- runtime and agent execution
- council and specialist routing
- enterprise-side APIs and operational hardening
- host and worker runbooks, diagnostics, and policies

### Consumer applications own

- user experience
- business records and persistence
- approvals, reporting, and workflow outcomes

### `bmo-stack` is

- an architectural and operational reference point
- not the owner of the AutoMindLab production council
- not the home of AutoMindLab consumer UX or downstream persistence

## Repo operating system

The practical operating system for this repo now lives in:

- `RUNBOOK.md`
- `TASK_STATE.md`
- `WORK_IN_PROGRESS.md`
- `routines.md`
- `config/routines/automindlab-core-routines.json`
- `config/skills/automindlab-baseline-pack.json`

These files exist to make startup order, current state, recovery steps, and reusable routine selection explicit and reviewable.

## Important paths

- startup and continuity
  - `AGENTS.md`
  - `RUNBOOK.md`
  - `TASK_STATE.md`
  - `WORK_IN_PROGRESS.md`
  - `routines.md`
- runtime context
  - `context/BOOTSTRAP.md`
  - `context/identity/`
  - `context/council/`
- skills and workflows
  - `.ona/skills/`
  - `config/skills/`
  - `config/workflows/`
- contracts and services
  - `config/schemas/`
  - `config/examples/`
  - `services/diagnostic/`
- policy and runbooks
  - `docs/OPENCLAW_HOST_AGENT_SYSTEM.md`
  - `docs/WORKER_DELEGATION_PROTOCOL.md`
  - `docs/NETWORK_POLICY.md`
  - `docs/REPO_BOUNDARY_POLICY.md`

## Core commands

- `./scripts/runtime-doctor.sh`
- `./scripts/worker-status.sh`
- `./scripts/bootstrap-recovery.sh --dry-run`
- `node scripts/validate-repo-operating-system.mjs`
- `node scripts/validate-workflows.mjs`
- `node scripts/validate-runtime-contracts.mjs`
- `node scripts/automind-skill-pack.mjs list`
- `node scripts/automind-routines.mjs list`
- `npm test --prefix services/diagnostic`

## Current runtime surfaces

### Council of 13

The enterprise council is made of 13 original operating profiles inspired by:
Nikola Tesla, Ram Dass, Leonardo da Vinci, Pablo Picasso, Bob Ross, Albert Einstein, Steve Jobs, Napoleon Bonaparte, Elon Musk, Carl Jung, Marcus Aurelius, Robert Cialdini, and David Goggins.

### OpenClaw host / worker topology

The intended topology is:

- `automind-host` = host-facing conversational runtime, sandbox `off`
- `automind-worker` = dedicated sandbox worker, sandbox `all`

### FLOWCOMMANDER diagnostic consultation

This repository packages the AutoMindLab-side diagnostic consultation surface for FLOWCOMMANDER and similar products.
The diagnostic service exposes `POST /api/diagnose` and wraps all responses in a versioned contract envelope (`contract_version: 2026-03-24.v1`).
Contract schemas live in `services/diagnostic/contracts/`.
See `docs/FLOWCOMMANDER_INTEGRATION_CONTRACT.md` for the full request and response shapes.

### Worker delegation contract

The host / worker handoff is documented and typed through:

- `docs/WORKER_DELEGATION_PROTOCOL.md`
- `config/schemas/worker-task.schema.json`
- `config/schemas/worker-result.schema.json`
- `config/examples/worker-task.example.json`
- `config/examples/worker-result.example.json`

## Translation rules

- BMO local routines become AutoMindLab host / worker runbooks or machine-readable routines.
- BMO skill-pack ideas become `.ona/skills/` guidance and enterprise baseline packs.
- BMO runtime doctoring becomes host / worker diagnostics and routing verification.
- BMO network policy becomes enterprise approval and escalation guidance.
- BMO local operator UX and workstation-only assumptions do not get copied into this repo unless they back a real enterprise runtime surface.

## Design rules

- runtime-side output is advisory unless a consumer product explicitly persists it
- safety, escalation, and uncertainty should always be explicit
- specialist guidance should stay structured and reviewable
- host and worker responsibilities should remain separate
