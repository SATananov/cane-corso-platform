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
console.log('Step 113 — SoftUni Demo Member & Partner Data Pack QA');
console.log('==========================================================\n');

const requiredFiles = [
  'packages/db/scripts/seed-softuni-demo-data.mjs',
  'docs/qa/step113-softuni-demo-data-pack.md',
  'scripts/qa-step113-softuni-demo-data-pack.mjs',
  'apps/web/public/demo/step113/softuni-demo-owner.svg',
  'apps/web/public/demo/step113/softuni-demo-cane-primary.svg',
  'apps/web/public/demo/step113/softuni-demo-cane-side.svg',
  'apps/web/public/demo/step113/softuni-partner-cover.svg',
  'apps/web/public/demo/step113/softuni-community-cover.svg',
  'package.json',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
];
for (const file of requiredFiles) assertFile(file);

const seed = 'packages/db/scripts/seed-softuni-demo-data.mjs';
assertIncludes(seed, 'SoftUni demo', 'Seed uses locked demo member display name');
assertIncludes(seed, 'SoftUni Partner', 'Seed uses locked demo partner display name');
assertIncludes(seed, 'SoftUni admin', 'Seed uses locked demo admin display name');
assertIncludes(seed, 'softuni.demo@usg.local', 'Seed provides member login email');
assertIncludes(seed, 'softuni.partner@usg.local', 'Seed provides partner login email');
assertIncludes(seed, 'softuni.admin@usg.local', 'Seed provides admin login email');
assertIncludes(seed, 'DemoMember123!', 'Seed provides member demo password');
assertIncludes(seed, 'DemoPartner123!', 'Seed provides partner demo password');
assertIncludes(seed, 'DemoAdmin123!', 'Seed provides admin demo password');
assertIncludes(seed, 'Ares SoftUni demo', 'Seed creates full Cane Corso demo profile');
assertIncludes(seed, 'dog_measurement_records', 'Seed creates measurement archive records');
assertIncludes(seed, 'age_months', 'Seed includes age/months data for growth tables');
assertIncludes(seed, 'weight_kg', 'Seed includes weight data for growth charts');
assertIncludes(seed, 'height_withers_cm', 'Seed includes height data for FCI comparison');
assertIncludes(seed, 'body_length_cm', 'Seed includes body proportion data for FCI comparison');
assertIncludes(seed, 'head_length_cm', 'Seed includes head proportion data for FCI comparison');
assertIncludes(seed, 'muzzle_length_cm', 'Seed includes muzzle/skull data for FCI comparison');
assertIncludes(seed, 'dog_health_records', 'Seed creates health archive records');
assertIncludes(seed, 'dog_admin_assessments', 'Seed creates admin assessment');
assertIncludes(seed, 'registry_approved', 'Seed marks registry decision approved');
assertIncludes(seed, 'usg_certified', 'Seed marks certificate decision certified');
assertIncludes(seed, 'registry_entries', 'Seed creates public Registry entry');
assertIncludes(seed, 'USG-SOFTUNI-DEMO-113', 'Seed creates active Verify certificate code');
assertIncludes(seed, 'registry_entry_ratings', 'Seed creates Registry community ratings');
assertIncludes(seed, 'partner_ratings', 'Seed creates Partner ratings');
assertIncludes(seed, 'partner_applications', 'Seed creates pending Partner Application');
assertIncludes(seed, 'ecosystem_listings', 'Seed creates Ecosystem listings');
assertIncludes(seed, 'breeding_match', 'Seed covers sensitive admin-mediated match listing');
assertIncludes(seed, 'pet_friendly_place', 'Seed covers Cane Corso-friendly place listing');
assertIncludes(seed, 'lost_found', 'Seed covers lost/found moderation listing');
assertIncludes(seed, 'ecosystem_match_requests', 'Seed covers match request queue');
assertIncludes(seed, 'DATABASE_URL is required for demo:seed:softuni', 'Seed refuses to run without explicit database target');
assertIncludes(seed, 'BEGIN', 'Seed runs inside transaction');
assertIncludes(seed, 'COMMIT', 'Seed commits transaction only after all data is seeded');
assertIncludes(seed, 'ROLLBACK', 'Seed rolls back on failure');
assertIncludes(seed, 'ON CONFLICT', 'Seed is idempotent through upserts');
assertNotIncludes(seed, 'TRUNCATE', 'Seed does not truncate tables');
assertNotIncludes(seed, 'DROP TABLE', 'Seed does not drop tables');
assertNotIncludes(seed, 'DELETE FROM users', 'Seed does not broadly delete users');
assertNotIncludes(seed, 'DELETE FROM profiles', 'Seed does not broadly delete profiles');

assertIncludes('docs/qa/step113-softuni-demo-data-pack.md', 'pnpm demo:seed:softuni', 'Step 113 docs include seed command');
assertIncludes('docs/qa/step113-softuni-demo-data-pack.md', '/registry/ares-softuni-demo', 'Step 113 docs include Registry route');
assertIncludes('docs/qa/step113-softuni-demo-data-pack.md', '/verify/USG-SOFTUNI-DEMO-113', 'Step 113 docs include Verify route');
assertIncludes('docs/qa/step113-softuni-demo-data-pack.md', 'Health & Growth', 'Step 113 docs mention health/growth review');
assertIncludes('docs/qa/step113-softuni-demo-data-pack.md', 'FCI orientation', 'Step 113 docs mention FCI orientation review');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['demo:seed:softuni']) pass('Package script demo:seed:softuni exists');
else fail('Package script demo:seed:softuni missing');
if (pkg.scripts?.['step113:demo-data:qa']) pass('Package script step113:demo-data:qa exists');
else fail('Package script step113:demo-data:qa missing');

assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'docs/qa/step113-softuni-demo-data-pack.md', 'Release QA requires Step 113 docs');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'scripts/qa-step113-softuni-demo-data-pack.mjs', 'Release QA requires Step 113 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', "['Step 113 SoftUni demo data pack'", 'Release QA runs Step 113 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'step113:demo-data:qa', 'Release QA requires Step 113 package script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'demo:seed:softuni', 'Release QA requires demo seed package script');

if (process.exitCode) {
  console.error('\nStep 113 SoftUni Demo Data Pack QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 113 SoftUni Demo Data Pack QA PASS');
