# Step 38 — Review Flow Browser Evidence & Release Lock

Status: ready for local browser verification.

## Purpose

Step 38 locks the owner/admin review readiness cycle introduced in Step 36 and Step 37.

It does not add product logic. It creates a clear QA/evidence boundary for the full review flow:

1. Owner prepares a Cane Corso profile.
2. Owner understands private profile vs public Registry visibility.
3. Admin reviews the submission with evidence support.
4. Admin keeps Registry, USG Certificate, USG Gallery and Owner data as separate layers.
5. Locked Registry / Certificate / Gallery / Verify / Ecosystem / Auth logic remains untouched.

## Browser evidence checklist

### Owner flow

Open:

- `/my-dogs`
- `/my-dogs/new`
- an existing edit route if available

Verify:

- Owner Review Readiness panel is visible.
- Checklist explains identity, details, story, photos, pedigree and review path.
- Owner understands that Registry, USG Certificate and USG Gallery are separate decisions.
- Owner photo guide remains available.
- Breed Standard proportions layer remains available through Knowledge/My Dogs guide.
- No mixed BG/EN wording appears in the visible BG flow except brand/product terms.

### Admin review flow

Open:

- `/review`

Verify:

- Review Decision Readiness panel is visible for review queue items.
- Panel shows evidence counts for owner photos, Registry-visible photos and Gallery-selected photos.
- Registry lane is separate from USG Certificate lane.
- USG Gallery lane is curated and not automatic.
- Owner boundary is clearly explained.
- Existing admin assessment and action controls remain available.
- No backend moderation behavior is changed by the presentation panel.

### Locked boundaries

Do not change or retest as modified logic unless a future step explicitly targets them:

- Registry publish logic
- Certificate issue/revoke logic
- Verify lookup logic
- Gallery selection backend logic
- Admin moderation backend
- Ecosystem API/DB
- Auth/session

## Required local commands

Run:

```bash
pnpm review:flow-evidence:qa
pnpm admin:review-decision:qa
pnpm owner:review-readiness:qa
pnpm breed:standard:qa
pnpm public:experience-polish:qa
pnpm brand:trust:qa
pnpm certificate:seal-polish:qa
pnpm entry:first-scene:qa
pnpm knowledge:admin-articles:qa
pnpm knowledge:browser-bg:qa
pnpm workspace:syntax
pnpm typecheck
```

## Release note

When all checks pass and browser evidence is accepted, create:

`ccp_step38_review_flow_evidence_release_lock_clean.zip`

This becomes the clean continuation checkpoint after Step 38.
