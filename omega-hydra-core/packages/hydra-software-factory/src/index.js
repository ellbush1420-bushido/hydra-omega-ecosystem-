import fs from "node:fs";
import path from "node:path";

const SAFE_SCOPE = [
  "lawful defensive education",
  "privacy awareness",
  "digital hygiene",
  "business automation",
  "community service",
  "readiness training",
  "software engineering",
  "documentation",
  "testing",
  "security review"
];

export const AGENT_ROLES = Object.freeze([
  "planner",
  "architect",
  "builder",
  "tester",
  "security",
  "documenter",
  "reviewer",
  "deployer",
  "observer"
]);

export const HARNESS_REGISTRY = Object.freeze({
  codex: {
    id: "codex",
    label: "Codex",
    capabilities: ["plan", "architecture", "build", "test", "security", "docs", "review", "deploy", "observe"],
    adapterRequired: true
  },
  "claude-code": {
    id: "claude-code",
    label: "Claude Code",
    capabilities: ["plan", "architecture", "build", "test", "security", "docs", "review", "deploy", "observe"],
    adapterRequired: true
  },
  generic: {
    id: "generic",
    label: "Generic Harness",
    capabilities: ["plan", "architecture", "build", "test", "security", "docs", "review", "deploy", "observe"],
    adapterRequired: false
  }
});

export const MODEL_REGISTRY = Object.freeze({
  balanced: {
    id: "balanced",
    label: "Balanced Default",
    quality: 8,
    latency: 8,
    costEfficiency: 8,
    contextFit: 8,
    toolReliability: 8
  },
  deep: {
    id: "deep",
    label: "Deep Reasoning",
    quality: 10,
    latency: 5,
    costEfficiency: 5,
    contextFit: 10,
    toolReliability: 8
  },
  fast: {
    id: "fast",
    label: "Fast Worker",
    quality: 7,
    latency: 10,
    costEfficiency: 9,
    contextFit: 6,
    toolReliability: 7
  }
});

const STAGE_DEFINITIONS = Object.freeze([
  { stage: "plan", role: "planner", objective: "Translate the request into explicit goals, constraints, acceptance criteria, and dependencies." },
  { stage: "architecture", role: "architect", objective: "Design interfaces, boundaries, data flow, state, and implementation sequence." },
  { stage: "build", role: "builder", objective: "Implement the approved change set in the target workspace." },
  { stage: "test", role: "tester", objective: "Run deterministic validation, smoke tests, and regression checks." },
  { stage: "security", role: "security", objective: "Review permissions, secrets, dependencies, unsafe scope, and production-impact risks." },
  { stage: "docs", role: "documenter", objective: "Update operator documentation, runbooks, and change notes." },
  { stage: "review", role: "reviewer", objective: "Verify acceptance criteria and prepare the change for human approval." },
  { stage: "deploy", role: "deployer", objective: "Deploy only after tests, security review, and required human approval gates pass." },
  { stage: "observe", role: "observer", objective: "Observe the deployed outcome, record telemetry, and surface regressions or follow-up work." }
]);

const UNSAFE_SCOPE_PATTERNS = [
  /credential theft/i,
  /steal credentials/i,
  /unauthorized access/i,
  /deploy malware/i,
  /ransomware/i,
  /bypass authentication/i,
  /disable security controls/i,
  /evade detection/i
];

