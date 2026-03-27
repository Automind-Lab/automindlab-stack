# Recommended Skills for AutoMindLab

## Principles

Choose skills that improve operator leverage without weakening reviewability or host / worker separation.

Prefer skills that are:

- read-heavy before write-heavy
- easy to verify end to end
- useful across multiple runtime tasks
- explicit about uncertainty, escalation, and output shape

## Start with the local AutoMindLab baseline

Before adding more capability, make sure the repo-local baseline is available and understood:

- `runtime-doctoring`
- `host-worker-routing-check`
- `bootstrap-recovery`
- `workflow-validation`
- `diagnostic-consultation`
- `council-query`
- `council-review`
- `memory-capture`
- `escalate-to-human`

Inspect the current baseline pack with:

```bash
node scripts/automind-skill-pack.mjs list
```

## Optional capability categories

Add external capability only when the approval path is explicit and the result remains operator-visible.

- GitHub admin bridges
  - useful for issue, PR, and repo operations with explicit write approval
- explainable web research
  - useful for sourced research and evidence gathering
- browser automation
  - useful only when sanctioned and tied to a clear verification path
- deeper filesystem analysis
  - useful for large-repo diagnostics and migration work

## Avoid this mistake

Do not expand the skill surface just because more tools are available.
Every added capability increases review burden, auth surface area, and verification work.

## Related

- `config/skills/automindlab-baseline-pack.json`
- `.ona/skills/INDEX.md`
- `docs/SKILLS_USAGE.md`
- `docs/NETWORK_POLICY.md`
