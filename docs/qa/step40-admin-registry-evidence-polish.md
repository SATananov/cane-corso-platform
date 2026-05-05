# Step 40 — Admin Registry Evidence / Control Clarity Polish

Status: ready for local verification.

## Scope

Step 40 adds a presentation-only evidence/control clarity panel to the Admin Registry area.

The panel explains the separation between:

- Registry publication
- USG Certificate decision
- Verify route
- USG Gallery curation
- Owner source data

## Locked boundaries

Step 40 must not change:

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
pnpm admin:registry-evidence:qa
pnpm public:registry-trust:qa
pnpm review:flow-evidence:qa
pnpm workspace:syntax
pnpm typecheck
```
