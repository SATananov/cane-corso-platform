#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failed = false;
const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => { console.error(`FAIL ${message}`); failed = true; };
const file = (relativePath) => path.join(root, relativePath);
const read = (relativePath) => readFileSync(file(relativePath), 'utf8');
const has = (relativePath) => existsSync(file(relativePath));

function assertFile(relativePath) {
  if (has(relativePath)) pass(`${relativePath} exists`);
  else fail(`${relativePath} exists`);
}
function assertIncludes(label, text, fragment) {
  if (text.includes(fragment)) pass(label);
  else fail(`${label} — missing ${fragment}`);
}
function assertNotIncludes(label, text, fragment) {
  if (!text.includes(fragment)) pass(label);
  else fail(`${label} — forbidden ${fragment}`);
}

console.log('--- Step 107 USG Product Lock QA ---');

for (const required of [
  '.env.example',
  'apps/web/.env.example',
  'README.md',
  'package.json',
  'docs/qa/step103-usg-growth-measurement-assistant.md',
  'docs/qa/step104-owner-growth-measurement-archive.md',
  'docs/qa/step105-production-clarity-user-first.md',
  'docs/qa/step106-full-product-structure-reset.md',
  'docs/qa/step107-usg-product-lock.md',
  'scripts/qa-step103-growth-measurement-assistant.mjs',
  'scripts/qa-step104-owner-growth-measurement-archive.mjs',
  'scripts/qa-step105-production-clarity-user-first.mjs',
  'scripts/qa-step106-full-product-structure-reset.mjs',
  'scripts/qa-step107-usg-product-lock.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
]) assertFile(required);

const rootFiles = readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => entry.name);
const rootClutter = rootFiles.filter((name) => /^(STEP|PATCH|README_).*\.(txt|md)$/i.test(name));
if (rootClutter.length === 0) pass('Root has no legacy STEP/PATCH apply-note clutter');
else fail(`Root legacy clutter remains: ${rootClutter.join(', ')}`);
assertFile('docs/archive/package-notes/STEP106_PATCH_APPLY_NOTES.txt');

const readme = read('README.md');
assertIncludes('README current checkpoint is Step 107', readme, 'Step 107 — USG Product Lock');
for (const step of ['Step 103', 'Step 104', 'Step 105', 'Step 106', 'Step 107']) {
  assertIncludes(`README records ${step}`, readme, step);
}
assertIncludes('README keeps language guardrail', readme, 'visible UI text should follow the active locale');

const pkg = JSON.parse(read('package.json'));
assertIncludes('Package script step107 exists', JSON.stringify(pkg.scripts ?? {}), 'step107:product-lock:qa');
const releaseQa = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');
assertIncludes('All-in-one QA requires Step 107 doc', releaseQa, 'docs/qa/step107-usg-product-lock.md');
assertIncludes('All-in-one QA requires Step 107 script', releaseQa, 'scripts/qa-step107-usg-product-lock.mjs');
assertIncludes('All-in-one QA runs Step 107', releaseQa, 'Step 107 USG product lock');

const targetFiles = [
  'apps/web/app/(member)/member/page.tsx',
  'apps/web/app/(member)/profile/page.tsx',
  'apps/web/app/(public)/faq/page.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/(public)/guide/page.tsx',
  'apps/web/app/(public)/manifesto/page.tsx',
  'apps/web/app/(public)/platform/page.tsx',
  'apps/web/app/(public)/registry/[slug]/page.tsx',
  'apps/web/app/verify/page.tsx',
  'apps/web/components/gallery-certified-showcase-trust-panel.tsx',
  'apps/web/components/gallery-certified-showcase-trust-panel-v2.tsx',
  'apps/web/components/owner-onboarding-final-panel.tsx',
  'apps/web/components/public-registry-profile.tsx',
];

const forbiddenVisibleFragments = [
  'Registry профил',
  'Registry слой',
  'публичният Registry',
  'Публичният Registry',
  'Публичен slug',
  'admin-only',
  'Owner workspace',
  'работната ти зона',
  'стария проект',
  'member потоци',
  'Layer Galleria USG',
  'Отвори Registry',
  'Отвори Verify',
  'Отвори Gallery',
  'Отвори Knowledge',
  'USG trust език',
  'workflow и админ',
  'Pubblicazione Registry',
  'review e segui Registry',
  'layer senza',
];

for (const target of targetFiles) {
  assertFile(target);
  const text = read(target);
  for (const fragment of forbiddenVisibleFragments) {
    assertNotIncludes(`${target} avoids mixed/project visible copy`, text, fragment);
  }
}

const memberPage = read('apps/web/app/(member)/member/page.tsx');
assertIncludes('Member BG primary action is localized', memberPage, 'Отвори „Моите Cane Corso“');
assertIncludes('Member IT primary action is localized', memberPage, 'Apri I miei Cane Corso');
assertNotIncludes('Member keeps Step 106 without dense owner onboarding panel', memberPage, '<OwnerOnboardingFinalPanel');
assertNotIncludes('Member keeps Step 106 without dense content guide panel', memberPage, 'SectionContentGuidePanel');

const registryDetail = read('apps/web/app/(public)/registry/[slug]/page.tsx');
assertIncludes('Registry detail BG hero note is user-first', registryDetail, 'Публичният профил показва най-важното първо');

const contentQa = read('scripts/qa-platform-content-completeness.mjs');
assertIncludes('Content QA documents Step 106 active-section exceptions', contentQa, 'step106ActiveSectionTargets');
const i18nQa = read('scripts/qa-step48-55-release-candidate.mjs');
assertIncludes('Consolidated i18n QA accepts Step 106 member command center', i18nQa, 'Member page keeps Step 106 member command center');

for (const locked of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'apps/web/app/api/health/db/route.ts',
  'packages/db/drizzle/0013_dog_growth_records.sql',
]) assertFile(locked);

if (failed) {
  console.error('Step 107 USG Product Lock QA FAILED');
  process.exit(1);
}

console.log('Step 107 USG Product Lock QA complete.');
