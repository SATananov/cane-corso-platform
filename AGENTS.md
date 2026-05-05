# Cane Corso Platform — Agent Instructions

**Version**: 1.0  
**Date**: May 3, 2026  
**Purpose**: Strict project and Neon database rules for coding agents  
**Status**: Active (enforced from Step 56 onward)

This document defines mandatory rules, boundaries, and best practices for all coding agents working on the Cane Corso Platform.

---

## 1. Project Identity

### Product

- **Name**: Cane Corso Platform / UNICO SUO GENERE
- **Domain**: Dog registry, certification, verification, and community
- **Scope**: Cane Corso breed focus; extensible to other breeds
- **Vision**: Trusted, luxury-grade dog registry with certification, community rating, and verified ownership

### Technology Stack

- **Monorepo**: pnpm workspaces
- **Build**: Turbo
- **Web App**: Next.js (React, TypeScript)
- **Mobile App**: Expo (React Native, TypeScript)
- **Shared Packages**: TypeScript packages (`@cane-corso/*`)
  - `@cane-corso/db` — Drizzle ORM + PostgreSQL schema
  - `@cane-corso/ui` — Shared React components
  - `@cane-corso/storage` — Utility/helper functions
  - `@cane-corso/contracts` — TypeScript types / contracts
  - `@cane-corso/config` — Shared configuration
  - `@cane-corso/auth` — Session/JWT utilities
- **Database**: PostgreSQL (local) → Neon (production, future)
- **ORM**: Drizzle
- **Languages**: EN (English), BG (Bulgarian), IT (Italian)

### Visual Identity

