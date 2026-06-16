export const products = [
  {
    sku: "HPS-001",
    name: "Hydra Privacy Quick Check",
    price: 0,
    currency: "USD",
    district: "Privacy Shield District",
    description: "Free entry-level privacy awareness checklist for individuals, creators, and small businesses.",
    type: "checklist"
  },
  {
    sku: "HPS-009",
    name: "Hydra Privacy Shield Mini Pack",
    price: 9,
    currency: "USD",
    district: "Privacy Shield District",
    description: "Privacy awareness and digital hygiene toolkit with account safety, device hygiene, MFA readiness, and 7-day cleanup plan.",
    type: "digital_pack"
  },
  {
    sku: "HDT-027",
    name: "Hydra Data Trail Bundle",
    price: 27,
    currency: "USD",
    district: "Privacy Shield District",
    description: "Digital footprint worksheet, data exposure review, password reset priority map, and readiness scorecard.",
    type: "digital_bundle"
  },
  {
    sku: "GAA-047",
    name: "Guardian Awareness Audit",
    price: 47,
    currency: "USD",
    district: "Guardian Division",
    description: "Educational awareness audit focused on readiness, privacy habits, digital hygiene, and safe improvement planning.",
    type: "audit"
  },
  {
    sku: "GRR-097",
    name: "Guardian Readiness Report",
    price: 97,
    currency: "USD",
    district: "Guardian Division",
    description: "Structured readiness report with scorecard, observations, recommendations, and 30-day improvement map.",
    type: "report"
  },
  {
    sku: "SBA-299",
    name: "Small Business Guardian Audit",
    price: 299,
    currency: "USD",
    district: "Delta Safety Authority",
    description: "Small-business privacy, digital hygiene, continuity, and awareness review for lawful defensive education only.",
    type: "service"
  }
];

export function listProducts() {
  return products;
}

export function findProductBySku(sku) {
  return products.find((product) => product.sku === sku);
}
