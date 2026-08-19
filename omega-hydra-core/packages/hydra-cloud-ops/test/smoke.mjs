import assert from "node:assert/strict";
import { runCloudTask } from "../src/index.js";

const inspect = await runCloudTask({ action: "list-hypertables", database: "demo", dryRun: true });
assert.equal(inspect.status, "planned");
assert.match(inspect.sql, /timescaledb_information\.hypertables/);

const blocked = await runCloudTask({ action: "create-hypertable", table: "events", timeColumn: "created_at", dryRun: false, approved: false });
assert.equal(blocked.status, "blocked");

console.log("Hydra Cloud Ops smoke test passed");
