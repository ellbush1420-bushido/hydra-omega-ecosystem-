# Hybrid Hydra Video Pipeline
## Wan 2.2 Local Engine × Kling / Runway / HeyGen Finishers × Grok Imagine Testbed → Fanvue Direct Publishing

**Pack code:** `HYDRA-VIDEO-PIPELINE-001`
**Parent stack:** Python Character Engine OS → Video Route (see `README.md` §3.1)
**Purpose:** Turn character portraits and scenes into short-form and long-form video assets at near-zero recurring cost, using a self-hosted model as the primary engine and paid services only where they add irreplaceable polish, then publish the finished cut directly to Fanvue.
**Public status:** Original fictional characters only. Creator is responsible for platform verification, consent, and age-assurance requirements on any destination platform.

---

## 1. Operating Definition

Hybrid Hydra is a four-role video architecture, not a single vendor pipeline:

```text
Wan 2.2 (local)   = the Infinite Engine  — unlimited raw generation, zero marginal cost, full control
Grok Imagine      = the Instant Testbed  — fast/cheap pass to validate a concept before spending compute or credits
Kling             = a Finisher           — cinematic motion and camera-move quality
Runway            = a Finisher           — video-to-video control, style transfer, precision edits
HeyGen            = a Finisher           — talking-head / lip-synced avatar performance
Fanvue            = the Publishing Layer — direct creator-platform posting target
```

The doctrine: **generate infinitely and cheaply at home, test ideas instantly before committing spend, pay for finishing only on the clips that earn it, and post directly.**

---

## 2. Core Architecture

```text
Python Character Engine OS
├── Identity Layer (CelebMakerAI / Flux Pro / SDXL)
│   └── locked character portrait / identity reference
├── Hybrid Hydra Video Pipeline
│   ├── Stage 0 — Grok Imagine (Instant Testbed)
│   ├── Stage 1 — Wan 2.2 Local (Infinite Engine)
│   ├── Stage 2 — Finisher Routing
│   │   ├── Kling   (motion / cinematic finish)
│   │   ├── Runway  (control / style / precision finish)
│   │   └── HeyGen  (avatar / lip-sync finish)
│   ├── Stage 3 — Compliance & QA Review
│   └── Stage 4 — Fanvue Direct Publish
├── Hydra Eyes Telemetry Layer
└── Shadow Moon Product Division (packaging / monetization)
```

---

## 3. Tool Roles and Routing

| Tool | Role | Why it's used | Cost profile |
|---|---|---|---|
| **Wan 2.2 (local)** | Infinite Engine | Self-hosted, open-weight image-to-video / text-to-video. Runs unlimited generations, keeps character identity and prompts entirely under local control, no per-clip fee. | Compute/electricity only — no recurring subscription |
| **Grok Imagine** | Instant Testbed | Very fast turnaround for rough concept, hook, and motion-idea validation before a clip is worth a full local render or a paid finishing pass. | Low/no incremental cost per test |
| **Kling** | Finisher | Best-in-class camera moves, longer coherent motion, cinematic finish for hero clips. | Pay only for shortlisted clips |
| **Runway** | Finisher | Precise video-to-video control, inpainting, style-consistent edits, b-roll polish. | Pay only for shortlisted clips |
| **HeyGen** | Finisher | Lip-synced talking-head / avatar performance layer for voiced content. | Pay only for shortlisted clips |
| **Fanvue** | Publishing Layer | Direct creator-platform destination for the finished, compliance-reviewed cut. | Platform fee only, no extra generation cost |

**Routing rule:** never send a clip to a paid finisher until it has already passed the Grok Imagine concept test and a Wan 2.2 local draft. Finishers are a spend decision made on proven material, not a discovery tool.

---

## 4. Pipeline Stages

### Stage 0 — Instant Testbed (Grok Imagine)
- Validate hook, motion concept, pose, or camera idea in seconds.
- Kill weak concepts before any local compute or paid credits are spent.
- Output: `concept_status = pass / revise / kill`.

### Stage 1 — Infinite Engine (Wan 2.2 local)
- Take the locked character identity reference (Flux Pro / SDXL portrait) and the validated concept.
- Generate unlimited local draft variations: motion range, expression range, camera angle, loop length.
- No API rate limits, no per-generation billing — iterate until the draft is right.
- Output: `base_clip` (local file, full resolution master).

### Stage 2 — Finisher Routing
Route the selected base clip to exactly one finisher based on what it needs:

| Need | Route to |
|---|---|
| Cinematic camera move / longer coherent motion | Kling |
| Style-consistent precision edit / video-to-video control | Runway |
| Voiced, lip-synced avatar delivery | HeyGen |
| Clip is already good enough as-is | Skip finishing — go straight to Stage 3 |

