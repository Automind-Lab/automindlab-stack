# Title

delivery: add rollout rings, release gates, and enterprise verification checklist

# Labels

delivery, ops, automindlab, enterprise, priority:P1

## Summary
Add rollout rings and release gates so AutoMindLab runtime changes can be promoted safely from development to enterprise use.

## Problem
The repo has automation, validation, and a service package, but it still needs a clearer promotion model for runtime-affecting changes.

## Goal
Make delivery safer, reversible, and more operator-friendly.

## Scope
- define rollout rings
- define gate criteria per ring
- define rollback ownership
- add release checklist

## Proposed files
- `docs/ROLLOUT_RINGS.md`
- `ops/checklists/release-gate.md`
- `config/workflows/rollout-rings.yaml`

## Suggested rings
- `dev`
- `internal`
- `pilot`
- `customer`
- `restricted`

## Tasks
- [ ] Define each ring and its intended use
- [ ] Define required checks before promotion
- [ ] Define rollback owner and rollback steps per ring
- [ ] Document which changes are considered runtime-affecting
- [ ] Link delivery docs from the README or maintenance docs

## Acceptance criteria
- [ ] Runtime changes have a promotion model
- [ ] Rollbacks are planned before release
- [ ] Operators can tell what must be verified before promotion
- [ ] The release path is documented in one place
