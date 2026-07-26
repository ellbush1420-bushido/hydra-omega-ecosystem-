export function generateProductTemplates(skill = {}) {
  const cleanName = (skill.name || "Hydra Skill").replace(/ Skill$/, "");
  const sourceId = skill.sourceId || skill.id || "unknown";
  const claimStatus = skill.claimStatus || "inferred";
  const permittedUse = skill.permittedUse || [];
  const disclaimer = "Educational use only. Not professional, medical, or legal advice.";

  return [
    {
      productName: `${cleanName} Quick Check`,
      productType: "free checklist",
      priceSuggestion: 0,
      deliverable: "PDF or web checklist",
      useCase: "Lead magnet and onboarding",
      sourceId,
      claimStatus,
      permittedUse,
      disclaimer
    },
    {
      productName: `${cleanName} Mini Pack`,
      productType: "digital toolkit",
      priceSuggestion: 9,
      deliverable: "Checklist, worksheet, and 7-day improvement plan",
      useCase: "Entry product",
      sourceId,
      claimStatus,
      permittedUse,
      disclaimer
    },
    {
      productName: `${cleanName} Readiness Report`,
      productType: "assessment report",
      priceSuggestion: 47,
      deliverable: "Scorecard, recommendations, and follow-up plan",
      useCase: "Audit or service upsell",
      sourceId,
      claimStatus,
      permittedUse,
      disclaimer
    }
  ];
}
