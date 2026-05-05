
# Milestone 5 — Performance Optimization Pass

## Scope

This milestone keeps the runtime boundaries locked and applies safe performance/readability optimization only:

- Documents which components are intentionally client-side.
- Keeps data-heavy public/member/admin reads server-side.
- Adds/keeps lazy image behavior for non-critical decorative and listing images.
- Avoids changing Auth, session, Registry, Certificate, Gallery, Verify, or DB authority logic.

## Files

- `docs/architecture/performance-optimization-pass.md`
- `scripts/qa-performance-optimization-pass.mjs`
- Minor safe image attribute additions in existing display-only image tags.

## Local validation

```powershell
pnpm performance:optimization:qa
pnpm ux:sanity:qa
pnpm workspace:syntax
pnpm typecheck
```
