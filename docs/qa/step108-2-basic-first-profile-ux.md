# Step 108.2 — Basic-first Cane Corso Profile UX

Status: PASS-ready / UX patch

## Purpose

This step makes the Add/Edit Cane Corso experience calmer for real owners. A member can start with only the basic profile information and open deeper areas only when they have the data.

## Product decisions

- New profiles no longer assume the dog is male. The profile starts with `unknown` sex and the UI shows an explicit “select sex” placeholder.
- City and country remain empty until the owner enters them.
- The first screen prioritizes photo, name, slug, sex, birth date, and color.
- Documents, identity details, presentation, location, pedigree, validation/status, and USG certificate tools are optional progressive panels.
- USG Intelligence, FCI orientation, measurement assistant, review readiness, and submission guidance are hidden behind an optional guidance launcher.
- Submit-for-review still requires the important registry-ready data. Saving a draft remains calmer.

## Locked boundaries

No changes were made to:

- Registry authority logic
- Certificate issue/revoke logic
- Verify lookup
- Gallery curation
- Auth/session
- Neon schema/migrations
- Admin moderation backend

## Verification

Run:

```bash
pnpm step108-2:basic-first-profile:qa
pnpm step108-1-1:fci-ux-polish:qa
pnpm step108-1:fci-conformity:qa
pnpm step108:usg-intelligence:qa
pnpm release:all:qa
pnpm workspace:syntax
pnpm typecheck
```
