# Step 10.2 — Ecosystem Submission Form UX Polish

Status: ready for local visual QA.

## Scope

This pass only refines the member-facing ecosystem submission form inside `/ecosystem`.

Locked public/admin sections remain untouched:

- Registry
- Registry detail
- Certificate
- Verify logic
- My Cane Corso
- Gallery
- `/community`
- `/partners`
- `/partners/[slug]`
- `/review`
- `/admin/partners`
- `/admin/ecosystem`

## What changed

- Replaced the long flat submission form with grouped premium sections:
  - Submission path
  - Core identity
  - Contact details
  - Location and reach
  - Rules and notes
- Added Bulgarian, English, and Italian section copy.
- Removed remaining `review flow` wording from the member submission copy.
- Preserved all existing field names, server actions, listing statuses, and submission logic.
- Added scoped CSS under the Step 10.2 comment.
- Extended `owner-center:qa` to verify the new grouped layout and copy guardrails.

## Files changed

- `apps/web/components/ecosystem-owner-workspace.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-owner-center-workspace.mjs`
- `docs/qa/step10-2-ecosystem-submission-form-ux.md`

## Local QA

Run:

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm owner-center:qa
pnpm typecheck
pnpm ecosystem:qa
```

Then visually check:

```text
http://localhost:3000/ecosystem
```

Expected result:

- Owner Center stays above the form.
- The form is divided into clear visual sections.
- BG/EN/IT copy remains consistent by selected locale.
- The old ecosystem workspace list remains below the form.
- No public Registry, Gallery, Certificate, Review, or Admin section is changed.
