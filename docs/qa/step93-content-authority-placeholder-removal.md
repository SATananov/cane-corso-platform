# Step 93 — Content Authority & Placeholder Removal

## Purpose

Step 93 turns visible public and member-facing copy from a working-platform tone into finished product content. It focuses on the Cane Corso Knowledge layer, public page wording, owner preview empty states, and community orientation text.

## Scope

- Expand the Bulgarian Cane Corso history article with complete, source-backed, owner-friendly content.
- Remove public Step/release labels from Knowledge article badges.
- Replace future/placeholder wording with current, finished product copy.
- Hide empty Knowledge category cards from the public reading-zone grid.
- Keep Registry, Certificate, Verify, Gallery, Ecosystem authority logic, DB, Neon, and Netlify settings unchanged.

## Source discipline

The history and standard content remains anchored to official or high-trust references already used by the platform:

- FCI Standard N°343 — Cane Corso Italiano
- FCI breed nomenclature — Cane Corso Italiano (343)
- American Kennel Club breed information
- AKC/FCI/club references already present in the Knowledge source list

## Guardrails

- Knowledge content is educational.
- It does not replace veterinary advice, legal advice, judge education, kennel-club documents, or admin certificate decisions.
- Registry publication and USG certificate authority stay separate.
- Community matching and sensitive contact mediation stay admin-controlled.

## Local validation

Run:

```bash
pnpm content:authority:qa
pnpm platform:intent-release:qa
pnpm community:match-requests:qa
pnpm workspace:syntax
pnpm typecheck
```
