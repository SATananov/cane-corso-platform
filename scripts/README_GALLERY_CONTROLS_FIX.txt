USG Gallery controls fix

Files changed:
- apps/web/app/globals.css

Fix:
- Thumbnail lightbox triggers are constrained to fixed thumbnail dimensions.
- Gallery actions are placed in a separate footer row with z-index and border separation.
- "Отвори профила" and "Провери" no longer overlap the gallery images.
- The buttons remain clickable and readable on desktop and mobile.

After copying the patch over the project root, run:
pnpm typecheck
pnpm dev
