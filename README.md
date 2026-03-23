# AutoMindLab Stack

Business/enterprise stack for BMO/OpenClaw integrations.

This repository contains production-ready integrations, services, SDKs, and deployment configurations for building business applications on top of the BMO/OpenClaw platform.

## Philosophy

While BMO-stack remains the family/community/adventure-time themed core of the platform, AutoMindLab Stack focuses on:

- Production-ready business/enterprise integrations
- Formal APIs, SDKs, and deployment configurations  
- Performance monitoring, analytics, and security hardening
- Professional/business-focused tooling and documentation
- Less Adventure Time theming, more enterprise readiness

## Structure

```
automindlab-stack/
├── context/                    # Agent council definitions for business use cases
│   └── council/
│       └── diagnostic/         # Vertical-specific agents (e.g., PUMP_SPECIALIST)
├── services/                   # Production services and microservices
│   └── diagnostic/             # Diagnostic consultation services
├── lib/                        # Reusable libraries and SDKs
│   └── services/               # Client libraries for consuming services
├── sdks/                       # Official SDKs for different platforms
├── deployments/                # Deployment configurations (Docker, Kubernetes, etc.)
├── docs/                       # Documentation
└── scripts/                    # Utility scripts
```

## Current Integrations

### FLOWCOMMANDER Diagnostic Consultation

Enhances FLOWCOMMANDER's diagnostic workflows with pump specialist guidance from BMO-stack's agent council.

Provides:
- Ranked probable causes with confidence indicators
- Specific next checks to perform
- Parts to consider bringing on site
- Clear escalation criteria
- Contextual close-out note suggestions
- Alternative diagnostic paths

**Location:** 
- Agent definition: `context/council/diagnostic/PUMP_SPECIALIST.md`
- Consultation service: `services/diagnostic/`
- FLOWCOMMANDER client: `lib/services/diagnostic_consultation_service.dart`

## Getting Started

See individual service directories for setup instructions.

## License

MIT