# Title

services: add policy gateway and audit backbone for enterprise runtime actions

# Labels

services, policy, audit, automindlab, enterprise, priority:P1

## Summary
Add a policy gateway and a standard audit event envelope so enterprise runtime actions can be allowed, denied, escalated, and traced consistently.

## Problem
The repo has a clear host/worker split and advisory skill model, but policy and audit are still distributed concepts rather than first-class runtime surfaces.

## Goal
Make enterprise action control enforceable and reviewable.

## Scope
- define policy decision contract
- define audit event envelope
- add policy-gateway service stub
- document how host and worker use it

## Proposed files
- `services/policy-gateway/`
- `config/schemas/tool-policy.schema.json`
- `config/schemas/audit-event.schema.json`
- `docs/AUDIT_MODEL.md`

## Tasks
- [ ] Define allow, deny, and ask-for-approval decisions
- [ ] Define audit fields for actor, session, tenant, action, policy basis, and outcome
- [ ] Add a service stub or contract examples
- [ ] Document how worker decisions are checked before execution
- [ ] Add example deny and approval-required cases

## Acceptance criteria
- [ ] The repo has a canonical policy decision shape
- [ ] Audit events are standardized
- [ ] Host and worker policy touchpoints are documented
- [ ] Approval-required actions are modeled explicitly