### Stage 3 — Compliance & QA Review
Same review discipline as the Creator Fleet Command Center compliance queue:
- identity consistency confirmed against the locked character record
- no real-person likeness, no non-consensual imagery, no minor or young-coded content
- platform policy pass for the specific destination (Fanvue content and verification rules)
- reviewer + timestamp recorded

Risk states: `safe / revise / hold / reject` (same vocabulary as the compliance queue in `docs/apps/shadow-hand-dojo-ai-persona-shortform-growth-suite.md`).

### Stage 4 — Fanvue Direct Publish
- Package the finished cut with title, tags, and destination metadata.
- Post directly — no intermediary funnel hop required for this platform.
- Log a `publish_event` into Hydra Eyes telemetry.

---

## 5. Cost Model

| Layer | Recurring cost | Marginal cost per clip |
|---|---|---|
| Wan 2.2 local | Hardware only (owned/self-hosted) | ~$0 (compute time) |
| Grok Imagine testbed | Low/none | Near-zero |
| Kling / Runway / HeyGen finishers | None (pay-per-use) | Paid, but only on shortlisted winners |
| Fanvue | Platform fee/commission | None (no generation cost) |

The doctrine's economic claim: **zero recurring video-generation cost**, with paid spend confined to the small fraction of clips that clear the testbed and local-draft filters.

---

## 6. Data Model Additions

Extend the existing `character_assets` table (see `python-character-engine-os/README.md` §5) with video-specific fields:

```sql
alter table character_assets
  add column engine text,               -- wan2_2_local | grok_imagine | kling | runway | heygen
  add column pipeline_stage text,        -- testbed | base_draft | finished | published
  add column source_asset_id uuid references character_assets(id),
  add column finisher text,              -- kling | runway | heygen | none
  add column publish_target text,        -- fanvue | none
  add column publish_status text,        -- draft | reviewed | published
  add column concept_status text;        -- pass | revise | kill
```

`hydra_events` gains one new event type: `clip_published` (with `platform = 'fanvue'`).

---

## 7. Safety and Compliance Rules

- Original fictional characters only; no real-person likeness or deepfake workflow.
- Every clip passes Stage 3 compliance review before it reaches Stage 4 publish — no direct-to-platform shortcuts.
- Respect Fanvue's own content, consent, and age-verification requirements; this pipeline does not substitute for platform-required creator verification.
- No evasion, ban-circumvention, or detection-avoidance tooling of any kind.
- Keep identity, wardrobe, and tone consistent with the locked character record from the Identity Layer.

---

## 8. Build Phases

## Phase 1 — Local Infrastructure
1. Stand up Wan 2.2 locally with the identity reference pipeline.
2. Wire in the locked character portraits as conditioning input.
3. Establish local storage convention for `base_clip` masters.

## Phase 2 — Testbed Loop
1. Connect Grok Imagine as the pre-flight concept check.
2. Define `concept_status` gating before any local render is queued.

## Phase 3 — Finisher Routing
1. Build the decision table (Section 4, Stage 2) into the content planner.
2. Track finisher spend per clip against Section 5's cost model.

## Phase 4 — Fanvue Publishing
1. Add the compliance queue (Stage 3) as a hard gate before publish.
2. Automate metadata packaging and direct post to Fanvue.
3. Log `clip_published` events into Hydra Eyes.

## Phase 5 — Optimization Loop
1. Feed Hydra Eyes performance data back into which concepts get tested next.
2. Track finisher win-rate (what fraction of finished clips actually outperform the unfinished base draft) to keep spend disciplined.

---

## 9. KPI Targets

- Concepts tested per week (Grok Imagine)
- Base drafts generated per week (Wan 2.2 local)
- Draft-to-finish conversion rate (how many base clips get sent to a finisher)
- Finisher spend per published clip
- Compliance hold/reject rate
- Clips published to Fanvue per week
- Revenue per published clip

---

## 10. Ecosystem Placement

This pipeline is the concrete build-out of the **Video route** referenced in `python-character-engine-os/README.md` §3.1 (CelebMakerAI Identity Forge). It connects:

- **upward** to Hydra Eyes telemetry and the Shadow Moon Product Division for packaging/monetization
- **sideways** to the Creator Fleet Command Center compliance queue vocabulary (`safe / revise / hold / reject`) for consistency across content types
- **downward** to the locked character identity produced by the Identity Layer (Flux Pro / SDXL)

It does not replace the character creation matrix, the affiliate tracker, or the compliance review process — it is the video-specific execution layer sitting on top of them.

---

## 11. Canon Operating Statement

> **The Infinite Engine generates without limit at home, the Testbed kills weak ideas before they cost anything, the Finishers are hired only for clips that already proved themselves, and Fanvue receives the finished cut directly — full control, no recurring generation cost.**
