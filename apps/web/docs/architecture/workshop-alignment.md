# Workshop Alignment Roadmap

This repository is being aligned to an API-first workshop architecture with the following responsibilities:

- `apps/web`: Next.js web UI, route handlers, server components, authenticated member/admin experiences.
- `apps/mobile`: Expo client that consumes the shared HTTP API rather than web-only server actions.
- `packages/contracts`: shared DTOs, API envelope types, session models, and domain types.
- `packages/db`: Drizzle schema, repositories, migrations, seed scripts, and database access.
- `packages/auth`: shared session, cookie, and token primitives for web and mobile authentication flows.
- `packages/ui`: design tokens and Tailwind preset foundation for future visual unification.

## Rules locked in this phase

1. API-first: web and mobile should converge on the same backend contract.
2. Database remains canonical in `packages/db`.
3. Session handling moves away from hardcoded demo helpers toward signed cookie-backed bootstrap sessions.
4. Tailwind is prepared as the future styling foundation without forcing a redesign in this patch.
5. Mobile gets a clean Expo scaffold, but the first production vertical remains `auth -> profile -> my dogs`.

## Immediate next checkpoints after this patch

1. Copy files into the repo.
2. Run workspace cleanup once to remove stale generated artifacts.
3. Install dependencies on the real machine.
4. Run the verification script.
5. Boot the web app, test `/api/health`, `/api/session`, `/api/dogs`, then continue with the visual pass only after the API/session layer is stable.
