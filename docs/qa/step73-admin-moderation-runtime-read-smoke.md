# Step 73 — Admin Moderation Runtime Read Smoke

## Status

QA-only patch. No product mutation logic is changed.

## Purpose

Step 73 verifies the protected admin moderation surfaces as read-only runtime pages after the Step 66–72 locks:

- Step 66: member runtime session
- Step 67: admin runtime session
- Step 68: runtime role separation
- Step 69: session boundary release lock
- Step 70: public runtime access
- Step 71: public surface content
- Step 72: public detail routes

This step proves that admin moderation pages can be read by an admin session and remain unavailable to anonymous/member sessions.

## Scope

Checked protected admin read surfaces:

- `/review`
- `/admin/registry`
- `/admin/partners`
- `/admin/ecosystem`
- `/admin/knowledge`

## Safety Boundary

This script is intentionally **GET-only**. It does not approve, reject, publish, delete, issue, revoke, submit, or otherwise mutate any records.

The runtime HTTP checks are treated as the source of truth. Static checks only verify command wiring, route existence, and the expected read-surface source contracts.

## Commands

```powershell
pnpm demo:admin-moderation-read:static:qa

$env:CCP_DEMO_RUNTIME_BASE_URL = "http://localhost:3000"
pnpm demo:admin-moderation-read:qa
```

## Expected Runtime Result

- anonymous visitor cannot read admin moderation surfaces
- member session cannot read admin moderation surfaces
- admin session can read all protected admin moderation surfaces
- admin pages return HTTP 200
- admin pages render expected admin read content
- admin pages do not render signed-out/member-required notices for admin
- both member and admin session cookies can be cleared after the smoke run

## Demo Data Requirements

Before runtime QA, ensure the app is running and demo identities exist:

```powershell
pnpm db:migrate
pnpm db:seed
pnpm ecosystem:manual:seed
pnpm dev
```

## Follow-up Validation Chain

```powershell
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
