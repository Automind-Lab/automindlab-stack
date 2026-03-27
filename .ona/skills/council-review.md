# Council Review Skill

## Purpose

Run a small, explicit multi-seat review when a task benefits from competing strategic lenses before the host returns a final answer.

## When to use

- a recommendation has major tradeoffs
- the host needs taste, systems, and execution viewpoints together
- a specialist output needs strategic review before escalation or rollout

## Workflow

1. Define the decision to review.
2. Select 2-4 council seats that materially change the answer.
3. Record each seat's strongest argument in one paragraph or less.
4. Synthesize conflicts into a final recommendation.
5. If no synthesis is safe, escalate with explicit uncertainty.

## Output shape

```json
{
  "decision": "string",
  "seatReviews": [
    {"seat": "string", "position": "string", "risk": "string"}
  ],
  "synthesis": "string",
  "confidence": "low|medium|high",
  "escalate": false
}
```

## Guardrails

- do not invoke the full council by default
- prefer small, useful disagreement over theatrical debate
- keep the host responsible for the final output
