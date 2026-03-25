# Title

council: add explicit council routing rules, seat selection criteria, and reviewable seat outputs

# Labels

council, architecture, automindlab, enterprise, priority:P1

## Summary
Improve the Council of 13 by making routing rules, seat selection criteria, and output expectations explicit and reviewable.

## Problem
The council concept is defined well at a high level, but seat activation, seat mix rules, and expected output structure remain too narrative for reliable enterprise runtime use.

## Goal
Turn council use from a loose concept into a governed decision layer.

## Scope
- define seat selection rules
- define when to use single-seat, small-mix, or broader review
- define output shape for council synthesis
- document when specialist agents override or narrow the council mix

## Proposed files
- `docs/COUNCIL_ROUTING_MODEL.md`
- `config/workflows/council-routing.yaml`
- `config/examples/council-synthesis.sample.json`

## Tasks
- [ ] Define routing criteria for each seat category
- [ ] Define the default seat mix for common enterprise task types
- [ ] Add a structured output example for council synthesis
- [ ] Document review and challenge flows for high-impact decisions
- [ ] Clarify specialist-to-council interaction rules

## Acceptance criteria
- [ ] Council routing is explicit and testable
- [ ] Seat activation is not left to vague intuition alone
- [ ] Structured council outputs can be validated and reviewed
- [ ] High-impact decisions have a defined challenge path
