# Step 26 — Final Browser QA Checklist

Status: **PASS / READY FOR LOCAL BROWSER VERIFICATION**

Step 26 closes the ecosystem release cycle with one final manual browser checklist. It is a QA/evidence step only and does not unlock product logic, public pages, admin moderation, registry, certificate, gallery, verify, partners, or owner data flows.

## Routes to verify manually

- authenticated member `/ecosystem` owner workspace;
- public ecosystem directory `/community`;
- public ecosystem detail `/community/[slug]`;
- admin ecosystem moderation `/admin/ecosystem`;
- partner directory sanity route `/partners`;
- partner detail sanity route `/partners/[slug]`;
- registry overview `/registry`;
- registry detail `/registry/[slug]`;
- public gallery `/gallery`;
- verify landing `/verify`;
- certificate / verify detail routes `/certificate/[code]` and `/verify/[code]`.

## Browser checklist

### Member owner workspace

- Open `/ecosystem` as a member.
- Confirm the owner safety notice is visible.
- Confirm draft entries are editable.
- Confirm `needs_changes` entries can be edited/resubmitted.
- Confirm `pending_review`, `approved`, and `published` entries are visually locked from owner editing.
- Confirm owner action hints match the listing status.
- Confirm no public/admin controls appear in the member workspace.

### Public ecosystem directory and detail

- Open `/community`.
- Confirm only published public ecosystem listings are visible.
- Open a published listing with “Open details / Отвори детайли”.
- Confirm `/community/[slug]` renders the published profile document.
- Confirm non-public / suggestion slugs still 404 or stay hidden through the existing published-only lookup.
- Confirm `GET /api/ecosystem/[slug]` remains read-only and published-only.

### Admin moderation

- Open `/admin/ecosystem` as admin.
- Confirm moderation controls remain admin-only.
- Confirm pending review, approve, request changes, publish, reject, and archive controls remain status-gated.
- Confirm member resubmit controls are not mixed into admin moderation UI.

## Static QA command

```powershell
pnpm ecosystem:browser-final:qa
```

## Full local verification chain

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

## Checkpoint target

```text
cane-corso-platform_release_candidate_after_step27_ecosystem_cycle.zip
```
