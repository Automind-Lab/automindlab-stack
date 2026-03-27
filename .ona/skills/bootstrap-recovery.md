# Bootstrap Recovery Skill

## Purpose

Recover seeded OpenClaw workspaces and host/worker bootstrap state after drift, broken sync, or incomplete setup.

## When to use

- the host or worker workspace is missing key startup files
- a merge changed runbooks, skills, or context and the seeded workspaces are stale
- routing checks fail because workspaces or agent config drifted

## Workflow

1. Start with a dry run of `./scripts/bootstrap-recovery.sh --dry-run`.
2. Reseed the host and worker workspaces with `./scripts/sync-openclaw-workspaces.sh`.
3. Reapply the host/worker config with `./scripts/configure-openclaw-agents.sh`.
4. Rerun runtime doctoring and worker status checks.
5. Update `TASK_STATE.md` and `WORK_IN_PROGRESS.md` with the result.

## Output shape

```json
{
  "steps": [{"name": "string", "status": "planned|completed|skipped|failed"}],
  "restoredSurfaces": ["string"],
  "manualFollowups": ["string"],
  "escalate": false
}
```

## Guardrails

- do not overwrite downstream product data
- do not claim recovery succeeded until the doctor and routing checks are rerun
- escalate when recovery would require irreversible infrastructure or approval-boundary changes
