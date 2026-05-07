# Omega Hydra Mobile + Discord Launch Plan

## Objective
Launch the Bird's-Eye Omega Hydra Living World UI across:

1. Mobile dashboard
2. Discord faction server
3. Python automation backend
4. Hydra Eyes analytics layer
5. Live codex timeline

---

## Phase 1: Mobile Dashboard

Recommended stack:

- Expo React Native
- TypeScript
- Flask API backend for prototype
- Later upgrade path: FastAPI + Supabase

### Mobile Screens

```txt
mobile/
├── App.tsx
├── src/
│   ├── screens/
│   │   ├── WorldMapScreen.tsx
│   │   ├── FactionScreen.tsx
│   │   ├── ArenaScreen.tsx
│   │   ├── CodexScreen.tsx
│   │   ├── HydraEyesScreen.tsx
│   │   └── TerminalScreen.tsx
│   ├── components/
│   │   ├── FactionCard.tsx
│   │   ├── WorldPulsePanel.tsx
│   │   ├── ArenaEventCard.tsx
│   │   └── HydraTerminal.tsx
│   └── api/
│       └── hydraApi.ts
```

### Mobile Commands

```bash
npx create-expo-app mobile --template blank-typescript
cd mobile
npm install
npx expo start
```

---

## Phase 2: Discord Synchronization

Discord bot functions:

- Post daily world pulse
- Assign faction roles
- Publish Shadow Arena events
- Publish Codex lore updates
- Track XP manually or through bot events
- Announce Kingdom Raids
- Route users into 5 Crown Universe factions

### Discord Bot Folder

```txt
discord_bot/
├── bot.py
├── commands.py
├── faction_roles.py
├── world_pulse.py
├── requirements.txt
└── .env.example
```

### Required Discord Intents

- Server Members Intent
- Message Content Intent
- Guilds
- Messages

### Environment Variables

```env
DISCORD_BOT_TOKEN=replace_me
HYDRA_API_URL=http://127.0.0.1:5050/api/world
WORLD_PULSE_CHANNEL_ID=replace_me
```

---

## Phase 3: Backend API Expansion

Add endpoints:

```txt
GET /api/world
GET /api/factions
GET /api/arena
GET /api/codex
POST /api/generate-lore
POST /api/discord/world-pulse
POST /api/mobile/session
```

---

## Phase 4: Hydra Eyes Analytics

Track:

- Active faction interest
- Most clicked faction
- Most replicated lore event
- Arena event popularity
- Discord join source
- User selected crown
- Content-to-Discord conversion

---

## Phase 5: Live Codex Timeline

Every generated event becomes a timeline item:

```json
{
  "event_id": "evt_001",
  "faction": "Shadow Monastery",
  "event_type": "Arena Trial",
  "lore": "The violet bells rang beneath the Ninth Gate...",
  "created_at": "timestamp",
  "source": "world_engine"
}
```

---

## Launch Order

1. Run Flask backend locally.
2. Confirm `/api/world` works.
3. Launch browser UI.
4. Create Expo mobile app.
5. Point mobile API client to local backend.
6. Create Discord bot in Discord Developer Portal.
7. Add bot token to `.env`.
8. Run Discord bot locally.
9. Post first World Pulse.
10. Connect Hydra Eyes analytics.

---

## Public-Safe Deployment Rule

Omega Hydra public launch stays fictional, cinematic, consent-safe, game-like, and community/product focused.
