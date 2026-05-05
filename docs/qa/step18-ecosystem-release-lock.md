# Step 18 — Ecosystem Release Lock

Status: **PASS / LOCK**

This checkpoint records the final release-lock decision for the ecosystem layer after the seeded DB state QA, browser evidence, and route clarification pass.

## Locked release decision

- Step 13 manual browser evidence: **PASS / LOCK**
- Ecosystem release layer: **PASS / LOCK**
- Final clean checkpoint target: `cane-corso-platform_clean_after_ecosystem_release_lock.zip`

## Automated QA evidence

The following commands must pass from the project root before this release lock is valid:

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm owner-center:qa
pnpm ecosystem:qa
pnpm ecosystem:lifecycle:qa
pnpm ecosystem:admin:qa
pnpm ecosystem:manual:qa
pnpm ecosystem:manual:db:qa
pnpm ecosystem:release:qa
pnpm typecheck
```

Expected result: all commands pass, including `pnpm ecosystem:manual:db:qa` and `pnpm typecheck` with 8/8 packages successful.

## Browser evidence summary

Seeded browser accounts:

- Member: `ecosystem.member@demo.cane-corso.local` / `DemoMember123!`
- Admin: `ecosystem.admin@demo.cane-corso.local` / `DemoAdmin123!`

Required evidence surfaces:

1. `/ecosystem` as the seeded member.
   - Shows all Step 16 seeded owner records.
   - Draft and needs-changes records expose safe edit continuation.
   - Pending, approved, published, and suggestion states remain locked according to lifecycle rules.

2. `/admin/ecosystem` as the seeded admin.
   - Pending records expose review actions.
   - Approved real listings expose publish action.
   - Draft, published, and community suggestion records are read-only where required.
   - Community suggestions do not expose direct publication.

3. `/community` as the public ecosystem surface.
   - Shows `Step 16 Published — Cane Corso Play Field` / `step16-published-cane-corso-play-field`.
   - Does not show Step 16 draft, pending, needs-changes, approved-only, or community-suggestion records.

4. `/partners` as partner directory sanity check.
   - Remains the curated partner/service directory.
   - It is **not** the canonical public ecosystem evidence route for Step 16 seeded ecosystem listings.

## Route clarification

The correct public ecosystem evidence route is `/community`.

`/partners` remains valid only as the partner directory sanity check. Do not use `/partners` as the primary proof that the public ecosystem seed visibility boundary works.

## Locked visual boundary

No visual or behavior changes were required in locked sections during this release lock decision:

- Registry
- Registry detail
- Certificate
- Verify logic
- My Cane Corso
- Gallery
- `/community`
- `/partners`
- `/partners/[slug]`
- `/review`
- `/admin/partners`
- `/admin/ecosystem`

## Final result

Ecosystem release layer is **PASS / LOCK**.
