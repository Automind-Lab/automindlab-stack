# Title

config: add enterprise intake manifests for tools skills and external repos

# Labels

governance, config, automindlab, enterprise, priority:P0

## Summary

Add structured intake manifests so every external capability considered for AutoMindLab has an explicit review record before adoption.

## Problem

Enterprise runtime repos should not absorb tools, skills, or external repos informally. Without an intake layer, governance will become inconsistent and hard to audit.

## Goal

Create a single front door for reviewing capabilities before they are wrapped, curated, or rejected.

## Scope

Add:
- `config/intake/candidates.yaml`
- `config/intake/approved.yaml`
- `config/intake/rejected.yaml`

## Required fields
Each intake record should support:
- `id`
- `name`
- `source_repo_or_source`
- `capability_type`
- `adoption_mode` (`wrap`, `curate`, `inspire`, `reject`)
- `owner`
- `risk_level`
- `network_scope`
- `storage_scope`
- `secret_scope`
- `tenant_scope`
- `rollout_ring`
- `approval_requirements`
- `rollback_notes`
- `review_notes`

## Policy rules
- every external capability starts in `candidates`
- only reviewed capabilities move to `approved`
- explicitly blocked capabilities go to `rejected`
- unlisted capabilities are not approved by default

## Non-goals
- no schema validation in this issue
- no CI workflow in this issue
- no automatic installer or sync job

## Tasks
- [ ] Create the three intake manifest files
- [ ] Add starter examples for one tool, one skill, and one external repo
- [ ] Document the meaning of each `adoption_mode`
- [ ] Define minimum required metadata for approval
- [ ] Add short comments in the files so maintenance stays easy

## Acceptance criteria
- [ ] The repo has a canonical intake location for external capabilities
- [ ] It is possible to review tools, skills, and source repos in the same system
- [ ] Unknown capabilities are not treated as approved
- [ ] The format is simple enough to maintain before schema automation exists

## Notes
Keep this manual-first. Automation can come after the review model is stable.
