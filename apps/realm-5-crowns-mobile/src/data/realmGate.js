export const REALM_PROGRESSIONS = [
  {
    id: 'obsidian_gate',
    realmNumber: 1,
    title: 'Realm 1: Obsidian Gate',
    summary: 'A dark threshold where the first Gate Warden measures your claim to the Crown.',
    introCodexKey: 'codex.obsidian_gate',
    trials: [
      {
        id: 'r1_trial_steel',
        realmId: 'obsidian_gate',
        title: 'Trial of Steel',
        type: 'steel',
        optional: false,
        description: 'The Gate Warden tests force, timing, and nerve in a direct clash.',
        rewardXp: 65,
        victoryCodexKey: 'codex.gate_warden',
      },
      {
        id: 'r1_trial_echoes',
        realmId: 'obsidian_gate',
        title: 'Trial of Echoes',
        type: 'echoes',
        optional: true,
        description: 'Ghost-sound and memory pressure demand Pulse and Veil precision.',
        rewardXp: 55,
      },
      {
        id: 'r1_trial_masks',
        realmId: 'obsidian_gate',
        title: 'Trial of Masks',
        type: 'masks',
        optional: true,
        description: 'False faces distort intent and punish weak Veil or Flux control.',
        rewardXp: 60,
      },
    ],
  },
  {
    id: 'golden_arena',
    realmNumber: 2,
    title: 'Realm 2: Golden Arena',
    summary: 'Crowds, chains, and bright ceremonial violence force discipline under spectacle.',
    introCodexKey: 'codex.golden_arena',
    trials: [
      {
        id: 'r2_trial_steel',
        realmId: 'golden_arena',
        title: 'Trial of Steel',
        type: 'steel',
        optional: false,
        description: 'Steel returns, but the arena now punishes hesitation with heavier impact.',
        rewardXp: 80,
      },
      {
        id: 'r2_trial_chains',
        realmId: 'golden_arena',
        title: 'Trial of Chains',
        type: 'chains',
        optional: false,
        description: 'Binding techniques squeeze Edge and Pulse while limiting movement.',
        rewardXp: 70,
      },
      {
        id: 'r2_trial_echoes',
        realmId: 'golden_arena',
        title: 'Trial of Echoes',
        type: 'echoes',
        optional: true,
        description: 'The crowd repeats every weakness until your rhythm breaks.',
        rewardXp: 72,
      },
    ],
  },
  {
    id: 'silver_labyrinth',
    realmNumber: 3,
    title: 'Realm 3: Silver Labyrinth',
    summary: 'Mirrors, half-truths, and hollow corridors turn every step into a choice.',
    introCodexKey: 'codex.silver_labyrinth',
    trials: [
      {
        id: 'r3_trial_masks',
        realmId: 'silver_labyrinth',
        title: 'Trial of Masks',
        type: 'masks',
        optional: false,
        description: 'The labyrinth reflects stolen identities and spikes Veil/Flux demands.',
        rewardXp: 92,
      },
      {
        id: 'r3_trial_echoes',
        realmId: 'silver_labyrinth',
        title: 'Trial of Echoes',
        type: 'echoes',
        optional: true,
        description: 'Pulse through recursive sound before the maze seals around you.',
        rewardXp: 88,
      },
      {
        id: 'r3_trial_void',
        realmId: 'silver_labyrinth',
        title: 'Trial of the Void',
        type: 'void',
        optional: false,
        description: 'Mixed pressure, penalties, and unreal geometry open the first true abyss.',
        rewardXp: 100,
      },
    ],
  },
  {
    id: 'crimson_wilds',
    realmNumber: 4,
    title: 'Realm 4: Crimson Wilds',
    summary: 'Everything hunts. Force, restraint, and survival fuse into one red storm.',
    introCodexKey: 'codex.crimson_wilds',
    trials: [
      {
        id: 'r4_trial_steel',
        realmId: 'crimson_wilds',
        title: 'Trial of Steel',
        type: 'steel',
        optional: false,
        description: 'Steel becomes brutal in the Wilds, where every hit leaves lasting cost.',
        rewardXp: 110,
      },
      {
        id: 'r4_trial_chains',
        realmId: 'crimson_wilds',
        title: 'Trial of Chains',
        type: 'chains',
        optional: false,
        description: 'Predator-bindings punish sloppy Pulse and exhausted Edge.',
        rewardXp: 104,
      },
      {
        id: 'r4_trial_void',
        realmId: 'crimson_wilds',
        title: 'Trial of the Void',
        type: 'void',
        optional: false,
        description: 'The Wilds open into the abyss and stack penalties on every bad exchange.',
        rewardXp: 118,
      },
    ],
  },
  {
    id: 'azure_spire',
    realmNumber: 5,
    title: 'Realm 5: Azure Spire',
    summary: 'The Spire combines every lesson before the Ascension threshold opens.',
    introCodexKey: 'codex.azure_spire',
    trials: [
      {
        id: 'r5_trial_final_mix',
        realmId: 'azure_spire',
        title: 'Any Trial — Final Mix',
        type: 'any',
        optional: false,
        description: 'A convergence duel lets you answer with any Shadow Crown discipline.',
        rewardXp: 135,
      },
      {
        id: 'r5_trial_ascension',
        realmId: 'azure_spire',
        title: 'Ascension Encounter',
        type: 'void',
        optional: false,
        description: 'A final abyssal exchange decides whether the Crown truly ascends.',
        rewardXp: 160,
        victoryCodexKey: 'codex.ascension',
      },
    ],
  },
];

