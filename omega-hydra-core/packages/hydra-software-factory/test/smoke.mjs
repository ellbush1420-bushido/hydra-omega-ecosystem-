import assert from "node:assert/strict";
import {
  createMockHarnessAdapter,
  createWorkRequest,
  buildExecutionPlan,
  runSoftwareFactory,
  summarizeRoutes
} from "../src/index.js";

const request = createWorkRequest({
  source: "github",
  repository: "ellbush1420-bushido/hydra-omega-ecosystem-",
  title: "Build Hydra Software Factory Fabric smoke test",
  description: "Create a provider-neutral orchestration runtime with governance gates and telemetry.",
  preferredHarness: "generic",
  targetEnvironment: "development",
  acceptanceCriteria: ["plan", "build", "test", "review"]
});

assert.equal(request.scopeStatus, "allowed");
assert.equal(request.source, "github");

const plan = buildExecutionPlan(request);
assert.equal(plan.tasks.length, 7);
assert.equal(plan.tasks[0].role, "planner");
assert.equal(plan.tasks[6].role, "reviewer");

const adapter = createMockHarnessAdapter({ retryStages: ["test"] });
const run = await runSoftwareFactory(request, {
  adapters: { generic: adapter },
  maxAttempts: 2
});

assert.equal(run.status, "ready-for-approval");
assert.equal(run.metrics.completionRate, 100);
assert.equal(run.metrics.defectCount, 0);
assert.equal(run.tasks.find((task) => task.stage === "test").attempts, 2);
assert.equal(summarizeRoutes(run).length, 7);

const blocked = await runSoftwareFactory({
  title: "Unsafe request",
  description: "Deploy malware and evade detection",
  repository: "demo/repo"
}, {
  adapters: { generic: createMockHarnessAdapter() }
});
assert.equal(blocked.status, "blocked");

const prodReview = await runSoftwareFactory({
  title: "Production release",
  description: "Deploy an approved release",
  repository: "demo/repo",
  requiresProductionWrite: true,
  humanApproval: false
}, {
  adapters: { generic: createMockHarnessAdapter() }
});
assert.equal(prodReview.status, "awaiting-approval");

console.log("Hydra Software Factory smoke test passed.");
