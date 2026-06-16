export const districts = [
  {
    id: "omega-spire",
    name: "Omega Spire",
    function: "central command, founder governance, federation alignment",
    status: "active",
    signal: "sovereignty",
    metrics: { citizens: 1, missions: 1, products: 0, readiness: 7 }
  },
  {
    id: "delta-district",
    name: "Delta District",
    function: "lawful defensive education, privacy awareness, digital hygiene, readiness review",
    status: "active",
    signal: "protection",
    metrics: { citizens: 1, missions: 2, products: 2, readiness: 8 }
  },
  {
    id: "iron-lotus-academy",
    name: "Iron Lotus Academy",
    function: "guardian training, instructor development, scenario simulation, ethical restraint",
    status: "standby",
    signal: "discipline",
    metrics: { citizens: 0, missions: 1, products: 1, readiness: 6 }
  },
  {
    id: "zeta-marketplace",
    name: "Zeta Marketplace",
    function: "product catalog, checkout routing, delivery, fulfillment tracking",
    status: "active",
    signal: "commerce",
    metrics: { citizens: 0, missions: 0, products: 6, readiness: 7 }
  },
  {
    id: "cert-impact-district",
    name: "CERT Impact District",
    function: "community service, champion causes, nonprofit support, volunteer missions",
    status: "standby",
    signal: "service",
    metrics: { citizens: 0, missions: 1, products: 0, readiness: 5 }
  },
  {
    id: "hydra-eyes-observatory",
    name: "Hydra Eyes Observatory",
    function: "telemetry, event logs, progress trends, city pulse",
    status: "active",
    signal: "awareness",
    metrics: { citizens: 0, missions: 0, products: 0, readiness: 8 }
  }
];

export function listDistricts() {
  return districts;
}

export function getCityPulse() {
  const totalReadiness = districts.reduce((sum, district) => sum + district.metrics.readiness, 0);
  const averageReadiness = Number((totalReadiness / districts.length).toFixed(2));
  const activeDistricts = districts.filter((district) => district.status === "active").length;

  return {
    city: "Omega Capital",
    activeDistricts,
    totalDistricts: districts.length,
    averageReadiness,
    state: averageReadiness >= 7 ? "Focused" : "Adaptive",
    safetyScope: "public-safe operating city visualization"
  };
}
