# Step 12 — Admin Moderation Practical QA / UX Safety Pass

Status: guardrail-only pass.

## Scope

Step 12 protects the practical moderation lifecycle after the Owner Center and ecosystem submission workspace were added.

This pass does not redesign or polish locked public/admin sections. It adds a dedicated static QA command for the admin moderation rules that must remain true before any future ecosystem feature work.

## Added command

```powershell
pnpm ecosystem:admin:qa
```

## What the command protects

- Admin ecosystem page is dynamic and loads moderation data through the server-gated admin document helper.
- Browser/API moderation paths require an administrator-capable session.
- Server actions validate listing identity and keep approve, request changes, and publish as separate paths.
- Admin actions revalidate the member workspace, community surface, partner directory, and admin ecosystem queue after moderation changes.
- Publish controls stay gated to approved or already-published real listings.
- Community suggestions remain internal and cannot publish directly.
- Repository writes review history for approve, request changes, and publish decisions.
- Public directory remains limited to published non-suggestion listings.
- Member workspace continues showing lifecycle status and only exposes edit controls for safe editable states.

## Manual QA checklist

Run the automated checks first:

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm owner-center:qa
pnpm ecosystem:qa
pnpm ecosystem:lifecycle:qa
pnpm ecosystem:admin:qa
pnpm typecheck
```

Then manually verify:

1. Log in as a member.
2. Open `/ecosystem`.
3. Save a draft listing.
4. Submit the listing for review.
5. Confirm the listing appears in the member workspace with the correct status.
6. Log in as an admin.
7. Open `/admin/ecosystem`.
8. Confirm the submitted listing appears in the moderation queue.
9. Request changes and confirm the member sees the returned state.
10. Resubmit or approve a valid listing.
11. Publish only after approval.
12. Confirm published listings appear publicly only through the approved directory path.
13. Confirm community suggestions do not publish directly.

## Locked-section promise

Step 12 must not change visual implementation in:

- Registry
- Registry detail
- Gallery
- Certificate
- Verify
- Community public page
- Partners public directory/detail
- Review page visuals
- Admin dashboard visuals

