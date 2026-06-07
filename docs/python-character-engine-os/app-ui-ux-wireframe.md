# App UI / UX Wireframe
## Python Character Engine OS + Hydra Companion App

**Wireframe code:** `HYDRA-CHARACTER-APP-WIREFRAME-001`  
**Primary app lane:** Hydra Companion App / Hydra PictoPop Mobile Studio / Realm of 5 Crowns  
**Design language:** Crown Obsidian Velvet  
**Public status:** Fictional, platform-safe, mobile-first.

---

## 1. Product Goal

The app turns a passive lore viewer into a faction-aligned participant.

```text
Open app
→ choose Crown
→ generate character or companion
→ receive mission
→ unlock codex
→ enter Shadow Arena
→ join Discord
→ purchase prompt pack / Founder Pack / vault access
→ feed Hydra Eyes telemetry
```

The core loop is identity, progression, and retention.

---

## 2. Primary User Roles

### Visitor

A new user who enters through a TikTok, Instagram, YouTube, Tumblr, or Discord link.

Needs:
- fast faction test
- simple Crown explanation
- instant visual reward
- clear CTA

### Initiate

A user who has selected a Crown and generated a companion.

Needs:
- profile screen
- daily mission
- XP / rank path
- codex unlocks
- community role

### Creator

A user who wants to build characters using the Hydra stack.

Needs:
- prompt generator
- character card template
- export options
- prompt pack upsell

### Admin

The operator running Omega Hydra.

Needs:
- character registry
- campaign performance
- Hydra Eyes events
- scale/test/kill decisions
- product delivery status

---

## 3. Navigation Structure

```text
Bottom Tabs
├── Home
├── Crown
├── Companion
├── Create
├── Codex
└── Command
```

Optional advanced tabs:

```text
Shadow Arena
World Map
Vault
Settings
```

---

## 4. Screen 1 — Launch / Home

### Purpose

Create immediate visual identity and route the user to the Crown selection.

### Layout

```text
[Hero Header]
Omega Hydra Talent Agency
Build characters like this. Choose your Crown. Enter the Labyrinth.

[Primary CTA]
Start Crown Test

[Secondary CTA]
Generate Character

[Live World Pulse]
Current Arena Event
Top Faction
Latest Codex Drop

[Featured Character Cards]
Nyssa / Den Mother / Lerian / Selene
```

### UX Notes

The home screen must avoid dense lore. The first action should be obvious.

---

## 5. Screen 2 — Crown Selection

### Purpose

Let users identify with a faction path.

### Layout

```text
[Title]
Choose Your Crown

[Five Crown Cards]
Shadow Crown
Scarlet Crown
Serpent Crown
Black Sun Crown
Lazarus Crown

[Each Card]
Sigil
Color palette
One-line philosophy
Primary character mentor
CTA: Claim Path
```

### Interaction

On tap:

```text
Crown selected
→ save selected_crown
→ assign starter role
→ recommend companion archetype
→ show faction result page
→ log hydra_events.quiz_result
```

---

## 6. Screen 3 — Companion Generator

### Purpose

Create the persistent identity anchor.

### Layout

```text
[Selected Crown Banner]
Shadow Crown / Scarlet Crown / Serpent Crown / etc.

[Generator Controls]
Faction
Archetype
Outfit
Pose
Environment
Camera
Mood

[Preview Panel]
Character portrait placeholder
Prompt summary
Personality tone preview

[CTA]
Generate Companion
Save Companion
Export Prompt
```

### Generator Menu

```text
Faction → Archetype → Outfit → Pose → Environment → Camera → Mood → Prompt JSON
```

### Interaction

```text
Generate
→ build identity brief
→ build Flux prompt
→ build SDXL prompt
→ build personality layer
→ create companion profile
→ log companion_generated event
```

---

## 7. Screen 4 — Companion Dashboard

### Purpose

Drive retention through missions and progression.

### Layout

```text
[Companion Portrait]
Name / Title / Crown Rank

[Bond Panel]
Bond Type
Tone Family
Current Trust Level

[Daily Mission]
Mission Title
Mission Objective
Reward
Complete Button

[Progress]
XP Bar
Rank
Relics
Codex Fragments

[Dialogue Panel]
Companion message
Reply options
```

