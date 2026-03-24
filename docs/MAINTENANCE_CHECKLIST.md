# Maintenance Checklist

Use this checklist for regular repo upkeep.

## Weekly
- review CI, schema-validation, repo-health, and governance-validation results
- review open PRs for stale branches or outdated runtime assumptions
- review dependency update PRs

## Before a release or major merge
- run `make doctor`
- run `make diagnostic-ci`
- confirm workflow config files and schemas still match runtime behavior
- confirm specialist briefs still align with the Council of 13
- confirm host and worker docs still match the runtime topology

## After major fixes
- add or update a memory entry if the outcome is reusable
- update the relevant skill, workflow, schema, or doc if the fix exposed a gap
- prefer a small guardrail addition over a broad rewrite