export const TRIAL_TYPE_RULES = {
  steel: {
    label: 'Steel',
    baseDc: 11,
    successDamage: 7,
    failureDamage: 6,
    statOptions: ['edge', 'pulse'],
    blurb: 'Higher damage, moderate DC.',
  },
  echoes: {
    label: 'Echoes',
    baseDc: 12,
    successDamage: 5,
    failureDamage: 3,
    statOptions: ['pulse', 'veil'],
    blurb: 'Higher DC on Pulse/Veil, low damage.',
  },
  masks: {
    label: 'Masks',
    baseDc: 12,
    successDamage: 5,
    failureDamage: 3,
    statOptions: ['veil', 'flux'],
    blurb: 'Veil/Flux spikes with low direct damage.',
  },
  chains: {
    label: 'Chains',
    baseDc: 11,
    successDamage: 6,
    failureDamage: 4,
    statOptions: ['edge', 'pulse'],
    blurb: 'Control-heavy pressure on Edge/Pulse.',
  },
  void: {
    label: 'Void',
    baseDc: 13,
    successDamage: 6,
    failureDamage: 6,
    statOptions: ['veil', 'edge', 'pulse', 'flux'],
    blurb: 'Highest DC with mixed penalties.',
  },
  any: {
    label: 'Final Mix',
    baseDc: 12,
    successDamage: 6,
    failureDamage: 5,
    statOptions: ['veil', 'edge', 'pulse', 'flux'],
    blurb: 'The final mix accepts any Crown discipline.',
  },
};

export const SHADOW_CROWN_THRESHOLDS = [0, 50, 120, 220, 350, 500, 700, 950, 1250, 1600];

export const ENCOUNTER_BALANCE = {
  playerBaseHp: 24,
  bonusHpRankThreshold: 8,
  bonusHpAmount: 2,
  wardenBaseHp: 16,
  wardenPerRealmHp: 4,
  voidBonusHp: 2,
};

export const SHADOW_CROWN_MILESTONES = [
  {
    rank: 1,
    label: 'Rank 1',
    stats: { veil: 8, edge: 6, pulse: 7, flux: 4 },
    perk: 'Base Crown attunement',
    unlockCodexKey: 'codex.shadow_crown',
  },
  {
    rank: 2,
    label: 'Rank 2',
    stats: { veil: 9, edge: 6, pulse: 7, flux: 4 },
    perk: '+1 Veil',
  },
  {
    rank: 3,
    label: 'Rank 3',
    stats: { veil: 9, edge: 7, pulse: 7, flux: 4 },
    perk: '+1 Edge',
  },
  {
    rank: 4,
    label: 'Rank 4',
    stats: { veil: 9, edge: 7, pulse: 8, flux: 4 },
    perk: '+1 Pulse',
  },
  {
    rank: 5,
    label: 'Rank 5',
    stats: { veil: 9, edge: 7, pulse: 8, flux: 4 },
    perk: 'Deep Fade — advantage on the first Veil roll each encounter',
    unlockCodexKey: 'codex.deep_fade',
  },
  {
    rank: 6,
    label: 'Rank 6',
    stats: { veil: 10, edge: 7, pulse: 8, flux: 5 },
    perk: '+1 Veil, +1 Flux',
  },
  {
    rank: 7,
    label: 'Rank 7',
    stats: { veil: 10, edge: 7, pulse: 8, flux: 5 },
    perk: 'Echo Step — once per encounter, ignore one failed Veil test',
    unlockCodexKey: 'codex.echo_step',
  },
  {
    rank: 8,
    label: 'Rank 8',
    stats: { veil: 10, edge: 8, pulse: 9, flux: 5 },
    perk: '+1 Edge, +1 Pulse',
  },
  {
    rank: 9,
    label: 'Rank 9',
    stats: { veil: 10, edge: 8, pulse: 9, flux: 5 },
    perk: 'Shadow Dominion — victory grants one future Veil auto-win in the same Realm',
    unlockCodexKey: 'codex.shadow_dominion',
  },
  {
    rank: 10,
    label: 'Rank 10',
    stats: { veil: 11, edge: 9, pulse: 10, flux: 6 },
    perk: 'Ascendant aura and unique intro line',
    introLine: 'The Crown arrives before the footfall; the realm bends and remembers.',
  },
];

