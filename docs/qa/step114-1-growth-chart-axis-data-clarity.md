# Step 114.1 — Growth Chart Axis & Data Clarity

## Purpose

Step 114 introduced progressive growth insight panels and SVG line charts. Step 114.1 makes those charts self-explanatory for real owners: visible axis labels, visible value scale hints, month labels, chart guidance text, and table-like headers below the chart.

## Scope

- Clarifies that bottom chart numbers are age in months.
- Clarifies that the vertical scale is weight in kg or height in cm depending on the active graph.
- Adds localized BG/EN/IT labels for axis titles and chart data headers.
- Keeps owner measurement records, standard midpoint, and orientation range visibly separated.
- Keeps measurement/health tables behind the Records tab.

## Boundaries

No changes to database schema, auth/session, Registry authority, Certificate/Verify, Gallery, Admin backend, Ecosystem backend, or health migration logic.

## QA

```bash
pnpm step114-1:growth-chart-clarity:qa
pnpm step114:progressive-growth-ux:qa
pnpm workspace:syntax
pnpm typecheck
node scripts/qa-fullstack-all-in-one-release-lock.mjs
```
