# Step 16 — Ecosystem Manual Test Assistant / Seeded Demo Flow

## Purpose

Step 16 makes the final manual browser evidence pass faster and less fragile by seeding a complete ecosystem moderation scenario into the local database.

This step does **not** change the locked public/admin UI sections. It adds a deterministic seed script, a QA guard, and a manual testing guide.

## Commands

```powershell
pnpm ecosystem:manual:seed
pnpm ecosystem:manual:qa
```

Run the seed after migrations and before browser testing:

```powershell
pnpm db:migrate
pnpm ecosystem:manual:seed
pnpm dev
```

## Seeded local accounts

| Role | Email | Password |
| --- | --- | --- |
| Member | `ecosystem.member@demo.cane-corso.local` | `DemoMember123!` |
| Admin | `ecosystem.admin@demo.cane-corso.local` | `DemoAdmin123!` |

## Seeded listing states

| State | Title | Route to inspect |
| --- | --- | --- |
| Draft | Step 16 Draft — Cane Corso Walk Field | `/ecosystem` as member |
| Pending review | Step 16 Pending — Cross-border Cane Corso Transport | `/admin/ecosystem` as admin |
| Needs changes | Step 16 Needs Changes — Cane Corso Friendly Terrace | `/ecosystem` as member |
| Approved | Step 16 Approved — Cane Corso Boarding Hotel | `/admin/ecosystem` as admin |
| Published | Step 16 Published — Cane Corso Play Field | `/partners` public directory |
| Community suggestion | Step 16 Suggestion — Future Cane Corso Event Idea | admin only; must not publish directly |

## Manual evidence flow

1. Log in as the seeded member.
2. Open `/ecosystem`.
3. Confirm draft, pending, needs-changes, approved, and published states are clear in the owner workspace.
4. Log out and log in as the seeded admin.
5. Open `/admin/ecosystem`.
6. Use the pending item for request-changes or approve testing.
7. Use the approved item for publish testing.
8. Open `/partners` and confirm only published real listings are public.
9. Confirm the community suggestion remains internal and cannot be directly published.

## Lock boundary

Step 16 must remain a seed/test-assistant pass only. It must not modify the locked public Registry, Gallery, Certificate, Verify, Review, Partners, Community, or Admin UI sections.
