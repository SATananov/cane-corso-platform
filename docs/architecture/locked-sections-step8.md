# Locked Sections After Step 8

Step 8 — Final Web Platform Consistency Pass is treated as PASS / LOCK.

This document protects the current stable platform state before the next feature layer.

## Locked after Step 8

Do not change these areas during housekeeping, packaging, or unrelated feature work:

- `/profile` — light / dark / BG / IT
- `/access` — light / dark / BG / IT
- `/platform` / home — light / dark / IT
- header utility behavior
- BG / EN / IT consistency rules
- contrast, empty states, and scaffold/dev-text cleanup completed in Step 8

## Previously locked areas

Do not change these without an explicit task for that exact area:

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

## Allowed Step 9 scope

Step 9 may only touch project hygiene and guardrails:

- checkpoint ZIP creation scripts
- packaging exclusions
- repository ignore rules
- QA/checkpoint documentation
- non-runtime documentation

## Not allowed in Step 9

- UI redesigns
- copy changes in locked routes
- route behavior changes
- database schema changes
- moderation logic changes
- auth/session changes
- registry/gallery/certificate/verify flow changes

## Next safe feature direction

After Step 9, the safest next product layer is a member-facing workspace such as Owner Center / Member Ecosystem Workspace, because it can be developed without disturbing the locked public registry, certificate, gallery, review, and admin moderation flows.
