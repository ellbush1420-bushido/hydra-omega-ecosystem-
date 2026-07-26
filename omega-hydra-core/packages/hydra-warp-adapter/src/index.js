import { createMockClient } from "./mock-client.js";
import { createOzClient } from "./oz-client.js";

const ALLOWED_JOB_TYPES = ["skill_forge", "safety_review", "mission_generation", "product_generation"];
const ALLOWED_APPROVAL_STATUSES = ["approved", "pending", "blocked"];

function validateRequest(request = {}) {
  const errors = [];
  if (!request.requestId) errors.push("requestId is required");
  if (!ALLOWED_JOB_TYPES.includes(request.jobType)) {
    errors.push(`jobType must be one of: ${ALLOWED_JOB_TYPES.join(", ")}`);
  }
  if (!request.sourceId) errors.push("sourceId is required");
  if (!ALLOWED_APPROVAL_STATUSES.includes(request.approvalStatus)) {
    errors.push(`approvalStatus must be one of: ${ALLOWED_APPROVAL_STATUSES.join(", ")}`);
  }
  return errors;
}

function buildExecutionResult(runResult, requestId, sourceId) {
  return {
    requestId,
    status: runResult.status || "mock",
    sourceId,
    completedAt: runResult.completedAt || new Date().toISOString(),
    artifacts: runResult.artifacts || [],
    provenance: runResult.provenance || {},
    telemetryEventId: null,
    modelTierUsed: runResult.modelTier || "economy",
    costUsd: runResult.costUsd || 0
  };
}

export function submitMockRequest(request = {}) {
  const errors = validateRequest(request);
  if (errors.length > 0) {
    return {
      requestId: request.requestId || "unknown",
      status: "failed",
      sourceId: request.sourceId || "unknown",
      completedAt: new Date().toISOString(),
      artifacts: [],
      errorMessage: `Validation failed: ${errors.join("; ")}`,
      provenance: { adapter: "mock" },
      telemetryEventId: null,
      modelTierUsed: null,
      costUsd: 0
    };
  }

  if (request.approvalStatus === "blocked") {
    return {
      requestId: request.requestId,
      status: "blocked",
      sourceId: request.sourceId,
      completedAt: new Date().toISOString(),
      artifacts: [],
      errorMessage: "Request is blocked by safety policy.",
      provenance: { adapter: "mock" },
      telemetryEventId: null,
      modelTierUsed: null,
      costUsd: 0
    };
  }

  const client = createMockClient();
  const runResult = client.submitRun(request);
  return buildExecutionResult(runResult, request.requestId, request.sourceId);
}

export async function submitOzRequest(request = {}) {
  const errors = validateRequest(request);
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join("; ")}`);
  }

  if (request.approvalStatus !== "approved") {
    throw new Error(`Cannot submit to Oz: approvalStatus is "${request.approvalStatus}", must be "approved".`);
  }

  const client = createOzClient();
  const runResult = await client.submitRun(request);
  return buildExecutionResult(runResult, request.requestId, request.sourceId);
}

export { createMockClient, createOzClient };
