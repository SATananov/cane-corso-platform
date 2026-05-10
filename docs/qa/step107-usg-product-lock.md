# Step 107 — USG Product Lock

## Purpose

Step 107 is a release-lock cleanup for the current Netlify deployed state after Step 106. It does not add a new product feature. It locks the platform as a cleaner user-facing USG product by aligning release hygiene, README checkpoint state, Step 103–106 evidence, visible language guardrails, and product-tone expectations.

## Scope

- Remove root-level patch/apply notes from the clean release tree.
- Preserve historical patch notes under `docs/archive/package-notes/`.
- Refresh `README.md` so the current checkpoint is Step 107 and Steps 103–106 are explicitly recorded.
- Keep `.env.example` in the release tree while avoiding real environment files.
- Add a dedicated Step 107 QA script and wire it into the all-in-one release lock.
- Keep Step 106 active-section UX intact: do not restore dense primary explanation panels to Knowledge, Community, Member, or My Dogs.
- Clean targeted visible BG/IT/EN copy that sounded like project scaffolding or mixed UI terminology.

## Language/product-tone lock

Visible UI should sound like a real platform for people, not an internal build. Bulgarian and Italian copy should use localized section names where possible:

- Registry → Регистър / Registro
- Verify → Проверка / Verifica
- Certificate → Сертификат / Certificato
- Gallery → Галерия / Galleria
- Knowledge → Знания / Conoscenze
- Community → Общност / Comunità

Brand/domain terms such as USG, Cane Corso, FCI, ENCI, AKC, CCAA, Netlify, Neon, and Bulgarico may remain original.

## Boundaries

Step 107 must not change database authority, certificate issue/revoke logic, registry publication logic, Verify lookup, auth/session, Neon connection handling, or ecosystem moderation logic.

## Expected QA

- `node scripts/qa-step107-usg-product-lock.mjs`
- `node scripts/qa-bg-it-language-consistency.mjs`
- `node scripts/qa-platform-intent-first-release-pass.mjs`
- `node scripts/qa-platform-content-completeness.mjs`
- `node scripts/qa-full-i18n-copy-consistency.mjs`
- `node scripts/qa-step103-growth-measurement-assistant.mjs`
- `node scripts/qa-step104-owner-growth-measurement-archive.mjs`
- `node scripts/qa-step105-production-clarity-user-first.mjs`
- `node scripts/qa-step106-full-product-structure-reset.mjs`
- `node scripts/qa-fullstack-all-in-one-release-lock.mjs`
- `node scripts/verify-workshop-foundation.mjs`
- `node scripts/check-workshop-syntax.mjs`

Local `pnpm typecheck` is still recommended after applying the ZIP because the sandbox does not have pnpm installed.
