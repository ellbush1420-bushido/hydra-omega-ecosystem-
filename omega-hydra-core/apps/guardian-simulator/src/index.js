import { generateIdentity } from "../../../packages/hydra-identity/src/index.js";
import { generateCompanion } from "../../../packages/hydra-companion/src/index.js";
import { generateMission } from "../../../packages/hydra-labyrinth/src/index.js";
import { logEvent, listEvents, getEventSummary } from "../../../packages/hydra-eyes/src/index.js";

function runGuardianSimulatorDemo() {
  const identity = generateIdentity({ name: "Demo Operator" });
  logEvent("identity_generated", identity);

  const companion = generateCompanion(identity);
  logEvent("companion_generated", companion);

  const mission = generateMission(identity, companion);
  logEvent("mission_generated", mission);

  return {
    app: "Guardian Simulator MVP-01",
    identity,
    companion,
    mission,
    eventSummary: getEventSummary(),
    events: listEvents()
  };
}

console.log(JSON.stringify(runGuardianSimulatorDemo(), null, 2));
