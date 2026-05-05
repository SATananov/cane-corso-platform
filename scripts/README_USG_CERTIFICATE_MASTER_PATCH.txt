USG Certificate Master Patch

What this patch does:
- Rebuilds the certificate template into a premium official EN/BG/IT authenticity certificate.
- Top certificate branding uses UNICO SUO GENERE only, not Stefano De Tanini.
- Keeps the handwritten Stefano De Tanini signature in the issuer/signature area.
- Uses an internal SVG QR code generator for Verify, no external QR image service.
- Keeps Owner as a certificate field.
- Clarifies admin UX: certificate photo can be any uploaded profile photo, not necessarily the main/cover image.
- No database migration required.

Where the certificate photo comes from:
1. The owner uploads photos in My Cane Corso -> profile/photos.
2. Admin opens /review or the public Registry profile as admin.
3. In the photo controls, admin clicks “Issue certificate with this photo” / “Издай сертификат с тази снимка”.
4. That exact photo is frozen in the issued certificate snapshot.

Checks run in this environment:
- node scripts/check-workshop-syntax.mjs: PASSED

After applying locally, run:
pnpm --filter @cane-corso-platform/web typecheck
pnpm build
pnpm dev
