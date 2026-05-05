# Step 31.1 — Cinematic Entry Visual Fit Polish

## Status

PASS / READY FOR LOCAL REVIEW

## Purpose

Step 31.1 refines the cinematic entry screen after the initial Step 31 brand integration. The goal is to make the root `/` experience closer to the approved premium USG direction: stronger cover visibility, refined black/gold glass surface, a compact luxury entry navigation bar, and a first viewport that feels finished without changing product logic.

## Scope

Touched files:

- `apps/web/components/entry-experience.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-entry-cinematic-visual-fit-polish.mjs`
- `docs/qa/step31-1-cinematic-entry-visual-fit-polish.md`
- `package.json`

## Visual changes

- Added a compact entry-only luxury topbar with brand lockup, navigation links, sign-in action, and language controls.
- Reordered the entry copy so the first visible Bulgarian headline is the approved direction: “Регистър, знания, общност и партньори — ясно разделени”.
- Improved the entry cover visibility with brighter gold map/Colosseum/Cane Corso atmosphere while keeping the screen dark and premium.
- Refined the left glass content card with stronger breathing room, softer glass, improved border/shadow, and tighter first-viewport balance.
- Converted the indicator row into a cleaner set of brand pills.
- Added mobile-safe layout adjustments.

## Locked boundaries

This step does **not** change:

- Registry logic
- Certificate logic
- Gallery logic
- Verify logic
- Admin moderation logic
- Ecosystem API / DB logic
- Knowledge article foundation logic
- Review / publish workflow

## Local QA

Run:

```bash
pnpm entry:cinematic-fit:qa
pnpm entry:cinematic:qa
pnpm knowledge:admin-articles:qa
pnpm knowledge:browser-bg:qa
pnpm workspace:syntax
pnpm typecheck
```

## Browser checklist

Open:

- `/`
- `/platform`
- `/knowledge`
- `/admin/knowledge`

Expected:

- `/` shows the cinematic USG cover as the first experience.
- The first visible entry headline is the registry/knowledge/community/partners separation message.
- The cover is readable but still dark/luxury.
- The entry topbar resembles the premium black/gold platform language.
- Platform routes continue to work normally after entry.
