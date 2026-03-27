# Capability Intake Policy

This document defines the front door for external capabilities entering `automindlab-stack`.

## Why this exists

Enterprise runtime repos should not absorb tools, skills, or source repos informally.
Every outside capability should have a review record before it is wrapped, curated, inspired by, or rejected.

## Source of truth

- `config/intake/candidates.json`
- `config/intake/approved.json`
- `config/intake/rejected.json`
- `config/schemas/capability-intake-catalog.schema.json`
- `scripts/validate-capability-intake.mjs`

Unknown capabilities are not approved by default.

## Review states

- `candidate`: under review and not approved for runtime use
- `approved`: reviewed and allowed only in the form described by the entry
- `rejected`: explicitly blocked from this repo

## Adoption modes

- `wrap`: expose the capability only behind AutoMindLab-owned scripts, contracts, or service surfaces
- `curate`: translate the capability into AutoMindLab-native skills, runbooks, or policies
- `inspire`: take design ideas only, without carrying over ownership or local UX assumptions
- `reject`: keep the capability out of this repo

## Minimum metadata for approval

Approved entries must include:

- source and capability type
- adoption mode
- owner
- risk, network, storage, secret, and tenant scopes
- rollout ring
- approval requirements
- rollback notes
- review notes
- enterprise justification
- boundary decision
- decision date and decision owner

## Translation rule

Use the intake system to decide whether a capability should:

1. stay outside this repo
2. be translated into AutoMindLab host/worker form
3. become a reusable contract or validator for downstream products

`bmo-stack` can only enter through translation.
Local BMO operator UX does not become approved here by default.
That includes the direct BMO Windows desktop shell: the reusable manifest and approval-policy pattern may be translated here, but the desktop application itself remains rejected as a source-of-truth surface.

## Operator guidance

- do not treat a capability as available just because it exists in a donor repo
- do not merge new external capability surfaces without an intake entry
- run `node scripts/validate-capability-intake.mjs` after editing any intake catalog
