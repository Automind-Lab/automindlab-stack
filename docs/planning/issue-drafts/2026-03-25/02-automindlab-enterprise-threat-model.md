# Title

docs: add enterprise threat model for host worker and service boundaries

# Labels

docs, security, architecture, automindlab, priority:P0

## Summary

Create a practical threat model for `automindlab-stack` covering host runtime, worker runtime, service surfaces, external tools, and imported skills.

## Problem

Enterprise runtime work needs explicit security and safety assumptions. Right now, the repo has good structural direction, but the risk model is not yet centralized and reviewable.

## Goal

Define the main threat areas, trust boundaries, mitigations, and verification paths for the stack.

## Scope

Add:
- `docs/THREAT_MODEL.md`

Review and reference from:
- `docs/WORKER_DELEGATION_PROTOCOL.md`
- `docs/ADAPTIVE_SKILLS_OPERATIONS.md`

## Threat areas to cover
- cross-tenant or cross-workspace data leakage
- unsafe network egress
- secret exposure
- unreviewed or malicious imported skills
- write-capable tools without approval
- worker persistence surprises
- prompt injection and tool poisoning
- weak auditability of runtime actions
- service contract drift

## Required structure
For each threat:
- threat description
- affected boundary
- likely impact
- mitigation
- detection or verification method
- owner

## Non-goals
- no penetration testing work in this issue
- no policy service implementation in this issue
- no rollout ring implementation in this issue

## Tasks
- [ ] Create `docs/THREAT_MODEL.md`
- [ ] Define trust boundaries: host, worker, service, external capability
- [ ] Enumerate top risks
- [ ] Assign mitigations and verification paths
- [ ] Link the threat model from existing operational docs

## Acceptance criteria
- [ ] The threat model is explicit and centralized
- [ ] Host/worker/service trust boundaries are documented
- [ ] Each major risk has a mitigation and verification path
- [ ] Existing operational docs point to the threat model

## Notes
Favor clarity and operational usefulness over exhaustive theory.
