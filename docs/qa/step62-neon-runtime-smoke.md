# Step 62 — Neon Runtime Smoke & Clean Database Guardrails

**Date**: May 3, 2026  
**Status**: Ready for Neon runtime smoke testing  
**Scope**: QA infrastructure for Neon runtime validation without seeding  
**Database State**: Clean (migrations applied, no seed data)

---

## Step 61 Neon Connection / Migration = PASS / LOCK

**Step 61 Status** (Foundation for Step 62):

✅ Neon project created under UNICO SUO GENERE  
✅ Region: AWS Europe Central 1 Frankfurt  
✅ Database: cane_corso_platform created and accessible  
✅ `packages/db/scripts/migrate.mjs` uses `DATABASE_URL_DIRECT` for migrations  
✅ `DATABASE_URL` (pooled URL with -pooler) used only for runtime  
✅ All migrations (0000–0009) applied to Neon database  
✅ No seed data has been run (database remains clean)  
✅ Main Neon database ready for production use  
✅ Local .env configured with Neon credentials (not tracked by git)  

---

## Overview

Step 62 adds a conservative QA script (`qa-neon-runtime-smoke.mjs`) that validates Neon runtime setup through safety guardrails and manual browser-based smoke tests.

**This step does NOT**:
- Run `db:seed` or `db:bootstrap`
- Add demo data
- Change database schema
- Change migrations
- Print secrets or connection strings

**This step DOES**:
- Validate .env is not tracked by git
- Verify package scripts exist but are not auto-run
- Check migrate.mjs safety guards (DATABASE_URL_DIRECT priority, -pooler guard)
- Verify client.ts uses DATABASE_URL for runtime
- Document manual browser-based smoke tests
- Lock safety boundaries (no auth/business logic changes)

---

## Step 61 Status Summary

**Step 61 — Neon Project & Migration Setup = PASS / LOCK** ✅

This step (62) builds on the locked Step 61 foundation:

✅ **Neon Project**: Created under UNICO SUO GENERE account  
✅ **Region**: AWS Europe Central 1 Frankfurt  
✅ **Database**: cane_corso_platform  
✅ **.env Configuration** (locally, not committed):
- `DATABASE_PROVIDER=neon`
- `DATABASE_URL` = Neon pooled runtime URL (with `-pooler`)
- `DATABASE_URL_DIRECT` = Neon direct migration URL (without `-pooler`)
- `DATABASE_SSL=true`
- `AUTH_SECRET` and `SESSION_SECRET` generated and stored securely

✅ **Migration Script**: `packages/db/scripts/migrate.mjs` prefers `DATABASE_URL_DIRECT`  
✅ **Runtime Client**: `packages/db/src/client.ts` uses `DATABASE_URL` (pooled OK)  
✅ **Pooler Guard**: migrate.mjs raises error if `-pooler` URL used for migrations  
✅ **Migrations Applied**: All DDL scripts (0000–0009) applied to Neon  
✅ **Database State**: Clean (migrations only, no seed data)  
✅ **Git Tracking**: .env is NOT tracked/committed  

---

## Runtime Smoke Checklist

After this step, perform the following manual browser-based smoke tests:

### 1. Start Development Server

```bash
pnpm dev
```

Expected: Web and mobile apps start without errors.

### 2. Health Check Endpoint

Open in browser: `http://localhost:3000/api/health`

Expected output:
```json
{
  "status": "ok",
  "database": "configured",
  "timestamp": "2026-05-03T..."
}
```

If you see `"database": "connected"` that's even better, but configured is sufficient for this step.

### 3. Home Page

Open: `http://localhost:3000`

Expected:
- Page loads without console errors
- No connection warnings in browser DevTools
- Hero/cinematic section renders
- Navigation visible and functional
- No 500 errors

### 4. Registry Page

Open: `http://localhost:3000/registry`

Expected:
- Page loads
- Registry grid visible (likely empty or minimal, no seed run yet)
- No console errors
- Responsive layout intact
- Filters available (but may return empty results)

