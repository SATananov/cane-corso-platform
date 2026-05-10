#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(file) { return readFileSync(path.join(root, file), 'utf8'); }
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function assertFile(file) { existsSync(path.join(root, file)) ? pass(`Required file exists: ${file}`) : fail(`Missing required file: ${file}`); }
function assertIncludes(file, needle, label) { const source = read(file); source.includes(needle) ? pass(label) : fail(`${label}: missing ${needle}`); }
function assertNotIncludes(file, needle, label) { const source = read(file); source.includes(needle) ? fail(`${label}: found ${needle}`) : pass(label); }
function assertNotIncludesAny(file, needles, label) {
  const source = read(file).toLowerCase();
  const found = needles.filter((needle) => source.includes(needle.toLowerCase()));
  found.length ? fail(`${label}: found ${found.join(', ')}`) : pass(label);
}

console.log('\n==========================================================');
console.log('Step 109 — Owner Health & Growth Tracker QA');
console.log('==========================================================\n');

const requiredFiles = [
  'packages/contracts/src/dogs/dog-health.types.ts',
  'packages/db/drizzle/0014_dog_health_records.sql',
  'packages/db/src/repositories/dog-health.repository.ts',
  'apps/web/lib/dog-health.server.ts',
  'apps/web/lib/api/dog-health.client.ts',
  'apps/web/app/api/dogs/[dogId]/health/route.ts',
  'apps/web/app/(member)/my-dogs/[dogId]/health/page.tsx',
  'apps/web/components/owner-health-growth-tracker.tsx',
  'docs/qa/step109-owner-health-growth-tracker.md',
  'scripts/qa-step109-owner-health-growth-tracker.mjs',
];
for (const file of requiredFiles) assertFile(file);

assertIncludes('packages/contracts/src/index.ts', "export * from './dogs/dog-health.types';", 'Contracts export dog health types');
assertIncludes('packages/db/src/schema/dogs.ts', "export const dogHealthRecords", 'DB schema exposes dog health records table');
assertIncludes('packages/db/src/index.ts', "export * from './repositories/dog-health.repository';", 'DB package exports dog health repository');
assertIncludes('packages/db/drizzle/0014_dog_health_records.sql', 'CREATE TABLE IF NOT EXISTS "dog_health_records"', 'Migration creates dog_health_records');
assertIncludes('packages/db/drizzle/0014_dog_health_records.sql', '"next_due_at" date', 'Migration stores next due date');
assertIncludes('packages/db/drizzle/0014_dog_health_records.sql', '"batch_number" text', 'Migration stores vaccine batch number');

const api = 'apps/web/app/api/dogs/[dogId]/health/route.ts';
assertIncludes(api, 'getCurrentMemberDogHealthRecordsDocument', 'Health API reads through current member server helper');
assertIncludes(api, 'createCurrentMemberDogHealthRecord', 'Health API creates through current member server helper');
assertIncludes(api, 'deleteCurrentMemberDogHealthRecord', 'Health API deletes through current member server helper');
assertIncludes(api, 'allowDevFallback: false', 'Health API disables dev fallback');
assertIncludes(api, 'SESSION_NOT_AVAILABLE', 'Health API preserves session guard');

const server = 'apps/web/lib/dog-health.server.ts';
assertIncludes(server, 'getCurrentMemberSession(options)', 'Health server helper requires current member session');
assertIncludes(server, 'createDogHealthRepository', 'Health server helper uses DB repository');
assertIncludes(server, 'INVALID_DOCUMENT_URL', 'Health server helper validates document URL');
assertIncludes(server, 'DogHealthValidationError', 'Health server helper has validation error boundary');

const repo = 'packages/db/src/repositories/dog-health.repository.ts';
assertIncludes(repo, 'eq(dogs.ownerProfileId, ownerProfileId)', 'Repository validates dog ownership');
assertIncludes(repo, 'eq(dogHealthRecords.recordedByProfileId, ownerProfileId)', 'Repository lists only owner health records');
assertIncludes(repo, 'PERFORMED_AT_IN_FUTURE', 'Repository blocks future completed health dates');
assertIncludes(repo, 'HEALTH_RECORD_NOT_FOUND', 'Repository handles missing delete records');

