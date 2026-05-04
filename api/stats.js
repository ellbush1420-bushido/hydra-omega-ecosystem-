export default async function handler(req, res) {
  const response = await fetch(process.env.SUPABASE_URL + '/rest/v1/hydra_events', {
    headers: {
      apikey: process.env.SUPABASE_KEY
    }
  })

  const events = await response.json()

  const stats = {
    views: 0,
    clicks: 0,
    joins: 0,
    sales: 0,
    revenue: 0
  }

  events.forEach(e => {
    if (e.type === 'view') stats.views++
    if (e.type === 'click') stats.clicks++
    if (e.type === 'join') stats.joins++
    if (e.type === 'sale') {
      stats.sales++
      stats.revenue += e.value || 0
    }
  })

  res.status(200).json(stats)
}
