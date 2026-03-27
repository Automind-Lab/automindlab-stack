# Browser Validation Skill

## Purpose

Plan proof-oriented browser validation for downstream operator or email surfaces based on what changed in this repo.

## When to use

- when operator-facing or inbox-facing contracts changed
- when a downstream admin surface needs regression proof
- when a reviewer asks what browser flows should be checked for a diff

## Workflow

1. Validate the browser-validation manifest.
2. Gather the changed-file set from the branch, unstaged diff, or an explicit file list.
3. Run the planner and inspect the selected suites.
4. Capture the listed artifacts in the downstream browser surface.
5. Summarize what was checked, what still needs an authenticated session, and whether escalation is needed.

## Output shape

```json
{
  "mode": "branch|unstaged|files",
  "selectedSuites": [{"suiteId": "string", "targetId": "string"}],
  "requiredArtifacts": ["string"],
  "needsAuthenticatedSession": true,
  "escalate": false
}
```

## Guardrails

- do not imply this repo owns the downstream browser UI
- keep authenticated browser checks prompt-gated and operator-visible
- do not treat a planned suite as execution proof
