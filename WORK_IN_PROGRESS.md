# Work In Progress

Last updated: 2026-03-28 02:31 UTC

## Current focus

- Active mission: hold the expanded Enterprise App Factory steady on `codex/enterprise-app-factory` now that the bounded council runtime, downloadable package flow, and ready-to-test operator handoff are implemented and verified.
- Why now: this branch now contains a second complete vertical slice, so the highest-value work is preserving truthful evidence about what is supported, what is intentionally constrained, and what a future live-model tranche would still need.
- Owner paths in play:
  - `AGENTS.md`
  - `README.md`
  - `RUNBOOK.md`
  - `routines.md`
  - `scripts/`
  - `.ona/skills/`
  - `config/`
- `docs/`
- `services/enterprise-app-factory/`
- `generated-apps/`

## Current work packet

- preserve the shipped operator console, API package, generated-app template, council runtime, schemas/examples, and sample workspace as the baseline
- keep the repo-native ownership line explicit: factory owns specs/council runs/jobs/artifacts, generated apps own business records and approval outcomes
- keep the capability matrix honest about bounded nested delegation versus full Codex parity
- leave the download archive path and handoff surfaces stable for immediate testing

## Next milestone

- optional review packaging on `codex/enterprise-app-factory`
- optional deeper live-model provider work, richer repair heuristics, or broader domain packs if requested
- otherwise preserve the current verified state as the branch baseline

## Risks and watchouts

- do not copy BMO local workstation UX into the enterprise runtime repo
- do not weaken host/worker separation while adding recovery helpers
- do not claim parity for any capability that is still doc-only or unvalidated
- do not imply NemoClaw is implemented beyond the contract/evidence level declared in `config/runtime-profiles/`
- do not let manifest-backed operator actions become a back door to unrestricted host execution
- do not turn generated or agent-produced output into committed business state without explicit downstream confirmation and persistence
- keep irreversible generation/export writes behind explicit approval data and visible audit logs
- keep Figma/design integration optional and adapter-based so app generation never blocks on external design tooling
- keep generated customer apps template-driven and editable instead of drifting toward one-off bespoke output
- do not imply full Codex parity unless the implemented capability is actually present and verified
- keep any council/agent sub-delegation policy constrained, typed, and operator-visible rather than unconstrained autonomy
- do not claim full multi-OS proof beyond Windows until macOS and Linux verification evidence exists
