.PHONY: doctor doctor-plus health-check configure-agents worker-status runtime-doctor bootstrap-recovery workspace-sync workflow-validate repo-validate routines skill-pack contract-validate diagnostic-install diagnostic-start diagnostic-test diagnostic-ci up down review-comments

doctor:
	./scripts/runtime-doctor.sh

doctor-plus: doctor repo-validate

health-check: doctor-plus

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

repo-validate:
	node scripts/validate-repo-operating-system.mjs
	node scripts/validate-ona-skills.mjs
	node scripts/automind-skill-pack.mjs validate
	node scripts/automind-routines.mjs validate
	node scripts/validate-workflows.mjs
	node scripts/validate-runtime-contracts.mjs

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
