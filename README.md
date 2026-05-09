# Cane Corso Platform — USG / Unico Suo Genere

Premium full-stack platform for Cane Corso owners, breeders, partners, community help, knowledge, registry trust, and official USG verification.

The product goal is simple: make the Cane Corso ecosystem easier to understand, safer to use, and more trustworthy. Public users should quickly find the right section; members should submit profiles or community requests without confusion; admins should be able to moderate, publish, certify, and connect people without exposing private contact data.

## Current checkpoint

This repository is currently aligned with **Step 97 — Product Presentation & Browser Smoke Evidence**.

Recent locked product state:

- **Step 91:** Admin-mediated match requests for sensitive community listings.
- **Step 92:** Platform-wide intent-first page hierarchy.
- **Step 93:** Content authority and placeholder removal across public knowledge/content surfaces.
- **Step 93.1:** Canonical README and project documentation cleanup.
- **Step 93.2:** USG identity, USG Certificate evidence levels, and USG Bulgarico observational framework.
- **Step 93.3:** Platform-wide FAQ and trust clarity center with official Cane Corso source links and revival-history reading path. The platform-wide FAQ is the main clarity center for first-time visitors.
- **Step 94:** Platform-wide role-aware action UX for guests, members, partners, and admins.
- **Step 94.1:** Intent-first authenticated experience cleanup: logged-in users see actions, status, and learning paths before dense public explanations.
- **Step 94.2:** BG/IT language consistency pass across visible platform copy.
- **Step 94.3:** Content completeness cleanup and intent balance across current platform surfaces.
- **Step 95:** Repository root cleanup, README checkpoint refresh, accidental nested patch artifact removal, and final release QA gate repair for the current Neon/Netlify state.
- **Step 96:** README visual architecture overview and simplified Neon database schema using Mermaid diagrams for clearer project handoff.
- **Step 97:** Product presentation and browser smoke evidence layer: route-by-route guest/member/admin review checklist, evidence capture format, and demo narrative for project handoff.

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
- **FAQ / Manifesto** — platform orientation, trust boundaries, USG Certificate clarity, admin-mediated community explanation, and official Cane Corso source links.

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

## USG identity and Bulgarico observational framework

USG means **Unico Suo Genere** — one of a kind. In product terms, USG is a premium trust, education, presentation, and community ecosystem for Cane Corso profiles. It respects official kennel systems while giving owners a clear way to present available evidence, family history, photographs, and reviewed platform identity.

USG does not replace FCI, pedigree documents, official clubs, kennel organizations, judges, veterinarians, or formal breeding records. It adds a transparent platform layer that explains what was reviewed, what is documented, and what remains observational.

The platform should use evidence levels, not value levels:

- **Officially documented profile** — recognized pedigree or formal documents are available.
- **Documented family line** — known parents, generations, photos, or owner history exist, but the official chain may be incomplete.
- **Observed Cane Corso profile** — type, photos, structure, story, and admin observation are used as a presentation layer.
- **Pending / unconfirmed profile** — not enough information yet, or still waiting for review.

**USG Bulgarico** is the Bulgarian observational reading of possible local Cane Corso phenotype directions. It is not a new breed, not an official standard, and not a replacement for Cane Corso Italiano, FCI, pedigree systems, clubs, or judges. It may document approximately three working phenotype directions in Bulgaria as a hypothesis based on long-term owner observation. Color, line, origin, structure, and selection can be considered together, but color alone does not prove type, origin, quality, health, or value.

## Registry and certificate boundaries

Registry and certificate are separate trust layers.

- Registry publication means the dog profile is publicly listed after admin review.
- USG Certificate is a separate platform trust decision and can be issued or revoked by admin. It is not a pedigree, FCI document, club evaluation, judge report, veterinary certificate, health clearance, or official kennel registration.
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
- USG identity, Certificate evidence levels, and USG Bulgarico observational framework.

Public-facing copy should avoid internal development language such as “step”, “placeholder”, “future module”, “working platform”, or raw implementation terms unless shown in developer-only documentation.

## Tech stack

- **Monorepo:** pnpm workspace + TurboRepo.
- **Web:** Next.js App Router, React, TypeScript, Tailwind CSS.
- **Mobile:** Expo / React Native.
- **Database:** PostgreSQL with Drizzle ORM; Neon is the production database target.
- **Shared packages:** `@cane-corso-platform/auth`, `config`, `contracts`, `db`, `storage`, `ui`.
- **Deployment:** Netlify for the web app, with SSR/API route support.

## Visual architecture overview

The platform is a full-stack Next.js product deployed on Netlify, with Drizzle ORM talking to Neon PostgreSQL and shared TypeScript packages keeping the web, mobile, auth, contracts, storage, and database layers aligned.

