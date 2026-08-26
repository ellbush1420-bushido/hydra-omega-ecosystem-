# Hydra/Omega Connected Sites Registry

This document records the external sites the operator reports as connected to the Hydra/Omega ecosystem. It is an integration inventory, not proof that API credentials, OAuth grants, webhooks, or write permissions have been verified.

Machine-readable source of truth:

- `config/integrations/connected-sites.json`

## Connected sites

| Site | Hydra/Omega role | Preferred connection | Current registry state |
|---|---|---|---|
| Fanvue | Creator subscriptions, audience operations, insights, publishing and checkout commerce | OAuth + hosted MCP + REST API + signed webhooks | User-reported connected; Checkout Links documented; live auth/webhooks unverified |
| Tumblr | Shadow Monastery lore, discovery, subscriber outreach | OAuth/manual publishing + tracked links | User-reported connected; live auth unverified |
| RM11 | Premium membership, private offers, conversion tracking | Provider-supported integration or manual workflow | User-reported connected; authoritative API surface not yet verified |
| Instagram | Brand discovery and short-form visual funnel | Meta-supported OAuth/manual publishing | User-reported connected; live auth/webhooks unverified |
| TikTok | Short-form discovery, campaign tests, funnel entry | Content Posting API only when eligible; otherwise draft upload/manual | User-reported connected; public Direct Post disabled pending client audit/eligibility verification |
| Telegram | Community updates, nurture, operator alerts | Bot API or manual operations | User-reported connected; Bot API 10.3 metadata recorded; live bot/webhook test pending |
| CelebMakerAI | Character and campaign asset generation | Bearer API + signed webhooks + manual export | Public API confirmed; credentials/webhook delivery unverified |
| Candy.ai | Affiliate offer and character-experience destination | Affiliate/account link; API only if authoritatively documented | User-reported connected |
| OurDream.ai | Affiliate offer and character-experience destination | Affiliate/account link; API only if authoritatively documented | User-reported connected |

## 2026-08-26 integration update

### Fanvue — Checkout Links and consent controls

Fanvue's current documentation index now includes creator Checkout Links, checkout attribution, checkout webhooks, creator webhooks, and app-payment rails. Fanvue's legal changelog records the Checkout Links launch on **2026-07-23**.

Hydra classification:

- `checkout_links.status = documented_unverified`
- Creation or modification of a paid offer remains `approval_required`.
- Checkout webhook families are tracked as payment, subscription, refund, dispute, installment, and payout.
- Do not mark checkout commerce production-ready until seller eligibility and one signed webhook delivery are verified.

Fanvue's **2026-08-11** policy update also added a dedicated appeal path for a depicted person challenging consent and extended the moderation appeal window to **14 calendar days**. Hydra therefore requires consent/release provenance whenever a workflow involves a real person or co-authored content. If valid consent cannot be established, content must not remain in the governed publishing pipeline.

References:

- `https://api.fanvue.com/docs/llms.txt`
- `https://api.fanvue.com/docs/payments/accept-payments`
- `https://api.fanvue.com/docs/webhooks/index`
- `https://legal.fanvue.com/changelog/2026/8/11`

### TikTok — photo chronology correction and audit controls

TikTok photo posting is an **existing** Content Posting API capability, not an August 2026 launch. TikTok's official changelog dates photo support to **2023-11-03**. The photo reference documentation was refreshed on **2026-08-04**.

Hydra policy remains unchanged:

- `public_direct_posting = disabled_until_client_audit_and_platform_eligibility_verified`
- Content from unaudited clients remains private-only according to the current Content Posting documentation.
- Approved draft upload/manual completion may be used where permitted.
- Post-status polling and webhooks remain part of the verification path.

References:

- `https://developers.tiktok.com/docs/en/changelog`
- `https://developers.tiktok.com/docs/en/content-posting-api-reference-photo-post`
- `https://developers.tiktok.com/doc/content-posting-api-reference-direct-post`

### Telegram — Bot API 10.3

Telegram's official Bot API changelog records **Bot API 10.3** on **2026-08-24**.

10.3 adds richer message-button/document/expandable-quotation structures and changes the ephemeral-message send model by introducing `EphemeralMessageParameters` in place of the older `receiver_user_id` / `callback_query_id` parameters on the affected send methods. It also adds the `MessageGenerationStopped` update.

Hydra requirements:

- Regression-test any approval bot or workflow using ephemeral messages.
- Handle `MessageGenerationStopped` safely if streamed/draft responses are used.
- Retain the Mini App same-origin verification introduced in 10.2; the protection became automatic on 2026-07-20.
- Keep Telegram write operations approval-gated.

Reference:

- `https://core.telegram.org/bots/api-changelog`

## Persistent connection-health state

Registry schema `1.2.0` requires these fields for every platform connection:

