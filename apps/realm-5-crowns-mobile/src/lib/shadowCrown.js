export const SHADOW_CROWN_THRESHOLDS = [0, 50, 120, 220, 350, 500, 700, 950, 1250, 1600];

const BASE_STATS = {
  veil: 8,
  edge: 6,
  pulse: 7,
  flux: 4,
};

const RANK_UPDATES = {
  2: { stats: { veil: 1 } },
  3: { stats: { edge: 1 } },
  4: { stats: { pulse: 1 } },
  5: { perk: 'Deep Fade — Advantage on your first Veil roll each encounter.' },
  6: { stats: { veil: 1, flux: 1 } },
  7: { perk: 'Echo Step — Once per encounter, ignore one failed Veil test.' },
  8: { stats: { edge: 1, pulse: 1 } },
  9: { perk: 'Shadow Dominion — On victory, auto-win one future Veil contest in the same Realm.' },
  10: {
    stats: { veil: 1, edge: 1, pulse: 1, flux: 1 },
    perk: 'Ascendant Presence — Cosmetic aura and a unique intro line.',
  },
};

export function getShadowCrownRank(xp) {
  let rank = 1;
  for (let index = 0; index < SHADOW_CROWN_THRESHOLDS.length; index += 1) {
    if (xp >= SHADOW_CROWN_THRESHOLDS[index]) {
      rank = index + 1;
    } else {
      break;
    }
  }
  return Math.min(rank, 10);
}

export function xpToNextShadowRank(xp) {
  const rank = getShadowCrownRank(xp);
  if (rank >= 10) return 0;
  return SHADOW_CROWN_THRESHOLDS[rank] - xp;
}

export function getShadowCrownState(rank) {
  const stats = { ...BASE_STATS };
  const perks = [];

  for (let currentRank = 2; currentRank <= Math.min(rank, 10); currentRank += 1) {
    const update = RANK_UPDATES[currentRank];
    if (!update) continue;

    Object.entries(update.stats || {}).forEach(([key, amount]) => {
      stats[key] += amount;
    });

    if (update.perk) {
      perks.push({
        rank: currentRank,
        description: update.perk,
      });
    }
  }

  return {
    rank,
    stats,
    perks,
    nextThreshold: rank >= 10 ? null : SHADOW_CROWN_THRESHOLDS[rank],
  };
}
