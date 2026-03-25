# AutoMindLab Stack

AutoMindLab Stack is the enterprise runtime, host/agent system, and integration layer for business-facing OpenClaw deployments.

BMO-stack is a reference point only.
AutoMindLab owns its own council, specialist agents, automation, and runtime-side service surfaces.

## What this repository owns

- the Council of 13 enterprise council
- specialist agents such as Pump Specialist
- the OpenClaw host / worker split for AutoMindLab
- deployment and operations scaffolding
- GitHub automation for validation and repository health
- reusable service clients for consumer products

## Boundary model

### AutoMindLab Stack owns
- runtime and agent execution
- council and specialist routing
- enterprise-side APIs and operational hardening
- deployment documentation and host setup

### Consumer applications own
- user experience
- business records and persistence
- approvals, reporting, and workflow outcomes

### BMO-stack is
- an architectural reference point
- not the owner of this production council
- not the home of the AutoMindLab enterprise runtime

## Repository structure

```text
automindlab-stack/
├── .cursor/
│   └── rules/
│       └── agents.md           # Editor-side guidance for extending council and specialists
├── .github/                    # GitHub automation and dependency updates
├── .ona/
│   └── skills/                 # Reusable skill definitions (diagnostic, council, escalation, memory)
├── config/
│   ├── examples/               # Example request and response payloads
│   ├── schemas/                # JSON schema validators
│   └── workflows/              # Workflow configuration files
├── context/
│   ├── BOOTSTRAP.md
│   ├── council/
│   │   ├── COUNCIL_OF_13.md
│   │   ├── diagnostic/
│   │   │   └── PUMP_SPECIALIST.md
│   │   └── *.md               # Council seat definitions (13 seats)
│   └── identity/              # Host and worker identity seeds
├── data/                       # Runtime data stores (adaptive skills outcomes)
├── deployments/
│   └── openclaw/              # Optional host-side auxiliary services
├── docs/
│   ├── ADAPTIVE_SKILLS_OPERATIONS.md
│   ├── FLOWCOMMANDER_INTEGRATION_CONTRACT.md
│   ├── GITHUB_AUTOMATION.md
│   ├── MAINTENANCE_CHECKLIST.md
│   ├── MEMORY_STRATEGY.md
│   ├── OPENCLAW_HOST_AGENT_SYSTEM.md
│   ├── REPO_HYGIENE.md
│   └── WORKER_DELEGATION_PROTOCOL.md
├── lib/
│   └── services/
│       └── diagnostic_consultation_service.dart
├── scripts/
│   ├── configure-openclaw-agents.sh
│   ├── runtime-doctor.sh
│   └── worker-status.sh
├── services/
│   └── diagnostic/
│       ├── contracts/          # FLOWCOMMANDER contract schemas and README
│       ├── test/               # Test suite (consultation, contract, schema, example tests)
│       ├── consultation-service.js
│       ├── package.json
│       └── server.js
└── Makefile
```

## Current implementation

### Council of 13
The enterprise council is made of 13 original operating profiles inspired by:
Nikola Tesla, Ram Dass, Leonardo da Vinci, Pablo Picasso, Bob Ross, Albert Einstein, Steve Jobs, Napoleon Bonaparte, Elon Musk, Carl Jung, Marcus Aurelius, Robert Cialdini, and David Goggins.

### OpenClaw host / worker topology
The intended topology is:
- `automind-host` = host-facing conversational runtime, sandbox off
- `automind-worker` = dedicated sandbox worker, sandbox all

### FLOWCOMMANDER diagnostic consultation
This repository packages the AutoMindLab-side diagnostic consultation surface for FLOWCOMMANDER and similar products.
The diagnostic service exposes `POST /api/diagnose` and wraps all responses in a versioned contract envelope (`contract_version: 2026-03-24.v1`).
Contract schemas live in `services/diagnostic/contracts/`.
See `docs/FLOWCOMMANDER_INTEGRATION_CONTRACT.md` for the full request and response shapes.

## GitHub automation
The repository includes:
- CI validation for council and diagnostic-service scaffolding
- scheduled repository health checks
- CodeQL analysis for JavaScript files
- Dependabot updates for GitHub Actions and npm dependencies

## Design rules

- runtime-side output is advisory unless a consumer product explicitly persists it
- safety, escalation, and uncertainty should always be explicit
- specialist guidance should stay structured and reviewable
- host and worker responsibilities should remain separate
