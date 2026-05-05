# Step 17.1 — Seeded DB QA pg Resolution Fix

Status: dependency-resolution fix for Step 17 local DB QA.

## Purpose

`pnpm ecosystem:manual:db:qa` runs from the repository root, but `pg` is owned by the `@cane-corso-platform/db` workspace package. The Step 17 script must therefore resolve `pg` from the DB package context, not from the root script context.

## Fix

The script now uses:

```js
createRequire(path.join(root, 'packages/db/package.json'))
```

and must not import pg from the root script context.

## Scope

Only the seeded DB QA script and QA evidence guardrails are touched. No Registry, Gallery, Certificate, Verify, Review, Partner, public page, or visual UI section is changed.

## Local verification

Run:

```powershell
pnpm ecosystem:manual:seed
pnpm ecosystem:manual:db:qa
pnpm ecosystem:manual:qa
pnpm ecosystem:release:qa
pnpm typecheck
```
