import { generateIdentity } from "../../hydra-identity/src/index.js";
import { generateCompanion } from "../../hydra-companion/src/index.js";
import { generateMission } from "./index.js";

const identity = generateIdentity({ name: "Demo Operator" });
const companion = generateCompanion(identity);
const mission = generateMission(identity, companion);

console.log(JSON.stringify({ identity, companion, mission }, null, 2));
