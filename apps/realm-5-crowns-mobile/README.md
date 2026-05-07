# Realm of 5 Crowns — Mobile App

A playable React Native / Expo prototype for **The Realm of 5 Crowns**, integrated into the Omega Hydra ecosystem as a mobile game/app module.

## Overview

| Feature | Status |
|---|---|
| Five Crown faction selection | ✅ |
| Realm Gate progression tree | ✅ |
| Trial difficulty scaling by realm + type | ✅ |
| Hydra Eyes UI (event tracking) | ✅ |
| Shadow Crown rank progression | ✅ |
| Black Tiger + White Tiger tracks | ✅ |
| Lore Codex list + detail screens | ✅ |
| Mock joins, sales, revenue, scale score | ✅ |
| Hydra recommendation logic | ✅ |
| Supabase player_state sync | ✅ |
| 3D Realm Viewer (Expo GL + Three.js) | ✅ |
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
5. The `player_state` table powers the Home screen sync card.
6. `codex_entries` and `codex_unlocks` power the lore codex screens.

## Project Structure

```
apps/realm-5-crowns-mobile/
├── App.js                  # Navigation entry point
├── app.json                # Expo config
├── eas.json                # EAS Build config
├── src/
│   ├── data/
│   │   ├── codexEntries.js # Lore Codex seed entries
│   │   ├── factions.json   # Five Crown faction definitions
│   │   ├── realmTrials.js  # Realm Gate progression + trial data
│   │   └── scenarios.json  # Legacy prototype scenarios
│   ├── hooks/
│   │   ├── useHydraEyes.js # Event tracking hook
│   │   └── usePlayer.js    # Player state context (XP, Crown rank, realm unlocks)
│   ├── lib/
│   │   ├── shadowCrown.js  # Rank thresholds + Veil/Edge/Pulse/Flux growth
│   │   ├── supabase.js     # Shared Supabase client + Codex/player_state helpers
│   │   └── trials.js       # Trial DC + damage profile helpers
│   ├── components/
│   │   ├── ShadowCrownPanel.js # Crown stats + perk milestones
│   │   ├── XPBar.js        # Rank progress bar
│   │   ├── TigerRankBadge.js # Tiger promotion track
│   │   └── HydraEyesPanel.js # Hydra Eyes stats panel
│   └── screens/
│       ├── HomeScreen.js          # Supabase sync dashboard
│       ├── FactionSelectScreen.js  # Choose your crown
│       ├── ScenariosHubScreen.js   # Realm Gate browser
│       ├── ScenarioScreen.js       # Individual trial resolution
│       ├── CodexScreen.js          # Lore Codex unlock list
│       ├── CodexDetailScreen.js    # Full lore entry viewer
│       ├── ProfileScreen.js        # Player profile + Hydra Eyes
│       └── RealmViewerScreen.js    # Expo GL / Three.js corridor viewer
└── supabase/
    └── schema.sql          # Starter schema for live tracking + player_state sync
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
