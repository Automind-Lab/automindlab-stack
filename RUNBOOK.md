# Runbook

This is the operator runbook for the AutoMindLab enterprise runtime repo.

## Source of truth

- `automindlab-stack` owns the host/worker runtime topology, council routing, specialist briefs, and reusable enterprise-side contracts.
- downstream products own user experience, persistence, and business workflow outcomes.
- `bmo-stack` is a reference implementation for practical patterns, not the owner path for AutoMindLab runtime behavior.
- `context/` is the canonical runtime context.
- `config/` holds machine-readable routines, skill packs, schemas, examples, and workflow definitions.
- `config/intake/` is the source of truth for external capability review state.
- `config/runtime-profiles/` is the source of truth for OpenClaw/NemoClaw runtime topology contracts.

## Restart recovery protocol

Read these in order at session start:

1. `AGENTS.md`
2. `RUNBOOK.md`
3. `context/BOOTSTRAP.md`
4. `context/identity/IDENTITY.md`
5. `context/identity/SOUL.md`
6. `context/council/COUNCIL_OF_13.md`
7. relevant specialist brief for the active task
8. `TASK_STATE.md`
9. `WORK_IN_PROGRESS.md`
10. `.ona/skills/INDEX.md`
11. `docs/REPO_BOUNDARY_POLICY.md` for donor or downstream translation work
12. `docs/NETWORK_POLICY.md` when the task touches external access or automation
13. `docs/CAPABILITY_INTAKE_POLICY.md` when reviewing outside tools, skills, or source repos
14. `docs/RUNTIME_PROFILE_COMPATIBILITY.md` when runtime topology or platform support changes

Then:

- check `git status` before asking anyone to restate context
- prefer `routines.md` over ad hoc troubleshooting
- if the active checkout is a seeded OpenClaw workspace, reseed it before claiming files are missing:
  - `./scripts/bootstrap-recovery.sh --dry-run`
  - `./scripts/sync-openclaw-workspaces.sh`
- resume interrupted work when `TASK_STATE.md` says it is safe

## Checkpoint protocol

Update `TASK_STATE.md` and `WORK_IN_PROGRESS.md`:

- before long-running tasks
- after major implementation steps
- before opening or pushing a review branch
- after failed or interrupted operations

Each checkpoint should include:

- timestamp
- active repo
- branch
- files touched
- last successful step
- next intended step
- verification complete
- manual steps remaining
- safe to resume

## Routine priority

Use these before ad hoc debugging when they fit:

1. `make doctor-plus`
2. `make worker-status`
3. `make runtime-doctor`
4. `make bootstrap-recovery`
5. `make workflow-validate`
6. `make skill-pack`
7. `make github-automation-validate`
8. `make downstream-sync-validate`
9. `make capability-intake-validate`
10. `make runtime-profile-validate`
11. `make runtime-fixture-smoke`

## Verification protocol

Before claiming completion:

- verify the owner path
- verify the requested capability exists in AutoMindLab-native form
- run the relevant validators and tests
- confirm contracts and docs still match runtime behavior
- confirm new external capabilities have intake records before calling them approved
- confirm runtime profile status still matches the actual evidence level
- run `node scripts/openclaw-fixture-smoke.mjs` when host/worker setup or workspace seeding changed
- state blockers and caveats explicitly

## Routing model

1. `automind-host` receives the task and decides whether worker isolation is needed.
2. `automind-worker` executes bounded isolated work through the delegation contract.
3. council and specialist output stay advisory and structured.
4. high-uncertainty or irreversible paths escalate to a human operator.
5. downstream products consume contracts and guidance, but keep their own persistence and business decisions.
