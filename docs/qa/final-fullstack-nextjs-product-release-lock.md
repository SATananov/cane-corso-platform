# Final Full-Stack Next.js Product Release Lock QA

This QA document supports the all-in-one final product release lock for the Cane Corso Platform.

## Purpose

The goal is to validate the whole current product release pack as a single release checkpoint, not as a new feature step.

## Included guardrails

The lock script validates and runs the static release QA chain for:

- Full-stack requirements
- Product release pack completeness
- Demo release-candidate lock
- Owner submission happy path
- Admin moderation action flow
- Registry certificate release flow
- Next.js rendering/data/cache map
- Performance optimization pass
- Production readiness cleanup
- Submission Q&A package
- Pre-Neon lock
- Workspace foundation verification
- Workspace syntax check

## Excluded by design

The all-in-one guardrail does not run runtime browser checks, database mutation tests or TypeScript compilation inside packaging environments that do not have dependencies installed.
Those remain local commands:

```powershell
pnpm typecheck
pnpm dev
```

## Acceptance

This release lock is accepted when:

- `pnpm release:all:qa` passes
- `pnpm workspace:verify` passes
- `pnpm workspace:syntax` passes
- `pnpm typecheck` passes locally
- The clean ZIP contains no forbidden artifacts
