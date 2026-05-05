
# Technical Architecture Summary

## Stack

- Next.js App Router web application
- React Server Components with targeted Client Components
- Route Handlers for API backend
- Server Actions for admin moderation mutations
- Drizzle ORM and PostgreSQL / Neon-ready database layer
- Shared monorepo packages for auth, contracts, db, storage, ui, and config

## Domains

- Owner/member Cane Corso profiles
- Admin review and moderation
- Public Registry
- USG Certificate and Verify
- Gallery / Certified archive
- Knowledge / Community / Partners ecosystem

## Security and trust boundaries

- Member routes require a valid session.
- Admin routes require admin role checks.
- Public Registry exposes published profiles only.
- Verify exposes active certificate records only.
- Certificate issue/revoke and Gallery curation remain admin-only.

## Final release package QA

Use:

```powershell
pnpm platform:product-release:qa
pnpm demo:release-candidate-lock:qa
pnpm workflow:qa
pnpm ecosystem:release:qa
pnpm pre-neon:lock:qa
pnpm workspace:syntax
pnpm typecheck
```
