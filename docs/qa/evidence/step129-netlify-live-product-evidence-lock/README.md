# Step 129 — Live Netlify Product Evidence

Use this folder to store browser evidence for the deployed production site after Step 128.

## Production URL

```text
https://cane-corso-platform.netlify.app
```

## Required captures

```text
01-health-api.png
02-health-db.png
03-public-registry.png
04-member-my-dogs.png
05-admin-review-priority-nav.png
06-admin-review-photo-assistant.png
07-admin-registry-controlled-example.png
notes.md
```

## Evidence checklist

- `/api/health` returns production `ok` status.
- `/api/health/db` confirms Neon provider, `cane_corso_platform`, `public` schema, and database target match.
- Public pages load without 404/500.
- Member pages show clear priority actions and privacy guidance.
- Admin review page shows priority navigation and controlled example separation.
- Photo assistant remains ML-safe and human-in-the-loop.

Do not store secrets, cookies, full connection strings, private tokens, or real user personal data in screenshots or notes.
