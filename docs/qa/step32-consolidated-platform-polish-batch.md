# Step 32 — Consolidated Platform Polish Batch

Status: ready for local verification.

This batch intentionally replaces several tiny follow-up steps with one safer consolidated layer. It builds on the locked Step 31.2 cinematic entry checkpoint.

## Included

- Entry mobile/header guardrail polish.
- Public Knowledge article directory readiness summary.
- Admin Knowledge publishing overview metrics.
- Admin Knowledge future workflow documentation in UI.
- Admin Knowledge safety guardrails for drafts, public visibility, and locked platform logic.
- QA script and package command for the consolidated batch.

## Protected boundaries

This batch does not add database writes and does not touch Registry, Certificate, Gallery, Verify, Review, Admin moderation, or Ecosystem API/DB logic.

## Local verification

Run:

```bash
pnpm platform:polish-batch:qa
pnpm entry:first-scene:qa
pnpm entry:cinematic-fit:qa
pnpm knowledge:admin-articles:qa
pnpm knowledge:browser-bg:qa
pnpm workspace:syntax
pnpm typecheck
```

Browser review:

- `/`
- `/knowledge`
- `/knowledge/cane-corso-history-and-identity`
- `/admin/knowledge`
- `/platform`
