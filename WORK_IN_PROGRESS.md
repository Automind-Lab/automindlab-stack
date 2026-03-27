# Work In Progress

Last updated: 2026-03-27 12:16 UTC

## Current focus

- Active mission: translate the strongest practical capabilities from `bmo-stack` into AutoMindLab-native enterprise surfaces.
- Why now: the repo already had useful council, service, and workflow scaffolding, but it needed a stronger operating system, diagnostics layer, and policy surface to become reviewable and durable.
- Owner paths in play:
  - `AGENTS.md`
  - `README.md`
  - `RUNBOOK.md`
  - `routines.md`
  - `scripts/`
  - `.ona/skills/`
  - `config/`
  - `docs/`

## Current work packet

- strengthen startup and read-order guidance
- add root state discipline and machine-readable routines
- add enterprise skill-baseline guidance and stronger skill validation
- harden host/worker doctoring, routing visibility, and delegation contracts
- tighten workflow and contract validation around the current repo surfaces
- complete repo-side proof checks and record the remaining host-runtime gap honestly

## Next milestone

- review the diff
- package the change for PR
- run shell/OpenClaw checks on a compatible runtime host if full agent-path proof is required

## Risks and watchouts

- do not copy BMO local workstation UX into the enterprise runtime repo
- do not weaken host/worker separation while adding recovery helpers
- do not claim parity for any capability that is still doc-only or unvalidated
- be explicit that local proof here includes Git Bash syntax and smoke checks, but still does not prove a real OpenClaw host because `openclaw` and seeded workspaces are absent on this machine
