# Step 108.1 — FCI Standard Conformity Engine

## Purpose

Step 108.1 adds a careful FCI conformity orientation layer on top of the Step 108 USG Intelligence foundation.

The key product boundary is explicit:

- A USG certificate is not an FCI certificate.
- USG does not issue official FCI documents, pedigrees, club titles, or show results.
- FCI conformity is a separate orientation signal based on available owner data and measurements.
- Final USG qualification remains human/admin controlled.

## Source base

The engine is grounded in FCI Standard No. 343 for Cane Corso Italiano. The product uses measurable portions of the standard only:

- adult height at withers by sex and the standard tolerance orientation;
- adult weight by sex;
- rectangular body outline: body length about 11% greater than height;
- head length about 36% of height at withers;
- muzzle/skull orientation about 1:2;
- coat colour family orientation;
- severe/disqualifying fault boundary remains human-reviewed.

## What the engine does

The engine builds a versioned `FciStandardConformityDocument` with:

- overall FCI conformity by available data;
- measurable standard signal;
- evidence confidence;
- latest saved measurement context;
- age-aware mode: adult orientation, young-adult transition, puppy development projection, or unknown-age orientation;
- qualification wording that never converts a score into automatic certification.

## What it does not do

This step does not:

- add a database migration;
- train or activate an ML model;
- issue an FCI certificate;
- prove breed identity, pedigree, or bloodline;
- detect disqualifying faults automatically;
- approve Registry, Gallery, Verify, or Certificate automatically;
- change Certificate, Registry, Verify, Gallery, Auth/session, Neon schema, or admin authority logic.

## Product interpretation

Use this layer as:

1. owner guidance for what data is missing;
2. preparation for USG review;
3. evidence confidence around measurements and standard-based proportions;
4. a safe bridge from deterministic standard checks toward future regression-assisted growth projection.

For puppies, the result is always development-only. A puppy must not receive a final adult FCI conformity judgment.

## Files added or updated

- `packages/contracts/src/intelligence/fci-standard-conformity.types.ts`
- `apps/web/lib/fci-standard-conformity.ts`
- `apps/web/components/fci-standard-conformity-panel.tsx`
- `apps/web/components/my-dog-form-workspace.tsx`
- `apps/web/app/globals.css`
- `docs/architecture/fci-standard-conformity-engine.md`
- `docs/qa/step108-1-fci-standard-conformity-engine.md`
- `scripts/qa-step108-1-fci-standard-conformity-engine.mjs`
- `package.json`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`
