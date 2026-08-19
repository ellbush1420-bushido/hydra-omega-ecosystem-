import { logEvent, getEventSummary, resetEvents } from "../../../packages/hydra-eyes/src/index.js";
import {
  createMockHarnessAdapter,
  runSoftwareFactory,
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
      "Seven specialized worker stages are generated",
      "Routing records model and harness choices",
      "Governance stops unsafe or unapproved actions",
      "Hydra Eyes records orchestration telemetry"
    ]
  };

  const mockHarness = createMockHarnessAdapter({ name: "hydra-mock", retryStages: ["test"] });
  const run = await runSoftwareFactory(request, {
    adapters: {
      generic: mockHarness
    },
    maxAttempts: 2,
    logEvent
  });

  console.log(JSON.stringify({
    app: "Hydra Software Factory Fabric MVP",
    status: run.status,
    request: run.request,
    routes: summarizeRoutes(run),
    metrics: run.metrics,
    approvals: run.approvals,
    artifacts: run.artifacts,
    hydraEyes: getEventSummary(),
    designRule: "Hydra owns workflow, policy, state, telemetry, and institutional memory. Models and coding harnesses are replaceable execution providers."
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
