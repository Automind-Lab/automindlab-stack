# Repository Boundary Policy

This document defines what belongs in `automindlab-stack` and what should remain in reference repos or downstream products.

## AutoMindLab scope

This repo should contain:

- host and worker runtime topology
- council and specialist context
- enterprise runbooks, diagnostics, and recovery routines
- reusable service contracts and schemas
- governed intake records for external capabilities
- operator-visible policy and approval guidance
- validation workflows that match the current repo surfaces

## Downstream product scope

Downstream consumer repos should contain:

- product UX and presentation
- business records and persistence
- tenant-specific approvals or reporting flows
- narrowed app-side naming, models, and workflow decisions

## `bmo-stack` scope

`bmo-stack` remains the home for:

- local operator workstation assumptions
- BMO-specific shell UX
- desktop or local-only helpers that do not back an enterprise runtime surface
- BMO delivery surfaces that AutoMindLab does not own

## Translation rules

When reviewing a useful `bmo-stack` capability:

1. keep it if it improves AutoMindLab host/worker execution, specialist routing, contracts, operations, or operator trust
2. translate it if the underlying need is valid but the BMO implementation is local or consumer-facing
3. reject it if it belongs to a local operator shell, consumer product UX, or a different owner repo

Record the decision in `config/intake/` before treating the capability as approved.

## Anti-patterns

Avoid:

- turning AutoMindLab into a consumer app shell
- copying BMO docs or routines without translating ownership and safety boundaries
- claiming parity for capabilities that do not exist here in reviewable form
- letting runtime policy live only in issue comments or tribal knowledge
- adopting external capabilities without an intake record

## Desired model

`automindlab-stack` is the runtime owner and reusable enterprise layer.
Reference repos can inspire it, and downstream products can consume from it, but neither should replace it as the source of truth.
