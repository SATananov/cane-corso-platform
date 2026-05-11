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

console.log('\n============================================================');
console.log('Step 120 — Photo Readiness Action Guidance QA');
console.log('============================================================\n');

const requiredFiles = [
  'apps/web/components/usg-photo-evidence-guide-panel.tsx',
  'apps/web/components/usg-authenticity-check-panel.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step120-photo-readiness-action-guidance.md',
  'scripts/qa-step120-photo-readiness-action-guidance.mjs',
  'scripts/qa-step119-usg-authenticity-data-foundation-ml-safe-labels.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

for (const file of requiredFiles) assertFile(file);

const photo = read('apps/web/components/usg-photo-evidence-guide-panel.tsx');
assertIncludes('Photo evidence panel', photo, 'Step 120 — Photo Readiness Action Guidance');
assertIncludes('Photo evidence panel', photo, 'actionPlanTitle');
assertIncludes('Photo evidence panel', photo, 'Какво да направиш сега');
assertIncludes('Photo evidence panel', photo, 'actionLabel');
assertIncludes('Photo evidence panel', photo, 'Действие за собственика');
assertIncludes('Photo evidence panel', photo, 'reviewGateTitle');
assertIncludes('Photo evidence panel', photo, 'Врата към преглед');
assertIncludes('Photo evidence panel', photo, 'ownerCenterTitle');
assertIncludes('Photo evidence panel', photo, 'Път в Owner Center');
assertIncludes('Photo evidence panel', photo, 'shotActions');
assertIncludes('Photo evidence panel', photo, 'photo-evidence-shot-card__action');
assertIncludes('Photo evidence panel', photo, 'photo-evidence-guide-panel__action-strip');
assertIncludes('Photo evidence panel', photo, 'photo-evidence-owner-bridge');
assertIncludes('Photo evidence panel', photo, 'Пълният комплект от три снимки повишава увереността на Standard Match');
assertIncludes('Photo evidence panel', photo, 'Публикуването в Регистъра и Сертификатът остават отделни решения след USG преглед');
assertIncludes('Photo evidence panel', photo, 'без да твърди, че снимка доказва порода');
assertNotIncludes('Photo evidence panel', photo, 'AI потвърди');
assertNotIncludes('Photo evidence panel', photo, 'AI доказва');
assertNotIncludes('Photo evidence panel', photo, 'чистокръвно');
assertNotIncludes('Photo evidence panel', photo, 'breed proof label');

const css = read('apps/web/app/globals.css');
assertIncludes('CSS', css, 'Step 120 — Photo Readiness Action Guidance');
assertIncludes('CSS', css, '.photo-evidence-shot-card__action');
assertIncludes('CSS', css, '.photo-evidence-guide-panel__action-strip');
assertIncludes('CSS', css, '.photo-evidence-owner-bridge');

const doc = read('docs/qa/step120-photo-readiness-action-guidance.md');
assertIncludes('Step 120 doc', doc, 'Photo Readiness Action Guidance');
assertIncludes('Step 120 doc', doc, 'Registry publication and Certificate remain separate USG review decisions');
assertIncludes('Step 120 doc', doc, 'no photo or future model proves breed');

const pkg = JSON.parse(read('package.json'));
if (!pkg.scripts?.['step120:photo-readiness-action:qa']) fail('Package script step120:photo-readiness-action:qa missing');
else pass('Package script step120:photo-readiness-action:qa exists');

const releaseQa = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');
assertIncludes('Release QA', releaseQa, 'docs/qa/step120-photo-readiness-action-guidance.md');
assertIncludes('Release QA', releaseQa, 'scripts/qa-step120-photo-readiness-action-guidance.mjs');
assertIncludes('Release QA', releaseQa, 'step120:photo-readiness-action:qa');
assertIncludes('Release QA', releaseQa, "['Step 120 photo readiness action guidance', 'scripts/qa-step120-photo-readiness-action-guidance.mjs']");

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
  assertNotIncludes(file, text, 'Step 120');
  assertNotIncludes(file, text, 'photo-readiness-action');
  assertNotIncludes(file, text, 'Photo Readiness Action Guidance');
}

if (failed) {
  console.error('\nStep 120 Photo Readiness Action Guidance QA FAILED');
  process.exit(1);
}

console.log('\nStep 120 Photo Readiness Action Guidance QA PASS');
