# Platform Ownership and Positioning

This document defines how AutoMindLab stays partner-owned, reusable, and commercially durable.

## Ownership rule

`automindlab-stack` is the source of truth for:

- runtime topology
- council and specialist routing
- enterprise contracts and validators
- operator-facing runbooks and proof flows

Donor repos may inform design, but they do not own this platform.

## Productization rule

This repo should ship reusable enterprise primitives:

- typed contracts
- validated workflows
- runtime diagnostics
- approval and escalation policy
- downstream-facing service surfaces

Consumer UX, tenant data, and line-of-business persistence stay downstream.

## Commercial durability rule

The most durable value in this stack comes from:

- trusted runtime ownership boundaries
- repeatable validation and doctoring
- reusable integration contracts for downstream products
- enterprise-ready operational documentation
- portability across OpenClaw, NemoClaw, and related execution surfaces

## Provenance rule

- every donor capability enters through `config/intake/`
- copy as little as possible
- translate useful patterns into AutoMindLab-native form
- reject donor UX or growth hacks that do not belong in an enterprise runtime repo

## Practical monetization surfaces

This repo is best used to support:

- enterprise runtime implementation and hardening work
- downstream product integrations built on typed contracts
- operator/admin surfaces that consume manifest-backed policy
- diagnostic and governance accelerators for customers

## What not to optimize for here

- copying consumer shells into the runtime repo
- hiding risk behind broad unsafe automation
- bundling tenant-owned business data with platform contracts
- chasing short-term outreach automation at the expense of platform trust
