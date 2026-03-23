# Diagnostic Consultation Skill

## Purpose
Run the pump-station consultation flow in a repeatable way.

## Steps
1. Validate the request payload contains `symptom` and structured `responses` when available.
2. Read the Pump Specialist brief before returning domain guidance.
3. Use the council mix appropriate to the symptom.
4. Return structured output with probable causes, next checks, parts, escalation criteria, close-out note, and alternative paths.
5. If required context is missing or contradictory, set uncertainty explicitly and recommend the safest next action.

## Escalation rule
Escalate when uncertainty is high and the next decision would be unsafe or irreversible.
