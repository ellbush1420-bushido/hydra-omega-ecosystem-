// Hydra Auto Scale Engine

export default async function handler(req, res) {
  const response = await fetch(process.env.SUPABASE_URL + '/rest/v1/hydra_events', {
    headers: { apikey: process.env.SUPABASE_KEY }
  })

  const events = await response.json()

  const performance = {}

  events.forEach(e => {
    const char = e.metadata?.character || 'unknown'

    if (!performance[char]) {
      performance[char] = {
        clicks: 0,
        sales: 0,
        revenue: 0
      }
    }

    if (e.type === 'click') performance[char].clicks++
    if (e.type === 'sale') {
      performance[char].sales++
      performance[char].revenue += e.value || 0
    }
  })

  const decisions = {}

  Object.keys(performance).forEach(char => {
    const p = performance[char]

    const conversionRate = p.clicks > 0 ? (p.sales / p.clicks) : 0

    if (p.sales === 0 && p.clicks > 20) {
      decisions[char] = 'KILL'
    } else if (conversionRate > 0.05) {
      decisions[char] = 'SCALE'
    } else {
      decisions[char] = 'TEST'
    }
  })

  res.status(200).json({ performance, decisions })
}
