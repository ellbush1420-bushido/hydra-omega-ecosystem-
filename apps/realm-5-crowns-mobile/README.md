# Realm of 5 Crowns — Mobile App

A playable React Native / Expo prototype for **The Realm of 5 Crowns**, integrated into the Omega Hydra ecosystem as a mobile game/app module.

## Overview

| Feature | Status |
|---|---|
| Five Crown faction selection | ✅ |
| Shadow Arena scenarios | ✅ |
| Kingdom Raid scenarios | ✅ |
| Hydra Labyrinth trials | ✅ |
| Hydra Eyes UI (event tracking) | ✅ |
| XP / level progression | ✅ |
| Black Tiger + White Tiger tracks | ✅ |
| Codex unlock screen | ✅ |
| Mock joins, sales, revenue, scale score | ✅ |
| Hydra recommendation logic | ✅ |
| Supabase starter schema | ✅ |

## Quick Start

```bash
cd apps/realm-5-crowns-mobile
npm install
npm run start         # Opens Expo Go / tunnel
npm run android       # Android emulator
npm run ios           # iOS simulator
npm run web           # Browser (Expo web)
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy your URL and anon key into `.env.local`.
4. The `hydra_events` table will receive live tracking from the app.

## Project Structure

```
apps/realm-5-crowns-mobile/
├── App.js                  # Navigation entry point
├── app.json                # Expo config
├── eas.json                # EAS Build config
├── src/
│   ├── data/
│   │   ├── factions.json   # Five Crown faction definitions
│   │   └── scenarios.json  # Arena / raid / labyrinth scenarios
│   ├── hooks/
│   │   ├── useHydraEyes.js # Event tracking hook
│   │   └── usePlayer.js    # Player state context (XP, faction, tiger rank)
│   ├── components/
│   │   ├── XPBar.js        # Level progress bar
│   │   ├── TigerRankBadge.js # Tiger promotion track
│   │   └── HydraEyesPanel.js # Hydra Eyes stats panel
│   └── screens/
│       ├── CrownSelectionScreen.js # Choose your crown
│       ├── FactionSelectScreen.js  # Compatibility re-export
│       ├── ScenariosHubScreen.js   # Arena browser
│       ├── ScenarioScreen.js       # Individual scenario play
│       ├── CodexScreen.js          # Codex unlock + product ladder
│       └── ProfileScreen.js        # Player profile + Hydra Eyes
└── supabase/
    └── schema.sql          # Starter schema for live tracking
```

## Hydra Eyes Tracking

The `useHydraEyes` hook emits these event types to `hydra_events`:

| Event | Trigger |
|---|---|
| `faction_select` | Player chooses a Crown |
| `scenario_start` | Player opens a scenario |
| `scenario_choice` | Player picks an arena option |
| `codex_unlock` | Codex entry unlocked |
| `join` | Mock join recorded |
| `sale` | Mock product sale |
| `xp_gain` | XP awarded |
| `tiger_promotion` | Black/White Tiger rank up |
| `click` | Any tracked button press |

## EAS Build (Android / iOS Preview)

```bash
npm install -g eas-cli
eas login
eas build --profile preview --platform android
eas build --profile preview --platform ios
```

Update `app.json` with your EAS `projectId` before running builds.

## Canon / Safety

All content is **fictional, cinematic, game-like, public-safe, and non-operational**.
Shadow Arena and Kingdom Raids are symbolic game systems — not real-world tactical instruction.
The Realm of 5 Crowns is a lore/engagement module of the Omega Hydra ecosystem.
