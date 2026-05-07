# Step 93.1 — Canonical README & Project Documentation Cleanup

Status: prepared

## Goal

Create a single current root `README.md` that explains the Cane Corso Platform as a product and as a full-stack workspace. Remove the root-level patch-note clutter that made the repository look like a temporary patch bundle rather than a stable platform.

## Scope

- Replace the old root README with a canonical project README.
- Document current product surfaces, roles, trust boundaries, privacy model, community matching model, QA commands, deployment flow, and clean ZIP rules.
- Add a README QA guardrail script.
- Archive root-level historical patch notes under `docs/archive/package-notes/`.

## Non-goals

- No Registry authority changes.
- No Certificate / Verify changes.
- No Gallery logic changes.
- No DB schema or migration changes.
- No Neon, Netlify, or secret changes.
- No public UI behavior changes.

## Verification

Run:

```powershell
pnpm docs:readme:qa
pnpm content:authority:qa
pnpm platform:intent-release:qa
pnpm community:match-requests:qa
pnpm workspace:syntax
pnpm typecheck
```

## Expected result

- Root `README.md` is the current source of truth.
- Historical package/patch notes are no longer scattered in the repository root.
- Developer handoff is clearer and less confusing.
