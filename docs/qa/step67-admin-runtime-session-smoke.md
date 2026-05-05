# Step 67 — Admin Runtime Session / Protected Admin Surface Smoke

## Status

Patch-level QA guardrail for proving the admin runtime session flow after the member runtime smoke and login UI fix.

## Scope

Step 67 verifies that:

- the root package exposes `demo:admin-runtime-session:qa`;
- the root package exposes `demo:admin-runtime-session:static:qa`;
- `/api/auth/sign-in` still verifies local credentials;
- `/api/auth/sign-in` still creates a canonical signed cookie session;
- `/api/session` stays in real cookie mode with `allowDevFallback: false`;
- protected admin surface files exist;
- runtime HTTP smoke proves anonymous users cannot open admin surfaces;
- runtime HTTP smoke proves a seeded demo admin can sign in and open protected admin pages with `ccp_session`.

## Protected surfaces covered

- `/review`
- `/admin/registry`
- `/admin/partners`
- `/admin/ecosystem`
- `/admin/knowledge`

## Important correction

Static QA intentionally does **not** require a specific admin/session marker inside every admin page file.
Admin protection may be implemented through a page, a route-group layout, middleware, a shared helper, or a redirect boundary.
Runtime HTTP checks are the source of truth for access protection.

## Commands

```powershell
pnpm demo:admin-runtime-session:static:qa
```

Runtime mode requires the app to be running and a seeded demo/test admin account to exist:

```powershell
pnpm db:migrate
pnpm db:seed
pnpm dev
```

In a second terminal:

```powershell
$env:CCP_DEMO_RUNTIME_BASE_URL = "http://localhost:3000"
pnpm demo:admin-runtime-session:qa
```

Optional credential overrides:

```powershell
$env:CCP_DEMO_ADMIN_EMAIL = "admin@demo.cane-corso.local"
$env:CCP_DEMO_ADMIN_PASSWORD = "DemoAdmin123!"
```

## Safety boundary

This is QA-only. It does not change Registry publishing, Certificate issue/revoke, Verify lookup, Gallery backend selection, Admin moderation logic, Ecosystem API/DB logic, Knowledge article logic, Auth/session implementation, schema, migrations, or UI presentation.
