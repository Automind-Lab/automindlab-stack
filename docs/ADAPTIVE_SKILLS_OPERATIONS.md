# Adaptive Skills Operations

This guide defines the operational layer for AutoMindLab adaptive skills.

## Current pieces
- `.ona/skills/index.json` is the machine-readable registry
- `data/adaptive-skills-store.json` stores routing outcomes
- `scripts/validate-ona-skills.py` validates the registry
- `scripts/skill-learn.sh` records routing outcomes
- `scripts/skill_stats.py` reports per-skill attempts and success rates

## Operating rules
- adaptive routing remains advisory
- changes to routing triggers should be reviewed before they influence runtime behavior
- the host remains responsible for final routing and escalation
- only routing metadata should be stored in the adaptive store

## Suggested operator loop
1. Validate the machine-readable registry.
2. Record routing outcomes after meaningful runs.
3. Review skill success rates and failure rates.
4. Improve skills or triggers through explicit pull requests.

## Non-goals
- no direct self-modifying runtime behavior
- no automatic trigger rewrites without review
- no storage of secrets or private credentials
