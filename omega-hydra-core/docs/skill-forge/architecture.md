# Hydra Skill Forge — Architecture

Hydra Skill Forge is the knowledge-to-product engine inside `omega-hydra-core`. It transforms source material (PDFs, courses, manuals, frameworks, books, training notes, and verified credentials) into reusable Hydra assets.

## Pipeline

```text
Source Material (SourceRecord)
  → Source Normalization + Provenance         normalize-source.js
  → Framework Extraction                      extract-framework.js
  → Safety / Claims Review                    classify-safety.js
  → Hydra Skill                               generate-skill.js
  → Daily Missions                            generate-missions.js
  → Companion Behaviors                       generate-companion.js
  → Product Templates                         generate-products.js
  → Telemetry Event                           telemetry.js
  → Control Plane Run Plan                    hydra-agent-control-plane
  → Optional Warp / Oz Execution              hydra-warp-adapter
```

## Packages

| Package | Role |
|---|---|
| `packages/hydra-skill-forge` | Deterministic extraction and generation core |
| `packages/hydra-agent-control-plane` | Provider-neutral planning, routing, approval gates, and QA |
| `packages/hydra-warp-adapter` | Optional Oz REST adapter; mock client for local/CI runs |

## Key Design Principles

- **Provenance-first.** Every artifact carries a `sourceId`, `claimStatus`, and `permittedUse` scope.
- **Safety-gated.** The `classifySafety` stage blocks any output that matches the prohibited patterns before skill generation proceeds.
- **Provider-neutral.** The control plane selects model tiers (economy / balanced / frontier / self-hosted-defensive) without hard-coding any model provider.
- **Independently testable.** The deterministic core runs without Warp credentials or network access.
- **Mock-first warp.** The warp adapter defaults to `mock-client.js`; the real `oz-client.js` activates only when `OZ_API_KEY` and `OZ_BASE_URL` are set.

## Data Flow

```
forgeSkillFromSource(source)
  normalizeSource(source)           → SourceRecord (normalized)
  extractFramework(normalized)      → ExtractedFramework
  classifySafety(normalized, fw)    → SafetyReview
  generateSkill(framework)          → HydraSkill
  generateMissionTemplates(skill)   → MissionTemplate[]
  generateCompanionBehavior(skill)  → CompanionBehavior
  generateProductTemplates(skill)   → ProductTemplate[]
  emitTelemetry("skill_forged", …)  → TelemetryEvent
```

## Claim Status Values

| Value | Meaning |
|---|---|
| `verified` | Explicitly documented by the source institution |
| `inferred` | Derived from source content, not explicitly stated |
| `proprietary` | Omega Hydra internal framework or system |
| `requiresReview` | Ambiguous; human review required before use |

## Schemas

JSON schemas for all data contracts live in `packages/hydra-skill-forge/schemas/`:

- `SourceRecord.schema.json`
- `ExtractedFramework.schema.json`
- `HydraSkill.schema.json`
- `MissionTemplate.schema.json`
- `CompanionBehavior.schema.json`
- `ProductTemplate.schema.json`
- `SafetyReview.schema.json`
- `TelemetryEvent.schema.json`
- `ExecutionRequest.schema.json`
- `ExecutionResult.schema.json`

## Running the Demo

```sh
cd omega-hydra-core
npm run skill-forge:demo
```

This runs through the full pipeline with the Guardian Readiness fixture and prints a schema-valid JSON artifact.

## Running Tests

```sh
cd omega-hydra-core
npm run test:skill-forge
npm run test:warp-adapter
npm run test:agent-control
```
