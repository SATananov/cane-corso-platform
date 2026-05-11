# Step 118 — Photo Evidence Flow & Upload Guidance

## Purpose

Step 118 adds a real owner-facing photo evidence flow for the existing **Провери за истинско / USG authenticity check** path.

It does not add a breed-proofing model and it does not make automatic claims. It prepares the platform for a future AI/ML image layer by guiding owners to upload the three useful views:

1. side standing view;
2. front standing view;
3. head detail.

## Scope

Changed/added surfaces:

- `apps/web/components/usg-photo-evidence-guide-panel.tsx`
- `apps/web/components/my-dog-form-workspace.tsx`
- `apps/web/components/dog-profile-form.tsx`
- `apps/web/app/globals.css`
- QA script and package script registration

## Guardrails

No changes were made to:

- Registry API authority;
- Verify API authority;
- Certificate document logic;
- Ecosystem backend;
- DB schema or health migrations.

The wording remains clear: photo evidence can support review, but it does not prove breed identity or pedigree.
