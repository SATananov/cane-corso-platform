# Cane Corso Platform — Netlify Deployment Guide

This project is a pnpm/Turbo monorepo with the deployable Next.js app in `apps/web`.

## Recommended Netlify setup

Use a Git-based Netlify deploy, not drag-and-drop, because this project uses Next.js SSR, API routes, route handlers, server components, and runtime environment variables.

### Build settings

If Netlify reads the included root `netlify.toml`, these values are already set:

- Base directory: leave empty / repository root
- Build command: `pnpm --filter @cane-corso-platform/web build`
- Publish directory: `apps/web/.next`
- Node version: `22`
- Package manager: pnpm via `packageManager: pnpm@10.0.0` and `pnpm-lock.yaml`

If configuring manually in the Netlify UI, use the same values above.

## Required environment variables

Add these in Netlify → Site configuration → Environment variables:

```txt
DATABASE_PROVIDER=neon
DATABASE_EXPECTED_NAME=cane_corso_platform
DATABASE_URL=postgresql://USER:PASSWORD@HOST/cane_corso_platform?sslmode=require
DATABASE_URL_DIRECT=postgresql://USER:PASSWORD@DIRECT_HOST/cane_corso_platform?sslmode=require
DATABASE_SSL=true
AUTH_SECRET=<long-random-production-secret-minimum-32-chars>
SESSION_COOKIE_NAME=ccp_session
AUTH_PROVIDER=local
ENABLE_DEV_BOOTSTRAP_SESSION=false
APP_URL=https://<your-netlify-site>.netlify.app
NEXT_PUBLIC_APP_URL=https://<your-netlify-site>.netlify.app
STORAGE_BUCKET_DOGS=dogs
STORAGE_BUCKET_CERTIFICATES=certificates
STORAGE_BUCKET_PARTNERS=partners
```

Do not commit real secrets to the repository.

## Database before first production test

Before testing member/admin flows in production, run migrations and seed/prepare the production Neon database from a trusted local environment with the real `DATABASE_URL` set.

Typical local preparation:

```powershell
pnpm db:migrate
# optional only if you want demo credentials in the production-like database
pnpm db:seed
```

## Deploy flow

1. Push this clean release pack to GitHub/GitLab/Bitbucket.
2. In Netlify, create a new project from that repo.
3. Keep base directory as repository root.
4. Use the included `netlify.toml` build settings.
5. Add the required environment variables.
6. Deploy.
7. After deploy, open `/api/health` and confirm it returns `ok: true` and `database: configured`.
8. Open `/api/health/db` and confirm `activeDatabase`, `configuredRuntimeDatabase`, and `configuredMigrationDatabase` all equal `cane_corso_platform`.
9. Test public pages first: `/`, `/registry`, `/gallery`, `/knowledge`, `/partners`, `/community`, `/verify`.
10. Then test auth/member/admin flows after the database is migrated and seeded.

## Important notes

- Netlify’s current Next.js support uses the OpenNext adapter automatically; do not pin or manually install a legacy Next runtime unless a future Netlify deploy log explicitly requires it.
- Manual drag-and-drop deploys do not run a build command, so they are not the right deployment path for this SSR/API app.
- Keep `ENABLE_DEV_BOOTSTRAP_SESSION=false` in production.


## Runtime database target guardrail

The live Netlify app must use the clean main Neon database:

```txt
cane_corso_platform
```

The old demo/reference database remains separate and must not be used for production writes:

```txt
cane_corso_platform_demo
```

After changing `DATABASE_URL`, `DATABASE_URL_DIRECT`, or `DATABASE_EXPECTED_NAME` in Netlify, use:

```txt
Deploys → Trigger deploy → Deploy project without cache
```

Then verify the real runtime target:

```txt
https://cane-corso-platform.netlify.app/api/health/db
```

Expected result: `status: ok` and all database fields point to `cane_corso_platform`.

## Google Maps / Places integration

Step 88 adds optional Google Maps and Places support for Cane Corso-friendly places.

Required production variable:

```txt
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

The key is public by nature because it is used by the browser, but it must be restricted in Google Cloud by HTTP referrer, for example:

```txt
https://cane-corso-platform.netlify.app/*
```

Enable these Google Cloud APIs for the key:

```txt
Maps JavaScript API
Places API
```

If the key is missing, the app does not crash. Friendly places remain visible as a list, and map surfaces show a manual-mode message.
