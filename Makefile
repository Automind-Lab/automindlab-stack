.PHONY: doctor doctor-plus health-check install-git-hooks configure-agents worker-status runtime-doctor bootstrap-recovery workspace-sync workflow-validate repo-validate routines skill-pack contract-validate github-automation-validate downstream-sync-validate capability-intake-validate runtime-profile-validate operator-surface-validate agentmail-runtime-validate agentmail-doctor agentmail-live-check browser-validation-validate browser-validation-plan enterprise-skill-bundles-validate runtime-fixture-smoke diagnostic-install diagnostic-start diagnostic-test diagnostic-ci enterprise-app-factory-contract-validate enterprise-app-factory-ci enterprise-app-factory-council-sample enterprise-app-factory-sample up down review-comments

doctor:
	./scripts/runtime-doctor.sh

doctor-plus: doctor repo-validate runtime-fixture-smoke

health-check: doctor-plus

install-git-hooks:
	bash ./scripts/install-git-hooks.sh

configure-agents:
	./scripts/configure-openclaw-agents.sh

worker-status:
	./scripts/worker-status.sh

runtime-doctor:
	./scripts/runtime-doctor.sh

bootstrap-recovery:
	./scripts/bootstrap-recovery.sh $(if $(ARGS),$(ARGS))

workspace-sync:
	./scripts/sync-openclaw-workspaces.sh

workflow-validate:
	node scripts/validate-workflows.mjs

contract-validate:
	node scripts/validate-runtime-contracts.mjs

github-automation-validate:
	node scripts/validate-github-automation.mjs
	node scripts/github-autonomy-selftest.mjs

downstream-sync-validate:
	node scripts/validate-downstream-sync.mjs

capability-intake-validate:
	node scripts/validate-capability-intake.mjs

runtime-profile-validate:
	node scripts/validate-runtime-topology-profiles.mjs

operator-surface-validate:
	node scripts/validate-operator-surfaces.mjs

agentmail-runtime-validate:
	node scripts/validate-agentmail-runtime.mjs

agentmail-doctor:
	node scripts/agentmail-doctor.mjs

agentmail-live-check:
	node scripts/agentmail-live-check.mjs $(if $(ARGS),$(ARGS))

browser-validation-validate:
	node scripts/validate-browser-validation.mjs

browser-validation-plan:
	node scripts/plan-browser-validation.mjs --mode branch

enterprise-skill-bundles-validate:
	node scripts/validate-enterprise-skill-bundles.mjs

enterprise-app-factory-contract-validate:
	node scripts/validate-enterprise-app-factory-contracts.mjs

enterprise-app-factory-ci:
	cd services/enterprise-app-factory && npm run ci

enterprise-app-factory-council-sample:
	cd services/enterprise-app-factory && npm run council:sample

enterprise-app-factory-sample:
	cd services/enterprise-app-factory && npm run sample

runtime-fixture-smoke:
	node scripts/openclaw-fixture-smoke.mjs

repo-validate:
	node scripts/validate-repo-operating-system.mjs
	node scripts/validate-ona-skills.mjs
	node scripts/automind-skill-pack.mjs validate
	node scripts/automind-routines.mjs validate
	node scripts/validate-workflows.mjs
	node scripts/validate-runtime-contracts.mjs
	node scripts/validate-github-automation.mjs
	node scripts/github-autonomy-selftest.mjs
	node scripts/validate-downstream-sync.mjs
	node scripts/validate-capability-intake.mjs
	node scripts/validate-runtime-topology-profiles.mjs
	node scripts/validate-operator-surfaces.mjs
	node scripts/validate-agentmail-runtime.mjs
	node scripts/validate-browser-validation.mjs
	node scripts/validate-enterprise-skill-bundles.mjs
	node scripts/validate-enterprise-app-factory-contracts.mjs

routines:
	node scripts/automind-routines.mjs list

skill-pack:
	node scripts/automind-skill-pack.mjs list

diagnostic-install:
	cd services/diagnostic && npm install

diagnostic-start:
	cd services/diagnostic && npm start

diagnostic-test:
	cd services/diagnostic && npm test

diagnostic-ci:
	cd services/diagnostic && npm install && npm test

review-comments:
	cat .ona/review/comments.json

up:
	docker compose -f deployments/openclaw/compose.yaml up -d

down:
	docker compose -f deployments/openclaw/compose.yaml down
