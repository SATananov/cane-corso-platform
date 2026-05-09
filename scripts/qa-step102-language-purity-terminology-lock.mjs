#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
};

function assertFile(relativePath) {
  if (exists(relativePath)) pass(`${relativePath} exists`);
  else fail(`${relativePath} exists`);
}

function assertIncludes(label, content, fragment) {
  if (content.includes(fragment)) pass(label);
  else fail(`${label} — missing: ${fragment}`);
}

function extractStringLiterals(source) {
  const results = [];
  const regex = /(['"`])((?:\\.|(?!\1)[\s\S])*)\1/g;
  let match;
  while ((match = regex.exec(source))) {
    results.push(match[2]);
  }
  return results;
}

function hasCyrillic(value) {
  return /[\u0400-\u04ff]/.test(value);
}

console.log('--- Step 102 Language Purity & Terminology Lock QA ---');

const visibleCopyFiles = [
  'apps/web/components/usg-standard-knowledge-panel.tsx',
  'apps/web/components/role-aware-action-panel.tsx',
  'apps/web/components/section-content-guide-panel.tsx',
];

const requiredFiles = [
  ...visibleCopyFiles,
  'docs/architecture/language-terminology-lock.md',
  'docs/qa/step102-language-purity-terminology-lock.md',
  'scripts/qa-step102-language-purity-terminology-lock.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'README.md',
  'package.json',
];

for (const file of requiredFiles) assertFile(file);

const forbiddenInBulgarianStrings = [
  'Knowledge',
  'Registry',
  'Gallery',
  'Verify',
  'Review',
  'My Dogs',
  'Member',
  'Owner',
  'Public',
  'Guide',
  'guide',
  'owner',
  'public',
  'member',
  'review',
  'score badge',
  'wording',
  'screenshot',
  'topline',
  'admin review',
  'community popularity',
];

const allowedBrandTerms = ['USG', 'Cane Corso', 'FCI', 'ENCI', 'AKC', 'CCAA', 'FAQ', 'Bulgarico'];
const languageProblems = [];

for (const file of visibleCopyFiles) {
  const strings = extractStringLiterals(read(file)).filter(hasCyrillic);
  for (const value of strings) {
    for (const term of forbiddenInBulgarianStrings) {
      if (value.includes(term)) {
        languageProblems.push(`${file}: contains forbidden BG UI term "${term}" in: ${value}`);
      }
    }
  }
}

if (languageProblems.length === 0) pass('Bulgarian visible copy avoids mixed English UI terms in guarded files');
else fail(`Bulgarian visible copy has mixed UI terms:\n${languageProblems.slice(0, 30).join('\n')}`);

const terminologyDoc = read('docs/architecture/language-terminology-lock.md');
for (const term of ['Knowledge | Знания', 'Registry | Регистър', 'Review | Преглед', 'Verify | Проверка', 'Guide | Насоки / Наръчник']) {
  assertIncludes(`Terminology lock documents ${term}`, terminologyDoc, term);
}
for (const brand of allowedBrandTerms) {
  assertIncludes(`Terminology lock allowlists ${brand}`, terminologyDoc, brand);
}

const usgStandard = read('apps/web/components/usg-standard-knowledge-panel.tsx');
assertIncludes('Step 101 BG copy uses nasoki instead of guide', usgStandard, 'Отвори USG насоките');
assertIncludes('Step 101 BG copy uses ekranna snimka instead of screenshot', usgStandard, 'екранна снимка');
assertIncludes('Step 101 BG copy uses formulirovka instead of wording', usgStandard, 'точната формулировка');
assertIncludes('Step 101 BG copy uses pregled instead of review clue', usgStandard, 'ориентир за преглед');

const roleAware = read('apps/web/components/role-aware-action-panel.tsx');
assertIncludes('Role-aware BG copy uses Znania instead of Knowledge', roleAware, 'Обясненията са в Знания и Помощ.');
assertIncludes('Role-aware BG copy uses Proverka instead of Verify meta', roleAware, "meta: 'Проверка'");

const sectionGuide = read('apps/web/components/section-content-guide-panel.tsx');
assertIncludes('Section guide BG copy uses Znania / Pomosht', sectionGuide, 'Знания / Помощ');
assertIncludes('Section guide BG copy uses Proverka wording', sectionGuide, 'Проверката потвърждава активен сертификатен запис');

const readme = read('README.md');
assertIncludes('README current checkpoint is Step 102', readme, 'Step 102 — Language Purity & Terminology Lock');
assertIncludes('README records language guardrail', readme, 'visible UI text should follow the active locale');

const packageJson = JSON.parse(read('package.json'));
if (packageJson.scripts?.['step102:language-purity:qa']) pass('Package script step102:language-purity:qa exists');
else fail('Package script step102:language-purity:qa exists');

const releaseQa = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');
assertIncludes('All-in-one release QA includes Step 102 doc', releaseQa, 'docs/qa/step102-language-purity-terminology-lock.md');
assertIncludes('All-in-one release QA includes Step 102 script', releaseQa, 'scripts/qa-step102-language-purity-terminology-lock.mjs');
assertIncludes('All-in-one release QA runs Step 102 guardrail', releaseQa, 'Step 102 language purity/terminology lock');

const lockedFiles = [
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
for (const file of lockedFiles) assertFile(file);

if (process.exitCode) {
  console.error('Step 102 Language Purity & Terminology Lock QA failed.');
  process.exit(process.exitCode);
}

console.log('Step 102 Language Purity & Terminology Lock QA complete.');
