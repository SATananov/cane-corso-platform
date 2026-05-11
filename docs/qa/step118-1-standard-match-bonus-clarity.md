# Step 118.1 — USG Standard Match Bonus Clarity

## Purpose

Step 118.1 refines the owner-facing “Провери за истинско” flow so it reads as a voluntary owner bonus and not as a mandatory or automatic breed decision.

The result is now positioned as **USG Standard Match**: a percentage-based comparison with a standard Cane Corso profile / USG orientation model.

## User-facing meaning

The button can remain emotional and simple:

- “Провери за истинско”

Inside the flow, the result is professional and safe:

- “USG Standard Match”
- “Сравнение със стандартен Cane Corso профил”
- “Процентът показва визуално и измеримо съответствие”

## Guardrail

The percentage is **not** a breed proof, purity verdict, certificate, registry decision or pedigree proof. It only explains how the available profile data, photos and measurements compare against the standard-oriented checklist.

Final USG review, Registry publication and Certificate decisions remain human-controlled.

## UX changes

- Added voluntary bonus framing.
- Renamed the score label to `USG Standard Match`.
- Added a user-facing explanation for how to read the percentage.
- Added five match levels:
  - 0–39%: insufficient data
  - 40–59%: partial match
  - 60–74%: good initial match
  - 75–89%: strong match
  - 90–100%: very strong match, human confirmation needed
- Added a score guide mini-card.
- Updated the photo evidence guide so the three-photo set is framed as the comparison sample for the standard template.

## Scope

Changed owner-facing UI/copy/CSS/QA only.

No DB schema, migrations, Auth/session, Registry authority, Certificate/Verify logic, Gallery backend, Admin backend, Ecosystem backend, or health migration logic was changed.

## Verification

Run:

```bash
pnpm step118-1:standard-match-bonus:qa
pnpm step118:photo-evidence:qa
pnpm step117:authenticity-check:qa
pnpm workspace:syntax
pnpm typecheck
```
