# Hydra Skill Forge — Warp / Oz Integration

This document captures the open questions, configuration guidance, and integration plan for the optional Warp/Oz execution adapter.

## Status

The Warp/Oz adapter is **Phase 3** of the Skill Forge roadmap. The deterministic core (Phase 1) and demo application (Phase 2) run fully offline without Warp credentials.

## Local and CI Execution

Use `mock-client.js` for all local development and CI runs:

```js
import { submitMockRequest } from "./packages/hydra-warp-adapter/src/index.js";

const result = submitMockRequest({
  requestId: "req_001",
  jobType: "skill_forge",
  sourceId: "src_guardian_readiness_v1",
  approvalStatus: "approved",
  modelTier: "economy",
  mockMode: true
});
// result.status === "mock"
```

No API keys, network access, or credentials are required.

## Real Oz Adapter Configuration

When ready to connect to the real Warp/Oz API, set these environment variables (never commit them to the repository):

```sh
export OZ_BASE_URL=https://api.oz.example.com
export OZ_API_KEY=<your-api-key>
```

Then use `createOzClient()` from `oz-client.js`. The real adapter is a stub until the open questions below are resolved.

## Open Questions (Warp/Oz API)

The following must be resolved before implementing the real `oz-client.js`:

**Interface**
- Will Hydra use the Oz REST API, TypeScript SDK, or `oz` CLI as the primary adapter?
- Is the migration path from deprecated `warp-cli` to `oz` documented?

**Account and Environment**
- Which account/workspace and plan will own API keys, agents, environments, and usage?
- Which models are available, and can Hydra select them per run?

**Limits**
- What are the rate, concurrency, runtime, payload, and output limits?
- Can structured JSON output be enforced and schema validated?

**Run Lifecycle**
- Are webhooks/event streams available, or must status be polled?
- What stable run states and error codes should the adapter normalize?
- How are idempotency, retries, cancellation, and timeout handled?

**Artifacts**
- How are files/artifacts uploaded, retained, downloaded, and deleted?
- Can Warp Drive prompts, notebooks, workflows, and rules be referenced by stable IDs?

**MCP Servers**
- How are MCP servers attached to local and cloud runs?
- Which transports are supported?

**Secrets**
- How are secrets scoped, rotated, redacted, and prevented from entering logs?

**Permissions**
- What execution permissions can profiles enforce for filesystem, network, shell, GitHub, and MCP tools?

**Audit**
- What audit data is returned for prompts, resolved configuration, commands, tool calls, approvals, costs, and artifacts?

**Data Governance**
- What data-retention, regional-processing, and deletion controls apply?

**Human Approval**
- Can a run require human approval before commands, writes, pushes, deployments, or external messages?

## Safety Constraints

The warp adapter enforces these rules before any request reaches Oz:

1. Only `approved` requests may be submitted to the real Oz API.
2. `blocked` requests are rejected immediately with `status: "blocked"`.
3. `pending` requests are held until approval is granted.
4. Secrets, raw copyrighted source text, and restricted material must never enter prompts or logs.
5. All runs must carry a `sourceId` for provenance tracking.

## Integration with the Control Plane

The control plane (`hydra-agent-control-plane`) handles planning, routing, approval gates, QA, and execution policy. Skill Forge owns source-to-artifact transformation. Warp/Oz is the optional execution backend.

```text
Skill Forge pipeline completes
  → ExecutionRequest created (with sourceId, approvalStatus, modelTier)
  → Control plane validates and routes
  → If approved and mockMode: submitMockRequest()
  → If approved and real: submitOzRequest()  [Phase 3]
  → ExecutionResult returned with provenance
```
