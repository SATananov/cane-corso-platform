# Step 68 — Runtime Role Separation Smoke

Status: patch-ready

## Purpose

Step 68 adds a runtime QA guardrail for the member/admin authorization boundary after Step 66 and Step 67.

The smoke test verifies that:

- anonymous `/api/session` is rejected before role checks;
- a seeded demo member can sign in through the real `/api/auth/sign-in` endpoint;
- the member session resolves as `role: "member"` through `/api/session`;
- the member session can open member surfaces such as `/member`, `/profile`, and `/my-dogs`;
- the member session cannot open protected admin surfaces;
- a seeded demo admin can sign in through the real `/api/auth/sign-in` endpoint;
- the admin session resolves as `role: "admin"` through `/api/session`;
- the admin session can open `/review`, `/admin/registry`, `/admin/partners`, `/admin/ecosystem`, and `/admin/knowledge`;
- both sessions can be deleted and clear the `ccp_session` cookie.

## Commands

```powershell
pnpm demo:role-separation:static:qa
pnpm demo:role-separation:qa
```

Recommended validation chain after applying the patch:

```powershell
pnpm demo:role-separation:static:qa
pnpm demo:role-separation:qa
pnpm demo:admin-runtime-session:static:qa
pnpm demo:admin-runtime-session:qa
pnpm demo:runtime-session:static:qa
pnpm demo:runtime-session:qa
pnpm access:login-ui:qa
pnpm workspace:syntax
pnpm typecheck
```

## Runtime requirements

The runtime smoke requires the web app to be running and the demo/test identities to exist.

Typical local/demo setup:

```powershell
pnpm db:migrate
pnpm db:seed
pnpm ecosystem:manual:seed
pnpm dev
```

Then in a second terminal:

```powershell
$env:CCP_DEMO_RUNTIME_BASE_URL = "http://localhost:3000"
pnpm demo:role-separation:qa
```

Optional credential overrides:

```powershell
$env:CCP_DEMO_MEMBER_EMAIL = "member@demo.cane-corso.local"
$env:CCP_DEMO_MEMBER_PASSWORD = "DemoMember123!"
$env:CCP_DEMO_ADMIN_EMAIL = "ecosystem.admin@demo.cane-corso.local"
$env:CCP_DEMO_ADMIN_PASSWORD = "DemoAdmin123!"
```

## Safety boundary

This is QA-only.

No product UI, database schema, migrations, registry publish logic, certificate issue/revoke logic, verify lookup, gallery backend selection, ecosystem API/DB logic, or admin moderation authority logic is intentionally changed.

Static checks intentionally avoid implementation-specific source markers for admin authorization. The runtime HTTP checks are the source of truth for the role boundary.
