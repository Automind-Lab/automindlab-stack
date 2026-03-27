# operator-surface-review

## Purpose

Review or expand the manifest-backed operator/admin surface without turning AutoMindLab into a local operator shell.

## When to use

- a new operator-facing action needs to be added
- a future admin surface needs a typed manifest instead of ad hoc docs
- approval rules need to change for runtime or repo actions
- a BMO workstation pattern looks useful and needs enterprise translation

## Workflow

1. Confirm the boundary in `docs/REPO_BOUNDARY_POLICY.md`.
2. Decide whether the incoming capability belongs in `automindlab-stack` at all.
3. Record the adoption decision in `config/intake/`.
4. Update `config/operator/operator-surface-manifest.json` if the capability becomes an operator-visible surface.
5. Update `config/operator/operator-command-policy.json` if the approval posture changes.
6. Validate with `node scripts/validate-operator-surfaces.mjs`.
7. If the action changes runtime topology or recovery behavior, also run `make doctor-plus`.

## Output shape

- operator action or shortcut added, updated, or rejected
- approval mode and capability mapping
- validation commands run
- remaining boundary caveats

## Guardrails

- do not add consumer app UX here
- do not add unrestricted shell execution
- do not bypass host/worker separation
- do not claim a platform surface is implemented unless there is validation evidence
