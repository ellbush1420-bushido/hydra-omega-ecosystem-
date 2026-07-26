function titleCase(value = "") {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

export function generateSkill(framework = {}) {
  const baseName = (framework.sourceTitle || "Hydra Knowledge").replace(/[^a-zA-Z0-9 ]/g, "").trim();
  const skillName = `${titleCase(baseName)} Skill`;

  return {
    id: `skill_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    name: skillName,
    version: "1.0.0",
    sourceId: framework.sourceId,
    sourceTitle: framework.sourceTitle,
    sourceType: framework.sourceType,
    claimStatus: framework.claimStatus || "inferred",
    activationTrigger: `Activate when the operator asks for help applying ${framework.sourceTitle} as a safe Hydra mission, checklist, companion behavior, or product template.`,
    summary: framework.summary,
    keyPhrases: framework.keyPhrases || [],
    coreSteps: framework.coreSteps || [],
    rules: framework.rules || [],
    mistakesToAvoid: framework.mistakesToAvoid || [],
    successCriteria: framework.successCriteria || [],
    safetyScope: framework.permittedUse || [],
    permittedUse: framework.permittedUse || [],
    disclaimer: "Educational use only. Not professional, medical, or legal advice.",
    createdAt: new Date().toISOString()
  };
}
