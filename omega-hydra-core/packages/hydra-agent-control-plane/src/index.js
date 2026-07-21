const SAFE_SCOPE = [
  "lawful defensive education",
  "privacy awareness",
  "digital hygiene",
  "readiness training",
  "business automation",
  "community service",
  "learning support",
  "product packaging"
];

export const AGENT_REGISTRY = Object.freeze({
  "hydra-chief-of-staff": {
    id: "hydra-chief-of-staff",
    role: "executive-planner",
    mission: "Translate an approved objective into a scoped mission plan, assign specialist work, and define completion evidence.",
    permissions: ["read_doctrine", "read_repository", "draft_mission", "assign_specialist", "request_approval"],
    denied: ["production_deploy", "secret_rotation", "destructive_write"],
    outputs: ["mission_brief", "work_breakdown", "acceptance_criteria", "approval_requests"]
  },
  "hydra-product-architect": {
    id: "hydra-product-architect",
    role: "product-architect",
    mission: "Convert validated knowledge and customer needs into product specifications, user stories, offers, and measurable launch criteria.",
    permissions: ["read_doctrine", "read_repository", "draft_spec", "draft_offer", "draft_backlog"],
    denied: ["production_deploy", "publish_without_review", "change_billing"],
    outputs: ["product_spec", "user_stories", "offer_ladder", "acceptance_criteria"]
  },
  "sentinel-qa": {
    id: "sentinel-qa",
    role: "verifier",
    mission: "Verify safety, correctness, scope, evidence, tests, permissions, and business value before work is accepted or deployed.",
    permissions: ["read_doctrine", "read_repository", "run_tests", "inspect_diff", "block_release", "request_human_review"],
    denied: ["silently_modify_scope", "approve_own_unverified_work", "expose_secrets"],
    outputs: ["verification_report", "test_evidence", "risk_findings", "release_decision"]
  }
});

export const DEFAULT_ROUTING_POLICY = Object.freeze({
  outputLimitChars: 6000,
  defaultBudgetUsd: 1.5,
  routes: {
    economy: { description: "Deterministic, repetitive, low-risk work with clear instructions.", fallback: "balanced" },
    balanced: { description: "Normal implementation, synthesis, and product work.", fallback: "frontier" },
    frontier: { description: "Ambiguous, high-complexity, architecture, or high-consequence reasoning.", fallback: null },
    self_hosted_defensive: { description: "Approved defensive incident analysis involving sensitive attacker data that must remain inside a controlled environment.", fallback: null }
  },
  approvalRequiredFor: [
    "production_deploy",
    "external_publish",
    "destructive_write",
    "credential_change",
    "billing_change",
    "sensitive_data_export"
  ]
});

