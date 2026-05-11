# Step 115 — Platform-wide Progressive Disclosure UX

Status: PASS / LOCK candidate after QA.

## Purpose

Step 115 applies the platform-wide UX rule discussed after Step 114.1: long informational or action-heavy sections should not force the user to scroll through everything. Anything that visually behaves like a button, chip, tab, or choice must either be a real active control or be visually passive.

## Implemented scope

- Added a reusable client component `ProgressiveChoicePanel` for active section buttons that reveal only the selected content.
- Converted generic Knowledge article body sections into active progressive tabs instead of rendering every article section at once.
- Converted `SectionContentGuidePanel` across public/member/admin surfaces from a long details card into a progressive explanation chooser.
- Converted `OwnerCaneCorsoSectionWorkspace` from a large grid of long cards into active owner-area buttons that reveal one selected action and one CTA at a time.
- Preserved Step 114/114.1 Health & Growth progressive chart tabs.
- Preserved the pregnancy/birth/puppy guide progressive table tabs.

## User experience rule

The user should see:

1. short context;
2. active choices;
3. only the selected information;
4. a clear next action;
5. critical warnings and trust boundaries still visible.

The user should not need to scroll through unrelated long blocks just to find the right section.

## Boundaries preserved

No DB schema, Auth/session, Registry authority, Certificate/Verify, Gallery backend, Admin backend, Ecosystem backend, or health migration logic was changed.

## QA

Run:

```bash
pnpm step115:platform-progressive-disclosure:qa
pnpm step114-1:growth-chart-clarity:qa
pnpm step114:progressive-growth-ux:qa
pnpm workspace:syntax
pnpm typecheck
node scripts/qa-fullstack-all-in-one-release-lock.mjs
```
