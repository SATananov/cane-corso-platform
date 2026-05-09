# Step 100 — Owner and Cane Corso Privacy Boundary

## Purpose

Step 100 clarifies the difference between the owner profile and the Cane Corso profile before deeper browser UX review.

The product rule is:

- **Profile / My Profile** means the human owner.
- **My Cane Corso / My Dogs** means the owner-managed Cane Corso records.
- The owner can view and update their own owner data.
- The owner can view and update their own Cane Corso data.
- Admin can view the full owner and Cane Corso data for review, moderation, publication, certificate, and safety.
- Public visitors see only the approved safe Registry core.

## Public Registry boundary

For non-owner/non-admin visitors, a published Registry profile should show only:

- approved photos;
- Cane Corso name;
- birth date;
- owner public name;
- certificate/verify trust when available.

The following stay owner/admin-only:

- owner email, phone, private contact data, and private location;
- microchip number;
- full pedigree number and deeper family tree;
- long owner story / deeper internal registry story;
- internal admin assessment detail;
- full Cane Corso editable profile data.

## Changed surfaces

- `apps/web/app/(public)/registry/[slug]/page.tsx`
- `apps/web/components/public-registry-profile.tsx`
- `apps/web/app/(member)/profile/page.tsx`
- `apps/web/components/my-dogs-overview.tsx`
- `apps/web/components/role-aware-action-panel.tsx`
- `apps/web/app/globals.css`
- `README.md`
- `package.json`
- `scripts/qa-fullstack-all-in-one-release-lock.mjs`
- `scripts/qa-step100-owner-dog-privacy-boundary.mjs`

## Guardrails

Step 100 must not change:

- Neon schema/migrations;
- Auth/session mechanics;
- Certificate issue/revoke authority;
- Verify lookup authority;
- Gallery authority;
- Admin moderation backend;
- Ecosystem authority logic;
- Netlify deployment configuration.

## QA

Run:

```powershell
pnpm step100:owner-dog-privacy:qa
pnpm step99:active-section-routing:qa
pnpm step98:real-browser:evidence:qa
pnpm step97:browser-smoke:evidence:qa
pnpm docs:readme:qa
pnpm release:all:qa
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
```
