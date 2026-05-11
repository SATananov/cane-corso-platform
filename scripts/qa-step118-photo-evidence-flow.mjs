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
console.log('Step 118 — Photo Evidence Flow & Upload Guidance QA');
console.log('====================================================================\n');

const requiredFiles = [
  'apps/web/components/usg-photo-evidence-guide-panel.tsx',
  'apps/web/components/usg-authenticity-check-panel.tsx',
  'apps/web/components/my-dog-form-workspace.tsx',
  'apps/web/components/dog-profile-form.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step118-photo-evidence-flow.md',
  'scripts/qa-step118-photo-evidence-flow.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

for (const file of requiredFiles) assertFile(file);

const panel = read('apps/web/components/usg-photo-evidence-guide-panel.tsx');
assertIncludes('Photo evidence panel', panel, 'Step 118 photo evidence flow');
assertIncludes('Photo evidence panel', panel, 'Step 118 снимков evidence flow');
assertIncludes('Photo evidence panel', panel, 'Step 118 flusso evidenze foto');
assertIncludes('Photo evidence panel', panel, 'Prepare the three photos for Standard Match comparison');
assertIncludes('Photo evidence panel', panel, 'Подготви трите снимки за Standard Match сравнение');
assertIncludes('Photo evidence panel', panel, 'side standing');
assertIncludes('Photo evidence panel', panel, 'Странична снимка в стойка');
assertIncludes('Photo evidence panel', panel, 'Фронтална снимка в стойка');
assertIncludes('Photo evidence panel', panel, 'Детайл на глава');
assertIncludes('Photo evidence panel', panel, 'photo-evidence-guide-panel__meter');
assertIncludes('Photo evidence panel', panel, 'dog-photo-evidence-upload');
assertIncludes('Photo evidence panel', panel, 'without claiming that a photo proves breed identity');
assertIncludes('Photo evidence panel', panel, 'без да твърди, че снимка доказва порода');
assertNotIncludes('Photo evidence panel', panel, 'AI потвърди');
assertNotIncludes('Photo evidence panel', panel, 'чистокръвно');
assertNotIncludes('Photo evidence panel', panel, 'automatic breed proof');

const workspace = read('apps/web/components/my-dog-form-workspace.tsx');
assertIncludes('Dog form workspace', workspace, 'UsgPhotoEvidenceGuidePanel');
assertIncludes('Dog form workspace', workspace, 'galleryImageCount={galleryImageCount}');
assertIncludes('Dog form workspace', workspace, 'mainImageUrl={values.mainImageUrl || values.galleryImageUrls[0]}');
assertIncludes('Dog form workspace', workspace, 'UsgAuthenticityCheckPanel');

const form = read('apps/web/components/dog-profile-form.tsx');
assertIncludes('Dog profile form', form, 'id="dog-photo-evidence-upload"');
assertIncludes('Dog profile form', form, 'dog-profile-cover-panel');

const css = read('apps/web/app/globals.css');
assertIncludes('CSS', css, 'Step 118 — USG photo evidence flow');
assertIncludes('CSS', css, '.photo-evidence-guide-panel');
assertIncludes('CSS', css, '.photo-evidence-shot-card');
assertIncludes('CSS', css, '.photo-evidence-guide-panel__meter');

const pkg = JSON.parse(read('package.json'));
if (!pkg.scripts?.['step118:photo-evidence:qa']) fail('Package script step118:photo-evidence:qa missing');
else pass('Package script step118:photo-evidence:qa exists');

const releaseQa = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');
assertIncludes('Release QA', releaseQa, 'scripts/qa-step118-photo-evidence-flow.mjs');
assertIncludes('Release QA', releaseQa, 'Step 118 photo evidence flow');

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
  assertNotIncludes(file, text, 'Step 118');
  assertNotIncludes(file, text, 'photo-evidence');
}

if (failed) {
  console.error('\nStep 118 Photo Evidence Flow & Upload Guidance QA FAILED');
  process.exit(1);
}

console.log('\nStep 118 Photo Evidence Flow & Upload Guidance QA PASS');
