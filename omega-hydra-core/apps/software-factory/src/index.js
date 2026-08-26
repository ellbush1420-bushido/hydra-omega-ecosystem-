import { logEvent, getEventSummary, resetEvents } from "../../../packages/hydra-eyes/src/index.js";
import {
  createLocalHarnessAdapter,
  createFileRunStore,
  runSoftwareFactory,
  runSignalBatch,
  summarizeRoutes
} from "../../../packages/hydra-software-factory/src/index.js";

async function main() {
  resetEvents();

  const request = {
    source: "github",
    externalRef: "issue-67",
    repository: "ellbush1420-bushido/hydra-omega-ecosystem-",
    title: "Hydra Software Factory Fabric MVP",
    description: "Build a provider-neutral software factory that decomposes software work across specialized agents, routes harnesses and models, enforces governance gates, and records production metrics.",
    priority: "high",
    preferredHarness: "generic",
    targetEnvironment: "development",
    constraints: [
      "No external dependency required for MVP",
      "Production writes require explicit human approval",
      "Harness and model providers must remain replaceable"
    ],
    acceptanceCriteria: [
      "Intake normalizes requests",
      "Nine specialized worker stages are generated",
      "Routing records model and harness choices",
      "Governance stops unsafe or unapproved actions",
      "Deploy and Observe are first-class stages",
      "Hydra Eyes records orchestration telemetry"
    ]
  };

  const store = createFileRunStore();
  const localHarness = createLocalHarnessAdapter({ name: "hydra-local", retryStages: ["test"] });
  const run = await runSoftwareFactory(request, {
    adapters: {
      generic: localHarness
    },
    maxAttempts: 2,
    logEvent,
    store
  });

  const demoSignals = Array.from({ length: 31 }, (_, index) => ({
    id: `sig-${index + 1}`,
    source: index < 16 ? "ingest" : "linkedin",
    topic: index % 3 === 0 ? "product" : "ops",
    text: `Unprocessed dashboard signal ${index + 1}`
  }));

  const batch = await runSignalBatch(demoSignals, {
    repository: "ellbush1420-bushido/hydra-omega-ecosystem-",
    preferredHarness: "generic",
    maxPerCluster: 8,
    logEvent,
    store
  });

  console.log(JSON.stringify({
    app: "Hydra Software Factory Fabric",
    status: run.status,
    request: run.request,
    routes: summarizeRoutes(run),
    metrics: run.metrics,
    persistPath: run.persistPath,
    approvals: run.approvals,
    artifacts: run.artifacts,
    signalBatch: {
      requestCount: batch.requestCount,
      signalsIn: batch.signalsIn,
      signalsCleared: batch.signalsCleared,
      signalsRemaining: batch.signalsRemaining
    },
    hydraEyes: getEventSummary(),
    designRule: "Hydra owns workflow, policy, state, telemetry, and institutional memory. Models and coding harnesses are replaceable execution providers."
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
