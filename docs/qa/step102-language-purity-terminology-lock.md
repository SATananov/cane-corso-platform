# Step 102 — Language Purity & Terminology Lock

## Goal

Step 102 prevents mixed visible UI language from returning after the Step 101 USG Knowledge Standard Layer.

The user-facing rule is simple:

- Bulgarian UI should use Bulgarian navigation/product terms.
- Italian UI should use Italian product terms.
- English UI should stay English.
- Brand, breed, organization, and technology terms may remain original: USG, Unico Suo Genere, Cane Corso, Cane Corso Italiano, FCI, ENCI, AKC, CCAA, Neon, Netlify, Next.js, Drizzle.

## What this step fixes

Step 102 cleans the newest high-risk copy from Step 101 and the shared guidance/action surfaces:

- `guide` → `насоки` / `наръчник`
- `review` → `преглед`
- `screenshot` → `екранна снимка`
- `wording` → `формулировка`
- `topline` → `горна линия`
- `score badge` → `етикет за оценка`
- `Knowledge` → `Знания` where it is visible Bulgarian UI
- `Verify` → `Проверка` where it is visible Bulgarian UI
- `Registry` → `Регистър` where it is visible Bulgarian UI

## New guardrail

`pnpm step102:language-purity:qa` scans the most active visible-copy files:

- `apps/web/components/usg-standard-knowledge-panel.tsx`
- `apps/web/components/role-aware-action-panel.tsx`
- `apps/web/components/section-content-guide-panel.tsx`

The guardrail focuses on Bulgarian string literals with Cyrillic content, so TypeScript identifiers and English locale copy are not treated as UI-language errors.

## Scope boundary

Step 102 is copy/docs/QA only. It does not change:

- Neon schema or migrations
- Auth/session mechanics
- Registry publish authority
- Certificate issue/revoke authority
- Verify lookup authority
- Gallery authority
- Admin moderation backend logic
- Ecosystem authority logic
- Netlify deployment configuration

## Local commands

```bash
pnpm step102:language-purity:qa
pnpm step101:usg-standard-knowledge:qa
pnpm step100:owner-dog-privacy:qa
pnpm step99:active-section-routing:qa
pnpm docs:readme:qa
pnpm release:all:qa
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
```
