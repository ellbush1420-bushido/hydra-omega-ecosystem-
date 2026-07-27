# Hydra Zeta OS v2 — n8n API Control Plane

**Status:** implementation doctrine  
**Updated:** 2026-07-27  
**Official source:** https://docs.n8n.io/connect/n8n-api/

## Decision

n8n is Hydra Zeta OS v2's workflow orchestrator. Hydra applications may use the n8n public API to inventory workflows, observe executions, control approved lifecycle operations, and synchronize operational telemetry.

n8n is not the system of record for customers, entitlements, compliance decisions, AI policy, product approvals, or source provenance. Those records remain in Supabase.

```text
Hydra Dashboard / deployment automation
                  ↓
        server-side n8n API client
                  ↓
         n8n workflow control plane
        ┌─────────┼─────────┐
        ↓         ↓         ↓
     Fanvue    Guardian   Skill Forge
        ↓         ↓         ↓
       normalized events and task requests
                  ↓
      Hydra AI gateway / Supabase / approvals
```

## Authentication

Use an n8n API key through the `X-N8N-API-KEY` request header. The key is a server-side secret and must never appear in browser JavaScript, workflow exports, GitHub, logs, prompt text, or webhook payloads.

Required environment references:

```text
N8N_BASE_URL
N8N_API_KEY
N8N_PROJECT_ID (when project scoping is supported and configured)
```

Hydra stores only the secret reference and a non-secret key fingerprint/rotation timestamp. It does not store the raw key in application tables.

## Public API Versus Webhooks

Use the public API for the n8n control plane:

- workflow inventory and synchronization,
- workflow activation-state reconciliation,
- execution inventory and status monitoring,
- approved execution retry or deletion operations,
- tags, projects, variables, or other resources exposed by the installed n8n edition,
- owner-authorized security audits,
- deployment/source-control actions where supported.

Use authenticated production webhooks or internal queues for the Hydra data plane:

- submitting a bounded AI task,
- receiving Fanvue lifecycle events,
- running Guardian advisory ingestion,
- starting an authorized Skill Forge ingestion job,
- sending normalized completion/failure events back to Hydra.

Do not treat an n8n editor/test webhook as a production interface. Webhook callers must use a separate shared secret, signed request, mTLS, or gateway authorization appropriate to the deployment.

## API Client Contract

```ts
n8n.request({
  method: "GET",
  resource: "executions",
  query: { workflowId, status, cursor, limit },
  ownerId,
  purpose: "dashboard.execution_sync",
  approvalMode: "read_only"
})
```

The client must:

1. build URLs from an allowlisted base URL and resource map,
2. attach the API key only server-side,
3. enforce request timeouts,
4. follow documented cursor pagination,
5. bound page count and returned records,
6. redact execution data before logging,
7. respect access/project boundaries,
8. classify errors and use bounded backoff,
9. record request metadata without secret headers or full payloads,
10. require approval for destructive or operationally consequential calls.

## Lifecycle Policy

| Operation | Default | Required control |
|---|---|---|
| List/get workflows | Allowed | Read-only API identity |
| List/get executions | Allowed | Project scope and payload minimization |
| Create/update workflow | Gated | Change record and review |
| Activate/deactivate workflow | Gated | Owner approval and environment check |
| Retry execution | Gated | Idempotency review and retry budget |
| Delete execution/workflow | Blocked by default | Explicit approval and retention review |
| Security audit | Owner-only | Authorized instance owner and audit logging |
| Source-control production pull | Gated | Protected branch/deployment approval |

## Execution Synchronization

Hydra polls execution metadata on a bounded schedule or accepts an authenticated completion callback. It stores normalized status, timestamps, workflow ID, retry lineage, and a pointer to n8n—not raw execution payloads by default.

Canonical status mapping:

```text
n8n new/running/waiting → queued/running/waiting
n8n success             → succeeded
n8n error/crashed       → failed
n8n canceled            → cancelled
```

Preserve unknown source statuses as `unknown` plus the original status string. Never silently convert an unknown status to success.

## Retry Doctrine

- Automatic retry is allowed only for tasks classified as idempotent.
- A retry requires a maximum-attempt budget and backoff policy.
- Payment, entitlement, outbound-message, role-change, posting, and compliance workflows require idempotency keys and human review before manual retry when side effects may already have occurred.
- Record the original execution ID and retry execution ID.
- Never create an unbounded retry loop between Hydra and n8n.

## Workflow Registry

Every production workflow receives a stable Hydra key and metadata:

- Hydra workflow key,
- n8n workflow ID,
- environment,
- owning module and owner,
- purpose,
- risk tier,
- active state,
- expected trigger type,
- approval mode,
- idempotency requirement,
- timeout and retry budget,
- last synchronized version/hash,
- last successful execution,
- deployment status.

Initial registry:

- `fanvue.new_subscriber_onboarding`
- `fanvue.daily_analytics_digest`
- `fanvue.campaign_attribution_sync`
- `fanvue.discord_role_sync`
- `guardian.weekly_watch_draft`
- `skill_forge.authorized_ingestion`
- `commerce.sales_event_reconciliation`

## Security Audit Integration

The n8n security audit can identify credential, database, file-system, node, and instance risks. Hydra may ingest a normalized audit summary into Guardian, but:

- the call must use an authorized instance-owner identity,
- raw secrets and sensitive workflow data are excluded,
- findings are advisory until reviewed,
- risky/community/custom nodes are inventory signals, not automatic proof of compromise,
- audit failures never suppress existing security controls.

## Environment and Deployment Separation

- Keep development and production instances or environments distinct.
- Bind production to a protected branch where source-control features are used.
- Do not let the application dashboard modify production workflows with a development key.
- Store an environment on every workflow and execution record.
- Require review before production activation or source-control pull.

## Minimum Viable Demo

1. Configure a development-only n8n base URL and API key in a secret manager.
2. Register one synthetic workflow: `guardian.weekly_watch_draft`.
3. List/get the workflow through the server-side n8n client.
4. Trigger it through an authenticated development webhook using a synthetic payload.
5. Synchronize execution metadata into Supabase using cursor pagination.
6. Link the execution to a `hydra_ai_task_runs.trace_id`.
7. Display status, duration, retry lineage, AI cost, and approval state.
8. Force one safe failure and demonstrate one bounded idempotent retry.

## Acceptance Criteria

- No n8n API key reaches client code or logs.
- API and webhook credentials are separate.
- Pagination is cursor-aware and bounded.
- Workflow/execution access is environment and project scoped.
- Consequential lifecycle operations require approval.
- Retry rules enforce idempotency and maximum attempts.
- Hydra stores normalized metadata rather than raw execution payloads by default.
- n8n executions can be correlated to Hydra AI traces and module records.
