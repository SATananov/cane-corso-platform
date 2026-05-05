# Step 78 — User Clarity & Scroll Reduction Polish

Status: ready for local browser review.

## Goal

Make the member/owner experience easier to understand without adding new product surfaces or touching locked backend logic.

The product rules for this pass:

1. The platform should keep a unique premium USG feel.
2. Every user should understand what to fill in and what happens next.
3. The user’s most important action should appear before supporting explanations.
4. Instructions should exist, but not create confusing scroll or stacked panels.

## Scope

Changed only presentation/UX clarity files:

- `apps/web/app/(member)/profile/page.tsx`
- `apps/web/app/(member)/member/page.tsx`
- `apps/web/components/my-dogs-overview.tsx`
- `apps/web/components/owner-onboarding-final-panel.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-user-clarity-scroll-reduction.mjs`
- `docs/qa/step78-user-clarity-scroll-reduction.md`
- `package.json`

## What changed

- Profile hero now has one primary next action, one workspace action, and Help.
- Profile bottom “owner center” section-card hub was removed to reduce scroll and repeated navigation.
- Owner onboarding guidance became compact/collapsible on Profile and Member, while staying open on Access.
- My Dogs now shows the real Cane Corso workspace immediately after the hero/stats instead of large explanatory grids first.
- My Dogs hero was simplified so media management remains inside the dog/workspace context instead of competing at the top.
- Member command center no longer renders extra navigation cards before the owner workspace.

## Locked boundaries preserved

No intended changes to:

- Registry authority or publication logic
- Certificate issue/revoke logic
- Verify lookup logic
- Gallery logic
- Admin moderation/backend actions
- Ecosystem API/DB/moderation logic
- Auth/session logic
- Database schema or migrations

## QA

Run:

```bash
pnpm user:clarity-scroll:qa
pnpm workspace:syntax
pnpm typecheck
pnpm deploy:netlify:qa
```

Browser review priority:

1. `/profile` — first viewport should show owner identity, clear status, and a single main next action.
2. `/my-dogs` — dog list/workspace should appear quickly, not after multiple explanation panels.
3. `/member` — owner workspace should be the main content, with guidance available but compact.
4. `/access` — onboarding explanation should still be visible for new users.
