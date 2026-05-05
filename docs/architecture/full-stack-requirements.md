# Full-Stack App Requirements Alignment

This document maps the Cane Corso Platform workspace to the required full-stack app technologies and architecture.

## 1. Setup a Monorepo, Establish App Architecture

Implemented through:

- `pnpm-workspace.yaml` for workspace package discovery
- `turbo.json` for monorepo task orchestration
- `apps/web` for the Next.js web application
- `apps/mobile` for the Expo mobile client
- `packages/db`, `packages/contracts`, `packages/auth`, `packages/storage`, `packages/ui`, and `packages/config` for shared application layers

## 2. Creating a Full-Stack App with Next.js, React and Expo

Implemented through:

- Next.js and React in `apps/web`
- Expo and React Native in `apps/mobile`
- Shared TypeScript contracts in `packages/contracts`
- Shared API base URL configuration through `NEXT_PUBLIC_API_BASE_URL` and `EXPO_PUBLIC_API_BASE_URL`

## 3. Creating a Back-End API with Next.js, Drizzle ORM and Neon DB

Implemented through:

- Next.js API routes under `apps/web/app/api`
- Drizzle ORM schema and repositories under `packages/db/src`
- SQL migrations under `packages/db/drizzle`
- Neon-ready PostgreSQL connection through `DATABASE_URL`
- Provider-aware SSL handling with `DATABASE_PROVIDER=neon` and `DATABASE_SSL=true`

The project keeps `DATABASE_URL` as the canonical database contract. For local development it can point to local PostgreSQL. For production or staging it can point to a Neon PostgreSQL connection string.

Example Neon settings:

```env
DATABASE_PROVIDER=neon
DATABASE_URL=postgresql://USER:PASSWORD@ep-example-pooler.REGION.aws.neon.tech/cane_corso_platform?sslmode=require
DATABASE_SSL=true
```

## 4. Building a Web Front-End Client with Next.js, React and Tailwind

Implemented through:

- `apps/web/app` for App Router pages and layouts
- `apps/web/components` for React UI components
- `apps/web/tailwind.config.ts`
- `apps/web/app/globals.css`

## 5. Building a Mobile App Client with React Native and Expo

Implemented through:

- `apps/mobile/App.tsx`
- `apps/mobile/src/api.ts`
- Expo configuration in `apps/mobile/app.json`
- React Native dependency in `apps/mobile/package.json`

## Verification

Run:

```powershell
pnpm requirements:qa
```

This checks the monorepo shape, web app, API routes, Drizzle database layer, Neon readiness, mobile app, and shared TypeScript packages.
