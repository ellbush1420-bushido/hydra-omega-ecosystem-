# Hydra Totality: Guardian-First Restructure

## Decision

Treat the Hydra system as a governed product operating architecture, not a single undifferentiated universe. The commercial proof path is:

```text
consent -> assessment -> score and findings -> readiness report -> remediation tasks -> Monthly Guardian Watch
```

Everything else must either support that journey, remain a separately governed creative capability, or stay out of the launch scope.

## Center 5: accountable authority

The Lo Shu-inspired 3x3 lattice is a control map. Its center is not automation authority; it is the human decision and escalation point.

| Position | Capability | Control question |
| --- | --- | --- |
| 1 | Product | Is the customer outcome specific and valuable? |
| 2 | Identity | Who or what is acting? |
| 3 | Intake | Is consent, scope, and purpose recorded? |
| 4 | Intent | Is the work aligned to a lawful, defensive objective? |
| 5 | Human approval | Does a responsible operator authorize the next irreversible step? |
| 6 | Telemetry | Is the outcome observable with minimum necessary data? |
| 7 | Delivery | Is access granted only after durable fulfillment state exists? |
| 8 | Evidence | Can the decision and its inputs be reviewed later? |
| 9 | Policy | Does the request pass safety, privacy, and release rules? |

## Guardian Operating Profile

Use a consent-based, non-clinical operating profile for customers and operators. It records only information needed to safely route work:

1. desired outcome and use case;
2. decision authority and escalation contact;
3. cadence and capacity constraints;
4. declared risk and consent preferences; and
5. training and reflection goals.

It is not a diagnosis, psychological assessment, surveillance record, or eligibility model.

## Triple-9 tri-axis

At each of nine gates, align three dimensions:

| Gate | Human | Product | System |
| --- | --- | --- | --- |
| 1 | Awareness | Intake | Public edge |
| 2 | Intent | Consent | Identity |
| 3 | Criteria | Assessment | Policy |
| 4 | Plan | Scoring | Agent control |
| 5 | Choice | Report | Human approval |
| 6 | Action | Remediation | Delivery |
| 7 | Review | Guardian Watch | Telemetry |
| 8 | Reflection | Renewal | Audit trail |
| 9 | Unity | Scale decision | Governance |

## Nine-phase Totality Engine

```text
1 Frame -> 2 Consent -> 3 Diagnose -> 4 Plan -> 5 Approve -> 6 Deliver -> 7 Observe -> 8 Learn -> 9 Govern
```

Phase 5 is the deliberate human gate. Agents may prepare evidence, draft outputs, and propose bounded actions; they do not self-authorize access expansion, financial commitments, public publication, or destructive actions.

## Triplex ACIOS protocol

Apply the same protocol across client, agent, and platform planes:

| Step | Meaning | Non-negotiable control |
| --- | --- | --- |
| Authorize | Verify role, consent, and purpose | least privilege |
| Contextualize | Bind the action to tenant, request, and scope | correlation ID |
| Instrument | Record decision-relevant events | minimal telemetry |
| Operate | Perform a reversible or queued action | retries and dead-letter path |
| Safeguard | Review, revoke, and escalate | human override |

## Tricell Python Head

The automation head is split into three cells:

- **Interface & Regeneration Cell**: normalizes input, selects the approved route, and formats user-safe output.
- **Core Execution Cell**: runs deterministic scoring, product logic, or approved content transformation.
- **Perimeter Sentinel Cell**: checks policy, permission, privacy minimization, logging, failure mode, and escalation.

Every external tool call must carry a scoped identity, a correlation ID, and an allowlisted capability. The Sentinel Cell must be able to deny or pause work.

## Implementation boundaries

1. **Public edge**: landing page, customer portal, catalog, consent and assessment forms. No service keys or raw webhooks.
2. **Identity and policy**: organization membership, role/permission checks, resource-level authorization where necessary, RLS tenant boundaries, and step-up authentication for sensitive operations.
3. **Application services**: versioned assessment, deterministic scoring, report generation, remediation state, and an agent/tool gateway.
4. **Evidence and fulfillment**: append-only delivery ledger, immutable event spine, asynchronous workers, retriable provider adapters, and dead-letter visibility.
5. **Owner controls**: approval queue, emergency revoke, replay controls, retention policy, and release checklist.

## Complete before merge of the Guardian foundation

- Add and validate a package lockfile; keep Docker on `npm ci`.
- Add an actual server runtime for webhooks and service-role actions; do not perform them from Vite client code.
- Add write policies or server-only write paths for assessments, ledger rows, and telemetry.
- Version the questionnaire and pure score function, with test fixtures for deterministic results.
- Add CI for `npm ci`, `npm run build`, JSON validation, SQL lint/apply check, and secret scan.

## Next controlled increments

1. Build the Guardian audit and readiness report end to end.
2. Add protected delivery ledger and a manual fulfillment console.
3. Add identity/RBAC; introduce resource-level authorization only when the first multi-operator or multi-tenant exception requires it.
4. Introduce agent identities, allowlisted tools, and replayable traces after the client flow is stable.

## Non-goals for the first release

- autonomous agent access expansion or financial decisions;
- broad public lore expansion as a prerequisite for the product launch;
- collection of unnecessary behavioral or psychological data;
- unsupported payment, webhook, Discord, or MCP integrations; and
- security claims that have not been implemented and tested.

## Definition of done

A client can complete a consented assessment, receive a traceable report and remediation plan, access only purchased or authorized materials, and receive a Monthly Guardian Watch update. Operators can explain, review, and revoke every sensitive action in the path.
