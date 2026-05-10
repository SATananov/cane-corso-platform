#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
console.log('Step 108.2.1 — Basic-first profile layout repair QA');
console.log('==========================================================\n');

const requiredFiles = [
  'apps/web/components/dog-profile-form.tsx',
  'apps/web/components/my-dog-form-workspace.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step108-2-1-basic-first-profile-layout-repair.md',
  'scripts/qa-step108-2-1-basic-first-profile-layout-repair.mjs',
];
for (const file of requiredFiles) assertFile(file);

const form = 'apps/web/components/dog-profile-form.tsx';
assertIncludes(form, "identityCta: 'Документи'", 'Bulgarian optional identity label is short');
assertIncludes(form, "presentationCta: 'Описание'", 'Bulgarian optional presentation label is short');
assertIncludes(form, "pedigreeCta: 'Родословие'", 'Bulgarian optional pedigree label is short');
assertIncludes(form, "checksCta: 'USG / FCI'", 'Optional USG/FCI label is compact');
assertIncludes(form, "identityCta: 'Documents'", 'English optional identity label is short');
assertIncludes(form, "presentationCta: 'Story'", 'English optional presentation label is short');
assertIncludes(form, "identityCta: 'Documenti'", 'Italian optional identity label is short');
assertIncludes(form, 'dog-form-progressive-actions__grid', 'Progressive launcher grid remains rendered');
assertIncludes(form, 'openPanels.identity ? (', 'Identity section remains collapsed/optional');
assertIncludes(form, 'openPanels.presentation ? (', 'Presentation section remains collapsed/optional');
assertIncludes(form, 'openPanels.location ? (', 'Location section remains collapsed/optional');
assertIncludes(form, 'openPanels.pedigree ? (', 'Pedigree section remains collapsed/optional');
assertIncludes(form, 'openPanels.checks ? (', 'USG/FCI section remains collapsed/optional');
assertNotIncludes(form, "identityCta: 'Документи / идентичност'", 'Old long Bulgarian identity label removed');
assertNotIncludes(form, "pedigreeCta: 'Родители / родословие'", 'Old long Bulgarian pedigree label removed');
assertNotIncludes(form, "checksCta: 'Преглед / сертификат'", 'Old long Bulgarian review/certificate label removed from launcher');

const css = 'apps/web/app/globals.css';
assertIncludes(css, 'Step 108.2.1 — Basic-first profile layout repair START', 'Step 108.2.1 CSS block exists');
assertIncludes(css, 'grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));', 'Progressive launcher uses responsive auto-fit grid');
assertIncludes(css, 'overflow-wrap: anywhere;', 'Progressive launcher buttons cannot force narrow overflow');
assertIncludes(css, 'white-space: normal;', 'Progressive launcher buttons allow clean wrapping');
assertIncludes(css, '.dog-form-progressive-actions__copy,', 'Progressive copy has explicit min-width handling');
assertIncludes(css, 'max-width: 68ch;', 'Progressive copy keeps readable line length');
assertIncludes(css, 'grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));', 'Fixed launcher area no longer uses the Step 108.2 five-button row');

const pkg = JSON.parse(read('package.json'));
pkg.scripts?.['step108-2-1:profile-layout-repair:qa'] ? pass('Package script step108-2-1:profile-layout-repair:qa exists') : fail('Package script step108-2-1:profile-layout-repair:qa missing');
const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step108-2-1-basic-first-profile-layout-repair.md', 'Release QA requires Step 108.2.1 QA doc');
assertIncludes(release, 'scripts/qa-step108-2-1-basic-first-profile-layout-repair.mjs', 'Release QA requires Step 108.2.1 QA script');
assertIncludes(release, 'Step 108.2.1 Basic-first profile layout repair', 'Release QA runs Step 108.2.1 guardrail');

const drizzleFiles = readdirSync(path.join(root, 'packages/db/drizzle'));
const step10821Migration = drizzleFiles.find((file) => /108-2-1|108\.2\.1|layout-repair|profile-layout/i.test(file));
step10821Migration ? fail(`Step 108.2.1 should not add DB migration, found: ${step10821Migration}`) : pass('No DB migration added for Step 108.2.1');

for (const file of [form, 'apps/web/components/my-dog-form-workspace.tsx']) {
  assertNotIncludesAny(file, [
    'automatic fci certificate',
    'usg issues fci',
    'usg издава fci',
    'proves the breed',
    'доказва породата',
    'automatically certifies',
  ], `${file} avoids unsafe authority claims`);
}

if (process.exitCode) {
  console.error('\n==========================================================');
  console.error('Step 108.2.1 QA FAILED');
  console.error('==========================================================');
  process.exit(process.exitCode);
}

console.log('\n==========================================================');
console.log('Step 108.2.1 QA PASS');
console.log('==========================================================');
