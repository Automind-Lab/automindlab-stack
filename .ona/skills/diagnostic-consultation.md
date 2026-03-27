# Diagnostic Consultation Skill

## Purpose

Run the pump-station consultation flow in a repeatable, contract-safe way.

## When to use

- a downstream product or operator asks for advisory pump diagnosis
- the request includes a symptom and any available structured responses
- the host needs a structured specialist-style output instead of free-form troubleshooting notes

## Workflow

1. Validate the request payload contains `symptom` and structured `responses` when available.
2. Read the Pump Specialist brief before returning domain guidance.
3. Use the council mix appropriate to the symptom.
4. Return structured output with probable causes, next checks, parts, escalation criteria, close-out note, and alternative paths.
5. If required context is missing or contradictory, set uncertainty explicitly and recommend the safest next action.

## Output shape

```json
{
  "probableCauses": [{"cause": "string", "confidence": "high|medium|low"}],
  "nextChecks": [{"action": "string", "priority": "high|medium|low"}],
  "partsToConsider": [{"part": "string"}],
  "escalationCriteria": [{"condition": "string", "action": "string"}],
  "closeOutNote": "string",
  "alternativePaths": [{"name": "string", "trigger": "string"}]
}
```

## Guardrails

- keep the result advisory, not authoritative
- escalate when uncertainty is high and the next decision would be unsafe or irreversible
- do not imply field verification happened unless the input proves it
