export function createCheckpoint(input = {}) {
  return {
    id: input.id || `checkpoint_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    workflowId: input.workflowId || "unknown-workflow",
    stage: input.stage || "unknown-stage",
    completedSteps: [...(input.completedSteps || [])],
    pendingSteps: [...(input.pendingSteps || [])],
    state: input.state || {},
    reason: input.reason || "operator-pause",
    resumable: input.resumable !== false,
    createdAt: new Date().toISOString()
  };
}

export function evaluateResume(checkpoint = {}, signal = {}) {
  if (!checkpoint.resumable) return { resume: false, reason: "Checkpoint is not resumable." };
  if (signal.cancelled) return { resume: false, reason: "Workflow was cancelled." };
  if (signal.policyBlocked) return { resume: false, reason: "Governance block requires review." };
  if (signal.limitReset === true || signal.operatorApproved === true || signal.dependencyReady === true) {
    return { resume: true, reason: signal.limitReset ? "Execution capacity available again." : "Resume condition satisfied." };
  }
  return { resume: false, reason: "Waiting for an explicit resume condition." };
}

export function buildResumePlan(checkpoint = {}, signal = {}) {
  const decision = evaluateResume(checkpoint, signal);
  return {
    workflowId: checkpoint.workflowId,
    checkpointId: checkpoint.id,
    decision,
    nextStep: decision.resume ? checkpoint.pendingSteps[0] || null : null,
    remainingSteps: decision.resume ? [...checkpoint.pendingSteps] : [],
    restoreState: decision.resume ? checkpoint.state : null,
    rules: [
      "Do not bypass provider quotas or usage limits.",
      "Resume only after capacity, approval, or dependency readiness is explicitly signaled.",
      "Persist state before pausing so work can continue without repeating completed steps.",
      "Re-run governance checks before deployment or privileged writes."
    ]
  };
}

export function createContinuityController({ persist = async () => {}, load = async () => null } = {}) {
  return {
    async pause(input) {
      const checkpoint = createCheckpoint(input);
      await persist(checkpoint);
      return checkpoint;
    },
    async resume(checkpointId, signal = {}) {
      const checkpoint = await load(checkpointId);
      if (!checkpoint) return { status: "missing-checkpoint", checkpointId };
      const plan = buildResumePlan(checkpoint, signal);
      return { status: plan.decision.resume ? "ready" : "waiting", ...plan };
    }
  };
}
