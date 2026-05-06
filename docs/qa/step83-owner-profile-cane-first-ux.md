# Step 83 — Owner Profile / Cane Corso-first UX Simplification

Status: ready for local browser review.

## Goal

Make the member/owner area easier for a normal user to understand:

1. Show the owner’s main Cane Corso immediately.
2. Keep photos, status, ratings, certificate state, and next action together.
3. Reduce duplicate panels when the owner has only one Cane Corso.
4. Keep edit/profile guidance close, but do not hide the actual form behind too much explanation.
5. Clean mixed BG/EN/IT wording in the touched owner-facing copy.

## Safe scope

Changed only owner/member presentation and copy:

- `apps/web/components/owner-cane-corso-spotlight.tsx`
- `apps/web/components/my-dogs-overview.tsx`
- `apps/web/app/(member)/profile/page.tsx`
- `apps/web/components/my-dog-form-workspace.tsx`
- `apps/web/components/my-dog-card.tsx`
- `apps/web/components/owner-review-readiness-panel.tsx`
- `apps/web/components/dog-profile-preview-card.tsx`
- `apps/web/app/globals.css`
- Step 83 QA/doc/package wiring

## Locked boundary

No backend trust or authority logic was changed:

- Registry API/public detail logic untouched
- Certificate issuing/printing/verification logic untouched
- Verify API/result logic untouched
- Gallery publication logic untouched
- Ecosystem backend logic untouched
- Auth/session/admin approval logic untouched

## UX result

- `/profile` now places a Cane Corso spotlight directly after the hero.
- `/my-dogs` now shows one main Cane Corso profile first, with photos/status/ratings/certificate/next action together.
- If the owner has exactly one Cane Corso, the duplicated heavy card list is not repeated under the main profile.
- `/my-dogs/[dogId]/edit` starts with a small priority summary, then the guided submission panel, then the form and preview.
- Readiness/review guidance remains available and QA-protected, but the real profile content is easier to see first.

## Local validation

Recommended local commands:

```bash
pnpm owner:cane-first-ux:qa
pnpm owner:profile-photo-journey:qa
pnpm user:clarity-scroll:qa
pnpm owner:review-readiness:qa
pnpm owner:submission-happy-path:qa
pnpm admin:navigation-clarity:qa
pnpm admin:real-netlify-flow:qa
pnpm workspace:syntax
pnpm typecheck
```
