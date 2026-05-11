# Step 121 — Admin Photo Review Assistant & Human Labels Foundation

Status: PASS-ready foundation.

## Purpose

Step 121 adds an admin-facing photo review assistant panel inside the review queue. It helps the admin label owner photos as good, usable, poor, wrong angle, or missing view while keeping the admin decision as the source of truth.

## Scope

- Adds `AdminPhotoReviewAssistantPanel`.
- Integrates it before the existing owner media controls in Admin Review.
- Keeps Registry visibility, USG Gallery selection, Certificate issuance, and publication logic unchanged.
- Does not add a real AI model.
- Does not claim that photos prove breed, pedigree, Registry approval, or Certificate eligibility.

## Guardrails

- Assistant suggestion and admin label are separate concepts.
- Admin label remains the human-in-the-loop decision.
- Registry and Certificate remain separate USG-controlled outcomes.
