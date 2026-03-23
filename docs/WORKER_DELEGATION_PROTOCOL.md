# Worker Delegation Protocol

This document makes the host-to-worker handoff explicit for AutoMindLab.

## Payload shape

The host should delegate isolated work as structured JSON:

```json
{
  "taskId": "string",
  "type": "string",
  "input": {},
  "contextRefs": ["string"],
  "timeoutMs": 30000
}
```

## Response shape

The worker should return:

```json
{
  "taskId": "string",
  "status": "ok|timeout|error",
  "output": {},
  "uncertainty": "low|medium|high",
  "escalate": false,
  "safeAction": "string"
}
```

## Rules

- the worker does not accept direct external-channel requests
- the host must review any worker response with `escalate: true`
- the worker should return partial output on timeout instead of silently failing
- the host remains responsible for final external messaging and irreversible actions