- **Style**: Luxury USG (black, gold #D4AF37, ivory #F8F5EF)
- **Typography**: Serif for headings, clean sans-serif for body
- **Components**: Premium, responsive, accessible
- **Tone**: Professional, trustworthy, exclusive

---

## 2. Locked Authority Boundaries

**These must not be changed without explicit instruction**:

### Registry Publishing

- Dog publication flow (step 1–5)
- Registry status (published / unpublished / pending)
- Public visibility rules
- Pedigree tree structure and inheritance

### Certificate Workflow

- USG certificate issuance
- Certificate revocation
- Certificate metadata storage
- Certificate display logic (public-facing)
- Certificate validation

### Verify Flow

- Dog lookup / verification
- Trust signal aggregation
- Verify result display
- Data access restrictions (guest vs. member)

### Gallery & Certified Archive

- Backend selection logic (which dogs appear)
- Certified filter criteria
- Gallery pagination
- Gallery search / sort

### Admin Moderation

- Dog profile review (approve / reject)
- Assessment scoring
- Media moderation controls
- Moderation audit trail

### Ecosystem API

- Data structure
- Filtering criteria
- Pagination rules
- Access permissions

### Auth / Session Logic

- Login / logout flow
- JWT signing and validation
- Role-based access control (guest, member, admin)
- Session cookie configuration

### Existing Migrations

- Migration files in `packages/db/drizzle/migrations/`
- Do not rewrite old migrations after applied
- Do not delete migration files
- Migration order must be preserved

---

## 3. Database / Neon Rules

### Connection Status

- ⚠️ **Neon is NOT connected yet** (Step 56 is pre-Neon)
- Do not attempt to connect to Neon production
- Do not add real Neon credentials
- Do not write code that assumes Neon is active

### Connection Management (Future)

When Neon is integrated:

- [ ] Use `DATABASE_URL` (pooled connection) for application runtime
- [ ] Use `DATABASE_URL_DIRECT` (direct connection) for migrations
- [ ] Load connection strings from environment only
- [ ] Never hardcode connection strings
- [ ] Never log connection strings

### Secrets

- ❌ Never commit `.env` or `.env.local`
- ❌ Never hardcode API keys, credentials, or connection strings
- ❌ Never add real Neon passwords to code, docs, or examples
- ❌ Never export secrets in `NEXT_PUBLIC_*` variables
- ✅ Use `.env.example` with placeholder names only
- ✅ Load secrets from environment at runtime
- ✅ Validate required secrets on application startup

### Connection Pooling

When Neon is active:

- Use pooled connection (default `-pooler` suffix) for HTTP app
- Use direct connection (no `-pooler`) for migrations only
- Do not use pooled connection for `ALTER TABLE` or `CREATE TABLE`
- Monitor connection count in Neon dashboard

---

## 4. Migration Rules

### Append-Only Principle

- Migrations are immutable after being committed
- Old migrations are never rewritten
- Old migrations are never deleted
- New changes = new migration files

### Filename Convention

- Format: `YYYYMMDDHHMMSS_description.sql`
- Example: `20260503120000_add_dog_table.sql`
- Timestamps must be sequential (ordered)

### Content Rules

- Each migration is a single logical change
- Include `UP` and `DOWN` for reversibility (where possible)
- Comment migration purpose
- Test migrations locally before committing
- Never include `DROP DATABASE` or `DROP SCHEMA`

### Dangerous Patterns (Requires Approval)

These require explicit human approval before merge:

- `DROP TABLE` (data loss)
- `TRUNCATE TABLE` (data loss)
- `DROP SCHEMA` (data loss)
- `DELETE FROM ... WITHOUT WHERE` (mass data loss)
- Type changes that lose data (e.g., `INT` → `SMALLINT` with overflow risk)
- Constraint changes that could violate data (e.g., NOT NULL on nullable column)

**Approval Process**:
1. Create migration file
2. Include clear documentation: "WHY" + "RISK ASSESSMENT"
3. Request review from DBA or senior engineer
4. Require 2+ approvals
5. Document in migration comment and PR description

### Testing

- [ ] Run migration locally against test database
- [ ] Verify rollback works (if `DOWN` provided)
- [ ] Check for data loss
- [ ] Confirm no performance issues (large tables?)
- [ ] Validate with production schema (if available)

---

## 5. Seed / Demo Rules

### Development Seeds Only

- Demo users are development artifacts
- Demo dogs are test data
- Never seed production database automatically
- Seed scripts must be opt-in (explicit flag or command)

### Seed Scripts

- Located in: `packages/db/drizzle/seed/`
- Clearly marked as development-only
- Include comments: "DO NOT USE IN PRODUCTION"
- Require explicit `--unsafe` or similar flag for production use
- Document what data is created
- Idempotent (safe to run multiple times)

### Production Seed Restrictions

- No automatic seed on production deployment
- No seed script included in production build
- Seed must be triggered manually by authorized user
- Seed must log what was created (audit trail)
- Seed results must be carefully reviewed before accepting

---

## 6. UI Rules

### Language Consistency

- **Per-page rule**: Each page uses one language consistently
- English (EN): All text in English
- Bulgarian (BG): All text in Bulgarian
- Italian (IT): All text in Italian
- No mixing (e.g., "My Dogs" in English + rest in Bulgarian = wrong)

### Terminology

- ❌ Avoid: Generic "dog platform", "pet app"
- ✅ Preferred: "Cane Corso Registry", "Cane Corso Platform", "Verified Ownership"
- ✅ Use: Breed-specific language where natural
- ✅ Preserve: Luxury, trustworthy tone

### Responsiveness

- Desktop (1120px+): Full layout
- Tablet (780px–1120px): Adjusted spacing/columns
- Mobile (< 780px): Stacked layout, readable text
- Test on real devices (not just browser resizing)

### Accessibility

- Alt text for all images
- Color contrast ≥ 4.5:1 for normal text
- Focus states visible
- Keyboard navigation supported
- ARIA labels where needed

### Luxury / USG Style

- Black backgrounds with gold accents
- Ivory (#F8F5EF) text on dark
- Premium spacing and padding
- Serif fonts for headings
- Smooth transitions
- No harsh corners (border-radius > 12px preferred)

---

## 7. Required Checks

### After Making Changes

Run these commands to validate:

```bash
# Full pre-Neon QA suite
pnpm pre-neon:lock:qa

# Release validation
pnpm release:consolidated:qa

# Workspace syntax check
pnpm workspace:syntax

# TypeScript check (all packages)
pnpm typecheck

# Lint check (all packages)
pnpm lint
```

### For Targeted Changes

Also run relevant existing package scripts:

```bash
# If modified web app
cd apps/web && pnpm build

# If modified mobile app
cd apps/mobile && pnpm build

# If modified shared packages
cd packages/db && pnpm build
# etc.
```

### Local Testing

- [ ] Web app builds without errors
- [ ] Web app runs without console errors
- [ ] Mobile app builds without errors
- [ ] Visual changes render correctly on desktop/mobile/tablet
- [ ] No new TS errors
- [ ] No new lint warnings
- [ ] Registry visual changes are tested in browser (Step 56)

---

## 8. Clean ZIP / Deployment Rules

### Files to Exclude

**Always exclude** from distribution:

- `node_modules/` (re-install from lock file)
- `.next/` (rebuild from source)
- `.turbo/` (rebuild from source)
- `.expo/` (rebuild from source)
- `.git/` (version control only)
- `.env` (secrets)
- `.env.local` (secrets)
- `logs/` (runtime logs)
- `tsbuildinfo` files (build artifacts)
- Nested zip files
- Cache/build artifacts (`.DS_Store`, `Thumbs.db`, etc.)

### Allowed Inclusions

**Must include** in distribution:

- Source code (TypeScript, CSS, etc.)
- Configuration files (`tsconfig.json`, `next.config.js`, etc.)
- Package manifests (`package.json`, `pnpm-lock.yaml`)
- Documentation (`README.md`, `docs/`)
- Public assets (`public/`)
- Migration files (`packages/db/drizzle/migrations/`)

### ZIP Validation

Before distributing:

```bash
# Verify no .env files
find . -name ".env*" | grep -v ".env.example"

# Verify no node_modules
find . -type d -name "node_modules" | wc -l

# Verify no .next, .turbo, .expo
find . -type d -name ".next" -o -name ".turbo" -o -name ".expo"
```

---

## 9. Reporting Rules

Every patch report must include:

### Files Changed

- List all modified/added files
- Path relative to repo root
- Example:
  ```
  Modified: apps/web/app/globals.css
  Modified: apps/web/components/public-registry-trust-readability-panel.tsx
  Added: docs/qa/step57-platform-readiness-audit.md
  ```

### Scope Summary

- Brief description of what was changed and why
- Example: "Fixed Registry profile card responsiveness (Step 56)"

### QA Commands Run

- List which commands were executed
- Example:
  ```
  pnpm pre-neon:lock:qa
  pnpm release:consolidated:qa
  pnpm workspace:syntax
  pnpm typecheck
  ```

### What Was NOT Touched

- Explicitly state: "No changes to auth/session logic"
- Explicitly state: "No changes to certificate workflow"
- Explicitly state: "No database connection attempted"
- etc.

### Authority Preservation Statement

Confirm in report:

> ✅ Registry publish logic: unchanged  
> ✅ Certificate issuance/revocation: unchanged  
> ✅ Verify lookup logic: unchanged  
> ✅ Gallery backend selection: unchanged  
> ✅ Admin moderation logic: unchanged  
> ✅ Ecosystem API: unchanged  
> ✅ Auth/session logic: unchanged  
> ✅ Migrations: preserved (no rewrites)

---

## 10. JWT / Session Rules

### Never Do These

- ❌ Add or rotate `AUTH_SECRET` unless explicitly instructed
- ❌ Expose JWT secrets client-side
- ❌ Trust client-provided role claims without DB re-check
- ❌ Put secrets into `NEXT_PUBLIC_*` variables
- ❌ Store passwords, API keys, or database URLs in JWT claims
- ❌ Change login/logout flow without explicit approval
- ❌ Store sensitive data (pedigree, member content) in JWT

### Always Do These

- ✅ Load `AUTH_SECRET` from environment
- ✅ Validate JWT signature on every protected route
- ✅ Re-check user role in database before admin actions
- ✅ Use HttpOnly, Secure, SameSite=Strict for session cookies
- ✅ Document required environment variables in `.env.example`
- ✅ Validate required secrets on app startup
- ✅ Never log full JWT or AUTH_SECRET

### Authorization Pattern

**Right way**:
```typescript
const user = await db.user.findById(token.sub);
if (user?.role === 'admin') {
  // Grant admin access
}
```

**Wrong way**:
```typescript
if (token.claims.role === 'admin') {
  // WRONG: Don't trust client/token claims alone
}
```

---

## 11. Step 56–60 Specific Rules

### Step 56 — Registry Visual Fix

- [ ] Only CSS/layout changes
- [ ] No data mutation
- [ ] No backend changes
- [ ] Responsive grid with `minmax(310px, 1fr)` or similar
- [ ] Comfortable padding and line-height
- [ ] All text wraps naturally
- [ ] No horizontal scrolling
- [ ] Marked with CSS comment: `/* step56-registry-visual-responsive-layout */`

### Step 57–60 — Documentation & QA

- [ ] No code changes (docs only + QA scripts)
- [ ] No backend authority changes
- [ ] No Neon connection
- [ ] Pre-Neon audit checklist
- [ ] Neon readiness contract documented
- [ ] JWT/session secret contract documented
- [ ] AGENTS.md created at repo root
- [ ] QA pre-Neon lock script in `scripts/qa-pre-neon-lock.mjs`
- [ ] QA documentation in `docs/qa/step56-60-pre-neon-lock.md`

---

## 12. Breaking the Rules

### When Explicit Instruction Overrides This Document

If a user task explicitly instructs:

- "Change the registry publish logic"
- "Connect to Neon"
- "Add real secrets"
- "Modify a migration that's already applied"

**Then**:

1. Confirm understanding by restating the override
2. Document the reason clearly
3. Get approval from authorized personnel (if required)
4. Proceed cautiously with safeguards
5. Report clearly what was changed and why

**Example**:

> **Task**: "Change certificate logic to use new trust model"  
> **Confirmation**: I understand this overrides the locked authority boundary for certificates. This requires explicit approval and clear documentation.  
> **Safeguard**: I will preserve backward compatibility and add a feature flag.

---

## 13. Documentation and Support

### Key Documents

- [Neon Readiness Contract](docs/architecture/neon-readiness-contract.md)
- [JWT / Session Secret Contract](docs/architecture/auth-session-jwt-contract.md)
- [Step 57 Platform Readiness Audit](docs/qa/step57-platform-readiness-audit.md)
- [Step 56–60 Pre-Neon Lock Summary](docs/qa/step56-60-pre-neon-lock.md)

### Repository Structure

```
cane-corso-platform/
├── apps/
│   ├── web/                    # Next.js web app
│   └── mobile/                 # Expo mobile app
├── packages/
│   ├── db/                     # Drizzle ORM + schema
│   ├── ui/                     # Shared React components
│   ├── auth/                   # Session/JWT utilities
│   ├── contracts/              # TypeScript types
│   ├── storage/                # Helper functions
│   └── config/                 # Shared configuration
├── docs/
│   ├── architecture/           # Neon, JWT contracts
│   ├── qa/                     # Step 57, 60 QA docs
│   └── ...                     # Other documentation
├── scripts/                    # Build, QA, utility scripts
├── AGENTS.md                   # THIS FILE
├── drizzle.config.ts           # Database config
├── turbo.json                  # Monorepo build config
├── pnpm-workspace.yaml         # Workspace config
└── package.json                # Root package
```

---

## 14. Version Control & Git Practices

### Commit Messages

Format: `[Step XX] Brief description`

Example:
```
[Step 56] Fix Registry trust readability panel layout

- Changed grid from repeat(5, 1fr) to auto-fit minmax(310px, 1fr)
- Increased padding from 0.85rem to 1.15rem
- Added better line-height and text wrapping
- Responsive breakpoints improved for tablet/mobile

Preserves: Registry publish logic, certificate flow, auth
```

### Branching

- Branch name: `step-56-registry-visual-fix` or similar
- Base: `main` or `develop` (project convention)
- PR: Include checklist of rules followed

### Code Review Checklist

Reviewers must verify:

- [ ] No locked authority logic changed
- [ ] No .env or secrets committed
- [ ] No hardcoded credentials
- [ ] Neon not connected
- [ ] All required checks pass (`pnpm typecheck`, `pnpm workspace:syntax`)
- [ ] Reporting includes authority preservation statement
- [ ] Documentation updated if relevant
- [ ] Step 56–60 rules followed (if applicable)

---

## 15. Emergency / Rollback Procedures

### If Something Breaks

1. **Identify**: Run QA commands to find issue
   ```bash
   pnpm pre-neon:lock:qa
   pnpm typecheck
   pnpm lint
   ```

2. **Assess**: Determine scope (web, mobile, db, shared?)

3. **Notify**: Alert team if critical (auth, database, deployment)

4. **Rollback**: Revert last commit(s) if safe
   ```bash
   git revert <commit-hash>
   ```

5. **Test**: Re-run all checks after rollback

6. **Document**: Update PATCH_NOTES.txt or relevant doc

### Rollback for Secrets Leaked

If `.env` or credentials accidentally committed:

1. **Rotate** all leaked secrets immediately (new `AUTH_SECRET`, DB passwords, etc.)
2. **Remove** from git history (use `git filter-branch` or similar)
3. **Force-push** (after team coordination)
4. **Audit** git history for other leaks
5. **Document** incident and mitigation

---

## 16. Questions & Clarification

If any instruction conflicts with this AGENTS.md:

1. **Ask for clarification** rather than guessing
2. **State the conflict**: "Task X contradicts rule Y"
3. **Propose alternative**: "Can we do Z instead?"
4. **Wait for response** before proceeding
5. **Document decision** if override is approved

---

## Approval & Sign-Off

**Document Created**: May 3, 2026  
**Status**: Active (enforced from Step 56 onward)  
**Effective For**: All agents and human developers  
**Review Cycle**: Quarterly (or as needed)  
**Last Updated**: May 3, 2026

---

**End of AGENTS.md**
