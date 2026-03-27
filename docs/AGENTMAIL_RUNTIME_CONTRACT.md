# AgentMail Runtime Contract

This document defines the AutoMindLab-owned enterprise email surface translated from `agentmail-to` tooling and API patterns.

## Why this belongs here

Agent-managed email can be a legitimate runtime capability when it is:

- typed and reviewable
- host-owned rather than directly exposed to worker or downstream shells
- explicit about mailbox identity, domain state, approval boundaries, and evidence level

This repo does not claim live mailbox readiness from documentation alone.
It records the contract, the declared identities, and the validation boundary.

## Source of truth

- `config/email/agentmail-runtime-manifest.json`
- `config/schemas/agentmail-runtime-manifest.schema.json`
- `config/schemas/agentmail-message-request.schema.json`
- `config/schemas/agentmail-message-result.schema.json`
- `config/examples/agentmail-message-request.example.json`
- `config/examples/agentmail-message-result.example.json`
- `config/examples/openclaw-agentmail-skill.example.json`
- `scripts/validate-agentmail-runtime.mjs`
- `scripts/agentmail-doctor.mjs`
- `scripts/agentmail-live-check.mjs`
- `docs/AGENTMAIL_OPENCLAW_SETUP.md`

## Declared identities and domain intent

The current manifest records:

- `prismtek@agentmail.to`
- `bmo-tron@agentmail.to`
- `prismtek.dev` as the intended custom routing domain

These are currently tracked as `user-declared` unless stronger API, DNS, or runtime proof exists.

## Translation of AgentMail into AutoMindLab form

Useful AgentMail capabilities become:

- mailbox and domain declarations in a runtime-owned manifest
- typed send/list/reply envelopes for downstream products
- OpenClaw setup guidance that keeps the runtime owner in control of credentials and approval boundaries
- operator-visible doctoring and validation
- read-only live provider checks when credentials are present
- explicit approval boundaries before any outbound or externally visible action

What does not belong here:

- hard-coded secrets
- silent background sending
- implicit domain verification claims
- direct worker ownership of externally visible mail actions

## Approval boundaries

- host review remains required for outbound send or reply operations
- worker output may recommend an email action, but it must not send directly
- user-declared mailbox or domain state is not production proof
- webhook or inbound automation setup should not proceed without a typed handler and review path

## Operator guidance

- run `node scripts/validate-agentmail-runtime.mjs` after editing mail contracts
- run `node scripts/agentmail-doctor.mjs` to inspect declared state and env readiness
- use `config/examples/openclaw-agentmail-skill.example.json` and `docs/AGENTMAIL_OPENCLAW_SETUP.md` when wiring AgentMail into OpenClaw
- run `node scripts/agentmail-live-check.mjs` when `AGENTMAIL_API_KEY` is available and you need provider-visible proof
- only upgrade evidence state after API or DNS proof exists outside the repo
