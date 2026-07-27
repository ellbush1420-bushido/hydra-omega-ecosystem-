# Hydra Zeta OS v2 — Multi-Model AI Control Plane

**Status:** implementation doctrine  
**Updated:** 2026-07-27  
**Applies to:** Guardian, Creator OS, Skill Forge, Fanvue Commercial Bridge, and Hydra Lotus Commerce

## Decision

Hydra Zeta OS v2 uses a provider-neutral AI control plane. Product modules call a Hydra task interface instead of calling a model vendor directly.

```text
Next.js / authenticated product modules
                 ↓
          n8n orchestration
                 ↓
       Hydra AI task gateway
       ┌─────────┼─────────┐
       ↓         ↓         ↓
    OpenAI    Anthropic   Approved open model
       └─────────┼─────────┘
                 ↓
 Policy • approval • budget • telemetry
                 ↓
 Supabase • notifications • dashboard
```

A model is a replaceable execution dependency, not the system of record. Supabase remains the operational record, n8n coordinates workflows, and the product UI owns authentication and human approval.

## Canonical Task Contract

Product modules submit a normalized request:

```ts
AI.request({
  taskType: "guardian.executive_report",
  provider: "auto",
  sensitivity: "internal",
  inputRef: "hydra://artifact/…",
  outputSchema: "guardian-readiness-report.v1",
  ownerId: "…",
  budget: { maxUsd: 0.50, maxTokens: 12000 },
  approvalMode: "review_before_external_action"
})
```

The gateway returns a structured result plus provider, model, latency, token use, estimated cost, policy decision, and trace ID. Secrets and unnecessary private source content must never be written to traces.

## Provider Roles

### OpenAI lane

Preferred for conversation, customer support, structured outputs, tool/API orchestration, and workflow decisions that benefit from reliable schemas.

### Anthropic lane

Preferred for long-form documentation, architecture review, technical analysis, large-context synthesis, and coding assistance when its evaluated quality/cost profile is best.

### Approved open-model lane

Reserved for self-hosted or controlled inference, offline workflows, privacy-sensitive deployments, low-cost classification, and experimentation. Open models do not bypass evaluation, data-boundary, or output-review requirements.

Provider names and current model identifiers belong in configuration, not business logic. Routing is based on capability, sensitivity, latency, cost, health, and policy—not marketing claims or a permanently hard-coded vendor hierarchy.

## Routing Order

1. Validate task owner, purpose, sensitivity, and output schema.
2. Apply connector permissions and data-boundary policy.
3. Remove providers/models not approved for the sensitivity class.
4. Select candidates that satisfy required capabilities.
5. Rank by evaluated quality, current health, budget, and latency target.
6. Execute with timeout and bounded retries.
7. Fail over only to a policy-compatible candidate.
8. Validate structured output and record telemetry.
9. Queue consequential external actions for human approval.

## Non-Negotiable Governance

- No autonomous loop without a gate.
- No agent without an owner.
- No connector without explicit permissions.
- No AI-generated code merged without review and tests.
- No long-running task without a budget and stop condition.
- No provider fallback that weakens the data boundary.
- No external message, post, promotion, purchase, entitlement, or compliance decision merely because a model recommended it.
- No plaintext API keys, OAuth tokens, private media URLs, or full private conversations in prompts, logs, or telemetry.

## Module Integration

### Guardian

Initial automated flow:

```text
Approved public advisories
→ source verification
→ bounded summarization
→ Guardian risk classification
→ executive report draft
→ training recommendation draft
→ human review
→ dashboard / Monthly Guardian Watch
```

Guardian remains defensive and consent-based: awareness, privacy hygiene, readiness, education, and authorized public-source intelligence. It must not become a surveillance or offensive-operations layer.

### Creator OS and Fanvue

The AI gateway may generate captions, content plans, workload summaries, campaign insights, and reply suggestions. Fanvue messages, posts, promotions, media actions, profile changes, exports, and Discord role changes continue through the existing creator approval queue.

### Skill Forge

```text
Authorized source material
→ OCR / extraction
→ provenance record
→ segmentation
→ embeddings / knowledge graph
→ structured lesson outline
→ course / PDF / script / marketing derivatives
→ quality and rights review
→ publishable asset
```

Every derivative must retain source provenance and visibility classification. Restricted professional material cannot be silently promoted into public content.

### Hydra Lotus Commerce

AI may classify catalog risk, draft buyer guides, summarize performance, and flag compliance issues. It may not approve restricted products, invent safety/ballistic/medical claims, create deceptive endorsements, or authorize affiliate payouts.

## ChatGPT Work Boundary

ChatGPT Work may be used as a supervised operator for authenticated-site tasks when the user deliberately invokes it. It is not treated as a background API or invisible service account. Workflows must respect site permissions, minimize retrieved data, show consequential actions for review, and store only the normalized result needed by Hydra.

## Dashboard Modules

- **AI:** provider health, route decisions, token use, estimated cost, prompt/template version, failures.
- **Guardian:** readiness score, advisory feed, risk trends, report approvals, training recommendations.
- **Creator:** revenue, subscribers, campaigns, workload, approval queue.
- **Skill Forge:** ingestion jobs, provenance, knowledge assets, derivative status.
- **Automation:** n8n workflow status, queue depth, retries, stop conditions.
- **Commerce:** partner status, product risk, clicks, verified sales, compliance reviews.

## Delivery Sequence

### Sprint 1 — Control plane

- AI provider registry and routing policy
- normalized task gateway
- telemetry and budget tables
- n8n request/response contract
- Supabase authentication/RLS design

### Sprint 2 — Creator integration

- Fanvue read-only analytics connection
- Creator Dashboard
- campaign and CRM sync
- creator-reviewed AI suggestions

### Sprint 3 — Guardian integration

- approved-source advisory ingestion
- source-linked executive report drafts
- readiness dashboard
- human-reviewed training recommendations

### Sprint 4 — Skill Forge

- authorized document ingestion
- provenance and visibility enforcement
- knowledge graph/embedding adapters
- course, report, script, and marketing derivative pipeline

## Minimum Viable Demo

1. Submit a synthetic `guardian.executive_report` task.
2. Route it using the checked-in policy with no vendor-specific code in the Guardian module.
3. Validate the response against a JSON schema.
4. Store run, usage, and policy records in Supabase.
5. Display provider, cost, latency, citations/source references, and approval state.
6. Repeat with a synthetic `creator.analytics_digest` task to prove the same gateway serves another module.

## Acceptance Criteria

- One normalized interface supports at least two provider adapters.
- No product module contains hard-coded provider selection.
- Sensitivity and approval mode are mandatory.
- Per-run budget and stop conditions are enforced.
- Provider/model/cost/latency telemetry is queryable.
- Fallback cannot cross an unapproved data boundary.
- Consequential actions remain approval-gated.
- Guardian outputs retain source references.
- Skill Forge derivatives retain provenance and visibility classification.
