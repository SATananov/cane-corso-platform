#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(file) { return readFileSync(path.join(root, file), 'utf8'); }
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function assertFile(file) { existsSync(path.join(root, file)) ? pass(`Required file exists: ${file}`) : fail(`Missing required file: ${file}`); }
function assertIncludes(file, needle, label) { read(file).includes(needle) ? pass(label) : fail(`${label}: missing ${needle}`); }
function assertNotIncludes(file, needle, label) { read(file).includes(needle) ? fail(`${label}: found forbidden ${needle}`) : pass(label); }

console.log('\n==========================================================');
console.log('Step 113.1 — My Cane Corso Section Workspace QA');
console.log('==========================================================\n');

const requiredFiles = [
  'apps/web/components/owner-cane-corso-section-workspace.tsx',
  'apps/web/components/my-dogs-overview.tsx',
  'apps/web/components/owner-health-growth-tracker.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step113-1-owner-cane-corso-section-workspace.md',
  'scripts/qa-step113-1-owner-cane-corso-section-workspace.mjs',
  'package.json',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
];
for (const file of requiredFiles) assertFile(file);

const workspace = 'apps/web/components/owner-cane-corso-section-workspace.tsx';
assertIncludes(workspace, 'OwnerCaneCorsoSectionWorkspace', 'Owner section workspace component exists');
assertIncludes(workspace, 'Cane Corso досие', 'Bulgarian dossier copy exists');
assertIncludes(workspace, 'Избери какво искаш да управляваш', 'Bulgarian action-first heading exists');
assertIncludes(workspace, 'Растеж и размери', 'Growth section exists');
assertIncludes(workspace, 'Здраве и ваксини', 'Health/vaccine section exists');
assertIncludes(workspace, 'USG/admin и community оценки', 'Ratings section separates trust signals');
assertIncludes(workspace, 'Малки, нов дом, разплод или изгубено', 'Community listing intents exist');
assertIncludes(workspace, 'Хотел, транспорт, клиника или pet-friendly място', 'Services/places section exists');
assertIncludes(workspace, 'Публичните обяви пазят собственика', 'Owner privacy note exists');
assertIncludes(workspace, 'Име на собственик, имейл, телефон и точен адрес остават скрити', 'Public listing privacy copy exists');
assertIncludes(workspace, '`/my-dogs/${dog.id}/health#growth-table`', 'Growth card links to health growth table anchor');
assertIncludes(workspace, '`/my-dogs/${dog.id}/health#vaccines-table`', 'Vaccine card links to health vaccine table anchor');
assertIncludes(workspace, '`/ecosystem#community-intent-form`', 'Community card links to existing ecosystem submission flow');
assertIncludes(workspace, '`/ecosystem#friendly-place-form`', 'Services card links to existing service/place submission flow');

const overview = 'apps/web/components/my-dogs-overview.tsx';
assertIncludes(overview, "import { OwnerCaneCorsoSectionWorkspace }", 'My Dogs overview imports section workspace');
assertIncludes(overview, '<OwnerCaneCorsoSectionWorkspace', 'My Dogs overview renders section workspace');
assertIncludes(overview, 'registryEntry={featuredRegistryDocument?.entry ?? null}', 'Section workspace receives registry/rating context');

