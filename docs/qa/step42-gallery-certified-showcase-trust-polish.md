# Step 42 — Gallery / Certified Showcase Trust Polish

Status: ready for local verification.

## Scope

Step 42 adds a presentation-only trust/readability panel to the public Gallery surface and prepares a Certified variant inside the shared component.

The goal is to make these boundaries clear:

- USG Gallery is a curated showcase layer.
- Owner uploads do not automatically become Gallery showcase images.
- Registry publication is separate from Gallery showcase selection.
- USG Certificate / Certified archive is separate from Gallery participation.
- Verify and Certificate continuity remain unchanged.

## Certified page note

The Certified variant is implemented in the shared component, but the Certified route has a different page structure and is intentionally not force-wired by this blind patch. It can receive a targeted page-specific pass later.

## Locked boundaries

Step 42 must not change:

- Registry publish logic
- Certificate issue/revoke logic
- Verify lookup logic
- Gallery backend selection logic
- Admin moderation backend
- Ecosystem API/DB
- Auth/session

## Local verification

Run:

```bash
pnpm gallery:showcase-trust:qa
pnpm certificate:verify-trust:qa
pnpm admin:registry-evidence:qa
pnpm public:registry-trust:qa
pnpm review:flow-evidence:qa
pnpm workspace:syntax
pnpm typecheck
```
