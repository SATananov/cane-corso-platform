# Step 104 — Owner Growth Measurement Archive

Status: patch prepared / QA guardrail added

## Purpose

Step 104 upgrades the Step 103 measurement assistant from a temporary preview into an owner-private tracking archive.

The owner can now save dated Cane Corso measurements and follow growth, weight, and proportions over time.

## Product behavior

Inside the member Cane Corso form, the USG measurement assistant now supports:

- measurement date;
- weight in kg;
- height at withers in cm;
- body length in cm;
- chest circumference in cm;
- head length in cm;
- muzzle length in cm;
- skull length in cm;
- short owner note;
- private archive table;
- latest movement summary between the two newest records;
- age-aware USG preview for each saved record.

The archive is available after the Cane Corso profile has been saved and has a real `dogId`.

## Persistence

Step 104 adds a dedicated table:

- `dog_measurement_records`

The table is owner/dog scoped. A member can list, create, and delete only records that belong to their own Cane Corso profile.

API route:

- `GET /api/dogs/[dogId]/measurements`
- `POST /api/dogs/[dogId]/measurements`
- `DELETE /api/dogs/[dogId]/measurements`

## Safety and authority boundary

The archive is not public Registry data. It is an owner-private tracking layer and future admin-review context.

The measurement assistant still does not:

- does not approve Registry publication;
- issue or revoke USG certificates;
- replace human/admin review;
- act as veterinary diagnosis;
- act as DNA or pedigree proof;
- change Verify, Gallery, Ecosystem, or Auth/session authority.

## Calculation behavior

The Step 103 deterministic evaluator now accepts an optional `measurementDate`, so historical records are evaluated using the dog age at the time of that measurement, not only the current date.

## QA commands

```bash
pnpm step104:growth-archive:qa
pnpm step103:growth-measurement:qa
pnpm workspace:syntax
pnpm typecheck
pnpm db:migrate
```

Run `pnpm db:migrate` locally before browser testing the archive against a real database.
