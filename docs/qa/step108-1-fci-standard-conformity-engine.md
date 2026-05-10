# Step 108.1 QA — FCI Standard Conformity Engine

## Goal

Confirm that the platform now separates:

- USG certificate authority;
- FCI conformity orientation;
- official FCI/club/kennel documentation.

The user-facing wording must be clear that USG certificate is a platform trust document and not an FCI certificate.

## Required checks

Run:

```bash
pnpm step108-1:fci-conformity:qa
pnpm step108:usg-intelligence:qa
pnpm step107:product-lock:qa
pnpm release:all:qa
pnpm workspace:syntax
pnpm typecheck
```

## Browser smoke

Open:

- `/my-dogs/new`
- `/my-dogs/[dogId]/edit`

Check:

- FCI conformity panel appears after USG Intelligence and before Measurement Assistant.
- BG/EN/IT copy is not mixed.
- The panel clearly states that USG certificate is not an FCI certificate.
- For unsaved dogs, it asks the owner to save the profile before using measurement archive.
- For saved dogs without measurements, it asks for height/weight/proportions.
- For puppies, wording is development-only, not final adult judging.

## Locked boundaries

Step 108.1 must not change:

- Registry publication authority;
- Certificate issue/revoke logic;
- Verify lookup logic;
- Gallery curation logic;
- Auth/session logic;
- Neon schema/migrations;
- Admin moderation backend decisions.
