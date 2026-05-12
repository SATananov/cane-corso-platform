# Step 131.1 — Ask MARK I Visual Balance Polish

## Scope

Step 131.1 is a presentation-only polish over the Step 131 Ask MARK I assistant foundation.
It improves visual hierarchy, spacing, portrait/identity balance, question readability, answer card presence, trust-note presentation, and mobile behavior.

## Changes

- Rebalanced `AskMarkIPanel` so the main heading is `Ask MARK I / Попитай MARK I / Chiedi a MARK I`.
- Moved the previous descriptive title into a readable tagline below the heading.
- Added an identity meta row under the MARK I portrait with the USG seal and compact guide label.
- Added Step 131.1 CSS overrides for a more premium portrait, stronger but calmer active question state, better spacing, and mobile fallbacks.
- Softened visible Bulgarian MARK I copy to reduce mixed UI tone in the assistant panel.
- Kept the assistant curated/static only: no LLM, no API key, no fetch, no cookies, no localStorage, no DB reads/writes.

## Locked boundaries

Step 131.1 must not change:

- database schema or migrations;
- Auth/session/cookie behavior;
- Registry authority logic;
- Certificate issue/revoke logic;
- Verify logic;
- Gallery backend;
- Admin moderation backend;
- AI/ML breed-proof or automatic approval behavior.

## Manual browser review

After applying the patch, review:

- `/`
- `/platform`
- `/member`
- `/my-dogs`
- `/knowledge`
- `/review`

Expected result: MARK I feels like a premium USG guide with clear hierarchy and breathing room, not a dense form or generic chatbot.
