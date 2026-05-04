export default async function handler(req, res) {
  const { amount = 0, product = 'unknown', source = 'unknown' } = req.query

  try {
    await fetch(process.env.SUPABASE_URL + '/rest/v1/hydra_events', {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'sale',
        value: Number(amount),
        metadata: { product, source }
      })
    })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Sale tracking error:', err)
    res.status(500).json({ error: 'Failed to track sale' })
  }
}
