# Step 30 — Admin-managed Knowledge Articles Foundation

Status: PASS / LOCK after local/static QA.

## Scope

Step 30 adds the first safe foundation for admin-managed Knowledge articles without turning the feature into a full CMS yet.

This step introduces:

- shared Knowledge article contract types;
- static fallback article records in BG / EN / IT;
- public `/knowledge/[slug]` article detail route;
- public article directory section inside `/knowledge`;
- admin-only read-only preview route at `/admin/knowledge`;
- article statuses: Draft / Pending review / Published / Archived;
- source-reference discipline;
- related-article structure;
- QA guardrail command.

## Important safety boundary

Step 30 is intentionally read-only.

It does **not** add:

- database migrations;
- write actions;
- admin editor forms;
- upload flows;
- moderation actions;
- public access to draft / pending / archived articles.

## Locked sections not touched

This step must not alter logic for:

- Registry;
- Certificate;
- Gallery;
- Verify;
- Admin moderation;
- Ecosystem API / DB logic;
- Review / publish workflow;
- certificate issuing / revoking;
- public registry detail logic.

## Public behavior

`/knowledge` now includes a public article section.

`/knowledge/[slug]` opens only records with:

```text
status === "published"
```

Drafts and internal records are present only in the admin foundation layer and must not resolve through the public article route.

## Admin behavior

`/admin/knowledge` is protected by the existing admin layout and is read-only in Step 30.

It previews the future CMS model:

- title;
- slug;
- language;
- category;
- sections;
- key facts;
- warnings;
- source references;
- status;
- featured flag;
- reading level;
- related articles;
- admin notes.

## QA

Run:

```bash
pnpm knowledge:admin-articles:qa
pnpm knowledge:browser-bg:qa
pnpm knowledge:center:qa
pnpm knowledge:center:visual:qa
pnpm knowledge:center:readability:qa
pnpm knowledge:center:bg-polish:qa
pnpm workspace:syntax
pnpm typecheck
```

## Browser checklist

Open:

```text
/knowledge
/knowledge/cane-corso-history-and-identity
/knowledge/official-standard-owner-reading
/knowledge/health-screening-and-responsible-care
/knowledge/training-socialization-and-public-safety
/admin/knowledge
```

Expected:

- public articles show as cards on `/knowledge`;
- public detail pages open for published records;
- draft slug does not open publicly;
- admin page shows the read-only model and all seeded statuses;
- dark and heritage mode remain readable;
- no locked Registry / Certificate / Gallery / Verify / Ecosystem logic is changed.
