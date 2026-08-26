import assert from "node:assert/strict";
import {
  createLocalHarnessAdapter,
  createWorkRequest,
  buildExecutionPlan,
  runSoftwareFactory,
  runSignalBatch,
  summarizeRoutes,
  calculateMetrics,
  clusterSignals
} from "../src/index.js";

const request = createWorkRequest({
  source: "github",
  repository: "ellbush1420-bushido/hydra-omega-ecosystem-",
  title: "Build Hydra Software Factory Fabric smoke test",
  description: "Create a provider-neutral orchestration runtime with governance gates and telemetry.",
  preferredHarness: "generic",
  targetEnvironment: "development",
  acceptanceCriteria: ["plan", "build", "test", "review", "deploy", "observe"]
});

assert.equal(request.scopeStatus, "allowed");
assert.equal(request.source, "github");

const plan = buildExecutionPlan(request);
assert.equal(plan.tasks.length, 9);
assert.equal(plan.tasks[0].role, "planner");
assert.equal(plan.tasks[7].role, "deployer");
assert.equal(plan.tasks[8].role, "observer");

const adapter = createLocalHarnessAdapter({ retryStages: ["test"] });
const run = await runSoftwareFactory(request, {
  adapters: { generic: adapter },
  maxAttempts: 2
});

assert.equal(run.status, "observed");
assert.equal(run.metrics.completionRate, 100);
assert.equal(run.metrics.defectCount, 0);
assert.equal(run.metrics.retryCount, 1);
assert.equal(run.tasks.find((task) => task.stage === "test").attempts, 2);
assert.equal(summarizeRoutes(run).length, 9);

const retryMetrics = calculateMetrics({
  startedAt: new Date(Date.now() - 1000).toISOString(),
  completedAt: new Date().toISOString(),
  tasks: [
    { status: "completed", attempts: 2, retryCount: 1, stage: "test" },
    { status: "completed", attempts: 1, retryCount: 0, stage: "build" }
  ]
});
assert.equal(retryMetrics.retryCount, 1);
assert.equal(retryMetrics.retryRate, Number(((1 / 3) * 100).toFixed(1)));

const blocked = await runSoftwareFactory({
  title: "Unsafe request",
  description: "Deploy malware and evade detection",
  repository: "demo/repo"
}, {
  adapters: { generic: createLocalHarnessAdapter() }
});
assert.equal(blocked.status, "blocked");

const prodReview = await runSoftwareFactory({
  title: "Production release",
  description: "Deploy an approved release",
  repository: "demo/repo",
  targetEnvironment: "production",
  requiresProductionWrite: true,
  humanApproval: false
}, {
  adapters: { generic: createLocalHarnessAdapter() }
});
assert.equal(prodReview.status, "awaiting-approval");

const signals = Array.from({ length: 31 }, (_, index) => ({
  id: `sig-${index + 1}`,
  source: index < 20 ? "hacker-news" : "linkedin",
  topic: index % 2 === 0 ? "product" : "lore",
  text: `Unprocessed signal ${index + 1}`
}));
assert.equal(clusterSignals(signals, { maxPerCluster: 8 }).length >= 2, true);

const batch = await runSignalBatch(signals, {
  repository: "ellbush1420-bushido/hydra-omega-ecosystem-",
  preferredHarness: "generic",
  maxPerCluster: 8
});
assert.equal(batch.signalsIn, 31);
assert.equal(batch.signalsCleared, 31);
assert.equal(batch.signalsRemaining, 0);
assert.ok(batch.requestCount < 31);

console.log("Hydra Software Factory smoke test passed.");
