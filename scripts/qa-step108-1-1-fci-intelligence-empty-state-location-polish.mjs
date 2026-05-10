#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function read(file) { return readFileSync(path.join(root, file), 'utf8'); }
function assertFile(file) { existsSync(path.join(root, file)) ? pass(`Required file exists: ${file}`) : fail(`Missing required file: ${file}`); }
function assertIncludes(file, needle, label) { const source = read(file); source.includes(needle) ? pass(label) : fail(`${label}: missing ${needle}`); }
function assertNotIncludes(file, needle, label) { const source = read(file); source.includes(needle) ? fail(`${label}: found ${needle}`) : pass(label); }
function assertNotIncludesAny(file, needles, label) {
  const source = read(file).toLowerCase();
  const found = needles.filter((needle) => source.includes(needle.toLowerCase()));
  found.length ? fail(`${label}: found ${found.join(', ')}`) : pass(label);
}

console.log('\n==========================================================');
console.log('Step 108.1.1 — FCI / Intelligence Empty-State & Location Polish QA');
console.log('==========================================================\n');

const requiredFiles = [
  'apps/web/lib/dog-form.mock.ts',
  'apps/web/lib/fci-standard-conformity.ts',
  'apps/web/components/fci-standard-conformity-panel.tsx',
  'apps/web/components/usg-intelligence-foundation-panel.tsx',
  'docs/qa/step108-1-1-fci-intelligence-empty-state-location-polish.md',
  'scripts/qa-step108-1-1-fci-intelligence-empty-state-location-polish.mjs',
];
for (const file of requiredFiles) assertFile(file);

const mock = 'apps/web/lib/dog-form.mock.ts';
assertIncludes(mock, "city: '',", 'New dog draft city is empty');
assertIncludes(mock, "country: '',", 'New dog draft country is empty');
assertNotIncludes(mock, "city: 'Kardzhali'", 'New dog draft no longer assumes Kardzhali');

const fciPanel = 'apps/web/components/fci-standard-conformity-panel.tsx';
assertIncludes(fciPanel, 'pendingScore', 'FCI panel has pending score label');
assertIncludes(fciPanel, 'emptyState', 'FCI panel has calm empty-state copy');
assertIncludes(fciPanel, 'hasMinimumFciEvidence', 'FCI panel gates score display behind minimum evidence');
assertIncludes(fciPanel, "scoreDisplay(document.scores.overall, canShowScore, '—')", 'FCI summary hides numeric score when evidence is insufficient');
assertIncludes(fciPanel, "scoreDisplay(value, canShowScore, '—')", 'FCI score cards hide numeric percentages when evidence is insufficient');
assertIncludes(fciPanel, 'copy.confidenceValues[document.confidence]', 'FCI summary localizes confidence value');
assertIncludes(fciPanel, 'copy.confidenceValues[section.confidence]', 'FCI section metadata localizes confidence value');
assertIncludes(fciPanel, 'Още няма достатъчно данни', 'Bulgarian empty FCI state exists');
assertIncludes(fciPanel, 'Добави данни, преди това да се чете като оценка', 'Bulgarian empty-state title exists');
assertIncludes(fciPanel, 'FCI оценка за зряло куче', 'Bulgarian copy avoids raw adult wording');
assertIncludes(fciPanel, 'Граница за отклонения', 'Bulgarian copy avoids raw faults wording');
assertNotIncludes(fciPanel, '{document.confidence}', 'FCI panel does not render raw confidence value');
assertNotIncludes(fciPanel, '{section.confidence}', 'FCI panel does not render raw section confidence value');

const fciLib = 'apps/web/lib/fci-standard-conformity.ts';
assertIncludes(fciLib, "status: hasProfile ? 'human_review_required' : 'not_assessable_from_profile'", 'Faults boundary stays neutral for empty profiles');
assertIncludes(fciLib, 'score: hasProfile ? 60 : 0', 'Empty profile no longer receives phantom FCI points');
assertIncludes(fciLib, "if (score <= 0) return 'not_ready_for_conformity_orientation';", 'No-data FCI document remains not ready');

const intelligencePanel = 'apps/web/components/usg-intelligence-foundation-panel.tsx';
assertIncludes(intelligencePanel, 'future regression and data-assisted orientation', 'English intelligence copy avoids active ML claim');
assertIncludes(intelligencePanel, 'бъдеща регресия и интелигентен ориентир от данните', 'Bulgarian intelligence copy avoids raw ML label');
assertIncludes(intelligencePanel, 'futura regressione e orientamento assistito dai dati', 'Italian intelligence copy avoids raw ML label');
assertIncludes(intelligencePanel, '>USG</div>', 'Intelligence panel badge uses USG instead of ML');
assertNotIncludes(intelligencePanel, '>ML</div>', 'Intelligence panel no longer shows ML badge');

assertIncludes('apps/web/app/globals.css', '.fci-conformity-panel__empty-state', 'FCI empty state has CSS');

const pkg = JSON.parse(read('package.json'));
pkg.scripts?.['step108-1-1:fci-ux-polish:qa'] ? pass('Package script step108-1-1:fci-ux-polish:qa exists') : fail('Package script step108-1-1:fci-ux-polish:qa missing');

const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step108-1-1-fci-intelligence-empty-state-location-polish.md', 'Release QA requires Step 108.1.1 QA doc');
assertIncludes(release, 'scripts/qa-step108-1-1-fci-intelligence-empty-state-location-polish.mjs', 'Release QA requires Step 108.1.1 QA script');
assertIncludes(release, 'step108-1-1:fci-ux-polish:qa', 'Release QA requires Step 108.1.1 package script');
assertIncludes(release, 'Step 108.1.1 FCI/Intelligence empty-state and location polish', 'Release QA runs Step 108.1.1 guardrail');

const drizzleFiles = readdirSync(path.join(root, 'packages/db/drizzle'));
const step10811Migration = drizzleFiles.find((file) => /108-1-1|108\.1\.1|empty-state|location-polish/i.test(file));
step10811Migration ? fail(`Step 108.1.1 should not add DB migration, found: ${step10811Migration}`) : pass('No DB migration added for Step 108.1.1');

for (const file of [fciPanel, fciLib, intelligencePanel]) {
  assertNotIncludesAny(file, [
    'usg issues fci',
    'usg издава fci',
    'official fci certificate from usg',
    'automatic fci certificate',
    'automatically certifies',
    'proves the breed',
    'доказва породата',
    'detects disqualifying faults automatically',
  ], `${file} avoids unsafe authority claims`);
}

if (process.exitCode) {
  console.error('\n==========================================================');
  console.error('Step 108.1.1 QA FAILED');
  console.error('==========================================================');
  process.exit(process.exitCode);
}

console.log('\n==========================================================');
console.log('Step 108.1.1 QA PASS');
console.log('==========================================================');
