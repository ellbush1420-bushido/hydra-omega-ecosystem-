const endpoint = (path) => `${process.env.SUPABASE_URL}/rest/v1/${path}`;

async function recordHydraEvent(payload) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return null;
  try {
    const response = await fetch(endpoint('hydra_events'), {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        type: 'black_vault_warp_run_event',
        value: Number(payload.progress || 0),
        metadata: {
          run: payload.run,
          task: payload.task,
          status: payload.status,
          external_ref: payload.externalRef || payload.external_ref || null,
          event_source: payload.eventSource || payload.event_source || 'warp',
          details: payload.metadata || {},
        },
      }),
    });
    if (!response.ok) return null;
    const rows = await response.json();
    return Array.isArray(rows) ? rows[0] : null;
  } catch {
    return null;
  }
}

async function persistRun(payload) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return null;
  try {
    const normalized = {
      run: payload.run || payload.run_id || `Warp-VA-${Date.now()}`,
      task: payload.task || 'External run event',
      status: payload.status || 'Running',
      progress: Number(payload.progress || 0),
      external_ref: payload.externalRef || payload.external_ref || null,
      event_source: payload.eventSource || payload.event_source || 'warp',
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body || {};
  const [event, run] = await Promise.all([
    recordHydraEvent(payload),
    persistRun(payload),
  ]);

  return res.status(200).json({
    accepted: true,
    persisted: Boolean(event || run),
    event,
    run,
  });
}
