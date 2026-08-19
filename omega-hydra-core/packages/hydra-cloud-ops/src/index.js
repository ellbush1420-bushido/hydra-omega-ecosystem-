const SAFE_ACTIONS = new Set([
  "list-services",
  "inspect-database",
  "list-hypertables",
  "list-continuous-aggregates",
  "plan-hypertable",
  "plan-continuous-aggregate",
  "health-check"
]);

const WRITE_ACTIONS = new Set([
  "create-hypertable",
  "create-continuous-aggregate",
  "alter-retention-policy"
]);

export function normalizeCloudTask(input = {}) {
  const action = input.action || "health-check";
  return {
    id: input.id || `cloud_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    provider: input.provider || "timescale-compatible",
    action,
    database: input.database || null,
    table: input.table || null,
    timeColumn: input.timeColumn || "time",
    bucket: input.bucket || "1 hour",
    query: input.query || null,
    dryRun: input.dryRun !== false,
    approved: input.approved === true,
    requestedAt: new Date().toISOString()
  };
}

export function evaluateCloudPolicy(task = {}) {
  if (!SAFE_ACTIONS.has(task.action) && !WRITE_ACTIONS.has(task.action)) {
    return { allowed: false, reason: "Unsupported or destructive cloud action requires manual review." };
  }
  if (WRITE_ACTIONS.has(task.action) && !task.approved) {
    return { allowed: false, reason: "Cloud write requires explicit approval." };
  }
  if (task.action === "create-hypertable" && (!task.table || !task.timeColumn)) {
    return { allowed: false, reason: "Hypertable creation requires table and time column." };
  }
  return { allowed: true, reason: task.dryRun ? "Approved for planning/dry-run." : "Approved for authorized execution." };
}

export function buildSqlPlan(task = {}) {
  switch (task.action) {
    case "list-hypertables":
      return "SELECT * FROM timescaledb_information.hypertables ORDER BY hypertable_schema, hypertable_name;";
    case "list-continuous-aggregates":
      return "SELECT * FROM timescaledb_information.continuous_aggregates ORDER BY view_schema, view_name;";
    case "create-hypertable":
      return `SELECT create_hypertable('${task.table}', by_range('${task.timeColumn}'), if_not_exists => TRUE);`;
    case "create-continuous-aggregate":
      if (!task.query) throw new Error("Continuous aggregate requires a SELECT query.");
      return task.query;
    case "health-check":
      return "SELECT now() AS checked_at, current_database() AS database, version() AS version;";
    default:
      return null;
  }
}

export async function runCloudTask(input = {}, adapter = null) {
  const task = normalizeCloudTask(input);
  const policy = evaluateCloudPolicy(task);
  if (!policy.allowed) return { status: "blocked", task, policy };

  const sql = buildSqlPlan(task);
  if (task.dryRun || typeof adapter !== "function") {
    return {
      status: task.dryRun ? "planned" : "adapter-required",
      task,
      policy,
      sql,
      note: "Hydra Cloud Ops never invents credentials and executes only against explicitly authorized infrastructure."
    };
  }

  const result = await adapter({ task, sql });
  return { status: "complete", task, policy, sql, result };
}

export const HYDRA_CLOUD_OPS_CAPABILITIES = {
  observability: [...SAFE_ACTIONS],
  writes: [...WRITE_ACTIONS],
  defaultMode: "dry-run",
  authorizationRequired: true
};
