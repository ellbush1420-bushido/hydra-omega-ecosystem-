import { generateIdentity } from "./index.js";

const identity = generateIdentity({ name: "Demo Operator" });
console.log(JSON.stringify(identity, null, 2));
