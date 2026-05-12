# Step 133 — Owner Next Action Deep Links & Guided Sections

Status: prepared from Step 132 stable checkpoint.

## Purpose

Step 132 made the owner path visible in `/member` and `/my-dogs`. Step 133 makes that path practical: active timeline cards now lead to the exact owner action, while future/blocked cards render as passive labels instead of misleading links.

## User-facing changes

- Empty owner state links directly to `/my-dogs/new`.
- Core profile step links to `/my-dogs/[dogId]/edit#dog-profile-core`.
- Photo step links to `/my-dogs/[dogId]/media`.
- Origin/pedigree step links to `/my-dogs/[dogId]/edit#dog-profile-origin` and opens the relevant progressive form sections.
- USG review step links to `/my-dogs/[dogId]/edit#dog-profile-review` and opens the review/checks section.
- Care/growth step links to `/my-dogs/[dogId]/health#growth-table`.
- Registry step links only after a real publication exists.
- Certificate/Verify step links only after a real certificate/verification state exists.
- Locked timeline steps are styled as passive controls with explanatory labels.
- MARK I gives only a short helper hint and does not make official decisions.

## Guardrails

- No DB schema changes.
- No Auth/session/cookie changes.
- No Registry/Certificate/Verify authority changes.
- No Gallery backend changes.
- No Admin moderation backend changes.
- No AI/ML breed-proof claim.
- No automatic approval/certificate language.
- No medical diagnosis or health claim.

## Verification

Run:

```bash
pnpm step133:owner-next-actions:qa
pnpm workspace:syntax
pnpm release:all:qa
```

Full local typecheck is still recommended after applying the patch locally:

```bash
pnpm typecheck
```
