USG Certificate Premium Patch v2

Apply:
1. Extract this ZIP over the root folder of the cane-corso-platform project.
2. Allow overwrite for the included files.
3. Run:
   pnpm typecheck
   pnpm dev

Changed files:
- apps/web/app/certificate-v2.css
- apps/web/components/certificate-v2-document.tsx
- apps/web/components/certificate-print-button.tsx
- apps/web/tsconfig.json

What this patch does:
- Rebuilds the certificate layout to be closer to the premium reference.
- Moves the seal into a clean lower-right zone so it no longer covers dates or field text.
- Uses the premium certificate seal PNG.
- Uses the Stefano De Tanini signature image instead of a text-only signature.
- Keeps the signature in a separate lower-left signing block.
- Keeps the certificate A4 print-ready.
- The print/save button opens the browser print dialog; users can choose "Save as PDF" locally on their device.
- Sets a clean browser print title like USG-Certificate-USG-BG-2026-000147.
- Includes the TypeScript compatibility fix: ignoreDeprecations 6.0 -> 5.0.
