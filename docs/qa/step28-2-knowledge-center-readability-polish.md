# Step 28.2 — Knowledge Center Readability + Bulgarian Language Polish

Status: **PASS / LOCK**

Bulgarian language polish: completed.
locked sections remain untouched.

## Why this step exists

Browser screenshots after Step 28.1 showed that `/knowledge` had the right premium width and content depth, but still needed a readability pass:

- hero title was too large and too tightly stacked in Bulgarian;
- several cards mixed Bulgarian with English product/editorial wording;
- repeated same-anchor card actions added visual noise;
- timeline and temperament cards felt dense on desktop widths;
- section titles needed better line-height and balanced wrapping.

## Scope

Step 28.2 is limited to the Knowledge page presentation and copy polish:

- shortened and localized the Bulgarian hero title and major card copy;
- added Bulgarian source-card descriptions for the BG locale;
- removed repeated same-page `Отвори` links from the hero cards;
- added scoped Knowledge-only CSS overrides for title fit, line-height, balanced wrapping, card title typography, timeline density, and sticky-header scroll margin.

## Safety boundary

Locked sections remain untouched:

- Registry;
- Registry detail;
- Certificate;
- Verify;
- Gallery;
- My Cane Corso;
- Community / ecosystem logic;
- Admin moderation logic;
- Partner flows.

This is a visual/readability + BG copy polish only.

## QA

Run:

```powershell
pnpm knowledge:center:readability:qa
pnpm knowledge:center:visual:qa
pnpm knowledge:center:qa
pnpm ecosystem:release-candidate:qa
pnpm workspace:syntax
```

Expected result: all pass.

