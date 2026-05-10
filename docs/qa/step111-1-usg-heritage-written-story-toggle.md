# Step 111.1 — USG Heritage Written Story Toggle

## Purpose

Add the written founder/owner story to the USG Heritage surface without turning the page into a long forced-reading biography.

The story must stay optional: visitors see the archive and a clear button-like control, then choose whether to open the deeper text.

## Scope

Touched surface:

- `apps/web/components/usg-founder-heritage-panel.tsx`
- `apps/web/app/globals.css`
- `docs/qa/step111-1-usg-heritage-written-story-toggle.md`
- `scripts/qa-step111-1-usg-heritage-written-story-toggle.mjs`
- `package.json`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`

## Product rules

- The story is personal founder/owner heritage.
- `di Casa Tananov` remains a personal archive identity.
- The page must not present Stefan Tananov as a kennel, breeder, sales channel, official pedigree authority, or replacement for official breed systems.
- The long story must be hidden by default inside an expandable `<details>` block on the full `/heritage` view.
- The compact `/platform` teaser must remain compact.

## Story content boundaries

The written story may include:

- Stefan Tananov by name.
- Mark I as the first Cane Corso and beginning of the path.
- Hera as Mark I’s pair and the motherly heart of the archive.
- Natural care, responsibility, and no forced production framing.
- 57 puppies from Mark I and Hera gifted, not sold.
- Personal screening/test conversations before gifting a Cane Corso.
- Thor, Reia, Mark II, Ara, and Broly as personal archive chapters.
- Broly returning home when his owner became ill.
- The aftercare principle: Cane Corso is not given and forgotten.
- USG as care, observation, knowledge, and respectful documentation.

The written story must avoid:

- Selling language.
- Pricing language.
- Breeder/kennel claims.
- Official pedigree authority claims.
- Medical speculation or blame around Mark I’s illness.

## Checks

Run:

```bash
pnpm step111-1:usg-heritage-story:qa
pnpm step111:usg-heritage:qa
pnpm workspace:syntax
pnpm release:all:qa
```

`pnpm typecheck` remains the local TypeScript authority when dependencies are installed.
