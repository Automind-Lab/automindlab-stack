# Title

docs: define AutoMindLab product boundary and operating model

# Labels

docs, architecture, automindlab, enterprise, priority:P0

## Summary

Write a clear product boundary document for `automindlab-stack` so enterprise runtime work stays separate from BMO and from consumer application concerns.

## Problem

The repo already points toward an enterprise runtime/control-plane role, but that boundary needs to be made explicit and canonical so future work does not drift into the wrong layer.

## Goal

Define what AutoMindLab owns, what consumer applications own, and how this repo differs from `bmo-stack`.

## Scope

Add and wire up:
- `docs/PRODUCT_BOUNDARY.md`
- README reference to the boundary doc
- `docs/OPENCLAW_HOST_AGENT_SYSTEM.md` reference to the boundary doc

## Required content

The boundary doc should state:

### AutoMindLab owns
- runtime and agent execution
- enterprise council and routing
- service-facing operational surfaces
- deployment and operational hardening
- policy-aware host / worker boundaries
- reusable runtime-side integration contracts

### Consumer applications own
- user experience
- business records and persistence
- approvals, reporting, and workflow outcomes
- app-specific product logic

### AutoMindLab is not
- a personal desktop workflow repo
- a catch-all for BMO convenience features
- the owner of consumer app UX
- a dumping ground for unreviewed ecosystem tools

## Non-goals
- no service implementation changes
- no new policy engine in this issue
- no schema changes in this issue

## Tasks
- [ ] Create `docs/PRODUCT_BOUNDARY.md`
- [ ] Add a short boundary section to `README.md`
- [ ] Add a pointer from `docs/OPENCLAW_HOST_AGENT_SYSTEM.md`
- [ ] Include a "belongs in consumer app, not here" section
- [ ] Include a "belongs in BMO, not here" section

## Acceptance criteria
- [ ] There is one canonical AutoMindLab boundary doc
- [ ] README links to it
- [ ] The document clearly separates runtime ownership from consumer app ownership
- [ ] A contributor can tell whether a change belongs in AutoMindLab or somewhere else

## Notes
This should become the first filter for future architecture decisions.
