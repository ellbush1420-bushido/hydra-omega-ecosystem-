import {
  buildRunPlan,
  assessUntrustedInput,
  trimToolOutput,
  evaluateRun
} from "./index.js";

function runControlPlaneDemo() {
  const plan = buildRunPlan({
    task: {
      title: "Create a Guardian Readiness audit offer",
      workType: "skill_forge",
      complexity: 2,
      risk: "low",
      repeatable: true,
      deterministic: true,
      requestedActions: []
    },
    budgetUsd: 0
  });

  const inputAssessment = assessUntrustedInput({
    origin: "user_provided",
    trusted: true,
    description: "Guardian Readiness Framework — proprietary educational tool for lawful defensive readiness."
  });

  const trimResult = trimToolOutput("x".repeat(8000), { maxChars: 1000 });

  const runEval = evaluateRun({
    baselineMinutes: 90,
    actualMinutes: 20,
    reworkMinutes: 5,
    costUsd: 0,
    accepted: true,
    verified: true
  });

  const output = {
    demo: "Hydra Agent Control Plane",
    runPlan: plan,
    inputAssessment,
    outputTrimDemo: {
      originalChars: trimResult.originalChars,
      deliveredChars: trimResult.deliveredChars,
      truncated: trimResult.truncated
    },
    runEvaluation: runEval
  };

  console.log(JSON.stringify(output, null, 2));
}

runControlPlaneDemo();
