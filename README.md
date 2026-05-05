# Cane Corso Platform

Premium platform for Cane Corso dogs, owners, knowledge, trusted partners, and registry flows.

## Stack
- Next.js (web)
- Expo (mobile)
- Neon + Drizzle
- Shared contracts
- Cloud storage
- Real auth

## Product Direction
Cane Corso Platform by UNICO SUO GENERE

## Full-Stack App Requirement Alignment

This workspace is structured to match the full-stack app brief:

- **Monorepo architecture:** `pnpm-workspace.yaml`, `turbo.json`, `apps/*`, and `packages/*`.
- **Web client:** `apps/web` uses Next.js, React, Tailwind, and the App Router.
- **Back-end API:** `apps/web/app/api/*` exposes server API routes for auth, profile, dogs, registry, review, verify, partners, ecosystem, and storage flows.
- **Database layer:** `packages/db` uses Drizzle ORM with PostgreSQL through `DATABASE_URL`.
- **Neon DB readiness:** Neon PostgreSQL connection strings are supported through `DATABASE_URL` with `DATABASE_PROVIDER=neon` and SSL handling.
- **Mobile client:** `apps/mobile` uses React Native and Expo, and consumes the same API base URL through `EXPO_PUBLIC_API_BASE_URL`.
- **Shared contracts:** `packages/contracts`, `packages/auth`, `packages/storage`, `packages/db`, and `packages/ui` keep the web, API, and mobile layers aligned.

Run this project-level requirement check with:

```powershell
pnpm requirements:qa
```

## Database bootstrap
1. Copy `.env.example` to `.env` in the project root and set `DATABASE_URL`.
2. Run `pnpm db:bootstrap` to apply SQL migrations and seed the first member/profile flow. The scripts now auto-load `.env`.
3. Start the web app and open `/profile` or `/my-dogs`.

The first seeded member uses:
- email: `member@demo.cane-corso.local`
- profile role: `member`
- purpose: bootstrap the first real My Dogs database-backed member flow

## Clean checkpoint packaging

Create a source-only checkpoint ZIP from the repository root with:

```powershell
pnpm checkpoint:zip -- -ZipName cane-corso-platform_clean_after_step9_checkpoint_hygiene.zip
```

The checkpoint script excludes local installs, build output, caches, local environment files, logs, and old handoff patch notes by default. Locked sections after Step 8 are documented in `docs/architecture/locked-sections-step8.md`.
