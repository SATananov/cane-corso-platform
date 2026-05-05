Cane Corso Platform — Ecosystem Step 1 patch

What this patch does:
- keeps the green Registry / Certificate / My Cane Corso / Gallery flows untouched
- fixes the web app monorepo root detection by setting outputFileTracingRoot in apps/web/next.config.ts
- expands the shared ecosystem listing contract with:
  - puppy_listing
  - adoption_new_home
  - breeding_match
  - event
- adds BG/EN/IT labels for the new ecosystem layers
- replaces raw ecosystem status keys in member/admin UI with localized labels
- updates the ecosystem QA smoke script to guard the expanded contract

After copy/paste into the repo root, run:
1. pnpm workspace:verify
2. pnpm workspace:syntax
3. pnpm typecheck
4. pnpm ecosystem:qa
5. pnpm dev

Manual test path:
1. Open /ecosystem as member.
2. Create a draft with one of the new ecosystem layers.
3. Submit it for review.
4. Open /admin/ecosystem as admin.
5. Approve, then publish.
6. Open /community and confirm only published non-suggestion entries are visible.

Mobile note:
This patch intentionally does not change mobile package versions or pnpm-lock.yaml. Expo SDK 53 targets React Native 0.79 and React 19.0.0, but mobile cleanup is still Step 5 after the web ecosystem/admin flow is stable.
