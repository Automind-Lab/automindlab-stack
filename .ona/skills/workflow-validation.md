# Workflow Validation Skill

## Purpose

Validate workflow JSON against the current skills registry, delegation rules, and output discipline.

## When to use

- after changing `.ona/skills/`
- after changing `config/workflows/`
- before merge or autonomy runs that depend on workflow definitions

## Workflow

1. Validate the skills registry and skill file structure.
2. Validate workflow entry skills, step shapes, timeouts, and outputs.
3. Validate the worker delegation contract examples.
4. Return failures and follow-up actions in a structured list.

## Output shape

```json
{
  "validatedWorkflows": ["string"],
  "failures": ["string"],
  "followups": ["string"],
  "escalate": false
}
```

## Guardrails

- do not treat parse success as full runtime proof
- fail loudly when a workflow points at a missing skill
- keep validation focused on the repo surfaces AutoMindLab actually owns
