const MODE_LIBRARY = [
  {
    id: 'tactical',
    label: 'Tactical View',
    title: 'Threat geometry and encounter timing',
    description: 'Highlights silhouettes, weak-point pulses, and movement lanes inside the encounter space.',
    status: 'Threat lattice resolved',
    caption: 'Hydra Eyes traces attack arcs, pressure lanes, and strike windows in real time.',
    fogDensity: 0.028,
    background: 0x06070c,
    ambient: 0x45305f,
    fill: 0xd946ef,
    halo: 0xfb7185,
    pulseColor: 0xf97316,
    overlays: ['Threat zones', 'Weakness pulses', 'Timing windows'],
  },
  {
    id: 'realm',
    label: 'Realm Overlay',
    title: 'Fog, light, and path interpretation',
    description: 'Maps realm geometry, gate signals, light sources, and route stability across the corridor.',
    status: 'Realm projection stable',
    caption: 'Hydra Eyes renders fog density, beacon strength, and safe traversal lines through the realm.',
    fogDensity: 0.048,
    background: 0x05060a,
    ambient: 0x4c3f69,
    fill: 0x7c3aed,
    halo: 0xa78bfa,
    pulseColor: 0x38bdf8,
    overlays: ['Realm geometry', 'Fog density', 'Light beacons'],
  },
  {
    id: 'social',
    label: 'Social Terrain',
    title: 'Behavioral signatures and alliance flow',
    description: 'Surfaces join velocity, commerce motion, faction pull, and recommendation pressure.',
    status: 'Behavior lattice awake',
    caption: 'Hydra Eyes interprets emotional terrain, faction gravity, and conversion opportunities.',
    fogDensity: 0.038,
    background: 0x07100d,
    ambient: 0x20463f,
    fill: 0x10b981,
    halo: 0x34d399,
    pulseColor: 0xf59e0b,
    overlays: ['Alliance flow', 'Commerce pulse', 'Faction gravity'],
  },
  {
    id: 'pattern',
    label: 'Pattern Mesh',
    title: 'Anomaly mapping and codex resonance',
    description: 'Detects repeated signals, codex unlock anomalies, and hidden pattern clusters.',
    status: 'Pattern resonance aligned',
    caption: 'Hydra Eyes stacks event echoes, codex fragments, and anomaly signatures into one mesh.',
    fogDensity: 0.032,
    background: 0x05080e,
    ambient: 0x21355b,
    fill: 0x3b82f6,
    halo: 0x60a5fa,
    pulseColor: 0x22d3ee,
    overlays: ['Anomaly nodes', 'Codex resonance', 'Signal loops'],
  },
];

export function formatHydraEyesLabel(value) {
  if (!value) return 'Unbound';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function dominantEventLabel(eventCounts) {
  const [eventType] = Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0] || [];
  return eventType ? formatHydraEyesLabel(eventType) : 'No signal yet';
}

export function getHydraEyesMode(modeId) {
  return MODE_LIBRARY.find((mode) => mode.id === modeId) || MODE_LIBRARY[0];
}

export function listHydraEyesModes() {
  return MODE_LIBRARY;
}

export function buildHydraEyesWorldState(playerState, eventLog, modeId) {
  const mode = getHydraEyesMode(modeId);
  const eventCounts = eventLog.reduce((counts, event) => {
    counts[event.event_type] = (counts[event.event_type] || 0) + 1;
    return counts;
  }, {});

  const completedTrials = new Set(
    playerState.scenarioHistory
      .filter((entry) => entry.scenarioId)
      .map((entry) => entry.scenarioId)
  ).size;

  const lastTrial =
    playerState.scenarioHistory.find((entry) => entry.scenarioId)?.scenarioId || 'Awakening';

  const threatLevel = Math.min(
    99,
    completedTrials * 16 +
      (playerState.tigerRank?.startsWith('black_tiger') ? 18 : 0) +
      (eventCounts.scenario_choice || 0) * 5 +
      (mode.id === 'tactical' ? 10 : 0)
  );

  const opportunityLevel = Math.min(
    99,
    playerState.mockStats.joins * 8 +
      playerState.mockStats.sales * 12 +
      playerState.codexUnlocks.length * 5 +
      (mode.id === 'social' ? 12 : 0)
  );

  const anomalyCount =
    (eventCounts.codex_unlock || 0) +
    (eventCounts.tiger_promotion || 0) +
    (playerState.tigerRank?.startsWith('white_tiger') ? 2 : 0);

  const focalPoint =
    playerState.faction?.shortName ||
    (playerState.tigerRank ? formatHydraEyesLabel(playerState.tigerRank) : 'Unclaimed Threshold');

  const modeDetails = {
    tactical: [
      { label: 'Threat zones', value: `${threatLevel}%` },
      { label: 'Weakness pulse', value: playerState.faction?.trialType || 'Awaiting Crown' },
      { label: 'Timing window', value: playerState.level >= 5 ? 'Aggressive' : 'Measured' },
    ],
    realm: [
      { label: 'Fog density', value: `${Math.round(mode.fogDensity * 1000)} u` },
      { label: 'Gate status', value: playerState.tigerRank ? 'Unlocked' : 'Dormant' },
      { label: 'Path anchor', value: focalPoint },
    ],
    social: [
      { label: 'Join vectors', value: playerState.mockStats.joins || 0 },
      { label: 'Revenue pulse', value: `$${playerState.mockStats.revenue}` },
      { label: 'Hydra read', value: playerState.hydraRecommendation ? 'Active' : 'Pending' },
    ],
    pattern: [
      { label: 'Anomaly nodes', value: anomalyCount },
      { label: 'Dominant signal', value: dominantEventLabel(eventCounts) },
      { label: 'Codex resonance', value: playerState.codexUnlocks.length },
    ],
  };

  return {
    mode,
    focalPoint,
    threatLevel,
    opportunityLevel,
    anomalyCount,
    completedTrials,
    lastTrial: formatHydraEyesLabel(lastTrial),
    dominantSignal: dominantEventLabel(eventCounts),
    totalSignals: eventLog.length,
    detailCards: modeDetails[mode.id] || [],
  };
}
