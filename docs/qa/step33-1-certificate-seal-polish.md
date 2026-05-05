# Step 33.1 — Certificate Official Seal Polish

Status: ready for local browser/PDF review.

## Scope

This step is a visual-only refinement of the official USG seal on the certificate document.

## Changes

- Reduces the certificate seal from the first trust-system pass so it reads as an official stamp rather than a heavy decorative element.
- Refines the seal placement slightly lower/right for the screen certificate and A4 print layout.
- Keeps the existing official USG seal asset and trust-system usage unchanged elsewhere.

## Locked boundaries

No Registry, Verify, Gallery, Certificate issuing/revoking, Admin moderation, Ecosystem API/DB, or Knowledge article logic was changed.

## QA

Run:

```bash
pnpm certificate:seal-polish:qa
pnpm brand:trust:qa
pnpm workspace:syntax
pnpm typecheck
```

Review in browser:

- `/certificate/[code]`
- print/save PDF preview

Expected result: the official USG seal remains visible and authoritative, but no longer visually overpowers the certificate fields/signature area.
