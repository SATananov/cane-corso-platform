
# Milestone 3 — Registry Publish / Certificate / Verify Release Flow

## Scope

This milestone adds a shared release-flow panel to public Registry and admin Registry management. It makes the trust sequence explicit:

1. Registry publication is the public profile release.
2. USG certificate issuance is a separate admin trust decision.
3. Verify confirms only active certificate records.

## Boundary

No certificate issuance logic, Verify route handler, public Registry route handler, Gallery backend selection logic, or session/auth boundary was changed.

## Files

- `apps/web/components/registry-certificate-release-flow-panel.tsx`
- `apps/web/app/(public)/registry/page.tsx`
- `apps/web/app/(admin)/admin/registry/page.tsx`
- `scripts/qa-registry-certificate-release-flow.mjs`

## Local validation

```powershell
pnpm registry:certificate-release-flow:qa
pnpm workflow:qa
pnpm certificate:verify-trust:qa
pnpm demo:public-detail-pages:qa
pnpm workspace:syntax
pnpm typecheck
```

## Browser validation

1. Open `/registry` as guest and member.
2. Confirm the public release-flow panel appears before the registry list.
3. Login as admin and open `/admin/registry`.
4. Confirm the admin version shows published, certified, and moderation counts.
5. Confirm Verify links still resolve through `/verify/[code]`.
