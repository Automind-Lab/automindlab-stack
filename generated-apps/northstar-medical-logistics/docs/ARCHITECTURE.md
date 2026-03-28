# Northstar Medical Logistics Architecture

Northstar Medical Logistics needs an internal enterprise app built from reusable modules, domain packs, and typed contracts for Build an internal operations app with dispatch dashboard, service tickets, pickup and delivery workflows, warehouse inventory status, hospital account views, technician task assignments, approvals for urgent replacements, audit logs, role-based access, and reporting. Include admin settings, notification rules, CSV import and export, and future ERP integration support.

## Compiler

- Compiler version: 2026-03-28.compiler.v2
- Runtime target: generated-runtime-kit.v2
- Domain packs: core-operations, healthcare-logistics, warehouse-operations, field-service, account-governance
- Modules: dashboard, entity-workbench, workflow-orchestrator, approvals, audit, roles, integrations, notifications, reports, settings, dispatch-board, inventory-readiness, service-ticket-console, account-operations, task-assignment
- Adapters: design-handoff-adapter, figma-bridge-adapter, notification-router-adapter, identity-provider-adapter, csv-batch-gateway, erp-sync-sdk

## Persistence ownership

Generated customer apps own their own business records, workflow outcomes, and approval decisions. The factory only owns advisory specs, compiler metadata, job metadata, and generation artifacts.

## Eval summary

Compiler evals passed. Score 100.