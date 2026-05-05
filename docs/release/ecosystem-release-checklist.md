# Release checklist — Ecosystem flow

This checklist is used before creating a clean release checkpoint for the Owner Center and ecosystem submission flow.

## 1. Automated QA sequence

Run all checks from the project root:

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm owner-center:qa
pnpm ecosystem:qa
pnpm ecosystem:lifecycle:qa
pnpm ecosystem:admin:qa
pnpm ecosystem:manual:qa
pnpm ecosystem:manual:db:qa # after pnpm ecosystem:manual:seed when doing seeded evidence
pnpm ecosystem:release:qa
pnpm typecheck
```

Expected result: every command must pass. The seeded DB state command requires a local database and should be run after `pnpm ecosystem:manual:seed`.

## 2. Manual browser evidence required

Use `docs/evidence/ecosystem-flow-evidence-template.md` and capture screenshots for each step.

Required flow:

1. Member creates ecosystem submission from `/ecosystem`.
2. Member saves draft or submits for review.
3. Member sees the submission in the personal workspace with the correct status.
4. Admin opens `/admin/ecosystem` and sees the submitted listing.
5. Admin request changes.
6. Member sees the returned state and can safely edit only when allowed.
7. Admin approve.
8. Admin publish after approval.
9. Public visibility check confirms published ecosystem listings appear on `/community` and drafts/pending/needs-changes/approved-only/internal suggestions do not.
10. `/partners` is checked separately as partner directory sanity evidence, not as the canonical ecosystem public seed route.

## 3. Locked sections must remain untouched

Do not make visual or behavior changes in these locked areas during this release readiness pass:

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
- Admin ecosystem visuals

## 4. Clean checkpoint

After all automated checks pass and manual evidence is attached, create the release checkpoint:

```powershell
pnpm checkpoint:zip -- -ZipName cane-corso-platform_clean_after_ecosystem_release_lock.zip
```

## 5. Public route clarification

- `/community` is the canonical public ecosystem evidence route for seeded Step 16 ecosystem visibility.
- `/partners` is the curated partner/service directory and should be used only as partner directory sanity check.

## 6. Release decision

- PASS / LOCK: all automated checks pass, manual evidence is complete, `/community` public visibility is correct, `/partners` sanity check is clean, and locked sections remain visually unchanged.
- HOLD: any flow step is unclear, screenshots are missing, or public visibility is incorrect.
- FAIL: drafts/pending/needs-changes/approved-only/internal suggestions become public, admin-only actions are exposed to non-admin users, or locked sections are accidentally changed.
