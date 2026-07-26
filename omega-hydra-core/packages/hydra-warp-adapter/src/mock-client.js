const MOCK_RUN_DELAY_MS = 10;

export function createMockClient(options = {}) {
  const runLog = [];

  function submitRun(request = {}) {
    const runId = `mock_run_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const entry = {
      runId,
      requestId: request.requestId || runId,
      jobType: request.jobType || "skill_forge",
      sourceId: request.sourceId || "unknown",
      status: "mock",
      modelTier: request.modelTier || "economy",
      submittedAt: new Date().toISOString(),
      completedAt: new Date(Date.now() + MOCK_RUN_DELAY_MS).toISOString(),
      artifacts: [],
      provenance: {
        adapter: "mock",
        dryRun: Boolean(request.dryRun),
        mockMode: true
      },
      costUsd: 0
    };
    runLog.push(entry);
    return entry;
  }

  function getRunStatus(runId) {
    return runLog.find((r) => r.runId === runId) || null;
  }

  function listRuns() {
    return [...runLog];
  }

  function reset() {
    runLog.length = 0;
  }

  return { submitRun, getRunStatus, listRuns, reset };
}
