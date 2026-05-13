# SoftUni Capstone Project Submission — Cane Corso Platform

This file is prepared for the SoftUni **Full Stack Apps with AI** Capstone Project submission.

The main product documentation remains in [`README.md`](./README.md). This SoftUni README does not replace the product identity of the application. It only summarizes how the existing Cane Corso Platform covers the Capstone requirements.

---

## Submission Information

| Field | Value |
| --- | --- |
| Project | Cane Corso Platform — USG / Unico Suo Genere |
| Author | Stefan A. Tananov |
| Email | s.tananov@yahoo.com |
| GitHub Repository | https://github.com/SATananov/cane-corso-platform |
| Live Project URL | https://cane-corso-platform.netlify.app/ |

## Demo Credentials

Use these verified demo accounts to test the deployed Netlify application:

| Role | Email | Password | Purpose |
| --- | --- | --- | --- |
| Member/User | `softuni-user@demo.cane-corso.local` | `SoftuniDemo2026!` | Member dashboard, profile, My Cane Corso, owner journey, dog records, health/growth archive |
| Admin | `softuni-admin@demo.cane-corso.local` | `SoftuniDemo2026!` | Admin review, registry moderation, certificates, partners, ecosystem moderation, knowledge administration |

A separate partner login is not required for the final assessment. The partner flow can be demonstrated from the member/user account and reviewed from the admin account.

For local database preparation, the repository also contains the SoftUni demo seed command:

```powershell
pnpm demo:seed:softuni
```

Demo public routes prepared by the seed include:

```txt
/registry/ares-softuni-demo
/verify/USG-SOFTUNI-DEMO-113
/partners/softuni-partner
/community/softuni-partner-cane-corso-training-transport
```

---

## Project Summary

Cane Corso Platform is a full-stack, multi-platform application for Cane Corso owners, public visitors, partners, and admins.

The platform provides:

- public Cane Corso Registry;
- public USG Certificate / Verify flow;
- curated Gallery and Certified Archive;
- member dashboard and owner profile;
- My Cane Corso profile management;
- pedigree, health, measurement, and photo-readiness records;
- moderated community and ecosystem listings;
- partner/service directory;
- admin review, moderation, certificate, registry, partner, and ecosystem controls;
- educational Knowledge area for Cane Corso ownership, breed identity, structure, care, and platform trust rules;
- Expo mobile client connected to the same Next.js API surface.

The application is product-oriented, but it is also suitable as a SoftUni Capstone project because it demonstrates a real-world full-stack architecture with web, backend, mobile, database, authentication, roles, deployment, AI-assisted development workflow, and documentation.

---

## Capstone Requirement Mapping

| Requirement | Project Implementation |
| --- | --- |
| Backend API | Next.js App Router API routes inside `apps/web/app/api/*` |
| Web client | Next.js + React + TypeScript + Tailwind in `apps/web` |
| Mobile client | Expo / React Native app in `apps/mobile` |
| Database | PostgreSQL with Drizzle ORM in `packages/db` |
| Production DB target | Neon serverless PostgreSQL |
| Monorepo | pnpm workspace + TurboRepo |
| Authentication | Local auth/session layer, secure session cookie, password hashing, role-aware access |
| Authorization | Role checks for guest/member/partner/admin flows and protected admin/member pages |
| Admin panel | Review, Registry, Partners, Ecosystem, Knowledge, Members/Admin surfaces |
| Database migrations | SQL migrations in `packages/db/drizzle` |
| Seed data | Demo seed scripts in `packages/db/scripts`, including SoftUni demo seed |
| Web screens | More than 10 public/member/admin pages |
| Mobile screens/sections | More than 5 mobile app sections using shared API contracts |
| Deployment | Netlify live deployment |
| AI agent instructions | `AGENTS.md` describes project context, rules, architecture, locked areas, and AI development guardrails |
| Documentation | Main README, architecture docs, QA docs, release docs, and this SoftUni README |
| File uploads/photos | Dog media and storage abstraction layer are present in the project structure |
| Scalability | Paging/filter-oriented directory and registry architecture; large-data validation should be checked before final submission if required by the evaluator |
| Backups | Non-mandatory requirement; can be added later through GitHub Actions and object storage |

---

## Main Web App Screens

