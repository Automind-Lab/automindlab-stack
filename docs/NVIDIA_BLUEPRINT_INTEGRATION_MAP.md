# NVIDIA Blueprint Integration Map

This document maps the current NVIDIA utility list onto the enterprise/runtime
responsibilities of `automindlab-stack`.

`automindlab-stack` owns runtime and specialist execution. It should be the
primary home for enterprise and vertical NVIDIA blueprint integrations that need
services, adapters, contracts, observability, and operational hardening.

## Runtime ownership rule

Use `automindlab-stack` when the NVIDIA utility needs one or more of the
following:

- multi-agent runtime orchestration
- enterprise connectors and contracts
- observability, telemetry, and operations
- specialist routing or vertical domain services
- training / evaluation / flywheel loops
- hosted APIs consumed by other applications

`bmo-stack` should stay the consumer/local operator side and call into these
services through explicit adapters.

## Ownership map

| Utility | Why it belongs here | Initial target surface | Mode |
| --- | --- | --- | --- |
| Multi-Agent Intelligent Warehouse | Production-style multi-agent orchestration, enterprise connectors, safety/compliance, forecasting, and document processing | future warehouse service / specialist runtime | core enterprise integration |
| Safety for Agentic AI | Evaluation, post-training hardening, guardrails, and inference safety across enterprise runtimes | eval pipeline + runtime guardrails | shared core dependency |
| AIQ / research assistant patterns | Deep-research workflows, multi-step report generation, source grounding | future research/report service | core enterprise integration |
| Data Flywheel | Production telemetry, feedback loops, model optimization, and training/eval pipeline inputs | analytics + optimization pipeline | core enterprise integration |
| Omniverse DSX Blueprint for AI Factories | AI-factory design / operations integration and digital-twin-aligned control surfaces | platform / infrastructure integration docs | external platform integration |
| Earth-2 Weather Analytics | Weather/climate analytics specialists and external forecasting services | future weather specialist or service adapter | external specialist integration |
| Telco-Network-Configuration | Domain patterns for telco specialist workflows and configuration reasoning | telco specialist seed docs / adapters | vertical specialist integration |
| VIAVI ES Blueprint / RSG | Telco radio / RSG domain patterns for enterprise specialist workflows | telco specialist seed docs / adapters | vertical specialist integration |
| Nemotron Voice Agent | Enterprise voice front door for assistants, call flows, and voice agents | future voice ingress / service gateway | shared service |
| Retail Shopping Assistant | Reusable retail multi-agent and search patterns when AutoMindLab exposes retail-facing services | reference architecture only | pattern only |
| PDF to Podcast | Utility service for document-to-audio conversion when products need audio outputs | utility service / async job | optional service |

## Immediate implementation sequence

1. Add a machine-readable registry of the NVIDIA utilities and intended target
   surfaces.
2. Keep runtime ownership in `automindlab-stack` for warehouse, research,
   safety, flywheel, telco, weather, and AI-factory work.
3. Expose these capabilities as explicit services or contracts that consumer
   applications can call.
4. Let `bmo-stack` consume voice, podcast, and research features through
   adapters instead of reimplementing enterprise runtimes.

## Companion registry

See `config/registries/nvidia-blueprints.registry.json`.

This registry is meant to be a planning artifact that downstream services and
operators can extend as the integrations become real.
