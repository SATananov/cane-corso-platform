# Step 34 — Public Platform Experience Polish Batch

Status: package prepared for local browser/typecheck verification.

## Scope

This batch is a visual and UX cohesion pass across the public platform experience. It connects the approved cinematic entry, official USG seal/trust system, Knowledge layer, Registry, Verify, and Gallery into one clearer public journey.

## Touched areas

- `/platform` public experience trust band
- `/knowledge` published article trust strip
- `/knowledge/[slug]` official Knowledge article strip
- Registry orientation trust header
- Verify BG terminology cleanup
- Gallery official showcase trust rail
- Shared responsive/light/dark CSS for the public experience surfaces
- QA script and package script

## Guardrails

No data flow, API, DB repository, certificate issuing/revoking, gallery selection, review/publish, admin moderation, or ecosystem logic was changed.

Locked logic stays out of scope:

- Registry API / DB logic
- Certificate issuing / revoking
- Verify lookup logic
- Gallery selection logic
- Admin moderation
- Ecosystem API / DB
- Auth/session logic

## QA

Run locally:

```powershell
pnpm public:experience-polish:qa
pnpm brand:trust:qa
pnpm certificate:seal-polish:qa
pnpm entry:first-scene:qa
pnpm knowledge:admin-articles:qa
pnpm knowledge:browser-bg:qa
pnpm workspace:syntax
pnpm typecheck
```

Then browser-review:

- `/`
- `/platform`
- `/knowledge`
- `/knowledge/cane-corso-history-and-identity`
- `/registry`
- `/gallery`
- `/verify`
- a real `/certificate/[code]` page if seeded data is available

## Expected outcome

The public experience should feel like one coherent premium USG platform rather than separate visual islands: official trust, registry, knowledge, verify, gallery, and entry now share clearer brand/trust language and consistent UI hierarchy.
