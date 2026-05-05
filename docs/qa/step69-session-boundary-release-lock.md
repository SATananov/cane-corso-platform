# Step 69 — Session Boundary Release Lock

Status: patch-ready

## Purpose

Step 69 adds a final static release guardrail for the runtime auth/session boundary proven in Step 66, Step 67, and Step 68.

This step does **not** replace the runtime smoke tests. It locks the release contract around them so the project keeps a clear proof chain before continuing into new product, UI, or ecosystem work.

## Locked proof chain

- Step 66 — Demo Runtime Session / Member Area Smoke — PASS / LOCK
- Step 67 — Admin Runtime Session / Protected Admin Surface Smoke — PASS / LOCK
- Step 68 — Runtime Role Separation Smoke — PASS / LOCK

Together, the chain proves:

- real member login creates a canonical `ccp_session` cookie;
- `/api/session` runs in real cookie mode with `allowDevFallback: false`;
- member sessions can open `/member`, `/profile`, and `/my-dogs`;
- anonymous sessions cannot open member/admin protected surfaces;
- real admin login creates a canonical `ccp_session` cookie;
- admin sessions can open `/review`, `/admin/registry`, `/admin/partners`, `/admin/ecosystem`, and `/admin/knowledge`;
- member sessions cannot open admin-only surfaces;
- logout clears the `ccp_session` cookie for both member and admin sessions.

## New command

```powershell
pnpm demo:session-boundary-release:qa
```

## Recommended validation chain

Run this after applying the patch:

```powershell
pnpm demo:session-boundary-release:qa
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

Runtime commands require the local app to be running and demo/test identities to exist:

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

## What the Step 69 guardrail checks

The release-lock script verifies that:

- all Step 66/67/68 QA scripts exist;
- all Step 66/67/68 QA docs exist;
- root package scripts expose the member runtime, admin runtime, role separation, login UI, syntax, and typecheck commands;
- `/api/auth/sign-in` still uses local credential verification and writes the signed session cookie through the Next response;
- `/api/session` still uses real cookie mode without dev fallback;
- Step 66 still covers member sign-in, `/api/session`, `/member`, `/profile`, `/my-dogs`, and logout cookie clearing;
- Step 67 still covers admin sign-in, `/api/session`, `/review`, `/admin/registry`, `/admin/partners`, `/admin/ecosystem`, `/admin/knowledge`, and logout cookie clearing;
- Step 68 still covers member-allowed surfaces, admin-only surfaces, member denial from admin surfaces, admin access to admin surfaces, and logout cookie clearing;
- docs preserve the release validation chain and the locked-section safety boundary.

## Safety boundary

This is QA/documentation only.

No product UI, database schema, migrations, Registry publish logic, Certificate issue/revoke logic, Verify lookup, Gallery backend selection, Ecosystem API/DB logic, Admin moderation authority logic, Knowledge content logic, Auth/session implementation, or runtime route behavior is intentionally changed.

Static checks intentionally avoid implementation-specific authorization markers inside route/page files. Runtime HTTP checks from Step 66, Step 67, and Step 68 remain the source of truth for the actual access boundary.
