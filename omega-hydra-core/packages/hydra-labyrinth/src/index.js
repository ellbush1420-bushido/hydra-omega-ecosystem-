const gates = [
  { id: 1, name: "Drift", theme: "Awareness" },
  { id: 2, name: "Edge", theme: "Clarity" },
  { id: 3, name: "Hook", theme: "Adaptation" },
  { id: 4, name: "Fang", theme: "Precision" },
  { id: 5, name: "Shadow", theme: "Protection" },
  { id: 6, name: "Spiral", theme: "Stability" },
  { id: 7, name: "Break", theme: "Resolution" },
  { id: 8, name: "Release", theme: "Mercy" },
  { id: 9, name: "Vanish", theme: "Reflection" }
];

const triAxis = {
  mind: ["attention", "emotion", "judgment", "memory", "bias", "patience", "confidence", "discipline", "reflection"],
  body: ["stance", "distance", "breath", "balance", "posture", "timing", "movement", "fatigue", "recovery"],
  environment: ["space", "lighting", "noise", "crowd", "objects", "weather", "visibility", "time pressure", "digital context"]
};

const scenarioTypes = [
  "Observation Drill",
  "Communication Drill",
  "Privacy Drill",
  "Ethical Decision Drill",
  "Community Service Drill",
  "Leadership Drill",
  "Digital Hygiene Drill",
  "Companion Guidance Drill",
  "After Action Review Drill"
];

const settings = [
  "Home",
  "Workplace",
  "Small Business",
  "Public Event",
  "Online Platform",
  "Training Academy",
  "Community Center",
  "Emergency Prep Site",
  "Hydra City District"
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateMission(identity = {}, companion = {}) {
  const gate = pick(gates);
  const axis = {
    mind: pick(triAxis.mind),
    body: pick(triAxis.body),
    environment: pick(triAxis.environment)
  };
  const scenarioType = pick(scenarioTypes);
  const setting = pick(settings);

  return {
    title: `${gate.name} Gate — ${gate.theme} Mission`,
    gate,
    triAxis: axis,
    scenarioType,
    setting,
    objective: `Practice ${gate.theme.toLowerCase()} through ${scenarioType.toLowerCase()} in a ${setting.toLowerCase()} context.`,
    complication: "You have limited time, incomplete information, and must remain calm, lawful, clear, and respectful.",
    resolutionPath: [
      "Pause and observe.",
      "Clarify the situation.",
      "Choose the safest lawful option.",
      "Document what happened.",
      "Review what can improve next time."
    ],
    reflectionPrompt: `How did your ${identity.archetype || "Guardian"} response improve ${gate.theme.toLowerCase()} today?`,
    scoreMetrics: ["clarity", "composure", "documentation", "service", "follow-through"],
    nextRecommendation: companion?.archetype ? `Ask your ${companion.archetype} companion for a reflection.` : "Complete a short reflection journal entry.",
    safetyScope: "public-safe readiness training only"
  };
}

export { gates, triAxis, scenarioTypes, settings };
