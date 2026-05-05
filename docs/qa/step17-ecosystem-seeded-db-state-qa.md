# Step 17 — Ecosystem Seeded DB State QA

Status: runtime database QA guardrail pass.

## Purpose

Step 17 adds a focused local database verification command for the seeded ecosystem manual evidence flow. It confirms that the Step 16 demo accounts and seeded ecosystem listings exist in the database with the correct lifecycle states before the user spends time doing browser evidence.

This step does not change public or locked UI sections.

## Command

```powershell
pnpm ecosystem:manual:db:qa
```

Run it after:

```powershell
pnpm db:migrate
pnpm ecosystem:manual:seed
```

## What it verifies

- The seeded member and admin login rows exist.
- The seeded logins have local-auth credentials for browser testing.
- The admin seed has the `admin` role.
- The member seed has the `member` role.
- The six Step 16 seeded ecosystem records exist.
- Draft remains unpublished.
- Pending review remains unpublished.
- Needs changes remains unpublished and has a review note.
- Approved remains approved but not public yet.
- Published has `published_at` set.
- Community suggestion remains internal and cannot become public through the seeded state.
- Only the published real listing is public-visible from the Step 16 seed set.
- Review history contains request changes, approve, and publish decisions.

## Locked boundary

Step 17 is only a QA/script/documentation pass. It must not modify these locked sections:

- Registry
- Registry detail
- Gallery
- Certificate
- Verify
- My Cane Corso
- Public community page
- Public partners directory/detail
- Review
- Admin partners
- Admin ecosystem visuals

## Expected result

`pnpm ecosystem:manual:db:qa` should end with:

```text
Ecosystem seeded DB state QA complete. Public visibility seed rules are safe.
```
