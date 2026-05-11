# Step 113.3 — Active Guide Navigation & Chip Clarity

## Purpose

Step 113.3 fixes a UX issue noticed during browser review: hero chips looked like buttons, while only the Help button was truly active. For long Knowledge pages, users should not have to scroll and search manually for the right part of the article.

## Scope

This step adds active in-page navigation for the Cane Corso pregnancy / birth / puppy growth guide and clarifies the shared PageShell chip model:

- PageShell hero chips can now be either static labels or real links.
- Static chips remain visual context and are marked as non-interactive.
- Linked chips render as active anchors with hover/focus states.
- The pregnancy / birth / puppy guide article maps its hero chips to real sections.
- The guide itself now includes a section navigator inside the article body.
- Guide tables receive stable IDs for direct navigation:
  - `pregnancy-calendar`
  - `birth-preparation`
  - `birth-warnings`
  - `postpartum-care`
  - `puppy-day-1-40`
  - `owner-vet-boundary`

## User behavior

On `/knowledge/cane-corso-pregnancy-birth-puppy-growth-calendar`, the visible chips now work as quick navigation:

- Pregnancy / Бременност / Gravidanza → pregnancy calendar
- Whelping / Раждане / Parto → birth warning section
- Puppies / Малки / Cuccioli → Day 1–40 section
- Owner guide / Насоки / Guida → veterinary/deworming boundary section

The detailed guide also provides direct buttons for preparation, birth problems, after birth, Day 1–40, and deworming.

## Boundaries preserved

No changes were made to:

- DB schema or migrations
- Auth/session
- Registry API or public authority
- Certificate / Verify
- Gallery
- Admin backend
- Ecosystem backend moderation

This is a UI/content navigation patch only.

## QA

Run:

```bash
pnpm step113-3:active-guide-navigation:qa
pnpm step113-2:pregnancy-puppy-knowledge:qa
pnpm workspace:syntax
pnpm typecheck
```
