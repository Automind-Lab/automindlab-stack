# Northstar Medical Logistics Architecture

Northstar Medical Logistics needs an internal enterprise app built from reusable primitives for Build an internal operations app with dispatch dashboard, service tickets, pickup and delivery workflows, warehouse inventory status, hospital account views, technician task assignments, approvals for urgent replacements, audit logs, role-based access, and reporting. Include admin settings, notification rules, CSV import and export, and future ERP integration support.

## Persistence ownership

Generated customer apps own their own business records, workflow outcomes, and approval decisions. The factory only owns advisory specs, job metadata, and generation artifacts.
