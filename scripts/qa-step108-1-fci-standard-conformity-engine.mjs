#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function read(file) {
  return readFileSync(path.join(root, file), 'utf8');
}

function assertFile(file) {
  if (!existsSync(path.join(root, file))) fail(`Missing required file: ${file}`);
  else pass(`Required file exists: ${file}`);
}

function assertIncludes(file, needle, label) {
  const source = read(file);
  if (!source.includes(needle)) fail(`${label}: missing ${needle}`);
  else pass(label);
}

function assertNotIncludesAny(file, needles, label) {
  const source = read(file).toLowerCase();
  const found = needles.filter((needle) => source.includes(needle.toLowerCase()));
  if (found.length) fail(`${label}: unsafe wording found: ${found.join(', ')}`);
  else pass(label);
}

console.log('\n========================================');
console.log('Step 108.1 — FCI Standard Conformity Engine QA');
console.log('========================================\n');

const requiredFiles = [
  'packages/contracts/src/intelligence/fci-standard-conformity.types.ts',
  'apps/web/lib/fci-standard-conformity.ts',
  'apps/web/components/fci-standard-conformity-panel.tsx',
  'docs/architecture/fci-standard-conformity-engine.md',
  'docs/qa/step108-1-fci-standard-conformity-engine.md',
  'scripts/qa-step108-1-fci-standard-conformity-engine.mjs',
];

for (const file of requiredFiles) assertFile(file);

assertIncludes(
  'packages/contracts/src/index.ts',
  "export * from './intelligence/fci-standard-conformity.types';",
  'Contracts barrel exports FCI conformity contract',
);

assertIncludes('apps/web/lib/fci-standard-conformity.ts', 'buildFciStandardConformityDocument', 'FCI conformity builder exists');
assertIncludes('apps/web/lib/fci-standard-conformity.ts', "version: 'step108-1-fci-conformity-v1'", 'FCI document is versioned');
assertIncludes('apps/web/lib/fci-standard-conformity.ts', "number: 'FCI Standard No. 343'", 'FCI Standard No. 343 is encoded');
assertIncludes('apps/web/lib/fci-standard-conformity.ts', "officialValidDate: '2023-09-25'", 'Official valid standard date is encoded');
assertIncludes('apps/web/lib/fci-standard-conformity.ts', 'body_length_11_percent', 'Body length +11% rule is represented');
assertIncludes('apps/web/lib/fci-standard-conformity.ts', 'head_length_36_percent', 'Head length 36% rule is represented');
assertIncludes('apps/web/lib/fci-standard-conformity.ts', 'muzzle_skull_1_to_2', 'Muzzle/skull 1:2 rule is represented');
assertIncludes('apps/web/lib/fci-standard-conformity.ts', 'puppy_development_projection', 'Puppy mode is represented');
assertIncludes('apps/web/lib/fci-standard-conformity.ts', 'disqualifying_faults_not_auto_detected', 'Fault detection boundary is represented');

const component = 'apps/web/components/fci-standard-conformity-panel.tsx';
assertIncludes(component, 'FCI съответствие, отделно от USG сертификата', 'Bulgarian FCI/USG separation copy exists');
assertIncludes(component, 'FCI conformity signal, separate from USG certificate', 'English FCI/USG separation copy exists');
assertIncludes(component, 'Conformità FCI separata dal certificato USG', 'Italian FCI/USG separation copy exists');
assertIncludes(component, 'USG сертификатът не е FCI сертификат', 'Bulgarian USG is not FCI certificate boundary exists');
assertIncludes(component, 'USG certificate is not an FCI certificate', 'English USG is not FCI certificate boundary exists');
assertIncludes(component, 'Il certificato USG non è certificato FCI', 'Italian USG is not FCI certificate boundary exists');
assertIncludes(component, 'puppy_development_projection', 'Component handles puppy development-only mode');
assertIncludes(component, 'listDogMeasurements', 'Component reads latest owner measurement archive');

assertIncludes(
  'apps/web/components/my-dog-form-workspace.tsx',
  "import { FciStandardConformityPanel } from '@/components/fci-standard-conformity-panel';",
  'Owner dog form imports FCI conformity panel',
);
assertIncludes('apps/web/components/my-dog-form-workspace.tsx', '<FciStandardConformityPanel', 'Owner dog form renders FCI conformity panel');
assertIncludes('apps/web/components/my-dog-form-workspace.tsx', '<UsgMeasurementAssistantPanel', 'Measurement assistant remains present');

const workspaceSource = read('apps/web/components/my-dog-form-workspace.tsx');
const fciIndex = workspaceSource.indexOf('<FciStandardConformityPanel');
const measurementIndex = workspaceSource.indexOf('<UsgMeasurementAssistantPanel');
if (fciIndex > -1 && measurementIndex > -1 && fciIndex < measurementIndex) pass('FCI panel renders before Measurement Assistant');
else fail('FCI panel should render before Measurement Assistant');

assertIncludes('apps/web/app/globals.css', 'Step 108.1 — FCI Standard Conformity Engine', 'Step 108.1 CSS block exists');
assertIncludes('apps/web/app/globals.css', '.fci-conformity-panel', 'FCI conformity panel CSS exists');
assertIncludes('apps/web/app/globals.css', "[data-theme='heritage'] .fci-conformity-panel", 'Heritage theme support exists');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step108-1:fci-conformity:qa']) pass('Package script step108-1:fci-conformity:qa exists');
else fail('Package script step108-1:fci-conformity:qa missing');

assertIncludes(
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'docs/qa/step108-1-fci-standard-conformity-engine.md',
  'All-in-one release QA requires Step 108.1 QA doc',
);
assertIncludes(
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'scripts/qa-step108-1-fci-standard-conformity-engine.mjs',
  'All-in-one release QA requires Step 108.1 QA script',
);
assertIncludes(
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'step108-1:fci-conformity:qa',
  'All-in-one release QA requires Step 108.1 package script',
);
assertIncludes(
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'Step 108.1 FCI Standard conformity engine',
  'All-in-one release QA runs Step 108.1 guardrail',
);

const drizzleFiles = readdirSync(path.join(root, 'packages/db/drizzle'));
const step1081Migration = drizzleFiles.find((file) => /108|108-1|fci|conformity/i.test(file));
if (step1081Migration) fail(`Step 108.1 should not add DB migration, found: ${step1081Migration}`);
else pass('No DB migration added for Step 108.1');

const unsafeClaims = [
  'usg issues fci',
  'usg издава fci',
  'official fci certificate from usg',
  'automatic fci certificate',
  'automatically certifies',
  'proves the breed',
  'proves breed identity',
  'доказва породата',
  'final adult fci judgment for puppy',
  'detects disqualifying faults automatically',
  'automatic registry approval',
];
for (const file of [component, 'apps/web/lib/fci-standard-conformity.ts', 'docs/architecture/fci-standard-conformity-engine.md']) {
  assertNotIncludesAny(file, unsafeClaims, `${file} avoids unsafe FCI/USG authority claims`);
}

if (process.exitCode) {
  console.error('\n========================================');
  console.error('Step 108.1 FCI Standard Conformity Engine QA FAILED');
  console.error('========================================');
  process.exit(process.exitCode);
}

console.log('\n========================================');
console.log('Step 108.1 FCI Standard Conformity Engine QA PASS');
console.log('========================================');
