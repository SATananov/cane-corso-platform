# Ecosystem Seeded DB State Checklist

Use this checklist after applying Step 16 and Step 16.1, before or during manual browser evidence.

## 1. Prepare database

```powershell
pnpm db:migrate
pnpm ecosystem:manual:seed
```

## 2. Verify seeded DB state

```powershell
pnpm ecosystem:manual:db:qa
```

Expected result: PASS for each seeded login, seeded lifecycle state, public visibility rule, and review history check.

## 3. Browser evidence routes

```text
Member workspace: http://localhost:3000/ecosystem
Admin moderation: http://localhost:3000/admin/ecosystem
Public directory: http://localhost:3000/partners
```

## 4. Public visibility rule

Only this Step 16 seed record should be public-visible from the seed set:

```text
step16-published-cane-corso-play-field
```

These seed records must remain non-public:

```text
step16-draft-cane-corso-walk-field
step16-pending-cross-border-cane-corso-transport
step16-needs-changes-cane-corso-friendly-terrace
step16-approved-cane-corso-boarding-hotel
step16-suggestion-future-cane-corso-event-idea
```

## 5. Release note

This checklist supports Step 13 / Step 15 manual browser evidence. It does not replace the visual screenshot evidence, but it prevents wasting time when the local DB seed state is incomplete or unsafe.
