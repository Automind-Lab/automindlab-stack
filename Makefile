.PHONY: doctor configure-agents worker-status diagnostic-install diagnostic-start diagnostic-test diagnostic-ci up down review-comments

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
