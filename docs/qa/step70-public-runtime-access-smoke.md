# Step 70 — Public Runtime Access Smoke after Session Boundary Lock

Status: ready for local QA.

## Purpose

Step 70 protects the public side immediately after the Step 66–69 auth/runtime session boundary was locked.

The goal is simple:

- public pages must remain reachable for anonymous visitors;
- member/admin protected pages remain governed by the already locked runtime auth boundary;
- the test must not rely on implementation-specific route markers;
- runtime HTTP responses are the source of truth for public access.

## Scope

This step is QA-only.

Touched files:

- `package.json`
- `scripts/qa-demo-public-runtime-access-smoke.mjs`
- `docs/qa/step70-public-runtime-access-smoke.md`

No Registry, Certificate, Verify, Gallery, Admin moderation, Ecosystem API/DB, Auth/session implementation, or visual UI logic is changed.

## Public routes covered

The runtime smoke checks anonymous GET access for:

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

Each route should return a successful response and should not redirect anonymous visitors to `/access`.

## Commands

Static guardrails:

```powershell
pnpm demo:public-runtime-access:static:qa
```

Runtime smoke, with the app running:

```powershell
$env:CCP_DEMO_RUNTIME_BASE_URL = "http://localhost:3000"
pnpm demo:public-runtime-access:qa
```

Recommended validation chain after Step 70:

```powershell
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

Step 70 is built on top of:

- Step 66 — Demo Runtime Session / Member Area Smoke — PASS / LOCK
- Step 67 — Admin Runtime Session / Protected Admin Surface Smoke — PASS / LOCK
- Step 68 — Runtime Role Separation Smoke — PASS / LOCK
- Step 69 — Session Boundary Release Lock — PASS / LOCK

If Step 70 runtime fails with `fetch failed`, the app is probably not running. Start `pnpm dev` and rerun the runtime smoke in a second terminal.
