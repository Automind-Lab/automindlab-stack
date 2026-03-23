# Escalate to Human Skill

## Purpose
Define a safe handoff when the runtime should not act on its own guidance.

## Trigger conditions
- uncertainty is high and the next action is irreversible
- a specialist safety rule is triggered
- required context remains missing after one retry
- the worker returns `escalate: true`

## Output shape
```json
{
  "escalate": true,
  "reason": "string",
  "missingContext": ["string"],
  "safeAction": "string"
}
```

## Rule
When escalating, return the safest immediate action and do not imply confirmed diagnosis or approval.
