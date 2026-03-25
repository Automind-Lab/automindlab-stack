# Title

services: harden the diagnostic consultation service with versioning tests, error contracts, and fixtures

# Labels

services, testing, contracts, automindlab, enterprise, priority:P1

## Summary
Strengthen the diagnostic consultation surface so it behaves like a stable enterprise contract rather than only a working service package.

## Problem
The diagnostic service already has a versioned contract envelope and tests, but it still needs stronger error contracts, fixture coverage, and regression discipline.

## Goal
Make the service safer to integrate and easier to evolve without breaking consumers.

## Scope
- add error envelope schema
- add example fixtures for success and failure cases
- add regression tests for contract version stability
- document backward-compatibility rules

## Proposed files
- `services/diagnostic/contracts/error.schema.json`
- `config/examples/diagnostic-success.sample.json`
- `config/examples/diagnostic-error.sample.json`
- `docs/SERVICE_VERSIONING_POLICY.md`

## Tasks
- [ ] Add a standard error contract
- [ ] Add sample success and failure payloads
- [ ] Add tests for contract envelope stability
- [ ] Document version bump rules
- [ ] Add at least one denied or escalated consultation example

## Acceptance criteria
- [ ] Consumer teams can rely on a stable success and error envelope
- [ ] Versioning rules are documented
- [ ] Fixtures cover representative response cases
- [ ] Contract regressions are caught in CI
