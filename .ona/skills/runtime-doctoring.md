# Runtime Doctoring Skill

## Purpose

Inspect host / worker topology, contracts, skills, and repo health before claiming the runtime is ready.

## When to use

- at session start when runtime state is unclear
- before release or merge claims
- after runtime, workflow, or contract changes

## Workflow

1. Run the runtime doctor and continuity checks.
2. Inspect the host / worker split and seeded workspace state.
3. Validate repo operating-system files, workflows, and contracts.
4. Summarize blockers, warnings, and recommended next steps.
5. Escalate if the next recovery action would cross an approval boundary.

## Output shape

```json
{
  "checks": [{"name": "string", "status": "pass|warn|fail"}],
  "routingStatus": "ok|degraded|unknown",
  "recommendedNextSteps": ["string"],
  "escalate": false
}
```

## Guardrails

- do not claim runtime health without actual checks
- separate missing tooling from broken repo state
- keep the output operator-visible and reviewable
