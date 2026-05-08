# Step 94.3 — Platform Content Completeness Pass

Status: prepared for local verification.

## Goal

Make the main platform sections feel informationally complete, not only visually polished. The pass adds clear section-level guidance for public, member, and admin surfaces so users understand:

- what the section is;
- who it is for;
- what action matters next;
- what stays private, public, moderated, or admin-controlled.

## Scope

This is a visible content and UX-copy pass. It adds the shared `SectionContentGuidePanel` component and renders it across the main public, member, and admin sections.

Covered surfaces:

- public: `/platform`, `/registry`, `/gallery`, `/certified`, `/verify`, `/knowledge`, `/faq`, `/community`, `/partners`;
- member: `/member`, `/my-dogs`, `/profile`, `/ecosystem`, `/partners/apply`;
- admin: `/admin`, `/review`, `/admin/registry`, `/admin/partners`, `/admin/ecosystem`, `/admin/knowledge`, `/admin/members`.

## Language

BG, EN, and IT content maps are explicit. The pass also fixes visible mixed-language Italian copy in high-visibility sections such as role-aware actions and Gallery.

## Authority boundaries

This pass makes no DB/Auth/API authority changes. It does not change Registry publication logic, certificate issuance/revocation logic, Verify lookup behavior, session/auth routes, protected admin guards, Neon/DB runtime target logic, or repository behavior.

## Files intentionally touched

- `apps/web/components/section-content-guide-panel.tsx`
- public/member/admin page files that render the guide panel
- `apps/web/components/role-aware-action-panel.tsx`
- selected visible copy in Gallery, Verify, Certified, Partner admin, and member ecosystem pages
- `apps/web/app/globals.css`
- `scripts/qa-platform-content-completeness.mjs`
- `package.json`

## QA

Run locally:

```bash
pnpm platform:content-completeness:qa
pnpm platform:bg-it-language:qa
pnpm platform:intent-first-auth:qa
pnpm platform:role-aware-action:qa
pnpm workspace:syntax
pnpm typecheck
```
