# Step 125 — Real User Production Readiness & UI Tone Cleanup

## Purpose

Step 125 is a real-user tone and readiness pass over the current platform state after the Step 124 README checkpoint.

The goal is to make public, owner, and review-facing surfaces feel like a usable product instead of a development/demo workspace.

## Scope

This step focuses on visible wording, product clarity, and release hygiene only.

Updated areas:

- Verify trust continuity panel is fully localized and receives the active locale.
- Public Verify result wording uses USG assessment language instead of raw admin wording.
- Owner profile privacy wording explains USG visibility instead of exposing internal admin language.
- Owner submission path explains USG review decisions instead of administrator workflow language.
- Public Registry copy presents official USG assessment and protected USG details more cleanly.
- Community owner workspace uses USG review / USG mediation language for public visibility and sensitive matching.
- FAQ mixed-language and internal workflow phrases are cleaned.
- Partner and ecosystem public seed/service descriptions avoid test/demo phrasing.
- Photo review assistant keeps ML-safe boundaries while presenting the feature as review guidance with final human decision.
- Old patch note clutter under `apps/web/` is removed from the clean checkpoint.

## Explicit non-goals

This step does not change:

- Registry authority logic.
- Certificate issue/revoke logic.
- Verify lookup logic.
- Gallery selection backend.
- Admin moderation backend.
- Auth/session rules.
- Database schema or migrations.
- ML/AI breed proof behavior.

## Tone rules locked by this step

- Real users should see USG product language, not development language.
- Public and owner surfaces should not rely on raw `admin flow`, `debug`, `prototype behavior`, or `testing` phrasing.
- Admin/review logic may remain in code and protected admin surfaces, but owner/public copy should say `USG review`, `USG assessment`, `USG mediation`, or `USG decision` where that is clearer.
- ML/photo guidance must remain safe: assistant suggestions support review, while final human labels remain the source of truth.
- No AI/ML feature proves breed, pedigree, Registry approval, or Certificate eligibility.

## QA

Run:

```powershell
pnpm step125:real-user-production-readiness:qa
pnpm step121:admin-photo-review:qa
pnpm step122:dataset-guardrails:qa
pnpm step123:ml-safe-photo-assistant:qa
pnpm step124:current-platform-readme:qa
pnpm workspace:syntax
pnpm release:fullstack-final:qa
```

Expected result: all checks pass.
