import assert from "node:assert/strict";
import { createCheckpoint, buildResumePlan } from "../src/index.js";

const checkpoint = createCheckpoint({
  workflowId: "demo",
  stage: "build",
  completedSteps: ["plan"],
  pendingSteps: ["build", "test"]
});
const waiting = buildResumePlan(checkpoint, {});
assert.equal(waiting.decision.resume, false);
const ready = buildResumePlan(checkpoint, { limitReset: true });
assert.equal(ready.decision.resume, true);
assert.equal(ready.nextStep, "build");

console.log("Hydra Continuity smoke test passed");