```mermaid
flowchart LR
    User[User / Owner / Admin] --> Netlify[Netlify Deploy]
    Netlify --> Next[Next.js App Router]
    Next --> Pages[Pages / Layouts / React Server Components]
    Next --> Api[API Routes / Server Actions]
    Pages --> UI[Tailwind CSS UI Layer]
    Api --> Auth[Session / Role Guards]
    Api --> Drizzle[Drizzle ORM]
    Drizzle --> Neon[(Neon PostgreSQL)]
    Next --> Packages[Shared TS Packages]
    Packages --> Contracts[Contracts]
    Packages --> Storage[Storage]
    Packages --> DbPkg[DB Repositories]
```

### Runtime responsibility map

| Layer | Responsibility | Main location |
| --- | --- | --- |
| Netlify | Production hosting, SSR/API runtime, environment variables | `netlify.toml`, Netlify project settings |
| Next.js App Router | Public/member/admin routes, layouts, SSR, route handlers | `apps/web/app/` |
| React UI + Tailwind | Premium USG interface, role-aware actions, responsive surfaces | `apps/web/components/`, `apps/web/app/globals.css` |
| Auth/session | Cookie session, role separation, member/admin boundaries | `packages/auth/`, `apps/web/app/api/session/` |
| Drizzle ORM | Typed database access and schema mapping | `packages/db/` |
| Neon PostgreSQL | Production database target | `DATABASE_URL`, `DATABASE_URL_DIRECT` |
| Shared contracts | API and document shapes shared across apps | `packages/contracts/` |

## Neon database overview

This diagram is intentionally simplified. It shows the core product relationships used for owner profiles, Cane Corso profiles, registry publication, USG certificate verification, moderated community listings, partner visibility, and knowledge content. The real schema can contain additional support fields, indexes, status enums, audit values, and media tables.

```mermaid
erDiagram
    profiles ||--o{ dogs : owns
    profiles ||--o{ ecosystem_listings : creates
    profiles ||--o{ partner_applications : submits

    dogs ||--o{ dog_media : has
    dogs ||--o{ dog_submissions : enters_review
    dogs ||--o| registry_entries : published_as

    dog_submissions ||--o{ review_decisions : receives
    registry_entries ||--o| certificates : may_receive
    certificates ||--o{ verification_events : checked_by_code

    ecosystem_listings ||--o{ ecosystem_match_requests : receives
    partner_applications ||--o| partner_profiles : approved_as

    knowledge_articles }o--|| profiles : authored_or_reviewed_by

    profiles {
        uuid id
        string email
        string role
        string displayName
        string avatarUrl
    }

    dogs {
        uuid id
        uuid ownerId
        string name
        string sex
        string color
        string lifecycleStatus
    }

    dog_media {
        uuid id
        uuid dogId
        string mediaType
        string storagePath
        string visibility
    }

    dog_submissions {
        uuid id
        uuid dogId
        string reviewStatus
        datetime submittedAt
    }

    registry_entries {
        uuid id
        uuid dogId
        string slug
        string publicationStatus
        datetime publishedAt
    }

    certificates {
        uuid id
        uuid registryEntryId
        string verificationCode
        string certificateStatus
        datetime issuedAt
    }

    ecosystem_listings {
        uuid id
        uuid ownerId
        string category
        string status
        string contactPolicy
    }

    ecosystem_match_requests {
        uuid id
        uuid listingId
        uuid requesterProfileId
        string status
    }

    partner_applications {
        uuid id
        uuid profileId
        string serviceCategory
        string reviewStatus
    }

    partner_profiles {
        uuid id
        uuid applicationId
        string publicSlug
        string publicationStatus
    }

    knowledge_articles {
        uuid id
        string slug
        string locale
        string status
    }
```

### Core data flow

```mermaid
sequenceDiagram
    participant Member
    participant Next as Next.js App Router
    participant API as API Route / Server Action
    participant ORM as Drizzle ORM
    participant DB as Neon PostgreSQL
    participant Admin

    Member->>Next: Create or edit Cane Corso profile
    Next->>API: Save draft / submit for review
    API->>ORM: Validate ownership and role
    ORM->>DB: Persist dog profile and submission
    Admin->>Next: Review submission
    Next->>API: Approve / request changes / publish
    API->>ORM: Revalidate admin authority
    ORM->>DB: Publish registry entry or issue certificate
    DB-->>Next: Registry / Verify data available publicly
```

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
pnpm step95:repo-hygiene:qa
pnpm step97:browser-smoke:evidence:qa
pnpm docs:readme:qa
pnpm platform:content-completeness:qa
pnpm platform:bg-it-language:qa
pnpm platform:intent-first-auth:qa
pnpm platform:role-aware-action:qa
pnpm platform:faq-trust:qa
pnpm usg:identity-bulgarico:qa
pnpm content:authority:qa
pnpm db:target:qa
pnpm deploy:netlify:qa
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
```

Final release QA gate:

```powershell
pnpm release:all:qa
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