### 5. Access/Login Page

Open: `http://localhost:3000/access`

Expected:
- Page loads
- Login/signup forms visible
- No console errors
- Form fields functional
- No database errors in terminal

### 6. Browser Console & Terminal

Check both:

**Browser DevTools Console**:
- No red errors (yellow warnings OK)
- No Neon connection warnings
- No auth secret warnings

**Terminal**:
- No "CONNECTION FAILED" messages
- Migration messages from startup OK
- No SQL error logs

### 7. No Data Visible Yet

Expected:
- No dogs in registry (seed not run)
- No user accounts (seed not run)
- No community ratings (seed not run)
- Clean database state

---

## Important Notes

### Database State

- ✅ **Migrations applied**: All DDL statements run (schemas, tables, indexes)
- ❌ **NO seed data**: Demo users, dogs, ratings NOT added
- ❌ **NO bootstrap**: `db:seed` not executed
- 🔒 **Database is clean**: Ready for production or explicit test data plan

### Future Seed & Demo Testing

Seeding is explicitly deferred:

1. **Option A**: Create separate test database branch in Neon for manual demo/seed testing
2. **Option B**: Add explicit step for `db:seed` with clear approval process
3. **Option C**: Use local Postgres for demo testing, keep Neon clean

Decision on seeding will be made in future steps.

### Runtime vs. Migration Connections

**Runtime (client.ts)**:
- Uses `DATABASE_URL` (pooled connection OK)
- Pooled connections are optimized for HTTP requests
- ✅ Safe and recommended

**Migrations (migrate.mjs)**:
- Uses `DATABASE_URL_DIRECT` (preferred)
- Falls back to `DATABASE_URL` if direct not available
- Guards against `-pooler` in Neon URLs
- ❌ Raises error if pooled URL used for migrations

---

## Rollback / Local Testing

If you need to revert to local Postgres (e.g., for local-only testing):

### 1. Update .env Locally

```bash
# Replace with local Postgres connection
DATABASE_PROVIDER=postgres
DATABASE_URL=postgresql://user:password@localhost:5432/cane_corso_platform
DATABASE_URL_DIRECT=postgresql://user:password@localhost:5432/cane_corso_platform
# Remove or set to false
DATABASE_SSL=false
```

### 2. Run Migrations Against Local DB

```bash
pnpm db:migrate
```

### 3. Restart Dev Server

```bash
pnpm dev
```

### 4. Return to Neon (When Ready)

Revert .env to Neon settings and restart.

**Important**: Keep the `packages/db/scripts/migrate.mjs` safety patch in place. It's a permanent guard.

---

## QA Script Details

### Usage

```bash
# Run the smoke test QA script
pnpm neon:runtime:smoke:qa

# Or directly with Node
node scripts/qa-neon-runtime-smoke.mjs

# Debug mode (may display connection config summary)
DEBUG_CONNECT=true node scripts/qa-neon-runtime-smoke.mjs
```

### What It Checks

1. `.env` is in `.gitignore` (not tracked by git)
2. `db:migrate` script exists (and can be run manually)
3. `db:seed` script exists (exists but NOT run by QA)
4. `db:bootstrap` script exists (exists but NOT run by QA)
5. `packages/db/scripts/migrate.mjs` exists
6. `migrate.mjs` prefers `DATABASE_URL_DIRECT` for migrations
7. `migrate.mjs` guards against `-pooler` in Neon migrations
8. `packages/db/src/client.ts` uses `DATABASE_URL` for runtime
9. No hardcoded Neon endpoints (ep-*) in tracked source/docs
10. `.env` and `.env.local` not committed
11. Step 62 documentation exists and references Step 61 boundary
12. Manual runtime smoke tests documented
13. No direct Neon connection attempted (unless `DEBUG_CONNECT=true`)
14. Migration history preserved (no modifications)

### Exit Codes

- `0` = All checks pass, ready for manual smoke testing
- `1` = One or more checks failed, fix before proceeding

### Expected Output

