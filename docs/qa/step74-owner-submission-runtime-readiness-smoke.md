# Step 74 — Owner Submission Runtime Readiness Smoke

Status: QA-only runtime guardrail.

## Purpose

Step 74 verifies the member-owned Cane Corso submission preparation layer after the Step 66–73 runtime locks.

The boundary is intentionally narrow:

- anonymous users cannot open member owner-submission surfaces;
- a real member cookie session can open the owner command center, profile surface, My Dogs workspace, and new Cane Corso profile form;
- the owner dogs API can be read with a member session;
- the owner dogs API rejects an invalid POST through validation/session guards without creating or submitting a record;
- the prior auth/session, public, detail, and admin read locks remain in place.

## Commands

```powershell
pnpm demo:owner-submission-readiness:static:qa
pnpm demo:owner-submission-readiness:qa
```

Runtime smoke requires the app and demo identities:

```powershell
pnpm db:migrate
pnpm db:seed
pnpm ecosystem:manual:seed
pnpm dev
```

Then in a second terminal:

```powershell
$env:CCP_DEMO_RUNTIME_BASE_URL = "http://localhost:3000"
pnpm demo:owner-submission-readiness:qa
```

## Surfaces covered

- `/member`
- `/profile`
- `/my-dogs`
- `/my-dogs/new`
- `/api/dogs` GET
- `/api/dogs` invalid POST validation guard

## Safety boundary

This step must not create, update, submit, publish, approve, reject, certify, revoke, delete, or otherwise mutate a real record. The invalid POST check is deliberately malformed and must fail before any dog profile can be created or submitted.

Locked sections remain outside the scope of Step 74:

- Registry publish/unpublish authority;
- Certificate issue/revoke authority;
- Verify lookup authority;
- Gallery backend selection authority;
- Admin moderation mutation authority;
- Ecosystem API/database authority;
- Auth/session cookie boundary established by Steps 66–69;
- Public runtime access/content/detail boundary established by Steps 70–72;
- Admin moderation read boundary established by Step 73.

## Final validation chain

After Step 74 passes, run:

```powershell
pnpm demo:owner-submission-readiness:static:qa
pnpm demo:owner-submission-readiness:qa
pnpm demo:admin-moderation-read:static:qa
pnpm demo:admin-moderation-read:qa
pnpm demo:public-detail-pages:static:qa
pnpm demo:public-detail-pages:qa
pnpm demo:public-surface-content:static:qa
pnpm demo:public-surface-content:qa
pnpm demo:public-runtime-access:static:qa
pnpm demo:public-runtime-access:qa
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


## Step 74 Runtime Shape Fix

The runtime smoke accepts both session payload shapes used by the locked auth layer: `data.session.user` and `data.user`. It also treats a server-rendered member-required access shell with HTTP 200 as protected, as long as the anonymous response contains access-required evidence and does not exercise owner mutation paths.

This fix is QA-only. It does not change application logic, persistence, auth behavior, or owner submission actions.
