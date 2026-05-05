USG Final Certificate Canvas Patch

Copy these files over the repository root.

Changed/added:
- apps/web/components/certificate-v2-document.tsx
- apps/web/app/certificate-v2.css
- apps/web/public/brand/seal/usg-certified-seal.svg
- apps/web/lib/vendor/qrcode-terminal/*

Run after copy:
pnpm --filter @cane-corso-platform/web typecheck
pnpm build
pnpm dev

This patch treats the certificate as a fixed 1055 x 1491 canvas. Dynamic parts stay: selected admin photo, profile data, QR/Verify URL, certificate number, issue date.
