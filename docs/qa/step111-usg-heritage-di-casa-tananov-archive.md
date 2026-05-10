# Step 111 — USG Heritage / di Casa Tananov Personal Archive

## Purpose

Add a public, premium, personal Cane Corso heritage layer for USG without presenting the platform as a breeder, sales channel, pedigree authority, or official kennel record.

The section explains that USG was born from owner experience, long-term fascination with Cane Corso, and personal observations, while preserving the platform's existing official trust boundaries.

## Scope

Step 111 adds:

- Public route: `/heritage`
- Shared component: `UsgFounderHeritagePanel`
- Public platform teaser on `/platform`
- Localized BG/EN/IT copy
- Personal archive identity: `di Casa Tananov`
- Seven personal Cane Corso archive images:
  - Mark I
  - Hera
  - Thor
  - Reia
  - Mark II
  - Ara
  - Broly
- CSS for the premium archive layout, responsive cards, and heritage theme support
- QA guardrail script and package script

## Boundaries preserved

Step 111 does **not** change:

- Registry authority logic
- Certificate issue/revoke or verification logic
- Gallery backend selection
- Admin moderation authority
- Auth/session behavior
- DB schema or migrations
- Step 109 health tracker API/model
- Step 110 member dashboard behavior

## Tone rules

The archive must be:

- personal, not commercial
- owner-experience based, not breeder positioning
- respectful toward official breed systems
- clear that `di Casa Tananov` is a personal heritage identity, not a kennel claim

Required visible Bulgarian idea:

> Личен архив, не развъдник

Required boundary idea:

> di Casa Tananov се използва тук като лична heritage идентичност.

## Local QA

Run:

```powershell
pnpm step111:usg-heritage:qa
pnpm step110:member-dashboard:qa
pnpm step109-1:access-photo-guide:qa
pnpm step109:owner-health-growth:qa
pnpm workspace:syntax
pnpm typecheck
```

## Browser review

Review:

- `/heritage`
- `/platform`
- BG / EN / IT locale toggles
- Dark theme and Heritage theme
- Mobile layout

The section should feel like founder/owner heritage and not like a kennel or sales page.
