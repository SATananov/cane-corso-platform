# Step 31 — Cinematic Entry Page Brand Integration

Status: **PASS / READY FOR LOCAL REVIEW**

## Purpose

Integrate the new **USG Platform Cover** visual as the first cinematic brand impression of the platform.

This step is intentionally narrow: it affects the root entry/welcome experience only — entry page only and does not change registry, certificate, gallery, verification, admin moderation, ecosystem API, or database behavior.

## Files changed

- `apps/web/components/entry-experience.tsx`
- `apps/web/app/globals.css`
- `apps/web/public/brand/entry/usg-global-ecosystem-cover.png`
- `scripts/qa-entry-cinematic-brand-integration.mjs`
- `docs/qa/step31-cinematic-entry-brand-integration.md`
- `package.json`

## Design decision

The uploaded global ecosystem artwork is used as the main cinematic background for the `/` entry page.

The seal/official identity system remains separate from this step. The large global cover is used for atmosphere and first impression; trust marks, certificate seals, registry badges, and verify UI remain protected for a later dedicated trust/seal step.

## Scope

Step 31 changes:

- the first entry page visual identity;
- the entry stage background treatment;
- the localized EN/BG/IT entry copy;
- mobile/desktop entry cover styling;
- a guardrail QA script and documentation.

Step 31 does **not** change:

- Registry logic or public registry detail logic;
- Certificate issuing, revoking, rendering, or print flow;
- Gallery logic or controls;
- Verify logic or public verification route behavior;
- Admin moderation logic;
- Ecosystem API / DB logic;
- Review / publish workflow;
- Knowledge article foundation logic from Step 30.

## Browser checklist

After applying the patch, run:

```powershell
pnpm entry:cinematic:qa
pnpm knowledge:admin-articles:qa
pnpm knowledge:browser-bg:qa
pnpm workspace:syntax
pnpm typecheck
pnpm dev
```

Then review:

- `/`
- `/platform`
- `/knowledge`
- `/admin/knowledge`

Expected result:

- `/` opens with the cinematic USG global ecosystem cover.
- The entry page still has language switcher and member/partner/platform CTAs.
- The cover is used only as entry atmosphere, not as a heavy background across the platform.
- `/platform`, `/knowledge`, and `/admin/knowledge` still work.
- Locked registry, certificate, gallery, verify, admin moderation, and ecosystem logic remains untouched.

## QA command

```powershell
pnpm entry:cinematic:qa
```
