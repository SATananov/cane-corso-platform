Cane Corso Platform — Ecosystem Step 3 Partner/Services Polish Patch

Purpose:
- Fix the cramped/unstyled Partner & Services public page after Step 2.
- Keep the green Registry / Certificate / My Cane Corso / Gallery flows untouched.
- Polish only Partner/Services surfaces and copy.

Changed files:
- apps/web/app/(public)/partners/page.tsx
- apps/web/components/partner-directory-overview.tsx
- apps/web/lib/partner-copy.ts
- apps/web/app/globals.css

What changed:
- The public Partners page now prioritizes the real directory first, then shows the guide/explanation block.
- The Partner directory has proper premium cards, filters, CTA panel, stats, responsive layout, dark/light theme polish.
- Raw website URLs on cards are replaced with a clean “Open website / Отвори сайта / Apri sito” link.
- Bulgarian category and helper copy is cleaned up to avoid mixed BG/EN wording where practical.
- Admin/partner moderation surfaces receive CSS polish too, without changing server logic.

Local commands after copy-paste:
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
pnpm ecosystem:qa
pnpm workflow:qa
pnpm requirements:qa
pnpm dev

Manual check:
- /partners in dark theme
- /partners in heritage/light theme
- /partners?category=boarding or another category
- /partners/[slug]
- /admin/partners

If all is green visually and technically, continue with Step 4 Admin Review Polish or Step 5 Mobile cleanup.
