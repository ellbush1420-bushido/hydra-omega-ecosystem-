const fallback = {
  metrics: [
    { label: 'Active Offers', value: '18', tone: 'violet', delta: '+3 this week' },
    { label: 'Live Warp Runs', value: '11', tone: 'emerald', delta: '7 running' },
    { label: 'Age-Gated Pages', value: '42', tone: 'crimson', delta: '100% routed' },
    { label: 'Affiliate EPC', value: '$2.74', tone: 'gold', delta: '+12.6%' },
    { label: 'Vault CTR', value: '6.9%', tone: 'emerald', delta: '+0.8 pts' },
    { label: 'Prompt Packs', value: '9', tone: 'violet', delta: '3 in review' },
    { label: 'SEO Clusters', value: '27', tone: 'gold', delta: '4 refreshed' },
    { label: 'Review Alerts', value: '2', tone: 'crimson', delta: 'Needs action' },
  ],
  offers: [],
  matrix: [],
  runs: [],
  reviews: [],
};

const endpoint = (path) => `${process.env.SUPABASE_URL}/rest/v1/${path}`;

async function fetchTable(path) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return [];
  try {
    const response = await fetch(endpoint(path), {
      headers: { apikey: process.env.SUPABASE_KEY },
    });
    if (!response.ok) return [];
    const rows = await response.json();
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

function countBy(rows, predicate) {
  return rows.filter(predicate).length;
}

function currency(value) {
  const amount = Number(value || 0);
  return `$${amount.toFixed(2)}`;
}

function percent(value) {
  const amount = Number(value || 0);
  return `${amount.toFixed(1)}%`;
}

function deriveMetrics({ offers, matrix, runs, reviews }) {
  if (!offers.length && !matrix.length && !runs.length && !reviews.length) return fallback.metrics;

  const activeOffers = countBy(offers, (offer) => offer.status !== 'archived');
  const runningRuns = countBy(runs, (run) => ['running', 'queued', 'review'].includes(String(run.status || '').toLowerCase()));
  const gatedPages = countBy(offers, (offer) => offer.access_tier === 'age-gated' || offer.accessTier === 'age-gated');
  const reviewAlerts = countBy(reviews, (review) => ['pending', 'needs-review', 'blocked'].includes(String(review.status || '').toLowerCase()));

  const measurableRows = matrix.filter((row) => Number.isFinite(Number(row.epc_value ?? row.epcValue)));
  const avgEpc = measurableRows.length
    ? measurableRows.reduce((sum, row) => sum + Number(row.epc_value ?? row.epcValue ?? 0), 0) / measurableRows.length
    : 0;

  const ctrRows = matrix.filter((row) => Number.isFinite(Number(row.ctr_value ?? row.ctrValue)));
  const avgCtr = ctrRows.length
    ? ctrRows.reduce((sum, row) => sum + Number(row.ctr_value ?? row.ctrValue ?? 0), 0) / ctrRows.length
    : 0;

  return [
    { label: 'Active Offers', value: String(activeOffers), tone: 'violet', delta: 'Live database' },
    { label: 'Live Warp Runs', value: String(runningRuns), tone: 'emerald', delta: 'Run queue linked' },
    { label: 'Age-Gated Pages', value: String(gatedPages), tone: 'crimson', delta: 'Route policy' },
    { label: 'Affiliate EPC', value: currency(avgEpc), tone: 'gold', delta: 'Matrix average' },
    { label: 'Vault CTR', value: percent(avgCtr), tone: 'emerald', delta: 'Matrix average' },
    { label: 'Offer Objects', value: String(offers.length), tone: 'violet', delta: 'Editable' },
    { label: 'Matrix Routes', value: String(matrix.length), tone: 'gold', delta: 'Tracker linked' },
    { label: 'Review Alerts', value: String(reviewAlerts), tone: 'crimson', delta: 'Den Mother queue' },
  ];
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const [offers, matrix, runs, reviews] = await Promise.all([
    fetchTable('black_vault_offers?select=*&order=sort_order.asc,created_at.asc'),
    fetchTable('black_vault_affiliate_matrix?select=*&order=created_at.desc&limit=50'),
    fetchTable('black_vault_warp_runs?select=*&order=updated_at.desc&limit=20'),
    fetchTable('black_vault_reviews?select=*&order=updated_at.desc&limit=20'),
  ]);

  const hasRemoteData = offers.length || matrix.length || runs.length || reviews.length;
  return res.status(200).json({
    metrics: deriveMetrics({ offers, matrix, runs, reviews }),
    offers,
    matrix,
    runs,
    reviews,
    source: hasRemoteData ? 'supabase' : 'seed-fallback',
  });
}
