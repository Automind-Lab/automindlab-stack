# Work In Progress

Last updated: 2026-03-27 15:49 UTC

## Current focus

- Active mission: maintain a clean enterprise runtime baseline on `main` and only open a new tranche when there is a concrete next capability to add.
- Why now: the major enterprise translation work is merged, so the highest-value immediate work is keeping repo state truthful and starting future work from a clean baseline.
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

- keep the merged operating-system, validation, and donor-translation surfaces stable on `main`
- preserve honest evidence boundaries until live AgentMail and OpenClaw proof is gathered on a real runtime host
- start future work from a clean branch with commit, push, PR, and clean-tree discipline already installed

## Next milestone

- gather optional live AgentMail proof once credentials are available
- optionally rerun runtime doctor, worker status, and bootstrap recovery on a compatible OpenClaw host if live-gateway proof is required
- otherwise hold `main` clean until the next requested tranche

## Risks and watchouts

- do not copy BMO local workstation UX into the enterprise runtime repo
- do not weaken host/worker separation while adding recovery helpers
- do not claim parity for any capability that is still doc-only or unvalidated
- do not imply NemoClaw is implemented beyond the contract/evidence level declared in `config/runtime-profiles/`
- do not let manifest-backed operator actions become a back door to unrestricted host execution
- be explicit that local proof now includes AgentMail contract and live-check scaffolding plus a reusable OpenClaw fixture smoke harness and Git Bash shell checks, but still does not prove a real gateway instance or real inbox readiness because `openclaw`, seeded live workspaces, and AgentMail credentials are absent on this machine
