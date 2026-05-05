# Step 33 — Official USG Brand Trust System

Status: ready for local browser review.

## Scope

This batch applies the uploaded official 3D USG crest as the platform trust mark without changing locked business logic.

Applied areas:

- Header compact brand seal.
- Footer official seal.
- Certificate printable seal.
- Verify result trust mark.
- Verify entry side trust mark.
- Registry certified badges.
- USG Certified archive badge.
- USG Gallery selected badge.

## Safety boundary

Do not change the locked logic in:

- Registry API / public registry data flow.
- Certificate issuing / revoking logic.
- Verify lookup logic.
- Gallery selection logic.
- Admin moderation / ecosystem API / DB logic.

This step is visual/brand trust system only.

## Local QA

Run:

```bash
pnpm brand:trust:qa
pnpm entry:first-scene:qa
pnpm entry:cinematic-fit:qa
pnpm knowledge:admin-articles:qa
pnpm knowledge:browser-bg:qa
pnpm workspace:syntax
pnpm typecheck
```

## Browser review

Review:

- `/`
- `/platform`
- `/registry`
- `/registry/[slug]` with certificate data when available
- `/gallery`
- `/certified`
- `/certificate/[code]`
- `/verify`
- `/verify/[code]`

Expected result: the crest appears as an official trust mark, not as decorative noise.
