# Step 110 — Member Dashboard Real User UX Cleanup

## Purpose

Step 110 turns `/member` into a clearer real-user dashboard after login. The page now prioritizes practical owner actions instead of long explanatory blocks:

- add or open Cane Corso profiles;
- enter the private Health & Growth tracker;
- manage the owner profile;
- use the community/services workspace;
- keep the full owner journey available only as optional expandable detail.

## Scope

Changed presentation/UI only:

- `apps/web/app/(member)/member/page.tsx`
- `apps/web/components/owner-center-workspace.tsx`
- `apps/web/components/owner-journey-command-center.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-step110-member-dashboard-real-user-ux-cleanup.mjs`
- `package.json`
- release QA registration

## UX decisions

- `/member` starts with one clear hero and four direct action cards.
- The new Step 109 Health & Growth route is surfaced from the member dashboard.
- Status/stat labels are localized instead of visible hardcoded English labels such as `TOTAL`, `DRAFT`, `REVIEW`, `PUBLIC`, or `FIX`.
- The full owner journey remains available, but it is moved into an expandable detail block so it does not dominate the first screen.
- The dashboard keeps user-specific names as-is; demo names such as `SoftUni User` are not treated as a product issue.

## Hard boundaries

No intended changes to:

- Registry publish logic
- Certificate issue / revoke logic
- Verify lookup logic
- Gallery selection logic
- Admin moderation authority
- Auth / session authority
- Database schema or migrations
- Health tracker API/model from Step 109

## Local validation

Recommended commands:

```bash
pnpm step110:member-dashboard:qa
pnpm step109-1:access-photo-guide:qa
pnpm step109:owner-health-growth:qa
pnpm workspace:syntax
pnpm typecheck
```
