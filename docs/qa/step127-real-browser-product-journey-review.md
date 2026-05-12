# Step 127 — Real Browser Product Journey Review

Status: PASS / LOCK candidate after local browser review and `pnpm typecheck`.

## Purpose

Step 127 turns the current Step 126 clean checkpoint into a practical browser/product journey review layer.

The goal is not to add another major feature. The goal is to verify that the platform behaves like a real product when opened in a browser by:

- a public visitor;
- a registered member / owner;
- an admin reviewer.

This step gives QA and handoff a concrete route-by-route checklist for product clarity, language, trust boundaries, and evidence capture.

## Scope

This step is documentation and static QA only.

It adds:

- a product journey checklist for guest, member, and admin flows;
- a Step 127 QA script that verifies route coverage, evidence protocol, package registration, and release QA registration;
- an evidence folder README for manual screenshots/notes when real browser review is performed.

## Explicit non-goals

Step 127 does not change:

- Registry publication logic;
- Certificate issue/revoke logic;
- Verify lookup logic;
- Gallery selection logic;
- Admin moderation actions;
- Auth/session behavior;
- DB schema or migrations;
- ecosystem matching backend logic;
- ML/AI breed-proof behavior.

## Browser journey coverage

### Guest / public visitor

A guest should understand what USG is, what can be checked publicly, and where to continue.

Required routes:

- `/`
- `/platform`
- `/registry`
- `/registry/[published-slug]`
- `/gallery`
- `/certified`
- `/verify`
- `/verify/[code]`
- `/certificate/[code]`
- `/knowledge`
- `/knowledge/[slug]`
- `/community`
- `/community/[slug]`
- `/partners`
- `/partners/[slug]`
- `/faq`
- `/access`
- `/api/health/db`

Review expectations:

- The visitor understands the difference between Registry, Certificate, Verify, Gallery, Knowledge, Community, and Partners.
- Public pages do not expose private owner contact data.
- Public copy uses product language, not development or workflow language.
- Verify and Certificate pages do not imply that USG replaces pedigree, FCI, vets, judges, or official kennel systems.
- Community and Partners explain review/mediation without exposing sensitive direct contacts.

### Member / owner

A member should understand what to do next after sign-in.

Required routes:

- `/member`
- `/profile`
- `/my-dogs`
- `/my-dogs/new`
- `/my-dogs/[dogId]/edit`
- `/my-dogs/[dogId]/media`
- `/my-dogs/[dogId]/health`
- `/ecosystem`
- `/partners/apply`

Review expectations:

- The member sees clear next actions before dense explanation.
- Owner profile and Cane Corso profile are not confused.
- My Cane Corso explains profile data, photos, pedigree/family context, health/growth, and USG review readiness.
- Photo readiness and Standard Match stay orientation-only.
- The member understands what can become public and what remains private/admin-only.

### Admin / reviewer

An admin should understand what needs review and what is a human decision.

Required routes:

- `/review`
- `/admin`
- `/admin/members`
- `/admin/registry`
- `/admin/partners`
- `/admin/ecosystem`
- `/admin/knowledge`

Review expectations:

- The review queue keeps profile readiness, photo support, human labels, and final decisions separate.
- The ML-safe assistant helps with photo/view readiness only.
- The assistant never proves breed, Registry eligibility, or Certificate eligibility.
- Sensitive community match requests remain admin-mediated.
- Admin routes stay protected by session/role boundaries.

## Evidence capture

Manual browser evidence belongs in:

```txt
docs/qa/evidence/step127-real-browser-product-journey-review/
```

The folder currently contains a README protocol only. It should not contain screenshots unless a real browser review was intentionally captured.

Recommended evidence names:

```txt
01-guest-home.png
02-guest-platform.png
03-guest-registry.png
04-guest-registry-detail.png
05-guest-gallery.png
06-guest-certified.png
07-guest-verify.png
08-guest-knowledge.png
09-guest-community.png
10-guest-partners.png
11-guest-faq.png
12-access.png
13-runtime-db-health.txt
14-member-dashboard.png
15-member-profile.png
16-member-my-dogs.png
17-member-new-dog.png
18-member-dog-edit.png
19-member-dog-media.png
20-member-dog-health.png
21-member-ecosystem.png
22-partner-apply.png
23-admin-review.png
24-admin-registry.png
25-admin-members.png
26-admin-partners.png
27-admin-ecosystem.png
28-admin-knowledge.png
```

Evidence must not include secrets, database URLs, API keys, session cookies, private owner contact data, or hidden admin-only personal data.

## PASS criteria

Step 127 passes when:

- all route groups are represented in this document;
- the evidence protocol exists;
- the Step 127 QA script is registered in `package.json`;
- full-stack release QA requires and runs the Step 127 QA script;
- protected authority files remain present;
- no unsafe AI/breed-proof or automatic approval language is introduced;
- workspace syntax and local typecheck pass after applying.

## Validation

Recommended local validation:

```powershell
pnpm step127:browser-product-journey:qa
pnpm step126:admin-ml-safe-review-assistant:qa
pnpm step125:real-user-production-readiness:qa
pnpm workspace:syntax
pnpm release:fullstack-final:qa
pnpm typecheck
```
