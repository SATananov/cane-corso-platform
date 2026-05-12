# Step 132 — USG Owner Path & Next Action Timeline

## Purpose

Step 132 adds a premium owner-facing timeline that helps a real member understand exactly where they are in the Cane Corso preparation path and what the next action is.

The layer is intentionally presentation-only. It does not change Registry, Certificate, Verify, Gallery, Admin review, DB schema, authentication, or publication authority.

## Product behavior

The new `UsgOwnerPathTimeline` component appears on:

- `/member` after Ask MARK I, using the owner center dog document;
- `/my-dogs` after Ask MARK I, using the enriched My Dogs profile/media view.

The timeline shows:

1. Private profile
2. Core information
3. Photos
4. Origin / pedigree
5. USG review
6. Registry profile
7. Certificate / Verify
8. Care and ecosystem

It also displays a readiness percentage and a clear next action. The copy is localized in BG/EN/IT.

## Guardrails

Step 132 must remain safe:

- no DB or migration changes;
- no Auth/session/cookie changes;
- no Registry/Certificate/Verify authority changes;
- no Gallery backend changes;
- no Admin moderation backend changes;
- no AI/ML breed-proof claims;
- no automatic approval or certificate language;
- no medical diagnosis language.

## Files added

- `apps/web/components/usg-owner-path-timeline.tsx`
- `docs/qa/step132-owner-path-next-action-timeline.md`
- `scripts/qa-step132-owner-path-next-action-timeline.mjs`

## Files updated

- `apps/web/app/(member)/member/page.tsx`
- `apps/web/components/my-dogs-overview.tsx`
- `apps/web/app/globals.css`
- `package.json`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`

## Verification

Run:

```bash
pnpm step132:owner-path-timeline:qa
pnpm step131-1:ask-mark-i-visual:qa
pnpm step131:ask-mark-i:qa
pnpm workspace:syntax
pnpm release:all:qa
pnpm typecheck
```

Recommended browser review:

- `/member`
- `/my-dogs`

## Status

PASS when the QA script, workspace syntax, release QA, and local typecheck pass.
