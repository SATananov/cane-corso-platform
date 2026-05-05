# Ecosystem Manual Evidence — Seeded Flow Guide

Use this guide when you do not want to manually create every ecosystem state from scratch.

## 1. Prepare the local database

```powershell
pnpm db:migrate
pnpm ecosystem:manual:seed
pnpm ecosystem:manual:db:qa
```

The seed is idempotent. You can run it more than once. The DB state QA confirms that only the published Step 16 seed is public-visible before you collect screenshots.

## 2. Start the app

```powershell
pnpm dev
```

Open:

```text
http://localhost:3000
```

## 3. Member evidence

Login:

```text
Email: ecosystem.member@demo.cane-corso.local
Password: DemoMember123!
```

Open:

```text
http://localhost:3000/ecosystem
```

Capture evidence for:

- Draft listing is private and editable.
- Pending listing is visible as waiting for admin review.
- Needs-changes listing explains what must be corrected.
- Approved/published states are clear in the owner workspace.

## 4. Admin evidence

Logout, then login:

```text
Email: ecosystem.admin@demo.cane-corso.local
Password: DemoAdmin123!
```

Open:

```text
http://localhost:3000/admin/ecosystem
```

Capture evidence for:

- Pending listing appears in moderation.
- Request changes is available only where appropriate.
- Approve is available only where appropriate.
- Publish appears only for approved real listings.
- Community suggestion stays internal and cannot be directly published.

## 5. Public evidence

Open:

```text
http://localhost:3000/partners
```

Capture evidence for:

- Published listing is visible publicly.
- Draft/pending/needs-changes/approved-only/suggestion records are not publicly visible.

## 6. Evidence status

When these screenshots are captured, Step 13 / Step 15 can move from manual evidence pending to manual evidence PASS.
