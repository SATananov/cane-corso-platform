# Mobile Capstone App Workspace

This Expo app presents the Cane Corso Platform through mobile-first Capstone screens while still reading the same shared Next.js API contracts used by the web app.

It covers six reviewer-friendly mobile screens:

1. **Home / Platform Overview** — API health, live data counts and public platform surfaces.
2. **Access / Auth Orientation** — auth/provider strategy, session signal and role boundaries.
3. **My Dogs / Owner Workspace** — member-scoped Cane Corso profiles from `/api/dogs`.
4. **Registry + Verify** — public registry list, registry detail document and certificate lookup.
5. **Knowledge / Care Guide** — responsible ownership, growth tracking, ASK MARK I and regression-insight boundaries.
6. **Profile / Account Context** — member profile context and approved partner signal.

The mobile client remains intentionally lightweight for the Capstone submission. It demonstrates the required multi-platform architecture: Expo / React Native UI, shared TypeScript contract types, and REST-style communication with the Next.js backend.

## Local setup

Set the Expo API base URL before starting the app:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

Use your machine IP instead of `localhost` when testing on a physical phone:

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.25:3000
```

Then start from the repo root or from `apps/mobile`:

```bash
pnpm dev
```

## Expected QA flow

1. Start the Next.js web app and confirm `/api/health` is reachable.
2. Open the Expo app and review the six mobile screen tabs.
3. Check **Home** for API health and platform counts.
4. Check **Access** for auth/provider and session boundary information.
5. Check **My Dogs** for member-scoped Cane Corso profiles.
6. Check **Registry** for published profiles, detail loading and Verify lookup.
7. Check **Knowledge** for owner guidance and safe AI/ML boundaries.
8. Check **Profile** for member profile and partner context.
9. Pull to refresh the mobile workspace after registry, certificate, partner, or ecosystem changes.

## Troubleshooting

- If the app runs on a physical device, `localhost` points to the phone, not your computer. Use the computer LAN IP.
- If every card says unavailable, confirm that the web app is running and `EXPO_PUBLIC_API_BASE_URL` has no trailing slash.
- If session-aware cards are empty but public cards work, the mobile client is reaching the API but does not have a browser cookie session. That is expected until native auth is implemented.
