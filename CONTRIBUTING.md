# Contributing

AutoMindLab favors small, reviewable upgrades.

## Before you open a PR
1. Run `make doctor`.
2. Run `make diagnostic-ci` if you touched the diagnostic service or schemas.
3. Check that new skills, schemas, and workflow files are documented.
4. Keep host and worker boundaries explicit.

## Council files
- keep the declared council at 13 unless the council index is intentionally updated
- specialist influence lists must only reference declared council seats

## Diagnostic service
- keep output advisory and structured
- preserve safety and escalation signals
- update schemas and tests when the response contract changes

## Skills and workflows
- every new skill should declare purpose, workflow, output shape, and guardrails
- every new workflow config should be parseable JSON with explicit `steps` and `outputs`

## PR expectations
- explain what changed and why
- call out any runtime contract impact
- prefer additive migrations over large rewrites
