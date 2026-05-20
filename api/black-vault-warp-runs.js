const endpoint = (path) => `${process.env.SUPABASE_URL}/rest/v1/${path}`;

async function readRuns() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return [];
  try {
    const response = await fetch(endpoint('black_vault_warp_runs?select=*&order=updated_at.desc&limit=50'), {
      headers: { apikey: process.env.SUPABASE_KEY },
    });
    if (!response.ok) return [];
    const rows = await response.json();
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function insertRun(payload) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return null;
  try {
    const normalized = {
      run: payload.run || payload.run_id || `Warp-VA-${Date.now()}`,
      task: payload.task || 'Unlabeled run',
      status: payload.status || 'Queued',
      progress: Number(payload.progress || 0),
      external_ref: payload.externalRef || payload.external_ref || null,
      event_source: payload.eventSource || payload.event_source || 'manual',
      metadata: payload.metadata || {},
      updated_at: new Date().toISOString(),
    };

    const response = await fetch(endpoint('black_vault_warp_runs'), {
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

async function patchRun(payload) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return null;
  const id = payload.id;
  if (!id) return null;

  try {
    const fields = {
      status: payload.status,
      progress: Number(payload.progress ?? 0),
      metadata: payload.metadata || {},
      updated_at: new Date().toISOString(),
    };

    const response = await fetch(endpoint(`black_vault_warp_runs?id=eq.${encodeURIComponent(id)}`), {
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
    return res.status(200).json({ runs: await readRuns() });
  }

  if (req.method === 'POST') {
    const run = await insertRun(req.body || {});
    return res.status(200).json({ run: run || req.body || null, persisted: Boolean(run) });
  }

  if (req.method === 'PATCH') {
    const run = await patchRun(req.body || {});
    return res.status(200).json({ run: run || req.body || null, persisted: Boolean(run) });
  }

  res.setHeader('Allow', 'GET, POST, PATCH');
  return res.status(405).json({ error: 'Method not allowed' });
}
