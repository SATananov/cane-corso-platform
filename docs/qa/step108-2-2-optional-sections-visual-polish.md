# Step 108.2.2 — Optional Sections Visual Polish

Status: prepared for local browser review.

## Purpose

This step polishes the optional section launcher on the add/edit Cane Corso profile flow after the basic-first UX and layout repair. The goal is to keep the new owner experience calm while making the optional actions feel premium, readable, and easy to choose.

## Scope

- Refines the optional launcher copy and button structure.
- Adds short subtitles for each optional section.
- Replaces the small stacked “open” look with premium action cards and a compact state badge.
- Keeps the basic profile first and all advanced sections collapsed until chosen.
- Preserves the USG / FCI / measurement / review tools behind the optional section flow.

## Boundaries

No changes intended to:

- Registry authority logic.
- Certificate issue/revoke behavior.
- Verify lookup.
- Gallery curation.
- Auth/session.
- Neon schema or migrations.
- Admin moderation backend.
- FCI/USG scoring engines.

## Browser review focus

Open `/my-dogs/new` and confirm:

- The “По избор / Добави още, когато си готов” block is readable.
- The title and paragraph are not cramped.
- Optional cards have clear labels and helper text.
- “Отвори/Скрий” appears as a small state badge, not as heavy button text.
- No advanced form is forced open for a clean new profile.
