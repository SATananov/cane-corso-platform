# Step 113.2 — Cane Corso Pregnancy & Puppy Growth Knowledge Guide

## Scope

Step 113.2 adds a public educational Knowledge guide for responsible Cane Corso breeding orientation:

- mating / tie date vs conception-date boundary;
- pregnancy calendar from Day 0 to the possible whelping window;
- preparation before birth;
- visible birth-problem / dystocia warning table;
- postpartum care and clear “no medication for cleaning without veterinarian” boundary;
- puppy development from Day 1 to Day 40;
- deworming orientation without public doses;
- short My Cane Corso entry card that links to the Knowledge guide before community listings.

## Product placement

- Full educational content lives in public Knowledge.
- My Cane Corso shows a short entry card only, so the owner has orientation without form overload.
- Community listings remain the action layer for puppies, new home, breeding match, lost/found, services and places.

## Files changed / added

- `apps/web/lib/knowledge-articles.ts`
- `apps/web/components/cane-corso-pregnancy-puppy-guide.tsx`
- `apps/web/components/knowledge-article-detail.tsx`
- `apps/web/components/knowledge-center.tsx`
- `apps/web/components/owner-cane-corso-section-workspace.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-step113-2-cane-corso-pregnancy-puppy-growth-knowledge.mjs`
- `docs/qa/step113-2-cane-corso-pregnancy-puppy-growth-knowledge.md`
- `package.json`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`

## Boundaries

No intended changes to:

- DB schema / migrations;
- Auth/session;
- Registry authority;
- Certificate / Verify;
- Gallery;
- Admin moderation backend;
- Ecosystem backend submission or publication logic.

## QA

Run locally:

```bash
pnpm step113-2:pregnancy-puppy-knowledge:qa
pnpm step113-1:owner-workspace:qa
pnpm step113:demo-data:qa
pnpm workspace:syntax
pnpm typecheck
```

## Notes

This guide is educational only. It avoids doses and medication instructions. It keeps veterinary responsibility visible and treats natural approach as preparation, observation, and early veterinary contact when needed.
