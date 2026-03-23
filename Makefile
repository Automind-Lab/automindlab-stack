.PHONY: doctor configure-agents worker-status diagnostic-install diagnostic-start up down

doctor:
	./scripts/runtime-doctor.sh

configure-agents:
	./scripts/configure-openclaw-agents.sh

worker-status:
	./scripts/worker-status.sh

diagnostic-install:
	cd services/diagnostic && npm install

diagnostic-start:
	cd services/diagnostic && npm start

up:
	docker compose -f deployments/openclaw/compose.yaml up -d

down:
	docker compose -f deployments/openclaw/compose.yaml down
