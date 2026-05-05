# Mobile App QA Workspace

This Expo app is a mobile QA bridge for the shared Cane Corso Platform API.

It reads the same Next.js API contracts used by the web app and now covers:

- health and runtime status
- auth/provider strategy
- current session and profile documents
- My Cane Corso session scope
- public registry list
- registry detail document
- certificate / verify lookup
- approved Partners directory
- published Ecosystem directory

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
2. Create or update a Cane Corso profile in the web app.
3. Submit it for review.
4. Approve and publish it from the admin review queue.
5. Issue a certificate only when the profile should have a verify record.
6. Approve at least one partner and one ecosystem listing.
7. Pull to refresh the mobile workspace.
8. Confirm that:
   - the dog appears in **My Cane Corso** with publication metadata
   - the profile appears in **Public registry**
   - selecting it loads **Registry detail**
   - the certificate or verification slug resolves through **Verify bridge** only after a certificate is issued
   - approved partners appear in **Partners bridge**
   - published ecosystem listings appear in **Ecosystem bridge**

## Troubleshooting

- If the app runs on a physical device, `localhost` points to the phone, not your computer. Use the computer LAN IP.
- If every card says unavailable, confirm that the web app is running and `EXPO_PUBLIC_API_BASE_URL` has no trailing slash.
- If session-aware cards are empty but public cards work, the mobile client is reaching the API but does not have a browser cookie session. That is expected for this QA workspace until native auth is implemented.
