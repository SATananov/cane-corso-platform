# Step 94.2 — BG/IT visible language consistency pass

Scope: visible Bulgarian and Italian copy only. This pass removes mixed developer/product wording from member, admin, verify, certified, registry trust, owner journey, knowledge, and community surfaces.

Locked boundaries:
- No database changes
- No auth/session changes
- No Registry/Certificate/Verify authority logic changes
- No moderation workflow changes
- No API changes

QA:
- `pnpm platform:bg-it-language:qa`
- `pnpm platform:intent-first-auth:qa`
- `pnpm platform:role-aware-action:qa`
- `pnpm workspace:syntax`
- `pnpm typecheck`
