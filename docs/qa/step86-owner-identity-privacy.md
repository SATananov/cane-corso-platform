# Step 86 — Owner Identity Profile & Privacy-Safe Registry Display

Status: prepared for local verification.

## Goal

Add a professional owner identity layer without exposing private owner data in the public Registry.

## Public rule

The public Registry shows only:

- owner display name
- owner avatar

The public Registry must not expose owner address, phone, email, website, bio, city, country, or precise location by default.

## Admin/private rule

The owner can store fuller identity/contact information in `/profile`. Admin review can see the protected owner details while deciding whether to approve, publish, or request changes.

## Scope

Changed only profile owner identity, admin review owner visibility, public owner display, contracts/schema, and one additive migration.

Locked logic intentionally not changed:

- Certificate issue/revoke logic
- Verify lookup logic
- Gallery backend selection logic
- Ecosystem backend/API logic
- Auth/session logic
- Runtime DB target guardrail

## Local verification

Run:

```bash
pnpm db:migrate
pnpm owner:identity-privacy:qa
pnpm owner:image-payload:qa
pnpm owner:form-polish:qa
pnpm owner:form-first-ux:qa
pnpm db:target:qa
pnpm deploy:netlify:qa
pnpm workspace:syntax
pnpm typecheck
```

## Browser verification

1. Open `/profile` as a member.
2. Add avatar, first/middle/last name, city/country, address, website, phone, and owner note.
3. Save owner details.
4. Add/submit a Cane Corso profile.
5. Open `/review` as admin and confirm protected owner details are visible to admin.
6. Publish the profile.
7. Open `/registry` and `/registry/[slug]` publicly and confirm only owner name + avatar are shown.
8. Confirm address, phone, email, website, bio, and location do not appear publicly.
