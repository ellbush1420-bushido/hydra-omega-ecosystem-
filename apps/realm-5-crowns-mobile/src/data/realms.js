import scenarios from './scenarios.json';

const REALM_DEFINITIONS = [
  {
    id: 1,
    key: 'shadowArena',
    title: 'Obsidian Gate',
    shortName: 'Shadow Arena',
    emoji: '🜂',
    color: '#7c3aed',
    description: 'A veil-bound combat realm where shadow discipline sharpens every strike.',
    trialBaseId: 100,
  },
  {
    id: 2,
    key: 'kingdomRaid',
    title: 'Golden Arena',
    shortName: 'Kingdom Raid',
    emoji: '🜁',
    color: '#f59e0b',
    description: 'A siege realm of command, pressure, and decisive faction momentum.',
    trialBaseId: 200,
  },
  {
    id: 3,
    key: 'hydraLabyrinth',
    title: 'Hydra Labyrinth',
    shortName: 'Labyrinth Eye',
    emoji: '🜃',
    color: '#059669',
    description: 'A deep gate of commerce, prophecy, and awakened Hydra trials.',
    trialBaseId: 300,
  },
];

export const realms = REALM_DEFINITIONS.map((realm) => ({
  ...realm,
  trials: (scenarios[realm.key] || []).map((scenario, index) => ({
    ...scenario,
    realmId: realm.id,
    realmKey: realm.key,
    trialId: realm.trialBaseId + index + 1,
  })),
}));

export function getRealmById(realmId) {
  return realms.find((realm) => realm.id === realmId) || null;
}

export function getTrialById(trialId) {
  for (const realm of realms) {
    const trial = realm.trials.find((entry) => entry.trialId === trialId);
    if (trial) return trial;
  }
  return null;
}
