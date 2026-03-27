# AgentMail OpenClaw Setup

This guide shows how to make AgentMail available to the AutoMindLab OpenClaw runtime without turning this repo into a mailbox-owning consumer shell.

## Source of truth

- `config/email/agentmail-runtime-manifest.json`
- `docs/AGENTMAIL_RUNTIME_CONTRACT.md`
- `config/examples/openclaw-agentmail-skill.example.json`
- `scripts/validate-agentmail-runtime.mjs`
- `scripts/agentmail-doctor.mjs`
- `scripts/agentmail-live-check.mjs`

## Current declared identities

- `prismtek@agentmail.to`
- `bmo-tron@agentmail.to`
- `prismtek.dev` as the intended custom domain

The repo currently treats these as declared intent, not proven runtime evidence.

## OpenClaw wiring

Add an AgentMail skill entry to the OpenClaw runtime config based on:

- `config/examples/openclaw-agentmail-skill.example.json`

Recommended target config path:

- `~/.openclaw/openclaw.json`

Recommended env vars:

- `AGENTMAIL_API_KEY`
- `AGENTMAIL_BASE_URL`

Keep secrets out of this repo.
This setup mirrors the official AgentMail OpenClaw integration pattern while keeping AutoMindLab as the runtime owner.

## Production path for `prismtek.dev`

1. Create or register `prismtek.dev` in AgentMail.
2. Download or copy the returned DNS records or zone file.
3. Import those records into the DNS provider for `prismtek.dev`.
4. Wait for provider verification.
5. Run `node scripts/agentmail-live-check.mjs --require-live`.
6. Only after that, upgrade evidence state from `user-declared`.

## Verification steps

- run `node scripts/validate-agentmail-runtime.mjs`
- run `node scripts/agentmail-doctor.mjs`
- run `node scripts/agentmail-live-check.mjs`

The live check is read-only and confirms whether the declared inboxes and domain are visible through the provider API.

## Guardrails

- worker output may recommend an email action, but host review still owns sends and replies
- do not claim mailbox readiness from docs alone
- do not treat `@agentmail.to` bootstrap inboxes as a substitute for custom-domain verification
- do not upgrade this repo to `runtime-validated` email proof until the provider and DNS both agree
