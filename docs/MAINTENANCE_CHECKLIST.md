# Maintenance Checklist

Use this checklist for regular repo upkeep.

## Weekly
- review CI, repo-health, workflow-config-validation, ona-skills-validation, and governance-validation results
- review open PRs for stale branches or outdated runtime assumptions
- review dependency update PRs

## Before a release or major merge
- run `make doctor-plus`
- run `make worker-status`
- run `make diagnostic-ci`
- run `make github-automation-validate`
- run `make downstream-sync-validate`
- run `make capability-intake-validate` when new external capabilities are reviewed
- run `make runtime-profile-validate` when runtime topology contracts or evidence levels change
- run `make operator-surface-validate` when operator manifests or approval rules change
- confirm workflow config files, skill packs, and schemas still match runtime behavior
- confirm specialist briefs still align with the Council of 13
- confirm host and worker docs still match the runtime topology

## After major fixes
- update `TASK_STATE.md` and `WORK_IN_PROGRESS.md` if the change affects the current operating picture
- add or update a memory entry if the outcome is reusable
- update the relevant skill, workflow, schema, or doc if the fix exposed a gap
- prefer a small guardrail addition over a broad rewrite
