# Step 22 — Public Ecosystem Detail API Guardrails

Status: **PASS / READY FOR LOCAL VERIFICATION**

## Scope

Step 22 adds a small read-only API companion for the locked public ecosystem detail page:

```text
GET /api/ecosystem/[slug]
```

The API returns the same public profile document used by `/community/[slug]` and is intended for future mobile/client integrations, QA probes, and safe public read access.

## Safety boundary

This step does **not** unlock any new publication path.

The API must only return listings that pass the existing repository boundary:

```text
status = published
submissionChannel != community_suggestion
```

The following states must remain unavailable through the public API:

- draft;
- pending review;
- needs changes;
- approved but not published;
- community suggestion;
- unknown or empty slug.

## Files changed

```text
apps/web/app/api/ecosystem/[slug]/route.ts
scripts/qa-ecosystem-public-detail-api.mjs
docs/qa/step22-public-ecosystem-detail-api-guardrails.md
package.json
scripts/qa-ecosystem-post-release-guardrails.mjs
scripts/qa-ecosystem-release-readiness.mjs
```

## Local QA

Run:

```powershell
pnpm ecosystem:detail:api:qa
pnpm ecosystem:detail:polish:qa
pnpm ecosystem:detail:qa
pnpm ecosystem:postrelease:qa
pnpm ecosystem:release:qa
pnpm workspace:syntax
pnpm typecheck
```

## Browser / API evidence

Published profile API should return `ok: true`:

```text
/api/ecosystem/step16-published-cane-corso-play-field
```

Non-public seed slugs should return a 404 error envelope:

```text
/api/ecosystem/step16-draft-cane-corso-walk-field
/api/ecosystem/step16-pending-cross-border-cane-corso-transport
/api/ecosystem/step16-needs-changes-cane-corso-friendly-terrace
/api/ecosystem/step16-approved-cane-corso-boarding-hotel
/api/ecosystem/step16-suggestion-future-cane-corso-event-idea
```

## Clean checkpoint target

```text
cane-corso-platform_clean_after_step22_public_ecosystem_detail_api_guardrails.zip
```
