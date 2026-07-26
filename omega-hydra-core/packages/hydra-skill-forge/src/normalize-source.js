export const SAFE_SCOPE = [
  "lawful defensive education",
  "privacy awareness",
  "digital hygiene",
  "readiness training",
  "business automation",
  "community service",
  "learning support",
  "product packaging"
];

const TYPE_MAP = {
  pdf: ["pdf", ".pdf"],
  course: ["course", "awr", "teex", "training", "class", "curriculum"],
  manual: ["manual", "guide", "handbook"],
  framework: ["framework", "model", "system", "method"],
  book: ["book", "chapter", "text"],
  credential: ["credential", "certificate", "certification", "license"]
};

export function detectSourceType(source = {}) {
  if (source.type) return source.type;
  const title = `${source.title || ""} ${source.filename || ""}`.toLowerCase();
  for (const [type, keywords] of Object.entries(TYPE_MAP)) {
    if (keywords.some((k) => title.includes(k))) return type;
  }
  return "text_source";
}

export function normalizeText(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

export function normalizeSource(source = {}) {
  const now = new Date().toISOString();
  const rawId = source.sourceId || source.id || `src_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  return {
    sourceId: rawId,
    title: normalizeText(source.title || "Untitled Source"),
    sourceType: detectSourceType(source),
    provenance: {
      origin: source.provenance?.origin || source.origin || "user_provided",
      author: source.provenance?.author || source.author || "Unknown",
      institution: source.provenance?.institution || source.institution || "",
      datePublished: source.provenance?.datePublished || source.datePublished || "",
      accessedAt: source.provenance?.accessedAt || now,
      url: source.provenance?.url || source.url || "",
      licenseType: source.provenance?.licenseType || source.licenseType || "restricted"
    },
    permittedUse: source.permittedUse || SAFE_SCOPE,
    claimStatus: source.claimStatus || "inferred",
    text: normalizeText(source.text || ""),
    description: normalizeText(source.description || ""),
    disclaimer: source.disclaimer || "Educational use only. Not professional, medical, or legal advice.",
    tags: Array.isArray(source.tags) ? source.tags : []
  };
}
