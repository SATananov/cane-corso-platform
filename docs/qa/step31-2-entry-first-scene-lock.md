# Step 31.2 — Entry First Scene Lock

## Status

Ready for local verification.

## Purpose

Step 31.2 keeps the approved Bulgarian entry headline as the stable first impression:

> Регистър, знания, общност и партньори — ясно разделени

The supporting cinematic/brand scenes remain available through the manual brand pills, but the entry screen no longer auto-rotates away from the approved first scene.

## Scope

Touched only:

- `apps/web/components/entry-experience.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-entry-first-scene-lock.mjs`
- `docs/qa/step31-2-entry-first-scene-lock.md`
- `package.json`

## What changed

- Removed automatic entry scene rotation.
- Kept scene `0` as the stable default first view.
- Preserved manual scene switching through the existing brand pills.
- Added small hero balance CSS overrides so the headline breathes better in the first viewport.
- Added Step 31.2 QA guardrail.

## Locked boundaries

No changes to:

- Registry logic
- Certificate logic
- Gallery logic
- Verify logic
- Admin moderation logic
- Ecosystem API / DB logic
- Knowledge article data logic
- Review / publish workflow

## Local QA commands

```bash
pnpm entry:first-scene:qa
pnpm entry:cinematic-fit:qa
pnpm entry:cinematic:qa
pnpm knowledge:admin-articles:qa
pnpm knowledge:browser-bg:qa
pnpm workspace:syntax
pnpm typecheck
```

## Browser check

Open:

```text
http://localhost:3000/
```

Expected first visible BG headline:

```text
Регистър, знания, общност и партньори — ясно разделени
```

The headline should remain stable unless the user manually clicks another brand pill.