Example files such as `.env.example` and `apps/web/.env.example` are allowed because they contain placeholders only. Root-level historical patch notes should stay archived under `docs/archive/package-notes/`, not mixed into the root directory beside the canonical README.

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
- `/knowledge` includes USG identity, USG Certificate evidence levels, and USG Bulgarico as an observational framework, not an official standard.
- `/faq` works as the platform-wide clarity center and links to FCI, ENCI, AKC, UKC, CCAA, and breed-history reference sources.

Member:

- `/profile` shows member profile data correctly.
- `/my-dogs` supports owner dog profile editing and photo handling.
- Member ecosystem submissions are understandable and moderated.

Admin:

- `/review` shows decision queue before helper panels.
- `/admin/ecosystem` shows moderation and match request queues.
- Admin can review and decide on match requests.


## Product presentation and browser smoke evidence

Step 97 makes the project handoff presentation-ready. It does not replace real browser testing, and it does not claim screenshots are already captured. Instead, it defines the exact route map, evidence format, and demo narrative that should be used when reviewing the deployed Netlify site or a local production-like build.

### Presentation narrative

The recommended demo story is:

1. **Public trust layer:** open the public surfaces and show how a visitor understands the platform, Registry, Gallery, Knowledge, FAQ, Partners, and Community without needing internal explanations.
2. **Member journey:** sign in as a member and show the intent-first path from profile to Cane Corso profile creation, submission readiness, and moderated community requests.
3. **Admin authority:** sign in as an admin and show that review, Registry, partners, ecosystem moderation, and knowledge administration are separated from public/member access.
4. **Verification layer:** show that Registry, Certificate, Verify, Gallery, and Community remain separate trust surfaces with their own authority boundaries.
5. **Runtime proof:** open `/api/health/db` and confirm the expected Neon database target before treating a browser review as production-valid.

### Guest/public smoke routes

| Route | What must be visible | Evidence to capture |
| --- | --- | --- |
| `/` | Premium platform entry and clear navigation into the ecosystem | Screenshot of first fold and header |
| `/platform` | Public explanation of the platform purpose and USG trust direction | Screenshot of platform overview |
| `/registry` | Published Cane Corso registry orientation before helper content | Screenshot of registry list/empty state |
| `/registry/[published-slug]` | Public dog profile detail when published data exists | Screenshot of dog identity/trust block |
| `/gallery` | Curated visual showcase distinct from Registry | Screenshot of gallery hero/list |
| `/knowledge` | Complete Cane Corso education surface, not placeholder copy | Screenshot of article/category overview |
| `/faq` | Platform-wide clarity center with trust and source guidance | Screenshot of FAQ trust section |
| `/community` | “Cane Corso търси:” intent hub and moderated community model | Screenshot of intent cards and sensitive listing behavior |
| `/partners` | Services/partners discovery with moderated trust framing | Screenshot of partners/service overview |
| `/access` | Clear sign-in/sign-up entry without confusing public explanation | Screenshot of access form |
| `/verify` | Certificate lookup is primary and understandable | Screenshot of verify lookup panel |
| `/api/health/db` | Runtime DB target reports expected Neon database | JSON capture showing `activeDatabase` and `status` |

### Member smoke routes

| Route | What must be visible | Evidence to capture |
| --- | --- | --- |
| `/member` | Owner command center / intent-first next actions | Screenshot after member login |
| `/profile` | Member identity and profile photo/profile data area | Screenshot of profile surface |
| `/my-dogs` | Owner dog profiles and clear next action | Screenshot of dog list or empty state |
| `/my-dogs/new` | Form-first Cane Corso profile creation with guidance | Screenshot of main form area |
| `/community` | Member-friendly path to submit or offer help through moderation | Screenshot of member-visible community action |
| `/partners/apply` | Partner application path remains separate from public partner list | Screenshot of application surface |

### Admin smoke routes

| Route | What must be visible | Evidence to capture |
| --- | --- | --- |
| `/review` | Review queue and decision authority before helper panels | Screenshot of review queue/control area |
| `/admin/registry` | Registry evidence/admin controls without changing public trust rules | Screenshot of admin registry overview |
| `/admin/partners` | Partner review/publishing controls | Screenshot of partner admin surface |
| `/admin/ecosystem` | Ecosystem moderation and admin-mediated match request queues | Screenshot of moderation queues |
| `/admin/knowledge` | Knowledge/admin content foundation with appropriate authority framing | Screenshot of admin knowledge overview |

