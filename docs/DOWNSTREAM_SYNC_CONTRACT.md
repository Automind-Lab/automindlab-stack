# Downstream Sync Contract

This document defines the stable sync surface that downstream repos such as FLOWCOMMANDER may review and selectively consume from `automindlab-stack`.

## Goals

- keep downstream sync manual and reviewable
- make syncable surfaces explicit
- reduce accidental import of AutoMindLab-global logic
- give downstream consumers a paper trail for sync decisions

## Current downstream consumer model

Downstream repos should **cherry-pick, not merge**.

That means:
- review changes in the listed syncable paths
- manually copy only the parts that serve the downstream product
- preserve downstream naming, contracts, and identity
- record the parent commit used for each sync

## Stable syncable paths

These are the highest-value paths for downstream review today:

- `services/diagnostic/`
- `services/diagnostic/contracts/`
- `docs/FLOWCOMMANDER_INTEGRATION_CONTRACT.md`
- `config/examples/flowcommander-diagnostic-request.example.json`
- `config/examples/flowcommander-diagnostic-response.example.json`
- `context/council/diagnostic/PUMP_SPECIALIST.md`

## Usually skip for downstream sync

These are typically AutoMindLab-global and should not be copied into downstream products by default:

- `context/council/COUNCIL_OF_13.md`
- enterprise council seat definitions outside field-specific diagnostic use
- `.ona/skills/`
- GitHub autonomy workflows
- deployment, topology, and infrastructure files
- enterprise policy and governance surfaces unrelated to the downstream product
- branding, identity, and enterprise-general documentation

## Sync review questions

Before pulling a change downstream, answer:

1. Is this diagnostic logic or contract change useful outside AutoMindLab itself?
2. Does it fit the downstream product's domain without importing parent branding or enterprise-only concepts?
3. Does it require contract or model updates downstream?
4. Does it need field validation, fixture updates, or UI adaptation downstream?
5. Can the downstream repo preserve its own naming and output shape after the change?

## FLOWCOMMANDER notes

FLOWCOMMANDER intentionally keeps:
- its own advisor naming
- its own field-service boundary
- its own narrowed runtime identity
- sync contract version `2026-03-25.v1`

That divergence is correct. Sync should preserve it rather than erase it.

## Recommended sync record

When downstream teams sync from AutoMindLab, record:
- date
- parent repo commit
- paths reviewed
- paths imported
- paths intentionally skipped
- downstream validation run

## Manifest

See `config/sync/downstreams/flowcommander.sync-manifest.json` for the current review manifest.
