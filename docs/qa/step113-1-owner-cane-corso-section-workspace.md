# Step 113.1 — My Cane Corso Section Workspace & Health Visibility

## Purpose

Step 113.1 turns `/my-dogs` into a clearer owner workspace. The owner first sees the Cane Corso profile, then chooses a practical section instead of getting lost in one long edit page.

## What changed

- Added `OwnerCaneCorsoSectionWorkspace` under the main Cane Corso card.
- The workspace exposes clear sections:
  - Basic profile
  - Photos
  - Growth and measurements
  - Health and vaccines
  - Ratings
  - USG review
  - Community listings
  - Services and places
- The ratings section keeps USG/admin assessment separate from community rating.
- Public listing guidance now states that owner personal data remains hidden.
- Listing actions route to the existing member ecosystem workflow and remain admin-reviewed before public visibility.
- The Health & Growth tracker now shows more measurement fields:
  - weight
  - height at withers
  - body length
  - chest circumference
  - head length
  - muzzle length
  - skull length
- The tracker now includes weight and height charts, a broad standard-orientation card, and a careful conclusion note.
- Vaccine/care history remains a separate table with next due date, clinic/veterinarian and batch number.

## Boundaries

No intended changes to:

- Registry publication authority
- Certificate issue/revoke logic
- Verify lookup logic
- Gallery selection logic
- Auth/session logic
- Admin moderation backend
- DB schema/migrations
- Existing ecosystem submission backend

Public listings protect the owner. Public visibility remains protected: owner-created community listings are still submitted for review before publication.

## Manual browser checks

1. Log in as `softuni.demo@usg.local`.
2. Open `/my-dogs`.
3. Confirm the main Cane Corso card is followed by section cards.
4. Click “Растеж и размери” and verify it opens the growth table.
5. Click “Здраве и ваксини” and verify it opens the vaccine/care table.
6. Confirm USG/admin rating and community rating are visibly separated.
7. Open `/my-dogs/ares-softuni-demo/health` and confirm:
   - charts are visible,
   - extended measurement columns are visible,
   - vaccine table is visible,
   - the conclusion is phrased as an orientation, not a diagnosis.
8. Click community/service cards and confirm they route to the existing ecosystem forms.

## QA commands

```bash
pnpm step113-1:owner-workspace:qa
pnpm step113:demo-data:qa
pnpm workspace:syntax
pnpm typecheck
```
