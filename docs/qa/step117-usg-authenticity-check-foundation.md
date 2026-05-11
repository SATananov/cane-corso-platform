# Step 117 — USG Authenticity Check Foundation

Status: implementation patch prepared on top of Step 116 clean checkpoint.

## Purpose

Step 117 adds a user-facing **Провери за истинско / Check authenticity / Verifica autenticità** entry point for the owner Cane Corso profile workflow.

The feature is intentionally positioned as a **model-ready visual/evidence assistant**, not as an automatic proof of breed identity.

## What changed

- Added `apps/web/components/usg-authenticity-check-panel.tsx`.
- Added a direct owner card CTA to `/my-dogs/[dogId]/edit#usg-authenticity-check`.
- Updated the optional guidance launcher in the dog form workspace to use the owner-facing “check authenticity” language.
- Added automatic hash opening for `#usg-authenticity-check`.
- Added charts/diagrams:
  - circular readiness score;
  - evidence flow diagram;
  - signal bars for profile/photos/measurements/standard/pedigree/human review;
  - standard-oriented proportion mini diagrams.
- Reuses the existing Step 108.1 FCI conformity engine and Step 109 measurement archive API.

## Trust boundary

This step does **not** add real image recognition, automatic breed proof, pedigree proof, automatic Registry approval, automatic Certificate issuance, or automatic admin decision.

The copy states that photo recognition is a future layer and that the current check evaluates whether the evidence is ready for human/AI-assisted review.

## Locked surfaces protected

No DB schema, migrations, Registry publication authority, Certificate/Verify authority, Gallery backend selection, Admin review backend, Auth/session, or Ecosystem backend logic are changed.
