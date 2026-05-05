# Step 21 — Public Ecosystem Detail Polish & Safety Guardrails

Status: **PASS / READY FOR LOCAL VERIFICATION**

## Scope

Step 21 is a small post-release hardening pass on the public ecosystem detail foundation introduced in Step 20.

It must not redesign or refactor locked release surfaces. The only allowed product surface work is scoped to the public ecosystem directory/detail pair:

- `/community` directory card detail CTA behaviour
- `/community/[slug]` public ecosystem detail readability/localization
- QA coverage proving the detail route remains published-only and non-suggestion only

## Changes

- Removed the duplicated publication lane value from ecosystem directory cards.
- Added an encoded community profile href helper for `/community/[slug]` detail links.
- Added aria labels to public detail CTAs for clearer navigation.
- Added localized category labels for ecosystem detail categories such as `walk_play_place`, `transport_relocation`, `pet_friendly_place`, `hotel_boarding`, and `event_idea`.
- Polished Bulgarian wording so the detail page does not mix “detail страница” wording in user-facing copy.
- Added a dedicated Step 21 QA script: `pnpm ecosystem:detail:polish:qa`.

## Guardrails

The public ecosystem detail route remains protected by the same rule as Step 20:

- `status = published`
- `submissionChannel != community_suggestion`

The following must remain non-public:

- draft
- pending review
- needs changes
- approved but not published
- community suggestion
- unknown slug

## Locked sections

Step 21 must not modify these locked areas:

- Registry
- Registry detail
- Certificate
- Verify logic
- My Cane Corso
- Gallery
- `/review`
- `/admin/partners`
- `/admin/ecosystem`
- partner detail flow

## Local verification

Run:

```powershell
pnpm ecosystem:detail:polish:qa
pnpm ecosystem:detail:qa
pnpm ecosystem:postrelease:qa
pnpm ecosystem:release:qa
pnpm workspace:syntax
pnpm typecheck
```

Browser evidence:

- `/community` still shows published public ecosystem cards.
- `/community/step16-published-cane-corso-play-field` opens a public detail page.
- `/community/step16-draft-cane-corso-walk-field` does not expose a public detail page.
- `/community/step16-pending-cross-border-cane-corso-transport` does not expose a public detail page.
- `/community/step16-needs-changes-cane-corso-friendly-terrace` does not expose a public detail page.
- `/community/step16-approved-cane-corso-boarding-hotel` does not expose a public detail page.
- `/community/step16-suggestion-future-cane-corso-event-idea` does not expose a public detail page.

Target clean checkpoint ZIP:

`cane-corso-platform_clean_after_step21_public_ecosystem_detail_polish.zip`
