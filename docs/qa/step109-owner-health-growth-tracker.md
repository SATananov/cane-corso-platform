# Step 109 — Owner Health & Growth Tracker Foundation

## Goal

Add a practical private owner diary for each Cane Corso profile so the member can track:

- monthly weight and height records;
- a simple visual weight trend;
- vaccine records;
- deworming, medication, veterinary visit and general care notes;
- optional next due dates and veterinary metadata.

## Scope

This step adds an owner/member layer only.

- New private route: `/my-dogs/[dogId]/health`.
- New API route: `/api/dogs/[dogId]/health`.
- New DB table: `dog_health_records`.
- Reuses the existing `dog_measurement_records` archive for growth/weight.
- Adds a direct action from the owner Cane Corso card to the health tracker.

## Privacy and authority boundary

The health tracker is a personal owner diary. It is not public Registry data and does not change any official USG decision surface.

Preserved boundaries:

- no Registry publication logic changes;
- no Certificate issue/revoke changes;
- no Verify lookup changes;
- no Gallery selection changes;
- no Admin moderation authority changes;
- no Auth/session shortcut or dev fallback added;
- health records require the current member session and ownership of the dog profile.

## Medical wording boundary

The platform stores care history and optional next due dates. It does not prescribe vaccination schedules, diagnose health status, or replace the veterinarian.

Visible copy includes a clear veterinary authority note.

## QA

Run:

```bash
pnpm step109:owner-health-growth:qa
pnpm workspace:syntax
pnpm typecheck
```

Recommended browser check:

1. Login as a member.
2. Open `/my-dogs`.
3. Click **Здраве и растеж** on a Cane Corso card.
4. Add a weight record.
5. Add a vaccine record with a next due date.
6. Confirm the latest weight, next important date, tables and chart update.
7. Confirm the records stay private and do not appear in public Registry/Verify/Gallery surfaces.
