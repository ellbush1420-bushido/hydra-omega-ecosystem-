const SUPPORTED = new Set(["x", "linkedin", "instagram", "tiktok", "reddit", "hackernews", "web"]);

const POLICY = {
  publicOnly: true,
  respectAuthentication: true,
  respectAccessControls: true,
  requireOfficialApiWhenNeeded: true,
  noLoginBypass: true,
  noPaywallBypass: true,
  noCaptchaBypass: true,
  noCredentialReuse: true
};

export function classifySocialUrl(url = "") {
  const value = String(url).toLowerCase();
  if (value.includes("x.com/") || value.includes("twitter.com/")) return "x";
  if (value.includes("linkedin.com/")) return "linkedin";
  if (value.includes("instagram.com/")) return "instagram";
  if (value.includes("tiktok.com/")) return "tiktok";
  if (value.includes("reddit.com/")) return "reddit";
  if (value.includes("news.ycombinator.com/")) return "hackernews";
  return "web";
}

export function normalizeSourceRequest(input = {}) {
  const platform = input.platform || classifySocialUrl(input.url);
  if (!SUPPORTED.has(platform)) throw new Error(`Unsupported source platform: ${platform}`);
  return {
    id: input.id || `src_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    platform,
    url: input.url || null,
    query: input.query || null,
    mode: input.mode || "public",
    suppliedSnapshot: input.suppliedSnapshot || null,
    requestedAt: new Date().toISOString()
  };
}

export function chooseSourceAdapter(request, capabilities = {}) {
  if (request.suppliedSnapshot) return { adapter: "user-supplied-snapshot", reason: "User supplied the content directly." };

  const officialKey = `${request.platform}Api`;
  if (capabilities[officialKey]) return { adapter: "official-api", reason: `Authorized ${request.platform} API available.` };

  if (request.platform === "reddit" && capabilities.publicWeb) return { adapter: "public-web", reason: "Public page retrieval allowed." };
  if (request.platform === "hackernews" && capabilities.publicWeb) return { adapter: "public-web", reason: "Public page retrieval allowed." };
  if (request.platform === "web" && capabilities.publicWeb) return { adapter: "public-web", reason: "Public web retrieval allowed." };
  if (capabilities.authorizedArchive) return { adapter: "authorized-archive", reason: "Use an archive only where access and terms permit it." };

  return {
    adapter: "needs-authorization",
    reason: "No compliant public or authorized adapter is available. Hydra will not bypass login, paywall, CAPTCHA, or access controls."
  };
}

export function extractSignals(document = {}) {
  const text = String(document.text || document.content || "").replace(/\s+/g, " ").trim();
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const tags = ["agent", "ai", "model", "workflow", "security", "privacy", "automation", "product", "developer", "software"]
    .filter((tag) => text.toLowerCase().includes(tag));
  return {
    title: document.title || "Untitled source",
    summary: sentences.slice(0, 3).join(" ").slice(0, 800),
    keySignals: tags,
    length: text.length,
    sourceUrl: document.url || null
  };
}

export async function retrievePublicSource(input = {}, capabilities = {}, adapters = {}) {
  const request = normalizeSourceRequest(input);
  const route = chooseSourceAdapter(request, capabilities);

  if (route.adapter === "needs-authorization") {
    return { status: "blocked", request, route, policy: POLICY };
  }

  if (route.adapter === "user-supplied-snapshot") {
    const document = { title: input.title, text: request.suppliedSnapshot, url: request.url };
    return { status: "complete", request, route, document, signals: extractSignals(document), policy: POLICY };
  }

  const adapter = adapters[route.adapter];
  if (typeof adapter !== "function") {
    return { status: "adapter-required", request, route, policy: POLICY };
  }

  const document = await adapter(request);
  return { status: "complete", request, route, document, signals: extractSignals(document), policy: POLICY };
}

export { POLICY as SOURCE_INTEL_POLICY };
