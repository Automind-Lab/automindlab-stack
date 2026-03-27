# Work In Progress

Last updated: 2026-03-27 14:05 UTC

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
- tighten workflow, GitHub automation, and downstream contract validation around the current repo surfaces
- add a reusable fixture-based OpenClaw smoke harness so host/worker proof no longer depends entirely on a live local install
- complete repo-side proof checks and record the remaining live-gateway gap honestly
- add governed capability-intake catalogs so external parity work cannot bypass enterprise review
- add explicit OpenClaw/NemoClaw runtime-profile contracts with typed evidence status
- translate BMO's new workstation manifest and approval model into enterprise-neutral operator contracts instead of a local Windows shell

## Next milestone

- commit and push the operator-surface translation work
- continue the next BMO delta pass after the workstation-pattern tranche
- optionally rerun runtime doctor, worker status, and bootstrap recovery on a compatible OpenClaw host if live-gateway proof is required

## Risks and watchouts

- do not copy BMO local workstation UX into the enterprise runtime repo
- do not weaken host/worker separation while adding recovery helpers
- do not claim parity for any capability that is still doc-only or unvalidated
- do not imply NemoClaw is implemented beyond the contract/evidence level declared in `config/runtime-profiles/`
- do not let manifest-backed operator actions become a back door to unrestricted host execution
- be explicit that local proof now includes a reusable OpenClaw fixture smoke harness plus Git Bash shell checks, but still does not prove a real gateway instance because `openclaw` and seeded live workspaces are absent on this machine
