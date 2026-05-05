# Ecosystem flow evidence template

Use this document for Step 13 manual browser QA before locking the ecosystem release checkpoint.

## Tester

- Name:
- Date:
- Branch / checkpoint:
- Environment:
- Browser:

## Automated checks

Paste the result summary:

```text
pnpm workspace:verify — PASS / FAIL
pnpm workspace:syntax — PASS / FAIL
pnpm owner-center:qa — PASS / FAIL
pnpm ecosystem:qa — PASS / FAIL
pnpm ecosystem:lifecycle:qa — PASS / FAIL
pnpm ecosystem:admin:qa — PASS / FAIL
pnpm ecosystem:manual:qa — PASS / FAIL
pnpm ecosystem:manual:db:qa — PASS / FAIL
pnpm ecosystem:release:qa — PASS / FAIL
pnpm typecheck — PASS / FAIL
```

## Manual evidence

### 1. Member workspace — `/ecosystem`

Expected: member can see Owner Center, existing submissions, and the grouped submission form.

- Result: PASS / FAIL
- Screenshot path / note:
- Notes:

### 2. Member creates ecosystem submission

Expected: new listing can be saved as draft or submitted for review without errors.

- Result: PASS / FAIL
- Listing title:
- Screenshot path / note:
- Notes:

### 3. Member sees correct status in `/ecosystem`

Expected: submitted listing appears in the personal workspace with draft, pending review, needs changes, approved, or published status.

- Result: PASS / FAIL
- Screenshot path / note:
- Notes:

### 4. Admin moderation — `/admin/ecosystem`

Expected: admin can see pending submissions and moderation controls.

- Result: PASS / FAIL
- Screenshot path / note:
- Notes:

### 5. Admin request changes

Expected: request changes returns the listing to the member with a safe editable status.

- Result: PASS / FAIL
- Screenshot path / note:
- Notes:

### 6. Admin approve

Expected: approve changes the listing to approved, without publishing it directly.

- Result: PASS / FAIL
- Screenshot path / note:
- Notes:

### 7. Admin publish

Expected: publish is available only after approval and changes the listing to published.

- Result: PASS / FAIL
- Screenshot path / note:
- Notes:

### 8. Public ecosystem visibility check — `/community`

Expected: published ecosystem listing appears publicly; drafts, pending listings, needs-changes listings, approved-only listings, and internal suggestions do not appear publicly.

Seeded Step 16 expectation:

- Visible: `Step 16 Published — Cane Corso Play Field`
- Hidden: draft, pending, needs-changes, approved-only, and community-suggestion Step 16 records

- Result: PASS / FAIL
- Screenshot path / note:
- Notes:

### 9. Partner directory sanity check — `/partners`

Expected: partner/service profiles render correctly. This is not the canonical public ecosystem seed evidence route.

- Result: PASS / FAIL
- Screenshot path / note:
- Notes:

## Final decision

- Overall: PASS / HOLD / FAIL
- Reason:
- Follow-up needed:
