# Step 9 — Checkpoint Hygiene + Guardrails

## Goal

Create a clean, repeatable checkpoint process without touching locked product sections.

## What this step adds

- `scripts/create-clean-checkpoint.ps1`
- `pnpm checkpoint:zip`
- `docs/architecture/locked-sections-step8.md`
- this QA checklist
- stronger ignore rules for generated artifacts

## Clean checkpoint command

From the repository root:

```powershell
pnpm checkpoint:zip -- -ZipName cane-corso-platform_clean_after_step9_checkpoint_hygiene.zip
```

The generated ZIP is created next to the project folder by default.

## Excluded from checkpoint ZIP

- `node_modules`
- `.next`
- `.turbo`
- `.expo`
- `.git`
- `.env`, `.env.local`, `.env.*.local`
- `*.tsbuildinfo`
- `*.log`
- `*.zip`
- build/cache folders such as `dist`, `build`, `out`, `coverage`, `.vercel`, `.cache`
- old handoff patch-note TXT files by default

Use `-IncludePatchNotes` only when preserving old handoff notes is intentional.

## Safe verification sequence after applying Step 9

```powershell
pnpm workspace:verify
pnpm workspace:syntax
pnpm typecheck
pnpm requirements:qa
pnpm workflow:qa
pnpm ecosystem:qa
```

## Locked-section rule

Step 9 must not change runtime files inside the already locked public/member/admin flows. See:

```text
docs/architecture/locked-sections-step8.md
```
