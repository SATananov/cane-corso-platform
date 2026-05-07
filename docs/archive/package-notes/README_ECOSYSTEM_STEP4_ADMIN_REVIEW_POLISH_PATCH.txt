# Cane Corso Platform — Ecosystem Step 4 Admin Review Polish

Copy/paste this ZIP into the repository root after Step 3 is already green.

## Scope

This patch is intentionally visual/UX-focused and does not change Registry, Certificate, My Cane Corso, Gallery, or database logic.

Changed surfaces:
- `/review`
- `/admin/partners`
- `/admin/ecosystem`
- shared admin moderation dashboard styling

## What changed

- Added admin command panels that explain the operational workflow:
  - Registry first, USG certificate second
  - Partner applications -> public directory -> ecosystem sync
  - Ecosystem moderation gate before public visibility
- Added safer, cleaner public website links in admin partner cards instead of raw URLs.
- Added hero chips and notes for admin review pages.
- Added responsive premium styling for dark and Heritage light themes.
- Preserved all existing actions and server logic.

## Run locally

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
pnpm ecosystem:qa
pnpm workflow:qa
pnpm requirements:qa
pnpm dev
```

## Manual check

Open:
- /review
- /admin/partners
- /admin/ecosystem
- /partners
- /community

Confirm that the locked Registry/Certificate/My Cane Corso flows still behave the same.
