# Step 65.3 Demo Seed Auth Credential Patch

This check is scoped to the demo database only.

## What changed

- The demo member seed now creates or refreshes a valid local password credential for `member@demo.cane-corso.local`.
- The password is `DemoMember123!`.
- The seed remains idempotent and scoped to the demo member only.

## What did not change

- No main database seed was run.
- No auth/session behavior was changed.
- No schema or migration SQL was changed.
- No Registry, Certificate, Verify, Gallery, Admin, or Ecosystem logic was changed.
- No UI or CSS was changed.

## Manual login check

- Email: `member@demo.cane-corso.local`
- Password: `DemoMember123!`