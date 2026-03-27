# Repository Hygiene

This guide keeps AutoMindLab easy to review and maintain.

## Rules
- prefer additive upgrades over surprise rewrites
- keep runtime contracts documented with matching tests and schemas
- keep host and worker boundaries explicit in code and docs
- keep specialist files aligned with the declared Council of 13
- keep `RUNBOOK.md`, `TASK_STATE.md`, and `WORK_IN_PROGRESS.md` trustworthy

## Before merge
- run `make doctor-plus`
- run `make workflow-validate`
- run `make diagnostic-ci` if the diagnostic service changed
- run `make github-automation-validate` when GitHub workflow or autonomy surfaces changed
- run `make downstream-sync-validate` when downstream contracts changed
- ensure new skills, packs, and workflows are documented
- ensure new JSON config files are parseable and covered by validation workflows

## Cleanup targets
- remove temporary test-only workarounds once production code can absorb the fix cleanly
- keep schemas and workflows close to the code they protect
- keep docs synchronized with runtime behavior
- remove stale references when scripts or validators are renamed
