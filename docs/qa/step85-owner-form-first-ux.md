# Step 85 — Owner Add Cane Corso Form-First UX

Status: PASS / LOCK after local verification.

## Purpose

The Add/Edit Cane Corso screen must match the user intent: when the owner chooses to add or edit a Cane Corso, the form starts immediately. Preview, readiness, and owner guidance remain available, but they no longer block the first action.

## Scope

Touched only owner/member UI, copy, CSS, and QA guardrails:

- `apps/web/app/(member)/my-dogs/new/page.tsx`
- `apps/web/app/(member)/my-dogs/[dogId]/edit/page.tsx`
- `apps/web/components/my-dog-form-workspace.tsx`
- `apps/web/components/dog-profile-form.tsx`
- `apps/web/components/owner-submission-happy-path-panel.tsx`
- `apps/web/lib/i18n.ts`
- `apps/web/app/globals.css`
- `scripts/qa-owner-form-first-ux.mjs`

## Boundary

No backend authority or data-flow changes were made. Locked surfaces stay unchanged:

- Registry backend
- Certificate logic
- Verify logic
- Gallery backend
- Ecosystem backend
- Auth/session
- Neon database configuration and migrations
- Admin approval/publish logic and admin authority boundaries

## UX outcome

- The compact hero explains the task briefly.
- The priority summary remains small.
- The main form appears before owner journey/checklist panels.
- The status/review/certificate explanation moves below the form.
- The right sidebar stays as a compact live preview.
- Bulgarian owner copy avoids mixed technical English such as `server validation`, `Draft`, `Admin controlled`, `media workspace`, and `Registry / Certificate`.

## Verification

Run:

```bash
pnpm owner:form-first-ux:qa
pnpm owner:cane-first-ux:qa
pnpm owner:profile-photo-journey:qa
pnpm owner:review-readiness:qa
pnpm owner:submission-happy-path:qa
pnpm admin:navigation-clarity:qa
pnpm db:target:qa
pnpm deploy:netlify:qa
pnpm workspace:syntax
pnpm typecheck
```
