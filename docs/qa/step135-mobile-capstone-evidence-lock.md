# Step 135 — Mobile Capstone Evidence Lock

## Purpose

Step 135 strengthens the SoftUni Capstone mobile-app evidence without changing locked web, API, registry, certificate, verify, admin, ecosystem or database authority logic.

The goal is to make the Expo client visibly satisfy the Capstone requirement for at least 5 mobile screens by presenting the existing shared API bridge as a reviewer-friendly mobile application with distinct screen components and navigation.

## Scope

Changed surfaces:

- `apps/mobile/App.tsx`
- `README_SOFTUNI_CAPSTONE.md`
- `docs/qa/step135-mobile-capstone-evidence-lock.md`
- `scripts/qa-step135-mobile-capstone-evidence-lock.mjs`
- `package.json`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`

## Mobile screens documented

The Expo app now exposes six Capstone-friendly mobile screens:

1. Home / Platform Overview
2. Access / Auth Orientation
3. My Dogs / Owner Workspace
4. Registry + Verify
5. Knowledge / Care Guide
6. Profile / Account Context

These screens still read the shared Next.js API contracts and do not create any separate mobile-only authority.

## Guardrails

Step 135 does not change:

- Registry publish logic
- Certificate issue/revoke logic
- Verify lookup authority
- Admin review/moderation authority
- Auth/session implementation
- Database schema or migrations
- Neon/runtime DB configuration
- Web UI locked product surfaces

The mobile app remains a client of the existing API and contracts.

## QA

Run:

```powershell
pnpm step135:mobile-capstone:qa
pnpm release:all:qa
pnpm workspace:syntax
pnpm typecheck
```

Expected result:

- Step 135 QA PASS
- Full-stack all-in-one release lock QA PASS
- Workspace syntax PASS
- Typecheck PASS
