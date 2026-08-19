import assert from "node:assert/strict";
import { retrievePublicSource } from "../src/index.js";

const direct = await retrievePublicSource({
  platform: "x",
  url: "https://x.com/example/status/1",
  suppliedSnapshot: "AI agent workflow automation and software security discussion."
});
assert.equal(direct.status, "complete");
assert.equal(direct.route.adapter, "user-supplied-snapshot");

const blocked = await retrievePublicSource({ platform: "instagram", url: "https://instagram.com/p/example" }, {});
assert.equal(blocked.status, "blocked");
assert.equal(blocked.policy.noLoginBypass, true);

console.log("Hydra Source Intel smoke test passed");
