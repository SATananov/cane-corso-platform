# Step 115.2 — Page Hero Locale Fallback Polish

## Purpose

Step 115.2 tightens the active hero chip behavior introduced in Step 115.1 so legacy string chips never fall back to English copy just because the page uses a non-standard help label such as `Проверка`, `Към платформата`, `Verifica`, or `Apri piattaforma`.

## Scope

Changed files:

- `apps/web/components/page-hero-chip-row.tsx`
- `apps/web/app/(member)/ecosystem/page.tsx`
- `apps/web/app/(admin)/admin/ecosystem/page.tsx`
- `scripts/qa-step115-2-page-hero-locale-fallback-polish.mjs`
- `docs/qa/step115-2-page-hero-locale-fallback-polish.md`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`
- `package.json`

## What changed

- Hero chip fallback copy now uses a locale signal built from the help label and chip text instead of relying only on exact `Помощ` / `Aiuto` labels.
- Bulgarian fallback is detected from Cyrillic content.
- Italian fallback is detected from accented Italian text and common platform terms.
- Member Ecosystem PageShell now receives explicit localized `actionLabel` and `helpLabel` values.
- Admin Ecosystem PageShell now receives explicit localized `helpLabel` values.

## Locked boundaries

No backend or authority logic changed:

- Registry API and public Registry authority are untouched.
- Certificate and Verify logic are untouched.
- Gallery backend and public display rules are untouched.
- Ecosystem API/moderation backend is untouched.
- DB schema and health/growth migrations are untouched.
- Auth/session behavior is untouched.

## QA

Run:

```bash
pnpm step115-2:hero-locale-fallback:qa
pnpm step115-1:hero-chip-actions:qa
pnpm step115:platform-progressive-disclosure:qa
pnpm workspace:syntax
pnpm typecheck
```

Expected result: all checks pass.
