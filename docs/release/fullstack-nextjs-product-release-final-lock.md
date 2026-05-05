# Cane Corso Platform — Full-Stack Next.js Product Release Final Lock

This release lock is the all-in-one clean checkpoint for the Cane Corso Platform product release pack.
It is intentionally not a single micro-step. It records the complete static release boundary for the current full-stack Next.js platform state.

## Scope

The package covers the current product release baseline for:

- Full-stack Next.js application structure
- UI concepts: pages, routing, layouts and protected surfaces
- Client-side vs server-side rendering boundaries
- React Server Components and controlled client islands
- Data fetching and cache/revalidation documentation
- Performance, accessibility and production-readiness guardrails
- Member submission happy path
- Admin moderation action flow
- Registry and certificate release flow
- Demo runtime release-candidate guardrails
- Pre-Neon lock and secrets safety checks
- Workspace verification, source syntax checks and TypeScript local validation path

## Locked boundaries

This lock does not change runtime behavior. It must not modify:

- Auth/session authority logic
- Database schema or migrations
- Registry publish authority
- Certificate issue/revoke authority
- Verify lookup authority
- Gallery selection backend
- Ecosystem moderation backend
- Admin protected-surface rules
- Mobile runtime code
- Public registry/community/partners rendering logic

## Local validation command

Run the all-in-one release guardrail:

```powershell
pnpm release:all:qa
```

Then run the local TypeScript and workspace gate:

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
```

Optional extended chain:

```powershell
pnpm requirements:qa
pnpm platform:product-release:qa
pnpm demo:release-candidate-lock:qa
pnpm owner:submission-happy-path:qa
pnpm admin:moderation-action-flow:qa
pnpm registry:certificate-release-flow:qa
pnpm nextjs:rendering-cache:qa
pnpm performance:optimization:qa
pnpm production:readiness:qa
pnpm submission:qna:qa
pnpm pre-neon:lock:qa
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
```

## Expected status

A successful local run means:

- Static release guardrails pass
- Clean package boundaries are preserved
- Source syntax passes
- TypeScript passes across all workspace packages
- The package is ready for the next chosen direction: runtime browser smoke, deployment preparation, or Neon runtime smoke
