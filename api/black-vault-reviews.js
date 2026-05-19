const endpoint = (path) => `${process.env.SUPABASE_URL}/rest/v1/${path}`;

async function readReviews() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return [];
  try {
    const response = await fetch(endpoint('black_vault_reviews?select=*&order=updated_at.desc,created_at.desc&limit=100'), {
      headers: { apikey: process.env.SUPABASE_KEY },
    });
    if (!response.ok) return [];
    const rows = await response.json();
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function insertReview(payload) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return null;
  try {
    const normalized = {
      title: payload.title || 'Untitled Review Item',
      type: payload.type || 'Vault Review',
      status: payload.status || 'Needs Review',
      risk: payload.risk || 'Medium',
      owner: payload.owner || 'Den Mother',
      notes: payload.notes || null,
      metadata: payload.metadata || {},
      updated_at: new Date().toISOString(),
    };

    const response = await fetch(endpoint('black_vault_reviews'), {
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

async function patchReview(payload) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return null;
  if (!payload?.id) return null;

  try {
    const fields = {
      status: payload.status,
      risk: payload.risk,
      notes: payload.notes,
      updated_at: new Date().toISOString(),
    };

    Object.keys(fields).forEach((key) => fields[key] === undefined && delete fields[key]);

    const response = await fetch(endpoint(`black_vault_reviews?id=eq.${encodeURIComponent(payload.id)}`), {
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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ reviews: await readReviews() });
  }

  if (req.method === 'POST') {
    const review = await insertReview(req.body || {});
    return res.status(200).json({ review: review || req.body || null, persisted: Boolean(review) });
  }

  if (req.method === 'PATCH') {
    const review = await patchReview(req.body || {});
    return res.status(200).json({ review: review || req.body || null, persisted: Boolean(review) });
  }

  res.setHeader('Allow', 'GET, POST, PATCH');
  return res.status(405).json({ error: 'Method not allowed' });
}
