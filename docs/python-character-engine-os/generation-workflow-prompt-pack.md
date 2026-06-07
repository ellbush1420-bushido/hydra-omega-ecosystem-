# Generation Workflow Prompt Pack
## Optimized for CelebMakerAI + Flux Pro + SDXL

**Pack code:** `HYDRA-GEN-WORKFLOW-001`  
**Use for:** Identity locking, character cards, codex portraits, faction variants, app avatars, companion profiles, and visual prompt products.  
**Public status:** Fictional original characters only. Platform-safe.

---

## 1. Core Workflow

```text
1. Character Brief
2. Identity Forge Prompt
3. Flux Pro Portrait Route
4. SDXL Stylized Variant Route
5. OurDreamAI Atmosphere Expansion
6. Character Card Packaging
7. Personality Layer Mapping
8. Hydra Eyes Test Label
9. Product Packaging
```

---

## 2. Character Brief Template

```text
Name:
Title:
Faction:
Crown Path:
Role:
Archetype:
Alignment:
Age Range:
Core Expression:
Face Notes:
Build / Silhouette:
Wardrobe Materials:
Faction Symbols:
Environment:
Primary Colors:
Emotional Energy:
Public Safety Status:
```

Example:

```text
Name: Selene Voss
Title: The Velvet Sentinel
Faction: Shadow Monastery / Iron Lotus
Crown Path: Shadow Crown
Role: Guardian Oracle
Archetype: Calm protector with hidden command presence
Alignment: Neutral guardian
Age Range: Adult fictional character
Core Expression: steady gaze, controlled warmth, subtle warning in the eyes
Face Notes: sharp cheekbones, natural skin texture, soft asymmetry, calm mouth
Build / Silhouette: athletic, poised, ceremonial posture
Wardrobe Materials: black silk, moon-silver armor trim, crown-gold thread, violet sash
Faction Symbols: black lotus, silver hydra ring, Nine Gate sigil
Environment: candlelit training cloister with mist and carved stone
Primary Colors: obsidian, violet, moon silver, crown gold
Emotional Energy: protective, composed, psychologically magnetic
Public Safety Status: public-safe fictional character
```

---

## 3. Master CelebMakerAI Prompt Formula

Use this for face-first identity consistency.

```text
ultra-realistic dark fantasy character portrait, [NAME], [TITLE], [FACTION] aesthetic, [FACE DETAILS], [EXPRESSION], [BODY SILHOUETTE], [WARDROBE MATERIALS], [FACTION SYMBOLS], [EMOTIONAL ENERGY], cinematic lighting, realistic skin texture, natural imperfections, sharp focus on face, depth of field, atmospheric haze, dramatic contrast, premium editorial portrait, original fictional character, platform-safe
```

### Quality Guardrails

```text
Avoid: real-person references, low resolution, blurry face, plastic skin, over-smoothed skin, watermark, text artifacts, logo artifacts, broken anatomy, cluttered composition.
```

---

## 4. Flux Pro Portrait Route

**Use when:** You need the locked recurring identity.

Prompt:

```text
ultra-realistic cinematic portrait of [NAME], [TITLE], original fictional [FACTION] character, [FACE DETAILS], [MICRO-EXPRESSION], realistic eyes, natural skin texture, subtle asymmetry, believable facial structure, [WARDROBE MATERIALS], [FACTION SYMBOLS], close portrait framing, soft rim light, candlelit shadows, premium editorial fantasy, shallow depth of field, high detail, platform-safe
```

Settings notes:

```text
Priority: face consistency
Camera: portrait / bust / three-quarter
Lighting: controlled cinematic
Detail: skin texture and eyes
Avoid: excessive environment complexity
```

Output labels:

```text
asset_type: identity_portrait
route: flux_pro
use: character registry / avatar / card portrait
```

---

## 5. SDXL Stylized Variant Route

**Use when:** You need card art, poster art, faction variants, or stylized fantasy looks.

Prompt:

