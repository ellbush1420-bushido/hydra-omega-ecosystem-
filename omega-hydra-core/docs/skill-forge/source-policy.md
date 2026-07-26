# Hydra Skill Forge — Source Policy

This document defines how Hydra Skill Forge handles source material: what it accepts, what it attributes, and what it blocks.

## Source Types

| Type | Description | Default claimStatus |
|---|---|---|
| `pdf` | PDF documents | `requiresReview` |
| `course` | TEEX/AWR/TCOLE or similar training courses | `verified` (credentials only) |
| `manual` | Operational guides and handbooks | `inferred` |
| `framework` | Repeatable structured models | `proprietary` or `inferred` |
| `book` | Published texts (classical, leadership) | `inferred` |
| `credential` | Certificates and licenses | `verified` (scope-limited) |
| `training_notes` | Summarized or personal training notes | `inferred` |
| `text_source` | Any other text input | `inferred` |

## Claim Status Rules

Every statement in a generated artifact must carry one of these claim statuses:

- **verified** — The claim is explicitly documented by an authoritative source (e.g., TEEX completion certificate for 4-hour course attendance). Verified claims are limited to what the source explicitly states. A TEEX certificate verifies attendance and completion; it does not endorse products, proprietary frameworks, or external organizations.
- **inferred** — The claim is derived from the source text but was not explicitly stated. Requires care in presentation.
- **proprietary** — The claim is part of an Omega Hydra internal system (VFI9, C9, A9F, SEMP9, Tri-Axis, 9×9×9, Resolution Matrix). These are not external standards.
- **requiresReview** — The claim is ambiguous, potentially sensitive, or requires human review before use.

## Attribution Rules

1. **Classical works** (Tao Te Ching, Art of War, Book of Five Rings, Way of the Samurai) supply philosophical interpretation only. They do not certify any skill or credential.
2. **Professional certificates** (TEEX CRASE, TEEX AAER, AWR cybersecurity) establish only the credentials they explicitly document: date, duration, course title, and completion. They do not endorse products, frameworks, or downstream derivative works.
3. **Proprietary Hydra frameworks** (VFI9, C9, A9F, SEMP9, etc.) must be labeled as proprietary. They must never be represented as TEEX, TCOLE, government, or medical standards.
4. All generated artifacts must carry a `disclaimer` field referencing the appropriate attribution.

## Required Disclaimer

All Skill Forge artifacts include:

> Educational use only. Not professional, medical, or legal advice.

Sources with professional credentials must also include:

> [Source Title] establishes only the credentials explicitly stated in the source document. It does not endorse Omega Hydra products, proprietary systems, or derivative works.

## Permitted Use Scope

All artifacts may only be used for:

- Lawful defensive education
- Privacy awareness
- Digital hygiene
- Readiness training
- Business automation
- Community service
- Learning support
- Product packaging

## Blocked Content

The `classifySafety` module automatically blocks any source or artifact containing:

- Offensive cyber workflows or unauthorized access instructions
- Evasion guidance
- Weapon construction or injury-targeting instructions
- Real-world force escalation
- Medical diagnosis or treatment claims
- Misrepresentation of credentials or institutional endorsement
- Patterns designed to autonomously publish or deploy without required approval

Blocked sources receive `approvalStatus: "blocked"` and are rejected before skill generation proceeds.

## Review-Required Content

Content matching these patterns enters `pending_review` status and requires human approval before artifacts can be used:

- Medical-adjacent emergency response material
- Force-adjacent references (firearms, lethal force)
- Sensitive data or classified document references
- Credential references (TCOLE, TEEX, government, certified instructor)
