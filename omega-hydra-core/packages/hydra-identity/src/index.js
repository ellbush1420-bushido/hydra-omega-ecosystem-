const archetypes = [
  "Sentinel",
  "Warden",
  "Mentor",
  "Builder",
  "Archivist",
  "Pathfinder",
  "Diplomat",
  "Steward",
  "Sovereign Guardian"
];

const factions = [
  "Shadow Crown",
  "Scarlet Crown",
  "Serpent Crown",
  "Black Sun Crown",
  "Ocean Crown",
  "Iron Lotus",
  "Delta Safety Authority",
  "CERT College",
  "Zeta Marketplace"
];

const districts = [
  "Omega Spire",
  "Delta District",
  "Iron Lotus Academy",
  "Zeta Marketplace",
  "CERT Impact District",
  "Hydra Eyes Observatory"
];

function pick(list, seed = Math.random()) {
  return list[Math.floor(seed * list.length) % list.length];
}

function rollAxis() {
  return Math.floor(Math.random() * 9) + 1;
}

export function generateIdentity(input = {}) {
  const nameSeed = input.name || "New Operator";
  const mandala = {
    mind: rollAxis(),
    will: rollAxis(),
    order: rollAxis(),
    adaptation: rollAxis(),
    creation: rollAxis(),
    connection: rollAxis(),
    risk: rollAxis(),
    service: rollAxis(),
    sovereignty: rollAxis()
  };

  const archetype = pick(archetypes);
  const faction = pick(factions);
  const startingDistrict = pick(districts);

  return {
    userName: nameSeed,
    hydraName: `${faction.replace(" Crown", "")} ${archetype}`,
    archetype,
    faction,
    startingDistrict,
    rank: "Initiate",
    mandala,
    firstRoute: "Gate I — Drift / Awareness",
    safetyScope: "lawful defensive education, privacy awareness, digital hygiene, reflection, and community service"
  };
}

export { archetypes, factions, districts };
