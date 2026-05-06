# Step 85.2 — Owner Image Payload Guardrail

Status: prepared

## Purpose

The owner add/edit Cane Corso form now keeps selected profile and pedigree photos lightweight before sending the profile save/review request. This prevents oversized base64 image payloads from making the runtime API return a non-JSON platform error while keeping the current form-first UX intact.

## Scope

Touched only owner/member form copy and client-side image payload preparation:

- `apps/web/lib/image-payload.client.ts`
- `apps/web/components/dog-profile-form.tsx`
- `apps/web/components/pedigree-editor.tsx`
- `apps/web/components/my-dog-form-workspace.tsx`
- `apps/web/lib/i18n.ts`
- `scripts/qa-owner-image-payload-guardrail.mjs`
- `package.json`

## Guardrails

No Registry, Certificate, Verify, Gallery, Ecosystem, Auth/session, Neon target, migration, or admin approval backend logic was changed.

## QA

Run:

```bash
pnpm owner:image-payload:qa
pnpm owner:form-polish:qa
pnpm owner:form-first-ux:qa
pnpm owner:cane-first-ux:qa
pnpm db:target:qa
pnpm deploy:netlify:qa
pnpm workspace:syntax
pnpm typecheck
```

## Expected runtime behavior

- Selecting profile photos prepares smaller WebP profile copies.
- Selecting pedigree photos prepares smaller WebP ancestor copies.
- Saving an existing profile with older large data-URL photos compacts them before the API mutation.
- If Netlify/platform still returns a non-envelope response, the owner sees a clearer localized message instead of only a technical API payload message.
