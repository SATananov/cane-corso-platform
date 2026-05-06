# Step 88 — Google Maps Places Integration

Status: prepared / needs local migration + typecheck

## Scope

This step connects Cane Corso-friendly ecosystem places with Google Maps / Places data while preserving the existing moderation boundary.

Member flow:

1. The member proposes a Cane Corso-friendly place from `/ecosystem`.
2. The member can select the real location through Google Places autocomplete.
3. The form stores Place ID, place name, formatted address, Google Maps URL, latitude, and longitude.
4. The record remains draft / pending until admin review.

Admin flow:

1. `/admin/ecosystem` displays the Google Maps place data and link.
2. Admin approval and publication gates remain unchanged.

Public flow:

1. `/community` renders approved friendly places as map markers when a Google Maps key is configured.
2. `/community/[slug]` renders a map preview and Google Maps link for the published place.
3. If no API key is configured, the platform falls back to list/manual mode without breaking the page.

## Environment

Add a restricted browser key:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

Enable Google Maps JavaScript API and Places API in Google Cloud. Restrict the key by HTTP referrer for the production domain.

## Database

Adds migration:

```txt
packages/db/drizzle/0011_ecosystem_google_maps_places.sql
```

New columns are additive and nullable:

- `google_place_id`
- `google_place_name`
- `google_formatted_address`
- `google_maps_url`
- `latitude`
- `longitude`

## Locked boundaries

Not changed:

- Registry backend
- Certificate / Verify logic
- Gallery backend
- Auth/session
- DB target guardrail
- Ecosystem moderation authority rules

## Verification

Run locally:

```powershell
pnpm db:migrate
pnpm ecosystem:google-maps:qa
pnpm ecosystem:friendly-places:qa
pnpm db:target:qa
pnpm deploy:netlify:qa
pnpm workspace:syntax
pnpm typecheck
```
