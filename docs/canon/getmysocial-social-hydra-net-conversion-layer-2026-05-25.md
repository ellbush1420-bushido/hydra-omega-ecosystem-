# GetMySocial — Social Hydra Net Conversion Layer — 2026-05-25

Classification: Link-in-Bio / Deep-Linking / Agency Conversion Infrastructure Signal
Status: Canonized as tool candidate, pending verification and free-tier test
System: Ω Hydra Totality OS → Social Hydra Net → Hydra Lightning Launch → Hydra Eyes → CEO Dashboard Commerce Console

## Canon Decision

GetMySocial is integrated into Omega Hydra as a Social Hydra Net conversion-infrastructure candidate.

It is not yet treated as a trusted production dependency. It must pass free-tier testing, platform-safety review, analytics validation, and account-risk review before being used on core Omega Hydra accounts.

## User-Provided Product Signal

The pasted landing page positions GetMySocial as a link-in-bio and creator/agency conversion tool with:

- Bento-style creator profile pages.
- Support positioning for Instagram, TikTok, YouTube, Facebook, X, Threads, Snapchat, and Reddit.
- Deep linking into native apps.
- Landing pages with 10+ themes.
- Social analytics across client accounts.
- REST API for links and analytics.
- Direct links for instant redirects.
- Advanced targeting by country, device, and language.
- QR code support.
- Bring-your-own-domain support.
- Agency dashboard, team roles, custom domains, white-label exports, and reports.
- Creator plan and agency plan positioning.

Verification tier: user-provided landing-page copy. Pricing, competitor comparison, testimonials, and platform claims require independent verification before public or client-facing use.

## Hydra Fit

GetMySocial potentially fills the gap between content traffic and monetization routing.

Hydra placement:

```text
Social post
→ GetMySocial page or direct deep link
→ native app / product / quiz / Discord
→ tracking and analytics
→ Hydra Eyes event log
→ Scale/Test/Kill decision
```

## Primary Use Cases

### 1. Campaign 001 Link-in-Bio Hub

Use GetMySocial as the public-facing link hub for:

- Hydra Mandala Faction Test.
- $9 Shadow Moon Prompt Pack.
- $27 Founder Pack.
- Discord / Oracle’s Den.
- Whop / Gumroad product pages.
- Latest Shadow Arena event.
- Featured Daily Drop.

### 2. Character-Specific Routing

Each character or faction can get its own link page or direct route.

Examples:

```text
Nyssa → Scarlet Temple page → $9 prompt pack / SCARLET role
Den Mother → Web page → Discord / Founder Pack
Lerian → Serpent page → faction quiz / lore drop
Black Sun → Tribunal page → scenario card / codex offer
```

### 3. Deep-Link Conversion Layer

The pasted page emphasizes bypassing in-app browsers and opening native apps directly.

Hydra use:

- Route users to YouTube, Spotify, WhatsApp, Discord, Gumroad, Whop, or product destinations with less friction.
- Test whether native app deep linking improves conversion from Instagram, TikTok, and Threads.

### 4. Agency Client Dashboard

The agency positioning makes GetMySocial a candidate for future AI agency services.

Hydra use:

- Manage link pages for small-business clients.
- Provide weekly analytics reports.
- Track link clicks, destination clicks, and campaign outcomes.
- Offer link-in-bio optimization as part of an AI automation service.

### 5. API Access and Stack Integration

The pasted page claims full REST API access for creating, updating, deleting links, and analytics.

Hydra integration target:

```text
GetMySocial API
→ Tracked links
→ Supabase hydra_events
→ Hydra Eyes dashboard
→ Scale/Test/Kill
→ Campaign recommendations
```

## Recommended Test Plan

### Phase 1 — Free-Tier Test

Use only the free plan first.

Test:

- 1 landing page.
- 1 direct link.
- Basic stats.
- One campaign path.

Test campaign:

```text
Campaign 001: Choose Your Crown
Link destination: Hydra Mandala Faction Test or $9 Prompt Pack
CTA: Build characters like this. Choose your Crown. Enter the Labyrinth.
```

### Phase 2 — Creator Plan Test

Only upgrade if Phase 1 confirms useful tracking.

Test:

- 5 landing pages.
- Deep linking.
- Live analytics.
- Social media stats.
- Custom domain.
- Paywall/monetization feature, if appropriate and policy-safe.

### Phase 3 — Agency Plan Review

Only consider agency tier after Omega Hydra has:

- Active content traffic.
- Multiple character/faction funnels.
- At least one working product funnel.
- Clear tracking needs across multiple pages or clients.

