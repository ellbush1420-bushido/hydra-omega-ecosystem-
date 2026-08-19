# Omega Hydra Core

Executable MVP foundation for the Omega Hydra platform.

## Strategic Rule

Build the functioning platform first, then visualize it as a living city.

```text
Users → Identity → Companion → Mission → Tracking → Product → City Visualization
```

For software delivery, Hydra uses a provider-neutral factory loop:

```text
Work Request → Plan → Decompose → Dispatch → Build → Test → Security → Docs → Review → Human Approval → Deploy → Observe → Learn
```

## MVP Modules

```text
omega-hydra-core
├── apps
│   ├── capital-city
│   ├── guardian-simulator
│   ├── marketplace
│   ├── software-factory
│   └── agent-extensions
└── packages
    ├── hydra-identity
    ├── hydra-companion
    ├── hydra-labyrinth
    ├── hydra-eyes
    ├── hydra-zeta
    ├── hydra-software-factory
    ├── hydra-source-intel
    ├── hydra-cloud-ops
    └── hydra-continuity
```

## Hydra Software Factory Fabric

The software-factory module converts work requests from GitHub, Linear, Jira, Slack, Teams, or the Hydra Console into seven governed worker stages: planner, architect, builder, tester, security reviewer, documenter, and reviewer.

Routing remains provider-neutral. Codex, Claude Code, Warp, and future harnesses are execution providers; Hydra retains the workflow, policy, state, telemetry, governance, and institutional memory.

## Hydra Source Intel

Hydra's proprietary social/public-source ingestion layer. It classifies X, LinkedIn, Instagram, TikTok, Reddit, Hacker News, and general web sources; routes requests through user-supplied snapshots, official APIs, permitted public-web adapters, or authorized archives; extracts reusable signals; and feeds them into Hydra workflows.

Hydra Source Intel intentionally does **not** bypass logins, paywalls, CAPTCHAs, authentication, or technical access controls. When a compliant adapter is unavailable, the request stops for authorization or user-supplied content.

## Hydra Cloud Ops

Hydra's provider-neutral authorized database/infrastructure operations layer inspired by modern cloud CLIs/MCP tools. The MVP plans and governs Timescale-compatible database tasks including health checks, hypertable inspection/creation, and continuous aggregate inspection/creation.

Cloud writes require explicit approval and the default mode is dry-run. Credentials are never invented or embedded.

## Hydra Continuity

Hydra's checkpoint-and-resume runtime for long-running agent workflows. It persists completed/pending steps and state, pauses cleanly when a provider limit or dependency stops execution, and resumes only after an explicit capacity-reset, dependency-ready, or operator-approval signal.

Hydra Continuity does not evade provider quotas or usage limits; it resumes after the limiting condition has legitimately cleared and re-runs governance before privileged execution.

## Commands

```bash
npm run factory
npm run factory:test
npm run extensions
npm run extensions:test
```

Individual extension tests:

```bash
npm run source:test
npm run cloud:test
npm run continuity:test
```

## Public-Safe Operating Scope

Omega Hydra Core is limited to lawful defensive education, privacy awareness, digital hygiene, ethical decision-making, business automation, community service, readiness training, product delivery, reflective learning, authorized software engineering, public-source research, and authorized infrastructure administration.

It does not provide offensive cyber capabilities, weapon instruction, evasion guidance, injury targeting, unauthorized access workflows, malware deployment, credential theft, access-control bypass, or real-world force escalation.

## Current Executable Layers

- Hydra Identity Genesis + Companion Generator + Daily Labyrinth Mission
- Hydra Software Factory Fabric + provider/model routing + governance + telemetry
- Hydra Source Intel + compliant social/public-source ingestion
- Hydra Cloud Ops + authorized Timescale-compatible database task planning/execution adapters
- Hydra Continuity + checkpoint/resume control for long-running agent workflows
