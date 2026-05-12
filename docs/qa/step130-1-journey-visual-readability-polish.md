# Step 130.1 — Journey Visual Readability Polish

Status: prepared from Step 130 clean checkpoint.

## Scope

Step 130.1 is a targeted presentation-only polish pass over the Step 130 USG journey/onboarding layer.

The goal is to make the new premium journey system easier to read in a real browser:

- soften the public journey title so it feels like an owner path, not a rigid instruction;
- make the journey card wider and more premium on desktop;
- make the slide controls/tabs taller and readable instead of tiny truncated pills;
- make the active slide more visible;
- make the USG watermark more subtle;
- improve mobile readability with two-column controls before collapsing to one column on very small screens.

## Touched areas

- `apps/web/components/usg-journey-carousel.tsx`
- `apps/web/app/globals.css`
- `docs/qa/step130-1-journey-visual-readability-polish.md`
- `scripts/qa-step130-1-journey-visual-readability-polish.mjs`
- `package.json`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`

## Preserved boundaries

This step must remain visual/copy only.

It does not change:

- database schema or migrations;
- auth/session logic;
- Registry publication authority;
- Certificate or Verify authority;
- Gallery backend selection logic;
- Admin moderation backend decisions;
- AI/ML proof claims;
- demo/dev/internal user-facing copy.

## Browser review checklist

Review these surfaces after applying the patch:

- `/`
- `/platform`
- `/member`
- `/my-dogs`
- `/review`

Expected visual result:

- the public journey title reads naturally;
- the carousel looks like a premium USG journey block, not a small widget;
- slide tabs are readable without looking technical;
- active slide state is obvious;
- admin rail stays compact and operational;
- mobile controls remain usable and not cramped.

## Local QA

```powershell
pnpm step130-1:journey-visual-readability:qa
pnpm step130:first-real-user-onboarding:qa
pnpm step129:live-product-evidence:qa
pnpm step128:product-priority-demo-separation:qa
pnpm workspace:syntax
pnpm release:all:qa
pnpm typecheck
```
