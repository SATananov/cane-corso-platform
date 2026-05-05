# Step 64 — Demo Database Seed Strategy & Safety Guardrails

**Date**: May 3, 2026  
**Status**: Pre-seed planning and safety documentation  
**Scope**: Demo database strategy without running seed yet  
**Database State**: Main database remains clean (migrations only)  
**Previous Step**: Step 63 (Empty Neon Runtime UX Review)

Protected clean database: cane_corso_platform

Future demo database: cane_corso_platform_demo

---

## Step 63 Status Summary = PASS / LOCK

**Foundation for Step 64**:

✅ Neon database: `cane_corso_platform` connected and accessible  
✅ All migrations (0000–0009) applied to Neon  
✅ No seed data has been run (database remains **clean/empty**)  
✅ Main Neon database ready for production or explicit test data plan  
✅ Runtime uses pooled connection (DATABASE_URL with `-pooler`)  
✅ Migrations use direct connection (DATABASE_URL_DIRECT)  
✅ Local .env configured with Neon credentials (not tracked by git)  
✅ /api/health returns 200 with "database configured"  
✅ Empty-state UX validated in browser (Step 63)  

---

## Overview

Step 64 adds **demo database strategy documentation and QA guardrails** for future seed testing.

**The purpose**:
- Document how to safely separate demo database from main production database
- Establish verified procedures before any seed is run
- Provide QA checklist to prevent accidental seeding of main database
- Lock in safety guardrails for future developers

**This step does NOT**:
- Run `db:seed` or `db:bootstrap`
- Add demo data
- Create or modify database in Neon
- Change database schema
- Change migrations
- Connect to Neon directly (unless DEBUG flag set)
- Modify .env or commit secrets
- Print connection strings or passwords
- Make visual or business logic changes

**This step DOES**:
- Document two-database strategy (main + demo)
- Verify package scripts exist (db:migrate, db:seed, db:bootstrap)
- Document database names and purposes
- Provide verification checklist before future seed
- Document rollback procedures
- Verify .env is not tracked
- Check for hardcoded Neon credentials
- Provide QA script for future validation
- Lock authority boundaries (no business logic changes)

---

## Required Stable Phrases

Protected clean database: cane_corso_platform

Future demo database: cane_corso_platform_demo

Never run db:seed while .env points to cane_corso_platform

DATABASE_URL must contain /cane_corso_platform_demo?

DATABASE_URL must contain -pooler

DATABASE_URL_DIRECT must contain /cane_corso_platform_demo?

DATABASE_URL_DIRECT must not contain -pooler

No seed, bootstrap, or migrate was run in Step 64

---

## Database Strategy: Main + Demo

### Protected Main Database: `cane_corso_platform`

**Purpose**: Production database  
**Status**: Clean (migrations only, no seed data)  
**Lifecycle**: 
- Applied migrations only
- Ready for production deployment
- Never seeded for testing
- Manual administrative data only

**Connection Strings** (in local .env, not tracked):
- `DATABASE_URL`: `postgres://...@...neon.tech/cane_corso_platform?sslmode=require`
- `DATABASE_URL_DIRECT`: `postgres://...@...neon.tech/cane_corso_platform?sslmode=require`

### Future Demo Database: `cane_corso_platform_demo`

**Purpose**: Demo/test data seeding  
**Status**: Not created yet (planned for future)  
**Lifecycle**:
- Created separately in Neon
- Migrations applied
- Seed data run against demo database only
- Deleted/recreated for fresh test cycles

**Connection Strings** (future, when created):
- `DATABASE_URL`: `postgres://...@...neon.tech/cane_corso_platform_demo?sslmode=require`
- `DATABASE_URL_DIRECT`: `postgres://...@...neon.tech/cane_corso_platform_demo?sslmode=require`

---

## Manual Future Plan: Seeding Against Demo Database

When demo testing is explicitly approved and scheduled, follow this procedure:

### Phase 1: Database Preparation

1. **Create demo database in Neon** (via Neon console)
   - Name: `cane_corso_platform_demo`
   - Same region as main database
   - Document the connection strings

2. **Retrieve connection strings** from Neon console
   - Copy pooled connection (with `-pooler` suffix)
   - Copy direct connection (without `-pooler` suffix)
   - Store temporarily (do not commit)

### Phase 2: Environment Configuration

3. **Update local .env temporarily**
   ```bash
   # .env (local, not tracked)
   DATABASE_URL=postgres://...neon.tech/cane_corso_platform_demo?sslmode=require  # WITH -pooler
   DATABASE_URL_DIRECT=postgres://...neon.tech/cane_corso_platform_demo?sslmode=require  # NO -pooler
   ```

