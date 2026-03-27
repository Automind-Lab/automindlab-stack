# Skills Usage

The `.ona/skills/` directory provides focused operational playbooks for AutoMindLab.

## Skill vs workflow vs routine

- a skill is a reusable task-scoped capability
- a workflow combines skills into a typed host / worker sequence
- a routine is an operator-facing entrypoint such as `make doctor-plus`

Use the smallest surface that solves the problem cleanly.

## When to use skills

- diagnosing runtime or routing issues
- recovering seeded workspaces after drift
- validating workflow or contract changes
- shaping council or specialist output into structured advisory form

## How to use skills

1. identify the problem type
2. open the matching skill in `.ona/skills/`
3. follow the workflow and guardrails
4. verify the expected good state
5. capture reusable outcomes in `TASK_STATE.md`, `WORK_IN_PROGRESS.md`, or memory flows when appropriate

## Core local skills

- `runtime-doctoring`
- `host-worker-routing-check`
- `bootstrap-recovery`
- `workflow-validation`
- `operator-surface-review`
- `diagnostic-consultation`
- `council-query`
- `council-review`
- `memory-capture`
- `escalate-to-human`

## Goal

Reduce guesswork and make runtime troubleshooting, review, and recovery consistent across host, worker, and specialist paths.
