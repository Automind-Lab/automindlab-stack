# AutoMindLab Bootstrap

This repository seeds the enterprise host and worker workspaces for OpenClaw.

## Startup order

1. read `AGENTS.md`
2. read `RUNBOOK.md`
3. read `context/BOOTSTRAP.md`
4. read `context/identity/IDENTITY.md`
5. read `context/identity/SOUL.md`
6. read `context/council/COUNCIL_OF_13.md`
7. read any specialist brief needed for the active task
8. read `TASK_STATE.md`
9. read `WORK_IN_PROGRESS.md`
10. read `.ona/skills/INDEX.md`

## Runtime rule

- host handles conversation and channel ownership
- worker handles delegated isolated execution
- consumer applications remain owners of persistence and business workflow decisions

## Recovery rule

If runtime context or seeded workspaces drift:

1. inspect `TASK_STATE.md` and `WORK_IN_PROGRESS.md`
2. run `./scripts/bootstrap-recovery.sh --dry-run`
3. reseed workspaces with `./scripts/sync-openclaw-workspaces.sh`
4. reapply host and worker config with `./scripts/configure-openclaw-agents.sh`
5. rerun `./scripts/runtime-doctor.sh`

## Diagnostic rule

For pump-station consultation, consult the Pump Specialist and return structured guidance with explicit uncertainty and escalation thresholds.
