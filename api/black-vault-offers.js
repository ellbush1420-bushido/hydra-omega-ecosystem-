const endpoint = (path) => `${process.env.SUPABASE_URL}/rest/v1/${path}`;

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
  const { id, ...fields } = payload || {};
  if (!id) return null;

  try {
    const response = await fetch(endpoint(`black_vault_offers?id=eq.${encodeURIComponent(id)}`), {
      method: 'PATCH',
      headers: {
        apikey: process.env.SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(fields),
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
      body: JSON.stringify(payload),
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
    const offer = await patchOffer(req.body || {});
    return res.status(200).json({ offer: offer || req.body || null, persisted: Boolean(offer) });
  }

  if (req.method === 'POST') {
    const offer = await insertOffer(req.body || {});
    return res.status(200).json({ offer: offer || req.body || null, persisted: Boolean(offer) });
  }

  res.setHeader('Allow', 'GET, PATCH, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
