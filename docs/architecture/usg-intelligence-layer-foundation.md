# Step 108 — USG Intelligence Layer Foundation

## Purpose

Step 108 introduces the first safe product foundation for **USG Intelligence**. The goal is to prepare Cane Corso Platform for future regression/ML-assisted orientation while keeping the current product honest, useful, and under human authority.

This step does **not** train a model, does **not** add a database migration, and does **not** automate any official USG decision.

## Product rule

USG Intelligence is a guidance layer. It may summarize profile completeness, growth evidence, measurement archive readiness, phenotype observation context, and admin review support. It must never be presented as:

- a USG Certificate;
- proof of breed identity, pedigree, or bloodline;
- a veterinary diagnosis or health prediction;
- an automatic Registry, Gallery, Verify, or Certificate decision.

## Why this belongs after Step 103–107

Step 103 added the growth and measurement assistant. Step 104 added the owner measurement archive. Step 105–107 locked the product structure and public language around real-user clarity. Step 108 builds on that stable state by adding a small intelligence foundation that reads the already available product signals:

- owner profile identity;
- date of birth, sex, color, location, and description;
- profile photos;
- pedigree context;
- measurement archive availability;
- future regression readiness;
- human review / authority boundaries.

## Current implementation

The foundation is implemented as a deterministic orientation layer:

- `packages/contracts/src/intelligence/usg-intelligence.types.ts` defines the shared intelligence document/signal contract.
- `apps/web/lib/usg-intelligence.ts` builds a versioned `step108-foundation-v1` document from available profile data.
- `apps/web/components/usg-intelligence-foundation-panel.tsx` renders the owner-facing USG Intelligence panel in BG/EN/IT.
- `apps/web/components/my-dog-form-workspace.tsx` places the panel above the existing measurement assistant in the owner dog form guidance stack.

## Future ML path

The safest future path is:

1. keep collecting clean dated measurements;
2. require at least two to three records before showing stronger growth trend orientation;
3. use regression only for numeric estimates such as growth ranges or measurement trends;
4. keep phenotype notes observational and separate from official standards;
5. keep all certificates and registry decisions under admin/human review.

## Locked boundaries

Step 108 intentionally avoids changes to:

- Registry publication logic;
- Certificate issue/revoke logic;
- Verify lookup logic;
- Gallery curation authority;
- Auth/session boundaries;
- Neon schema/migrations;
- admin moderation backend behavior.