The web application contains more than the minimum 10 required app screens. Important routes include:

### Public

- `/` — platform entry / home
- `/registry` — public Cane Corso Registry
- `/registry/[slug]` — public registry detail
- `/verify` — verification entry
- `/verify/[code]` — certificate verification result
- `/gallery` — curated gallery
- `/certified` — certified archive
- `/community` — ecosystem/community hub
- `/community/[slug]` — public ecosystem detail
- `/partners` — partner/service directory
- `/partners/[slug]` — partner detail
- `/knowledge` — knowledge center
- `/knowledge/[slug]` — knowledge article detail
- `/faq` — FAQ and trust clarity center
- `/manifesto` — platform manifesto
- `/access` — sign in / access page

### Member

- `/member` — member dashboard
- `/profile` — owner profile
- `/my-dogs` — member Cane Corso profiles
- `/my-dogs/new` — create Cane Corso profile
- `/my-dogs/[dogId]/edit` — edit Cane Corso profile
- `/my-dogs/[dogId]/media` — dog media/photos
- `/my-dogs/[dogId]/health` — dog health records
- `/ecosystem` — member ecosystem workspace
- `/partners/apply` — partner application

### Admin

- `/review` — admin review queue
- `/admin/registry` — registry administration
- `/admin/partners` — partner administration
- `/admin/ecosystem` — ecosystem moderation
- `/admin/knowledge` — knowledge administration
- `/admin/members` — user/member administration

---

## Mobile App Coverage

The Expo mobile app connects to the shared Next.js API and displays the same platform data from a mobile surface.

Mobile app sections include:

- API health/status;
- auth strategy/session information;
- current profile;
- My Cane Corso profiles;
- public registry list;
- registry detail bridge;
- verify bridge;
- partners bridge;
- ecosystem bridge;
- mobile readiness / shared API checks.

Main files:

```txt
apps/mobile/App.tsx
apps/mobile/src/api.ts
apps/mobile/package.json
apps/mobile/app.json
```

---

## Architecture

The project uses a client-server architecture in a Node.js monorepo.

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

Communication model:

- Web UI uses Next.js pages, server components, server actions, and API routes.
- Mobile app uses REST-style API calls to the Next.js backend.
- Shared contracts keep API documents typed across web, mobile, and backend.
- Database access is implemented through Drizzle ORM and repository helpers.

---

## Technology Stack

- **Monorepo:** pnpm workspace + TurboRepo
- **Backend:** Next.js App Router API routes
- **Web:** Next.js, React, TypeScript, Tailwind CSS
- **Mobile:** React Native + Expo
- **Database:** PostgreSQL + Drizzle ORM
- **Production database target:** Neon serverless PostgreSQL
- **Auth:** custom session/auth layer with role-aware access
- **Storage:** storage abstraction package for media/files
- **Deployment:** Netlify
- **Quality gates:** QA scripts, syntax checks, typecheck, release checks

---

## Database Schema Overview

The database has more than the required 4 tables and uses Drizzle migrations.

Main schema areas:

| Area | Tables |
| --- | --- |
| Users/Auth | `users`, `profiles`, `auth_local_credentials` |
| Dogs/Registry | `dogs`, `dog_media`, `dog_submissions`, `submission_reviews`, `dog_admin_assessments`, `registry_entries`, `certificates` |
| Owner records | `dog_measurement_records`, `dog_health_records` |
| Partners | `partners`, `partner_applications` |
| Ecosystem | `ecosystem_listings`, `ecosystem_match_requests`, `ecosystem_reviews` |
| Knowledge | `articles` |
| Audit | `audit_logs` |

Migration files are located in:

```txt
packages/db/drizzle/*.sql
```

Drizzle schema files are located in:

```txt
packages/db/src/schema/*
```

---

## Authentication and Roles

The platform supports multiple role-aware flows:

- **Guest:** can browse public Registry, Verify, Gallery, Knowledge, FAQ, Partners, and Community surfaces.
- **Member:** can manage owner profile, Cane Corso profiles, media, health/growth records, and ecosystem submissions.
- **Partner:** can use partner/service submission flows and partner-related surfaces.
- **Admin:** can review submissions, publish registry entries, issue/revoke certificates, moderate partners, moderate ecosystem listings, and manage users/members.

