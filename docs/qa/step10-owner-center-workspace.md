# Step 10 — Owner Center / Member Ecosystem Workspace

Status: implemented as a member-only workspace pass.

## Scope

Step 10 introduces an Owner Center layer inside the member `/ecosystem` route. It aggregates the member identity, private Cane Corso profile status, registry preparation signals, and member ecosystem submissions without changing the locked public or admin surfaces.

## Files changed

- `apps/web/app/(member)/ecosystem/page.tsx`
- `apps/web/components/owner-center-workspace.tsx`
- `apps/web/lib/owner-center.server.ts`
- `apps/web/app/globals.css`
- `scripts/qa-owner-center-workspace.mjs`
- `package.json`
- `docs/qa/step10-owner-center-workspace.md`

## Locked sections not touched

The Step 10 implementation does not change the locked public/admin route files for Registry, Registry detail, Gallery, Certificate, Verify, Review, Admin Partners, or Admin Ecosystem. It only links to existing member-safe routes.

## Product behavior

- `/ecosystem` remains member-only and redirects unauthenticated visitors to `/access?intent=ecosystem`.
- The top of `/ecosystem` now acts as an Owner Center.
- Owner Center summarizes:
  - member identity
  - total Cane Corso profiles
  - profiles in review / needing action
  - published profiles
  - active certificates
  - ecosystem submissions
- The existing ecosystem submission form and owner queue remain available below the Owner Center summary.
- Public visibility remains controlled by the existing admin review and publication flow.

## Verification

Recommended checks after applying the patch:

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm owner-center:qa
pnpm typecheck
pnpm ecosystem:qa
```

Manual check:

1. Sign in as member.
2. Open `/ecosystem`.
3. Confirm the Owner Center appears above the ecosystem submission workspace.
4. Confirm links go only to member-safe flows: `/my-dogs`, `/my-dogs/new`, `/partners/apply`, and `/profile`.
5. Confirm public/admin locked sections remain visually unchanged.
