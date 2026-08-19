import { retrievePublicSource } from "../../../packages/hydra-source-intel/src/index.js";
import { runCloudTask } from "../../../packages/hydra-cloud-ops/src/index.js";
import { createCheckpoint, buildResumePlan } from "../../../packages/hydra-continuity/src/index.js";
import { logEvent, getEventSummary } from "../../../packages/hydra-eyes/src/index.js";

async function runDemo() {
  const source = await retrievePublicSource({
    platform: "hackernews",
    url: "https://news.ycombinator.com/item?id=demo",
    title: "Hydra Source Intel Demo",
    suppliedSnapshot: "A public discussion about AI agents, software automation, model routing, security, and developer workflows."
  });
  logEvent("source_intel_completed", { status: source.status, platform: source.request.platform, adapter: source.route.adapter });

  const cloud = await runCloudTask({ action: "list-hypertables", database: "hydra_demo", dryRun: true });
  logEvent("cloud_ops_planned", { status: cloud.status, action: cloud.task.action });

  const checkpoint = createCheckpoint({
    workflowId: "factory-demo",
    stage: "test",
    completedSteps: ["plan", "architect", "build"],
    pendingSteps: ["test", "security", "review"],
    reason: "provider-limit"
  });
  const continuity = buildResumePlan(checkpoint, { limitReset: true });
  logEvent("continuity_evaluated", { resume: continuity.decision.resume, nextStep: continuity.nextStep });

  return {
    app: "Omega Hydra Agent Extensions",
    modules: ["Hydra Source Intel", "Hydra Cloud Ops", "Hydra Continuity"],
    source,
    cloud,
    continuity,
    telemetry: getEventSummary()
  };
}

console.log(JSON.stringify(await runDemo(), null, 2));
