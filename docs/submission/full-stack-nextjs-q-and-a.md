
# Full-Stack Apps with Next.js — Q&A

## What did you build?

I built **UNICO SUO GENERE — Cane Corso Platform**, a full-stack ecosystem for Cane Corso owners, public Registry profiles, USG certificate verification, community/partner services, and admin moderation.

## Why is it a full-stack Next.js app?

The platform uses Next.js App Router for the web UI and backend **Route Handlers** under `apps/web/app/api`. It includes server-rendered pages, protected member/admin routes, server actions, Route Handlers, database repositories, session handling, public trust pages, and dynamic public/member/admin data flows.

## Where is the backend?

The backend lives inside Next.js route handlers and server actions:

- `apps/web/app/api/dogs/route.ts`
- `apps/web/app/api/dogs/[dogId]/route.ts`
- `apps/web/app/api/registry/route.ts`
- `apps/web/app/api/verify/[code]/route.ts`
- `apps/web/app/(admin)/review/actions.ts`

Database logic is in `packages/db` using Drizzle ORM and PostgreSQL/Neon readiness.

## How does routing and layout work?

The App Router is organized into route groups:

- `(public)` for Registry, Verify, Gallery, Knowledge, Partners, Community.
- `(member)` for My Dogs, profile, member workspace, owner submissions.
- `(admin)` for Review, Registry admin, Partners admin, Ecosystem admin, Knowledge admin.

Shared layout, header, footer, locale/theme controls, and PageShell keep the UI consistent.

## What does SSR mean in this project?

**SSR means Server-Side Rendering.** In this project, the Next.js App Router renders protected public, member, and admin pages on the server through React Server Components and server-side repository/session reads. This keeps role-protected data, Registry trust records, certificate verification, and admin moderation state fresh and controlled by the server before safe UI props are sent to client components.

## What uses Server Components?

Most page files are Server Components by default. They load locale, session, and repository documents server-side, then pass safe props to UI components.

Examples:

- `/registry`
- `/registry/[slug]`
- `/review`
- `/my-dogs`
- `/admin/registry`

## What uses Client Components?

Client Components are used only for browser interactivity:

- `my-dog-form-workspace.tsx` for live owner profile editing.
- `verify-entry-panel.tsx` for client-side code entry and navigation.
- `image-lightbox.tsx` for photo viewing.
- Header/theme/locale behavior components.

## How does data fetching work?

- Server pages fetch repository documents directly when data is server-only.
- Client form workspaces call API routes for mutations.
- Admin actions use server actions and revalidate the affected public/admin paths.
- Public Verify and Registry routes read official published/certificate records only.

## How is caching handled?

Protected member/admin surfaces are dynamic because they depend on session and role. Public trust routes are kept fresh for demo/release correctness. Public educational surfaces are documented as future candidates for `revalidate` once production content ownership is finalized.

## How does the owner submission flow work?

A member creates a Cane Corso profile, saves it as draft, adds required data and media, then submits it for admin review. The owner sees readiness and lifecycle status. Admin approval, Registry publication, certificate issue, and Gallery curation remain separate admin-controlled layers.

## How does admin moderation work?

Admin opens `/review`, reads submitted profiles, saves official USG assessment data, requests changes or approves the profile, then publishes it to the Registry when ready.

## How does Registry / Certificate / Verify work?

Registry publication makes a profile public. USG certificate is a separate trust decision. Verify confirms only active certificate records through `/verify/[code]`.

## How is production/Neon readiness handled?

The project uses `DATABASE_URL` for runtime and `DATABASE_URL_DIRECT` for migrations. Production requires a strong `AUTH_SECRET`, secure cookie settings, and Neon SSL configuration using `sslmode=verify-full` where possible.

## What would you improve next?

The next product improvements would be production deployment hardening, real file storage/CDN for media, deeper admin audit history, and a polished mobile owner experience.
