USG certificate patch repacked.

Copy these files over the repository root.

Includes:
- apps/web/components/certificate-v2-document.tsx
- apps/web/app/certificate-v2.css
- apps/web/lib/vendor/qrcode-terminal/*

Run after copy:
pnpm --filter @cane-corso-platform/web typecheck
pnpm build
pnpm dev
