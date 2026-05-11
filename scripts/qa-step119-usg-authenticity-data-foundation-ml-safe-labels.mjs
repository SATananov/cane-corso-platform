#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failed = false;

function read(file) {
  return readFileSync(path.join(root, file), 'utf8');
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  failed = true;
}

function assertFile(file) {
  if (!existsSync(path.join(root, file))) fail(`Required file missing: ${file}`);
  else pass(`Required file exists: ${file}`);
}

function assertIncludes(label, text, token) {
  if (!text.includes(token)) fail(`${label} missing token: ${token}`);
  else pass(`${label} includes ${token}`);
}

function assertNotIncludes(label, text, token) {
  if (text.includes(token)) fail(`${label} should not include: ${token}`);
  else pass(`${label} does not include ${token}`);
}

console.log('\n====================================================================');
console.log('Step 119 — USG Authenticity Data Foundation & ML-Safe Labels QA');
console.log('====================================================================\n');

const requiredFiles = [
  'apps/web/components/usg-authenticity-check-panel.tsx',
  'apps/web/components/usg-photo-evidence-guide-panel.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step119-usg-authenticity-data-foundation-ml-safe-labels.md',
  'scripts/qa-step119-usg-authenticity-data-foundation-ml-safe-labels.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

for (const file of requiredFiles) assertFile(file);

const panel = read('apps/web/components/usg-authenticity-check-panel.tsx');
assertIncludes('Authenticity panel', panel, 'Step 119 — USG Authenticity Data Foundation & ML-Safe Labels');
assertIncludes('Authenticity panel', panel, "type MlSafeLabelKey = 'photo_quality' | 'pose_readiness' | 'standard_signal' | 'review_readiness';");
assertIncludes('Authenticity panel', panel, "type AuthenticityReadinessBand = 'not_ready' | 'partial' | 'almost_ready' | 'ready';");
assertIncludes('Authenticity panel', panel, 'getPhotoReadinessBand');
assertIncludes('Authenticity panel', panel, 'getReviewReadinessBand');
assertIncludes('Authenticity panel', panel, 'dataFoundationTitle');
assertIncludes('Authenticity panel', panel, 'Кое е шаблон, кое е сигнал, кое е решение');
assertIncludes('Authenticity panel', panel, 'Standard Match ориентация');
assertIncludes('Authenticity panel', panel, 'Готовност на снимките');
assertIncludes('Authenticity panel', panel, 'Готовност за USG преглед');
assertIncludes('Authenticity panel', panel, 'ML-safe етикети за бъдещия модел');
assertIncludes('Authenticity panel', panel, 'photo_quality');
assertIncludes('Authenticity panel', panel, 'pose_readiness');
assertIncludes('Authenticity panel', panel, 'standard_signal');
assertIncludes('Authenticity panel', panel, 'review_readiness');
assertIncludes('Authenticity panel', panel, 'authenticity-check-foundation-strip');
assertIncludes('Authenticity panel', panel, 'authenticity-check-mini-card--ml-safe');
assertIncludes('Authenticity panel', panel, 'authenticity-check-mini-card--authority');
assertIncludes('Authenticity panel', panel, 'Статусът в Регистъра и Сертификатът никога не са автоматични');
assertIncludes('Authenticity panel', panel, 'Registry and Certificate status are never automatic');
assertIncludes('Authenticity panel', panel, 'Не доказва порода или родословие');
assertNotIncludes('Authenticity panel', panel, 'AI потвърди');
assertNotIncludes('Authenticity panel', panel, 'automatic breed proof');
assertNotIncludes('Authenticity panel', panel, 'чистокръвно');
assertNotIncludes('Authenticity panel', panel, 'AI proves');

const photo = read('apps/web/components/usg-photo-evidence-guide-panel.tsx');
assertIncludes('Photo evidence panel', photo, 'Снимки за USG преглед');
assertIncludes('Photo evidence panel', photo, 'Снимков комплект за USG преглед');
assertIncludes('Photo evidence panel', photo, 'Проверки за качество преди преглед');
assertIncludes('Photo evidence panel', photo, 'структуриран вход за ориентация по поза, пропорции и качество');
assertNotIncludes('Photo evidence visible eyebrow', photo, "eyebrow: 'Step 118");
assertNotIncludes('Photo evidence panel', photo, 'AI потвърди');
assertNotIncludes('Photo evidence panel', photo, 'чистокръвно');

const css = read('apps/web/app/globals.css');
assertIncludes('CSS', css, 'Step 119 — USG authenticity data foundation and ML-safe labels');
assertIncludes('CSS', css, '.authenticity-check-foundation-strip');
assertIncludes('CSS', css, '.authenticity-check-foundation-card');
assertIncludes('CSS', css, '.authenticity-check-mini-card--ml-safe');
assertIncludes('CSS', css, '.authenticity-check-ml-labels');
assertIncludes('CSS', css, '.authenticity-check-mini-card--authority');

const doc = read('docs/qa/step119-usg-authenticity-data-foundation-ml-safe-labels.md');
assertIncludes('Step 119 doc', doc, 'USG Authenticity Data Foundation & ML-Safe Labels');
assertIncludes('Step 119 doc', doc, 'photo_quality');
assertIncludes('Step 119 doc', doc, 'pose_readiness');
assertIncludes('Step 119 doc', doc, 'standard_signal');
assertIncludes('Step 119 doc', doc, 'review_readiness');
assertIncludes('Step 119 doc', doc, 'Registry and Certificate authority');

const pkg = JSON.parse(read('package.json'));
if (!pkg.scripts?.['step119:authenticity-data-foundation:qa']) fail('Package script step119:authenticity-data-foundation:qa missing');
else pass('Package script step119:authenticity-data-foundation:qa exists');

const releaseQa = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');
assertIncludes('Release QA', releaseQa, 'docs/qa/step119-usg-authenticity-data-foundation-ml-safe-labels.md');
assertIncludes('Release QA', releaseQa, 'scripts/qa-step119-usg-authenticity-data-foundation-ml-safe-labels.mjs');
assertIncludes('Release QA', releaseQa, 'step119:authenticity-data-foundation:qa');
assertIncludes('Release QA', releaseQa, "['Step 119 USG authenticity data foundation and ML-safe labels', 'scripts/qa-step119-usg-authenticity-data-foundation-ml-safe-labels.mjs']");

const lockedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'packages/db/drizzle/0014_dog_health_records.sql',
];

for (const file of lockedFiles) {
  assertFile(file);
  const text = read(file);
  assertNotIncludes(file, text, 'Step 119');
  assertNotIncludes(file, text, 'MlSafeLabel');
  assertNotIncludes(file, text, 'authenticity-data-foundation');
}

if (failed) {
  console.error('\nStep 119 USG Authenticity Data Foundation & ML-Safe Labels QA FAILED');
  process.exit(1);
}

console.log('\nStep 119 USG Authenticity Data Foundation & ML-Safe Labels QA PASS');
