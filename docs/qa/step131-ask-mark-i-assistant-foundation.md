# Step 131 — Ask MARK I Assistant Foundation

## Status

Presentation-only assistant foundation for the USG product layer.

## Purpose

Step 131 introduces **Попитай MARK I / Ask MARK I** as a premium guided assistant layer across the main public, member, knowledge, My Cane Corso, and admin review surfaces.

The first implementation is intentionally curated and safe:

- no LLM/API integration;
- no database reads or writes;
- no auth/session change;
- no automatic Registry or Certificate decision;
- no medical decision system;
- no breed-proof claim by assistant guidance.

## User-facing intent

MARK I helps users understand the next correct step:

- guests: USG, Verify, Registry, Knowledge, access path;
- members: add a Cane Corso, photos, review readiness, health/growth orientation;
- My Cane Corso: profile basics, origin honesty, review/publication boundary, certificate separation;
- Knowledge: history, standard, health/growth, training and safety;
- Admin review: profile checks, photo evidence quality, request-changes boundary, certificate boundary.

## Scope

Added files:

- `apps/web/components/ask-mark-i-panel.tsx`
- `apps/web/lib/ask-mark-i-content.ts`
- `docs/qa/step131-ask-mark-i-assistant-foundation.md`
- `scripts/qa-step131-ask-mark-i-assistant-foundation.mjs`

Integrated into:

- `apps/web/components/entry-experience.tsx`
- `apps/web/app/(public)/platform/page.tsx`
- `apps/web/app/(public)/knowledge/page.tsx`
- `apps/web/app/(member)/member/page.tsx`
- `apps/web/components/my-dogs-overview.tsx`
- `apps/web/components/review-queue-dashboard.tsx`
- `apps/web/app/globals.css`
- `package.json`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`

## Locked boundaries preserved

Step 131 does not change:

- database schema or migrations;
- auth/session/cookie logic;
- Registry authority logic;
- Certificate issuance/revocation logic;
- Verify lookup authority;
- Gallery backend selection;
- Admin moderation backend decisions;
- API routes or repositories.

## QA

Run:

```bash
pnpm step131:ask-mark-i:qa
pnpm step130-1:journey-visual-readability:qa
pnpm step130:first-real-user-onboarding:qa
pnpm step129:live-product-evidence:qa
pnpm step128:product-priority-demo-separation:qa
pnpm workspace:syntax
pnpm release:all:qa
pnpm typecheck
```

Browser review routes:

- `/`
- `/platform`
- `/member`
- `/my-dogs`
- `/knowledge`
- `/review`
