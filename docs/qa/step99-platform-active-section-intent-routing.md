# Step 99 — Platform-wide Active Section Priority & Intent Routing

Step 99 is a focused UX hierarchy pass. It does not add new product authority, new database behavior, or new moderation logic. Its goal is to make the already existing platform feel like a real, action-first product after login and like a clear public guide before login.

## Product principle

**Public pages explain. Logged-in pages lead to action.**

Every major section should answer four questions immediately:

1. Where am I?
2. What is the main thing in this section?
3. What is the next action?
4. If I need information, where should I go?

## What changed

- The shared role-aware action panel now shows an explicit active-section marker.
- The primary action is labelled as the main action instead of being one more equal card.
- Secondary actions are visually separated from the primary action.
- Every role-aware panel includes an information/help route so explanatory copy leads to Knowledge or FAQ instead of staying as long text everywhere.
- Member Center now puts the live owner workspace before onboarding/explanation panels.
- My Dogs and Profile show the active section hero before supporting route guidance.
- Community, Registry, Knowledge, Partners, FAQ, member ecosystem, partner application, and admin review routes place the main section content before supporting explanation panels.

## Scope boundary

Step 99 is a presentation and hierarchy pass only. It does not change:

- Registry publication logic.
- Certificate issue/revoke logic.
- Verify lookup logic.
- Gallery authority logic.
- Auth/session logic.
- Neon schema or migrations.
- Admin moderation backend.
- Ecosystem authority logic.
- Netlify deployment configuration.

## QA

Run:

```powershell
pnpm step99:active-section-routing:qa
pnpm step98:real-browser:evidence:qa
pnpm step97:browser-smoke:evidence:qa
pnpm docs:readme:qa
pnpm release:all:qa
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
```

## Browser review target

After applying Step 99, open the main routes and verify that the first visible section matches the active navigation:

- `/member` — live owner workspace and next action should appear before long explanation.
- `/my-dogs` — profile list/add flow should be visually first.
- `/profile` — owner profile/status should be visually first.
- `/community` — intent hub/listings should be visually first.
- `/registry` — published Registry content should be visually first.
- `/knowledge` — article/category content should be visually first.
- `/partners` — services/directory content should be visually first.
- `/faq` — questions/answers should be visually first.
- `/review` — admin queue should be visually first after admin context.