4. **Verify .env points to demo database**
   ```bash
   # Run verification before proceeding
   pnpm demo:seed-strategy:qa
   ```
   - Check that DATABASE_URL contains `/cane_corso_platform_demo?`
   - Check that DATABASE_URL_DIRECT contains `/cane_corso_platform_demo?`
   - Confirm no seed will be run against wrong database

### Phase 3: Migration & Seeding

5. **Run migrations against demo database**
   ```bash
   pnpm db:migrate
   ```
   - This applies all migration files to demo database
   - Mirrors production schema

6. **Run seed script against demo database**
   ```bash
   pnpm db:seed
   ```
   - This creates demo member data
   - Seeds test dog profiles with ecosystem data
   - Populates partner, knowledge, gallery data

### Phase 4: Testing & Validation

7. **Test member/admin/demo flows**
   ```bash
   # Start dev server (connected to demo database)
   pnpm dev
   ```
   - Browse public registry
   - Verify gallery, certified archive
   - Test member login (demo credentials)
   - Test admin moderation flows
   - Test ecosystem submission/review

8. **Document test results**
   - Take screenshots of seeded state
   - Note any seed issues or data inconsistencies
   - Record browser console errors
   - Verify all flows function with seed data

### Phase 5: Cleanup & Restoration

9. **Switch .env back to main database**
   ```bash
   # .env (updated)
   DATABASE_URL=postgres://...neon.tech/cane_corso_platform?sslmode=require  # WITH -pooler
   DATABASE_URL_DIRECT=postgres://...neon.tech/cane_corso_platform?sslmode=require  # NO -pooler
   ```

10. **Delete/recreate demo database** (optional)
    - Via Neon console
    - Or keep for next test cycle with fresh seed

11. **Verify main database is still clean**
    ```bash
    # Run QA checks
    pnpm neon:runtime:smoke:qa
    pnpm neon:empty-runtime:qa
    ```

---

## ⚠️ Critical Warnings

### Never Seed Main Database

**DANGER**: Do not run `db:seed` while .env points to `cane_corso_platform`

```bash
# WRONG - This will seed the main production database
DATABASE_URL=postgres://...neon.tech/cane_corso_platform?sslmode=require
pnpm db:seed  # ❌ DANGER: Adds data to production
```

**Prevention**:
- Always verify .env before running `pnpm db:seed`
- Always run `pnpm demo:seed-strategy:qa` to check
- Make .env changes deliberately and consciously
- Never automate seed against main database

### .env Never Committed

**DANGER**: Do not commit .env to git

```bash
# Check .gitignore includes .env
cat .gitignore | grep ".env"
# Output should include:
#   .env
#   .env.local

# Verify .env is not tracked
git status .env
# Should show: fatal: pathspec '.env' did not match any files
```

### No Hardcoded Credentials

**DANGER**: Do not hardcode Neon credentials in source code

```bash
# Check for hardcoded endpoints (should find none)
grep -r "ep-.*\.neon\.tech" . --exclude-dir=node_modules --exclude-dir=.git
# Should return: (no results)
```

---

## Verification Checklist (Before Future Seed)

Run this checklist before any seed operation:

### 1. Step 63 Documentation Exists

```bash
ls -la docs/qa/step63-empty-neon-runtime-ux-review.md
# Should exist
```

### 2. Step 62 Documentation Exists

```bash
ls -la docs/qa/step62-neon-runtime-smoke.md
# Should exist
```

### 3. Package Scripts Exist

```bash
pnpm run | grep -E "db:(migrate|seed|bootstrap)"
# Output should include:
#   db:bootstrap
#   db:migrate
#   db:seed
```

### 4. Demo Strategy Script Exists

```bash
ls -la scripts/qa-demo-database-seed-strategy.mjs
# Should exist
```

### 5. .env is Not Tracked

```bash
git status .env
# Should output: fatal: pathspec '.env' did not match any files
```

### 6. No Hardcoded Neon Credentials

```bash
grep -r "ep-[a-z0-9].*\.neon\.tech" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.turbo --exclude-dir=.next --exclude-dir=.expo
# Should return nothing (no real endpoints in tracked files)
```

### 7. Verify Main Database Name

```bash
# Documentation lists main database as:
cat docs/qa/step64-demo-database-seed-strategy.md | grep -A2 "Protected Main Database"
# Should show: cane_corso_platform
```

