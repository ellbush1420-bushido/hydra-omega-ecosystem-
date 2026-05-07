export const TRIAL_TYPES = {
  Steel: {
    baseDc: 11,
    damageProfile: 'High damage · steady pressure',
    statFocus: ['edge', 'pulse'],
  },
  Echoes: {
    baseDc: 12,
    damageProfile: 'Low damage · Veil and Pulse strain',
    statFocus: ['pulse', 'veil'],
  },
  Masks: {
    baseDc: 12,
    damageProfile: 'Low damage · Veil and Flux spikes',
    statFocus: ['veil', 'flux'],
  },
  Chains: {
    baseDc: 11,
    damageProfile: 'Control effects · Edge and Pulse pressure',
    statFocus: ['edge', 'pulse'],
  },
  Void: {
    baseDc: 13,
    damageProfile: 'Mixed damage · penalties and pressure',
    statFocus: ['veil', 'pulse', 'flux'],
  },
};

export function getRealmModifier(realmTier) {
  if (realmTier >= 5) return { dc: 4, damage: 2 };
  if (realmTier >= 3) return { dc: 2, damage: 1 };
  return { dc: 0, damage: 0 };
}

export function difficultyFor(trialType, realmTier) {
  const baseDc = TRIAL_TYPES[trialType]?.baseDc ?? 11;
  return baseDc + getRealmModifier(realmTier).dc;
}

export function describeTrial(trialType, realmTier) {
  const trial = TRIAL_TYPES[trialType] || TRIAL_TYPES.Steel;
  const modifier = getRealmModifier(realmTier);

  return {
    dc: difficultyFor(trialType, realmTier),
    damageBonus: modifier.damage,
    damageProfile: trial.damageProfile,
    statFocus: trial.statFocus,
  };
}