const component = 'apps/web/components/owner-health-growth-tracker.tsx';
assertIncludes(component, 'Growth, weight and vaccines', 'English owner tracker copy exists');
assertIncludes(component, 'Растеж, тегло и ваксини', 'Bulgarian owner tracker copy exists');
assertIncludes(component, 'Crescita, peso e vaccini', 'Italian owner tracker copy exists');
assertIncludes(component, 'Veterinarian remains the authority', 'English veterinary authority note exists');
assertIncludes(component, 'Ветеринарят остава авторитетът', 'Bulgarian veterinary authority note exists');
assertIncludes(component, 'Il veterinario resta l’autorità', 'Italian veterinary authority note exists');
assertIncludes(component, 'listDogMeasurements', 'Owner tracker reuses existing measurement archive');
assertIncludes(component, 'listDogHealthRecords', 'Owner tracker loads health records');
assertIncludes(component, 'owner-health-chart__bar', 'Owner tracker renders a visual weight trend');
assertIncludes(component, 'batchNumber', 'Owner tracker includes vaccine batch number field');
assertIncludes(component, 'nextDueAt', 'Owner tracker includes next due date field');
assertIncludes(component, 'The platform stores the history; it does not prescribe a vaccination schedule.', 'Owner tracker avoids prescribing vaccine schedule');

const page = 'apps/web/app/(member)/my-dogs/[dogId]/health/page.tsx';
assertIncludes(page, 'OwnerHealthGrowthTracker', 'Member health page renders owner tracker');
assertIncludes(page, 'allowDevFallback: false', 'Member health page disables dev fallback');
assertIncludes(page, "next: `/my-dogs/${dogId}/health`", 'Member health page preserves access intent on redirect');

const card = 'apps/web/components/my-dog-card.tsx';
assertIncludes(card, '`/my-dogs/${dog.id}/health`', 'Owner dog card links to health tracker');
assertIncludes(card, "healthTracker: 'Здраве и растеж'", 'Bulgarian health tracker action label exists');

const css = 'apps/web/app/globals.css';
assertIncludes(css, 'Step 109 — Owner Health & Growth Tracker START', 'Step 109 CSS block exists');
assertIncludes(css, '.owner-health-tracker__hero', 'Health tracker hero styling exists');
assertIncludes(css, '.owner-health-table', 'Health tracker table styling exists');
assertIncludes(css, '.owner-health-chart__bar', 'Health tracker chart styling exists');

const pkg = JSON.parse(read('package.json'));
pkg.scripts?.['step109:owner-health-growth:qa'] ? pass('Package script step109:owner-health-growth:qa exists') : fail('Package script step109:owner-health-growth:qa missing');

const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step109-owner-health-growth-tracker.md', 'Release QA requires Step 109 QA doc');
assertIncludes(release, 'scripts/qa-step109-owner-health-growth-tracker.mjs', 'Release QA requires Step 109 QA script');
assertIncludes(release, 'Step 109 Owner health/growth tracker', 'Release QA runs Step 109 guardrail');

for (const file of [component, page, api, server]) {
  assertNotIncludesAny(file, [
    'diagnose',
    'automatic vaccine schedule',
    'required vaccine schedule',
    'replace the veterinarian',
    'замества ветеринаря',
    'автоматичен ваксинационен график',
    'sostituisce il veterinario',
  ], `${file} avoids unsafe medical authority claims`);
}

for (const lockedFile of [
  'apps/web/app/(public)/registry/page.tsx',
  'apps/web/app/verify/page.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/(admin)/review/page.tsx',
]) {
  assertNotIncludes(lockedFile, 'OwnerHealthGrowthTracker', `${lockedFile} does not import owner health tracker`);
}

if (process.exitCode) {
  console.error('\n==========================================================');
  console.error('Step 109 QA FAILED');
  console.error('==========================================================');
  process.exit(process.exitCode);
}

console.log('\n==========================================================');
console.log('Step 109 QA PASS');
console.log('==========================================================');
