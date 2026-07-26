import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeSource,
  detectSourceType
} from "../src/normalize-source.js";

import { extractFramework } from "../src/extract-framework.js";
import { classifySafety } from "../src/classify-safety.js";
import { generateSkill } from "../src/generate-skill.js";
import { generateMissionTemplates } from "../src/generate-missions.js";
import { generateCompanionBehavior } from "../src/generate-companion.js";
import { generateProductTemplates } from "../src/generate-products.js";
import { emitTelemetry, listTelemetryEvents, resetTelemetry } from "../src/telemetry.js";
import { forgeSkillFromSource } from "../src/index.js";

test("normalizeSource assigns a sourceId and cleans whitespace", () => {
  const result = normalizeSource({
    title: "  Test Source  ",
    description: "  some   text  "
  });
  assert.ok(result.sourceId.startsWith("src_"));
  assert.equal(result.title, "Test Source");
  assert.equal(result.description, "some text");
});

test("normalizeSource preserves a provided sourceId", () => {
  const result = normalizeSource({ sourceId: "custom_id_123", title: "My Source" });
  assert.equal(result.sourceId, "custom_id_123");
});

test("detectSourceType returns course for TEEX/AWR sources", () => {
  assert.equal(detectSourceType({ title: "AWR397 Cybersecurity for Everyone" }), "course");
  assert.equal(detectSourceType({ title: "TEEX Active Attack Response" }), "course");
});

test("detectSourceType returns framework when explicitly set", () => {
  assert.equal(detectSourceType({ type: "framework" }), "framework");
});

test("extractFramework produces coreSteps from description sentences", () => {
  const source = normalizeSource({
    sourceId: "src_test_1",
    title: "Safety Manual",
    description: "Identify hazards. Assess risks. Mitigate threats. Document findings. Review outcomes."
  });
  const framework = extractFramework(source);
  assert.ok(framework.coreSteps.length >= 1);
  assert.equal(typeof framework.summary, "string");
  assert.equal(framework.sourceId, "src_test_1");
});

test("extractFramework uses default steps when description is empty", () => {
  const source = normalizeSource({ sourceId: "src_empty", title: "Empty Source" });
  const framework = extractFramework(source);
  assert.equal(framework.coreSteps.length, 5);
  assert.equal(framework.coreSteps[0].step, 1);
});

test("classifySafety approves a normal educational source", () => {
  const source = normalizeSource({
    sourceId: "src_safe_1",
    title: "Privacy Awareness Guide",
    description: "Learn about privacy habits, digital hygiene, and account safety."
  });
  const framework = extractFramework(source);
  const review = classifySafety(source, framework);
  assert.equal(review.passed, true);
  assert.equal(review.approvalStatus, "approved");
  assert.equal(review.sourceId, "src_safe_1");
});

test("classifySafety blocks content with offensive cyber patterns", () => {
  const source = normalizeSource({
    sourceId: "src_blocked_1",
    title: "Attack Guide",
    text: "This guide teaches offensive cyber hacking techniques to compromise network systems."
  });
  const framework = extractFramework(source);
  const review = classifySafety(source, framework);
  assert.equal(review.passed, false);
  assert.equal(review.approvalStatus, "blocked");
  assert.ok(review.blockedReasons.length >= 1);
});

test("classifySafety blocks weapon construction instructions", () => {
  const source = normalizeSource({
    sourceId: "src_blocked_2",
    title: "Construction",
    text: "Instructions to build a weapon from common materials."
  });
  const framework = extractFramework(source);
  const review = classifySafety(source, framework);
  assert.equal(review.passed, false);
  assert.equal(review.approvalStatus, "blocked");
});

test("generateSkill produces a schema-valid skill object", () => {
  const source = normalizeSource({ sourceId: "src_skill_1", title: "Readiness Course", claimStatus: "verified" });
  const framework = extractFramework(source);
  const skill = generateSkill(framework);
  assert.ok(skill.id.startsWith("skill_"));
  assert.equal(skill.version, "1.0.0");
  assert.equal(skill.sourceId, "src_skill_1");
  assert.equal(skill.claimStatus, "verified");
  assert.ok(Array.isArray(skill.safetyScope));
  assert.ok(Array.isArray(skill.coreSteps));
  assert.ok(typeof skill.activationTrigger === "string");
  assert.ok(skill.createdAt.length > 0);
});

