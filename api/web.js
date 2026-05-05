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

  const destinations = {
    discord_entry: 'https://discord.gg/YOUR_DISCORD_INVITE',
    instagram_entry: 'https://www.instagram.com/YOUR_INSTAGRAM_HANDLE',
    tiktok_entry: 'https://www.tiktok.com/@YOUR_TIKTOK_HANDLE',
    whop_entry: 'https://whop.com/YOUR_WHOP_PAGE',
    gumroad_entry: 'https://YOUR_USERNAME.gumroad.com',
    product_entry: 'https://YOUR_USERNAME.gumroad.com/l/YOUR_PRODUCT',
  }

  const url = destinations[src] || 'https://your-link-in-bio.com'
  res.redirect(url)
}
