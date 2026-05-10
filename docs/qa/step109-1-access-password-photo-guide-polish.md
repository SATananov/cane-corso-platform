# Step 109.1 — Access Password Visibility & Owner Photo Guide Polish

## Purpose

This micro-step fixes two owner-facing UX issues discovered during local browser review after Step 109:

- the Access login/register password fields now have a visible show/hide control;
- the small My Dogs side guidance card no longer displays the cramped USG photo reference image inline.

## Scope

Changed only presentation and owner/member guidance surfaces:

- `apps/web/components/member-access-panel.tsx`
- `apps/web/components/owner-photo-guide-panel.tsx`
- `apps/web/components/my-dogs-overview.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-step109-1-access-password-photo-guide-polish.mjs`
- this QA note
- `package.json`
- release QA guardrail registration

## Locked boundaries

No changes were made to:

- auth/session server authority;
- Registry, Certificate, Verify, Gallery logic;
- Admin review/publication authority;
- Neon schema, migrations, or database repositories;
- Step 109 health tracker API/data model.

## Expected UX

### Access

Password fields in the sign-up and sign-in cards expose a small control:

- BG: `Покажи паролата` / `Скрий паролата`
- EN: `Show password` / `Hide password`
- IT: `Mostra password` / `Nascondi password`

The control toggles the input type between `password` and `text` without changing submit logic.

### My Dogs guidance

The `USG STANDARD` side card remains useful, but text-first:

- no small unreadable image appears inside the side card;
- users get a clear action to open the full photo guidance area;
- the expandable guidance section has a stable anchor: `#owner-photo-review-guidance`.

## Verification

Run:

```bash
pnpm step109-1:access-photo-guide:qa
pnpm step109:owner-health-growth:qa
pnpm workspace:syntax
pnpm typecheck
```

`pnpm typecheck` must be run locally with dependencies installed.
