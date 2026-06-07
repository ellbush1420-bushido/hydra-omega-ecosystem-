# Sample Character Card Template
## Velvet Mod v2 Styling

**Template code:** `HYDRA-CARD-VELVET-V2`  
**Use for:** Heroes, rivals, companions, faction leaders, arena champions, codex assets, prompt-pack examples.  
**Public status:** Platform-safe, fictional, cinematic, non-explicit.

---

## 1. Visual Direction

Velvet Mod v2 is the premium public-safe Omega Hydra character-card style.

It should feel:

```text
regal
magnetic
gothic
cinematic
wuxia-inspired
luxury dark fantasy
emotionally charged
non-explicit
```

Core palette:

```text
obsidian black
velvet violet
crown gold
moon silver
hydra green
scarlet accent
soft fog highlights
```

Material language:

```text
black silk
brushed gold
lacquered armor
moonlit metal
velvet robes
etched sigils
serpent filigree
lotus geometry
```

Lighting language:

```text
candlelit rim light
soft face focus
dramatic contrast
shallow depth of field
fog halo
cathedral glow
moonlit profile
```

---

## 2. Character Card Layout

```text
[TOP BAR]
Character Name • Title • Crown Rank

[PORTRAIT PANEL]
Face-first portrait
Faction colors
Sigil overlay
Atmospheric background

[IDENTITY BLOCK]
Faction
Role
Alignment
Archetype
Public Status

[STAT STRIP]
Command / Shadow / Allure / Judgment / Devotion / Serpent / Guardian / Strategy

[LORE BLOCK]
One-sentence mythic hook
Three-line backstory seed
Core conflict

[ABILITY BLOCK]
Signature Presence
Signature Relic
Signature Trial
Arena Specialty

[RELATIONSHIP BLOCK]
Mentor
Rival
Ally
Danger Bond

[PRODUCT HOOK]
Prompt Pack Use
Codex Use
Companion Use
Discord Role
CTA Keyword
```

---

## 3. Markdown Template

```markdown
# CHARACTER CARD — [NAME]

## Header
**Name:** [Full name]  
**Title:** [Mythic title]  
**Crown Rank:** [Initiate / Sentinel / Warden / Sovereign / Oracle]  
**Faction:** [Faction name]  
**Public Status:** Public-safe fictional character  

---

## Portrait Direction
**Core Image:** [Face-first portrait description]  
**Expression:** [Micro-expression]  
**Lighting:** [Lighting style]  
**Palette:** [Color palette]  
**Materials:** [Clothing / armor / jewelry / sigils]  
**Background:** [Faction environment]  

---

## Identity Block
**Role:** [Commander / Oracle / Sentinel / Spy / Saint / Warden / Champion]  
**Archetype:** [Sovereign Commander / Velvet Oracle / Shadow Guardian]  
**Alignment:** [Hero / Antihero / Neutral / Rival / Villain]  
**Crown Path:** [Shadow / Scarlet / Serpent / Black Sun / Lazarus / Ocean]  

---

## Stat Strip
| Stat | Value |
|---|---:|
| Command | [1-10] |
| Shadow | [1-10] |
| Allure | [1-10] |
| Judgment | [1-10] |
| Devotion | [1-10] |
| Serpent | [1-10] |
| Guardian | [1-10] |
| Strategy | [1-10] |

---

## Lore Hook
> [One sentence that makes the character feel larger than life.]

### Backstory Seed
[Three to five short paragraphs or bullets explaining origin, wound, duty, faction relationship, and unresolved conflict.]

### Core Conflict
[What pulls the character apart internally?]

---

## Signature Assets
**Signature Presence:** [Aura / command style / emotional pressure]  
**Signature Relic:** [Weapon, seal, ring, mask, blade, book, crown, veil]  
**Signature Trial:** [Arena or Labyrinth challenge]  
**Arena Specialty:** [Obsidian Ring / Velvet Gallery / Black Sun Tribunal / Lazarus Ward]  

---

## Relationship Matrix
**Mentor:** [Name]  
**Rival:** [Name]  
**Ally:** [Name]  
**Danger Bond:** [Name or faction]  
**Companion Role:** [Mentor / Oracle / Mission Dispatcher / Rival Guide]  

---

## Product Hooks
**Prompt Pack Use:** [Which prompt pack section uses them?]  
**Codex Use:** [Free preview / premium dossier / Founder Pack]  
**Companion Use:** [App guide / unlockable mentor / faction companion]  
**Discord Role Tie-In:** [Role name]  
**CTA Keyword:** [SCARLET / WEB / SERPENT / HYDRA / TEST]  
```

---

## 4. JSON Template

```json
{
  "name": "[NAME]",
  "title": "[TITLE]",
  "crown_rank": "[RANK]",
  "faction": "[FACTION]",
  "public_status": "public_safe_fictional",
  "portrait_direction": {
    "core_image": "[FACE-FIRST DESCRIPTION]",
    "expression": "[MICRO EXPRESSION]",
    "lighting": "[LIGHTING]",
    "palette": ["obsidian", "violet", "gold"],
    "materials": ["black silk", "etched gold", "moonlit metal"],
    "background": "[FACTION ENVIRONMENT]"
  },
  "identity": {
    "role": "[ROLE]",
    "archetype": "[ARCHETYPE]",
    "alignment": "[ALIGNMENT]",
    "crown_path": "[CROWN]"
  },
  "stats": {
    "command": 0,
    "shadow": 0,
    "allure": 0,
    "judgment": 0,
    "devotion": 0,
    "serpent": 0,
    "guardian": 0,
    "strategy": 0
  },
  "lore": {
    "hook": "[HOOK]",
    "backstory_seed": "[BACKSTORY]",
    "core_conflict": "[CONFLICT]"
  },
  "signature_assets": {
    "presence": "[PRESENCE]",
    "relic": "[RELIC]",
    "trial": "[TRIAL]",
    "arena_specialty": "[ARENA]"
  },
  "relationships": {
    "mentor": "[MENTOR]",
    "rival": "[RIVAL]",
    "ally": "[ALLY]",
    "danger_bond": "[DANGER BOND]",
    "companion_role": "[COMPANION ROLE]"
  },
  "product_hooks": {
    "prompt_pack_use": "[PROMPT PACK USE]",
    "codex_use": "[CODEX USE]",
    "companion_use": "[COMPANION USE]",
    "discord_role": "[DISCORD ROLE]",
    "cta_keyword": "[KEYWORD]"
  }
}
```

---

## 5. Card Prompt Template

```text
Create a premium dark fantasy character card for [NAME], titled [TITLE].
Velvet Mod v2 style: obsidian black, velvet violet, crown gold, moon silver, gothic luxury, candlelit atmosphere, cinematic face-first portrait.
Character: [FACTION], [ARCHETYPE], [ROLE], [ALIGNMENT].
Expression: [MICRO-EXPRESSION].
Wardrobe: [MATERIALS AND OUTFIT].
Background: [FACTION ENVIRONMENT].
Include clean card UI elements: nameplate, faction sigil, stat strip, lore quote, relic icon, crown-rank badge.
Non-explicit, original fictional character, platform-safe.
```

---

## 6. Final Lock

```text
CARD TEMPLATE: VELVET MOD V2
USE: CHARACTER / COMPANION / CODEX / ARENA / PRODUCT
PUBLIC STATUS: SAFE
PRIMARY VISUAL RULE: FACE-FIRST PRESENCE
SECONDARY VISUAL RULE: FACTION MATERIALS
TERTIARY VISUAL RULE: CLEAN PREMIUM UI
```
