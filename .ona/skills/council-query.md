# Council Query Skill

## Purpose

Use the Council of 13 as a structured reasoning layer rather than decorative personalities.

## When to use

- a task needs a small lens mix before the host answers
- strategic tradeoffs are present but a full review loop is unnecessary
- a specialist output needs host-side synthesis instead of direct delivery

## Workflow

1. Identify the task type and choose only the council seats that materially help.
2. Compose a small lens mix instead of invoking the whole council by default.
3. Synthesize the result into a structured, advisory output.
4. State confidence and uncertainty explicitly when evidence is weak.
5. Route to a specialist brief when the problem is domain-specific.

## Output shape

```json
{
  "task": "string",
  "lenses": ["string"],
  "synthesis": "string",
  "confidence": "low|medium|high",
  "uncertainty": "low|medium|high",
  "escalate": false
}
```

## Guardrails

- do not invent seats outside the declared Council of 13
- do not present council reasoning as a confirmed field diagnosis
- keep outputs structured enough for host review and consumer use
