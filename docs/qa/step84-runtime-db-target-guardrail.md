# Step 84 — Runtime DB Target Guardrail

Status: ready for local deploy/runtime verification.

## Goal

Prevent future confusion between the clean live Neon database and the older demo/reference database.

The live app must use:

```txt
cane_corso_platform
```

The older demo/reference data stays separate in:

```txt
cane_corso_platform_demo
```

No data migration is performed in this step.

## What changed

Added a runtime-only health surface:

```txt
/api/health/db
```

The endpoint checks PostgreSQL at runtime with `current_database()` and returns a safe, sanitized payload with:

- expected database name
- active database name
- active schema
- configured runtime database parsed from `DATABASE_URL`
- configured migration database parsed from `DATABASE_URL_DIRECT`
- boolean match flags
- guardrail status: `ok`, `misconfigured`, or `unavailable`

The endpoint does not return or log full connection strings, usernames, passwords, hosts, or secrets.

## Expected production result

When Netlify is correctly configured, `/api/health/db` should return:

```txt
status: ok
expectedDatabase: cane_corso_platform
activeDatabase: cane_corso_platform
configuredRuntimeDatabase: cane_corso_platform
configuredMigrationDatabase: cane_corso_platform
```

If it returns `cane_corso_platform_demo`, the Netlify environment variables still point to the demo database.

## Environment contract

Production Netlify env variables should include:

```txt
DATABASE_PROVIDER=neon
DATABASE_EXPECTED_NAME=cane_corso_platform
DATABASE_URL=.../cane_corso_platform?sslmode=require
DATABASE_URL_DIRECT=.../cane_corso_platform?sslmode=require
DATABASE_SSL=true
```

Do not commit real connection strings.

## Safe scope

Changed only runtime health/guardrail and documentation:

- `apps/web/app/api/health/db/route.ts`
- `apps/web/lib/database-target.server.ts`
- `packages/contracts/src/common/health-api.types.ts`
- `packages/db/src/pg.d.ts`
- `.env.example`
- `apps/web/.env.example`
- `docs/deploy/netlify-deployment-guide.md`
- `AGENTS.md`
- `scripts/qa-runtime-db-target-guardrail.mjs`
- `package.json`

## Locked boundary

No authority or product data flow logic was changed:

- Registry publish/read logic untouched
- Certificate issue/revoke/verify logic untouched
- Verify lookup logic untouched
- Gallery backend selection untouched
- Ecosystem backend untouched
- Auth/session sign-in/sign-up logic untouched
- No migrations added
- No seed scripts changed
- No data migration performed

## Local static validation

```bash
pnpm db:target:qa
pnpm deploy:netlify:qa
pnpm workspace:syntax
pnpm typecheck
```

## Runtime validation after Netlify deploy

After changing Netlify env variables and deploying without cache:

```bash
CCP_RUNTIME_BASE_URL=https://cane-corso-platform.netlify.app pnpm db:target:qa -- --runtime
```

Manual browser check:

```txt
https://cane-corso-platform.netlify.app/api/health/db
```

The page should prove that the live app is using `cane_corso_platform`.
