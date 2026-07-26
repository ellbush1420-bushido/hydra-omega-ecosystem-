export { SAFE_SCOPE, normalizeText, normalizeSource, detectSourceType } from "./normalize-source.js";
export { extractFramework } from "./extract-framework.js";
export { classifySafety } from "./classify-safety.js";
export { generateSkill } from "./generate-skill.js";
export { generateMissionTemplates } from "./generate-missions.js";
export { generateCompanionBehavior } from "./generate-companion.js";
export { generateProductTemplates } from "./generate-products.js";
export { emitTelemetry, listTelemetryEvents, getTelemetrySummary, resetTelemetry } from "./telemetry.js";

import { SAFE_SCOPE, normalizeSource } from "./normalize-source.js";
import { extractFramework } from "./extract-framework.js";
import { classifySafety } from "./classify-safety.js";
import { generateSkill } from "./generate-skill.js";
import { generateMissionTemplates } from "./generate-missions.js";
import { generateCompanionBehavior } from "./generate-companion.js";
import { generateProductTemplates } from "./generate-products.js";
import { emitTelemetry } from "./telemetry.js";

export function forgeSkillFromSource(source = {}) {
  const normalized = normalizeSource(source);
  const framework = extractFramework(normalized);
  const safetyReview = classifySafety(normalized, framework);
  const skill = generateSkill(framework);
  const missions = generateMissionTemplates(skill);
  const companionBehavior = generateCompanionBehavior(skill);
  const productTemplates = generateProductTemplates(skill);

  const telemetryEvent = emitTelemetry("skill_forged", normalized.sourceId, {
    skillId: skill.id,
    skillName: skill.name,
    sourceTitle: skill.sourceTitle,
    sourceType: skill.sourceType,
    claimStatus: skill.claimStatus,
    safetyApproval: safetyReview.approvalStatus,
    missionCount: missions.length,
    productCount: productTemplates.length
  });

  return {
    forge: "Hydra Skill Forge",
    normalized,
    framework,
    safetyReview,
    skill,
    missions,
    companionBehavior,
    productTemplates,
    telemetryEvent,
    safetyScope: SAFE_SCOPE
  };
}