```text
stylized dark fantasy character art of [NAME], [TITLE], [FACTION] visual language, [POSE], [WARDROBE MATERIALS], [FACTION COLORS], [SYMBOLS], dramatic atmosphere, gothic wuxia influence, premium card illustration, clean silhouette, cinematic composition, high detail, original fictional character, platform-safe
```

Variant modifiers:

```text
collectible card art
faction poster
mobile avatar icon
arena champion card
codex page illustration
wuxia cinematic still
gothic velvet portrait
```

Output labels:

```text
asset_type: stylized_variant
route: sdxl
use: card / poster / prompt pack / codex
```

---

## 6. OurDreamAI Atmosphere Expansion

**Use when:** You need the world scene around the character.

Prompt:

```text
[NAME] standing in [FACTION ENVIRONMENT], [ENVIRONMENT DETAILS], [FACTION COLORS], [SYMBOLS], cinematic dark fantasy atmosphere, fog, candlelight, sacred geometry, controlled posture, emotional presence, dramatic background depth, original fictional character, platform-safe
```

Scene types:

```text
Shadow Monastery cloister
Scarlet Temple war hall
Black Sun tribunal chamber
Ophiuchus serpent observatory
Lazarus healing ward
Ocean Crown storm deck
Velvet Gallery arena
Hydra Labyrinth gate
```

Output labels:

```text
asset_type: environment_scene
route: ourdream_atmosphere
use: reel background / poster / app hero / codex splash
```

---

## 7. Character Card Packaging Prompt

```text
Design a premium Omega Hydra character card for [NAME], [TITLE].
Include a face-first portrait, faction sigil, crown-rank badge, stat strip, relic icon, short lore quote, and clean dark fantasy UI frame.
Velvet Mod v2 style: obsidian black, velvet violet, crown gold, moon silver, gothic luxury, candlelit rim light, subtle fog, cinematic portrait quality.
Original fictional character. Platform-safe.
```

---

## 8. Companion Profile Prompt

```text
Create a companion profile screen for [NAME], [TITLE], [FACTION].
Show portrait, bond type, tone family, daily mission, current rank, XP progress, unlocked codex fragments, and primary dialogue line.
UI style: Crown Obsidian Velvet, dark command center, elegant gothic panels, clean mobile-first layout.
Original fictional character. Platform-safe.
```

---

## 9. Batch Generation Workflow

```text
Batch 1: Identity Lock
- 6 portrait variations
- choose strongest face
- save as base identity

Batch 2: Expression Range
- calm
- commanding
- guarded
- warm
- warning
- reflective

Batch 3: Wardrobe Variants
- ceremonial
- field-ready
- council attire
- arena attire

Batch 4: Environment Expansion
- faction home
- arena zone
- codex chamber
- campaign hero scene

Batch 5: Product Packaging
- card
- poster
- codex page
- app avatar
```

---

## 10. File Naming Convention

```text
character-slug_route_asset-type_variant.ext
```

Examples:

```text
selene-voss_flux_identity-portrait_v01.png
selene-voss_sdxl_character-card_v01.png
selene-voss_ourdream_cloister-scene_v01.png
selene-voss_prompt-pack-entry.md
```

---

## 11. Hydra Eyes Test Tags

```json
{
  "character": "selene_voss",
  "faction": "shadow_monastery",
  "asset_route": "flux_pro",
  "asset_type": "identity_portrait",
  "campaign": "character_engine_os_launch",
  "cta": "HYDRA",
  "product": "shadow_moon_prompt_pack"
}
```

---

## 12. Final Lock

```text
GENERATION WORKFLOW: ACTIVE
CELEBMAKERAI: IDENTITY FORGE
FLUX PRO: FACE-FIRST PORTRAIT
SDXL: STYLIZED VARIANTS
OURDREAMAI: ATMOSPHERE EXPANSION
PICTOPOP: PACKAGING
HYDRA EYES: PERFORMANCE TESTING
PUBLIC STATUS: SAFE
```
