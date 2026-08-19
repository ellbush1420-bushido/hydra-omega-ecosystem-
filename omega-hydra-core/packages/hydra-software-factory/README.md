# Hydra Software Factory Fabric

Provider-neutral agent-fleet orchestration for Omega Hydra Core.

## Purpose

Turn software work requests from GitHub, Linear, Jira, Slack, Teams, or the Hydra Console into a governed execution pipeline:

```text
Issue → Plan → Decompose → Dispatch → Build → Test → Security → Docs → Review → Human Approval → Deploy → Observe → Learn
```

The MVP does not hard-code an AI vendor. Hydra owns workflow, policy, state, telemetry, and institutional memory. Codex, Claude Code, Warp, or future coding harnesses attach through adapters.

## Worker Fleet

| Stage | Role |
|---|---|
| Plan | Planner |
| Architecture | Architect |
| Build | Builder |
| Test | Tester |
| Security | Security Reviewer |
| Docs | Documenter |
| Review | Reviewer |

## Governance

The runtime evaluates every stage for:

- safe software-engineering scope
- explicit target workspace for build work
- scoped secret approval
- production-write approval
- passing tests before final review
- passing security review before final review

Production writes never become autonomous merely because a model or harness can perform them.

## Provider Routing

The built-in registry contains adapter slots for:

- `codex`
- `claude-code`
- `generic`

Model routing is scored by quality, latency, cost efficiency, context fit, and tool reliability. The built-in `balanced`, `deep`, and `fast` entries are routing profiles rather than claims about specific vendors.

## Runtime Integration

Pass real harness implementations through `adapters`:

```js
const run = await runSoftwareFactory(request, {
  adapters: {
    codex: codexAdapter,
    "claude-code": claudeAdapter,
    generic: fallbackAdapter
  },
  logEvent
});
```

An adapter only needs an async `execute({ task, request, route, context })` method returning:

```js
{
  status: "completed" | "retry" | "failed",
  retryable: false,
  message: "...",
  artifact: {}
}
```

## Hydra Eyes Metrics

The factory reports:

- completion rate
- failure rate
- retry rate
- cycle time
- defect count
- governance stops
- per-stage model/harness routes

## Run

From `omega-hydra-core`:

```bash
node apps/software-factory/src/index.js
node packages/hydra-software-factory/test/smoke.mjs
```

No external dependency is required for the MVP smoke path.