```
======================================================================
  Step 62 — Neon Runtime Smoke & Clean Database Guardrails
======================================================================

→ 1. Git Ignore Configuration

  ✅ [PASS] .gitignore contains .env exclusion

→ 2. Package Script Requirements

  ✅ [PASS] db:migrate script exists
  ✅ [PASS] db:seed script exists
  ✅ [PASS] db:bootstrap script exists

... (more checks)

→ 11. Manual Runtime Testing Reminder

  📋 Manual Runtime Smoke Tests (in browser):
     After 'pnpm dev', verify:
     
     ✓ /api/health endpoint returns 200 with "database configured"
     ✓ Home page (/) loads without errors
     ✓ /registry page opens (may be empty, no seed run yet)
     ✓ /access page opens (may be empty, no seed run yet)
     ✓ No console errors in browser DevTools
     ✓ No connection warnings in terminal

... (more checks)

======================================================================
  Result: ALL CHECKS PASSED ✅
======================================================================

✅ Neon runtime smoke testing is ready.

Next steps:
  1. Run: pnpm dev
  2. Open browser to http://localhost:3000
  3. Check manual smoke tests listed above (step 11)
  ...
```

---

## Authority Preservation Statement

This step does NOT modify locked authorities:

✅ Registry publish logic: **unchanged**  
✅ Certificate issuance/revocation: **unchanged**  
✅ Verify lookup logic: **unchanged**  
✅ Gallery backend selection: **unchanged**  
✅ Admin moderation logic: **unchanged**  
✅ Ecosystem API: **unchanged**  
✅ Auth/session logic: **unchanged**  
✅ Database migrations: **preserved** (no rewrites)  
✅ Database schema: **unchanged**  
✅ No seed/bootstrap executed: **confirmed**  
✅ No demo data added: **confirmed**  
✅ No secrets printed: **confirmed**  
✅ No hardcoded credentials: **confirmed**

---

## Files Changed

### Created

- `scripts/qa-neon-runtime-smoke.mjs` (new QA script)
- `docs/qa/step62-neon-runtime-smoke.md` (this file)

### Modified

- `package.json` (added script `neon:runtime:smoke:qa`)

### Not Modified (Locked)

- `packages/db/scripts/migrate.mjs` (already has safety guards from Step 61)
- `packages/db/src/client.ts` (already uses DATABASE_URL for runtime)
- All database migrations (preserved as-is)
- All business logic files (registry, certificate, verify, gallery, admin, ecosystem)
- All auth/session files

---

## QA Commands

Run these to validate Step 62:

```bash
# Run Step 62 QA script
pnpm neon:runtime:smoke:qa

# Run pre-Neon lock comprehensive checks
pnpm pre-neon:lock:qa

# Run workspace syntax validation
pnpm workspace:syntax

# Run TypeScript compiler check (all packages)
pnpm typecheck
```

Expected results:
- All QA scripts pass ✅
- No TypeScript errors ✅
- No syntax errors ✅
- No new console warnings ✅

---

## Next Steps

After Step 62 validation:

1. ✅ Verify all QA commands pass
2. ✅ Run manual smoke tests in browser (see checklist above)
3. ✅ Confirm /api/health returns ok with "database configured"
4. ✅ Confirm no seed data is visible
5. **Decision**: Plan seeding strategy for future step (test DB, explicit approval, etc.)

The database is clean and ready. Neon migration infrastructure is validated. Runtime is ready for smoke testing.

---

## Summary

| Item | Status |
|------|--------|
| .env not tracked | ✅ Verified |
| Package scripts exist | ✅ Verified |
| migrate.mjs safety guards | ✅ Verified |
| client.ts runtime config | ✅ Verified |
| No hardcoded secrets | ✅ Verified |
| Manual smoke test checklist | ✅ Documented |
| Database clean (no seed) | ✅ Confirmed |
| Authority boundaries locked | ✅ Confirmed |
| QA script available | ✅ Implemented |
| Documentation complete | ✅ This file |

**Status**: Ready for manual Neon runtime smoke testing.

---

**End of Step 62 Documentation**
