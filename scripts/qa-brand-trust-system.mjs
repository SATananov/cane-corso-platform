#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';

const checks = [];
function check(label, condition) {
  checks.push({ label, condition: Boolean(condition) });
}
function file(path) {
  return readFileSync(path, 'utf8');
}
function has(path, text) {
  return existsSync(path) && file(path).includes(text);
}

const officialSeal = 'apps/web/public/brand/seal/usg-official-seal.png';
const officialSealCompact = 'apps/web/public/brand/seal/usg-official-seal-compact.png';

check('Official USG seal asset exists', existsSync(officialSeal));
check('Compact official USG seal asset exists', existsSync(officialSealCompact));

check('Header uses the official compact seal', has('apps/web/components/site-header.tsx', '/brand/seal/usg-official-seal-compact.png'));
check('Footer uses the official seal', has('apps/web/components/site-footer.tsx', '/brand/seal/usg-official-seal.png'));
check('Certificate document uses the official seal', has('apps/web/components/certificate-v2-document.tsx', '/brand/seal/usg-official-seal.png'));
check('Verify result includes official trust seal', has('apps/web/components/verification-result-panel.tsx', 'official-trust-seal--verify'));
check('Verify entry includes side official trust seal', has('apps/web/components/verify-entry-panel.tsx', 'side-info-card--official-trust'));
check('Registry directory certified badge uses official seal image', has('apps/web/components/public-registry-overview.tsx', 'registry-media-seal--official'));
check('Registry profile certified badge uses official seal image', has('apps/web/components/public-registry-profile.tsx', 'registry-media-seal--official'));
check('Certified archive badge uses official seal image', has('apps/web/components/public-certified-overview.tsx', 'certified-card__seal--official'));
check('USG Gallery selected badge uses official seal image', has('apps/web/app/(public)/gallery/page.tsx', 'official-gallery-seal'));
check('Global CSS contains official trust system block', has('apps/web/app/globals.css', 'Step 33 — Official USG Brand Trust System START'));
check('Certificate CSS contains official certificate seal block', has('apps/web/app/certificate-v2.css', 'Step 33 — Official USG certificate seal START'));
check('Step 33 QA documentation exists', existsSync('docs/qa/step33-brand-trust-system.md'));

const lockedForbidden = [
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/registry/route.ts',
  'packages/db/src/repositories/ecosystem.repository.ts',
  'packages/db/src/repositories/my-dogs.repository.ts',
];
check('Locked API/DB source files remain present', lockedForbidden.every((path) => existsSync(path)));

const failed = checks.filter((item) => !item.condition);
for (const item of checks) {
  console.log(`${item.condition ? 'PASS' : 'FAIL'} ${item.label}`);
}

if (failed.length > 0) {
  console.error(`\nBrand trust system QA failed with ${failed.length} failed check(s).`);
  process.exit(1);
}

console.log('\nStep 33 Brand Trust System QA complete.');