export const LOCAL_CODEX_ENTRIES = [
  {
    key: 'codex.shadow_serpent',
    title: 'Serpent Cipher Vol. I',
    body: 'The Serpent Crown records every victory won by patience, concealed intent, and perfectly timed silence.',
    unlockCondition: 'Choose the Shadow Serpent Crown.',
  },
  {
    key: 'codex.scarlet_temple',
    title: 'Crimson Codex Vol. I',
    body: 'Scarlet doctrine frames command as devotion: speak once, strike once, and let the realm answer.',
    unlockCondition: 'Choose the Scarlet Crown.',
  },
  {
    key: 'codex.ophiuchus',
    title: 'Ophiuchus Prophecy Scroll I',
    body: 'The thirteenth sign teaches transformation through the fracture between prophecy and will.',
    unlockCondition: 'Choose the Ophiuchus Crown.',
  },
  {
    key: 'codex.black_sun',
    title: 'Black Sun Ledger Vol. I',
    body: 'Law, containment, and judgment move together beneath the hidden Black Sun.',
    unlockCondition: 'Choose the Black Sun Crown.',
  },
  {
    key: 'codex.lazarus',
    title: 'Lazarus Codex Vol. I',
    body: 'Restoration is not retreat; the Lazarus doctrine turns survival into radiance.',
    unlockCondition: 'Choose the Lazarus Crown.',
  },
  {
    key: 'codex.shadow_crown',
    title: 'Shadow Crown Primer',
    body: 'Veil, Edge, Pulse, and Flux define the four measures of the Shadow Crown. Rank shapes them into dominion.',
    unlockCondition: 'Reach Shadow Crown Rank 1.',
  },
  {
    key: 'codex.obsidian_gate',
    title: 'Obsidian Gate Field Notes',
    body: 'The first gate watches for certainty. It yields only when your claim survives steel, echo, or mask.',
    unlockCondition: 'Enter the Obsidian Gate for the first time.',
  },
  {
    key: 'codex.gate_warden',
    title: 'Gate Warden Dossier',
    body: 'The Gate Warden is the living hinge of the first realm. Defeat it once and every following threshold feels smaller.',
    unlockCondition: 'Win your first Gate Warden encounter.',
  },
  {
    key: 'codex.golden_arena',
    title: 'Golden Arena Chronicle',
    body: 'Gold brightens every weakness. The arena rewards composure when the whole realm is watching.',
    unlockCondition: 'Enter the Golden Arena.',
  },
  {
    key: 'codex.silver_labyrinth',
    title: 'Silver Labyrinth Atlas',
    body: 'The Silver Labyrinth reflects intent more accurately than the face. Walk carefully and it briefly becomes honest.',
    unlockCondition: 'Enter the Silver Labyrinth.',
  },
  {
    key: 'codex.crimson_wilds',
    title: 'Crimson Wilds Bestiary',
    body: 'In the Wilds, force and fear travel together. Survive long enough and the realm starts hunting for you.',
    unlockCondition: 'Enter the Crimson Wilds.',
  },
  {
    key: 'codex.azure_spire',
    title: 'Azure Spire Blueprint',
    body: 'The Spire is less a tower than a conclusion: every lesson climbs there and refuses to stay separate.',
    unlockCondition: 'Enter the Azure Spire.',
  },
  {
    key: 'codex.deep_fade',
    title: 'Perk Record — Deep Fade',
    body: 'Deep Fade lets the Crown take the better of two first Veil readings, turning hesitation into prepared absence.',
    unlockCondition: 'Reach Shadow Crown Rank 5.',
  },
  {
    key: 'codex.echo_step',
    title: 'Perk Record — Echo Step',
    body: 'Echo Step erases one failed Veil moment per encounter, leaving only the path you should have taken.',
    unlockCondition: 'Reach Shadow Crown Rank 7.',
  },
  {
    key: 'codex.shadow_dominion',
    title: 'Perk Record — Shadow Dominion',
    body: 'Shadow Dominion stores victory inside the realm itself, to be spent later as an automatic Veil answer.',
    unlockCondition: 'Reach Shadow Crown Rank 9.',
  },
  {
    key: 'codex.ascension',
    title: 'Ascension Encounter Transcript',
    body: 'Ascension is the moment when the Crown no longer asks for permission and the Spire begins to answer back.',
    unlockCondition: 'Win the Azure Spire Ascension Encounter.',
  },
];

