export const crowns = [
  {
    id: 1,
    name: 'Shadow Crown',
    color: '#4a4a4a',
    description: 'Stealth, intuition, unseen movement, psychological terrain.',
    realm: 'Obsidian Gate',
    trial: 'Steel',
  },
  {
    id: 2,
    name: 'Sun Crown',
    color: '#e6b800',
    description: 'Force, clarity, radiant dominance, direct action.',
    realm: 'Aurelian Rise',
    trial: 'Flame',
  },
  {
    id: 3,
    name: 'Moon Crown',
    color: '#9bb7ff',
    description: 'Perception, illusion, timing, emotional resonance.',
    realm: 'Silver Veil',
    trial: 'Echo',
  },
  {
    id: 4,
    name: 'Dragon Crown',
    color: '#b30000',
    description: 'Power, transformation, escalation, overwhelming presence.',
    realm: 'Ember Spine',
    trial: 'Scale',
  },
  {
    id: 5,
    name: 'Lotus Crown',
    color: '#8cffda',
    description: 'Stillness, insight, internal mastery, metaphysical advantage.',
    realm: 'Jade Stillwater',
    trial: 'Bloom',
  },
];

export const DEFAULT_CROWN = crowns[0] || {
  id: 0,
  name: 'Unchosen Crown',
  color: '#6b7280',
  description: 'Select a crown to begin your path.',
  realm: 'Awaiting Realm',
  trial: 'Awaiting Trial',
};
