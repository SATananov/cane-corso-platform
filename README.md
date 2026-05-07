# Cane Corso Platform — USG / Unico Suo Genere

Premium full-stack platform for Cane Corso owners, breeders, partners, community help, knowledge, registry trust, and official USG verification.

The product goal is simple: make the Cane Corso ecosystem easier to understand, safer to use, and more trustworthy. Public users should quickly find the right section; members should submit profiles or community requests without confusion; admins should be able to moderate, publish, certify, and connect people without exposing private contact data.

## Current checkpoint

This repository is currently aligned with the post-Step 93 product state:

- **Step 91:** Admin-mediated match requests for sensitive community listings.
- **Step 92:** Platform-wide intent-first page hierarchy.
- **Step 93:** Content authority and placeholder removal across public knowledge/content surfaces.
- **Step 93.1:** Canonical README and project documentation cleanup.

Legacy patch notes are archived under `docs/archive/package-notes/`. They are preserved as development history only; this root `README.md` is the current source of truth for day-to-day setup, QA, and handoff.

## Core product surfaces

### Public surfaces

- **Platform Home** — premium entry into the USG Cane Corso ecosystem.
- **Registry** — official public registry of published Cane Corso profiles.
- **Registry Detail** — public profile view with dog identity, registry status, owner public summary, pedigree, photos, and certificate trust when available.
- **USG Certificate / Verify** — certificate trust layer and public verification by code.
- **Gallery** — curated visual showcase, separate from the official registry.
- **Certified Archive** — public archive of certified / trusted entries where applicable.
- **Community** — intent-first community hub: “Cane Corso търси:” for help, home, partner, puppies, friendly places, services, and lost/found cases.
- **Partners / Services** — moderated partner and service ecosystem.
- **Knowledge** — educational Cane Corso content, history, breed identity, owner guidance, and responsible ownership.
- **FAQ / Manifesto** — platform orientation and trust boundaries.

### Member surfaces

- **Profile** — member identity and owner profile data.
- **My Dogs** — create and manage Cane Corso profiles, photos, pedigree data, and submission readiness.
- **Member Ecosystem Workspace** — submit community listings and offers through moderated flows.
- **Partner Application** — request partner/service visibility through admin review.

### Admin surfaces

- **Review** — registry submission review, admin assessment, publication, certificate, and gallery decisions.
- **Admin Registry** — registry administration and evidence surfaces.
- **Admin Ecosystem** — ecosystem moderation, community listing moderation, and admin-mediated connection requests.
- **Admin Partners** — partner/service review and publication.
- **Admin Knowledge** — read-only/admin-ready knowledge article foundation.

## Trust and privacy rules

The platform is intentionally not a free-for-all listing board.

- Public Registry shows only the owner’s public name and avatar/initials.
- Full owner contact data is visible to admins only.
- Sensitive community listings do not expose direct phone/email publicly.
- Sensitive listings include breeding match, adoption/new home, puppies, and lost/found.
- A second user can submit an offer/help request, but the connection is mediated by admin.
- Admin can allow, decline, or complete a connection request.
- Registry, Certificate, Verify, Gallery, and Ecosystem authority logic should not be changed casually.

## Community model

The public Community page is organized by user intent, not by internal database terminology.

Primary intent cards include:

- **Загубен / намерен Cane Corso** — urgent community help signal.
- **Партньор за разплод** — female seeks male / male seeks female, with admin mediation.
- **Cane Corso търси дом** — adoption or responsible new home.
- **Малки Cane Corso** — puppy listings and responsible litter visibility.
- **Места, подходящи за Cane Corso** — parks, venues, hotels, restaurants, and places suitable for large breeds.
- **Услуги и партньори** — vets, transport, training, boarding, shops, and related services.

The expected flow is:

1. Member submits a listing or request.
2. Admin reviews it.
3. Approved content becomes public.
4. Another member may submit an offer/help request.
5. Admin reviews the match request and decides whether to connect the parties.

## Registry and certificate boundaries

Registry and certificate are separate trust layers.

- Registry publication means the dog profile is publicly listed after admin review.
- USG Certificate is a separate trust decision and can be issued or revoked by admin.
- Verify checks certificate status by code.
- Gallery is a curated showcase layer, not the official registry itself.
- Community listings are not registry records unless intentionally connected by future product work.

## Knowledge and content authority

The Knowledge layer should feel complete and educational, not like a placeholder.

The current content direction includes:

- Cane Corso history and Italian identity.
- Old Roman Molossian roots and Southern Italian heritage.
- Guardian/utility role and modern responsible ownership.
- Breed standard education, proportions, owner photo guidance, and trusted references.
- Clear USG boundaries: education and trust support, not uncontrolled promotion.

Public-facing copy should avoid internal development language such as “step”, “placeholder”, “future module”, “working platform”, or raw implementation terms unless shown in developer-only documentation.

## Tech stack

- **Monorepo:** pnpm workspace + TurboRepo.
- **Web:** Next.js App Router, React, TypeScript, Tailwind CSS.
- **Mobile:** Expo / React Native.
- **Database:** PostgreSQL with Drizzle ORM; Neon is the production target.
- **Shared packages:** `@cane-corso-platform/auth`, `config`, `contracts`, `db`, `storage`, `ui`.
- **Deployment:** Netlify for the web app, with SSR/API route support.

