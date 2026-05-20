const endpoint = (path) => `${process.env.SUPABASE_URL}/rest/v1/${path}`;

function asArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.runs)) return payload.runs;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function normalizeWarpRun(run, index) {
  const rawStatus = String(run.status || run.state || run.phase || 'Queued');
  const progress = Number(run.progress ?? run.percent_complete ?? run.percentComplete ?? run.completion ?? 0);
  return {
    run: run.run || run.id || run.run_id || run.thread_id || `Warp-Sync-${index + 1}`,
    task: run.task || run.title || run.name || run.goal || 'Warp execution run',
    status: rawStatus,
    progress: Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0,
    external_ref: run.external_ref || run.externalRef || run.id || run.run_id || null,
    event_source: 'warp-sync',
    metadata: {
      sourcePayload: run,
      syncedAt: new Date().toISOString(),
    },
    updated_at: new Date().toISOString(),
  };
}

async function fetchWarpRuns() {
  const runsEndpoint = process.env.WARP_RUNS_ENDPOINT;
  const warpApiKey = process.env.WARP_API_KEY;
  const warpBearerToken = process.env.WARP_BEARER_TOKEN;

  if (!runsEndpoint) {
    return { runs: [], source: 'not-configured', error: 'WARP_RUNS_ENDPOINT is not configured.' };
  }

  const headers = { Accept: 'application/json' };
  if (warpBearerToken) headers.Authorization = `Bearer ${warpBearerToken}`;
  if (warpApiKey) headers['x-api-key'] = warpApiKey;

  try {
    const response = await fetch(runsEndpoint, { headers });
    const payload = await response.json();
    if (!response.ok) {
      return { runs: [], source: 'warp-endpoint', error: payload?.error || `Warp endpoint returned ${response.status}.` };
    }
    return { runs: asArray(payload).map(normalizeWarpRun), source: 'warp-endpoint', error: null };
  } catch (error) {
    return { runs: [], source: 'warp-endpoint', error: error?.message || 'Warp sync request failed.' };
  }
}

async function persistRuns(runs) {
  if (!runs.length || !process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return [];
  try {
    const response = await fetch(endpoint('black_vault_warp_runs'), {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(runs),
    });
    if (!response.ok) return [];
    const rows = await response.json();
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sync = await fetchWarpRuns();
  const persistedRows = await persistRuns(sync.runs);

  return res.status(200).json({
    runs: persistedRows.length ? persistedRows : sync.runs,
    persisted: Boolean(persistedRows.length),
    source: sync.source,
    error: sync.error,
  });
}
