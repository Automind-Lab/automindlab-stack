# Browser Validation Contract

This document defines the enterprise translation of `millionco/expect`-style browser validation into AutoMindLab-native contracts.

## Why this exists

The useful part of `expect` is not its local TUI.
It is the workflow:

1. inspect what changed
2. decide what browser flows need proof
3. require explicit artifacts
4. keep the resulting validation plan reviewable

AutoMindLab adopts that in manifest form so downstream products can consume a typed validation plan without making this repo a local browser shell.

## Source of truth

- `config/browser-validation/enterprise-browser-validation.manifest.json`
- `config/schemas/browser-validation-manifest.schema.json`
- `scripts/validate-browser-validation.mjs`
- `scripts/plan-browser-validation.mjs`
- `.ona/skills/browser-validation.md`

## What this contract does

- maps changed repo paths to downstream browser validation suites
- records required artifacts such as screenshots, traces, and console logs
- keeps auth-sensitive browser checks operator-approved
- gives downstream operator surfaces a reproducible plan instead of an improvised smoke test

## What this contract does not do

- it does not claim this repo owns a browser UI
- it does not silently run external browser sessions
- it does not replace downstream product ownership of the actual web surface

## Planning workflow

Use:

- `node scripts/validate-browser-validation.mjs`
- `node scripts/plan-browser-validation.mjs --mode branch`
- `node scripts/plan-browser-validation.mjs --mode unstaged`
- `node scripts/plan-browser-validation.mjs --mode files --files config/email/,docs/AGENTMAIL_RUNTIME_CONTRACT.md`

The planner selects suites based on changed file prefixes and emits the proof that should be gathered.

## Approval model

- browser validation remains `prompt`-gated when it touches authenticated operator or inbox surfaces
- screenshot, console-log, trace, and similar proof artifacts should be retained with the validation output
- sending real messages or mutating downstream state still requires separate approval