test("generateMissionTemplates produces exactly three missions", () => {
  const source = normalizeSource({ sourceId: "src_m1", title: "Privacy Skill" });
  const framework = extractFramework(source);
  const skill = generateSkill(framework);
  const missions = generateMissionTemplates(skill);
  assert.equal(missions.length, 3);
  assert.ok(missions.every((m) => m.sourceId === "src_m1"));
  assert.ok(missions.every((m) => typeof m.objective === "string"));
});

test("generateCompanionBehavior produces a valid companion profile", () => {
  const source = normalizeSource({ sourceId: "src_c1", title: "Digital Hygiene" });
  const framework = extractFramework(source);
  const skill = generateSkill(framework);
  const companion = generateCompanionBehavior(skill);
  assert.equal(companion.sourceId, "src_c1");
  assert.ok(companion.canDo.length > 0);
  assert.ok(companion.cannotDo.length > 0);
  assert.ok(typeof companion.openingLine === "string");
  assert.ok(companion.openingLine.includes(skill.name));
});

test("generateProductTemplates produces three tiered products", () => {
  const source = normalizeSource({ sourceId: "src_p1", title: "Leadership Guide" });
  const framework = extractFramework(source);
  const skill = generateSkill(framework);
  const products = generateProductTemplates(skill);
  assert.equal(products.length, 3);
  assert.equal(products[0].priceSuggestion, 0);
  assert.equal(products[1].priceSuggestion, 9);
  assert.equal(products[2].priceSuggestion, 47);
  assert.ok(products.every((p) => p.sourceId === "src_p1"));
});

test("telemetry emits and lists events with sourceId", () => {
  resetTelemetry();
  const event = emitTelemetry("skill_forged", "src_tel_1", { skillId: "skill_001" });
  assert.ok(event.id.startsWith("evt_"));
  assert.equal(event.type, "skill_forged");
  assert.equal(event.sourceId, "src_tel_1");
  assert.equal(event.payload.skillId, "skill_001");
  const events = listTelemetryEvents();
  assert.equal(events.length, 1);
  resetTelemetry();
});

test("forgeSkillFromSource runs the full pipeline and returns schema-valid output", () => {
  const source = {
    sourceId: "src_guardian_readiness_v1",
    title: "Guardian Readiness Framework",
    sourceType: "framework",
    claimStatus: "proprietary",
    description: "A structured readiness review that converts observations into a scorecard, recommendations, and a 30-day improvement map."
  };
  const result = forgeSkillFromSource(source);
  assert.equal(result.forge, "Hydra Skill Forge");
  assert.ok(result.normalized.sourceId);
  assert.ok(result.framework.coreSteps.length > 0);
  assert.equal(result.safetyReview.passed, true);
  assert.ok(result.skill.id.startsWith("skill_"));
  assert.equal(result.missions.length, 3);
  assert.ok(result.companionBehavior.canDo.length > 0);
  assert.equal(result.productTemplates.length, 3);
  assert.ok(result.telemetryEvent.id.startsWith("evt_"));
  assert.ok(Array.isArray(result.safetyScope));
});

test("forgeSkillFromSource distinguishes claimStatus correctly", () => {
  const verifiedResult = forgeSkillFromSource({
    sourceId: "src_verified_1",
    title: "Verified Course",
    claimStatus: "verified",
    description: "A verified course on awareness."
  });
  assert.equal(verifiedResult.skill.claimStatus, "verified");

  const proprietaryResult = forgeSkillFromSource({
    sourceId: "src_prop_1",
    title: "Proprietary Framework",
    claimStatus: "proprietary",
    description: "A proprietary Hydra framework."
  });
  assert.equal(proprietaryResult.skill.claimStatus, "proprietary");
});
