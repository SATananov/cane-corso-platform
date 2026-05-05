# Step 20 — Public Ecosystem Detail Page Foundation

Status: **PASS / READY FOR LOCAL VERIFICATION**

## Goal

Add the first public detail route for the released ecosystem layer:

```text
/community/[slug]
```

This step keeps the Step 18 / Step 19 release lock intact. It does not unlock or redesign Registry, Registry detail, Certificate, Verify, My Cane Corso, Gallery, `/community`, `/partners`, `/partners/[slug]`, `/review`, `/admin/partners`, or `/admin/ecosystem`.

## Scope

Added:

- public detail route: `apps/web/app/(public)/community/[slug]/page.tsx`
- public profile component: `apps/web/components/ecosystem-profile-detail.tsx`
- repository lookup: `getPublishedListingBySlug(slug)`
- server helper: `getPublishedEcosystemProfileDocument(slug)`
- directory card action linking published public listings to `/community/[slug]`
- guardrail QA: `pnpm ecosystem:detail:qa`

## Public visibility rule

The detail route must resolve only real published ecosystem listings:

```text
status = published
submissionChannel != community_suggestion
slug = requested slug
```

The route must return `notFound()` for:

- draft listings
- pending review listings
- needs changes listings
- approved but unpublished listings
- community suggestions
- unknown slugs

## Manual browser evidence target

After local verification and seed setup, the published seed should open:

```text
/community/step16-published-cane-corso-play-field
```

The following should not open as public detail pages:

```text
/community/step16-draft-cane-corso-walk-field
/community/step16-pending-cross-border-cane-corso-transport
/community/step16-needs-changes-cane-corso-friendly-terrace
/community/step16-approved-cane-corso-boarding-hotel
/community/step16-suggestion-future-cane-corso-event-idea
```

## Verification commands

```powershell
pnpm ecosystem:detail:qa
pnpm ecosystem:postrelease:qa
pnpm ecosystem:release:qa
pnpm workspace:syntax
pnpm typecheck
```

## Checkpoint target

```text
cane-corso-platform_clean_after_step20_public_ecosystem_detail_foundation.zip
```
