# Step 24 — Ecosystem Owner Submission Resubmit Guardrails

Status: **PASS / READY FOR LOCAL VERIFICATION**

## Scope

Step 24 is a QA-only safety pass for the owner-side ecosystem submission lifecycle.

It does not add UI, does not change database schema, does not change public APIs, and does not unlock any locked public, registry, certificate, partner, gallery, review, or admin moderation surface.

## What Step 24 confirms

- Owners can continue editing only safe editable entries: `draft` and `needs_changes`.
- Owner resubmit sends the listing back to `pending_review`.
- Resubmit clears stale review/publication fields so returned entries do not carry old review state into the new review cycle.
- `pending_review`, `approved`, and `published` entries stay locked in the owner workspace.
- Public `/community` and `/community/[slug]` continue to expose only published, non-suggestion listings.
- `GET /api/ecosystem/[slug]` remains a read-only public API from Step 22.
- Admin moderation remains a separate admin-only lifecycle.
- Community suggestions remain internal unless an admin converts them into a real publishable listing later.

## Locked boundary

The following remain locked and must not be changed by this step:

- Registry
- Registry detail
- Certificate
- Verify logic
- My Cane Corso
- Gallery
- `/community`
- `/community/[slug]`
- `/partners`
- `/partners/[slug]`
- `/review`
- `/admin/partners`
- `/admin/ecosystem`
- `GET /api/ecosystem/[slug]` Step 22 public API boundary

## Files intentionally touched

```text
scripts/qa-ecosystem-owner-resubmit-guardrails.mjs
docs/qa/step24-ecosystem-owner-resubmit-guardrails.md
package.json
docs/release/ecosystem-next-build-plan.md
```

## Required verification

```powershell
pnpm ecosystem:owner-resubmit:qa
pnpm ecosystem:api-release:qa
pnpm ecosystem:detail:api:qa
pnpm ecosystem:detail:polish:qa
pnpm ecosystem:detail:qa
pnpm ecosystem:postrelease:qa
pnpm ecosystem:release:qa
pnpm workspace:syntax
pnpm typecheck
```

## Clean checkpoint target

```text
cane-corso-platform_clean_after_step24_ecosystem_owner_resubmit_guardrails.zip
```
