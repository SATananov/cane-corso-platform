# Step 41 — Certificate / Verify Public Trust Continuity Polish

Status: ready for local verification.

## Scope

Step 41 adds a public trust-continuity panel to the Verify result presentation.

The panel explains the relationship between:

- Registry profile
- Verify result
- USG Certificate
- Trust continuity

## Important boundary

This step is presentation-only.

It must not change:

- Certificate issue/revoke logic
- Verify lookup logic
- Registry publish logic
- Gallery backend selection logic
- Admin moderation backend
- Ecosystem API/DB
- Auth/session

## Print safety

The trust-continuity panel is hidden in print CSS and must not affect the official certificate document print layout.

## Local verification

Run:

```bash
pnpm certificate:verify-trust:qa
pnpm admin:registry-evidence:qa
pnpm public:registry-trust:qa
pnpm review:flow-evidence:qa
pnpm workspace:syntax
pnpm typecheck
```
