# Step 91 — Admin-Mediated Match Requests

Status: Prepared for local QA.

## Purpose

Add the first controlled connection-request layer for sensitive Community listings. Members can publicly see approved listings for breeding, puppies, adoption/new home, and lost/found, but direct contact remains protected. A member submits an offer/request through the platform; the administrator reviews and decides whether to connect the parties.

## Guardrails

- Registry, Certificate, Verify, Gallery, and owner privacy authority are not changed.
- Public sensitive listings do not expose direct phone/email/website contact.
- Match requests are stored in a dedicated moderation table.
- Admin can allow connection, decline it, or mark it as connected.
- No automatic public contact exchange is introduced.

## Files touched

- `packages/contracts/src/ecosystem/ecosystem.types.ts`
- `packages/db/src/schema/ecosystem.ts`
- `packages/db/src/schema/relations.ts`
- `packages/db/src/repositories/ecosystem.repository.ts`
- `packages/db/drizzle/0012_ecosystem_match_requests.sql`
- `apps/web/lib/ecosystem.server.ts`
- `apps/web/app/(public)/community/[slug]/actions.ts`
- `apps/web/components/ecosystem-profile-detail.tsx`
- `apps/web/app/(admin)/admin/ecosystem/actions.ts`
- `apps/web/components/ecosystem-moderation-dashboard.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-admin-mediated-match-requests.mjs`
- `package.json`

## Local QA

Run:

```powershell
pnpm db:migrate
pnpm community:match-requests:qa
pnpm community:hub-polish:qa
pnpm community:intent-hub:qa
pnpm ecosystem:friendly-places:qa
pnpm ecosystem:google-maps:qa
pnpm owner:identity-privacy:qa
pnpm workspace:syntax
pnpm typecheck
```

## Browser smoke

- Open `/community` and a published sensitive listing detail.
- Confirm direct public contact stays hidden.
- Submit a member proposal from the detail form.
- Open `/admin/ecosystem` and confirm the match request appears in the admin-mediated queue.
- Admin can allow connection, decline, or mark connected.
