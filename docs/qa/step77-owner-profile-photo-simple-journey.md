# Step 77 — Owner Profile Photo & Simple Owner Journey

Status: ready for local verification.

## Scope

This step makes the member owner area easier to understand and use without changing Registry, Certificate, Verify, Gallery, Ecosystem, or Admin authority logic.

## What changed

- Adds a profile photo panel on `/profile` for the Cane Corso owner.
- Supports local owner photo selection, preview, upload, save, and remove.
- Adds `PATCH /api/profile/me` to update safe current profile fields and `POST /api/profile/me/avatar/upload` for image upload.
- Stores the owner photo as a normal `/uploads/...` URL and refreshes the signed session cookie without putting base64 image data in the cookie.
- Adds a simple owner journey checklist: owner photo → Cane Corso profile → Cane Corso photo → USG review → public Registry.
- Adds Step 77 QA script and package script.

## Safety boundary

No changes were made to:

- Registry publication logic
- Certificate issue/revoke logic
- Verify lookup logic
- Gallery selection logic
- Admin moderation authority
- Ecosystem API/DB lifecycle logic
- Database schema/migrations

## Local verification

Run:

```powershell
pnpm owner:profile-photo-journey:qa
pnpm workspace:syntax
pnpm typecheck
```

Optional runtime check:

```powershell
pnpm dev
```

Then log in as a member, open `/profile`, choose a PNG/JPG/WebP owner photo, save it, refresh, and verify the photo remains visible.
