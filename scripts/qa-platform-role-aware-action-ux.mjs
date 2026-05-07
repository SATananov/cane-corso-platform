import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

let failures = 0;
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { failures += 1; console.error(`FAIL ${message}`); }
function expect(condition, message) { condition ? pass(message) : fail(message); }
function includes(file, text, message = `${file} includes ${text}`) { expect(read(file).includes(text), message); }

console.log('--- Step 94 Platform-wide Role-aware Action UX QA ---');

const requiredFiles = [
  'apps/web/components/role-aware-action-panel.tsx',
  'docs/qa/step94-platform-wide-role-aware-action-ux.md',
  'scripts/qa-platform-role-aware-action-ux.mjs',
  'package.json',
  'README.md',
];
requiredFiles.forEach((file) => expect(exists(file), `Required file exists: ${file}`));

const packageJson = JSON.parse(read('package.json'));
expect(packageJson.scripts?.['platform:role-aware-action:qa'] === 'node scripts/qa-platform-role-aware-action-ux.mjs', 'Package script platform:role-aware-action:qa exists');

const component = read('apps/web/components/role-aware-action-panel.tsx');
[
  'Към моите Cane Corso',
  'Добави Cane Corso',
  'Виж статус',
  'Какво искаш да направиш сега?',
  'Какво търсиш днес?',
  'Първо действие и статус. Обясненията са в Knowledge и FAQ.',
  'role-aware-action-panel',
].forEach((text) => expect(component.includes(text), `Role-aware panel includes action-first copy: ${text}`));

const pageExpectations = [
  ['apps/web/app/(public)/platform/page.tsx', 'surface="platform"'],
  ['apps/web/app/(public)/registry/page.tsx', 'surface="registry"'],
  ['apps/web/app/(public)/gallery/page.tsx', 'surface="gallery"'],
  ['apps/web/app/(public)/knowledge/page.tsx', 'surface="knowledge"'],
  ['apps/web/app/(public)/community/page.tsx', 'surface="community"'],
  ['apps/web/app/(public)/partners/page.tsx', 'surface="partners"'],
  ['apps/web/app/(public)/faq/page.tsx', 'surface="faq"'],
  ['apps/web/app/(member)/member/page.tsx', 'surface="member"'],
  ['apps/web/components/my-dogs-overview.tsx', 'surface="myDogs"'],
  ['apps/web/app/(member)/profile/page.tsx', 'surface="profile"'],
  ['apps/web/app/(member)/ecosystem/page.tsx', 'surface="community"'],
  ['apps/web/app/(member)/partners/apply/page.tsx', 'surface="partnerApply"'],
  ['apps/web/app/(admin)/admin/page.tsx', 'surface="admin"'],
  ['apps/web/app/(admin)/review/page.tsx', 'surface="review"'],
  ['apps/web/app/(admin)/admin/ecosystem/page.tsx', 'surface="adminEcosystem"'],
];
pageExpectations.forEach(([file, marker]) => includes(file, marker, `${file} renders role-aware action panel ${marker}`));

includes('apps/web/app/(public)/platform/page.tsx', 'Добре дошъл обратно в USG', 'Platform signed-in hero uses member-focused welcome');
includes('apps/web/app/(public)/platform/page.tsx', 'memberCompass', 'Platform replaces dense public explanation with concise member information compass for authenticated sessions');
includes('apps/web/app/(public)/platform/page.tsx', 'Избери правилния вход, преди да продължиш по-надълбоко', 'Guest public orientation copy still exists for anonymous users');
includes('apps/web/app/(member)/member/page.tsx', 'Твоят Cane Corso център: действие, статус и следваща стъпка', 'Member dashboard hero is action/status oriented');
includes('apps/web/components/my-dogs-overview.tsx', 'Какво да направиш сега', 'My Cane Corso page uses next-action language');

const css = read('apps/web/app/globals.css');
[
  '.role-aware-action-panel',
  '.role-aware-action-panel__primary',
  '.role-aware-action-panel__secondary-grid',
  '.platform-member-focus',
].forEach((selector) => expect(css.includes(selector), `Step 94 CSS exists: ${selector}`));

const unsafeClaims = [
  'USG officially certifies purebred status without evidence',
  'USG Certificate replaces pedigree',
  'Bulgarico officially replaces the Cane Corso standard',
  'color alone proves type',
  'цветът сам по себе си доказва тип',
  'il colore da solo prova il tipo',
];
const scannedFiles = [
  'apps/web/components/role-aware-action-panel.tsx',
  'apps/web/app/(public)/platform/page.tsx',
  'apps/web/app/(member)/member/page.tsx',
  'apps/web/components/my-dogs-overview.tsx',
];
for (const claim of unsafeClaims) {
  for (const file of scannedFiles) {
    expect(!read(file).includes(claim), `${file} avoids unsafe claim: ${claim}`);
  }
}

const lockedAuthorityFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'apps/web/app/api/health/db/route.ts',
];
lockedAuthorityFiles.forEach((file) => expect(exists(file), `Locked authority file remains present: ${file}`));

includes('README.md', 'Step 94', 'README records Step 94');
includes('docs/qa/step94-platform-wide-role-aware-action-ux.md', 'role-aware', 'QA doc records role-aware scope');
includes('docs/qa/step94-platform-wide-role-aware-action-ux.md', 'Гостът вижда ориентация', 'QA doc records guest vs signed-in rule');

if (failures) {
  console.error(`\nStep 94 Platform-wide Role-aware Action UX QA failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('\nStep 94 Platform-wide Role-aware Action UX QA complete.');
