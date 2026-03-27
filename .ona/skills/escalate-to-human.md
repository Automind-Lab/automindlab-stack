# Escalate to Human Skill

## Purpose

Define a safe handoff when the runtime should not act on its own guidance.

## When to use

- uncertainty is high and the next action is irreversible
- a specialist safety rule is triggered
- required context remains missing after one retry
- the worker returns `escalate: true`

## Workflow

1. Identify why the runtime should stop short of autonomous action.
2. State the missing context or approval boundary explicitly.
3. Return the safest immediate next action.
4. Mark the output for human review.

## Output shape

```json
{
  "escalate": true,
  "reason": "string",
  "missingContext": ["string"],
  "safeAction": "string"
}
```

## Guardrails

- do not bury the escalation behind optimistic wording
- do not imply confirmed diagnosis or approval
- keep the safe action specific enough for an operator to execute or delegate
