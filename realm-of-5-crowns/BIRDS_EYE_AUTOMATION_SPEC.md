# Realm of 5 Crowns — Bird's-Eye Automation Spec

## Deployment Command
Ingest and deploy the 5 Crown Universe as an automated bird's-eye living world layer inside Omega Hydra Talent Agency / Hydra OS.

## Core Purpose
The Realm of 5 Crowns is the mobile-first, public-safe living world layer for:

- Omega Hydra Talent Agency
- Crown Order Universe
- Shadow Monastery
- Shadow Arena 9x9x9
- Hydra Labyrinth
- Hydra Eyes analytics
- Hydra PictoPop visualization
- Discord faction operations

Public framing: cinematic dark fantasy, faction strategy, lore simulation, community gameplay, and digital product ecosystem.

---

## Five Crown Universe

### Crown 1 — Shadow Monastery
- Color: obsidian / violet / silver
- Function: hidden discipline, restraint, shadow wisdom
- Mobile role: stealth, perception, codex unlocks
- Arena role: Mirror Court / Hall Five

### Crown 2 — Scarlet Temple
- Color: scarlet / white / gold
- Function: command, war discipline, radiant order
- Mobile role: leadership, raids, champion pressure
- Arena role: Crimson Gate / Obsidian Ring

### Crown 3 — Cult of Ophiuchus
- Color: green / silver / neon yellow
- Function: serpent prophecy, transformation, corruption pressure
- Mobile role: instability, mutation, conversion events
- Arena role: Serpent Maze

### Crown 4 — Order of the Black Sun
- Color: black / red / gold
- Function: judgment, containment, neutral law
- Mobile role: verdicts, prison gates, balance checks
- Arena role: Black Sun Tribunal

### Crown 5 — Lazarus / Asclepius Guardian Order
- Color: white / green / silver
- Function: restoration, healing, guardian discipline
- Mobile role: rescue, stabilization, crisis restoration
- Arena role: Lazarus Ward

---

## Bird's-Eye View Modules

### 1. World Pulse
Displays current world state:
- dominant Crown
- active faction conflict
- current Shadow Arena zone
- corruption pressure
- stability score
- latest codex event

### 2. Crown Map
A 5-node strategic map:

```txt
        Shadow Monastery
              / \
 Black Sun -- Core -- Scarlet Temple
              \ /
     Lazarus / Asclepius -- Ophiuchus
```

Each node shows:
- power
- influence
- loyalty
- territory
- current action

### 3. Automation Loop

```txt
World tick
→ update faction telemetry
→ choose active dispute
→ select Arena zone
→ generate lore event
→ update Codex timeline
→ optionally post Discord pulse
→ log Hydra Eyes event
→ recommend next content/product action
```

### 4. Hydra Eyes Metrics
Track:
- faction clicks
- quiz selections
- Discord joins
- arena votes
- codex opens
- product clicks
- sales
- conversion by Crown

### 5. Discord Sync
Events pushed to Discord:
- Daily World Pulse
- Shadow Arena challenge
- Kingdom Raid alert
- Codex unlock
- Crown ranking update

### 6. PictoPop Integration
Menu-based visual engine:
- Crown
- faction
- character archetype
- outfit/style pack
- pose/composition
- scene
- camera
- mood
- hidden prompt JSON

Safety rule: original fictional characters only. No nonconsensual real-person likeness, explicit adult content, or real-world tactical instruction.

---

## API Targets

```txt
GET  /api/realm/world
GET  /api/realm/crowns
GET  /api/realm/events
POST /api/realm/tick
POST /api/realm/arena/resolve
POST /api/realm/discord/world-pulse
POST /api/realm/pictopop/prompt
```

---

## Mobile Screens

```txt
WorldMapScreen
CrownTelemetryScreen
ShadowArenaScreen
HydraEyesScreen
CodexTimelineScreen
PictoPopStudioScreen
DiscordPulseScreen
RaidLobbyScreen
HydraTerminalScreen
```

---

## Seed World Event Types

- arena_duel
- kingdom_raid
- codex_revelation
- crown_awakening
- corruption_spread
- restoration_event
- black_sun_verdict
- shadow_trial
- scarlet_command
- serpent_conversion

---

## Example Tick Output

```json
{
  "world": "Realm of 5 Crowns",
  "mode": "Bird's-Eye Living World",
  "active_crown": "Shadow Monastery",
  "active_event": {
    "type": "arena_duel",
    "title": "Nyssa challenges the Web at the Velvet Gallery",
    "summary": "The Scarlet Temple accuses the Seminary of turning recruits away from command discipline. The Arena opens under violet-gold light."
  },
  "hydra_eyes": {
    "recommended_action": "Post SCARLET vs WEB poll",
    "scale_note": "Track comments: SCARLET / WEB / BLACKSUN / HYDRA"
  }
}
```

---

## Deployment Phases

### Phase A — Local Prototype
- Flask/Node API with seeded Crown data
- Expo mobile bird's-eye UI
- static Codex timeline
- manual Discord copy output

### Phase B — Supabase Live Layer
- hydra_events table
- world_events table
- crown_state table
- arena_votes table
- Discord join tracking

### Phase C — Automation
- scheduled world tick
- Discord bot world pulse
- Hydra Eyes dashboard feed
- Auto content recommendations

### Phase D — Visual Evolution
- animated SVG map
- Three.js holographic overlays
- PictoPop studio prompt builder
- voice-driven Hydra terminal

---

## Public Launch CTA

Build characters like this. Choose your Crown. Enter the Labyrinth.
