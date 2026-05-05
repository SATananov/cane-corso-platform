# Step 71 — Public Surface Content Runtime Smoke

Status: ready for local QA.

## Purpose

Step 70 proved that the anonymous public routes are reachable after the session boundary lock. Step 71 adds the next layer: the public routes must render meaningful public content and must not accidentally show protected member/admin access notices or server error shells.

This keeps the product safe before moving into deeper detail pages, admin action flows, or owner submission flows.

## Scope

This step is QA-only.

Touched files:

- `package.json`
- `scripts/qa-demo-public-surface-content-smoke.mjs`
- `docs/qa/step71-public-surface-content-runtime-smoke.md`

No Registry, Certificate, Verify, Gallery, Admin moderation, Ecosystem API/DB, Auth/session implementation, or visual UI logic is changed.

## Public surfaces covered

The runtime smoke checks anonymous public rendering for:

- `/`
- `/access`
- `/platform`
- `/registry`
- `/gallery`
- `/certified`
- `/knowledge`
- `/partners`
- `/community`
- `/verify`
- `/guide`
- `/faq`
- `/manifesto`

For each surface the script verifies:

- HTTP 2xx response;
- no redirect to `/access`;
- no server/error shell;
- no protected-route notice copy;
- non-empty HTML document;
- at least one expected public content hint for that route.

## Commands

Static guardrails:

```powershell
pnpm demo:public-surface-content:static:qa
```

Runtime smoke, with the app running:

```powershell
$env:CCP_DEMO_RUNTIME_BASE_URL = "http://localhost:3000"
pnpm demo:public-surface-content:qa
```

Recommended validation chain after Step 71:

```powershell
pnpm demo:public-surface-content:static:qa
pnpm demo:public-surface-content:qa
pnpm demo:public-runtime-access:static:qa
pnpm demo:public-runtime-access:qa
pnpm demo:session-boundary-release:qa
pnpm demo:role-separation:static:qa
pnpm demo:role-separation:qa
pnpm demo:admin-runtime-session:static:qa
pnpm demo:admin-runtime-session:qa
pnpm demo:runtime-session:static:qa
pnpm demo:runtime-session:qa
pnpm access:login-ui:qa
pnpm workspace:syntax
pnpm typecheck
```

## Dependency on previous locks

Step 71 is built on top of:

- Step 66 — Demo Runtime Session / Member Area Smoke — PASS / LOCK
- Step 67 — Admin Runtime Session / Protected Admin Surface Smoke — PASS / LOCK
- Step 68 — Runtime Role Separation Smoke — PASS / LOCK
- Step 69 — Session Boundary Release Lock — PASS / LOCK
- Step 70 — Public Runtime Access Smoke — PASS / LOCK

If runtime fails with `fetch failed`, the app is probably not running. Start `pnpm dev` and rerun the runtime smoke in a second terminal.


## Step 71.1 false-positive guardrail note

The runtime smoke treats HTTP status as the source of truth for server failures and only flags visible rendered error shells for 2xx pages. This avoids false positives caused by normal Next.js HTML/dev payload strings while preserving the Step 71 public content boundary.
