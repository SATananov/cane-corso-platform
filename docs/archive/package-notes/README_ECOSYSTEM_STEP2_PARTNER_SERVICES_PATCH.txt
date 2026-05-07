Cane Corso Platform — Ecosystem Step 2: Partner / Services MVP sync patch

Purpose
- Preserve the stable green Registry / Certificate / My Cane Corso / Gallery checkpoint.
- Keep the existing Partner / Services pages as the first public ecosystem MVP surface.
- Connect approved Partner / Services applications to the shared ecosystem engine.

What changed
1. Partner approvals now sync into ecosystem_listings as official partner_service records.
   - A partner approval creates/updates the normal public partner profile.
   - The same approval also creates/updates a published ecosystem listing with slug partner-service-{partnerSlug}.

2. Partner admin state syncs back into the ecosystem layer.
   - feature / unfeature updates ecosystem is_featured.
   - suspend hides the synced ecosystem listing by moving it to needs_changes.
   - restore publishes the synced ecosystem listing again.

3. Existing approved partners are backfilled.
   - New migration: packages/db/drizzle/0009_partner_service_ecosystem_sync.sql
   - Existing approved partners become official published partner_service ecosystem records.

4. Demo seed is aligned.
   - The seeded approved partner also creates a matching ecosystem listing in fresh local DBs.

5. QA guard updated.
   - scripts/qa-ecosystem-engine.mjs now checks the Step 2 partner-service sync layer.

Apply instructions
1. Copy/paste this patch ZIP into the root of the repo.
2. Run:
   pnpm db:migrate
   pnpm db:seed
   pnpm workspace:verify
   pnpm workspace:syntax
   pnpm typecheck
   pnpm ecosystem:qa
   pnpm workflow:qa
   pnpm requirements:qa
   pnpm dev

Manual test
1. Open /partners and confirm the seeded approved partner still appears.
2. Open /community and confirm the approved partner appears in the ecosystem directory as Partner & Services / official listing.
3. Open /partners/apply as member and submit a test partner/service.
4. Open /admin/partners as admin and approve it.
5. Confirm it appears in /partners and also in the ecosystem directory.
6. Feature/unfeature or suspend/restore the partner and confirm the ecosystem listing follows the admin state.

Notes
- This patch intentionally does not touch Registry, Certificate, My Cane Corso, Gallery, Verify, or public registry logic.
- Mobile package alignment remains a later cleanup step.
