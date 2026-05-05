# Step 28.1 — Knowledge Center Browser Visual Polish

Status: PASS / LOCK after static QA, pending user browser review.

## Reason

The first browser screenshot of `/knowledge` showed that the new Knowledge Center content was correct, but the page felt too narrow and miniature on desktop. There was too much empty side space, the cards read small, and the visual weight did not match the premium USG direction.

## Safe scope

Changed only the Knowledge page visual shell and related QA documentation:

- `apps/web/components/page-shell.tsx`
- `apps/web/app/(public)/knowledge/page.tsx`
- `apps/web/app/globals.css`
- `scripts/qa-cane-corso-knowledge-center-visual-polish.mjs`
- `docs/qa/step28-1-knowledge-center-browser-visual-polish.md`
- `package.json` script registration

locked sections remain untouched: Registry, Certificate, Gallery, Verify, Admin moderation, Ecosystem APIs, dog publishing, owner workspace persistence, and certificate rendering.

## What changed visually

- Added a safe `variant="knowledge"` option to `PageShell`.
- Widened the Knowledge page shell to `min(1560px, calc(100% - 32px))`.
- Increased hero breathing room, title scale, description scale, and visual frame presence.
- Increased card padding and minimum card height for better desktop readability.
- Improved Knowledge section spacing, fact-grid density, source-card layout, and timeline readability.
- Added large-screen rules for better use of desktop width.
- Kept responsive behavior for tablet/mobile.

## QA command

```powershell
pnpm knowledge:center:visual:qa
```

Expected result:

```text
Step 28.1 Knowledge Center visual QA complete. Browser visual polish is ready for review.
```

## Browser review checklist

Open `/knowledge` and verify:

- The page no longer feels like a small card floating in too much empty space.
- Hero, cards, timeline, standard facts, health, owner guide, and source sections use more desktop width.
- Text is easier to read without changing the locked header or other public pages.
- BG / EN / IT remain consistent.
- Dark and Heritage/light themes remain readable.

## Lock note

This is a scoped visual correction after browser evidence. It does not change the Step 28 content model or ecosystem/registry logic.
