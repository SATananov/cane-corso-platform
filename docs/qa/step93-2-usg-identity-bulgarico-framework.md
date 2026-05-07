# Step 93.2 — USG Identity & Bulgarico Observational Framework

## Goal

Step 93.2 adds a public, premium, multilingual explanation of the USG identity and the USG Bulgarico observational framework without changing Registry, Certificate, Verify, Gallery, DB, Neon, Netlify, or admin authority logic.

## Product meaning

USG / Unico Suo Genere is presented as a Cane Corso trust, education, and community ecosystem. It should help owners present profiles with dignity, context, available evidence, and clear boundaries.

The platform now explains these surfaces together while keeping them distinct:

- **Registry** — reviewed and published public Cane Corso identity.
- **USG Certificate** — separate platform trust document tied to reviewed information and an evidence level.
- **Verify** — certificate-code confirmation path.
- **Gallery** — curated visual showcase, not automatic proof of pedigree.
- **Community** — moderated practical help and connection flows.
- **Knowledge** — educational layer for official facts, owner guidance, and USG observations.

## USG Certificate boundary

The USG Certificate is explicitly described as a platform trust document. It is not a pedigree, FCI document, kennel-club registration, judge report, veterinary certificate, health clearance, or official kennel authority.

The certificate language must support evidence levels:

1. Officially documented profile.
2. Documented family line.
3. Observed Cane Corso profile.
4. Pending / unconfirmed profile.

These are evidence levels, not value levels.

## USG Bulgarico boundary

USG Bulgarico is presented as a Bulgarian observational reading of Cane Corso phenotype directions. It is not a new breed, not an official standard, and not a replacement for Cane Corso Italiano, FCI, pedigree systems, clubs, or judges.

Allowed language:

- possible local phenotype directions;
- approximate working directions;
- hypothesis / observation / documentation framework;
- based on long-term owner observation;
- color, line, origin, structure, and selection can be considered together;
- color alone does not prove type, origin, quality, or health.

Disallowed language:

- Bulgarico as official standard;
- Bulgarico as a new breed;
- accusations toward breeders, owners, lines, or countries;
- color-only conclusions;
- claims that missing paperwork automatically means a Cane Corso is false.

## Files touched

- `apps/web/components/usg-identity-bulgarico-panel.tsx`
- `apps/web/app/(public)/platform/page.tsx`
- `apps/web/components/knowledge-center.tsx`
- `apps/web/components/platform-guide.tsx`
- `apps/web/lib/knowledge-articles.ts`
- `apps/web/app/globals.css`
- `README.md`
- `package.json`
- `scripts/qa-usg-identity-bulgarico-framework.mjs`
- `docs/qa/step93-2-usg-identity-bulgarico-framework.md`

## Guardrails

No intentional changes are made to:

- Registry API/read model logic;
- Certificate issue/revoke logic;
- Verify lookup logic;
- Gallery authority logic;
- DB schema/migrations/repositories;
- Neon configuration;
- Netlify deployment configuration;
- auth/session authority.

## Required checks

```powershell
pnpm usg:identity-bulgarico:qa
pnpm docs:readme:qa
pnpm content:authority:qa
pnpm platform:intent-release:qa
pnpm workspace:syntax
pnpm typecheck
```

The final local `pnpm typecheck` should be run after applying the clean ZIP because dependency installation is local-machine specific.
