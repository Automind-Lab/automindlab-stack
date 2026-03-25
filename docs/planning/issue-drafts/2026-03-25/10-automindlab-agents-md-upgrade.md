# Title

docs: expand agents.md into a real extension contract for council and specialists

# Labels

docs, council, automindlab, enterprise, priority:P2

## Summary
Expand `.cursor/rules/agents.md` so it becomes a practical extension contract instead of only a short note file.

## Problem
The current file establishes useful basics for council seats, specialists, and host/worker roles, but it is still too thin for safe long-term extension.

## Goal
Make agent extension rules explicit, concise, and enforceable in practice.

## Scope
Enhance guidance for:
- seat file schema expectations
- specialist input and output contracts
- runtime scope declarations
- policy and audit expectations
- advisory vs persisted output boundaries
- review requirements for new seats and specialists

## Proposed files
- update `.cursor/rules/agents.md`
- add `docs/AGENT_EXTENSION_GUIDE.md`

## Tasks
- [ ] Document the expected structure for council seat files
- [ ] Document the expected structure for specialist files
- [ ] Add rules for runtime scope and escalation behavior
- [ ] Add guidance for policy-sensitive specialists
- [ ] Link to the guide from the README or docs index

## Acceptance criteria
- [ ] `agents.md` is useful as an extension contract
- [ ] New seats and specialists can be added without guessing format
- [ ] Runtime and policy expectations are explicit
- [ ] Advisory versus persisted output rules are clear
