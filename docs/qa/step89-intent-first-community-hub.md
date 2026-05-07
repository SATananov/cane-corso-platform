# Step 89 — Intent-First Community Hub & Admin-Mediated Matching Foundation

Status: prepared for local verification.

## Goal

Make the Community/Ecosystem area start from the user's real intent instead of generic ecosystem text.

Primary public headline:

- Cane Corso търси:
- Търси партньор за разплод
- Cane Corso търси дом
- Малки Cane Corso
- Загубени / намерени Cane Corso
- Cane Corso-friendly места
- Услуги и партньори

## Trust rule

Sensitive community listings are not free public classifieds. For breeding, puppies, adoption/new home, and lost/found cases:

1. A registered user submits what they are looking for.
2. Admin reviews before public visibility.
3. Public detail does not expose private contact data.
4. Another member can submit an offer from the member workspace.
5. Admin decides whether to connect the parties.

## Scope

Touched areas:

- Public Community page hierarchy and copy.
- Public Ecosystem directory intent hub.
- Public Ecosystem detail contact boundary.
- Member Ecosystem owner workspace intent guidance and image URL fields.
- Ecosystem listing type labels, mobile labels, and `lost_found` contract support.
- Admin moderation copy for sensitive connection requests.
- QA script and styling.

Not touched:

- Registry authority logic.
- Certificate authority logic.
- Verify logic.
- Gallery authority logic.
- Runtime DB target guardrail.
- Neon secrets / Netlify env.

## Verification

Run:

```powershell
pnpm community:intent-hub:qa
pnpm ecosystem:friendly-places:qa
pnpm ecosystem:google-maps:qa
pnpm workspace:syntax
pnpm typecheck
```
