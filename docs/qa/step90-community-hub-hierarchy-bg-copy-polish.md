# Step 90 — Community Hub Hierarchy & BG Copy Polish

Status: prepared after Step 89.1.

## Goal

Make the public Community page intent-first and easier to scan, without changing backend authority logic.

## Scope

- Shows the main action hub before secondary discovery/orientation content.
- Keeps “Cane Corso търси:” as the primary Community action layer.
- Moves summary statistics below the main action/listing sections.
- Places sensitive active needs before places and services.
- Cleans Bulgarian copy for CTAs and headings.
- Makes lost/found the first visible Bulgarian intent card.
- Keeps admin-mediated contact language for sensitive community records.

## Locked boundaries

No change is intended for Registry publish logic, USG Certificate issue/revoke logic, Verify lookup, Gallery selection authority, DB schema, Neon configuration, or Netlify environment settings.

## Verification

Run:

```bash
pnpm community:hub-polish:qa
pnpm community:intent-hub:qa
pnpm ecosystem:friendly-places:qa
pnpm ecosystem:google-maps:qa
pnpm workspace:syntax
pnpm typecheck
```
