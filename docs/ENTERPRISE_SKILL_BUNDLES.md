# Enterprise Skill Bundles

This document translates donor-repo skill-pack ideas into AutoMindLab-owned bundle guidance.

## Source of truth

- `config/skills/enterprise-skill-bundles.json`
- `config/schemas/enterprise-skill-bundles.schema.json`
- `scripts/validate-enterprise-skill-bundles.mjs`
- `.ona/skills/INDEX.md`

## Why this exists

The useful part of a skills repo is not its original founder narrative or local shell assumptions.
It is the idea that operators should be able to discover a small number of trusted bundles quickly.

AutoMindLab adopts that idea in enterprise form:

- bundles are local and reviewable
- bundles point only at skills that already exist in the repo
- bundles explain when to use them and what guardrails apply

## Current bundles

- `runtime-operations-core`
- `operator-trust-and-proof`
- `enterprise-email-ops`
- `strategy-and-governance`

Use these as curated starting points before widening the skill surface.

## Guardrail

Do not import donor business assumptions or personality framing just because the bundle idea is useful.
This repo owns only the reusable enterprise operating pattern.