### Evidence capture format

When doing manual browser review, store screenshots or notes outside the clean ZIP unless they are intentionally added as documentation. Recommended local folder:

```txt
docs/qa/evidence/step97-browser-smoke/
  01-public-home.png
  02-public-registry.png
  03-public-community.png
  04-member-center.png
  05-member-my-dogs.png
  06-admin-review.png
  07-admin-ecosystem.png
  08-runtime-db-health.txt
```

A browser smoke review is considered presentable when the reviewer can answer:

- What does a guest see and understand first?
- What does a member do next after login?
- What can only an admin decide?
- Which surfaces are public trust surfaces and which are moderated workflows?
- Which Neon database is the runtime connected to?

## Development principles

- Prefer intent-first UX: show the thing the user came for before explanatory panels.
- Keep public copy polished, localized, and non-technical.
- Keep sensitive contacts private until admin mediation.
- Do not mix Registry, Certificate, Verify, Gallery, and Community authority layers.
- Do not expose secrets in chat, commits, screenshots, or ZIPs.
- Use QA scripts as guardrails, not as decorative files.
- Preserve historical notes in archive; keep the root directory clean and readable.

## Current continuation point

Use the latest clean checkpoint created after **Step 97 — Product Presentation & Browser Smoke Evidence** as the stable continuation point. It preserves the Step 91–94.3 product behavior, keeps Step 95 repository hygiene/release gate repairs, keeps Step 96 visual architecture/Neon schema documentation, and adds a route-by-route product presentation and browser smoke evidence layer.

## Step 94 — Platform-wide Role-aware Action UX

Step 94 changes the platform-wide signed-in experience from section explanations to action, status, and next-step clarity. Guests still see public orientation, while members, partners, and admins see role-aware action panels for the surfaces they use. This is a presentation/UX layer only and does not change Registry, Certificate, Verify, Gallery, Ecosystem, Auth/session, Admin moderation, or Netlify authority logic.

QA: `pnpm platform:role-aware-action:qa`, `pnpm platform:faq-trust:qa`, `pnpm usg:identity-bulgarico:qa`, `pnpm content:authority:qa`, `pnpm workspace:syntax`, `pnpm typecheck`.

### Step 94.1 — Intent-first Authenticated Experience

Step 94.1 refines the post-login product behavior: signed-in users see intent-first actions, status, and a Cane Corso information compass instead of dense public section explanations. Guest presentation remains public and explanatory; authenticated surfaces prioritize what to do now, where to continue, and where to learn more.

### Step 94.2 — BG/IT Language Consistency

Step 94.2 verifies visible Bulgarian and Italian copy consistency across the current platform surfaces without changing core authority flows.

### Step 94.3 — Content Completeness Cleanup & Intent Balance

Step 94.3 verifies that public/member/admin surfaces are not left with placeholder-like copy and that action-first hierarchy remains balanced with enough guidance for users.

### Step 95 — Repository Hygiene & Release Gate Repair

Step 95 cleans the repository handoff layer after the Step 94.x content and UX passes. It removes legacy root patch clutter after archiving, removes accidental nested patch artifact folders under `packages/`, refreshes this README checkpoint, and repairs the all-in-one release QA gate so it validates the current Neon/Netlify production state instead of re-running the historical pre-Neon lock.

Scope boundary: Step 95 does not change Registry, Certificate, Verify, Gallery, Auth/session, Neon schema/migrations, Admin moderation backend, Ecosystem authority logic, or public/member product UI behavior.


### Step 96 — README Visual Architecture & Neon Database Schema

Step 96 makes the canonical README more presentation-ready by adding Mermaid-based visual diagrams for the full-stack architecture, runtime responsibility map, simplified Neon database relationships, and core member-to-admin-to-public data flow.

Scope boundary: Step 96 is documentation and QA only. It does not change Registry, Certificate, Verify, Gallery, Auth/session, Neon schema/migrations, Admin moderation backend, Ecosystem authority logic, or public/member product UI behavior.


### Step 97 — Product Presentation & Browser Smoke Evidence

Step 97 makes the repository easier to present and review by adding a route-by-route browser smoke evidence layer for public, member, admin, trust, and runtime database surfaces. It defines what should be visible on each route, what evidence should be captured, and how the project should be demoed as a real full-stack Next.js product rather than only a code package.

Scope boundary: Step 97 is documentation and QA only. It does not change Registry, Certificate, Verify, Gallery, Auth/session, Neon schema/migrations, Admin moderation backend, Ecosystem authority logic, or public/member/admin product UI behavior. Actual screenshots remain a manual/browser task after local or Netlify deployment.