```json
{
  "last_verified_at": null,
  "last_successful_read": null,
  "auth_status": "not_verified",
  "webhook_status": "not_verified",
  "action_required": true,
  "verification_blocker": "live_credentials_or_runtime_not_available"
}
```

Allowed `auth_status` values:

- `not_verified`
- `healthy`
- `degraded`
- `expired`
- `revoked`
- `not_applicable`

Allowed `webhook_status` values:

- `not_verified`
- `healthy`
- `degraded`
- `disabled`
- `not_configured`
- `not_applicable`

A platform must not be promoted to `production_ready` without a successful authenticated read and, where webhooks are part of the integration, at least one verified signed webhook delivery.

## Live health-test status

No live credentialed OAuth/API/webhook test is recorded as successful by this PR yet. The repository intentionally stores no secrets, and the current GitHub connector cannot inspect or use GitHub Actions secrets or external account tokens.

Do **not** convert an unavailable test into a passing status.

Required safe tests before moving this PR out of draft:

1. **Fanvue:** complete OAuth with minimum scopes, call `GET /users/me`, record the successful UTC timestamp, verify one signed creator or checkout webhook, and record the Fanvue API version header used.
2. **Telegram:** call Bot API `getMe`, inspect `getWebhookInfo`, deliver one controlled webhook/update, and regression-test any ephemeral-message approval path against Bot API 10.3.
3. **Tumblr:** complete the supported OAuth flow and perform one read-only account/blog read.
4. **Instagram:** verify professional-account eligibility and one authenticated read through the supported Meta integration.
5. **TikTok:** verify OAuth scopes and client audit/eligibility state; keep public Direct Post disabled until eligibility is confirmed; verify post-status handling in a safe/private test.
6. **CelebMakerAI:** verify one bearer-authenticated non-destructive read/account/character request and one signed webhook delivery before any production generation automation.
7. **RM11 / Candy.ai / OurDream.ai:** remain manual/affiliate-style integrations until an authoritative developer surface and credentials are verified.

## Operating architecture

```text
Tumblr / Instagram / TikTok
          |
          v
Lore, discovery, and tracked campaign links
          |
          v
Hydra/Omega Creator OS
  |       |        |
  |       |        +--> Telegram community and alerts
  |       +-----------> Affiliate and companion destinations
  +-------------------> Fanvue / RM11 membership conversion
          |
          v
PostgreSQL analytics, audit log, health state, and campaign attribution
```

## Security rules

1. Never commit passwords, API keys, OAuth tokens, session cookies, webhook secrets, or recovery codes.
2. Store secrets in Vercel environment variables, GitHub Actions secrets, Supabase Vault, or another managed secret store.
3. Keep production and test credentials separate.
4. Require explicit operator approval before publishing, sending messages, changing prices, creating paid offers, or executing bulk actions.
5. Record every write action in an audit log with the platform, action, actor, timestamp, external ID, and outcome.
6. Use only official or explicitly permitted APIs and integrations; do not use automation intended to evade platform controls.
7. Do not mark a connection healthy because public documentation is reachable; health means the authorized Hydra connection itself was tested.

## Verification workflow

```text
user_reported_connected
        -> credentials_configured
        -> read_access_verified
        -> webhook_verified (where applicable)
        -> sandbox_write_verified (where applicable)
        -> production_ready
```

A documentation-only capability state such as `documented_unverified` or `api_available_unverified` does not satisfy a live verification gate.

## Environment-variable naming

```env
FANVUE_CLIENT_ID=
FANVUE_CLIENT_SECRET=
FANVUE_REDIRECT_URI=
FANVUE_WEBHOOK_SECRET=

TUMBLR_CONSUMER_KEY=
TUMBLR_CONSUMER_SECRET=

TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_MINI_APP_ORIGIN=

META_APP_ID=
META_APP_SECRET=

TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
TIKTOK_WEBHOOK_SECRET=

CELEBMAKER_API_KEY=
CELEBMAKER_WEBHOOK_SECRET=
```

Do not add secret values to source control.

## Recommended implementation order

1. **Fanvue:** verify OAuth read access, API version pinning, signed creator/checkout webhook delivery, and approval-gated writes.
2. **Telegram:** verify `getMe`, webhook state, Bot API 10.3 compatibility, and Mini App origin protection.
3. **Tumblr:** verify OAuth and create the Shadow Monastery lore publishing queue with tracked-link attribution.
4. **Instagram:** connect only through Meta-supported professional-account integrations and verify one read.
5. **TikTok:** keep public Direct Post disabled until audit/eligibility is verified; validate safe/private status handling first.
6. **CelebMakerAI:** verify bearer API access and signed webhooks before moving beyond `api_available_unverified`.
7. **RM11:** document the current supported integration surface before automating.
8. **Candy.ai and OurDream.ai:** begin with affiliate tracking/account links; add API adapters only after authoritative documentation and credentials exist.