const tracker = 'apps/web/components/owner-health-growth-tracker.tsx';
assertIncludes(tracker, 'bodyLengthCm: string', 'Tracker form includes body length');
assertIncludes(tracker, 'chestCircumferenceCm: string', 'Tracker form includes chest circumference');
assertIncludes(tracker, 'headLengthCm: string', 'Tracker form includes head length');
assertIncludes(tracker, 'muzzleLengthCm: string', 'Tracker form includes muzzle length');
assertIncludes(tracker, 'skullLengthCm: string', 'Tracker form includes skull length');
assertIncludes(tracker, 'bodyLengthCm: toOptionalNumber(weightForm.bodyLengthCm)', 'Tracker saves body length');
assertIncludes(tracker, 'chestCircumferenceCm: toOptionalNumber(weightForm.chestCircumferenceCm)', 'Tracker saves chest circumference');
assertIncludes(tracker, 'headLengthCm: toOptionalNumber(weightForm.headLengthCm)', 'Tracker saves head length');
assertIncludes(tracker, 'muzzleLengthCm: toOptionalNumber(weightForm.muzzleLengthCm)', 'Tracker saves muzzle length');
assertIncludes(tracker, 'skullLengthCm: toOptionalNumber(weightForm.skullLengthCm)', 'Tracker saves skull length');
assertIncludes(tracker, 'getOrientationRange', 'Tracker computes broad orientation ranges');
assertIncludes(tracker, 'getWeightConclusion', 'Tracker computes careful conclusion copy');
assertIncludes(tracker, 'не медицинска диагноза', 'Tracker avoids medical diagnosis copy');
assertIncludes(tracker, 'id="growth-table"', 'Growth table has direct anchor');
assertIncludes(tracker, 'id="vaccines-table"', 'Vaccine table has direct anchor');
assertIncludes(tracker, '<th>{t.bodyLength}</th>', 'Growth table shows body length column');
assertIncludes(tracker, '<th>{t.chest}</th>', 'Growth table shows chest column');
assertIncludes(tracker, '<th>{t.head}</th>', 'Growth table shows head column');
assertIncludes(tracker, '<th>{t.muzzle}</th>', 'Growth table shows muzzle column');
assertIncludes(tracker, '<th>{t.skull}</th>', 'Growth table shows skull column');
assertIncludes(tracker, 'owner-health-chart-card--standard', 'Standard orientation chart card exists');
assertIncludes(tracker, 'owner-health-conclusion', 'Conclusion note is rendered');

const css = 'apps/web/app/globals.css';
assertIncludes(css, 'Step 113.1 — My Cane Corso Section Workspace START', 'Step 113.1 CSS block exists');
assertIncludes(css, '.owner-cane-section-workspace', 'Owner section workspace CSS exists');
assertIncludes(css, '.owner-cane-section-grid', 'Owner section grid CSS exists');
assertIncludes(css, '.owner-health-standard-grid', 'Health standard grid CSS exists');
assertIncludes(css, '.owner-health-conclusion', 'Health conclusion CSS exists');

const doc = 'docs/qa/step113-1-owner-cane-corso-section-workspace.md';
assertIncludes(doc, 'My Cane Corso Section Workspace', 'Step 113.1 doc title exists');
assertIncludes(doc, 'Public listings protect the owner', 'Step 113.1 doc records owner privacy');
assertIncludes(doc, 'No intended changes to', 'Step 113.1 doc records boundaries');
assertIncludes(doc, 'pnpm step113-1:owner-workspace:qa', 'Step 113.1 doc includes QA command');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step113-1:owner-workspace:qa'] === 'node scripts/qa-step113-1-owner-cane-corso-section-workspace.mjs') pass('Package script step113-1:owner-workspace:qa exists');
else fail('Package script step113-1:owner-workspace:qa missing');

const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step113-1-owner-cane-corso-section-workspace.md', 'Release QA requires Step 113.1 doc');
assertIncludes(release, 'scripts/qa-step113-1-owner-cane-corso-section-workspace.mjs', 'Release QA requires Step 113.1 script');
assertIncludes(release, 'step113-1:owner-workspace:qa', 'Release QA requires Step 113.1 package script');
assertIncludes(release, 'Step 113.1 My Cane Corso section workspace', 'Release QA runs Step 113.1 script');

for (const lockedFile of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'packages/db/drizzle/0014_dog_health_records.sql',
]) {
  assertFile(lockedFile);
  assertNotIncludes(lockedFile, 'OwnerCaneCorsoSectionWorkspace', `${lockedFile} not touched by Step 113.1 owner workspace`);
  assertNotIncludes(lockedFile, 'Step 113.1', `${lockedFile} not touched by Step 113.1 marker`);
}

if (process.exitCode) {
  console.error('\nStep 113.1 My Cane Corso Section Workspace QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 113.1 My Cane Corso Section Workspace QA PASS');
