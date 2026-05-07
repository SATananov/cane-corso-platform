# Step 93.3 — Platform-wide FAQ & Trust Clarity Center

## Purpose

Step 93.3 turns `/faq` into a platform-wide clarity center for the full Cane Corso Platform by USG experience. It explains what each public surface does, where USG trust begins and ends, why contact is mediated in sensitive community flows, and how owners should continue reading from official and specialist Cane Corso sources.

## Scope

Changed scope is content/UI/QA only:

- `apps/web/app/(public)/faq/page.tsx`
- `apps/web/app/globals.css`
- `apps/web/lib/knowledge-articles.ts` source-reference dictionary enrichment
- `README.md`
- `docs/qa/step93-3-platform-wide-faq-trust-clarity.md`
- `scripts/qa-platform-faq-trust-clarity.mjs`
- `package.json`

## Required FAQ coverage

The page must explain the whole platform, not only USG identity: USG, Registry, Certificate, Verify, Gallery, Community, Partners, Knowledge, USG Bulgarico, privacy, moderation, source discipline, and admin-mediated contact.

## Source links

The FAQ links to FCI, ENCI, AKC, UKC, CCAA, and ICCGB reference pages. These links are external reading paths only. USG does not claim ownership of their material and does not present external articles as platform authority.

## Revival-history names

The FAQ includes a careful research path for names commonly connected to Cane Corso recovery, documentation, specialist literature, or modern breed-history reading: Dr. Paolo Breber, SACC, Giovanni Bonnetti, Vito Indiveri, Stefano Gandolfi, Malavasi brothers, Antonio Morsiani, Basir, and Babak.

## Guardrails

- USG is not an official kennel organization.
- USG Certificate is not a pedigree.
- Verify checks USG-issued codes only; it does not check FCI databases.
- USG Bulgarico is not a new breed, official standard, or national variant.
- Color alone does not prove type, origin, quality, health, or value.
- The page must not insult breeders, owners, dogs, lines, countries, or official organizations.
- Registry / Certificate / Verify / Gallery / DB / Neon / Netlify authority logic must remain untouched.

## Local QA commands

```powershell
pnpm platform:faq-trust:qa
pnpm usg:identity-bulgarico:qa
pnpm docs:readme:qa
pnpm content:authority:qa
pnpm platform:intent-release:qa
pnpm knowledge:center:qa
pnpm knowledge:experience-polish:qa
pnpm workspace:syntax
pnpm typecheck
```