function normalizeText(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function toFiniteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function classifyTask(task = {}) {
  const title = normalizeText(task.title || task.prompt || "Untitled task");
  const complexity = Math.max(1, Math.min(5, toFiniteNumber(task.complexity, 2)));
  const risk = String(task.risk || "low").toLowerCase();
  const dataSensitivity = String(task.dataSensitivity || "public").toLowerCase();
  const purpose = String(task.purpose || "general").toLowerCase();
  const repeatable = Boolean(task.repeatable);
  const deterministic = Boolean(task.deterministic);

  if (purpose === "defensive_incident_response" && ["restricted", "confidential", "secret"].includes(dataSensitivity)) {
    return {
      tier: "self_hosted_defensive",
      reason: "Sensitive defensive incident material should remain inside a vetted controlled environment.",
      title,
      complexity,
      risk,
      dataSensitivity
    };
  }

  if (complexity >= 4 || ["high", "critical"].includes(risk)) {
    return {
      tier: "frontier",
      reason: "The task is complex or high consequence and needs the strongest available reasoning tier.",
      title,
      complexity,
      risk,
      dataSensitivity
    };
  }

  if (complexity <= 2 && repeatable && deterministic && risk === "low") {
    return {
      tier: "economy",
      reason: "The task is routine, repeatable, deterministic, and low risk.",
      title,
      complexity,
      risk,
      dataSensitivity
    };
  }

  return {
    tier: "balanced",
    reason: "The task needs normal implementation or synthesis without frontier-level complexity.",
    title,
    complexity,
    risk,
    dataSensitivity
  };
}

export function trimToolOutput(value, options = {}) {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  const maxChars = Math.max(500, toFiniteNumber(options.maxChars, DEFAULT_ROUTING_POLICY.outputLimitChars));

  if (text.length <= maxChars) {
    return { text, originalChars: text.length, deliveredChars: text.length, truncated: false };
  }

  const marker = `\n\n[HYDRA OUTPUT TRIMMED: ${text.length - maxChars} characters omitted]\n\n`;
  const remaining = Math.max(200, maxChars - marker.length);
  const headSize = Math.ceil(remaining * 0.7);
  const tailSize = remaining - headSize;
  const trimmed = `${text.slice(0, headSize)}${marker}${text.slice(-tailSize)}`;

  return { text: trimmed, originalChars: text.length, deliveredChars: trimmed.length, truncated: true };
}

export function assessUntrustedInput(source = {}) {
  const text = normalizeText(source.text || source.content || source.description || "");
  const origin = String(source.origin || "unknown").toLowerCase();
  const trusted = Boolean(source.trusted);
  const indicators = [];
  const patterns = [
    [/(ignore|override) (all )?(previous|system) instructions/i, "instruction_override"],
    [/(reveal|print|export).{0,30}(secret|token|credential|api key)/i, "credential_exfiltration_request"],
    [/(execute|run).{0,30}(embedded|remote|downloaded) code/i, "embedded_code_execution"],
    [/<script|javascript:|data:text\/html/i, "active_content"],
    [/(disable|bypass).{0,20}(safety|approval|review|guardrail)/i, "guardrail_bypass"]
  ];

  for (const [pattern, label] of patterns) {
    if (pattern.test(text)) indicators.push(label);
  }

  const untrustedOrigin = ["upload", "email", "web", "dataset", "mcp", "external_tool", "unknown"].includes(origin);
  const quarantine = indicators.length > 0 || (!trusted && untrustedOrigin && text.length > 100000);

  return {
    trusted,
    origin,
    indicators,
    quarantine,
    decision: quarantine ? "quarantine_and_review" : "allow_with_normal_controls"
  };
}

export function requiresHumanApproval(action, policy = DEFAULT_ROUTING_POLICY) {
  return policy.approvalRequiredFor.includes(String(action || ""));
}

export function selectAgents(task = {}) {
  const workType = String(task.workType || "mission").toLowerCase();
  const agents = [AGENT_REGISTRY["hydra-chief-of-staff"]];
  if (["product", "course", "offer", "skill_forge"].includes(workType)) {
    agents.push(AGENT_REGISTRY["hydra-product-architect"]);
  }
  agents.push(AGENT_REGISTRY["sentinel-qa"]);
  return agents;
}

export function buildRunPlan(input = {}) {
  const task = input.task || {};
  const classification = classifyTask(task);
  const agents = selectAgents(task);
  const budgetUsd = Math.max(0, toFiniteNumber(input.budgetUsd, DEFAULT_ROUTING_POLICY.defaultBudgetUsd));
  const requestedActions = Array.isArray(task.requestedActions) ? task.requestedActions : [];
  const approvalGates = requestedActions.filter((action) => requiresHumanApproval(action));

  return {
    mission: classification.title,
    modelTier: classification.tier,
    routingReason: classification.reason,
    budgetUsd,
    safeScope: SAFE_SCOPE,
    triCell: {
      primary: agents[0].id,
      execution: agents.length === 3 ? agents[1].id : "assigned-specialist",
      verification: "sentinel-qa"
    },
    agents: agents.map((agent) => ({
      id: agent.id,
      role: agent.role,
      mission: agent.mission,
      permissions: agent.permissions,
      denied: agent.denied,
      outputs: agent.outputs
    })),
    stages: [
      { id: "plan", owner: "hydra-chief-of-staff", exitEvidence: "mission brief and acceptance criteria" },
      { id: "execute", owner: agents.length === 3 ? agents[1].id : "assigned-specialist", exitEvidence: "artifact, diff, or report" },
      { id: "verify", owner: "sentinel-qa", exitEvidence: "tests, policy checks, and release decision" }
    ],
    approvalGates,
    canAutoComplete: approvalGates.length === 0
  };
}

export function evaluateRun(metrics = {}) {
  const baselineMinutes = Math.max(0, toFiniteNumber(metrics.baselineMinutes, 0));
  const actualMinutes = Math.max(0, toFiniteNumber(metrics.actualMinutes, 0));
  const reworkMinutes = Math.max(0, toFiniteNumber(metrics.reworkMinutes, 0));
  const costUsd = Math.max(0, toFiniteNumber(metrics.costUsd, 0));
  const accepted = Boolean(metrics.accepted);
  const verified = Boolean(metrics.verified);
  const timeSavedMinutes = Math.max(0, baselineMinutes - actualMinutes - reworkMinutes);
  const reworkRate = actualMinutes + reworkMinutes === 0 ? 0 : reworkMinutes / (actualMinutes + reworkMinutes);
  const valuePerDollar = costUsd === 0 ? timeSavedMinutes : timeSavedMinutes / costUsd;
  const valueScore = Math.max(0, Math.round((accepted ? 35 : 0) + (verified ? 25 : 0) + Math.min(30, timeSavedMinutes) - Math.min(20, reworkRate * 40)));

  return {
    accepted,
    verified,
    baselineMinutes,
    actualMinutes,
    reworkMinutes,
    timeSavedMinutes,
    reworkRate: Number(reworkRate.toFixed(3)),
    costUsd: Number(costUsd.toFixed(4)),
    valuePerDollar: Number(valuePerDollar.toFixed(2)),
    valueScore,
    outcome: accepted && verified ? "verified_value" : "needs_review"
  };
}

export { SAFE_SCOPE };
