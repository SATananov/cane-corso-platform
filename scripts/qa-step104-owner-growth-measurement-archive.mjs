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

console.log('--- Step 104 Owner Growth Measurement Archive QA ---');

const requiredFiles = [
  'packages/contracts/src/dogs/dog-measurement.types.ts',
  'packages/db/src/schema/dogs.ts',
  'packages/db/src/schema/relations.ts',
  'packages/db/drizzle/0013_dog_growth_records.sql',
  'packages/db/src/repositories/dog-measurements.repository.ts',
  'apps/web/lib/dog-measurements.server.ts',
  'apps/web/lib/api/dog-measurements.client.ts',
  'apps/web/app/api/dogs/[dogId]/measurements/route.ts',
  'apps/web/lib/usg-measurement-assistant.ts',
  'apps/web/components/usg-measurement-assistant-panel.tsx',
  'apps/web/components/my-dog-form-workspace.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step104-owner-growth-measurement-archive.md',
  'scripts/qa-step104-owner-growth-measurement-archive.mjs',
  'package.json',
  'README.md',
];

for (const file of requiredFiles) assertFile(file);

const contract = read('packages/contracts/src/dogs/dog-measurement.types.ts');
assertIncludes('Contract defines measurement record', contract, 'interface DogMeasurementRecord');
assertIncludes('Contract defines collection document', contract, 'interface DogMeasurementsDocument');
assertIncludes('Contract defines create input', contract, 'interface CreateDogMeasurementInput');
assertIncludes('Contracts barrel exports measurement types', read('packages/contracts/src/index.ts'), "./dogs/dog-measurement.types");

const schema = read('packages/db/src/schema/dogs.ts');
assertIncludes('DB schema defines dog measurement records table', schema, "dog_measurement_records");
assertIncludes('DB schema links measurements to dog', schema, "references(() => dogs.id");
assertIncludes('DB schema links measurements to owner profile', schema, "recorded_by_profile_id");
assertIncludes('DB schema stores measured date', schema, "measured_at");

const migration = read('packages/db/drizzle/0013_dog_growth_records.sql');
assertIncludes('Migration creates measurement records table', migration, 'CREATE TABLE IF NOT EXISTS "dog_measurement_records"');
assertIncludes('Migration adds dog/date index', migration, 'dog_measurement_records_dog_date_idx');
assertIncludes('Migration adds owner index', migration, 'dog_measurement_records_owner_idx');

const repository = read('packages/db/src/repositories/dog-measurements.repository.ts');
assertIncludes('Repository exports factory', repository, 'createDogMeasurementsRepository');
assertIncludes('Repository lists by owner dog', repository, 'listByDogId');
assertIncludes('Repository creates private record', repository, 'create(ownerProfileId');
assertIncludes('Repository deletes private record', repository, 'delete(ownerProfileId');
assertIncludes('Repository checks dog ownership', repository, 'getOwnerDog');
assertIncludes('DB barrel exports repository', read('packages/db/src/index.ts'), "./repositories/dog-measurements.repository");

const server = read('apps/web/lib/dog-measurements.server.ts');
assertIncludes('Server helper uses member session', server, 'getCurrentMemberSession');
assertIncludes('Server helper normalizes date', server, 'normalizeMeasuredAt');
assertIncludes('Server helper validates measurement values', server, 'INVALID_MEASUREMENT_VALUE');

const route = read('apps/web/app/api/dogs/[dogId]/measurements/route.ts');
assertIncludes('API route is dynamic', route, "dynamic = 'force-dynamic'");
assertIncludes('API route exposes GET', route, 'export async function GET');
assertIncludes('API route exposes POST', route, 'export async function POST');
assertIncludes('API route exposes DELETE', route, 'export async function DELETE');
assertIncludes('API route blocks missing session', route, 'SESSION_NOT_AVAILABLE');
assertIncludes('API route keeps owner dog boundary', route, 'DOG_NOT_FOUND');

const client = read('apps/web/lib/api/dog-measurements.client.ts');
assertIncludes('Client API lists records', client, 'listDogMeasurements');
assertIncludes('Client API creates records', client, 'createDogMeasurement');
assertIncludes('Client API deletes records', client, 'deleteDogMeasurement');

const helper = read('apps/web/lib/usg-measurement-assistant.ts');
assertIncludes('Evaluator supports measurement date', helper, 'measurementDate?: string | null');
assertIncludes('Evaluator calculates age as of measurement date', helper, 'referenceDate = measurementDate');

const panel = read('apps/web/components/usg-measurement-assistant-panel.tsx');
assertIncludes('Panel imports dog measurement API', panel, "@/lib/api/dog-measurements.client");
assertIncludes('Panel accepts dogId', panel, 'dogId?: string');
assertIncludes('Panel renders private archive copy', panel, 'Личен архив с измервания');
assertIncludes('Panel saves measurements', panel, 'handleSave');
assertIncludes('Panel loads saved measurements', panel, 'listDogMeasurements');
assertIncludes('Panel deletes measurements', panel, 'deleteDogMeasurement');
assertIncludes('Panel renders archive table', panel, 'measurement-archive-table');
assertIncludes('Panel shows latest movement', panel, 'latestMovement');
assertIncludes('Panel keeps non-certification safety boundary', panel, 'не сертифицира автоматично');

const workspace = read('apps/web/components/my-dog-form-workspace.tsx');
assertIncludes('Dog form passes active dog id to measurement panel', workspace, 'dogId={activeDogId}');

const css = read('apps/web/app/globals.css');
assertIncludes('Measurement archive CSS exists', css, 'Step 104 — Owner Measurement Archive');
assertIncludes('Measurement archive table CSS exists', css, '.measurement-archive-table');
assertIncludes('Measurement archive status CSS exists', css, '.measurement-archive-status--attention');
assertIncludes('Measurement archive responsive CSS exists', css, '@media (max-width: 640px)');

const doc = read('docs/qa/step104-owner-growth-measurement-archive.md');
assertIncludes('Step 104 doc records private archive behavior', doc, 'owner-private tracking archive');
assertIncludes('Step 104 doc records API routes', doc, 'GET /api/dogs/[dogId]/measurements');
assertIncludes('Step 104 doc records authority boundaries', doc, 'does not approve Registry publication');

const packageJson = JSON.parse(read('package.json'));
if (packageJson.scripts?.['step104:growth-archive:qa']) pass('Package script step104:growth-archive:qa exists');
else fail('Package script step104:growth-archive:qa exists');

const releaseQa = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');
assertIncludes('All-in-one release QA includes Step 104 doc', releaseQa, 'docs/qa/step104-owner-growth-measurement-archive.md');
assertIncludes('All-in-one release QA includes Step 104 script', releaseQa, 'scripts/qa-step104-owner-growth-measurement-archive.mjs');
assertIncludes('All-in-one release QA runs Step 104 guardrail', releaseQa, 'Step 104 owner growth measurement archive');

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
  console.error('Step 104 Owner Growth Measurement Archive QA failed.');
  process.exit(process.exitCode);
}

console.log('Step 104 Owner Growth Measurement Archive QA complete.');
