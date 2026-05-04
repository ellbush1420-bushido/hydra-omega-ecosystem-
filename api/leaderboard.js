export default async function handler(req, res) {
  const response = await fetch(process.env.SUPABASE_URL + '/rest/v1/hydra_events', {
    headers: { apikey: process.env.SUPABASE_KEY }
  })

  const events = await response.json()

  const leaderboard = {}

  events.forEach(e => {
    if (e.type === 'sale') {
      const char = e.metadata?.character || 'unknown'
      if (!leaderboard[char]) {
        leaderboard[char] = { sales: 0, revenue: 0 }
      }
      leaderboard[char].sales++
      leaderboard[char].revenue += e.value || 0
    }
  })

  res.status(200).json(leaderboard)
}
