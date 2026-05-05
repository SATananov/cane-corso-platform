# Step 25 — Ecosystem Owner Workspace UX Safety Polish

Status: **PASS / READY FOR LOCAL VERIFICATION**

Step 25 is a small owner-workspace clarity pass for the authenticated member `/ecosystem` surface.

## Scope

This step improves how the member understands the owner lifecycle without changing lifecycle rules:

- adds an owner workspace safety notice;
- adds clearer queue guidance;
- adds status-specific action hints for `draft`, `needs_changes`, `pending_review`, `approved`, and `published` entries;
- keeps edit/resubmit controls available only for `draft` and `needs_changes`;
- keeps `pending_review`, `approved`, and `published` entries locked from owner edits.

## Locked boundaries

Step 25 must not change:

- Registry;
- Registry detail;
- Certificate;
- Verify logic;
- My Cane Corso;
- Gallery;
- `/community`;
- `/community/[slug]`;
- `GET /api/ecosystem/[slug]`;
- `/partners`;
- `/partners/[slug]`;
- `/review`;
- `/admin/partners`;
- `/admin/ecosystem`.

## Files changed

```text
apps/web/components/ecosystem-owner-workspace.tsx
apps/web/app/globals.css
scripts/qa-ecosystem-owner-workspace-ux-polish.mjs
docs/qa/step25-ecosystem-owner-workspace-ux-safety-polish.md
docs/release/ecosystem-next-build-plan.md
package.json
```

## QA command

```powershell
pnpm ecosystem:owner-workspace:ux:qa
```

## Recommended regression sequence

```powershell
pnpm ecosystem:owner-workspace:ux:qa
pnpm ecosystem:owner-resubmit:qa
pnpm ecosystem:api-release:qa
pnpm ecosystem:detail:api:qa
pnpm ecosystem:detail:polish:qa
pnpm ecosystem:detail:qa
pnpm ecosystem:postrelease:qa
pnpm ecosystem:release:qa
pnpm workspace:syntax
pnpm typecheck
```

## Checkpoint target

```text
cane-corso-platform_clean_after_step25_owner_workspace_ux_safety_polish.zip
```
