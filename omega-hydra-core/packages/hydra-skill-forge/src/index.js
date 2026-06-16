const SAFE_SCOPE = [
  "lawful defensive education",
  "privacy awareness",
  "digital hygiene",
  "readiness training",
  "business automation",
  "community service",
  "learning support",
  "product packaging"
];

const defaultRules = [
  "Keep all outputs educational, lawful, defensive, and public-safe.",
  "Convert source material into principles, checklists, missions, and product templates.",
  "Ask for missing context instead of inventing details.",
  "Prefer awareness, assessment, improvement, documentation, and review loops.",
  "Escalate anything outside the safe training scope to human review."
];

function normalizeText(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function sentenceSplit(text = "") {
  return normalizeText(text)
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function titleCase(value = "") {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function detectSourceType(source = {}) {
  if (source.type) return source.type;
  const title = `${source.title || ""} ${source.filename || ""}`.toLowerCase();
  if (title.includes("pdf")) return "pdf";
  if (title.includes("course") || title.includes("awr")) return "course";
  if (title.includes("manual")) return "manual";
  if (title.includes("framework")) return "framework";
  return "text_source";
}

function extractKeyPhrases(text = "") {
  const keywords = [
    "privacy",
    "cybersecurity",
    "incident",
    "risk",
    "recovery",
    "ethics",
    "network",
    "workplace",
    "awareness",
    "training",
    "documentation",
    "assessment",
    "MFA",
    "password",
    "backup",
    "continuity",
    "digital hygiene"
  ];

  const lower = text.toLowerCase();
  return keywords.filter((keyword) => lower.includes(keyword.toLowerCase()));
}

export function extractFramework(source = {}) {
  const text = normalizeText(source.text || source.description || "");
  const sentences = sentenceSplit(text);
  const phrases = extractKeyPhrases(text);

  const coreSteps = sentences.slice(0, 5).map((sentence, index) => ({
    step: index + 1,
    action: sentence
  }));

  if (coreSteps.length === 0) {
    coreSteps.push(
      { step: 1, action: "Identify the topic and intended user." },
      { step: 2, action: "Extract the repeatable process." },
      { step: 3, action: "Convert the process into a safe checklist." },
      { step: 4, action: "Create a practice mission." },
      { step: 5, action: "Review results and improve." }
    );
  }

  return {
    sourceTitle: source.title || "Untitled Source",
    sourceType: detectSourceType(source),
    summary: sentences.slice(0, 2).join(" ") || "Reusable knowledge source prepared for Hydra Skill Forge.",
    keyPhrases: phrases,
    coreSteps,
    rules: source.rules || defaultRules,
    mistakesToAvoid: source.mistakesToAvoid || [
      "Treating general education as professional service advice.",
      "Skipping documentation and review.",
      "Using source material outside its lawful and educational scope.",
      "Turning awareness material into unsafe operational instructions."
    ],
    successCriteria: source.successCriteria || [
      "User understands the concept.",
      "User can complete a safe checklist or mission.",
      "User can explain the next lawful improvement step.",
      "Progress can be logged and reviewed."
    ]
  };
}

export function generateSkill(framework) {
  const baseName = framework.sourceTitle.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "Hydra Knowledge";
  const skillName = `${titleCase(baseName)} Skill`;

  return {
    id: `skill_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    name: skillName,
    sourceTitle: framework.sourceTitle,
    sourceType: framework.sourceType,
    activationTrigger: `Activate when the operator asks for help applying ${framework.sourceTitle} as a safe Hydra mission, checklist, companion behavior, or product template.`,
    summary: framework.summary,
    keyPhrases: framework.keyPhrases,
    coreSteps: framework.coreSteps,
    rules: framework.rules,
    mistakesToAvoid: framework.mistakesToAvoid,
    successCriteria: framework.successCriteria,
    safetyScope: SAFE_SCOPE
  };
}

export function generateMissionTemplates(skill) {
  return [
    {
      title: `${skill.name} — Awareness Mission`,
      objective: "Review the source concept and identify one personal or organizational improvement area.",
      output: "One short reflection and one safe improvement action."
    },
    {
      title: `${skill.name} — Checklist Mission`,
      objective: "Convert the core steps into a checklist and complete the first item.",
      output: "Checklist draft with completion status."
    },
    {
      title: `${skill.name} — Documentation Mission`,
      objective: "Record what was learned, what changed, and what needs follow-up.",
      output: "AAR note with next recommended action."
    }
  ];
}

export function generateCompanionBehavior(skill) {
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
    openingLine: `I can help you apply ${skill.name} as a safe mission, checklist, or product template.`
  };
}

export function generateProductTemplates(skill) {
  const cleanName = skill.name.replace(/ Skill$/, "");
  return [
    {
      productName: `${cleanName} Quick Check`,
      productType: "free checklist",
      priceSuggestion: 0,
      deliverable: "PDF or web checklist",
      useCase: "Lead magnet and onboarding"
    },
    {
      productName: `${cleanName} Mini Pack`,
      productType: "digital toolkit",
      priceSuggestion: 9,
      deliverable: "Checklist, worksheet, and 7-day improvement plan",
      useCase: "Entry product"
    },
    {
      productName: `${cleanName} Readiness Report`,
      productType: "assessment report",
      priceSuggestion: 47,
      deliverable: "Scorecard, recommendations, and follow-up plan",
      useCase: "Audit or service upsell"
    }
  ];
}

export function forgeSkillFromSource(source = {}) {
  const framework = extractFramework(source);
  const skill = generateSkill(framework);

  return {
    forge: "Hydra Skill Forge",
    framework,
    skill,
    missions: generateMissionTemplates(skill),
    companionBehavior: generateCompanionBehavior(skill),
    productTemplates: generateProductTemplates(skill),
    safetyScope: SAFE_SCOPE
  };
}

export { SAFE_SCOPE };
