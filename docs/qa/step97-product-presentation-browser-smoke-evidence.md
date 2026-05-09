# Step 97 — Product Presentation & Browser Smoke Evidence

## Purpose

Step 97 adds a presentation-ready browser smoke evidence layer to the canonical project handoff. The goal is to make the platform easy to demonstrate as a full-stack Next.js product with clear public, member, admin, trust, and Neon runtime surfaces.

This step does not implement new product behavior. It documents what must be visible during manual browser review and gives QA a static guardrail that the evidence checklist stays present in the repository.

## Scope

Changed surfaces:

- `README.md`
- `package.json`
- `scripts/qa-step97-product-presentation-browser-smoke-evidence.mjs`
- `docs/qa/step97-product-presentation-browser-smoke-evidence.md`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`

Protected boundaries:

- Registry publication logic
- Certificate issue/revoke logic
- Verify lookup logic
- Gallery authority logic
- Auth/session logic
- Neon schema and migrations
- Admin moderation backend
- Ecosystem authority and match-request logic
- Public/member/admin UI implementation files

## Browser smoke evidence model

The README now defines a browser review matrix for:

- guest/public routes;
- member routes;
- admin routes;
- runtime database health proof;
- evidence capture format;
- product demo narrative.

This is intentionally evidence-ready documentation, not a claim that screenshots have already been captured.

## Required local validation

```powershell
pnpm step97:browser-smoke:evidence:qa
pnpm docs:readme:qa
pnpm release:all:qa
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
```

## Manual browser review after QA

Recommended manual route coverage:

Public / guest:

- `/`
- `/platform`
- `/registry`
- `/registry/[published-slug]`
- `/gallery`
- `/knowledge`
- `/faq`
- `/community`
- `/partners`
- `/access`
- `/verify`
- `/api/health/db`

Member:

- `/member`
- `/profile`
- `/my-dogs`
- `/my-dogs/new`
- `/community`
- `/partners/apply`

Admin:

- `/review`
- `/admin/registry`
- `/admin/partners`
- `/admin/ecosystem`
- `/admin/knowledge`

## PASS criteria

Step 97 is considered locked when:

- the README records Step 97 as the current checkpoint;
- the browser smoke evidence section is present;
- guest/member/admin route matrices are present;
- `/api/health/db` is included as runtime proof;
- the package script `step97:browser-smoke:evidence:qa` exists;
- the all-in-one release QA includes Step 97;
- workspace syntax and typecheck pass locally;
- no protected app logic is changed.
