# Milestone 1 — Owner Submission Happy-Path Flow

Status: ready for local browser/runtime validation after Step 75.

## Scope

This milestone adds a product-facing owner submission happy-path panel to the member dog form workspace.

It helps the owner understand the real sequence:

1. create or edit a Cane Corso profile;
2. complete the required server-validation fields;
3. save the private draft;
4. submit the profile for admin review;
5. wait for admin-only decisions around approval, Registry publication, Certificate, and Gallery curation.

## Safety boundary

This milestone intentionally does not change:

- auth/session cookies;
- member/admin role separation;
- protected route behavior;
- Registry publish authority;
- Certificate issue/revoke authority;
- Verify lookup logic;
- Gallery curation authority;
- admin moderation mutation authority;
- Neon/database connection contract.

## Files touched

- `apps/web/components/owner-submission-happy-path-panel.tsx`
- `apps/web/components/my-dog-form-workspace.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-owner-submission-happy-path.mjs`
- `docs/qa/milestone1-owner-submission-happy-path.md`
- `package.json`

## Local validation

Run:

```powershell
pnpm owner:submission-happy-path:qa
pnpm demo:owner-submission-readiness:qa
pnpm demo:release-candidate-lock:qa
pnpm workspace:syntax
pnpm typecheck
```

Then browser-check:

1. sign in as a member;
2. open `/my-dogs/new`;
3. verify the happy-path panel appears above the form;
4. fill required fields and save draft;
5. verify draft persistence step turns ready;
6. submit for review;
7. verify lifecycle/status moves to submitted and the panel explains admin-only next actions.
