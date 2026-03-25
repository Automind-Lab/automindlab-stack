# Title

profiles: add enterprise worker profile split and network policy packs

# Labels

profiles, worker, policy, automindlab, enterprise, priority:P1

## Summary
Add explicit enterprise worker profile classes and named network policy packs so execution boundaries are reviewable and reusable.

## Problem
The repo documents a host/worker split, but enterprise worker classes and their network rules are not yet modeled in a reusable policy pack structure.

## Goal
Make runtime boundaries operational and enforceable.

## Scope
- define worker classes
- define named network policy packs
- map profiles to policy packs
- document verification steps

## Proposed files
- `profiles/automind-host/`
- `profiles/automind-worker/`
- `profiles/automind-browser-worker/`
- `config/policies/network/baseline.yaml`
- `config/policies/network/restricted-web.yaml`
- `config/policies/network/customer-support.yaml`
- `config/policies/network/research.yaml`

## Tasks
- [ ] Define the baseline host profile
- [ ] Define a bounded worker profile for general delegated execution
- [ ] Define a browser worker profile for higher-risk web tasks
- [ ] Create named network policies for common enterprise contexts
- [ ] Document verification commands or checks for applied policy state

## Acceptance criteria
- [ ] Worker classes are explicit
- [ ] Each worker profile has a named network policy
- [ ] Browser-capable execution is isolated from the baseline worker
- [ ] Policy pack usage is documented and reviewable
