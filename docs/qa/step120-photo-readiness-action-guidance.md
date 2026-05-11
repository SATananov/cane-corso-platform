# Step 120 — Photo Readiness Action Guidance

## Status

PASS candidate — sandbox generated from Step 119 clean checkpoint.

## Purpose

Step 120 makes the owner-facing photo readiness layer more actionable before any real AI/ML model exists. The user now sees which photo is ready, which one is the next priority, why each view matters, and how the photo set connects to Owner Center, Standard Match, USG Review, Registry and Certificate.

## Scope

Changed:

- `apps/web/components/usg-photo-evidence-guide-panel.tsx`
- `apps/web/app/globals.css`
- `docs/qa/step120-photo-readiness-action-guidance.md`
- `scripts/qa-step120-photo-readiness-action-guidance.mjs`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`
- `package.json`

Not changed:

- Registry APIs and public Registry authority
- Verify APIs
- Certificate document/issuing logic
- Ecosystem backend logic
- Dog health migration `0014_dog_health_records.sql`
- Real AI/ML model, prediction endpoint, database schema, or training pipeline

## Product behavior

The photo readiness panel remains a voluntary owner bonus, but it now gives practical guidance:

1. Each expected photo view has a clear status: ready, next/current, or needed.
2. Each card has an owner action explaining what to keep, add, or improve.
3. A short action strip explains what the user should do next and why this is only readiness, not proof.
4. A review gate note clarifies that Registry publication and Certificate remain separate USG review decisions.
5. An Owner Center path connects the flow to: profile data, three views, measurements, Standard Match, and USG Review.

## Safety copy

The UI keeps the safe language introduced in Step 119:

- photos support orientation and review readiness;
- a complete photo set improves Standard Match confidence;
- no photo or future model proves breed, origin, pedigree, Registry publication, or Certificate status;
- all official outcomes remain human/USG-controlled.

## QA commands

```bash
pnpm step120:photo-readiness-action:qa
pnpm step119:authenticity-data-foundation:qa
pnpm step118-1:standard-match-bonus:qa
pnpm step118:photo-evidence:qa
pnpm workspace:syntax
pnpm typecheck
```
