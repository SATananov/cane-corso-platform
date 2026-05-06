# Step 85.1 — Owner Form Copy & Preview Polish

Status: prepared / UI-copy only.

## Scope

This step performs a small owner/member copy and preview polish after Step 85 form-first UX.

Touched surfaces:

- `apps/web/components/dog-profile-form.tsx`
- `apps/web/components/dog-profile-preview-card.tsx`
- `apps/web/lib/i18n.ts`
- `scripts/qa-owner-form-polish.mjs`
- `package.json`

## Intent

- Replace technical/image wording in Bulgarian owner form actions with clearer photo wording.
- Rename the sidebar preview label from `Жив преглед` to `Преглед на профила`.
- Localize stored option values in the preview sidebar so values such as `Bulgaria` and `Black` render using the active locale labels.
- Keep the form-first ordering introduced in Step 85 unchanged.

## Guardrails

No changes to:

- Registry publish backend
- Certificate issue/revoke backend
- Verify lookup backend
- Gallery selection backend
- Ecosystem API/DB
- Auth/session logic
- Neon migrations or data
- Admin approval backend

## QA

Run:

```bash
pnpm owner:form-polish:qa
pnpm owner:form-first-ux:qa
pnpm owner:cane-first-ux:qa
pnpm db:target:qa
pnpm deploy:netlify:qa
pnpm workspace:syntax
pnpm typecheck
```
