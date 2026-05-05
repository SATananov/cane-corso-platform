# Step 28.3 — Knowledge Center Bulgarian Terminology Polish

Status: PASS / LOCK

## Scope

This step is a narrow browser-copy polish pass for `/knowledge` after reviewing the Bulgarian screenshots from Step 28.2.

The goal is to keep the Step 28 Knowledge Center foundation intact while improving the Bulgarian reading quality and removing visible mixed-language phrases from cards, facts, health notes, practical guide items, editorial-model chips, and source descriptions.

## Changed safely

- Localized visible Bulgarian phrases such as guardian / guide / timeline / registry / evaluation / screening / owner awareness / admin-managed / source discipline.
- Kept official names and abbreviations where appropriate: Cane Corso, FCI, AKC, CCAA / CHIC, OFA, PennHIP, NCL, DSR / DSRA, FCI Standard N°343.
- Localized source-card call-to-action by using the page action label instead of hard-coded `Open source`.
- Preserved the existing static Knowledge structure and public route.

## Boundaries

Locked sections remain untouched:

- Registry
- Registry detail
- Certificate / Verify
- Gallery
- My Cane Corso
- Partners
- Community / Ecosystem logic
- Admin moderation flows
- Database schema and migrations

## QA command

```bash
pnpm knowledge:center:bg-polish:qa
```


QA markers:

- Bulgarian terminology polish
- localized source-card action
- locked sections remain untouched
