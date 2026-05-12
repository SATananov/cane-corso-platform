# Step 130 — First Real User Onboarding Polish

Status: prepared as a presentation-only UX polish on top of Step 129.

## Goal

Step 130 adds a premium USG journey layer so a guest, member, or admin immediately understands the first meaningful action inside the platform.

The intent is not to add a random gallery. The new layer is a structured product journey:

- guest/public: verify, Registry, Knowledge, Community/Partners, member access;
- member dashboard: add Cane Corso, upload photos, prepare for review, track health/growth, use community/services;
- My Cane Corso empty state: basic data, photos, origin, USG review, public profile after approval;
- admin review: compact decision rail, not a large slideshow.

## Files

New files:

- `apps/web/components/usg-journey-carousel.tsx`
- `apps/web/components/usg-review-steps-rail.tsx`
- `docs/qa/step130-first-real-user-onboarding-polish.md`
- `scripts/qa-step130-first-real-user-onboarding-polish.mjs`

Updated files:

- `apps/web/components/entry-experience.tsx`
- `apps/web/app/(public)/platform/page.tsx`
- `apps/web/app/(member)/member/page.tsx`
- `apps/web/components/my-dogs-overview.tsx`
- `apps/web/components/review-queue-dashboard.tsx`
- `apps/web/app/globals.css`
- `package.json`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`

## Boundaries preserved

Step 130 is UI/presentation only.

It does not change:

- database schema or migrations;
- auth/session/cookie logic;
- Registry publication authority;
- Certificate/Verify authority;
- Gallery backend logic;
- Admin moderation backend actions;
- AI/ML breed-proof claims.

## Product copy boundaries

The journey copy keeps these rules clear:

- a private owner profile is not published automatically;
- Registry and certificate are separate authority layers;
- USG review is a human/admin decision;
- photos support review but do not prove pedigree by themselves;
- community/services are useful but not official Registry authority;
- di Casa Tananov imagery is used as atmosphere/heritage, not as public Registry authority.

## QA commands

Recommended local validation after applying the patch:

```bash
pnpm step130:first-real-user-onboarding:qa
pnpm step129:live-product-evidence:qa
pnpm step128:product-priority-demo-separation:qa
pnpm workspace:syntax
pnpm release:all:qa
pnpm typecheck
```

Browser smoke after local run:

- `/`
- `/platform`
- `/member`
- `/my-dogs` with an empty member account
- `/review` as admin

