# Step 47 — Public Knowledge / Breed Education Experience Polish

Status: PASS-ready after local QA.

## Purpose

Step 47 turns the public Knowledge surface from a long reference page into a guided breed education experience. The intent is to help guests, members, owners, and future partners understand the Cane Corso before they use Registry, Verify, Certificate, Gallery, or owner/member trust surfaces.

## Scope

Presentation/read-model only:

- add a public Knowledge education experience panel on `/knowledge`;
- add a recommended learning path;
- add category-based reading zones generated from published Knowledge articles;
- add a trust-boundary panel that explains what Knowledge does and does not do;
- add an article reader compass on individual public article pages;
- add responsive and Heritage theme CSS for these surfaces;
- add QA coverage for Step 47.

## Locked boundaries

This step must not change:

- Registry publish logic;
- Certificate issue / revoke logic;
- Verify lookup logic;
- Gallery backend selection logic;
- Admin moderation backend;
- Ecosystem API / DB logic;
- Auth / session logic;
- database schema or migrations;
- article publication filtering rules.

## Files changed

- `apps/web/components/knowledge-education-experience.tsx`
- `apps/web/components/knowledge-article-reader-compass.tsx`
- `apps/web/components/knowledge-center.tsx`
- `apps/web/components/knowledge-article-detail.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-public-knowledge-education-experience-polish.mjs`
- `docs/qa/step47-public-knowledge-education-experience-polish.md`
- `package.json`

## QA commands

```bash
pnpm knowledge:experience-polish:qa
pnpm knowledge:browser-bg:qa
pnpm trust:targeted-visual:qa
pnpm workspace:syntax
pnpm typecheck
```

## Manual browser checklist

- Open `/knowledge` in dark theme.
- Confirm the new education experience panel appears before the article directory.
- Confirm the recommended learning path links work.
- Confirm reading zones show category counts and route to public published articles.
- Confirm the trust-boundary panel explains that Knowledge is educational and does not mutate Registry / Certificate / Verify / Gallery / Admin / Ecosystem / Auth logic.
- Open `/knowledge/cane-corso-history-and-identity` and confirm the reader compass appears below the article header.
- Switch to BG and IT and confirm no obvious mixed-language breakage.
- Switch to Heritage theme and confirm contrast remains readable.
- Run the QA chain above and verify typecheck reports `8 successful, 8 total`.

## Result

Step 47 is safe to review as a single meaningful Knowledge experience polish batch. It should be locked only after local browser review and typecheck pass on the real workspace.