function nowIso() {
  return new Date().toISOString();
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function normalizeSource(value = "hydra-console") {
  const source = String(value).toLowerCase().trim();
  const aliases = {
    github: "github",
    linear: "linear",
    jira: "jira",
    slack: "slack",
    teams: "teams",
    "microsoft teams": "teams",
    hydra: "hydra-console",
    "hydra console": "hydra-console",
    "hydra-console": "hydra-console"
  };
  return aliases[source] || "hydra-console";
}

function isUnsafeScope(request) {
  const haystack = [
    request.title,
    request.description,
    ...request.constraints,
    ...request.acceptanceCriteria
  ].join(" ");
  return UNSAFE_SCOPE_PATTERNS.some((pattern) => pattern.test(haystack));
}

export function createWorkRequest(input = {}) {
  const request = {
    id: input.id || uid("work"),
    source: normalizeSource(input.source),
    externalRef: input.externalRef || null,
    repository: input.repository || null,
    title: String(input.title || "Untitled software work request").trim(),
    description: String(input.description || "").trim(),
    priority: String(input.priority || "normal").toLowerCase(),
    constraints: normalizeArray(input.constraints),
    acceptanceCriteria: normalizeArray(input.acceptanceCriteria),
    preferredHarness: input.preferredHarness || null,
    preferredModel: input.preferredModel || null,
    targetEnvironment: input.targetEnvironment || "development",
    requestedCapabilities: normalizeArray(input.requestedCapabilities),
    requiresSecrets: Boolean(input.requiresSecrets),
    requiresProductionWrite: Boolean(input.requiresProductionWrite),
    humanApproval: Boolean(input.humanApproval),
    createdAt: input.createdAt || nowIso()
  };

  request.scopeStatus = isUnsafeScope(request) ? "blocked" : "allowed";
  return request;
}

export function decomposeWork(request) {
  return STAGE_DEFINITIONS.map((definition, index) => ({
    id: `${request.id}_${String(index + 1).padStart(2, "0")}_${definition.stage}`,
    workRequestId: request.id,
    order: index + 1,
    stage: definition.stage,
    role: definition.role,
    objective: definition.objective,
    status: "queued",
    attempts: 0,
    dependencies: index === 0 ? [] : [`${request.id}_${String(index).padStart(2, "0")}_${STAGE_DEFINITIONS[index - 1].stage}`]
  }));
}

function modelWeightsForStage(stage) {
  switch (stage) {
    case "architecture":
    case "security":
    case "review":
      return { quality: 0.3, latency: 0.1, costEfficiency: 0.1, contextFit: 0.3, toolReliability: 0.2 };
    case "build":
    case "test":
      return { quality: 0.25, latency: 0.15, costEfficiency: 0.15, contextFit: 0.15, toolReliability: 0.3 };
    default:
      return { quality: 0.2, latency: 0.2, costEfficiency: 0.2, contextFit: 0.2, toolReliability: 0.2 };
  }
}

export function scoreModel(model, stage) {
  const weights = modelWeightsForStage(stage);
  return Object.entries(weights).reduce((total, [key, weight]) => total + model[key] * weight, 0);
}

export function routeModel(task, request, modelRegistry = MODEL_REGISTRY) {
  if (request.preferredModel && modelRegistry[request.preferredModel]) {
    return { ...modelRegistry[request.preferredModel], routeReason: "operator preference" };
  }

  const ranked = Object.values(modelRegistry)
    .map((model) => ({ model, score: scoreModel(model, task.stage) }))
    .sort((a, b) => b.score - a.score);

  return { ...ranked[0].model, routeScore: Number(ranked[0].score.toFixed(2)), routeReason: `best weighted fit for ${task.stage}` };
}

export function routeHarness(task, request, harnessRegistry = HARNESS_REGISTRY) {
  const preferred = request.preferredHarness && harnessRegistry[request.preferredHarness];
  if (preferred && preferred.capabilities.includes(task.stage)) {
    return { ...preferred, routeReason: "operator preference" };
  }

  const candidate = Object.values(harnessRegistry).find((harness) => harness.capabilities.includes(task.stage));
  return { ...(candidate || harnessRegistry.generic), routeReason: "capability match" };
}

export function evaluateGovernance(request, task, context = {}) {
  const checks = [
    {
      id: "scope",
      status: request.scopeStatus === "allowed" ? "pass" : "block",
      message: request.scopeStatus === "allowed" ? "Request remains inside approved software-engineering scope." : "Request contains a blocked unsafe capability."
    },
    {
      id: "repository",
      status: task.stage === "build" && !request.repository ? "review" : "pass",
      message: task.stage === "build" && !request.repository ? "Build stage needs an explicit target repository or workspace." : "Target workspace requirement satisfied."
    },
    {
      id: "secrets",
      status: request.requiresSecrets && !context.secretsApproved ? "review" : "pass",
      message: request.requiresSecrets && !context.secretsApproved ? "Secret access requires explicit approval and scoped credentials." : "No unapproved secret access required."
    },
    {
      id: "production-write",
      status: request.requiresProductionWrite && !request.humanApproval ? "review" : "pass",
      message: request.requiresProductionWrite && !request.humanApproval ? "Production writes require explicit human approval." : "Production-write gate satisfied."
    },
    {
      id: "pre-deploy-tests",
      status: ["review", "deploy"].includes(task.stage) && context.testsPassed !== true ? "block" : "pass",
      message: ["review", "deploy"].includes(task.stage) && context.testsPassed !== true ? "Review/deploy blocked until tests pass." : "Test gate does not block this task."
    },
    {
      id: "security-review",
      status: ["review", "deploy"].includes(task.stage) && context.securityPassed !== true ? "block" : "pass",
      message: ["review", "deploy"].includes(task.stage) && context.securityPassed !== true ? "Review/deploy blocked until security review passes." : "Security gate does not block this task."
    }
  ];

  const blocked = checks.some((check) => check.status === "block");
  const needsReview = checks.some((check) => check.status === "review");

  return {
    decision: blocked ? "block" : needsReview ? "human-review" : "allow",
    checks
  };
}

function createTelemetryCollector(externalLogger) {
  const events = [];
  return {
    emit(type, payload = {}) {
      const event = {
        id: uid("factory_evt"),
        type,
        payload,
        createdAt: nowIso()
      };
      events.push(event);
      if (typeof externalLogger === "function") externalLogger(type, payload);
      return event;
    },
    list() {
      return [...events];
    }
  };
}

export function createMockHarnessAdapter({ name = "mock", failStages = [], retryStages = [] } = {}) {
  const attemptMap = new Map();
  return {
    name,
    async execute({ task, request, route }) {
      const attempts = (attemptMap.get(task.id) || 0) + 1;
      attemptMap.set(task.id, attempts);

      if (retryStages.includes(task.stage) && attempts === 1) {
        return { status: "retry", retryable: true, message: `${task.stage} requested one retry for smoke validation.` };
      }

      if (failStages.includes(task.stage)) {
        return { status: "failed", retryable: false, message: `${task.stage} failed by mock adapter configuration.` };
      }

      return {
        status: "completed",
        retryable: false,
        message: `${task.role} completed ${task.stage} for ${request.title}.`,
        artifact: {
          stage: task.stage,
          role: task.role,
          harness: route.harness.id,
          model: route.model.id
        }
      };
    }
  };
}

function getAdapterForRoute(route, adapters) {
  return adapters[route.harness.id] || adapters.generic || null;
}

function buildRoute(task, request, options) {
  return {
    harness: routeHarness(task, request, options.harnessRegistry || HARNESS_REGISTRY),
    model: routeModel(task, request, options.modelRegistry || MODEL_REGISTRY)
  };
}

export function calculateMetrics(run) {
  const tasks = run.tasks;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const failed = tasks.filter((task) => task.status === "failed" || task.status === "blocked").length;
  const attempts = tasks.reduce((total, task) => total + task.attempts, 0);
  const retries = Math.max(0, attempts - tasks.filter((task) => task.attempts > 0).length);
  const started = new Date(run.startedAt).getTime();
  const ended = new Date(run.completedAt || nowIso()).getTime();

  return {
    taskCount: tasks.length,
    completionRate: tasks.length ? Number(((completed / tasks.length) * 100).toFixed(1)) : 0,
    failureRate: tasks.length ? Number(((failed / tasks.length) * 100).toFixed(1)) : 0,
    retryCount: retries,
    retryRate: attempts ? Number(((retries / attempts) * 100).toFixed(1)) : 0,
    cycleTimeMs: Math.max(0, ended - started),
    defectCount: tasks.filter((task) => task.stage === "test" && task.status === "failed").length,
    governanceStops: tasks.filter((task) => ["blocked", "human-review"].includes(task.status)).length
  };
}

export function buildExecutionPlan(input, options = {}) {
  const request = createWorkRequest(input);
  const tasks = decomposeWork(request).map((task) => ({
    ...task,
    route: buildRoute(task, request, options),
    governance: evaluateGovernance(request, task, options.context || {})
  }));

  return {
    id: uid("factory_plan"),
    request,
    tasks,
    createdAt: nowIso(),
    designRule: "Hydra owns workflow, policy, state, telemetry, and institutional memory; models and harnesses are replaceable execution providers."
  };
}

export async function runSoftwareFactory(input, options = {}) {
  const telemetry = createTelemetryCollector(options.logEvent);
  const plan = buildExecutionPlan(input, options);
  const run = {
    id: uid("factory_run"),
    planId: plan.id,
    request: plan.request,
    status: "running",
    startedAt: nowIso(),
    completedAt: null,
    tasks: plan.tasks.map((task) => ({ ...task })),
    approvals: [],
    artifacts: []
  };

  telemetry.emit("factory_run_started", { runId: run.id, workRequestId: run.request.id, source: run.request.source });

  let testsPassed;
  let securityPassed;

  for (const task of run.tasks) {
    const governance = evaluateGovernance(run.request, task, {
      ...(options.context || {}),
      testsPassed,
      securityPassed
    });
    task.governance = governance;

    if (governance.decision === "block") {
      task.status = "blocked";
      telemetry.emit("factory_task_blocked", { runId: run.id, taskId: task.id, stage: task.stage, checks: governance.checks });
      run.status = "blocked";
      break;
    }

    if (governance.decision === "human-review") {
      task.status = "human-review";
      run.approvals.push({ taskId: task.id, stage: task.stage, requiredAt: nowIso(), checks: governance.checks.filter((check) => check.status === "review") });
      telemetry.emit("factory_human_review_required", { runId: run.id, taskId: task.id, stage: task.stage });
      run.status = "awaiting-approval";
      break;
    }

    const route = buildRoute(task, run.request, options);
    task.route = route;
    telemetry.emit("factory_task_dispatched", {
      runId: run.id,
      taskId: task.id,
      stage: task.stage,
      role: task.role,
      harness: route.harness.id,
      model: route.model.id
    });

    const adapter = getAdapterForRoute(route, options.adapters || {});
    if (!adapter) {
      task.status = "blocked";
      telemetry.emit("factory_adapter_missing", { runId: run.id, taskId: task.id, harness: route.harness.id });
      run.status = "blocked";
      break;
    }

    const maxAttempts = clamp(Number(options.maxAttempts || 2), 1, 5);
    let result;
    while (task.attempts < maxAttempts) {
      task.attempts += 1;
      result = await adapter.execute({ task, request: run.request, route, context: options.context || {} });
      if (result.status !== "retry") break;
      telemetry.emit("factory_task_retry", { runId: run.id, taskId: task.id, stage: task.stage, attempt: task.attempts });
    }

    if (!result || result.status === "retry") {
      result = { status: "failed", message: "Retry limit exceeded.", retryable: false };
    }

    task.status = result.status;
    task.result = result;

    if (result.artifact) run.artifacts.push({ taskId: task.id, ...result.artifact });

    if (task.stage === "test") testsPassed = result.status === "completed";
    if (task.stage === "security") securityPassed = result.status === "completed";

    telemetry.emit("factory_task_finished", {
      runId: run.id,
      taskId: task.id,
      stage: task.stage,
      status: task.status,
      attempts: task.attempts
    });

    if (task.status !== "completed") {
      run.status = "failed";
      break;
    }
  }

  if (run.tasks.every((task) => task.status === "completed")) {
    run.status = "observed";
  }

  run.completedAt = nowIso();
  run.metrics = calculateMetrics(run);
  run.telemetry = telemetry.list();

  telemetry.emit("factory_run_finished", { runId: run.id, status: run.status, metrics: run.metrics });
  run.telemetry = telemetry.list();
  if (options.store && typeof options.store.save === "function") {
    run.persistPath = await options.store.save(run);
  }
  return run;
}


export function createLocalHarnessAdapter(options = {}) {
  return createMockHarnessAdapter({ name: "hydra-local", ...options });
}

export function createFileRunStore(dir = path.resolve(".hydra/factory-runs")) {
  return {
    async save(run) {
      fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, `${run.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(run, null, 2), "utf8");
      return filePath;
    }
  };
}

export function clusterSignals(signals = [], { maxPerCluster = 8 } = {}) {
  const limit = clamp(Number(maxPerCluster || 8), 1, 100);
  const groups = new Map();
  for (const signal of signals) {
    const key = `${signal.source || "unknown"}::${signal.topic || "general"}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(signal);
  }
  const clusters = [];
  for (const [key, items] of groups.entries()) {
    for (let i = 0; i < items.length; i += limit) {
      clusters.push({ key, signals: items.slice(i, i + limit) });
    }
  }
  return clusters;
}

export async function runSignalBatch(signals = [], options = {}) {
  const clusters = clusterSignals(signals, options);
  const runs = [];
  let cleared = 0;
  for (const cluster of clusters) {
    const run = await runSoftwareFactory({
      source: "hydra-console",
      repository: options.repository || null,
      title: `Process signal cluster ${cluster.key}`,
      description: cluster.signals.map((signal) => signal.text || signal.id || "signal").join("\n"),
      preferredHarness: options.preferredHarness || "generic",
      acceptanceCriteria: ["classify signals", "produce governed artifact", "record telemetry"]
    }, {
      adapters: options.adapters || { generic: createLocalHarnessAdapter() },
      maxAttempts: options.maxAttempts || 2,
      logEvent: options.logEvent,
      store: options.store,
      context: options.context || {}
    });
    runs.push(run);
    if (run.status === "observed") cleared += cluster.signals.length;
  }
  return {
    requestCount: clusters.length,
    signalsIn: signals.length,
    signalsCleared: cleared,
    signalsRemaining: Math.max(0, signals.length - cleared),
    runs
  };
}

export function summarizeRoutes(run) {
  return run.tasks.map((task) => ({
    stage: task.stage,
    role: task.role,
    status: task.status,
    harness: task.route?.harness?.id || null,
    model: task.route?.model?.id || null,
    attempts: task.attempts
  }));
}

export { SAFE_SCOPE };
