
# Milestone 2 — Admin Moderation Action Flow

## Scope

This milestone adds an admin-facing action-flow panel to the review surface so the operational moderation path is visible before an admin acts:

1. Owner submission enters the review queue.
2. Admin assessment stores official USG notes/scores separately from community votes.
3. Admin chooses approve or needs changes.
4. Publication, certificate, and Gallery exposure remain separate admin-controlled actions.

## Boundary

No Auth, session, role-separation, Registry route handler, Certificate document, Verify lookup, or DB authority boundary was changed.

## Files

- `apps/web/components/admin-moderation-action-flow-panel.tsx`
- `apps/web/components/review-queue-dashboard.tsx`
- `apps/web/app/(admin)/review/actions.ts` remains the server-action authority layer.
- `scripts/qa-admin-moderation-action-flow.mjs`

## Local validation

```powershell
pnpm admin:moderation-action-flow:qa
pnpm demo:admin-moderation-read:qa
pnpm demo:release-candidate-lock:qa
pnpm workspace:syntax
pnpm typecheck
```

## Browser validation

1. Start `pnpm dev`.
2. Login as admin.
3. Open `/review`.
4. Confirm the action-flow panel appears above the queue.
5. Confirm approve / needs changes / publish / certificate controls remain in their existing admin actions.
