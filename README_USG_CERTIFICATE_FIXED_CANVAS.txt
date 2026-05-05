USG Certificate Fixed Canvas Patch

Copy these files over the repository root.

Changed:
- apps/web/components/certificate-v2-document.tsx
- apps/web/app/certificate-v2.css

Included if needed:
- apps/web/lib/vendor/qrcode-terminal/*

After copy:
pnpm --filter @cane-corso-platform/web typecheck
pnpm build
pnpm dev
