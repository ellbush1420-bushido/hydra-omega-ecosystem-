# Hydra Creator App Migration Pack v69.0
## 004_route_handler_contract.md

## Purpose
Define the route handler contract for the Hydra Creator App and the Warp.dev Limitless Quadratic Hydra CEO Meta OS.

The route handler converts signals into decisions and actions across the loop:

```text
Signal Intake -> Behavior Tracking -> Automation Routing -> Engagement Optimization -> Product Deployment -> Community Retention -> Revenue Expansion -> feedback
```

---

## Core Principle
Every external interaction becomes a structured event, then a route decision.

Examples:

- Instagram keyword comment,
- ManyChat story reply,
- Discord join,
- product click,
- Academy waitlist form,
- capstone submission,
- GitHub deployment event,
- Context Orbit doctrine update.

---

## Required Route Handler Shape

```ts
type HydraRouteRequest = {
  source: 'manychat' | 'instagram' | 'discord' | 'stripe' | 'gumroad' | 'whop' | 'github' | 'warp' | 'notion' | 'manual';
  event_type: string;
  profile_ref?: string;
  campaign_id?: string;
  content_id?: string;
  product_id?: string;
  payload: Record<string, unknown>;
  occurred_at?: string;
};

type HydraRouteDecision = {
  accepted: boolean;
  loop_stage: 'identity' | 'automation' | 'engagement' | 'retention' | 'monetization' | 'expansion';
  route_key: string;
  destination_type: 'manychat_flow' | 'discord_role' | 'product_offer' | 'academy_path' | 'agency_lead' | 'warp_job' | 'notion_registry' | 'context_orbit_node';
  destination_ref: string;
  signal_strength: number;
  actions: HydraRouteAction[];
  metadata?: Record<string, unknown>;
};

type HydraRouteAction = {
  action_type: 'insert_event' | 'update_profile' | 'assign_tag' | 'send_message' | 'grant_role' | 'create_task' | 'queue_job' | 'create_context_node' | 'create_context_edge';
  target: string;
  data: Record<string, unknown>;
};
```

---

## Required Handler Endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/hydra/events` | Ingest raw events into `hydra_events` |
| `POST /api/hydra/route` | Return route decision and actions |
| `POST /api/hydra/manychat/webhook` | Receive ManyChat payloads |
| `POST /api/hydra/discord/webhook` | Receive Discord lifecycle events |
| `POST /api/hydra/payments/webhook` | Receive product/revenue events |
| `POST /api/hydra/warp/jobs` | Queue Warp execution jobs |
| `GET /api/hydra/dashboard` | Return executive dashboard telemetry |
| `GET /api/hydra/context-orbit` | Return graph nodes/edges for dashboard |

---

## Route Decision Logic

1. Normalize payload.
2. Identify or create `hydra_profiles` record.
3. Insert `hydra_events` row.
4. Look up active route in `hydra_routes`.
5. Apply route priority and trigger rules.
6. Emit route decision.
7. Queue follow-up action if needed.
8. Update Context Orbit when signal has durable strategic value.

---

## Canonical Route Examples

### Instagram Comment to Faction Quiz

```json
{
  "source": "instagram",
  "event_type": "keyword_comment",
  "payload": { "keyword": "CROWN", "post_id": "campaign-001-reel-01" }
}
```

Decision:

```json
{
  "accepted": true,
  "loop_stage": "automation",
  "route_key": "ig-crown-to-faction-quiz",
  "destination_type": "manychat_flow",
  "destination_ref": "choose-your-crown-flow",
  "signal_strength": 0.78
}
```

### Workshop Waitlist to Academy Path

```json
{
  "source": "manual",
  "event_type": "academy_waitlist_joined",
  "campaign_id": "hydra-ai-operator-workshop"
}
```

Decision:

```json
{
  "accepted": true,
  "loop_stage": "monetization",
  "route_key": "academy-waitlist-to-certification-path",
  "destination_type": "academy_path",
  "destination_ref": "hydra-builder-certification-v1",
  "signal_strength": 0.86
}
```

---

## Privacy Rules

- Do not expose internal route decisions to anonymous users.
- Service-role credentials should process webhooks and worker writes.
- Context Orbit writes must classify retention and privacy tier.
- Ephemeral route data should be purgeable.
- Persistent strategic events should be explicitly tagged as canon or operational memory.

---

## Dashboard Requirements

`GET /api/hydra/dashboard` should return:

- signal counts by source,
- events by loop stage,
- route conversion rates,
- product deployment status,
- community retention signals,
- revenue expansion metrics,
- Academy pipeline metrics,
- Super Agent job status,
- privacy governance indicators,
- Context Orbit graph summary.

---

## Status
Canonical route handler contract for Hydra Creator App v69.0.
