# Step 108.2.1 — Basic-First Profile Layout Repair

## Status
Prepared as a small UX repair on top of Step 108.2.

## Purpose
Step 108.2 introduced a basic-first Cane Corso profile flow, but the optional section launcher could collapse into a narrow column on the member form. This step repairs only the presentation/layout layer so the progressive options remain readable and calm.

## Scope
- Keep the basic-first profile concept.
- Keep optional sections collapsed by default for new profiles.
- Shorten the optional launcher labels.
- Make the launcher use a stable full-width responsive grid.
- Prevent narrow-column word stacking and button overlap.
- Preserve the USG / FCI / Certificate authority boundary.

## Explicit non-goals
- No Registry authority changes.
- No Certificate issue/revoke changes.
- No Verify lookup changes.
- No Gallery curation changes.
- No Auth/session changes.
- No Neon schema or migration changes.
- No Admin moderation backend changes.

## Browser review checklist
Open `/my-dogs/new` and verify:
- The first visible form is still the basic Cane Corso profile.
- The optional launcher reads as one clean block, not word-by-word vertically.
- Buttons are short and readable: Documents / Story / Location / Pedigree / USG-FCI equivalents per locale.
- No advanced sections are open by default on a new profile.
- The user can save a basic draft without being forced into pedigree, measurement, USG or FCI details.