### Mission Completion Flow

```text
Complete mission
→ award XP
→ unlock codex fragment
→ update companion memory
→ log hydra_events.completion
→ recommend next action
```

---

## 8. Screen 5 — Create Studio

### Purpose

Package the Character Engine OS into a usable creator workflow.

### Layout

```text
[Studio Header]
Hydra PictoPop Mobile Studio

[Prompt Builder]
Identity Forge
Flux Portrait
SDXL Variant
Atmosphere Scene
Character Card
Personality Layer

[Output Tabs]
Prompt
JSON
Card Text
Codex Seed
Social Caption

[CTA]
Copy Prompt
Save Character
Add to Prompt Pack
```

### Export Formats

```text
Markdown
JSON
Prompt text
Character card copy
Codex seed
Social post caption
```

---

## 9. Screen 6 — Codex Library

### Purpose

Turn lore into unlockable progression.

### Layout

```text
[Codex Header]
Unlocked / Locked count

[Filters]
Faction
Character
Saga
Arena
Companion

[Cards]
Codex title
Tier badge
One-line hook
Unlock status

[CTA]
Unlock Founder Pack
```

### Unlock Logic

```text
Free preview
→ email capture
→ Discord join
→ purchase Founder Pack
→ unlock paid codex entries
```

---

## 10. Screen 7 — Shadow Arena

### Purpose

Run faction events and community votes.

### Layout

```text
[Current Trial]
Nyssa vs Den Mother
Arena Zone: Velvet Gallery

[Vote Buttons]
SCARLET
WEB
SERPENT
BLACK SUN
LAZARUS

[Outcome Meter]
Faction influence bars

[Reward]
Arena badge / codex fragment / role progress
```

### Interaction

```text
Vote
→ log hydra_events.arena_vote
→ update faction influence
→ show outcome timer
→ recommend Discord discussion
```

---

## 11. Screen 8 — Command Dashboard

### Purpose

Admin and operator view.

### Panels

```text
Hydra Eyes Feed
Character Performance
Top Campaigns
Sales Events
Discord Growth
Scale/Test/Kill
Delivery Ledger
```

### Metrics

```text
views
clicks
quiz results
joins
sales
conversion rate
revenue
top character
top prompt
scale decision
```

---

## 12. Visual System

### Colors

```text
Background: Obsidian black
Cards: Charcoal / black glass
Primary accent: Crown gold
Secondary accent: Velvet violet
Data accent: Hydra green
Alert accent: Scarlet
Neutral accent: Moon silver
```

### UI Shapes

```text
rounded dark panels
thin gold borders
glowing sigil badges
holographic map cards
vertical progression bars
premium fantasy command-center cards
```

### Typography Direction

```text
Headers: high-contrast cinematic serif or sharp futuristic display
Body: clean readable sans serif
Labels: small caps / tracked spacing
Numbers: dashboard-style mono or condensed sans
```

---

## 13. App Data Contracts

### Companion Profile

```json
{
  "user_id": "uuid",
  "selected_crown": "shadow",
  "companion_slug": "selene-voss",
  "rank": "initiate",
  "xp": 0,
  "bond_type": "guardian_oracle",
  "codex_unlocks": [],
  "mission_history": []
}
```

### Character Export

```json
{
  "character_slug": "selene-voss-velvet-sentinel",
  "identity_prompt": "string",
  "stylized_prompt": "string",
  "atmosphere_prompt": "string",
  "personality_layer": {},
  "card_template": {},
  "product_hooks": {}
}
```

---

## 14. MVP Build Order

```text
1. Home
2. Crown Selection
3. Companion Generator
4. Companion Dashboard
5. Create Studio
6. Codex Library
7. Hydra Eyes event logging
8. Product links
9. Discord role routing
```

---

## 15. Final Lock

```text
APP UX: MOBILE-FIRST
ENTRY: CHOOSE CROWN
RETENTION: COMPANION + DAILY MISSION
CREATION: HYDRA PICTOPOP STUDIO
PROGRESSION: CODEX + ARENA
MONETIZATION: PROMPT PACK + FOUNDER PACK + VAULT
TELEMETRY: HYDRA EYES
```