### 8. Verify Demo Database Name

```bash
# Documentation lists demo database as:
cat docs/qa/step64-demo-database-seed-strategy.md | grep -A2 "Future Demo Database"
# Should show: cane_corso_platform_demo
```

### 9. Check .env Has Demo Warning

```bash
# Before running seed, verify .env points to demo:
cat .env | grep DATABASE_URL
# Should contain: cane_corso_platform_demo (if seeding)
# Should contain: cane_corso_platform (if testing main)
```

### 10. Run Demo Strategy QA

```bash
pnpm demo:seed-strategy:qa
# All checks should PASS
# If any FAIL, do not proceed with seed
```

### 11. Verify Connection URLs

```bash
# Check that pooled connection has -pooler
cat .env | grep DATABASE_URL= | grep -o "\-pooler" || echo "MISSING -pooler"
# Should output: -pooler

# Check that direct connection does NOT have -pooler
cat .env | grep DATABASE_URL_DIRECT= | grep -o "\-pooler" && echo "ERROR: Has -pooler" || echo "Correct: No -pooler"
# Should output: Correct: No -pooler
```

### 12. Rollback Procedure Documentation

```bash
# After seed testing complete:
# 1. Switch .env back to main database name
#    DATABASE_URL=postgres://...neon.tech/cane_corso_platform?sslmode=require
#    DATABASE_URL_DIRECT=postgres://...neon.tech/cane_corso_platform?sslmode=require

# 2. Never commit .env
#    git status .env should show: fatal: pathspec '.env' did not match any files

# 3. Delete or recreate demo database as needed
#    Via Neon console (delete database and recreate)

# 4. Verify main database is still clean
#    pnpm neon:runtime:smoke:qa
#    pnpm neon:empty-runtime:qa
```

---

## Authority Preservation

**This step does NOT change:**

❌ Registry publish logic: **locked** (no changes)  
❌ Certificate issuance/revocation: **locked** (no changes)  
❌ Verify lookup logic: **locked** (no changes)  
❌ Gallery backend selection: **locked** (no changes)  
❌ Admin moderation logic: **locked** (no changes)  
❌ Ecosystem API: **locked** (no changes)  
❌ Auth/session logic: **locked** (no changes)  
❌ Database schema: **locked** (migrations only, no rewrites)  
❌ Migration files: **locked** (preserved, no edits)  

---

## Files Changed

**Created**:
- `scripts/qa-demo-database-seed-strategy.mjs`
- `docs/qa/step64-demo-database-seed-strategy.md` (this file)

**Modified**:
- `package.json` (added `demo:seed-strategy:qa` script)

**Not Changed**:
- `.env` (local only, not tracked)
- Database connections (Step 63 config preserved)
- Migrations or schema
- UI/CSS
- Auth logic
- Business logic (Registry, Certificate, Verify, Gallery, Admin, Ecosystem)

---

## QA Commands

After changes, run:

```bash
# Verify demo database strategy documentation and QA script
pnpm demo:seed-strategy:qa

# Verify main database is still clean and accessible
pnpm neon:runtime:smoke:qa
pnpm neon:empty-runtime:qa

# Full workspace syntax check
pnpm workspace:syntax

# TypeScript check
pnpm typecheck

# Pre-Neon lock validation
pnpm pre-neon:lock:qa
```

**Expected Result**: All QA commands PASS with no warnings about seed, bootstrap, or migration being run.

---

## No-Seed Guarantee

✅ **No seed has been run in this step**  
✅ **Main database `cane_corso_platform` remains clean**  
✅ **Future demo database `cane_corso_platform_demo` is not yet created**  
✅ **No .env changes committed**  
✅ **No credentials added to tracked files**  
✅ **No business logic changed**  
✅ **No schema changes**  
✅ **Strategy and guardrails documented only**

---

## Next Steps (Future, When Seed is Scheduled)

1. Explicitly approve demo database seeding
2. Create `cane_curso_platform_demo` in Neon
3. Follow the manual plan above (update .env, migrate, seed)
4. Document seed test results
5. Switch .env back to main database
6. Continue with Step 65

---

**Step 64 Complete**: Demo database strategy documented, safety guardrails established, QA validation available.  
**Status**: Ready for browser validation and approval of next steps.

**Date Completed**: May 3, 2026  
**Authority Preserved**: ✅ All locked boundaries maintained

## Required stable database labels

Protected clean database: cane_corso_platform
Future demo database: cane_corso_platform_demo
