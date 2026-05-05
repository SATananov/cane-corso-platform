# Workshop Alignment Roadmap

This repository is being aligned to an API-first workshop architecture with the following responsibilities:

- `apps/web`: Next.js web UI, route handlers, server components, authenticated member/admin experiences.
- `apps/mobile`: Expo client that consumes the shared HTTP API rather than web-only server actions.
- `packages/contracts`: shared DTOs, API envelope types, session models, and domain types.
- `packages/db`: Drizzle schema, repositories, migrations, seed scripts, and database access.
- `packages/auth`: shared session, cookie, and token primitives for web and mobile authentication flows.
- `packages/ui`: design tokens and Tailwind preset foundation for future visual unification.
- `packages/config`: shared runtime constants and environment rules for every app package.
- `packages/storage`: pluggable binary asset storage adapters, currently starting with a local workshop file provider.

## Rules locked in this phase

1. API-first: web and mobile should converge on the same backend contract.
2. Database remains canonical in `packages/db`.
3. Session handling moves away from hardcoded demo helpers toward signed cookie-backed bootstrap sessions.
4. Tailwind is prepared as the future styling foundation without forcing a redesign in this patch.
5. Mobile gets a clean Expo scaffold, but the first production vertical remains `auth -> profile -> my dogs`.
6. Generated artifacts and nested duplicate workspaces must never become the source of truth.

## Immediate next checkpoints after this patch

1. Copy files into the repo.
2. Run workspace cleanup once to remove stale generated artifacts and nested duplicate folders.
3. Install dependencies on the real machine.
4. Run `node scripts/workshop-doctor.mjs --full`.
5. Boot the web app, test `/api/health`, `/api/session`, `/api/profile/me`, `/api/dogs`, then continue with the next vertical only after the API/session layer is stable.

## Current implementation checkpoint

The repository now includes the first practical API-first bridge for the `My Dogs` vertical:

- signed bootstrap session routes in `apps/web/app/api/session/*`
- dog collection and dog detail HTTP routes in `apps/web/app/api/dogs/*`
- a browser API client used by the `MyDogFormWorkspace`
- automatic dev bootstrap session sync in the root layout
- Expo mobile now reads `/api/health`, `/api/session`, and `/api/dogs`

## Current hardening checkpoint

This patch focuses on workshop readiness rather than new UI layers:

- adds a shared root TypeScript config for the workspace
- keeps `apps/web` from type-checking stale `.next` output or nested duplicate folders
- makes `apps/mobile` self-contained for TypeScript instead of depending on generated local state
- expands cleanup/verification so duplicate `apps/web/packages`, nested scripts, `.expo`, and package-local `node_modules` are treated as stale
- adds a syntax check and a single doctor command for fast validation
- disables bootstrap-session issuance by default in production unless explicitly enabled

## Recommended next build slice

1. Harden the current custom provider/session bridge so protected APIs require a signed cookie while pages remain workshop-friendly.
2. Replace the remaining development bootstrap identity flow with a real auth provider.
3. Introduce shared validation primitives in a dedicated package once the next vertical starts.
4. Harden review/publish flows now that member media can be stored as real assets.
5. Continue the Tailwind component migration only after the API/session/media slice is stable end to end.

## Checkpoint update — auth/provider hardening

- Added a shared auth strategy resolver so the workspace now has an explicit provider contract instead of implicit development-only assumptions.
- Added an auth provider API route at `apps/web/app/api/auth/provider/route.ts` for future mobile/web bootstrap alignment.
- Protected HTTP routes now require a real signed cookie session even in development, while server-rendered workshop pages can still use the explicit dev fallback until the real provider is connected.
- Cookie sessions are re-hydrated from the canonical profile identity before use, so role/profile changes and deactivated users stop inheriting stale cookie claims.
- The session payload now carries `authProvider` and `emailVerified`, which prepares the next provider swap without changing the API contract again.


## Checkpoint update — media library slice

- Added a dedicated `dog-media` repository so profile assets now have a real database-backed workflow.
- Added member-facing API routes for listing, creating, promoting, and deleting dog media assets.
- Added a member media route and workspace so profile galleries can evolve before the binary storage upload provider is connected.
- Linked My Dogs overview/cards to the new media workflow and promoted primary media back into the dog card hero image.

## Checkpoint update — local storage upload slice

- Added `@cane-corso-platform/storage` as the workspace package for binary asset handling.
- Added a local Node.js storage provider that writes uploaded dog media into `apps/web/public/uploads/*` through a stable storage key contract.
- Added a multipart upload route at `apps/web/app/api/dogs/[dogId]/media/upload/route.ts`.
- The member media workspace now supports direct file uploads in addition to external URLs.
- Local workshop uploads are cleaned up again when a media item is deleted or when database registration fails after upload.


## Checkpoint update — ecosystem moderation engine foundation

- Added a shared ecosystem domain that can power services, transport/relocation, boarding, walk/play places, and pet-friendly locations through one reusable submission and moderation workflow.
- Added database tables and repository methods for ecosystem listings, review history, owner workspace views, admin moderation, and public published directory output.
- Added new web slices for member submission (`/ecosystem`), public ecosystem directory (`/partners`), and admin moderation (`/admin/partners`) without changing the core registry flow.
- Added API-first route handlers at `/api/ecosystem` and `/api/ecosystem/moderation` so future mobile or external clients can consume the same ecosystem workflow without depending on server actions.

## Checkpoint update — ecosystem expansion slice

- Extended the shared ecosystem type contract beyond the first services/places slice so the same moderation engine can now represent puppies, adoption/new home, breeding/match, and events without creating separate one-off flows.
- Kept the existing submission -> admin review -> approve -> publish workflow unchanged; the expansion is contract/UI-level and does not alter Registry, Certificate, My Cane Corso, or Gallery logic.
- Added localized ecosystem labels for the new layers and localized status labels so member/admin screens no longer show raw status keys like `pending_review` to users.
- Added an explicit Next.js `outputFileTracingRoot` at the web app config level so the monorepo root is clear and a package-lock outside the repository is less likely to confuse Next.js root detection.

## Checkpoint update — Partner / Services MVP sync slice

- Kept the existing public Partner / Services directory, member application workspace, admin moderation dashboard, and partner detail pages as the primary MVP surface.
- Connected approved Partner / Services applications into the shared ecosystem engine as official `partner_service` listings, so an admin approval now produces both a public partner profile and a public ecosystem record.
- Added a migration/backfill for already-approved partners and updated the demo seed so fresh local databases show the approved partner in the wider ecosystem layer as well.
- Synchronized featured/suspended/restored partner admin state back into the ecosystem listing without changing Registry, Certificate, My Cane Corso, Gallery, or certificate verification flows.
