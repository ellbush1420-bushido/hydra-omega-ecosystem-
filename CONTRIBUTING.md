# Contributing to the CEO Dashboard Ecosystem

This guide defines the contribution rules for the CEO Dashboard, Supabase backend, tracking worker, automation bundle, and related Omega Hydra platform modules.

The goal is architectural consistency, safe release flow, and zero-downtime execution across every module.

## Branching Framework

All work must happen on a dedicated branch created from `dev`.

Use one of these branch prefixes:

- `feature/` for new functionality, screens, modules, dashboards, automations, or product additions.
- `fix/` for bug fixes, policy corrections, build fixes, and regression patches.
- `infra/` for CI/CD, deployment automation, worker routing, Supabase migrations, monitoring, and platform operations.

Examples:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/command-screen-ui
```

```bash
git checkout -b fix/supabase-policy-leak
```

```bash
git checkout -b infra/worker-routing-logic
```

After feature testing, open pull requests directly into `dev`.

Production releases flow from `dev` into `main` after validation.

## Local Development Cycle

### 1. Environment setup

Copy the example environment file, install dependencies, and initialize the local app context.

```bash
cp .env.example .env
npm install
```

For monorepo modules, run commands from the relevant project folder.

Example:

```bash
cd omega-hydra-app
npm ci
npm run lint
npm run build
```

### 2. Environment variables

Never commit secrets.

Use `.env.example` for placeholder keys only. Local `.env` files must remain ignored.

Required runtime categories:

- Supabase project URL
- Supabase anon key
- Supabase service role key for server-side scripts only
- Worker endpoint
- Redirect tracking domain
- ManyChat webhook or tracked-link endpoint
- Expo/EAS project configuration when building mobile releases

### 3. Validation before commit

Run the full local quality gate before pushing.

```bash
npm run lint
npm run typecheck
npm run build
```

If the module uses Rust or workspace tools, also run:

```bash
cargo test --workspace
```

If scripts are changed, run the relevant script locally with safe test credentials.

```bash
node scripts/health-check.js
```

## Pull Request Rules

Every pull request must target `dev` unless it is an approved production release PR from `dev` into `main`.

PRs must include:

- Linked issue or clear work reference.
- Summary of changes.
- Testing notes.
- Screenshots or recordings for UI changes.
- Migration notes for Supabase schema or policy changes.
- Worker/deployment notes for automation or redirect-routing changes.
- Labels: `feature`, `fix`, or `infra`.

Do not merge a PR until CI passes.

## Required Checks

The CI workflow should run on pull requests to `dev` and `main`.

Required gates:

- Install dependencies.
- Lint.
- Typecheck.
- Build.
- Optional workspace tests.
- Optional worker health checks.

## Release Flow

### Feature integration

```text
feature/*, fix/*, infra/* -> dev
```

Use squash merge for clean integration commits.

### Production release

```text
dev -> main
```

Production release PRs should include:

- Release summary.
- Migration checklist.
- Worker deployment notes.
- Rollback plan.
- Known risks.

Deployments should only run from `main`.

## Supabase Rules

All database changes must be committed through the Supabase folder or module-specific migration path.

Expected files:

- `supabase/schema.sql`
- `supabase/policies.sql`
- `supabase/seed.sql`

Rules:

- Schema changes must be reviewed before production deployment.
- Row Level Security policy changes require explicit testing notes.
- Service role keys must never be exposed to the client app.
- Seed data must be safe for development and staging.
- Production migrations must include rollback notes when practical.

## Worker and Automation Rules

Worker changes must document:

- Endpoint path changed.
- Redirect behavior changed.
- Tracking event shape changed.
- ManyChat routing impact.
- Supabase write behavior.
- Health check behavior.

Worker deployments must run after schema validation when database dependencies exist.

## CEO Dashboard Module Rules

Follow the dashboard structure below for new screens and modules:

```text
src/
  components/
  screens/
    Command/
    HydraEyes/
    World/
    Arena/
    Commerce/
    Content/
    Roster/
    Action/
  store/
  services/
  theme/
  lib/
```

Screen modules should keep view logic separate from service logic.

Recommended split:

- `screens/` for route-level UI.
- `components/` for reusable UI.
- `store/` for Zustand state.
- `services/` for Supabase and API clients.
- `theme/` for design tokens.
- `lib/` for utilities, adapters, and validators.

## Commit Message Guide

Use clear, action-oriented commit messages.

Examples:

```text
Add Command screen navigation shell
Fix Supabase policy leak on hydra_events
Add worker health check script
Update dashboard branch governance docs
```

## Security Rules

Do not commit:

- `.env` files.
- Supabase service role keys.
- Access tokens.
- Private webhook secrets.
- Production database dumps.
- Personal user data.
- Logs containing sensitive identifiers.

Security fixes should use `fix/` or `infra/` branches depending on scope.

## Branch Protection Baseline

Recommended repository rules:

### `main`

- Require pull requests.
- Require CI to pass.
- Require linear history.
- Require at least one code review.
- Restrict direct pushes.

### `dev`

- Require pull requests.
- Require CI to pass.
- Allow squash merges.
- Auto-delete merged feature branches.

### Feature branches

- No required protection.
- Naming prefix required by team convention.
- Delete after merge.

## Definition of Done

A change is complete when:

- Code or documentation is committed to the correct branch.
- PR targets `dev`.
- CI passes.
- Testing notes are present.
- Secrets are not exposed.
- Screenshots or logs are attached when relevant.
- Any Supabase, worker, or deployment impact is documented.

## Zero-Downtime Execution Loop

For production-sensitive changes, use this loop:

1. Build feature branch from `dev`.
2. Validate locally.
3. Open PR into `dev`.
4. Pass CI.
5. Review schema, worker, and app impact.
6. Merge into `dev`.
7. Release PR from `dev` into `main`.
8. Deploy schema.
9. Deploy worker.
10. Build app.
11. Run health check.
12. Monitor logs and rollback if needed.
