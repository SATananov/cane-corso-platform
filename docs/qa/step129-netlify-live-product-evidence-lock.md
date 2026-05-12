# Step 129 — Netlify Live Product Evidence Lock

## Status

Prepared after Step 128 — Product Priority Navigation & Demo Data Separation.

This step does not add a new product feature. It locks the live production evidence protocol for the Netlify deployment after the product-priority navigation and controlled demo-data presentation pass.

## Goal

Confirm that the deployed platform can be reviewed as a real product in the browser:

1. Production health endpoint is live.
2. Production runtime database target is the expected Neon database.
3. Guest/public journey opens without 404/500 regressions.
4. Member/owner journey starts with clear priority actions.
5. Admin/reviewer journey starts with clear priority actions and controlled example labels instead of raw demo/test copy.
6. The ML-safe photo assistant remains human-in-the-loop and never presents AI as breed proof.

## Live URL used for review

Default production site:

```text
https://cane-corso-platform.netlify.app
```

If the Netlify site name or custom domain changes, capture the actual production URL in the evidence folder before locking the release.

## Required live checks

### 1. Health endpoints

Open:

```text
/api/health
/api/health/db
```

Expected:

- `/api/health` returns `ok: true`, `environment: production`, and `database: configured`.
- `/api/health/db` returns `ok: true`, `provider: neon`, `activeDatabase: cane_corso_platform`, `activeSchema: public`, and `databaseMatchesExpected: true`.
- Runtime database and migration database both match the expected production database.

### 2. Guest/public product journey

Review:

```text
/
/platform
/registry
/gallery
/certified
/verify
/knowledge
/community
/partners
/faq
/access
```

Expected:

- Pages load without 404/500.
- Copy feels like a real product, not a dev/demo workspace.
- The first visible section explains the module purpose and offers practical action links.
- Language remains consistent for the active locale.

### 3. Member/owner product journey

Review after signing in as a member:

```text
/member
/profile
/my-dogs
/my-dogs/new
```

Expected:

- The user immediately understands where to add a Cane Corso, complete profile details, upload photos, and prepare for USG review.
- Privacy wording remains clear: owner contact/address details are not public by default.
- Priority navigation appears near the top where applicable.

### 4. Admin/reviewer product journey

Review after signing in as an admin:

```text
/review
/admin/registry
/admin/partners
/admin/ecosystem
/admin/knowledge
```

Expected:

- The admin can jump to review queue, photo assistant, and certificate flow from the top of the module.
- Controlled example/demo-like data is presented as a controlled example instead of raw internal test wording dominating the page.
- Photo assistant supports human review and does not claim to prove breed, pedigree, certificate eligibility, or publication rights.

## Evidence to capture

Create screenshots or short notes in:

```text
docs/qa/evidence/step129-netlify-live-product-evidence-lock/
```

Recommended files:

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

## Locked non-goals

This step must not change:

- Registry publication authority.
- Certificate issue/revoke authority.
- Verify lookup logic.
- Gallery backend selection rules.
- Auth/session/cookie security.
- Neon migrations or schema.
- Admin moderation action logic.
- Ecosystem backend moderation logic.
- ML/AI breed-proof behavior.

## Pass criteria

Step 129 is complete when:

- Static QA passes.
- Live `/api/health` and `/api/health/db` are confirmed green.
- Guest, member, and admin journeys have been reviewed in the browser.
- Any obvious production-blocking UI/copy issue is either fixed in a later scoped step or explicitly accepted as non-blocking.
