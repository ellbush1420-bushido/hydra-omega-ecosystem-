const endpoint = (path) => `${process.env.SUPABASE_URL}/rest/v1/${path}`;

function normalizeOfferPayload(payload = {}, { includeId = false } = {}) {
  const normalized = {
    tier: payload.tier || payload.offer_tier || 'Tier',
    title: payload.title || 'Untitled Offer',
    price: payload.price || payload.price_label || 'TBD',
    purpose: payload.purpose || payload.description || '',
    status: payload.status || 'active',
    access_tier: payload.accessTier || payload.access_tier || 'age-gated',
    sort_order: Number(payload.sortOrder ?? payload.sort_order ?? 100),
    metadata: payload.metadata || {},
    updated_at: new Date().toISOString(),
  };

  if (includeId && payload.id && !String(payload.id).startsWith('offer-')) {
    normalized.id = payload.id;
  }

  return normalized;
}

async function readOffers() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return [];
  try {
    const response = await fetch(endpoint('black_vault_offers?select=*&order=sort_order.asc,created_at.asc'), {
      headers: { apikey: process.env.SUPABASE_KEY },
    });
    if (!response.ok) return [];
    const rows = await response.json();
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function patchOffer(payload) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return null;
  const id = payload?.id;
  if (!id || String(id).startsWith('offer-')) return null;

  try {
    const response = await fetch(endpoint(`black_vault_offers?id=eq.${encodeURIComponent(id)}`), {
      method: 'PATCH',
      headers: {
        apikey: process.env.SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(normalizeOfferPayload(payload)),
    });
    if (!response.ok) return null;
    const rows = await response.json();
    return Array.isArray(rows) ? rows[0] : null;
  } catch {
    return null;
  }
}

async function insertOffer(payload) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return null;
  try {
    const response = await fetch(endpoint('black_vault_offers'), {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(normalizeOfferPayload(payload)),
    });
    if (!response.ok) return null;
    const rows = await response.json();
    return Array.isArray(rows) ? rows[0] : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ offers: await readOffers() });
  }

  if (req.method === 'PATCH') {
    const patched = await patchOffer(req.body || {});
    const offer = patched || await insertOffer(req.body || {});
    return res.status(200).json({ offer: offer || req.body || null, persisted: Boolean(offer) });
  }

  if (req.method === 'POST') {
    const offer = await insertOffer(req.body || {});
    return res.status(200).json({ offer: offer || req.body || null, persisted: Boolean(offer) });
  }

  res.setHeader('Allow', 'GET, PATCH, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
