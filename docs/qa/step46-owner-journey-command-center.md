# Step 46 — Owner Journey Command Center & Status Clarity

## Status

PASS candidate / ready for local browser verification.

## Scope

Step 46 adds a larger owner/member UX orchestration layer after the Step 45 trust-surface polish:

- New dedicated authenticated route: `/member`.
- New presentation component: `OwnerJourneyCommandCenter`.
- Existing `OwnerCenterWorkspace` now renders the journey command center before the task/action panels.
- Header direct workspace controls include a short `Center / Център / Centro` link to the new member command center.
- CSS polish for the command center in dark and Heritage themes.
- QA script: `owner:journey:qa`.

## Product intent

The member should understand the full path in one calm place:

1. Private Cane Corso profile.
2. Admin review.
3. Registry publication.
4. USG Certificate / Verify trust.
5. Gallery / Certified showcase eligibility.
6. Ecosystem entries and next useful action.

This is a read-only orchestration layer. It does not create a new backend decision system.

## Hard boundaries

Step 46 must not change these locked backend or authority layers:

- Registry publish logic.
- Certificate issue / revoke logic.
- Verify lookup logic.
- Gallery backend selection logic.
- Admin moderation backend.
- Ecosystem API / DB logic.
- Auth / session logic.
- Database schema or migrations.

## Files intentionally changed or added

- `apps/web/app/(member)/member/page.tsx`
- `apps/web/components/owner-journey-command-center.tsx`
- `apps/web/components/owner-center-workspace.tsx`
- `apps/web/components/site-header.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-owner-journey-command-center.mjs`
- `docs/qa/step46-owner-journey-command-center.md`
- `package.json`

## Acceptance criteria

- `/member` exists and is protected for authenticated members.
- The command center clearly shows the lifecycle from private profile to review, registry, certificate, verify/showcase readiness.
- The command center is rendered inside the existing owner center workspace so `/ecosystem` also benefits from the new clarity layer.
- The owner sees one recommended next action based on current profile/review/public/certificate state.
- The header uses a direct short member-center link, not a dropdown.
- Dark and Heritage theme styling exists.
- No locked backend/API/DB/auth authority logic is modified.
