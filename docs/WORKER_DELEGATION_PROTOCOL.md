# Worker Delegation Protocol

This document makes the host-to-worker handoff explicit for AutoMindLab.

## Task shape

The host should delegate isolated work as structured JSON.
The canonical schema is `config/schemas/worker-task.schema.json`.

Example:

```json
{
  "taskId": "routing-check-20260327-001",
  "type": "host-worker-routing-check",
  "input": {
    "expectedHostAgent": "automind-host",
    "expectedWorkerAgent": "automind-worker"
  },
  "contextRefs": [
    "AGENTS.md",
    "docs/OPENCLAW_HOST_AGENT_SYSTEM.md",
    "docs/WORKER_DELEGATION_PROTOCOL.md"
  ],
  "timeoutMs": 30000,
  "requestedBy": "automind-host",
  "approvalMode": "implicit-safe"
}
```

## Result shape

The worker should return structured output with explicit uncertainty.
The canonical schema is `config/schemas/worker-result.schema.json`.

Example:

```json
{
  "taskId": "routing-check-20260327-001",
  "status": "partial",
  "output": {
    "hostAgent": "automind-host",
    "workerAgent": "automind-worker",
    "bindingOwner": "automind-host",
    "issues": [
      "Worker workspace was missing the latest runbook copy before reseed."
    ]
  },
  "uncertainty": {
    "level": "medium",
    "reason": "Bindings look correct, but the seeded workspace was not fully current before recovery.",
    "missingContext": ["Fresh gateway restart confirmation"]
  },
  "escalate": true,
  "safeAction": "Route the result to a human operator before claiming the runtime is fully ready.",
  "escalation": {
    "reason": "Runtime recovery changed a seeded workspace and still needs operator-visible verification.",
    "missingContext": [
      "Gateway restart result",
      "Post-restart binding snapshot"
    ],
    "safeAction": "Run worker-status after restart and review the routing snapshot."
  }
}
```

## Rules

- the worker does not accept direct external-channel requests
- the host must review any worker result with `escalate: true`
- the worker should return partial output on timeout instead of silently failing
- uncertainty must be explicit when data is missing, contradictory, or safety-critical
- the host remains responsible for final external messaging and irreversible actions

## Related

- `AGENTS.md`
- `docs/OPENCLAW_HOST_AGENT_SYSTEM.md`
- `docs/RUNTIME_PROFILE_COMPATIBILITY.md`
- `config/examples/worker-task.example.json`
- `config/examples/worker-result.example.json`