Access control is enforced through protected routes, API/session checks, and role-aware server-side logic.

---

## Local Development Setup

Install dependencies:

```powershell
pnpm install
```

Create local env files from examples:

```powershell
copy .env.example .env
copy apps\web\.env.example apps\web\.env.local
```

Apply database migrations:

```powershell
pnpm db:migrate
```

Seed SoftUni demo data:

```powershell
pnpm demo:seed:softuni
```

Start the development servers:

```powershell
pnpm dev
```

Web app default URL:

```txt
http://localhost:3000
```

Runtime DB health endpoint:

```txt
/api/health/db
```

Expected healthy production/main target:

```json
{
  "activeDatabase": "cane_corso_platform",
  "status": "ok"
}
```

---

## Useful QA Commands

General checks:

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
```

Database/deployment checks:

```powershell
pnpm db:target:qa
pnpm deploy:netlify:qa
pnpm neon:runtime:smoke:qa
```

SoftUni demo seed check:

```powershell
pnpm demo:seed:softuni
```

Release gate:

```powershell
pnpm release:all:qa
```

Important product/UX QA scripts available in the repository include:

```powershell
pnpm platform:content-completeness:qa
pnpm platform:bg-it-language:qa
pnpm platform:role-aware-action:qa
pnpm platform:faq-trust:qa
pnpm content:authority:qa
pnpm mobile:responsive-final:qa
pnpm owner:onboarding-final:qa
pnpm ux:sanity:qa
```

---

## Deployment

Live project:

```txt
https://cane-corso-platform.netlify.app/
```

Deployment target:

- Netlify for the Next.js web app and serverless API routes;
- Neon PostgreSQL as production database target;
- environment variables configured outside the repository.

Before deploying, run:

```powershell
pnpm deploy:netlify:qa
pnpm db:target:qa
pnpm workspace:syntax
pnpm typecheck
```

After deploying, verify:

```txt
/api/health/db
/registry
/gallery
/verify
/community
/partners
/access
/review
/admin/registry
/admin/partners
/admin/ecosystem
/admin/knowledge
```

---

## GitHub / Development History

The SoftUni requirement expects:

- at least 15 commits;
- commits on at least 3 different days;
- meaningful development history showing the project was built progressively.

Before final submission, verify this directly in GitHub:

```txt
https://github.com/SATananov/cane-corso-platform/commits
```

---

## AI-Assisted Development

The project was developed using an AI-assisted iterative workflow:

```txt
prompt -> implement -> test -> refine -> commit/push or discard
```

Project-wide AI agent instructions are documented in:

```txt
AGENTS.md
```

The repository also contains many QA scripts and documentation checkpoints that show the development and validation process.

---

## Pre-Submission Checklist

Use this checklist before submitting the project in SoftUni Judge or sending it to the training team.

- [ ] GitHub repo is public or access instructions are provided.
- [ ] GitHub has at least 15 commits.
- [ ] Commits exist on at least 3 different days.
- [ ] Live Netlify URL opens correctly.
- [ ] Demo credentials work on the intended test database.
- [ ] `pnpm install` works locally.
- [ ] `pnpm db:migrate` works with configured PostgreSQL/Neon database.
- [ ] `pnpm demo:seed:softuni` prepares demo data.
- [ ] `pnpm workspace:syntax` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm release:all:qa` passes.
- [ ] Web app has 10+ working screens.
- [ ] Mobile app has 5+ working sections/screens.
- [ ] Admin panel is accessible with admin credentials.
- [ ] Registry / Verify / Partners / Community flows are demonstrable.
- [ ] No `.env`, secrets, `node_modules`, build folders, logs, or nested ZIPs are committed.

---

## Notes for the Evaluator

The application is intentionally presented as a real Cane Corso ecosystem, not as a disposable demo UI.

For the Capstone assessment, the most important flows to check are:

1. open the live URL;
2. sign in with the member demo account;
3. review the member dashboard, profile, My Cane Corso, health/growth, and ecosystem areas;
4. open the public Registry and Verify routes;
5. sign in with the admin demo account;
6. review admin moderation, registry, certificate, partners, ecosystem, and knowledge surfaces;
7. inspect the repository structure, Drizzle migrations, seed scripts, shared packages, and mobile app.

