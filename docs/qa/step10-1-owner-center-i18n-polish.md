# Step 10.1 — Owner Center i18n + Premium UX Polish

Status: implemented as a narrow text/i18n polish pass for the member `/ecosystem` Owner Center.

## Scope

Step 10.1 only polishes the Owner Center and member-facing wording introduced in Step 10. It does not change public registry, gallery, certificate, verify, review, or admin route behavior.

## Files changed

- `apps/web/app/(member)/ecosystem/page.tsx`
- `apps/web/components/owner-center-workspace.tsx`
- `scripts/qa-owner-center-workspace.mjs`
- `docs/qa/step10-1-owner-center-i18n-polish.md`

## Product intent

- Replace mixed BG/EN developer wording in the Bulgarian Owner Center copy.
- Keep brand terms such as Cane Corso, Verify, Review, and Admin where they are intentional platform labels.
- Make the member page read like a premium product surface, not an internal workshop dashboard.
- Localize the member role display inside the identity card.
- Keep the existing member ecosystem submission workflow intact.

## Locked sections not touched

This pass does not edit the locked Registry, Registry detail, Gallery, Certificate, Verify, My Cane Corso, Community, Partners, Review, Admin Partners, or Admin Ecosystem route files.

## Verification

Recommended checks after applying the patch:

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm owner-center:qa
pnpm typecheck
pnpm ecosystem:qa
```

Manual check:

1. Sign in as member.
2. Open `/ecosystem` in BG, EN, and IT.
3. Confirm the Owner Center hero, cards, identity panel, stats, next actions, and guided paths no longer show accidental mixed-language terms.
4. Confirm the existing ecosystem form and owner queue still render below the Owner Center.
5. Confirm locked public/admin sections remain visually unchanged.
