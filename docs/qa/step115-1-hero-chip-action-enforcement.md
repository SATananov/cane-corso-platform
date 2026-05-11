# Step 115.1 — Hero Chip Action Enforcement

Purpose: make PageShell hero chips honest and useful across the platform.

## What changed

- Added a reusable client hero-chip control for PageShell.
- Hero chips with `href` are real links.
- Hero chips with `targetId` remain real in-page progressive controls.
- Plain hero chips are no longer inert labels; they open a small contextual focus panel so the user gets feedback instead of clicking nothing.
- The public Knowledge landing hero chips now link directly to the relevant Knowledge articles.

## Boundaries

No DB schema, Auth/session, Registry authority, Certificate/Verify, Gallery backend, Admin backend, Ecosystem backend, or health migration logic was changed.

## QA

```bash
pnpm step115-1:hero-chip-actions:qa
pnpm step115:platform-progressive-disclosure:qa
pnpm workspace:syntax
pnpm typecheck
node scripts/qa-fullstack-all-in-one-release-lock.mjs
```
