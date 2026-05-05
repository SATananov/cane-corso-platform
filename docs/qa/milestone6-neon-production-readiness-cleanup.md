
# Milestone 6 — Neon / Production Readiness Cleanup

## Scope

This milestone adds the final production readiness checklist and updates the recommended SSL guidance after the PostgreSQL SSL warning seen during local testing.

## Important note about SSL warning

For Neon/cloud PostgreSQL, prefer:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=verify-full"
DATABASE_URL_DIRECT="postgresql://USER:PASSWORD@DIRECT_HOST/DB?sslmode=verify-full"
DATABASE_PROVIDER="neon"
```

For local PostgreSQL without SSL, use either no SSL query parameter or:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/cane_corso_platform?sslmode=disable"
DATABASE_PROVIDER="postgres"
DATABASE_SSL="disable"
```

## Local validation

```powershell
pnpm production:readiness:qa
pnpm pre-neon:lock:qa
pnpm neon:runtime:smoke:qa
pnpm workspace:syntax
pnpm typecheck
```
