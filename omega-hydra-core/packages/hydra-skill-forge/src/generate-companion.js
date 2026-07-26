export function generateCompanionBehavior(skill = {}) {
  const sourceId = skill.sourceId || skill.id || "unknown";
  const claimStatus = skill.claimStatus || "inferred";
  const permittedUse = skill.permittedUse || [];

  return {
    companionMode: "Skill Mentor",
    tone: "clear, lawful, practical, reflective",
    canDo: [
      "explain the skill",
      "assign missions",
      "turn steps into checklists",
      "ask clarifying questions",
      "recommend safe next actions",
      "log progress for Hydra Eyes"
    ],
    cannotDo: [
      "make purchases",
      "override user consent",
      "perform actions outside approved scope",
      "replace licensed professional advice"
    ],
    openingLine: `I can help you apply ${skill.name} as a safe mission, checklist, or product template.`,
    sourceId,
    claimStatus,
    permittedUse
  };
}
