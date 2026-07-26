import test from "node:test";
import assert from "node:assert/strict";

import { createMockClient } from "../src/mock-client.js";
import { submitMockRequest } from "../src/index.js";

test("mock client submits a run and returns a mock status", () => {
  const client = createMockClient();
  const result = client.submitRun({
    requestId: "req_001",
    jobType: "skill_forge",
    sourceId: "src_guardian_1",
    approvalStatus: "approved",
    modelTier: "economy",
    mockMode: true
  });
  assert.equal(result.status, "mock");
  assert.ok(result.runId.startsWith("mock_run_"));
  assert.equal(result.costUsd, 0);
  assert.equal(result.provenance.adapter, "mock");
});

test("mock client lists runs and supports reset", () => {
  const client = createMockClient();
  client.submitRun({ requestId: "req_a", jobType: "skill_forge", sourceId: "src_1", approvalStatus: "approved" });
  client.submitRun({ requestId: "req_b", jobType: "mission_generation", sourceId: "src_2", approvalStatus: "approved" });
  assert.equal(client.listRuns().length, 2);
  client.reset();
  assert.equal(client.listRuns().length, 0);
});

test("mock client can retrieve a run by ID", () => {
  const client = createMockClient();
  const run = client.submitRun({ requestId: "req_x", jobType: "safety_review", sourceId: "src_3", approvalStatus: "approved" });
  const found = client.getRunStatus(run.runId);
  assert.ok(found !== null);
  assert.equal(found.requestId, "req_x");
});

test("submitMockRequest validates required fields", () => {
  const result = submitMockRequest({ requestId: "req_bad" });
  assert.equal(result.status, "failed");
  assert.ok(result.errorMessage.includes("Validation failed"));
});

test("submitMockRequest returns blocked status for blocked approval", () => {
  const result = submitMockRequest({
    requestId: "req_blocked_1",
    jobType: "skill_forge",
    sourceId: "src_blocked",
    approvalStatus: "blocked"
  });
  assert.equal(result.status, "blocked");
  assert.ok(result.errorMessage.includes("blocked by safety policy"));
});

test("submitMockRequest succeeds for an approved skill_forge job", () => {
  const result = submitMockRequest({
    requestId: "req_ok_1",
    jobType: "skill_forge",
    sourceId: "src_guardian_readiness_v1",
    approvalStatus: "approved",
    modelTier: "economy",
    dryRun: false,
    mockMode: true,
    payload: { skillId: "skill_123" }
  });
  assert.equal(result.status, "mock");
  assert.equal(result.sourceId, "src_guardian_readiness_v1");
  assert.equal(result.costUsd, 0);
  assert.equal(result.provenance.adapter, "mock");
});

test("submitMockRequest supports all allowed job types", () => {
  const jobTypes = ["skill_forge", "safety_review", "mission_generation", "product_generation"];
  for (const jobType of jobTypes) {
    const result = submitMockRequest({
      requestId: `req_${jobType}`,
      jobType,
      sourceId: "src_test",
      approvalStatus: "approved",
      mockMode: true
    });
    assert.equal(result.status, "mock", `Expected mock status for jobType=${jobType}`);
  }
});
