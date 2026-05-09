# Step 101 — USG Standard Knowledge Layer

## Goal

Step 101 adds a **USG-standard educational layer** that makes the platform feel more alive and more useful for real Cane Corso owners and reviewers.

The pass focuses on four visible entry points:

1. **Knowledge** — adds a branded USG guide for structure, head/muzzle, bite caution, growth caution, photo preparation, and official-reading boundaries.
2. **My Dogs** — adds a short owner-facing photo-preparation panel that points directly to the Knowledge guide.
3. **Review** — adds a short admin-facing visual-review helper so the moderation flow reads structure and evidence more consistently.
4. **FAQ** — adds a small bridge panel that clarifies where official reading ends and where USG guidance starts.

## Product direction

This step follows the existing USG visual language:

- dark luxury base
- warm gold accent
- readable explanation-first copy
- calm owner/admin guidance
- no copy-paste educational slides
- FCI / ENCI stay the core reference, AKC / CCAA remain supporting sources

## Scope boundary

Step 101 is **content, UX, and presentation only**.

It does **not** change:

- Neon schema or migrations
- Auth/session mechanics
- Registry publish authority
- Certificate issue/revoke authority
- Verify lookup authority
- Gallery authority
- Admin moderation backend logic
- Ecosystem authority logic
- Netlify deployment configuration

## Files

### New

- `apps/web/components/usg-standard-knowledge-panel.tsx`
- `scripts/qa-step101-usg-standard-knowledge-layer.mjs`
- `docs/qa/step101-usg-standard-knowledge-layer.md`

### Updated

- `apps/web/components/knowledge-center.tsx`
- `apps/web/components/my-dogs-overview.tsx`
- `apps/web/app/(admin)/review/page.tsx`
- `apps/web/app/(public)/faq/page.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`
- `package.json`
- `README.md`

## QA checklist

- Knowledge renders the **USG standard guide** section.
- The guide includes:
  - structure and proportions
  - head and muzzle
  - bite caution
  - growth caution
  - owner photo checklist
  - official-source reading path
- My Dogs renders the owner shortcut panel.
- Review renders the admin visual-review shortcut panel.
- FAQ renders the standard-reading boundary panel.
- Step 101 is wired into the all-in-one release QA.
- Locked authority files remain present.

## Local commands

```bash
pnpm step101:usg-standard-knowledge:qa
pnpm step100:owner-dog-privacy:qa
pnpm step99:active-section-routing:qa
pnpm docs:readme:qa
pnpm release:all:qa
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
```

## Outcome

After Step 101 the platform should feel less like a static set of sections and more like a **real USG Cane Corso knowledge ecosystem**:

- the owner knows what photos to prepare
- the admin has a calmer review helper
- FAQ explains the trust boundary more clearly
- Knowledge becomes the living educational center for Cane Corso structure and preparation
