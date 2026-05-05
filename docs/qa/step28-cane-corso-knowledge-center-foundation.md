# Step 28 — Cane Corso Knowledge Center Foundation

Status: PASS / LOCK after local static QA, pending browser visual review by the user.

## Goal

Step 28 turns the public `/knowledge` route into a professional Cane Corso breed information foundation. The purpose is not to add another generic page, but to create a structured Knowledge Center that can grow into a multilingual editorial system.

## Safe scope

Changed only the Knowledge route/content layer:

- `apps/web/app/(public)/knowledge/page.tsx`
- `apps/web/components/knowledge-center.tsx`
- `apps/web/lib/knowledge-center-content.ts`
- `apps/web/app/globals.css`
- `scripts/qa-cane-corso-knowledge-center-foundation.mjs`
- `docs/qa/step28-cane-corso-knowledge-center-foundation.md`
- `package.json` script registration

This step does not touch locked Registry / Certificate / Gallery logic, admin moderation logic, ecosystem APIs, dog publishing, verify flow, certificate rendering, or owner workspace persistence.

## Knowledge content now covered

The public Knowledge Center now includes:

- Cane Corso history and identity timeline.
- Official FCI standard orientation.
- FCI standard facts: name, origin, classification, utilization, general appearance, proportions, temperament, coat, colors, height, and weight.
- Temperament and ownership principles.
- Health awareness with screening topics used in CCAA / CHIC-style guidance.
- Owner guide categories: daily care, training, responsible breeding, travel and transport, adoption and rescue, public responsibility.
- Future content model fields for a later admin-managed knowledge system.
- Public source reference cards.

## Source discipline

The first knowledge foundation is anchored to reference sources instead of random web text:

- FCI Standard N°343 — Cane Corso Italiano.
- FCI breed nomenclature — Cane Corso Italiano (343).
- American Kennel Club Cane Corso breed information.
- Cane Corso Association of America AKC CHF + CHIC health testing page.
- OFA CHIC browse by breed.

The page is intentionally written as educational guidance. Health content is framed as awareness, not diagnosis, treatment, breeding clearance, or veterinary instruction.

## Localization

The Step 28 content model includes BG / EN / IT copies inside `apps/web/lib/knowledge-center-content.ts`.

## QA command

```powershell
pnpm knowledge:center:qa
```

Expected result:

```text
Step 28 Knowledge Center QA complete. Knowledge Center foundation is ready for browser review.
```

## Browser review checklist

Open `/knowledge` in local dev and verify:

- Dark theme contrast is premium and readable.
- Heritage / light theme contrast is readable.
- BG / EN / IT content remains consistent and does not mix accidental UI language.
- Timeline cards do not overflow.
- Standard facts are readable on desktop and mobile.
- Health disclaimer is visible and not hidden below the fold on typical desktop sizes.
- Source cards open official references in a new tab.
- Header, Registry, Certificate, Gallery, Verify, Admin, and Ecosystem flows remain unchanged.

## Lock note

Step 28 is a foundation pass. The next step may polish browser visuals, split Knowledge into article detail pages, or add an admin editorial model later. Until then, this static Knowledge Center is the approved safe boundary.
