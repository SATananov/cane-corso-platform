# Step 96 — README Visual Architecture & Neon Database Schema

Status: prepared / documentation-only guardrail.

## Goal

Make the canonical README easier to understand for review, presentation, and handoff by adding visual architecture documentation directly in Markdown.

## Added documentation

- `README.md` now includes a Mermaid full-stack architecture overview.
- `README.md` now includes a runtime responsibility map.
- `README.md` now includes a simplified Neon database ER diagram.
- `README.md` now includes a core member/admin/public data-flow sequence diagram.

## Scope boundary

This step is documentation and QA only. It must not change runtime product logic, database migrations, auth/session behavior, Registry authority, Certificate issuing/revoking, Verify lookup, Gallery selection, Admin moderation backend, or Ecosystem authority logic.

## Local validation

Run:

```powershell
pnpm step96:readme-visuals:qa
pnpm docs:readme:qa
pnpm release:all:qa
pnpm workspace:syntax
pnpm typecheck
```

## Expected result

All checks pass and the README can explain:

- what stack the platform uses;
- how Netlify, Next.js, Tailwind, Drizzle, and Neon connect;
- which package/layer owns which responsibility;
- how the core Neon data relationships are organized;
- how a dog profile moves from member draft to admin review to public Registry/Verify visibility.
