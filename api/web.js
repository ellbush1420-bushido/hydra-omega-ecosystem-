export default async function handler(req, res) {
  const src = req.query.src || 'unknown'

  try {
    await fetch(process.env.SUPABASE_URL + '/rest/v1/hydra_events', {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'click',
        metadata: { src }
      })
    })
  } catch (err) {
    console.error('Tracking error:', err)
  }

  res.redirect('https://your-link-in-bio.com')
}
