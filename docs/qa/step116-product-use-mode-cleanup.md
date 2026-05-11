# Step 116 — Product Use-Mode Cleanup

## Purpose

Step 116 moves the platform closer to real daily use. The goal is not to add a new backend feature; the goal is to stop the visible product from feeling like a development walkthrough.

## What changed

- Sign-in errors no longer expose payload/debug/demo password details to the user.
- Large section explanation panels remain available, but are collapsed behind an intentional help/context control by default.
- Admin decision guidance is collapsed behind a small decision-help control so queues and real actions remain first.
- `/platform` removes visible “MASTER PLAN / next evolution” language and uses product-ready structure wording.
- `/access` focuses on continuing into the platform instead of explaining the whole access model first.
- Role-aware copy removes owner/member references like “visible to admin” from user-facing guidance and replaces them with safer USG review/privacy wording.
- Mixed-language labels in the EN/IT role-aware action panel are cleaned.

## Boundaries

This is a presentation/copy/use-mode patch only. It does not change:

- Registry APIs or published profile authority
- Certificate issue/revoke logic
- Verify lookup logic
- Gallery backend
- Ecosystem APIs or moderation backend
- Auth/session implementation
- Neon/Postgres schema or migrations
- Health/growth DB migration `0014_dog_health_records.sql`

## QA

Run:

```bash
pnpm step116:product-use-mode:qa
pnpm step115-2:hero-locale-fallback:qa
pnpm step115-1:hero-chip-actions:qa
pnpm step115:platform-progressive-disclosure:qa
pnpm workspace:syntax
pnpm typecheck
```

`typecheck` requires local dependencies and should be run locally after applying the patch.