export const FACTION_CODEX_KEYS = {
  shadow_serpent: 'codex.shadow_serpent',
  scarlet_temple: 'codex.scarlet_temple',
  ophiuchus: 'codex.ophiuchus',
  black_sun: 'codex.black_sun',
  lazarus: 'codex.lazarus',
};

export function getRealmById(realmId) {
  return REALM_PROGRESSIONS.find((realm) => realm.id === realmId) || REALM_PROGRESSIONS[0];
}

export function getNextRealm(realmId) {
  const currentIndex = REALM_PROGRESSIONS.findIndex((realm) => realm.id === realmId);
  if (currentIndex < 0 || currentIndex >= REALM_PROGRESSIONS.length - 1) return null;
  return REALM_PROGRESSIONS[currentIndex + 1];
}

export function getTrialById(trialId) {
  for (const realm of REALM_PROGRESSIONS) {
    const match = realm.trials.find((trial) => trial.id === trialId);
    if (match) return { realm, trial: match };
  }
  return { realm: REALM_PROGRESSIONS[0], trial: REALM_PROGRESSIONS[0].trials[0] };
}

export function getDifficultyBand(realmNumber) {
  if (realmNumber >= 5) return 3;
  if (realmNumber >= 3) return 2;
  return 1;
}

export function difficultyFor(trialType, realmNumber) {
  const rules = TRIAL_TYPE_RULES[trialType] || TRIAL_TYPE_RULES.steel;
  return rules.baseDc + (getDifficultyBand(realmNumber) - 1) * 2;
}

export function damageProfileFor(trialType, realmNumber) {
  const rules = TRIAL_TYPE_RULES[trialType] || TRIAL_TYPE_RULES.steel;
  const band = getDifficultyBand(realmNumber);
  const damageBonus = band - 1;
  return {
    successDamage: rules.successDamage + Math.max(0, damageBonus - 1),
    failureDamage: rules.failureDamage + damageBonus,
  };
}

export function getShadowCrownRank(xp) {
  let low = 0;
  let high = SHADOW_CROWN_THRESHOLDS.length - 1;
  let rankIndex = 0;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (xp >= SHADOW_CROWN_THRESHOLDS[middle]) {
      rankIndex = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return Math.min(rankIndex + 1, 10);
}

export function getShadowCrownMilestone(rank) {
  return SHADOW_CROWN_MILESTONES[Math.max(0, Math.min(rank, 10) - 1)];
}

export function getShadowCrownProgress(xp) {
  const rank = getShadowCrownRank(xp);
  if (rank >= 10) {
    return { rank, currentXp: xp, nextRankXp: null, progress: 1 };
  }

  const currentXp = SHADOW_CROWN_THRESHOLDS[rank - 1];
  const nextRankXp = SHADOW_CROWN_THRESHOLDS[rank];
  const range = nextRankXp - currentXp;
  return {
    rank,
    currentXp,
    nextRankXp,
    progress: range > 0 ? Math.min((xp - currentXp) / range, 1) : 1,
  };
}

export function getTrialStatOptions(trialType) {
  return (TRIAL_TYPE_RULES[trialType] || TRIAL_TYPE_RULES.steel).statOptions;
}

export function getStatLabel(statKey) {
  return {
    veil: 'Veil',
    edge: 'Edge',
    pulse: 'Pulse',
    flux: 'Flux',
  }[statKey] || statKey;
}

export function getEncounterPlayerMaxHp(rank) {
  return ENCOUNTER_BALANCE.bonusHpRankThreshold <= rank
    ? ENCOUNTER_BALANCE.playerBaseHp + ENCOUNTER_BALANCE.bonusHpAmount
    : ENCOUNTER_BALANCE.playerBaseHp;
}

export function getEncounterWardenMaxHp(realmNumber, trialType) {
  return ENCOUNTER_BALANCE.wardenBaseHp
    + realmNumber * ENCOUNTER_BALANCE.wardenPerRealmHp
    + (trialType === 'void' ? ENCOUNTER_BALANCE.voidBonusHp : 0);
}
