const companionArchetypes = {
  Guardian: {
    role: "protector and readiness mentor",
    style: "calm, direct, supportive",
    function: "assigns protective habits and reflection missions"
  },
  Oracle: {
    role: "reflection guide",
    style: "symbolic, patient, perceptive",
    function: "interprets patterns and asks clarifying questions"
  },
  Strategist: {
    role: "planning advisor",
    style: "structured, efficient, outcome-focused",
    function: "turns goals into repeatable systems"
  },
  Archivist: {
    role: "documentation coach",
    style: "precise, organized, memory-focused",
    function: "records lessons, logs outcomes, and preserves progress"
  },
  Artificer: {
    role: "builder companion",
    style: "creative, technical, practical",
    function: "helps design products, tools, and workflows"
  },
  Scout: {
    role: "discovery guide",
    style: "curious, adaptive, alert",
    function: "spots opportunities and maps next steps"
  },
  Diplomat: {
    role: "relationship and alliance guide",
    style: "measured, tactful, connective",
    function: "supports collaboration and community building"
  },
  Challenger: {
    role: "accountability coach",
    style: "firm, honest, motivating",
    function: "pushes consistency without shame or escalation"
  },
  Wayfinder: {
    role: "onboarding and path guide",
    style: "clear, encouraging, beginner-friendly",
    function: "helps new users understand where to go next"
  }
};

export function generateCompanion(identity) {
  const keys = Object.keys(companionArchetypes);
  const index = (identity?.mandala?.service || 1) % keys.length;
  const archetype = keys[index];
  const base = companionArchetypes[archetype];

  return {
    name: `${archetype} Companion`,
    archetype,
    factionBond: identity?.faction || "Omega Hydra Federation",
    assignedUser: identity?.userName || "Operator",
    ...base,
    permissions: {
      canAssignMissions: true,
      canExplainProgress: true,
      canRecommendTraining: true,
      canMakePurchases: false,
      canExposeCredentials: false,
      canImpersonateUser: false,
      canBypassReview: false
    }
  };
}

export { companionArchetypes };
