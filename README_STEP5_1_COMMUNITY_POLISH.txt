Step 5.1 — Community public page polish

Scope:
- apps/web/app/(public)/community/page.tsx
- apps/web/components/ecosystem-directory.tsx

What changed:
- Cleaned Bulgarian copy on /community to reduce mixed BG/EN wording.
- Removed two duplicate explanatory grids from the public Community page, so the page is shorter and easier to scan.
- Kept the public ecosystem directory and community-world sections.
- Improved Bulgarian ecosystem directory labels.
- Added display helpers for common category values and standard seeded ecosystem notes.

Locked flows not touched:
- Registry
- Registry detail
- Certificate
- My Cane Corso
- Gallery
- Admin review/admin partners/admin ecosystem logic

QA run in this environment:
- node scripts/check-workshop-syntax.mjs — PASS
- node scripts/qa-ecosystem-engine.mjs — PASS
- node scripts/qa-full-stack-requirements.mjs — PASS
- node scripts/qa-review-publish-workflow.mjs — PASS

Not run here:
- pnpm typecheck, because this sandbox checkpoint has no node_modules/pnpm install.
