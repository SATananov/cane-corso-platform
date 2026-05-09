# Step 103 — USG Growth & Measurement Assistant

Status: local patch prepared / QA guardrail added

## Purpose

Step 103 converts the notebook experiments into a safe product layer inside the platform:

- age-aware Cane Corso growth orientation;
- temporary owner-entered measurements;
- weight, height, body, chest, head, and muzzle/skull checks;
- USG-style explanation that this is an educational assistant, not an automatic judging system.

## Product behavior

The assistant appears in the member Cane Corso form flow after the main profile form. It uses the current profile base data:

- Cane Corso name;
- sex;
- birth date;
- color.

The user can enter temporary measurements locally:

- weight in kg;
- height at withers in cm;
- body length in cm;
- chest circumference in cm;
- head length in cm;
- muzzle length in cm;
- skull length in cm.

Nothing is saved to the database in this step. This keeps Step 103 safe while still proving the platform value: the user uploads/enters profile data and immediately receives meaningful orientation.

## Calculation model

The helper uses deterministic ranges, not a hidden AI model:

- puppy growth reference from the notebook experiments for months 1–12;
- adult standard orientation by sex;
- body length orientation: height at withers + about 11%;
- head length orientation: about 36% of height at withers;
- muzzle/skull orientation: about 1:2.

This is intentionally positioned as a USG assistant. It does not approve, reject, certify, diagnose, or replace admin review.

## Safety copy

The UI must clearly state that the output is:

- not a veterinary diagnosis;
- not a DNA test;
- not an automatic official judging decision;
- not a replacement for a human admin/USG review.

## Boundaries preserved

Step 103 must not change:

- Neon schema or migrations;
- Auth/session logic;
- Registry publication authority;
- Certificate issue/revoke authority;
- Verify lookup authority;
- Gallery authority;
- Admin moderation backend logic;
- Ecosystem authority logic;
- Netlify deployment configuration.

## QA commands

```bash
pnpm step103:growth-measurement:qa
pnpm workspace:syntax
pnpm typecheck
```

In sandbox environments without installed dependencies, run the Node QA script directly:

```bash
node scripts/qa-step103-growth-measurement-assistant.mjs
```
