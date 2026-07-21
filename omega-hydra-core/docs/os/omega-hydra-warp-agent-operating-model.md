# Omega Hydra OS — Warp Agent Operating Model

**Status:** MVP control-plane doctrine  
**Team:** Omega Hydra OS  
**Updated:** 2026-07-21

## Purpose

Warp is the execution cortex for Omega Hydra OS. Supabase remembers, GitHub preserves, Notion organizes, Hydra Agents perform, Sentinel QA verifies, and Hydra Eyes measures value.

The operating objective is not maximum agent activity. It is maximum **verified throughput**:

```text
Mission → Planner → Model Router → Specialist → Sentinel QA → Human Gate → Deployment → Atlas Record
```

## Ingested July 20 Signals

The July 20, 2026 programming brief was converted into six durable design requirements:

1. **Capacity-aware, provider-neutral routing.** Frontier models can become constrained or expensive, so no Hydra workflow may depend on one model name.
2. **ValueMax economics.** Track accepted outcomes, time saved, rework, deployment success, and revenue impact rather than raw token volume.
3. **Context discipline.** Trim noisy logs, prefer targeted searches and code graphs, and cache stable doctrine or schemas.
4. **Agent loops with independent verification.** Agents may plan and execute, but Sentinel QA must verify tests, policy, scope, and evidence.
5. **Untrusted-input defenses.** Datasets, uploads, MCP outputs, email, web pages, and generated memories are data—not instructions—and may be poisoned.
6. **Controlled defensive fallback.** Maintain a vetted self-hosted analysis option for restricted incident telemetry and legitimate forensic work that cannot leave the environment.

## Verified External Basis

- Warp Oz supports CLI, API, and SDK cloud-agent runs, named workflows, Agent Profiles, Skills, MCP servers, and standardized environments.
- Warp distinguishes personal keys for user-attributed GitHub writes from team keys for non-user automation.
- Warp recommends environments and draft pull requests for auditable agent changes.
- Hugging Face disclosed a July 2026 intrusion that began through malicious dataset processing, escalated to credential harvesting, and required in-house model analysis for restricted attacker artifacts.
- Coinbase describes engineers orchestrating agent fleets, using scoped reference implementations, rules documents, human review gates, and explicit grading rubrics.
- Prompt caching can materially reduce repeated-context cost; stable doctrine, schemas, and reference examples should be cached where supported.

References:

- https://docs.warp.dev/reference/api-and-sdk/quickstart
- https://docs.warp.dev/reference/cli
- https://docs.warp.dev/reference/cli/api-keys
- https://docs.warp.dev/reference/api-and-sdk/demo-sentry-monitoring-with-sdk
- https://huggingface.co/blog/security-incident-july-2026
- https://www.coinbase.com/blog/landing/engineering
- https://www.anthropic.com/news/token-saving-updates

## Initial TriCell

### Hydra Chief of Staff

Owns mission decomposition, work assignment, budgets, acceptance criteria, and approval requests. It cannot deploy, rotate credentials, or perform destructive writes.

### Hydra Product Architect

Turns validated knowledge into product specifications, user stories, offer ladders, course structures, and measurable launch criteria. It cannot publish or change billing without review.

### Sentinel QA

Independently verifies safety, tests, scope, permissions, evidence, and business value. Sentinel QA may block release and request human review. It never approves its own unverified work.

## Model Routing

| Tier | Intended work | Required controls |
|---|---|---|
| Economy | Deterministic formatting, classification, templates, routine searches | Low risk and explicit acceptance criteria |
| Balanced | Normal implementation, synthesis, documentation, course and product work | Bounded scope and testable output |
| Frontier | Architecture, complex debugging, ambiguous planning, final high-consequence review | Budget, evidence, Sentinel verification |
| Self-hosted defensive | Restricted lawful incident analysis involving attacker artifacts | Isolated environment, audit log, human incident owner |

Models are selected at runtime from the models actually available in Warp. Configuration stores **capability tiers**, not permanent vendor names.

## Context and Cost Controls

- Trim logs before they enter model context; preserve the beginning, error neighborhood, and ending.
- Use repository search or a code graph before reading entire directories.
- Cache stable doctrine, schemas, product rules, and reference examples where the provider supports it.
- Assign routine sub-tasks to economy models.
- Escalate only when evidence shows a task needs stronger reasoning.
- Set a per-run budget and stop conditions.
- Record cost per verified outcome in Hydra Eyes.

## Security Controls

1. Treat external content as untrusted.
2. Preserve provenance and hashes.
3. Never execute code embedded in ingested materials.
4. Scan for prompt injection, secret requests, and guardrail-bypass instructions.
5. Quarantine suspicious content.
6. Use least-privilege Agent Profiles and MCP access.
7. Store secrets in managed secret storage.
8. Require approval for deployments, publishing, destructive writes, credential changes, sensitive exports, new MCP connections, and memory promotion.
9. Produce draft pull requests rather than silent production changes.

## Warp Team Setup

1. Create or join the Warp team **Omega Hydra OS**.
2. Create an Oz environment connected to `ellbush1420-bushido/hydra-omega-ecosystem-`.
3. Grant the Warp GitHub app repository access.
4. Create a personal API key for runs that must write branches or draft pull requests.
5. Create a team API key for analysis, monitoring, scheduled triage, and non-user automation.
6. Store keys as managed secrets; never commit them.
7. Run the initial control-plane demo:

```bash
cd omega-hydra-core
npm run agent-control
npm run test:agent-control
```

## First Production Mission

```text
Hydra Chief of Staff
→ scope Issue #61 Hydra Skill Forge
→ Hydra Product Architect defines the product contract
→ Build specialist implements one source-to-JSON path
→ Sentinel QA verifies safety, schema, tests, and demo output
→ human approves the draft PR
→ Hydra Eyes records cost, time saved, rework, and accepted outcome
```

## Acceptance Rule

A run is complete only when it has:

- an artifact or diff,
- test or validation evidence,
- a Sentinel release decision,
- all required human approvals,
- a Hydra Eyes value record,
- and an Atlas entry describing what changed and why.
