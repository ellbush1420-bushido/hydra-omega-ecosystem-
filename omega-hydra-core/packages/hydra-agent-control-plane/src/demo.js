import {
  assessUntrustedInput,
  buildRunPlan,
  evaluateRun,
  trimToolOutput
} from "./index.js";

const task = {
  title: "Turn a Guardian readiness manual into a validated Hydra Skill and draft product specification",
  workType: "skill_forge",
  complexity: 3,
  risk: "low",
  dataSensitivity: "internal",
  repeatable: true,
  deterministic: false,
  requestedActions: ["draft_backlog", "external_publish"]
};

const noisyToolOutput = Array.from(
  { length: 180 },
  (_, index) => `log-${index + 1}: scanned repository path and found no blocking error`
).join("\n");

const result = {
  app: "Omega Hydra Agent Control Plane MVP",
  runPlan: buildRunPlan({ task, budgetUsd: 2.5 }),
  inputAssessment: assessUntrustedInput({
    origin: "upload",
    trusted: false,
    text: "Guardian readiness training notes for lawful defensive education and privacy awareness."
  }),
  trimmedToolOutput: trimToolOutput(noisyToolOutput, { maxChars: 1200 }),
  valueReview: evaluateRun({
    baselineMinutes: 120,
    actualMinutes: 34,
    reworkMinutes: 8,
    costUsd: 1.24,
    accepted: true,
    verified: true
  })
};

console.log(JSON.stringify(result, null, 2));
