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
function excludes(file, text, message = `${file} excludes ${text}`) { expect(!read(file).includes(text), message); }

console.log('--- Step 94.1 Intent-first Authenticated Experience QA ---');

const requiredFiles = [
  'apps/web/components/role-aware-action-panel.tsx',
  'apps/web/app/(public)/platform/page.tsx',
  'docs/qa/step94-1-intent-first-authenticated-experience.md',
  'scripts/qa-intent-first-authenticated-experience.mjs',
  'package.json',
  'README.md',
];
requiredFiles.forEach((file) => expect(exists(file), `Required file exists: ${file}`));

const packageJson = JSON.parse(read('package.json'));
expect(packageJson.scripts?.['platform:intent-first-auth:qa'] === 'node scripts/qa-intent-first-authenticated-experience.mjs', 'Package script platform:intent-first-auth:qa exists');

const panel = read('apps/web/components/role-aware-action-panel.tsx');
[
  'Какво искаш да направиш сега?',
  'Към моите Cane Corso',
  'Добави Cane Corso',
  'Виж статус',
  'Информация за породата',
  'Какво търсиш днес?',
  'Помощ според намерение',
].forEach((text) => expect(panel.includes(text), `Action panel keeps intent-first copy: ${text}`));

[
  'Личен вход след логин',
  'Дневен вход след логин',
  'продължи с реална задача',
  'Първо действие, после информация.',
].forEach((text) => expect(!panel.includes(text), `Action panel removed awkward/internal copy: ${text}`));

const platform = read('apps/web/app/(public)/platform/page.tsx');
includes('apps/web/app/(public)/platform/page.tsx', 'memberCompass', 'Platform has signed-in information compass');
includes('apps/web/app/(public)/platform/page.tsx', 'Търсиш информация за Cane Corso?', 'Signed-in platform points to Cane Corso information');
includes('apps/web/app/(public)/platform/page.tsx', 'Информационен компас', 'Signed-in platform has concise information compass heading');
includes('apps/web/app/(public)/platform/page.tsx', 'currentSession ? (', 'Platform branches authenticated experience');
includes('apps/web/app/(public)/platform/page.tsx', '!currentSession ? (', 'Platform keeps guest-only presentation sections');
expect(platform.indexOf('memberCompass') < platform.indexOf('section-block--public-experience'), 'Signed-in compass is placed before guest-only public experience block in source');

const css = read('apps/web/app/globals.css');
[
  'Step 94.1 — Intent-first authenticated experience cleanup',
  '.member-intent-compass-grid',
  '.member-intent-compass-card',
].forEach((text) => expect(css.includes(text), `Step 94.1 CSS exists: ${text}`));

const surfaceMarkers = [
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
surfaceMarkers.forEach(([file, marker]) => includes(file, marker, `${file} keeps role-aware action entry ${marker}`));

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
  'apps/web/app/(public)/knowledge/page.tsx',
  'apps/web/app/(public)/faq/page.tsx',
];
for (const claim of unsafeClaims) {
  for (const file of scannedFiles) {
    excludes(file, claim, `${file} avoids unsafe claim: ${claim}`);
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

includes('README.md', 'Step 94.1', 'README records Step 94.1');
includes('docs/qa/step94-1-intent-first-authenticated-experience.md', 'Intent-first', 'QA doc records intent-first scope');
includes('docs/qa/step94-1-intent-first-authenticated-experience.md', 'логнатият потребител', 'QA doc records signed-in behavior');

if (failures) {
  console.error(`\nStep 94.1 Intent-first Authenticated Experience QA failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('\nStep 94.1 Intent-first Authenticated Experience QA complete.');
