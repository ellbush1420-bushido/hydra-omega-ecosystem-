# Hydra Software Factory Fabric

Provider-neutral agent-fleet orchestration for Omega Hydra Core.

## Purpose

Turn software work requests from GitHub, Linear, Jira, Slack, Teams, ingest signals, or the Hydra Console into a governed execution pipeline:

```text
Issue / Signal Cluster → Plan → Decompose → Dispatch → Build → Test → Security → Docs → Review → Human Approval → Deploy → Observe → Learn
```

Hydra owns workflow, policy, state, telemetry, and institutional memory. Codex, Claude Code, Warp, or a local generic harness attach through adapters.

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
| Deploy | Deployer |
| Observe | Observer |

## Built-in local adapter

If a named vendor adapter is missing, the factory falls back to the built-in `generic` local adapter. A missing adapter no longer marks work `planned` and pretends it was cleared. It either executes locally or **blocks**.

## Signal batching

`clusterSignals` / `runSignalBatch` collapse many ingest items (for example 31 unprocessed signals) into topic/source clusters instead of 31 full factory runs.

## Persistence

Pass `store: createFileRunStore(dir)` to write each run as JSON under `.hydra/factory-runs` (or a custom directory).

## Governance

The runtime evaluates every stage for:

- safe software-engineering scope
- explicit target workspace for build work
- scoped secret approval
- production-write / production-deploy approval
- passing tests before review and deploy
- passing security review before review and deploy

Production writes never become autonomous merely because a model or harness can perform them.

## Hydra Eyes Metrics

The factory reports:

- completion rate
- failure rate
- retry rate (`retryCount / attempts`)
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
