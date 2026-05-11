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
console.log('Step 117 — USG Authenticity Check Foundation QA');
console.log('====================================================================\n');

const requiredFiles = [
  'apps/web/components/usg-authenticity-check-panel.tsx',
  'apps/web/components/my-dog-form-workspace.tsx',
  'apps/web/components/my-dog-card.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step117-usg-authenticity-check-foundation.md',
  'scripts/qa-step117-usg-authenticity-check-foundation.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

for (const file of requiredFiles) assertFile(file);

const panel = read('apps/web/components/usg-authenticity-check-panel.tsx');
assertIncludes('Authenticity panel', panel, 'USG проверка за истинско');
assertIncludes('Authenticity panel', panel, 'Check visual readiness against the standard');
assertIncludes('Authenticity panel', panel, 'Verifica autenticità USG');
assertIncludes('Authenticity panel', panel, 'buildFciStandardConformityDocument');
assertIncludes('Authenticity panel', panel, 'listDogMeasurements');
assertIncludes('Authenticity panel', panel, 'ScoreGauge');
assertIncludes('Authenticity panel', panel, 'authenticity-check-flow');
assertIncludes('Authenticity panel', panel, 'authenticity-check-signal__bar');
assertIncludes('Authenticity panel', panel, 'This is an AI/ML-ready orientation layer');
assertIncludes('Authenticity panel', panel, 'Разпознаването от снимка е подготвено като бъдещ слой');
assertIncludes('Authenticity panel', panel, 'Не доказва порода или родословие');
assertNotIncludes('Authenticity panel', panel, 'AI потвърди');
assertNotIncludes('Authenticity panel', panel, 'чистокръвно');
assertNotIncludes('Authenticity panel', panel, 'automatic breed proof');

const form = read('apps/web/components/my-dog-form-workspace.tsx');
assertIncludes('Dog form workspace', form, 'UsgAuthenticityCheckPanel');
assertIncludes('Dog form workspace', form, 'Провери за истинско');
assertIncludes('Dog form workspace', form, "#usg-authenticity-check");
assertIncludes('Dog form workspace', form, "setIsGuidanceVisible(true)");
assertIncludes('Dog form workspace', form, 'galleryImageCount={galleryImageCount}');
assertIncludes('Dog form workspace', form, 'pedigreeFilledCount={pedigreeFilledCount}');
assertIncludes('Dog form workspace', form, 'pedigreePhotoCount={pedigreePhotoCount}');

const card = read('apps/web/components/my-dog-card.tsx');
assertIncludes('My Dog card', card, 'authenticityCheck');
assertIncludes('My Dog card', card, 'Провери за истинско');
assertIncludes('My Dog card', card, 'edit#usg-authenticity-check');

const css = read('apps/web/app/globals.css');
assertIncludes('CSS', css, 'Step 117 — USG authenticity check foundation');
assertIncludes('CSS', css, '.authenticity-check-panel');
assertIncludes('CSS', css, '.authenticity-check__gauge');
assertIncludes('CSS', css, '.authenticity-check-flow');
assertIncludes('CSS', css, '.authenticity-check-signal__bar');

const pkg = JSON.parse(read('package.json'));
if (!pkg.scripts?.['step117:authenticity-check:qa']) fail('Package script step117:authenticity-check:qa missing');
else pass('Package script step117:authenticity-check:qa exists');

const releaseQa = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');
assertIncludes('Release QA', releaseQa, 'docs/qa/step117-usg-authenticity-check-foundation.md');
assertIncludes('Release QA', releaseQa, 'scripts/qa-step117-usg-authenticity-check-foundation.mjs');
assertIncludes('Release QA', releaseQa, 'step117:authenticity-check:qa');
assertIncludes('Release QA', releaseQa, "['Step 117 USG authenticity check foundation', 'scripts/qa-step117-usg-authenticity-check-foundation.mjs']");

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
  assertNotIncludes(file, text, 'Step 117');
  assertNotIncludes(file, text, 'authenticity-check');
}

if (failed) {
  console.error('\nStep 117 USG Authenticity Check Foundation QA FAILED');
  process.exit(1);
}

console.log('\nStep 117 USG Authenticity Check Foundation QA PASS');
