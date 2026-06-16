import { forgeSkillFromSource } from "../../../packages/hydra-skill-forge/src/index.js";
import { logEvent, listEvents, getEventSummary } from "../../../packages/hydra-eyes/src/index.js";

function runSkillForgeDemo() {
  const sources = [
    {
      title: "AWR397 Cybersecurity for Everyone",
      type: "course",
      description: "General cybersecurity risk awareness and best practices for protecting personal devices, accounts, and data through safe habits and practical readiness."
    },
    {
      title: "Hydra Privacy Shield Mini Pack",
      type: "product_manual",
      description: "A privacy awareness toolkit with account safety, device hygiene, MFA readiness, digital footprint review, and a 7-day cleanup plan."
    },
    {
      title: "Guardian Readiness Report Framework",
      type: "framework",
      description: "A structured readiness review that converts observations into a scorecard, recommendations, follow-up actions, and a 30-day improvement map."
    }
  ];

  const forged = sources.map((source) => {
    const result = forgeSkillFromSource(source);
    logEvent("skill_forged", {
      skillId: result.skill.id,
      skillName: result.skill.name,
      sourceTitle: result.skill.sourceTitle,
      sourceType: result.skill.sourceType,
      productTemplates: result.productTemplates.length,
      missions: result.missions.length
    });
    return result;
  });

  return {
    app: "Hydra Skill Forge MVP",
    purpose: "Transform source knowledge into reusable skills, missions, companion behaviors, and product templates.",
    forged,
    eventSummary: getEventSummary(),
    events: listEvents(),
    safetyScope: "lawful defensive education, privacy awareness, digital hygiene, business automation, community service, and readiness training only"
  };
}

console.log(JSON.stringify(runSkillForgeDemo(), null, 2));
