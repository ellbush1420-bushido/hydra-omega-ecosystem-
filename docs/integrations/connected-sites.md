# Hydra/Omega Connected Sites Registry

This document records the external sites the operator reports as connected to the Hydra/Omega ecosystem. It is an integration inventory, not proof that API credentials, OAuth grants, webhooks, or write permissions have been verified.

The machine-readable source of truth is:

- `config/integrations/connected-sites.json`

## Connected sites

| Site | Hydra/Omega role | Preferred connection | Current registry state |
|---|---|---|---|
| Fanvue | Creator subscriptions, audience operations, insights, publishing workflow | OAuth + hosted MCP/API | User-reported connected |
| Tumblr | Shadow Monastery lore, discovery, subscriber outreach | OAuth/manual publishing + tracked links | User-reported connected |
| RM11 | Premium membership, private offers, conversion tracking | Provider-supported integration or manual workflow | User-reported connected |
| Instagram | Brand discovery and short-form visual funnel | Meta-supported OAuth/manual publishing | User-reported connected |
| TikTok | Short-form discovery, campaign tests, funnel entry | Content Posting API only when eligible; otherwise draft upload/manual | User-reported connected; public Direct Post disabled pending client audit/eligibility verification |
| Telegram | Community updates, nurture, operator alerts | Bot API or manual operations | User-reported connected; Bot API 10.2 metadata recorded |
| CelebMakerAI | Character and campaign asset generation | Bearer API + signed webhooks + manual export | User-reported connected; public API confirmed, credentials not verified |
| Candy.ai | Affiliate offer and character-experience destination | Affiliate/account link; API if offered | User-reported connected |
| OurDream.ai | Affiliate offer and character-experience destination | Affiliate/account link; API if offered | User-reported connected |

## 2026-08-10 integration update

### Telegram

Telegram's official Bot API changelog records **Bot API 10.2** on **2026-07-14**. The release hardened Mini App security by disallowing Mini App methods from origins different from the original Mini App domain, with automatic protection enabled on **2026-07-20**.

Hydra requirement:

- Verify every Telegram Mini App's configured origin exactly matches the deployed origin.
- Do not opt out of origin protection unless a specific reviewed use case requires it.
- Keep Telegram write operations approval-gated.

Reference: `https://core.telegram.org/bots/api-changelog`

### CelebMakerAI

CelebMakerAI now publicly documents a developer API. The public developer surface includes bearer API-key authentication, character listing, image generation, image-edit jobs, video jobs, job polling, credit checks, and signed webhooks. Provider documentation also states API media expires after 30 days.

Hydra classification is therefore upgraded from `api_if_available` to **`api_available_unverified`**. This confirms the provider exposes an API; it does **not** confirm Hydra credentials or live API access.

Required verification before production use:

1. Create a dedicated API key outside the repository.
2. Verify one read-only/account or character request.
3. Run one approved test generation workflow.
4. Configure a signed webhook receiver and verify signature validation.
5. Persist required output before provider media retention expires.

References:

- `https://celebmakerai.com/developers`
- `https://celebmakerai.com/developers/ai-influencer-api`

### TikTok

TikTok's official Content Posting documentation states that content posted by **unaudited clients is restricted to private viewing mode**. Public Direct Post must remain disabled until the API client completes the required audit and Hydra's use case is confirmed eligible.

TikTok provides both polling and Content Posting webhooks for post status. Hydra should ingest the final posting events into the event/audit ledger and treat webhook processing as idempotent.

Hydra policy:

- `public_direct_posting = disabled_until_client_audit_and_platform_eligibility_verified`
- Allow approved draft upload/manual completion where permitted.
- Require explicit creator consent before upload or publishing.
- Track `post.publish.complete`, `post.publish.failed`, and `post.publish.inbox_delivered` events.

References:

- `https://developers.tiktok.com/doc/content-posting-api-reference-direct-post`
- `https://developers.tiktok.com/doc/content-posting-api-reference-get-video-status`
- `https://developers.tiktok.com/doc/content-sharing-guidelines/`

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
PostgreSQL analytics, audit log, and campaign attribution
```

## Security rules

1. Never commit passwords, API keys, OAuth tokens, session cookies, webhook secrets, or recovery codes.
2. Store secrets in Vercel environment variables, GitHub Actions secrets, Supabase Vault, or another managed secret store.
3. Keep production and test credentials separate.
4. Require explicit operator approval before publishing, sending messages, changing prices, creating paid offers, or executing bulk actions.
5. Record every write action in an audit log with the platform, action, actor, timestamp, external ID, and outcome.
6. Use only official or explicitly permitted APIs and integrations; do not use automation intended to evade platform controls.

## Verification workflow

Each site should move through these states:

```text
user_reported_connected
        -> credentials_configured
        -> read_access_verified
        -> sandbox_write_verified
        -> production_ready
```

An additional capability status such as `api_available_unverified` may be used when public API documentation is confirmed but Hydra credentials have not been tested.

Do not mark a platform `production_ready` until all of the following are documented:

- Account owner and responsible operator
- Authentication method
- Granted scopes or permissions
- Callback and webhook URLs
- Token refresh or rotation behavior
- Rate limits
- Read test result
- Safe write test result
- Revocation procedure
- Data retention and deletion procedure

## Environment-variable naming

Use platform-specific prefixes. Examples:

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

1. **Fanvue:** verify OAuth read access, MCP/API tools, cursor pagination, token refresh, and approval-gated writes.
2. **Telegram:** establish operator alerts and approval notifications through a bot; verify Mini App origin protection if a Mini App is used.
3. **Tumblr:** create the Shadow Monastery lore publishing queue and tracked-link attribution.
4. **Instagram:** connect only through Meta-supported creator/business integrations.
5. **TikTok:** keep public Direct Post disabled until audit/eligibility is verified; use approved draft upload/manual completion where appropriate.
6. **CelebMakerAI:** verify bearer API access and signed webhooks before moving beyond `api_available_unverified`.
7. **RM11:** document current supported integration surface before automating.
8. **Candy.ai and OurDream.ai:** begin with affiliate tracking or account links; add API adapters only when official documentation is available.

## Data model

A normalized connection record should contain:

```json
{
  "platform_id": "fanvue",
  "account_label": "primary-creator",
  "status": "read_access_verified",
  "auth_method": "oauth2_pkce",
  "granted_scopes": ["read:self"],
  "secret_reference": "vault://fanvue/primary",
  "last_verified_at": "2026-08-10T16:08:00Z",
  "last_successful_read": "2026-08-10T16:08:00Z",
  "auth_status": "healthy",
  "webhook_status": "healthy_or_not_configured",
  "action_required": false,
  "write_actions_require_approval": true
}
```

The repository should store only the secret reference, never the secret value.
