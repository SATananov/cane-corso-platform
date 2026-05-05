# Step 36 — Owner / My Dogs Review Readiness & Public Presentation Batch

Status: READY FOR LOCAL QA

## Purpose

Step 36 adds a professional owner-facing readiness layer around My Dogs without changing locked business logic. The goal is to make it clear to a member what is ready for admin review, what remains private, and what can become public only through the existing admin-controlled trust path.

## Scope

Changed / added:

- `apps/web/components/owner-review-readiness-panel.tsx`
- `apps/web/components/my-dogs-overview.tsx`
- `apps/web/components/my-dog-form-workspace.tsx`
- `apps/web/components/dog-profile-preview-card.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-owner-review-readiness.mjs`
- `docs/qa/step36-owner-review-readiness.md`
- `package.json`

## Locked boundary

Do not treat this step as a business-logic migration. The locked Registry / Certificate / Gallery / Verify / Admin moderation / Ecosystem API-DB / Auth logic boundaries remain untouched by design.

Step 36 is a presentation, guidance, and QA layer only.

## Product behavior added

### Owner review readiness panel

The new panel appears in three owner/member contexts:

1. My Dogs featured profile spotlight.
2. Add/Edit Cane Corso workspace, above the main form.
3. Live preview sidebar.

It checks and presents owner readiness for:

- identity: name and slug;
- core details: birth date, color, city, country;
- owner story: short description;
- photos: primary image plus up to three profile photos;
- pedigree support: helpful but optional lineage data/photos;
- review path: draft/submitted/publication state without forcing certification.

### Trust boundary explanation

The panel explicitly separates:

- Owner profile: private workspace and draft changes;
- Registry: visible only after admin publication;
- USG Certificate: separate official admin decision;
- USG Gallery: admin-curated, never automatic from owner uploads.

This preserves the locked distinction:

- Registry approval is not the same as USG certification.
- Owner-uploaded photos are not automatically USG Gallery selections.
- Admin authority remains separate from community/profile presentation.

## Visual behavior

- Premium black/gold readiness panel matching the existing USG visual language.
- Compact mode for spotlight/sidebar contexts.
- Responsive grid that collapses on mobile.
- Heritage theme surface overrides.
- No changes to entry, registry, verify, certificate document, gallery selection, admin moderation, ecosystem API, or auth flows.

## QA commands

Run:

```bash
pnpm owner:review-readiness:qa
```

Recommended full local guardrail run after applying the package:

```bash
pnpm owner:review-readiness:qa
pnpm breed:standard:qa
pnpm public:experience-polish:qa
pnpm brand:trust:qa
pnpm certificate:seal-polish:qa
pnpm entry:first-scene:qa
pnpm knowledge:admin-articles:qa
pnpm knowledge:browser-bg:qa
pnpm workspace:syntax
pnpm typecheck
```

## Browser checklist

Member flow:

- Open `/my-dogs` and verify the featured profile includes the readiness panel.
- Open `/my-dogs/new` and verify the readiness panel appears above the form.
- Open an existing `/my-dogs/[id]/edit` profile and verify the live preview includes the compact readiness panel.
- Add fewer than three photos and confirm the readiness checklist says photos need work.
- Add three photos and confirm the photos metric reaches 3/3.
- Add pedigree data and confirm optional pedigree support updates.
- Confirm wording clearly states that Registry, USG Certificate, and USG Gallery are separate.

Admin / locked flow sanity:

- No Registry publish/revoke behavior should change.
- No Certificate issue/revoke behavior should change.
- No Verify lookup behavior should change.
- No Gallery selection behavior should change.
- No Auth/session behavior should change.
