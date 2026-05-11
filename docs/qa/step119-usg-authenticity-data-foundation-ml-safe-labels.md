# Step 119 — USG Authenticity Data Foundation & ML-Safe Labels

## Purpose

Step 119 turns the owner-facing “Провери за истинско” area into a safer data foundation for future photo/AI/ML work without adding a real AI model and without changing Registry or Certificate authority.

The feature remains a voluntary owner bonus. It separates:

- Standard Match orientation: a rule-based comparison against the Cane Corso standard/USG orientation.
- Photo readiness: whether the owner has prepared the structured three-photo set.
- USG review readiness: whether the profile is ready to move toward human review.
- Registry and Certificate authority: never automatic from a percentage.

## ML-safe label policy

The platform prepares future training data by using safe orientation labels only:

- `photo_quality`
- `pose_readiness`
- `standard_signal`
- `review_readiness`

The platform must not train or present a label called “real”, “purebred”, “истинско”, “чистокръвно”, or any equivalent final breed-proof claim.

## User-facing boundary

The owner may see a USG Standard Match percentage and readiness labels, but the copy must clearly say that the percentage is not proof of breed, origin or pedigree. Any future photo layer is a support layer for review, not a breed identity judge.

## Scope

Changed:

- `apps/web/components/usg-authenticity-check-panel.tsx`
- `apps/web/components/usg-photo-evidence-guide-panel.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-step119-usg-authenticity-data-foundation-ml-safe-labels.mjs`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`
- `package.json`

Not changed:

- Registry API
- Verify API
- Certificate document/logic
- Ecosystem backend
- dog health database migration
- real image recognition / AI / ML model runtime

## QA

Run:

```bash
pnpm step119:authenticity-data-foundation:qa
pnpm step118-1:standard-match-bonus:qa
pnpm step118:photo-evidence:qa
pnpm step117:authenticity-check:qa
pnpm workspace:syntax
pnpm typecheck
```
