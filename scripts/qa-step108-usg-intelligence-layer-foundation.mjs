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
console.log('Step 108 — USG Intelligence Layer Foundation QA');
console.log('========================================\n');

const requiredFiles = [
  'packages/contracts/src/intelligence/usg-intelligence.types.ts',
  'apps/web/lib/usg-intelligence.ts',
  'apps/web/components/usg-intelligence-foundation-panel.tsx',
  'docs/architecture/usg-intelligence-layer-foundation.md',
  'docs/qa/step108-usg-intelligence-layer-foundation.md',
  'scripts/qa-step108-usg-intelligence-layer-foundation.mjs',
];

for (const file of requiredFiles) assertFile(file);

assertIncludes(
  'packages/contracts/src/index.ts',
  "export * from './intelligence/usg-intelligence.types';",
  'Contracts barrel exports the USG Intelligence contract',
);

assertIncludes(
  'apps/web/lib/usg-intelligence.ts',
  'buildUsgIntelligenceDocument',
  'USG Intelligence builder exists',
);
assertIncludes(
  'apps/web/lib/usg-intelligence.ts',
  "version: 'step108-foundation-v1'",
  'USG Intelligence document is versioned',
);
assertIncludes(
  'apps/web/lib/usg-intelligence.ts',
  'regression_not_trained_yet',
  'Future regression is explicitly not claimed as trained today',
);
assertIncludes(
  'apps/web/lib/usg-intelligence.ts',
  'not_automatic_admin_decision',
  'Authority boundary includes no automatic admin decision',
);

const component = 'apps/web/components/usg-intelligence-foundation-panel.tsx';
assertIncludes(component, 'USG интелигентен анализ', 'Bulgarian USG Intelligence copy exists');
assertIncludes(component, 'USG Intelligence foundation', 'English USG Intelligence copy exists');
assertIncludes(component, 'Analisi intelligente USG', 'Italian USG Intelligence copy exists');
assertIncludes(component, 'Това не е USG сертификат.', 'Bulgarian certificate boundary exists');
assertIncludes(component, 'Questo non è un certificato USG.', 'Italian certificate boundary exists');
assertIncludes(component, 'This is not a USG certificate.', 'English certificate boundary exists');
assertIncludes(component, 'няма обучен модел', 'Bulgarian no-trained-model evidence exists');
assertIncludes(component, 'nessun modello addestrato ancora', 'Italian no-trained-model evidence exists');

assertIncludes(
  'apps/web/components/my-dog-form-workspace.tsx',
  "import { UsgIntelligenceFoundationPanel } from '@/components/usg-intelligence-foundation-panel';",
  'Owner dog form imports USG Intelligence panel',
);
assertIncludes(
  'apps/web/components/my-dog-form-workspace.tsx',
  '<UsgIntelligenceFoundationPanel',
  'Owner dog form renders USG Intelligence panel',
);
assertIncludes(
  'apps/web/components/my-dog-form-workspace.tsx',
  '<UsgMeasurementAssistantPanel',
  'Measurement assistant remains present after USG Intelligence panel',
);

assertIncludes('apps/web/app/globals.css', 'Step 108 — USG Intelligence Layer Foundation', 'Step 108 CSS block exists');
assertIncludes('apps/web/app/globals.css', '.usg-intelligence-panel', 'USG Intelligence panel CSS exists');
assertIncludes('apps/web/app/globals.css', "[data-theme='heritage'] .usg-intelligence-panel", 'Heritage theme support exists');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step108:usg-intelligence:qa']) pass('Package script step108:usg-intelligence:qa exists');
else fail('Package script step108:usg-intelligence:qa missing');

assertIncludes(
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'docs/qa/step108-usg-intelligence-layer-foundation.md',
  'All-in-one release QA requires Step 108 QA doc',
);
assertIncludes(
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'scripts/qa-step108-usg-intelligence-layer-foundation.mjs',
  'All-in-one release QA requires Step 108 QA script',
);
assertIncludes(
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'step108:usg-intelligence:qa',
  'All-in-one release QA requires Step 108 package script',
);

const drizzleFiles = readdirSync(path.join(root, 'packages/db/drizzle'));
const step108Migration = drizzleFiles.find((file) => /0014|intelligence/i.test(file));
if (step108Migration) fail(`Step 108 should not add DB migration, found: ${step108Migration}`);
else pass('No DB migration added for Step 108 foundation');

const unsafeClaims = [
  'ai certifies',
  'ai certificate',
  'automatic certificate',
  'automatically certifies',
  'proves the breed',
  'proves breed',
  'diagnoses health',
  'trained model is active',
  'model decides',
  'ml decides',
];
for (const file of [component, 'apps/web/lib/usg-intelligence.ts', 'docs/architecture/usg-intelligence-layer-foundation.md']) {
  assertNotIncludesAny(file, unsafeClaims, `${file} avoids unsafe AI/ML authority claims`);
}

if (process.exitCode) {
  console.error('\n========================================');
  console.error('Step 108 USG Intelligence Layer Foundation QA FAILED');
  console.error('========================================');
  process.exit(process.exitCode);
}

console.log('\n========================================');
console.log('Step 108 USG Intelligence Layer Foundation QA PASS');
console.log('========================================');
