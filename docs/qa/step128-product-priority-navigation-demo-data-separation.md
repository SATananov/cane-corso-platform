# Step 128 — Product Priority Navigation & Demo Data Separation

Status: PASS-ready static guardrail.

## Purpose

Step 128 turns the live browser feedback into a product rule:

1. every major module must surface the most important action near the top;
2. the top area must provide direct buttons or links to the important sections below;
3. guest, member, and admin flows must feel action-first rather than explanation-first;
4. demo/seed/test wording must not leak into the real production/admin wording as if it were real owner content.

## Scope

This step is UI/copy/QA only. It does not change database schema, auth/session behavior, registry authority, certificate authority, Verify logic, gallery eligibility, admin moderation actions, ecosystem backend logic, or ML/AI breed-proof behavior.

## Implementation

- `PageShell` now renders a reusable `module-priority-nav` block directly after the hero when a page has cards, linked hero chips, or help targets.
- The priority nav is localized by the visible module copy and shows:
  - module focus;
  - primary action;
  - quick section links.
- Review page hero chips now jump to real admin sections: pending queue, photo assistant, and certificate flow.
- My Dogs and Add Cane Corso pages now include the role-aware action panel at the top of the member journey.
- Community and Knowledge public pages now include the role-aware action panel for guest/member clarity.
- Demo-like records are not changed in the database, but admin presentation sanitizes obvious seed/test wording into controlled example wording.
- Demo-like records get a small controlled-example badge so the admin understands what they are without the page looking like a development environment.

## Browser review expectation

After deploy, check:

- public pages show a clear top action or quick section rail;
- member pages start from owner actions, not long explanations;
- admin review has direct section jumps and demo/test wording no longer dominates live screenshots;
- demo data, if still present in Neon, appears as a controlled example rather than raw `SoftUni demo`, `testing`, or `Seeded by Step...` language.
