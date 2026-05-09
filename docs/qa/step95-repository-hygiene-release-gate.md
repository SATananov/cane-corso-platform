# Step 95 — Repository Hygiene & Release Gate Repair

Status: prepared / repository-hygiene only.

## Scope

Step 95 is a safe cleanup step after the Step 94.x UX/content/language work.

It changes only the handoff and QA layer:

- refreshes `README.md` so the current continuation point reflects Step 95 and the locked Step 94.x state;
- removes legacy root patch notes after preserving them under `docs/archive/package-notes/`;
- archives old root `apply-step*.cjs` / `complete-step*.cjs` helpers under `docs/archive/package-notes/legacy-apply-scripts/`;
- removes accidental nested patch artifacts under `packages/apps`, `packages/docs`, `packages/scripts`, and `packages/package.json`;
- repairs the final all-in-one release QA gate to match the current Neon/Netlify production state;
- allows `.env.example` files in nested app folders while still blocking real `.env` files and secrets.

## Guardrails

No changes are made to:

- Registry publish/detail authority;
- Certificate issue/revoke authority;
- Verify lookup authority;
- Gallery selection authority;
- Auth/session logic;
- Neon schema, migrations, or production data;
- Admin moderation backend;
- Ecosystem API authority logic;
- public/member/admin product UI behavior.

## QA

Run:

```bash
pnpm step95:repo-hygiene:qa
pnpm docs:readme:qa
pnpm release:all:qa
pnpm platform:content-completeness:qa
pnpm platform:bg-it-language:qa
pnpm platform:intent-first-auth:qa
pnpm platform:role-aware-action:qa
pnpm content:authority:qa
pnpm usg:identity-bulgarico:qa
pnpm db:target:qa
pnpm deploy:netlify:qa
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
```

`pnpm typecheck` should still be run locally after applying because dependency installation and Turbo execution are environment-specific.
