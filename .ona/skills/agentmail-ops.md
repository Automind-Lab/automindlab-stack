# AgentMail Operations Skill

## Purpose

Review or expand the runtime-owned AgentMail email surface without overclaiming live mailbox readiness.

## When to use

- when mailbox identities, domain routing, or email approval policy change
- when a downstream product needs a typed email contract
- when operator-visible email readiness needs validation

## Workflow

1. Inspect `config/email/agentmail-runtime-manifest.json` and the related schemas.
2. Validate the mail contract and example envelopes.
3. Check whether the capability is still `user-declared`, `api-validated`, or stronger.
4. Summarize what is ready, what is only declared, and what still needs operator proof.
5. Escalate if the task would require live sending, domain changes, or secret provisioning.

## Output shape

```json
{
  "mailboxes": [{"id": "string", "evidenceStatus": "string"}],
  "domainStatus": [{"domain": "string", "evidenceStatus": "string"}],
  "readyForLiveUse": false,
  "recommendedNextSteps": ["string"],
  "escalate": true
}
```

## Guardrails

- do not claim live mailbox connectivity without API-backed proof
- do not store secrets in repo files
- keep outward-facing email actions host-owned and operator-visible