## Repository structure

```txt
apps/
  web/                 Next.js web application and API routes
  mobile/              Expo mobile application
packages/
  auth/                session, roles, cookies, auth helpers
  config/              shared configuration
  contracts/           shared TypeScript contracts
  db/                  Drizzle schema, migrations, repositories
  storage/             storage abstractions
  ui/                  shared UI package foundation
scripts/               QA, release, cleanup, smoke, and verification scripts
docs/
  architecture/        architecture contracts and guardrails
  deploy/              deployment notes
  qa/                  step QA documents and locked checks
  release/             release planning and build notes
  archive/package-notes/ legacy patch notes and historical handoff files
```

## Environment setup

Create local environment files from examples and add real values locally only.

```powershell
copy .env.example .env
copy apps\web\.env.example apps\web\.env.local
```

Required production-oriented values include:

```env
DATABASE_PROVIDER=neon
DATABASE_EXPECTED_NAME=cane_corso_platform
DATABASE_URL=postgresql://USER:PASSWORD@HOST/cane_corso_platform?sslmode=require
DATABASE_URL_DIRECT=postgresql://USER:PASSWORD@HOST/cane_corso_platform?sslmode=verify-full
AUTH_SECRET=replace-with-secure-secret
SESSION_COOKIE_NAME=ccp_session
NEXT_PUBLIC_APP_URL=https://your-site.example
```

Optional Google Maps value:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=replace-with-restricted-browser-key
```

When the Google Maps key is not configured, the friendly places experience must remain usable in manual/list mode.

Never commit `.env`, `.env.local`, database passwords, API keys, or generated build artifacts.

## Local development

Install dependencies:

```powershell
pnpm install
```

Apply migrations:

```powershell
pnpm db:migrate
```

Start development servers:

```powershell
pnpm dev
```

Web app default:

```txt
http://localhost:3000
```

Runtime database health endpoint:

```txt
/api/health/db
```

The expected healthy production/main target is:

```json
{
  "activeDatabase": "cane_corso_platform",
  "status": "ok"
}
```

## QA commands

Common verification commands:

```powershell
pnpm content:authority:qa
pnpm platform:intent-release:qa
pnpm community:match-requests:qa
pnpm community:hub-polish:qa
pnpm community:intent-hub:qa
pnpm ecosystem:friendly-places:qa
pnpm ecosystem:google-maps:qa
pnpm owner:identity-privacy:qa
pnpm owner:image-payload:qa
pnpm db:target:qa
pnpm deploy:netlify:qa
pnpm workspace:syntax
pnpm typecheck
```

README/documentation guardrail:

```powershell
pnpm docs:readme:qa
```

A release checkpoint is not considered clean until:

- required QA scripts pass;
- `pnpm workspace:syntax` passes;
- `pnpm typecheck` passes across all packages;
- clean ZIP verification excludes forbidden files.

## Clean checkpoint ZIP rules

A clean handoff ZIP must exclude:

- `.env`, `.env.local`, `.env.development`, `.env.development.local`;
- `node_modules`, `.next`, `.turbo`, `.expo`, `.git`, `.vercel`;
- logs, nested ZIPs, `*.tsbuildinfo`, local build/cache artifacts.

Root-level historical patch notes should stay archived under `docs/archive/package-notes/`, not mixed into the root directory beside the canonical README.

## Netlify deployment

Before deploying:

```powershell
pnpm deploy:netlify:qa
pnpm db:target:qa
pnpm workspace:syntax
pnpm typecheck
```

After deploying:

1. Open `/api/health/db` and confirm `activeDatabase` is `cane_corso_platform` and `status` is `ok`.
2. Smoke test `/community`, `/registry`, `/gallery`, `/verify`, `/access`, and admin pages.
3. Keep demo database data separate from the main production database.

## Browser smoke checklist

Public:

- `/community` starts with “Cane Corso търси:” and shows the intent cards clearly.
- Sensitive listings do not expose direct phone/email publicly.
- `/registry` focuses on published Cane Corso profiles first.
- `/gallery` focuses on visual showcase first.
- `/verify` focuses on the certificate lookup first.
- `/knowledge` reads as complete educational content, not placeholder text.

Member:

- `/profile` shows member profile data correctly.
- `/my-dogs` supports owner dog profile editing and photo handling.
- Member ecosystem submissions are understandable and moderated.

Admin:

- `/review` shows decision queue before helper panels.
- `/admin/ecosystem` shows moderation and match request queues.
- Admin can review and decide on match requests.

## Development principles

- Prefer intent-first UX: show the thing the user came for before explanatory panels.
- Keep public copy polished, localized, and non-technical.
- Keep sensitive contacts private until admin mediation.
- Do not mix Registry, Certificate, Verify, Gallery, and Community authority layers.
- Do not expose secrets in chat, commits, screenshots, or ZIPs.
- Use QA scripts as guardrails, not as decorative files.
- Preserve historical notes in archive; keep the root directory clean and readable.

## Current continuation point

Use the latest clean checkpoint created after Step 93.1 as the stable continuation point. If a future branch or ZIP is created, it should preserve the same authority boundaries and clean documentation structure described here.