## Hydra Page Structure

Recommended first GetMySocial page:

```text
Header: Omega Hydra Talent Agency
Subheader: Build characters like this. Choose your Crown. Enter the Labyrinth.
Tiles:
1. Take the Hydra Mandala Faction Test
2. Get the $9 Shadow Moon Prompt Pack
3. Claim the $27 Founder Pack
4. Join Oracle’s Den on Discord
5. Enter the Latest Shadow Arena Trial
6. Read the Free Starter Codex
7. Watch the Latest Daily Drop
8. Book an AI Workflow Audit
```

## Bento Tile Model

Each tile should be treated as a measurable offer unit.

```json
{
  "tile_id": "shadow_moon_prompt_pack",
  "label": "$9 Shadow Moon Prompt Pack",
  "destination": "gumroad_or_whop_url",
  "campaign": "campaign_001_choose_your_crown",
  "sub_id": "bio_tile_prompt_pack",
  "faction": "all",
  "status": "active"
}
```

## Tracking Events

Hydra should log GetMySocial activity as:

```json
{
  "event_type": "bio_link_click",
  "source": "getmysocial",
  "campaign": "campaign_001_choose_your_crown",
  "sub_id": "bio_tile_prompt_pack",
  "user_ref": "privacy_safe_session_or_none",
  "payload": {
    "platform_origin": "instagram | tiktok | youtube | threads | x | reddit | unknown",
    "destination": "prompt_pack | founder_pack | discord | faction_quiz | audit",
    "device": "mobile | desktop | unknown",
    "country": "optional_if_available"
  }
}
```

## CEO Dashboard Integration

Add GetMySocial to these modules:

### Content Console

- Bio-link tile schedule.
- Campaign page links.
- CTA testing.

### Commerce Console

- Tile-level conversion rate.
- Product link performance.
- Offer ladder click-through.

### HydraEyes Console

- GetMySocial click feed.
- Deep-link performance.
- Platform origin performance.
- Device/location routing outcomes.

### Agency Console

- Client link pages.
- Weekly reports.
- Custom domain status.
- API sync status.

## Comparison Claims Handling

The pasted landing page compares GetMySocial to Linktree and link.me with pricing and feature claims verified as of 2026-05-23.

Hydra rule:

```text
Do not repeat comparison/pricing claims publicly until verified directly from current source pages.
```

Safe internal use:

- Use comparison claims for internal research and due diligence.
- Verify before using in offers, client proposals, or sales pages.

## Risk Review

Before connecting important accounts, verify:

- Domain reputation.
- Terms of Service.
- Privacy policy.
- Data ownership and export options.
- API rate limits.
- Analytics retention period.
- Whether deep links violate any social platform rules.
- Whether automated routing affects account trust.
- Whether paywall/monetization features are payment-processor safe.
- Whether agency reports expose private client data.

## Scale/Test/Kill Criteria

### Scale

Use GetMySocial more if:

- Click-through improves.
- Product conversions improve.
- Native app deep linking reduces friction.
- Analytics export/API works cleanly.
- Custom domain works reliably.
- No account trust issues appear.

### Test

Keep testing if:

- Clicks improve but conversions are unclear.
- Analytics do not match Supabase or platform data.
- Deep links work on some apps but not others.

### Kill

Stop using if:

- Links are flagged.
- Redirects break.
- Analytics are unreliable.
- Platform accounts show risk signals.
- Data export/API access is insufficient.
- It adds friction instead of reducing it.

## Public-Safe Use Rules

Allowed:

- Link-in-bio routing.
- Campaign landing pages.
- Product links.
- Discord/community routing.
- AI education offers.
- Prompt packs and codex products.
- Small-business AI audit links.
- Analytics and reports.

Avoid:

- Using it for spam automation.
- Deceptive redirects.
- Misleading paywalls.
- Adult-service promotion in public Hydra channels.
- Nonconsensual likeness content.
- Unverified competitor claims in public copy.
- Exposing private customer or client analytics.

## Canon Status

Integrated into:

- Social Hydra Net.
- Hydra Lightning Launch.
- Hydra Eyes Intelligence Layer.
- CEO Dashboard Commerce Console.
- CEO Dashboard Content Console.
- CEO Dashboard Agency Console.
- Campaign 001 “Choose Your Crown.”
- Shadow Moon Product Division.
- $9 Prompt Pack / $27 Founder Pack routing.
- AI Automation Agency audit lane.

GetMySocial becomes a candidate routing layer for turning social attention into measurable product, community, and service actions. It is approved for controlled testing, not yet approved as the primary infrastructure dependency.
