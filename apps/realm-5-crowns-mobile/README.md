# Realm of 5 Crowns — Mobile App

A playable React Native / Expo prototype for **The Realm of 5 Crowns**, integrated into the Omega Hydra ecosystem as a mobile game/app module.

## Overview

| Feature | Status |
|---|---|
| Five Crown faction selection | ✅ |
| Realm Gate progression tree | ✅ |
| Shadow Crown Rank 1–10 evolution | ✅ |
| Trial difficulty scaling by realm + type | ✅ |
| Encounter state flow (intro → choice → resolve) | ✅ |
| Lore Codex unlock screen + detail view | ✅ |
| Hydra Eyes UI (event tracking) | ✅ |
| Optional Supabase player_state sync | ✅ |
| 3D Realm Viewer (Expo GL + Three.js) | ✅ |
| Supabase starter schema for realm/codex sync | ✅ |

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

## Realm Gate Systems

### Realm progression

- Realm 1: Obsidian Gate
- Realm 2: Golden Arena
- Realm 3: Silver Labyrinth
- Realm 4: Crimson Wilds
- Realm 5: Azure Spire

Winning any trial in Realm **N** unlocks Realm **N+1**.

### Shadow Crown ranks

The app uses Shadow Crown XP thresholds for Rank 1–10 and derives cumulative Crown stats:

- **Veil**
- **Edge**
- **Pulse**
- **Flux**

Milestone perks unlock at Rank 5 (`Deep Fade`), Rank 7 (`Echo Step`), Rank 9 (`Shadow Dominion`), and Rank 10 (aura + intro line).

### Encounter flow

Each encounter follows the same state machine:

1. Intro / gate pan
2. Player choice
3. Roll resolution against trial DC
4. HP update
5. Victory / defeat end state

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy your URL and anon key into `.env.local`.
4. `player_state` stores current Crown / realm / trial sync.
5. `realm_unlocks` stores unlocked realms.
6. `codex_entries` and `codex_unlocks` power the lore codex screens.
7. `hydra_events` receives Hydra Eyes event tracking.

## Project Structure

```text
apps/realm-5-crowns-mobile/
├── App.js
├── app.json
├── src/
│   ├── components/
│   │   ├── XPBar.js
│   │   ├── TigerRankBadge.js
│   │   └── HydraEyesPanel.js
│   ├── data/
│   │   ├── factions.json
│   │   ├── scenarios.json
│   │   └── realmGate.js
│   ├── hooks/
│   │   ├── useHydraEyes.js
│   │   └── usePlayer.js
│   ├── lib/
│   │   └── supabase.js
│   └── screens/
│       ├── HomeScreen.js
│       ├── FactionSelectScreen.js
│       ├── ScenariosHubScreen.js
│       ├── ScenarioScreen.js
│       ├── CodexScreen.js
│       ├── CodexDetailScreen.js
│       ├── ProfileScreen.js
│       └── RealmViewerScreen.js
└── supabase/
    └── schema.sql
```

## Hydra Eyes Tracking

The `useHydraEyes` hook emits these event types to `hydra_events`:

| Event | Trigger |
|---|---|
| `faction_select` | Player chooses a Crown |
| `scenario_start` | Player opens a realm gate encounter |
| `scenario_choice` | Player chooses a stat response during an encounter |
| `codex_unlock` | Codex entry unlocks |
| `xp_gain` | Shadow Crown XP awarded |
| `click` | Any tracked button press |

## Canon / Safety

All content is **fictional, cinematic, game-like, public-safe, and non-operational**.
The Realm of 5 Crowns is a lore/engagement module of the Omega Hydra ecosystem.
