# AutoMindLab Stack

Business/enterprise stack for BMO/OpenClaw integrations - Enterprise Runtime Owner

This repository contains the **AutoMindLab enterprise runtime** - the production-ready ownership layer for the BMO/OpenClaw agent council system. While BMO-stack remains the family/community/adventure-time themed reference point, AutoMindLab Stack owns the council, runtime, and specialist execution layer for business/enterprise applications.

## Philosophy

AutoMindLab Stack is the **enterprise runtime owner** that:
- Owns the Council of 13 agent runtime and execution layer
- Provides production-ready services, SDKs, and deployment configurations  
- Maintains specialist agents (like Pump Specialist) as enterprise assets
- Handles security hardening, performance monitoring, and analytics
- Provides formal APIs, SLAs, and support for business applications
- Less Adventure Time theming, more enterprise readiness and reliability

BMO-stack remains as the **reference point and inspiration source** for the core agent concepts and local-first design principles.

## Structure

```
automindlab-stack/
├── context/                    # AutoMindLab-owned agent council definitions
│   └── council/
│       ├── COUNCIL_OF_13.md          # Council overview and operating principles
│       ├── diagnostic/               # Vertical-specific specialists (e.g., PUMP_SPECIALIST)
│       │   └── PUMP_SPECIALIST.md    # AutoMindLab-owned Pump Specialist seat
│       ├── ALBERT_EINSTEIN.md        # Individual council member definitions
│       ├── BOB_ROSS.md
│       ├── CARL_JUNG.md
│       ├── ... (all 13 seats)
│       └── ...                       # Other council infrastructure
├── services/                   # Production services and microservices
│   └── diagnostic/             # Diagnostic consultation services (AutoMindLab-owned)
├── lib/                        # Reusable libraries and SDKs
│   └── services/               # Client libraries for consuming services
│       └── diagnostic_consultation_service.dart  # FLOWCOMMANDER client
├── sdks/                       # Official SDKs for different platforms
├── deployments/                # Deployment configurations (Docker, Kubernetes, etc.)
├── docs/                       # Documentation
└── scripts/                    # Utility scripts
```

## Current Integration

### FLOWCOMMANDER Diagnostic Consultation (AutoMindLab-owned)

Enhances FLOWCOMMANDER's diagnostic workflows with Pump Specialist guidance from the AutoMindLab Council of 13.

**AutoMindLab owns and operates:**
- Pump Specialist agent (context/council/diagnostic/PUMP_SPECIALIST.md) - Seat 7 of Council of 13
- Diagnostic consultation service (services/diagnostic/) - HTTP endpoint `/api/diagnose`
- Metadata, documentation, and service contracts

**FLOWCOMMANDER consumes:**
- Dart client service (lib/services/diagnostic_consultation_service.dart)
- Standardized request/response contracts
- Enhancement guidance for technician workflows

**Provides to FLOWCOMMANDER technicians:**
- Ranked probable causes with confidence levels and evidence
- Specific next checks with tools, safety notes, and priority
- Parts to consider with compatibility and urgency indicators
- Clear escalation criteria with thresholds and actions
- Contextual close-out note suggestions
- Alternative diagnostic paths
- Metadata including confidence assessment, limitations, and data quality

## Getting Started

See individual service directories for setup instructions.

## Council of 13 Seats

AutoMindLab Stack owns and maintains the full Council of 13:
1. Albert Einstein - First principles and theoretical foundation
2. Bob Ross - Clear communication and approachable guidance
3. Carl Jung - Pattern recognition and archetypal analysis
4. David Goggins - Decisive action and mental toughness
5. Elon Musk - Systems thinking and innovation
6. Leonardo da Vinci - Interdisciplinary creativity
7. **Marcus Aurelius** - Stoic judgment and risk assessment (Seat 1 - Council Lead)
8. Marie Curie - Safety and hazardous materials awareness
9. **Nikola Tesla** - System interactions and flow relationships (Seat 2)
10. Napoleon Bonaparte - Strategy and resource allocation
11. Pablo Picasso - Creative problem solving and perspective
12. Rama Dass - Spiritual awareness and holistic thinking
13. Steve Jobs - User experience and design excellence

The Pump Specialist draws reasoning from seats 2, 1, 3, 7, 6, 4, 8, 9, 10, 11, and 12 as appropriate for pump-station diagnostics.

## License

MIT
