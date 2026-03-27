# routines.md

This is the quick-start map for AutoMindLab's preferred routines.
The machine-readable source lives in `config/routines/automindlab-core-routines.json`.

## Preferred routine order

1. `make doctor-plus`
   Broad repo and runtime sanity check.
2. `make worker-status`
   Fast host/worker routing and continuity status.
3. `make runtime-doctor`
   Validate OpenClaw topology, contracts, and key runtime surfaces.
4. `make bootstrap-recovery`
   Recover seeded workspaces and host/worker config after drift.
5. `make workflow-validate`
   Verify workflow files still match the skills registry and routing rules.
6. `make skill-pack`
   Inspect the current enterprise baseline skill pack before adding more capability.

## Translation reminder

Before importing a pattern from `bmo-stack`, ask:

- does this belong in an enterprise runtime repo
- should it become a host/worker routine, a reusable contract, or an operator runbook
- should it stay in `bmo-stack` because it is a local/operator-only surface
