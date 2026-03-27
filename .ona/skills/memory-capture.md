# Memory Capture Skill

## Purpose

Create small, reusable runtime memory records from completed tasks, incidents, and validated operator knowledge.

## When to use

- after a successful diagnostic consultation
- after a repeated operator decision pattern is confirmed
- after a workflow produces reusable guidance

## Workflow

1. Capture only the reusable part of the outcome.
2. Attach source references or verification notes.
3. Record confidence and scope explicitly.
4. Keep the memory short enough to rehydrate quickly.

## Output shape

```json
{
  "id": "string",
  "type": "incident|pattern|playbook|operator-note",
  "summary": "string",
  "sourceRefs": ["string"],
  "confidence": "low|medium|high",
  "scope": "runtime|diagnostic|operator"
}
```

## Guardrails

- memory must be sourced from observed outcomes or validated guidance
- do not store secrets or private credentials in runtime memory
- memory is supporting context, not a substitute for live verification
