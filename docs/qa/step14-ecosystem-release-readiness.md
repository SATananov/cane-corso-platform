# Step 14 — Ecosystem Flow Evidence + Release Readiness

Status: release-readiness guardrail pass.

## Scope

Step 14 prepares the ecosystem workstream for a stable release checkpoint after the Owner Center, member submission workspace, lifecycle QA, and admin moderation QA passes.

This pass does not redesign or modify locked platform sections. It adds release evidence structure and one final static QA command that confirms the project has the expected automated checks, manual evidence template, and release checklist before a clean ZIP is created.

## Important status note

Step 13 remains manual evidence required. Automated QA confirms the code contract and safety guards, but the real browser flow still needs screenshot evidence before the ecosystem flow can be marked release-ready.

Required manual evidence:

1. Member opens `/ecosystem`.
2. Member creates or saves an ecosystem submission.
3. Member submits it for review.
4. Admin opens `/admin/ecosystem`.
5. Admin requests changes.
6. Member sees the returned state in `/ecosystem`.
7. Admin approves the corrected listing.
8. Admin publishes the approved listing.
9. Public visibility is confirmed on the public ecosystem/partners surface.

Use `docs/evidence/ecosystem-flow-evidence-template.md` for this evidence.

## Added command

```powershell
pnpm ecosystem:release:qa
```

## Final QA sequence before checkpoint ZIP

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm owner-center:qa
pnpm ecosystem:qa
pnpm ecosystem:lifecycle:qa
pnpm ecosystem:admin:qa
pnpm ecosystem:release:qa
pnpm typecheck
```

## Final checkpoint ZIP command

```powershell
pnpm checkpoint:zip -- -ZipName cane-corso-platform_clean_after_step14_ecosystem_release_readiness.zip
```

## Locked-section promise

Step 14 must not change implementation or visuals in:

- Registry
- Registry detail
- Gallery
- Certificate
- Verify
- My Cane Corso
- Community public page
- Partners public directory/detail
- Review
- Admin partners
- Admin ecosystem visual UI

## Expected result

When the automated QA sequence passes and the manual evidence template is completed, the ecosystem workstream can be treated as release-ready for the current phase.
