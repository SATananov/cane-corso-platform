
# Next.js Rendering, Data Fetching, and Cache Map

This document is the course-facing architecture map for **Full-Stack Apps with Next.js**. It explains where the platform uses server rendering, route handlers, client components, dynamic data, and cache boundaries.

## Route groups and rendering model

| Surface | Example routes | Rendering model | Data source | Cache policy |
| --- | --- | --- | --- | --- |
| Public Registry | `/registry`, `/registry/[slug]` | Server-rendered App Router pages | `getPublishedRegistryDocument`, public repository reads | Dynamic for demo correctness and trust freshness |
| Public Verify | `/verify`, `/verify/[code]` | Server-rendered page plus client form on entry | Verify route / server lookup | Dynamic, certificate trust must not be stale |
| Member workspace | `/member`, `/my-dogs`, `/my-dogs/new` | Protected server pages with client form islands | Session + `MyDogsRepository` + `/api/dogs` mutations | Dynamic, session scoped |
| Admin moderation | `/review`, `/admin/registry`, `/admin/partners`, `/admin/ecosystem`, `/admin/knowledge` | Protected server pages with server actions | Admin session + repositories | Dynamic, role and moderation state scoped |
| Public ecosystem | `/community`, `/community/[slug]`, `/partners`, `/partners/[slug]` | Server-rendered public pages | Published-only repository helpers | Dynamic until production cache policy is finalized |
| Knowledge | `/knowledge`, `/knowledge/[slug]` | Server-rendered educational surfaces | Local/admin-ready content library | Can later use `revalidate` because it is public content |

## SSR / Server-Side Rendering boundary

SSR means **Server-Side Rendering**. In this App Router project, the primary read surfaces are rendered on the server using React Server Components, repository reads, session checks, and dynamic route boundaries. Client Components are kept as focused browser-only islands for form state, navigation input, lightbox behavior, locale/theme controls, and other interactive UI.

## Server Components

Most App Router page files are Server Components by default. They load locale, session, and repository documents on the server, then pass safe documents into presentation components.

Key examples:

- `apps/web/app/(public)/registry/page.tsx`
- `apps/web/app/(public)/registry/[slug]/page.tsx`
- `apps/web/app/(admin)/review/page.tsx`
- `apps/web/app/(member)/my-dogs/page.tsx`

## Client Components

Client Components are used only where browser interactivity is required:

- `apps/web/components/my-dog-form-workspace.tsx` — live validation, draft/save/submit form state, client API mutation.
- `apps/web/components/verify-entry-panel.tsx` — client-side input and navigation to `/verify/[code]`.
- `apps/web/components/image-lightbox.tsx` — browser-only image interaction.
- Header utility and theme/locale controls.

## Route Handlers

The backend API lives under `apps/web/app/api/*/route.ts`. This is the full-stack backend layer inside Next.js.

Important route handlers:

- `/api/dogs` and `/api/dogs/[dogId]` — member dog read/write API, session protected.
- `/api/registry` and `/api/registry/[slug]` — public Registry read model.
- `/api/verify/[code]` — public certificate verification.
- `/api/ecosystem` and `/api/ecosystem/moderation` — owner/admin ecosystem flows.
- `/api/session` and `/api/auth/*` — session/auth boundary.

## Data fetching and mutations

- Server pages fetch repository documents directly where the data is server-only or session-scoped.
- Client forms call API routes or server actions only for mutations.
- Admin moderation uses server actions in `apps/web/app/(admin)/review/actions.ts`.
- Member dog profile mutations use `/api/dogs` and `/api/dogs/[dogId]` through `apps/web/lib/api/dogs.client.ts`.

## Cache boundary rules

1. Session-scoped member/admin routes must stay dynamic.
2. Certificate verification should prioritize freshness over aggressive caching.
3. Public educational content can later receive `revalidate` after CMS/content ownership is finalized.
4. Public Registry and ecosystem pages can later use tag/path revalidation after production release hardening.
5. Auth/session route handlers must never be cached.

## Why this satisfies the Next.js module

- **Pages, Routing and Layout:** App Router route groups separate public, member, and admin surfaces.
- **Client-Side vs. Server-Side Rendering:** Server pages handle protected/read models; client components handle browser-only form and navigation behavior.
- **React Server Components:** Default server pages and server-loaded documents are used across public/member/admin surfaces.
- **Data Fetching and Caching:** Repository reads, route handlers, server actions, and explicit dynamic boundaries are documented.
- **Performance Optimizations:** Client interactivity is isolated; public assets are lazy-loaded where safe; heavy auth/session routes avoid stale cache.
