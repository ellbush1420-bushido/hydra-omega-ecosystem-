import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { forgeSkillFromSource, listTelemetryEvents, getTelemetrySummary } from "../../../packages/hydra-skill-forge/src/index.js";
import { buildRunPlan } from "../../../packages/hydra-agent-control-plane/src/index.js";
import { submitMockRequest } from "../../../packages/hydra-warp-adapter/src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = path.join(__dirname, "../fixtures/guardian-readiness.source.json");

function loadFixture() {
  return JSON.parse(fs.readFileSync(FIXTURE_PATH, "utf8"));
}

function runSkillForgeDemo() {
  console.error("[skill-forge] Loading Guardian Readiness fixture...");
  const guardianSource = loadFixture();

  console.error("[skill-forge] Running full pipeline...");
  const result = forgeSkillFromSource(guardianSource);

  const { normalized, framework, safetyReview, skill, missions, companionBehavior, productTemplates, telemetryEvent } = result;

  console.error(`[skill-forge] Safety review: ${safetyReview.approvalStatus}`);
  console.error(`[skill-forge] Skill generated: ${skill.name}`);
  console.error(`[skill-forge] Missions: ${missions.length}, Products: ${productTemplates.length}`);

  const runPlan = buildRunPlan({
    task: {
      title: `Skill Forge — ${skill.name}`,
      workType: "skill_forge",
      complexity: 2,
      risk: "low",
      repeatable: true,
      deterministic: true,
      requestedActions: []
    },
    budgetUsd: 0
  });

  console.error("[skill-forge] Control plane run plan built.");

  const executionResult = submitMockRequest({
    requestId: `req_${Date.now()}`,
    jobType: "skill_forge",
    sourceId: normalized.sourceId,
    approvalStatus: safetyReview.approvalStatus === "approved" ? "approved" : "pending",
    modelTier: runPlan.modelTier,
    dryRun: false,
    mockMode: true,
    payload: { skillId: skill.id }
  });

  console.error("[skill-forge] Mock execution result:", executionResult.status);

  const output = {
    app: "Hydra Skill Forge — Guardian Readiness Demo",
    purpose: "Transform source knowledge into reusable skills, missions, companion behaviors, and product templates.",
    source: {
      sourceId: normalized.sourceId,
      title: normalized.title,
      sourceType: normalized.sourceType,
      claimStatus: normalized.claimStatus,
      provenance: normalized.provenance,
      disclaimer: normalized.disclaimer
    },
    safetyReview,
    skill,
    missions,
    companionBehavior,
    productTemplates,
    controlPlane: {
      runPlan,
      executionResult
    },
    telemetry: {
      latestEvent: telemetryEvent,
      summary: getTelemetrySummary(),
      events: listTelemetryEvents()
    },
    safetyScope: "lawful defensive education, privacy awareness, digital hygiene, business automation, community service, and readiness training only"
  };

  return output;
}

const output = runSkillForgeDemo();
console.log(JSON.stringify(output, null, 2));
