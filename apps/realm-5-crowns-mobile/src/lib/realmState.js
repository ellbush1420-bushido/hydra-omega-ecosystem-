export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function toTitle(value) {
  if (!value) return 'Awakening';
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getRealmLabel(state) {
  if (state.tigerRank?.startsWith('white_tiger')) return 'Obsidian Gate';
  if (state.tigerRank?.startsWith('black_tiger')) return 'Shadow Arena';
  if (state.faction?.shortName) return `${state.faction.shortName} Crown`;
  return 'Unclaimed Threshold';
}

export function getTrialLabel(state) {
  const mostRecentScenario = state.scenarioHistory.find((entry) => entry.scenarioId);
  if (mostRecentScenario) return toTitle(mostRecentScenario.scenarioId);
  if (state.faction) return 'Crown Selection';
  return 'Awakening';
}

function getCrownRankLabel(state) {
  if (state.tigerRank) return toTitle(state.tigerRank);
  if (state.faction?.startingRank) return state.faction.startingRank;
  return 'Initiate';
}

export function getHydraEyesSnapshot(state) {
  const completedTrials = new Set(
    state.scenarioHistory.filter((entry) => entry.scenarioId).map((entry) => entry.scenarioId)
  ).size;
  const salesMomentum = state.mockStats.sales * 6 + state.mockStats.joins * 4;

  let shadowBase = 10;
  if (state.faction?.id === 'shadow_serpent') shadowBase += 18;
  if (state.tigerRank?.startsWith('black_tiger')) shadowBase += 24;
  if (state.tigerRank?.startsWith('white_tiger')) shadowBase += 36;

  const threat = clamp(
    18 + state.level * 6 + completedTrials * 5 + (state.tigerRank?.startsWith('white_tiger') ? 8 : 0),
    0,
    100
  );
  const opportunity = clamp(
    12
      + Math.min(state.codexUnlocks.length * 12, 36)
      + Math.min(state.mockStats.scaleScore, 28)
      + Math.min(salesMomentum, 24),
    0,
    100
  );
  const shadow = clamp(
    shadowBase + Math.min(state.mockStats.clicks * 2, 20) + Math.min(completedTrials * 4, 20),
    0,
    100
  );
  const hp = clamp(
    130 - Math.round(threat * 0.55) + state.level * 4 + (state.tigerRank ? 8 : 0),
    35,
    150
  );

  return {
    realmName: getRealmLabel(state),
    trialName: getTrialLabel(state),
    crownRank: getCrownRankLabel(state),
    threat,
    opportunity,
    shadow,
    hp,
    hydraStatus: 'HYDRA EYES: ACTIVE',
  };
}
