# Step 114 — Global Progressive Disclosure UX Foundation & Growth Comparison Layer

Status: PASS / LOCK after QA.

## Purpose

Step 114 introduces a safer UX pattern for long informational sections: the platform should not show a wall of content and then force the user to jump around. Long guides and data-heavy owner panels now expose clear active choices and reveal only the selected information.

## Implemented

- The pregnancy / birth / puppy Knowledge guide now uses active progressive tabs instead of rendering every table at once.
- PageShell hero chips can act as non-scroll progressive triggers when a page provides a target panel ID.
- Owner Health & Growth now includes a progressive insight switch:
  - overview;
  - weight graph;
  - height graph;
  - standard orientation graph;
  - combined owner + standard comparison;
  - deviations;
  - records.
- Growth charts are rendered with local SVG, no new runtime dependency.
- Owner records and health tables are moved behind the Records tab to reduce clutter.
- Veterinary and standard-copy boundaries remain visible and non-diagnostic.

## Boundaries

No DB schema, Auth/session, Registry authority, Certificate/Verify, Gallery, Admin backend, Ecosystem backend, or health migration logic was changed.

## QA

Run:

```bash
pnpm step114:progressive-growth-ux:qa
pnpm step113-3:active-guide-navigation:qa
pnpm step113-2:pregnancy-puppy-knowledge:qa
pnpm workspace:syntax
pnpm typecheck
node scripts/qa-fullstack-all-in-one-release-lock.mjs
```
