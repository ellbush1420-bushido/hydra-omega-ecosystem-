const endpoint = (path) => `${process.env.SUPABASE_URL}/rest/v1/${path}`;

async function readMatrix() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return [];
  try {
    const response = await fetch(endpoint('black_vault_affiliate_matrix?select=*&order=created_at.desc&limit=100'), {
      headers: { apikey: process.env.SUPABASE_KEY },
    });
    if (!response.ok) return [];
    const rows = await response.json();
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function insertMatrixRow(payload) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return null;
  try {
    const normalized = {
      lane: payload.lane || 'Tracker Route',
      source: payload.source || 'unknown',
      cta: payload.cta || 'Tracked Link',
      ctr: payload.ctr || null,
      epc: payload.epc || null,
      decision: payload.decision || 'Monitor',
      tracking_url: payload.trackingUrl || payload.tracking_url || null,
      metadata: payload.metadata || {},
    };

    const response = await fetch(endpoint('black_vault_affiliate_matrix'), {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(normalized),
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
    return res.status(200).json({ matrix: await readMatrix() });
  }

  if (req.method === 'POST') {
    const row = await insertMatrixRow(req.body || {});
    return res.status(200).json({ row: row || req.body || null, persisted: Boolean(row) });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
