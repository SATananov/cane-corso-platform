# Ecosystem Next Build Plan

Status: **post-release planning guardrail**

This document defines the safe direction after the ecosystem release layer reached **PASS / LOCK**.

## Current locked foundation

The ecosystem release layer is stable after Step 18:

- automated QA suite passed locally;
- Step 13 manual browser evidence passed;
- `/ecosystem` member owner workspace passed with seeded lifecycle states;
- `/admin/ecosystem` moderation lifecycle passed;
- `/community` public ecosystem visibility passed;
- `/partners` partner directory sanity check passed;
- Step 18 aligned release docs with the real browser evidence route semantics.

## Non-negotiable rule for the next work

Do not redesign or refactor locked visual/product surfaces while starting the next module.

Locked surfaces:

- Registry
- Registry detail
- Certificate
- Verify logic
- My Cane Corso
- Gallery
- `/community`
- `/partners`
- `/partners/[slug]`
- `/review`
- `/admin/partners`
- `/admin/ecosystem`

Any future change in these areas must be intentional, small, explained, and followed by the full regression suite.

## Recommended next build slices

### Option A — Ecosystem detail pages

Add a dedicated public detail page for published ecosystem listings, without changing the existing `/community` listing layout.

Candidate route:

```text
/community/[slug]
```

Safe first scope:

- read-only public detail page;
- only `published` listings visible;
- no new moderation logic;
- no change to `/community` card design unless explicitly required;
- no change to Partner detail pages.

### Option B — Owner submission editing hardening

Improve the member-side edit/resubmit path for draft and needs-changes ecosystem submissions.

Safe first scope:

- keep the current `/ecosystem` layout;
- make validation and status messaging clearer;
- preserve lifecycle rules;
- no public visibility changes.

### Option C — Admin evidence export/checklist helper

Add a small documentation/QA helper so future releases can record browser evidence more consistently.

Safe first scope:

- docs/script only;
- no UI changes;
- no database changes.

## Recommended Step 20

The safest next implementation step is **Option A — Ecosystem detail pages**, because it adds useful public product depth while keeping the locked directory surfaces stable.

Recommended Step 20 scope:

```text
Step 20 — Public Ecosystem Detail Page Foundation
```

Target:

- `/community/[slug]` read-only page;
- server-side lookup by slug;
- published-only access;
- 404 for draft, pending review, needs changes, approved-only, and suggestions;
- no write actions;
- no admin workflow changes;
- no changes to Registry, Certificate, Verify, My Cane Corso, Gallery, Partner pages, or admin moderation pages.

## QA expectation for Step 20

