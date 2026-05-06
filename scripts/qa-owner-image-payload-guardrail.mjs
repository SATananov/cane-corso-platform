#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const checks = [];

function pass(message) {
  checks.push({ ok: true, message });
  console.log(`PASS ${message}`);
}

function fail(message) {
  checks.push({ ok: false, message });
  console.error(`FAIL ${message}`);
}

function file(pathname) {
  const full = join(root, pathname);
  if (!existsSync(full)) {
    fail(`${pathname} exists`);
    return '';
  }
  pass(`${pathname} exists`);
  return readFileSync(full, 'utf8');
}

function includes(source, needle, message) {
  if (source.includes(needle)) {
    pass(message);
  } else {
    fail(message);
  }
}

const imagePayload = file('apps/web/lib/image-payload.client.ts');
includes(imagePayload, 'compactImageFileToDataUrl', 'Image payload helper compacts selected files');
includes(imagePayload, 'compactImageDataUrlForPayload', 'Image payload helper compacts existing data URLs before save');
includes(imagePayload, "maxWidth: 900", 'Profile image payload target is capped');

const workspace = file('apps/web/components/my-dog-form-workspace.tsx');
includes(workspace, 'compactDogFormValuesForPayload', 'Owner form compacts image payload before profile mutation');
includes(workspace, 'payloadTooLarge', 'Owner form shows localized payload-too-large guidance');
includes(workspace, 'unexpectedApiResponse', 'Owner form shows localized unexpected API response guidance');
includes(workspace, 'mutateDogProfile(', 'Existing owner profile mutation seam remains in use');

const form = file('apps/web/components/dog-profile-form.tsx');
includes(form, 'compactImageFileToDataUrl', 'Profile photo selection uses compact client image preparation');
includes(form, "maxWidth: 900", 'Profile photo selection keeps profile photos lightweight');

const pedigree = file('apps/web/components/pedigree-editor.tsx');
includes(pedigree, 'compactImageFileToDataUrl', 'Pedigree photo selection uses compact client image preparation');
includes(pedigree, "maxWidth: 640", 'Pedigree photo selection keeps ancestor photos lightweight');

const i18n = file('apps/web/lib/i18n.ts');
includes(i18n, 'Снимките бяха твърде големи за едно записване', 'Bulgarian payload-too-large copy is available');
includes(i18n, 'Сървърът върна неочакван отговор', 'Bulgarian unexpected API response copy is available');

const packageJson = file('package.json');
includes(packageJson, 'owner:image-payload:qa', 'Package script owner:image-payload:qa exists');

const lockedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/app/api/ecosystem/[slug]/route.ts',
  'apps/web/app/api/health/db/route.ts',
];

for (const lockedFile of lockedFiles) {
  file(lockedFile);
}

if (checks.some((check) => !check.ok)) {
  console.error('\nOwner image payload guardrail QA failed.');
  process.exit(1);
}

console.log('\nOwner image payload guardrail QA complete.');
