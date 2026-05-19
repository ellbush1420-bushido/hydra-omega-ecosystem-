import {
  vaultMetrics,
  offerLadder,
  affiliateMatrix,
  warpRuns,
} from '../data/blackVaultConsole';

const STORAGE_KEYS = {
  offers: 'hydra:black-vault:offers',
  matrix: 'hydra:black-vault:matrix',
  reviews: 'hydra:black-vault:reviews',
};

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail in private browsing or restricted environments.
  }
};

const normalizeOffers = (remoteOffers) => {
  const cachedOffers = readStorage(STORAGE_KEYS.offers, []);
  const baseline = Array.isArray(remoteOffers) && remoteOffers.length ? remoteOffers : offerLadder;
  const cachedById = new Map(cachedOffers.map((offer) => [offer.id, offer]));
  return baseline.map((offer, index) => {
    const id = offer.id || `offer-${index + 1}`;
    return {
      ...offer,
      id,
      ...cachedById.get(id),
    };
  });
};

const normalizeMatrix = (remoteRows) => {
  const cachedRows = readStorage(STORAGE_KEYS.matrix, []);
  const baseline = Array.isArray(remoteRows) && remoteRows.length ? remoteRows : affiliateMatrix;
  const merged = [...cachedRows, ...baseline];
  const seen = new Set();

  return merged.filter((row) => {
    const key = row.id || `${row.lane}:${row.source}:${row.cta}:${row.trackingUrl || row.tracking_url || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const normalizeRuns = (remoteRuns) => (
  Array.isArray(remoteRuns) && remoteRuns.length ? remoteRuns : warpRuns
);

export async function fetchBlackVaultDashboard() {
  try {
    const response = await fetch('/api/black-vault-dashboard');
    const payload = await safeJson(response);
    if (!response.ok || !payload) throw new Error('Dashboard endpoint unavailable');

    return {
      metrics: Array.isArray(payload.metrics) && payload.metrics.length ? payload.metrics : vaultMetrics,
      offers: normalizeOffers(payload.offers),
      matrix: normalizeMatrix(payload.matrix),
      runs: normalizeRuns(payload.runs),
      reviews: Array.isArray(payload.reviews) ? payload.reviews : [],
      source: payload.source || 'api',
    };
  } catch {
    return {
      metrics: vaultMetrics,
      offers: normalizeOffers([]),
      matrix: normalizeMatrix([]),
      runs: warpRuns,
      reviews: readStorage(STORAGE_KEYS.reviews, []),
      source: 'local-fallback',
    };
  }
}

export async function saveBlackVaultOffer(offer) {
  const currentOffers = normalizeOffers([]);
  const nextOffers = currentOffers.map((item) => item.id === offer.id ? { ...item, ...offer } : item);
  writeStorage(STORAGE_KEYS.offers, nextOffers);

  try {
    const response = await fetch('/api/black-vault-offers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer),
    });
    const payload = await safeJson(response);
    if (!response.ok) throw new Error(payload?.error || 'Offer update failed');
    return { offer: payload?.offer || offer, persisted: payload?.persisted ?? false };
  } catch {
    return { offer, persisted: false };
  }
}

export async function submitAffiliateMatrixRoute(route) {
  const currentRows = readStorage(STORAGE_KEYS.matrix, []);
  const row = {
    id: route.id || `route-${Date.now()}`,
    lane: route.lane,
    source: route.source,
    cta: route.cta,
    ctr: route.ctr || '—',
    epc: route.epc || '—',
    decision: route.decision || 'Monitor',
    trackingUrl: route.trackingUrl,
    metadata: route.metadata || {},
    createdAt: route.createdAt || new Date().toISOString(),
  };

  writeStorage(STORAGE_KEYS.matrix, [row, ...currentRows].slice(0, 50));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hydra:black-vault:matrix-updated', { detail: row }));
  }

  try {
    const response = await fetch('/api/black-vault-affiliate-matrix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });
    const payload = await safeJson(response);
    if (!response.ok) throw new Error(payload?.error || 'Matrix sync failed');
    return { row: payload?.row || row, persisted: payload?.persisted ?? false };
  } catch {
    return { row, persisted: false };
  }
}

export async function fetchBlackVaultReviews() {
  try {
    const response = await fetch('/api/black-vault-reviews');
    const payload = await safeJson(response);
    if (!response.ok || !payload) throw new Error('Reviews endpoint unavailable');
    const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
    writeStorage(STORAGE_KEYS.reviews, reviews);
    return reviews;
  } catch {
    return readStorage(STORAGE_KEYS.reviews, []);
  }
}

export async function updateBlackVaultReviewStatus(reviewId, status) {
  const currentReviews = readStorage(STORAGE_KEYS.reviews, []);
  const nextReviews = currentReviews.map((review) => review.id === reviewId ? { ...review, status } : review);
  writeStorage(STORAGE_KEYS.reviews, nextReviews);

  try {
    const response = await fetch('/api/black-vault-reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: reviewId, status }),
    });
    const payload = await safeJson(response);
    if (!response.ok) throw new Error(payload?.error || 'Review update failed');
    return { review: payload?.review || nextReviews.find((review) => review.id === reviewId), persisted: payload?.persisted ?? false };
  } catch {
    return { review: nextReviews.find((review) => review.id === reviewId), persisted: false };
  }
}
