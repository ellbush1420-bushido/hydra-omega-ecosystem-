const endpoint = (path) => `${process.env.SUPABASE_URL}/rest/v1/${path}`;

async function readSnapshots() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return [];
  try {
    const response = await fetch(endpoint('black_vault_metric_snapshots?select=*&order=created_at.desc&limit=20'), {
      headers: { apikey: process.env.SUPABASE_KEY },
    });
    if (!response.ok) return [];
    const rows = await response.json();
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function insertSnapshot(payload = {}) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return null;
  try {
    const normalized = {
      source: payload.source || 'black-vault-console',
      metric_count: Array.isArray(payload.metrics) ? payload.metrics.length : 0,
      metrics: Array.isArray(payload.metrics) ? payload.metrics : [],
      offers_count: Number(payload.offersCount || payload.offers_count || 0),
      matrix_count: Number(payload.matrixCount || payload.matrix_count || 0),
      runs_count: Number(payload.runsCount || payload.runs_count || 0),
      reviews_count: Number(payload.reviewsCount || payload.reviews_count || 0),
      metadata: payload.metadata || {},
    };

    const response = await fetch(endpoint('black_vault_metric_snapshots'), {
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
    return res.status(200).json({ snapshots: await readSnapshots() });
  }

  if (req.method === 'POST') {
    const snapshot = await insertSnapshot(req.body || {});
    return res.status(200).json({ snapshot: snapshot || req.body || null, persisted: Boolean(snapshot) });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
