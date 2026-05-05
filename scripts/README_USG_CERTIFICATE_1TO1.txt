USG Certificate 1:1 final visual patch

Changed files:
- apps/web/components/certificate-v2-document.tsx
- apps/web/app/certificate-v2.css

What this patch does:
- Locks the certificate screen to the approved 1055x1491 master certificate canvas.
- Keeps the approved EN/BG/IT title structure.
- Keeps the selected admin certificate photo as the certificate image.
- Keeps QR Verify.
- Keeps Owner / Собственик / Proprietario.
- Changes the seal language away from Registry logic toward Cane Corso Certified.
- Prevents the responsive mode from squeezing the certificate and breaking the title/signature.

No DB migration.
No change to admin photo selection flow.
No change to Certified public section logic.
