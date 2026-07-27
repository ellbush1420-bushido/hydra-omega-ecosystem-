# Hydra Fanvue Commercial Bridge

**Status:** MVP architecture doctrine  
**Updated:** 2026-07-27  
**Operating scope:** lawful creator operations, automation, analytics, productivity, CRM, and creator-reviewed AI assistance.

## System Map

```text
TikTok / Instagram / X
          │
          ▼
     Landing Page
          │
          ▼
    Fanvue OAuth
          │
          ▼
        n8n
   ┌──────┼─────────┐
   │      │         │
   ▼      ▼         ▼
OpenAI  Supabase  Discord
   │
   ▼
Hydra CRM / Analytics
```

## Purpose

The Fanvue bridge connects creator traffic, OAuth-authorized Fanvue data, n8n automations, Supabase CRM tables, Discord community actions, and OpenAI-assisted drafting into one Hydra Creator OS pipeline.

This bridge is a **creator productivity and analytics system**, not an autonomous adult-content or impersonation engine.

## Verified Fanvue API Requirements

Fanvue API access requires a Fanvue creator account with completed KYC before using the Builder area, creating OAuth apps, managing credentials, or publishing apps.

Fanvue API calls use OAuth 2.0 access tokens. Authenticated REST calls use:

```http
Authorization: Bearer <access_token>
X-Fanvue-API-Version: 2025-06-26
```

The OAuth flow uses authorization code + PKCE. Store the `code_verifier` server-side or in secure HTTP-only cookies; never place it in local storage, a URL, or persistent client-side JavaScript.

Refresh tokens rotate and are single-use. After every refresh, store the new refresh token and discard the old one. Coordinate concurrent refresh attempts so multiple workers do not reuse the same token chain.

Fanvue supports scopes for self, chat, fan, creator, media, post, insights, tracking links, and agency access. Hydra must request the minimum scopes required for the specific product tier.

## Core Product Layers

### 1. Hydra Creator Dashboard

Displays:

- account connection status
- subscriber count
- follower count
- revenue trends
- chat workload
- recent purchases
- campaign attribution
- tracking-link performance
- engagement signals
- operational warnings

### 2. Hydra Automation Hub

n8n routes Fanvue events and scheduled jobs into Supabase, Discord, OpenAI, email, and analytics.

Initial workflows:

- new subscriber onboarding
- daily analytics digest
- campaign attribution sync
- unread chat workload summary
- Discord role or notification sync
- CRM tag updates

### 3. Hydra Content Forge

AI-assisted but creator-reviewed operations:

- caption ideas
- campaign briefs
- content calendar drafts
- message-reply suggestions
- conversation summaries
- offer copy drafts
- performance insights

Human review is mandatory for outbound messages, mass messages, profile changes, posts, and monetized offers.

### 4. Hydra CRM / Analytics

Supabase stores normalized creator, fan, campaign, purchase, engagement, and automation records.

Hydra analytics should prioritize:

- source attribution
- subscriber retention
- content conversion
- purchase history
- fan tags and notes
- revenue by campaign
- workflow success/failure
- creator workload reduction

## MVP OAuth Scope Ladder

### Read-only analytics MVP

Use this first:

```text
openid offline_access offline read:self read:creator read:insights read:tracking_links
```

### CRM and chat summary MVP

Add only after consent and privacy review:

```text
read:fan read:chat
```

### Creator-reviewed action MVP

Add write scopes only when the UI contains explicit approval gates:

```text
write:tracking_links write:post write:chat write:media
```

### Agency mode

Use only when operating as a lawful agency with managed creator consent:

```text
read:agency write:agency
```

## Compliance and Safety Boundaries

Allowed:

- creator dashboards
- subscriber analytics
- lawful CRM
- source attribution
- draft-only AI assistance
- creator-approved outbound messages
- creator-approved posts
- creator-approved promotions
- Discord community automation
- workflow summaries and reporting

Not allowed:

- impersonating a creator without disclosure or approval
- autonomous intimate or manipulative messaging
- scraping non-consented personal data
- bypassing Fanvue policies or paywalls
- storing raw private content longer than necessary
- exposing access tokens, refresh tokens, or client secrets
- automating unsafe adult-service operations
- targeting minors or attempting age-verification bypass
- creating deceptive engagement or spam systems

## Token Storage Doctrine

Store these in Supabase or a managed secrets service with encryption at rest:

- Fanvue user UUID
- OAuth client ID reference
- encrypted access token
- encrypted refresh token
- token expiry timestamp
- approved scopes
- connection status
- refresh lock state
- last successful refresh
- last sync cursor

Do **not** store the OAuth client secret in GitHub, frontend code, local storage, browser session storage, or logs.

## Rate-Limit Doctrine

Fanvue rate limits are per authorizing user/app, with headers reporting limit, remaining, reset, and retry-after values.

Hydra rules:

- prefer webhooks over polling
- pull deltas, not entire histories
- respect `Retry-After`
- slow down before `X-RateLimit-Remaining` reaches zero
- use per-creator routes for high-volume creator-specific agency work where applicable
- log rate-limit events to Hydra CRM analytics

## Event Flow: New Subscriber

```text
Fanvue webhook / sync job
      ↓
n8n validation
      ↓
Supabase upsert: hydra_fanvue_fans
      ↓
Supabase insert: hydra_fanvue_events
      ↓
OpenAI draft welcome suggestion
      ↓
Creator review queue
      ↓
Approved message / Discord action / CRM tag
      ↓
Hydra analytics event
```

## Event Flow: Daily Analytics

```text
n8n Cron
   ↓
Fanvue insights endpoints
   ↓
Supabase snapshot
   ↓
OpenAI summary
   ↓
Email / Discord report
   ↓
Hydra CRM KPI log
```

## MVP Build Order

1. Create Fanvue creator account and complete KYC.
2. Create Fanvue OAuth app in the Builder area.
3. Configure redirect URI: `/api/oauth/fanvue/callback`.
4. Request read-only scopes first.
5. Implement OAuth connect and callback.
6. Store encrypted tokens and refresh state.
7. Add Fanvue API client wrapper with API-version header and rate-limit handling.
8. Build Supabase CRM tables.
9. Add n8n new-subscriber and daily-analytics workflows.
10. Add dashboard cards.
11. Add AI draft-only assistant.
12. Add human approval gates before write scopes.
13. Add Discord role/report workflow.
14. Add Hydra analytics and attribution reports.

## Revenue Ladder

### Free / Lead Magnet

Hydra Creator Funnel Map and checklist.

### Entry Product — $9 to $29

Creator automation setup guide, tracking-link worksheet, and content calendar template.

### Service — $297 to $997

Creator dashboard setup, n8n automation setup, and CRM configuration.

### Subscription — $49 to $199 per month

Daily/weekly analytics, CRM updates, content calendar assistance, and workflow monitoring.

### Agency / Advanced

Managed creator operations with strict consent, audit logs, and approval gates.

## First Sprint Definition of Done

- OAuth architecture documented
- minimum scope ladder defined
- Supabase table migration drafted
- n8n workflow blueprints drafted
- safety boundaries documented
- next engineering ticket created for OAuth callback and token vault

## Standing Rule

Hydra may assist, summarize, draft, analyze, route, and report. Hydra must not secretly impersonate, manipulate, bypass platform controls, or send consequential creator/fan communications without creator approval.
