# Step 111.2 — USG Platform Origin Story

## Purpose

Step 111.2 adds a second optional written chapter to the full `/heritage` page explaining how Stefan Tananov's personal Cane Corso path became the idea for the USG platform.

The story remains hidden behind an explicit visitor action, so the page stays visual and premium first. Visitors who want deeper context can open the platform-origin chapter separately from the personal `di Casa Tananov` story.

## Product intent

The copy explains that after years with Cane Corso, Stefan saw that information existed but was scattered across articles, posts, opinions, and isolated publications. The USG idea became a complete Cane Corso ecosystem: breed knowledge, owner guidance, dog profiles/history, growth and health tracking, vaccines, services, clinics, hotels/boarding, shops, pet-friendly places, partners, and community usefulness.

It also explains why Stefan decided to learn how to build online systems: he wanted other owners to avoid discovering everything only through trial, error, scattered research, and hard personal experience.

## Boundary

This is a content/UX-only step.

No changes were made to:

- Registry authority logic
- Certificate or Verify logic
- Gallery logic
- Admin authority logic
- Auth/session logic
- DB schema or migrations
- Step 109 Health API/model
- Step 110 member dashboard behavior
- Step 111/111.1 heritage archive images

## QA

Run:

```bash
pnpm step111-2:usg-platform-origin:qa
pnpm step111-1:usg-heritage-story:qa
pnpm step111:usg-heritage:qa
pnpm workspace:syntax
pnpm typecheck
```
