# Step 16.1 — Admin Moderation Action Visibility Fix

## Purpose

Step 16.1 tightens the admin moderation action rules revealed by the seeded manual flow.

The seeded admin screen showed that draft records could still expose review buttons, and already published records could still expose a publish action. This pass fixes that behavior without changing the locked public Registry, Gallery, Certificate, Verify, Community, Partners, Review, or Admin page structure.

## Action visibility rules

| Listing status | Admin actions |
| --- | --- |
| `draft` | No action buttons. Show a read-only message that the member must submit the draft for review. |
| `pending_review` | Show `Request changes` and `Approve listing`. |
| `needs_changes` | No action buttons. Show a read-only message that the member must edit and submit again. |
| `approved` real listing | Show `Publish listing`. |
| `approved` community suggestion | No publish action. Show an internal-only message. |
| `published` | No publish action. Show a read-only message that the listing is already public. |

## Files changed

- `apps/web/components/ecosystem-moderation-dashboard.tsx`
- `scripts/qa-admin-moderation-practical.mjs`
- `scripts/qa-ecosystem-manual-test-assistant.mjs`
- `docs/qa/step16-1-admin-moderation-action-visibility.md`

## Verification

Run:

```powershell
pnpm ecosystem:admin:qa
pnpm ecosystem:manual:qa
pnpm ecosystem:lifecycle:qa
pnpm typecheck
```

Expected result: all commands pass, and the seeded admin moderation page no longer shows review actions for drafts or publish actions for already published listings.
