import { normalizeText } from "./normalize-source.js";

const DEFAULT_RULES = [
  "Keep all outputs educational, lawful, defensive, and public-safe.",
  "Convert source material into principles, checklists, missions, and product templates.",
  "Ask for missing context instead of inventing details.",
  "Prefer awareness, assessment, improvement, documentation, and review loops.",
  "Escalate anything outside the safe training scope to human review."
];

const DEFAULT_MISTAKES = [
  "Treating general education as professional service advice.",
  "Skipping documentation and review.",
  "Using source material outside its lawful and educational scope.",
  "Turning awareness material into unsafe operational instructions."
];

const DEFAULT_SUCCESS_CRITERIA = [
  "User understands the concept.",
  "User can complete a safe checklist or mission.",
  "User can explain the next lawful improvement step.",
  "Progress can be logged and reviewed."
];

const KEYWORDS = [
  "privacy", "cybersecurity", "incident", "risk", "recovery", "ethics",
  "network", "workplace", "awareness", "training", "documentation",
  "assessment", "MFA", "password", "backup", "continuity", "digital hygiene",
  "readiness", "leadership", "discipline", "safety", "communication"
];

function sentenceSplit(text = "") {
  return normalizeText(text)
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractKeyPhrases(text = "") {
  const lower = text.toLowerCase();
  return KEYWORDS.filter((keyword) => lower.includes(keyword.toLowerCase()));
}

export function extractFramework(normalizedSource = {}) {
  const text = normalizeText(normalizedSource.text || normalizedSource.description || "");
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
    sourceId: normalizedSource.sourceId,
    sourceTitle: normalizedSource.title || "Untitled Source",
    sourceType: normalizedSource.sourceType || "text_source",
    summary: sentences.slice(0, 2).join(" ") || "Reusable knowledge source prepared for Hydra Skill Forge.",
    keyPhrases: phrases,
    coreSteps,
    rules: normalizedSource.rules || DEFAULT_RULES,
    mistakesToAvoid: normalizedSource.mistakesToAvoid || DEFAULT_MISTAKES,
    successCriteria: normalizedSource.successCriteria || DEFAULT_SUCCESS_CRITERIA,
    claimStatus: normalizedSource.claimStatus || "inferred",
    permittedUse: normalizedSource.permittedUse || []
  };
}
