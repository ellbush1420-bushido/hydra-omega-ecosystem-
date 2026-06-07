export default async function handler(req, res) {
  const response = await fetch(process.env.SUPABASE_URL + '/rest/v1/hydra_events?order=created_at.desc&limit=20', {
    headers: { apikey: process.env.SUPABASE_KEY }
  })

  const events = await response.json()

  res.status(200).json(events)
}
