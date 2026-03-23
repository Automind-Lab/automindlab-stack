# AutoMindLab Stack

AutoMindLab Stack is the enterprise runtime, agent system, and integration layer for business-facing OpenClaw deployments.

BMO-stack is a reference point only.
AutoMindLab is the production-facing home for its own host runtime, its own council, its own specialist agents, and its own integration surfaces.

## Operating stance

This repository exists to provide:
- enterprise host and agent runtime patterns
- business-facing APIs and SDKs
- vertical specialist systems
- deployment-ready services
- clear separation between runtime ownership and product consumption

## Boundary model

### AutoMindLab Stack owns
- the enterprise council and orchestration model
- specialist agents for verticals and workflows
- service endpoints used by client applications
- integration contracts and reusable SDKs
- deployment and operational hardening

### BMO-stack is
- a historical and architectural reference point
- not the home of this production council
- not the owner of the AutoMindLab enterprise runtime

### FLOWCOMMANDER is
- a consumer of the integration
- the owner of technician workflow UX and business records
- not the owner of the AutoMindLab runtime

## Repository structure

```text
automindlab-stack/
├── context/
│   └── council/
│       ├── COUNCIL_OF_13.md
│       ├── diagnostic/
│       │   └── PUMP_SPECIALIST.md
│       └── *.md                # Council seat definitions
├── services/
│   └── diagnostic/
│       ├── consultation-service.js
│       ├── package.json
│       └── server.js
└── lib/
    └── services/
        └── diagnostic_consultation_service.dart
```

## Council of 13

The AutoMindLab enterprise council is composed of 13 operating seats inspired by distinct strategic archetypes:

1. Nikola Tesla — inventor / systems thinker
2. Ram Dass — inner work / alignment
3. Leonardo da Vinci — polymath / synthesis
4. Pablo Picasso — creative disruptor
5. Bob Ross — calm builder / teacher
6. Albert Einstein — theoretical genius
7. Steve Jobs — visionary operator
8. Napoleon Bonaparte — strategic leadership
9. Elon Musk — modern business builder
10. Carl Jung — psychology / shadow work
11. Marcus Aurelius — stoic discipline
12. Robert Cialdini — persuasion / influence
13. David Goggins — warrior execution

These are original operating profiles inspired by those figures, not literal impersonations.

## Current implementation

### FLOWCOMMANDER diagnostic consultation

This repository currently packages the AutoMindLab-side diagnostic consultation surface for FLOWCOMMANDER.

It includes:
- the AutoMindLab Council of 13 foundation
- a pump-domain specialist agent brief
- a Node.js consultation service
- an HTTP server exposing `POST /api/diagnose`
- a reusable Dart client for consumer apps

## Design rules

- AutoMindLab owns runtime and agent execution.
- Consumer apps own UX, persistence, and business workflow decisions.
- Specialist output is advisory unless the consumer app explicitly persists it.
- Safety, escalation, and uncertainty should always be explicit.
