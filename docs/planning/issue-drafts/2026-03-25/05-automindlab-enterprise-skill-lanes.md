# Title

skills: create approved quarantine and rejected enterprise skill lanes under .ona

# Labels

skills, governance, automindlab, enterprise, priority:P1

## Summary
Create governed skill lanes so enterprise skills under `.ona` can be reviewed, promoted, or rejected without ambiguity.

## Problem
The repo already has a machine-readable skill registry and adaptive routing support, but the governance lifecycle for skills is still too implicit for enterprise use.

## Goal
Make enterprise skill adoption structured and auditable.

## Scope
- add approved, quarantine, and rejected skill lanes
- document required metadata
- connect skills to intake records and runtime scope

## Proposed files
- `.ona/skills/approved/`
- `.ona/skills/quarantine/`
- `.ona/skills/rejected/`
- `.ona/skills/README.md`

## Required metadata
- purpose
- inputs
- outputs
- runtime scope
- network needs
- storage needs
- secret needs
- tenant scope
- approval behavior
- audit behavior

## Tasks
- [ ] Create the three skill lanes
- [ ] Document promotion rules
- [ ] Add starter examples for approved and quarantine skills
- [ ] Define how `.ona/skills/index.json` references governed skills
- [ ] Document rejection criteria for unsafe or misfit skills

## Acceptance criteria
- [ ] Enterprise skill state is explicit
- [ ] Skills cannot silently bypass review
- [ ] Registry and governance lanes are aligned
- [ ] Approved skills declare runtime and policy-relevant metadata