Minimum checks before any Step 20 lock:

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm ecosystem:qa
pnpm ecosystem:lifecycle:qa
pnpm ecosystem:admin:qa
pnpm ecosystem:manual:qa
pnpm ecosystem:manual:db:qa
pnpm ecosystem:release:qa
pnpm ecosystem:postrelease:qa
pnpm typecheck
```

Manual browser evidence should include:

- `/community` still shows the published Step 16 listing only;
- `/community/[published-slug]` opens for the published listing;
- non-public seed slugs do not open publicly;
- `/partners` still behaves as partner directory sanity check;
- `/admin/ecosystem` moderation controls remain unchanged;
- `/ecosystem` member lifecycle workspace remains unchanged.


## Completed Step 21

Step 21 polished the public ecosystem detail navigation and safety copy while preserving the same published-only boundary.

## Recommended Step 22

The next safest implementation step is a read-only public API companion for the already locked detail page.

```text
Step 22 — Public Ecosystem Detail API Guardrails
GET /api/ecosystem/[slug]
```

Target:

- return the same `EcosystemProfileDocument` used by `/community/[slug]`;
- keep `status = published`;
- keep `submissionChannel != community_suggestion`;
- return a safe 404 error envelope for non-public seed slugs;
- no write actions;
- no member workspace access;
- no admin moderation access;
- no visual changes to locked public surfaces.

Minimum checks before any Step 22 lock:

```powershell
pnpm ecosystem:detail:api:qa
pnpm ecosystem:detail:polish:qa
pnpm ecosystem:detail:qa
pnpm ecosystem:postrelease:qa
pnpm ecosystem:release:qa
pnpm workspace:syntax
pnpm typecheck
```

## Step 22 — Public Ecosystem Detail API Guardrails

`GET /api/ecosystem/[slug]` mirrors the public `/community/[slug]` profile using a read-only public API.

The API must only expose published, non-suggestion ecosystem profile documents.

## Step 23 — Ecosystem Detail API Release Alignment

Step 23 aligns release readiness and post-release guardrails with the Step 22 read-only public API boundary.

This is a documentation and QA-only pass. It does not unlock owner workspace, admin moderation, Registry, Gallery, Certificate, Verify, Partners, or My Cane Corso surfaces.

## Recommended Step 24

The safest next implementation step after Step 23 is the owner-side draft / needs-changes resubmit boundary.

```text
Step 24 — Ecosystem Owner Submission Resubmit Guardrails
```

Target:

- keep the current `/ecosystem` owner workspace layout unchanged;
- verify that only `draft` and `needs_changes` entries are editable by the owner;
- verify that resubmit returns a listing to `pending_review`;
- verify that stale review and publication fields are cleared on resubmit;
- verify that `pending_review`, `approved`, and `published` entries stay locked from owner editing;
- verify that public `/community`, `/community/[slug]`, and `GET /api/ecosystem/[slug]` remain published-only and non-suggestion;
- verify that admin moderation remains separate from owner actions.

Step 24 does not change `/community`, `/community/[slug]`, public API, admin moderation, Registry, Gallery, Certificate, Verify, Partners, or My Cane Corso.

Minimum checks before any Step 24 lock:

```powershell
pnpm ecosystem:owner-resubmit:qa
pnpm ecosystem:api-release:qa
pnpm ecosystem:detail:api:qa
pnpm ecosystem:detail:polish:qa
pnpm ecosystem:detail:qa
pnpm ecosystem:postrelease:qa
pnpm ecosystem:release:qa
pnpm workspace:syntax
pnpm typecheck
```

## Step 24 — Ecosystem Owner Submission Resubmit Guardrails

Step 24 records the owner-side resubmit guardrail as a QA-only pass.

It confirms that drafts and returned entries remain editable, reviewed/public states remain locked, and public/admin boundaries from Steps 18–23 remain unchanged.



## Step 25 — Ecosystem Owner Workspace UX Safety Polish

Step 25 is the next safe owner-workspace polish after the Step 24 resubmit guardrail.

Target:

- improve member clarity inside `/ecosystem` only;
- add a safety notice explaining editable vs locked states;
- add status-specific guidance for `draft`, `needs_changes`, `pending_review`, `approved`, and `published` owner entries;
- preserve the existing edit boundary where only `draft` and `needs_changes` entries can be changed by the owner;
- avoid any public visibility, admin moderation, registry, certificate, gallery, verify, partner, or public ecosystem detail changes.

Minimum checks before any Step 25 lock:

```powershell
pnpm ecosystem:owner-workspace:ux:qa
pnpm ecosystem:owner-resubmit:qa
pnpm ecosystem:api-release:qa
pnpm ecosystem:detail:api:qa
pnpm ecosystem:detail:polish:qa
pnpm ecosystem:detail:qa
pnpm ecosystem:postrelease:qa
pnpm ecosystem:release:qa
pnpm workspace:syntax
pnpm typecheck
```

## Step 26 — Final Browser QA Checklist

Step 26 closes the ecosystem release cycle with a final manual browser QA checklist and a static guardrail command.

Minimum checks before any Step 26 lock:

```powershell
pnpm ecosystem:browser-final:qa
pnpm ecosystem:owner-workspace:ux:qa
pnpm ecosystem:owner-resubmit:qa
pnpm ecosystem:api-release:qa
pnpm ecosystem:detail:api:qa
pnpm ecosystem:detail:polish:qa
pnpm ecosystem:detail:qa
pnpm ecosystem:postrelease:qa
pnpm ecosystem:release:qa
pnpm workspace:syntax
pnpm typecheck
```

## Step 27 — Ecosystem Release Candidate Clean ZIP

Step 27 is the clean release-candidate checkpoint for the locked ecosystem cycle.

Final checkpoint target:

```text
cane-corso-platform_release_candidate_after_step27_ecosystem_cycle.zip
```

Minimum checks before release-candidate lock:

```powershell
pnpm ecosystem:browser-final:qa
pnpm ecosystem:release-candidate:qa
pnpm ecosystem:owner-workspace:ux:qa
pnpm ecosystem:owner-resubmit:qa
pnpm ecosystem:api-release:qa
pnpm ecosystem:detail:api:qa
pnpm ecosystem:detail:polish:qa
pnpm ecosystem:detail:qa
pnpm ecosystem:postrelease:qa
pnpm ecosystem:release:qa
pnpm workspace:syntax
pnpm typecheck
```
