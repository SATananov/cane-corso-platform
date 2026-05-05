# Step 37 — Admin Review Decision Console & Evidence Guardrails

Status: ready for local verification.

## Scope

Step 37 adds a presentation-only admin decision-support layer to the existing review queue.

It helps the admin see the evidence boundary before public actions:

- Registry approval/publication
- USG certificate decision
- USG Gallery curation
- Owner/private source-data boundary

## Files

- `apps/web/components/review-decision-readiness-panel.tsx`
- `apps/web/components/review-queue-dashboard.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-admin-review-decision-console.mjs`
- `docs/qa/step37-admin-review-decision-console.md`
- `package.json`

## Locked boundaries

Step 37 must not change:

- Registry publish logic
- Certificate issue/revoke logic
- Verify lookup logic
- Gallery selection backend logic
- Admin moderation backend
- Ecosystem API/DB
- Auth/session

## Local verification

Run:

```bash
pnpm admin:review-decision:qa
pnpm owner:review-readiness:qa
pnpm workspace:syntax
pnpm typecheck
```
