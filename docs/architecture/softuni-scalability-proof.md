# SoftUni Scalability Proof

This document records the Capstone-oriented scalability layer for Cane Corso Platform.

The SoftUni assignment asks the project to demonstrate scalable behavior with large datasets, paging, indexes, and a clear validation path. The platform now includes a dedicated scalability seed and server-side paging support for the public ecosystem directory.

## What is implemented

- `pnpm softuni:scalability:seed` generates **10,000 deterministic ecosystem listings**.
- The seed is safe to re-run because records use deterministic slugs and `ON CONFLICT (slug)` upsert behavior.
- The generated records use the existing `ecosystem_listings` table, so the proof validates a real product table instead of a detached mock file.
- The public ecosystem API supports query parameters:
  - `/api/ecosystem?page=1&pageSize=24`
  - `/api/ecosystem?page=2&pageSize=24`
- The repository layer applies `limit` and `offset` when pagination parameters are present.
- Existing migrations already include indexes for ecosystem status, type, owner profile and submission channel.

## Commands

Run normal demo seed first, because the scalability dataset uses the SoftUni partner profile as owner:

```powershell
pnpm demo:seed:softuni
```

Then seed the generated dataset:

```powershell
pnpm softuni:scalability:seed
```

Run the final SoftUni readiness QA:

```powershell
pnpm step134-5:softuni-final:qa
```

## Notes

The generated records are not real Cane Corso businesses or real community listings. They are deterministic data used to validate paging, indexed reads, and large-directory behavior for the Capstone assessment.

This proof is intentionally attached to the ecosystem directory because that surface is naturally list-heavy and benefits most from paging under a large number of entities.
