# Step 11 — Ecosystem Submission Lifecycle QA

Status: applied as a QA/guardrails pass.

## Scope

This step protects the real lifecycle of member ecosystem submissions after the Owner Center polish:

1. Member creates a draft.
2. Member submits the listing for review.
3. The listing appears in the owner workspace with the correct status.
4. Admin moderation can approve it or request changes.
5. Only approved real listings can be published.
6. Community suggestions remain internal until an admin converts them into a real listing.
7. The public directory exposes only published listings and excludes internal suggestions.

## Locked sections

This pass does not change the locked visual/public/admin sections:

- Registry
- Registry detail
- Certificate
- Verify logic
- My Cane Corso
- Gallery
- `/community`
- `/partners`
- `/partners/[slug]`
- `/review`
- `/admin/partners`
- `/admin/ecosystem`

## Files changed

- `package.json`
- `scripts/qa-ecosystem-submission-lifecycle.mjs`
- `docs/qa/step11-ecosystem-submission-lifecycle-qa.md`

## New QA command

```powershell
pnpm ecosystem:lifecycle:qa
```

## Recommended verification order

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm owner-center:qa
pnpm ecosystem:qa
pnpm ecosystem:lifecycle:qa
pnpm typecheck
```

## Manual QA flow

1. Sign in as a member.
2. Open `/ecosystem`.
3. Save a new ecosystem entry as draft.
4. Confirm it appears under “Моите записи в екосистемата”.
5. Submit the same entry for review.
6. Confirm the status becomes pending/review state.
7. Sign in as admin.
8. Open the ecosystem moderation area.
9. Confirm the submitted entry is visible in the moderation queue.
10. Approve it.
11. Publish it if it is an official/community listing.
12. Confirm it appears in the public ecosystem directory only after publication.

## Guardrail intent

This step intentionally avoids new UI polish. It adds a repeatable safety check so future ecosystem feature work cannot accidentally bypass the trusted publication flow.
