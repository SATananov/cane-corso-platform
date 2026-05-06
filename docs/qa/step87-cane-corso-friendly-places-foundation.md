# Step 87 — Cane Corso-friendly Places Foundation

## Scope

Step 87 makes the existing ecosystem submission/publication flow easier to use for Cane Corso-friendly places without adding a new database table or changing registry/certificate logic.

## Product rule

Members can suggest useful places such as parks, walking zones, training fields, pet-friendly shops, cafés/restaurants, hotels, clinics, and large-breed friendly services. Public visibility still requires admin review and publication.

## UX changes

- The owner ecosystem workspace now starts with a Cane Corso-friendly places quick-start panel.
- New ecosystem submissions default to `community_listing` and `walk_play_place` so a member can immediately submit a place.
- The form appears before the explanatory submission matrix, making the flow more action-first.
- The quick-start checklist asks for large-breed suitability, leash/muzzle rules, indoor/outdoor access, water, shade, space, and parking.
- The public community directory highlights approved friendly places before the full ecosystem directory.

## Safety boundary

No changes were made to Registry, Certificate, Verify, Gallery, Auth/session, DB target guardrail, or ecosystem API authority rules.

## QA

Run:

```bash
pnpm ecosystem:friendly-places:qa
pnpm owner:identity-privacy:qa
pnpm owner:image-payload:qa
pnpm db:target:qa
pnpm deploy:netlify:qa
pnpm workspace:syntax
pnpm typecheck
```
