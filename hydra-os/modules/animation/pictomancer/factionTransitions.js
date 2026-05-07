// hydra-os/modules/animation/pictomancer/factionTransitions.js

export const RealmFactionTransitions = {
  ShadowMonastery: {
    animation: "veil-transition",
    theme: "shadow-purple"
  },

  ScarletTemple: {
    animation: "transformation-sequence",
    theme: "scarlet-gold"
  },

  CultOfOphiuchus: {
    animation: "mask-cycle",
    theme: "neon-green"
  },

  BlackSunOrder: {
    animation: "face-swap",
    theme: "obsidian-gold"
  }
};

export function resolveFactionTransition(faction) {
  return RealmFactionTransitions[faction] || RealmFactionTransitions.ShadowMonastery;
}
