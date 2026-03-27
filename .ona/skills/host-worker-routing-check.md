# Host Worker Routing Check Skill

## Purpose

Verify that host / worker responsibilities and front-door bindings remain aligned with AutoMindLab's intended topology.

## When to use

- after configuring agents
- before claiming runtime parity or readiness
- after merges, reseeds, or routing-related incidents

## Workflow

1. Inspect the expected host and worker IDs.
2. Verify the host is the default agent with sandbox mode `off`.
3. Verify the worker remains isolated with sandbox mode `all` and scope `agent`.
4. Confirm front-door bindings still belong to the host.
5. Return issues, uncertainty, and next steps in structured form.

## Output shape

```json
{
  "hostAgent": "string",
  "workerAgent": "string",
  "bindingOwner": "string",
  "issues": ["string"],
  "uncertainty": "low|medium|high",
  "escalate": false
}
```

## Guardrails

- do not claim routing is healthy unless config or bindings were actually inspected
- do not auto-move bindings without explicit operator intent
- escalate when the host is not the clear front-door owner
