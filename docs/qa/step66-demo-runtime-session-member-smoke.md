# Step 66 — Demo Runtime Session / Member Area Smoke after UI Login Fix

## Status

Prepared as a runtime QA layer after the Access login UI payload fix.

## Purpose

Step 66 proves that the fixed Access login path works as a real runtime session flow:

1. Anonymous member-only access is rejected.
2. Demo member credentials can sign in through `/api/auth/sign-in`.
3. The response creates the real `ccp_session` cookie.
4. `/api/session` resolves the authenticated member from the cookie.
5. `/member`, `/profile`, and `/my-dogs` open as member-only surfaces with the same cookie.
6. `/api/session` DELETE clears the session cookie.

## Demo credentials

- Email: `member@demo.cane-corso.local`
- Password: `DemoMember123!`

The Step 66 script prints the password length only. It does not print the password value or any session token.

## Commands

Run the app with a migrated and seeded demo database:

```powershell
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Then run the runtime smoke in a second terminal:

```powershell
pnpm demo:runtime-session:qa
```

Optional base URL override:

```powershell
$env:CCP_DEMO_RUNTIME_BASE_URL = "http://localhost:3000"
pnpm demo:runtime-session:qa
```

Static guardrail-only mode, useful when the server is not running:

```powershell
pnpm demo:runtime-session:static:qa
```

## Safety boundary

Step 66 does not change:

- database schema or migrations;
- seed behavior;
- auth/session implementation;
- Registry publish logic;
- Certificate issue/revoke logic;
- Verify lookup logic;
- Gallery backend selection logic;
- Admin moderation backend logic;
- Ecosystem API/DB logic;
- visual UI/CSS.

It adds only a QA script, package scripts, and this QA document.

## Expected PASS chain

```powershell
pnpm demo:runtime-session:static:qa
pnpm access:login-ui:qa
pnpm workspace:syntax
```

Full local runtime validation:

```powershell
pnpm db:migrate
pnpm db:seed
pnpm dev
pnpm demo:runtime-session:qa
```
