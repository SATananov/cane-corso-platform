# Step 27 — Ecosystem Release Candidate Clean ZIP

Status: **PASS / READY FOR FINAL CLEAN CHECKPOINT**

Step 27 converts the locked ecosystem cycle into a release-candidate clean checkpoint.

This step is documentation and QA only. It should not modify product logic, public pages, admin moderation behavior, registry, certificate, gallery, verify, partners, or owner data flows.

## Locked chain

```text
Step 18 — PASS / LOCK
Step 19 — PASS / LOCK
Step 20 — PASS / LOCK
Step 21 — PASS / LOCK
Step 22 — PASS / LOCK
Step 23 — PASS / LOCK
Step 24 — PASS / LOCK
Step 25 — PASS / LOCK
Step 26 — FINAL BROWSER QA CHECKLIST READY
Step 27 — RELEASE CANDIDATE CLEAN ZIP READY
```

## Clean checkpoint rules

The clean ZIP must exclude `node_modules`, `.next`, `.turbo`, `.expo`, `.git`, `.vercel`, `dist`, `build`, `coverage`, `.env`, `.env.local`, logs, nested ZIPs, and `*.tsbuildinfo`.

## Final static QA command

```powershell
pnpm ecosystem:release-candidate:qa
```

## Full final local verification chain

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

## Outcome

If the full chain passes locally and browser evidence is clean, the ecosystem release cycle is closed and the platform can move to the next product area instead of continuing guardrail-only steps.

Checkpoint target:

```text
cane-corso-platform_release_candidate_after_step27_ecosystem_cycle.zip
```
