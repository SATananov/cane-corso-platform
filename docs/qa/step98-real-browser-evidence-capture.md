# Step 98 — Real Browser Evidence Capture Protocol

## Purpose

Step 98 turns the Step 97 browser smoke route map into a practical manual evidence workflow. The goal is to make the project easy to review, demonstrate, and hand off after local or Netlify browser testing.

This step does **not** claim that screenshots have already been captured. It defines where screenshots/notes should go, how they should be named, what must be reviewed, and what privacy rules must be followed before evidence is committed or shared.

## Scope

Documentation and QA only.

Step 98 does not change:

- Registry publication logic;
- Certificate issue/revoke logic;
- Verify lookup logic;
- Gallery authority logic;
- Auth/session logic;
- Neon schema and migrations;
- Admin moderation backend;
- Ecosystem authority logic;
- public/member/admin product UI behavior;
- Netlify deployment configuration.

## Evidence folder

Manual browser evidence should be placed here only when intentionally captured:

```txt
docs/qa/evidence/step98-real-browser-evidence/
```

The folder currently contains a README protocol, not real screenshots.

Recommended evidence names:

```txt
01-public-home.png
02-public-platform.png
03-public-registry.png
04-public-registry-detail.png
05-public-gallery.png
06-public-knowledge.png
07-public-faq.png
08-public-community.png
09-public-partners.png
10-access.png
11-verify.png
12-member-center.png
13-member-profile.png
14-member-my-dogs.png
15-member-new-dog.png
16-admin-review.png
17-admin-registry.png
18-admin-ecosystem.png
19-admin-partners.png
20-admin-knowledge.png
21-runtime-db-health.txt
```

## Manual review rules

- Capture public routes before login.
- Capture member routes after member login.
- Capture admin routes after admin login.
- Capture `/api/health/db` after deployment or production-like local setup.
- Confirm `activeDatabase` is `cane_corso_platform` and `status` is `ok` before calling the evidence production-valid.
- Keep screenshots out of clean ZIPs unless intentionally committed as QA evidence.
- Do not include secrets, database URLs, API keys, session cookies, private contact data, or hidden admin-only personal data in screenshots.

## Validation chain

Recommended local validation after this step:

```powershell
pnpm step98:real-browser:evidence:qa
pnpm step97:browser-smoke:evidence:qa
pnpm docs:readme:qa
pnpm release:all:qa
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
```

## Status

Step 98 is a presentation/evidence workflow layer only. It is safe to apply without changing application behavior.
