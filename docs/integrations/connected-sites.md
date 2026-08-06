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
| TikTok | Short-form discovery, campaign tests, funnel entry | Supported OAuth/manual publishing | User-reported connected |
| Telegram | Community updates, nurture, operator alerts | Bot API or manual operations | User-reported connected |
| CelebMakerAI | Character and campaign asset generation | Account connection, API if offered, or manual export | User-reported connected |
| Candy.ai | Affiliate offer and character-experience destination | Affiliate/account link; API if offered | User-reported connected |
| OurDream.ai | Affiliate offer and character-experience destination | Affiliate/account link; API if offered | User-reported connected |

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

META_APP_ID=
META_APP_SECRET=

TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
```

Do not add variables for a provider until the provider supplies a documented integration method.

## Recommended implementation order

1. **Fanvue:** verify OAuth read access, MCP/API tools, cursor pagination, token refresh, and approval-gated writes.
2. **Telegram:** establish operator alerts and approval notifications through a bot.
3. **Tumblr:** create the Shadow Monastery lore publishing queue and tracked-link attribution.
4. **Instagram and TikTok:** connect only through their supported creator/business integrations.
5. **RM11:** document current supported integration surface before automating.
6. **CelebMakerAI, Candy.ai, and OurDream.ai:** begin with asset imports, affiliate tracking, or account links; add API adapters only when official documentation is available.

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
  "last_verified_at": "2026-08-05T21:00:00Z",
  "write_actions_require_approval": true
}
```

The repository should store only the secret reference, never the secret value.
