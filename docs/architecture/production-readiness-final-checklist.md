
# Production Readiness Final Checklist

## Environment

Required secrets and runtime values:

```env
DATABASE_PROVIDER="neon"
DATABASE_URL="postgresql://USER:PASSWORD@HOST-POOLER/DB?sslmode=verify-full"
DATABASE_URL_DIRECT="postgresql://USER:PASSWORD@HOST/DB?sslmode=verify-full"
AUTH_SECRET="GENERATE_A_LONG_RANDOM_SECRET"
SESSION_COOKIE_NAME="ccp_session"
APP_URL="https://your-production-domain.example"
NEXT_PUBLIC_APP_URL="https://your-production-domain.example"
```

## Database

- Runtime uses `DATABASE_URL`.
- Migrations prefer `DATABASE_URL_DIRECT`.
- Neon migration URL must not be the `-pooler` hostname.
- Production data should be migrated before seed/demo content is used.

## Auth/session

- `AUTH_SECRET` is set in deployment secrets only.
- No `NEXT_PUBLIC_AUTH_SECRET` exists.
- Admin actions re-check server session/role.
- Protected member/admin pages redirect to `/access` when no valid session exists.

## Public trust

- Registry public reads must show published profiles only.
- Verify must confirm active certificate records only.
- Certificate issue/revoke remains admin-only.
- Gallery curated selection remains admin-controlled.

## Release gate

Run once before final package:

```powershell
pnpm platform:product-release:qa
pnpm demo:release-candidate-lock:qa
pnpm workflow:qa
pnpm ecosystem:release:qa
pnpm pre-neon:lock:qa
pnpm workspace:syntax
pnpm typecheck
```
