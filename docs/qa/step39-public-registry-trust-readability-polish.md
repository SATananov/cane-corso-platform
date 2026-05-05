# Step 39 — Public Registry Profile Trust / Readability Polish

Status: ready for local verification.

## Scope

Step 39 adds a public-facing trust/readability panel to the Registry profile detail page.

The goal is to help guests, members and admins understand:

- Registry publication
- Official admin assessment
- USG Certificate decision
- Verify route
- Community rating
- Member-only profile depth

## Files

- `apps/web/components/public-registry-trust-readability-panel.tsx`
- `apps/web/components/public-registry-profile.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-public-registry-trust-readability-polish.mjs`
- `docs/qa/step39-public-registry-trust-readability-polish.md`
- `package.json`

## Locked boundaries

Step 39 must not change:

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
pnpm public:registry-trust:qa
pnpm review:flow-evidence:qa
pnpm workspace:syntax
pnpm typecheck
```
