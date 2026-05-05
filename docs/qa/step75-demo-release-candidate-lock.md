# Step 75 — Demo Release Candidate Lock

## Purpose

Step 75 is the release-candidate guardrail that stops the auth/runtime QA cycle from growing into endless micro-steps. It records the locked boundary from Step 66 through Step 74 and keeps the validation chain centralized.

## Locked boundary

- Step 66 — Demo Runtime Session / Member Area Smoke
- Step 67 — Admin Runtime Session / Protected Admin Surface Smoke
- Step 68 — Runtime Role Separation Smoke
- Step 69 — Session Boundary Release Lock
- Step 70 — Public Runtime Access Smoke
- Step 71 — Public Surface Content Runtime Smoke
- Step 72 — Public Detail Pages Runtime Smoke
- Step 73 — Admin Moderation Runtime Read Smoke
- Step 74 — Owner Submission Runtime Readiness Smoke

## Command

```powershell
pnpm demo:release-candidate-lock:qa
```

## Final local runtime validation chain

Run with the dev server active on `CCP_DEMO_RUNTIME_BASE_URL`, normally `http://localhost:3000`:

```powershell
pnpm demo:owner-submission-readiness:qa
pnpm demo:admin-moderation-read:qa
pnpm demo:public-detail-pages:qa
pnpm demo:public-surface-content:qa
pnpm demo:public-runtime-access:qa
pnpm demo:session-boundary-release:qa
pnpm demo:role-separation:qa
pnpm demo:admin-runtime-session:qa
pnpm demo:runtime-session:qa
pnpm access:login-ui:qa
pnpm workspace:syntax
pnpm typecheck
```

## Safety boundary

This step is QA/documentation only. It does not change application logic, database authority, registry publication, certificate issuance, gallery selection, ecosystem moderation, owner submission persistence, or authentication/session implementation.

Step 75 exists to create one clean checkpoint after the Step 66–74 runtime boundary, not to introduce another product behavior layer.
