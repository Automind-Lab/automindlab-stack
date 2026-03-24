# Memory Capture Skill

## Purpose
Create small, reusable runtime memory records from completed tasks, incidents, and validated operator knowledge.

## When to use
- after a successful diagnostic consultation
- after a repeated operator decision pattern is confirmed
- after a workflow produces reusable guidance

## Record shape
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

## Rules
- memory must be sourced from observed outcomes or validated guidance
- memory entries should be short enough to rehydrate quickly
- do not store secrets or private credentials in runtime memory
