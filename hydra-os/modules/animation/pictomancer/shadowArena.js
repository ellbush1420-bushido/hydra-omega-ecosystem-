// hydra-os/modules/animation/pictomancer/shadowArena.js

export const ShadowArenaCinematics = {
  championEntrance: {
    id: "arena-champion-entrance",
    faction: "Shadow Monastery",
    matrix: "Arena-7",
    animation: "veil-transition"
  },

  kingdomRaidIntro: {
    id: "kingdom-raid-intro",
    faction: "Realm of 5 Crowns",
    matrix: "Raid-Prime",
    animation: "transformation-sequence"
  },

  tigerAscension: {
    id: "tiger-ascension",
    faction: "White Tiger",
    matrix: "Promotion-Hall",
    animation: "mask-cycle"
  }
};

export function getShadowArenaIntro(type) {
  return ShadowArenaCinematics[type] || null;
}
