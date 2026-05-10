# Step 108 QA — USG Intelligence Layer Foundation

## Scope

This QA verifies that the platform now has a safe USG Intelligence foundation without claiming that a trained ML model exists and without changing locked authority flows.

## Expected files

- `packages/contracts/src/intelligence/usg-intelligence.types.ts`
- `apps/web/lib/usg-intelligence.ts`
- `apps/web/components/usg-intelligence-foundation-panel.tsx`
- `docs/architecture/usg-intelligence-layer-foundation.md`
- `docs/qa/step108-usg-intelligence-layer-foundation.md`
- `scripts/qa-step108-usg-intelligence-layer-foundation.mjs`

## Checks

The QA script checks:

- shared intelligence contract exists and is exported;
- deterministic intelligence builder exists;
- owner-facing panel exists in BG/EN/IT;
- owner dog form renders the panel before the measurement assistant;
- package script `step108:usg-intelligence:qa` exists;
- all-in-one release QA structure includes Step 108;
- no new DB migration was added for this step;
- Step 108 copy contains trust boundaries and avoids unsafe claims.

## Manual browser review

Open `/my-dogs/new` and an existing `/my-dogs/[dogId]/edit` profile. Confirm:

- the USG Intelligence panel is visible before the measurement assistant;
- the panel language follows the selected locale;
- the panel reads as orientation/preparation, not as an official judgment;
- the existing measurement assistant and owner review readiness sections still appear;
- Registry, Certificate, Verify, Gallery, Auth, and Admin flows are not changed by this step.
