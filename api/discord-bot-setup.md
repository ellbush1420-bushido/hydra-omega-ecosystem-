# Discord Role Auto-Assign Setup (Hydra System)

## Overview
This guide connects your Hydra funnel to Discord roles using a bot + webhook system.

---

## 1. Create Discord Bot
1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name it: HydraBot
4. Go to "Bot" → Add Bot
5. Copy BOT TOKEN

---

## 2. Invite Bot to Server
Use URL:

https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot

Permissions needed:
- Manage Roles
- Read Messages

---

## 3. Get Role IDs
In Discord:
- Enable Developer Mode
- Right-click role → Copy ID

Example:
- Webbound
- Scarlet
- Serpent

---

## 4. Update /api/discord.js

Replace placeholder with:

```js
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const GUILD_ID = process.env.DISCORD_GUILD_ID

const ROLE_MAP = {
  web: 'ROLE_ID_WEB',
  scarlet: 'ROLE_ID_SCARLET',
  serpent: 'ROLE_ID_SERPENT'
}

export default async function handler(req, res) {
  const { userId, faction } = req.query

  const roleId = ROLE_MAP[faction]

  try {
    await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${userId}/roles/${roleId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`
      }
    })

    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
```

---

## 5. Connect ManyChat

After user joins Discord:
Call:

/api/discord?userId=DISCORD_ID&faction=web

---

## 6. Result

User flow:

Comment → DM → Click → Discord → Role Assigned Automatically

---

## Notes
- You may need a middleware to capture Discord userId after join
- Advanced: use Discord OAuth2 for full automation

---

Hydra Status: ACTIVE
