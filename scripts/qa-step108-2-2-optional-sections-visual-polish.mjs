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
console.log('Step 108.2.2 — Optional sections visual polish QA');
console.log('==========================================================\n');

const requiredFiles = [
  'apps/web/components/dog-profile-form.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step108-2-2-optional-sections-visual-polish.md',
  'scripts/qa-step108-2-2-optional-sections-visual-polish.mjs',
];
for (const file of requiredFiles) assertFile(file);

const form = 'apps/web/components/dog-profile-form.tsx';
assertIncludes(form, "identityHint: 'Микрочип и родословен номер'", 'Bulgarian documents card has a concise helper line');
assertIncludes(form, "presentationHint: 'Кратко представяне'", 'Bulgarian presentation card has a concise helper line');
assertIncludes(form, "locationHint: 'Град и държава'", 'Bulgarian location card has a concise helper line');
assertIncludes(form, "pedigreeHint: 'Родители и семейна линия'", 'Bulgarian pedigree card has a concise helper line');
assertIncludes(form, "checksHint: 'Анализ и измервания'", 'Bulgarian USG/FCI card has a concise helper line');
assertIncludes(form, 'const panelCards: Array<{ panel: ProgressivePanelKey; label: string; hint: string }>', 'Progressive launcher uses structured card metadata');
assertIncludes(form, 'dog-form-progressive-actions__button-title', 'Optional cards render a dedicated title span');
assertIncludes(form, 'dog-form-progressive-actions__button-hint', 'Optional cards render a dedicated hint span');
assertIncludes(form, 'dog-form-progressive-actions__button-state', 'Optional cards render a compact state badge');
assertNotIncludes(form, 'className={`button-secondary dog-form-progressive-actions__button', 'Optional cards no longer inherit cramped secondary-button layout');
assertIncludes(form, 'openPanels.identity ? (', 'Identity section remains collapsed/optional');
assertIncludes(form, 'openPanels.presentation ? (', 'Presentation section remains collapsed/optional');
assertIncludes(form, 'openPanels.location ? (', 'Location section remains collapsed/optional');
assertIncludes(form, 'openPanels.pedigree ? (', 'Pedigree section remains collapsed/optional');
assertIncludes(form, 'openPanels.checks ? (', 'USG/FCI section remains collapsed/optional');

const css = 'apps/web/app/globals.css';
assertIncludes(css, 'Step 108.2.2 — Optional sections visual polish START', 'Step 108.2.2 CSS block exists');
assertIncludes(css, '.dog-form-progressive-actions__button-title', 'Optional card title CSS exists');
assertIncludes(css, '.dog-form-progressive-actions__button-hint', 'Optional card helper CSS exists');
assertIncludes(css, '.dog-form-progressive-actions__button-state', 'Optional card state badge CSS exists');
assertIncludes(css, 'min-height: 92px;', 'Optional cards have enough vertical rhythm');
assertIncludes(css, 'grid-template-columns: repeat(auto-fit, minmax(154px, 1fr));', 'Optional cards use wider responsive columns');
assertIncludes(css, 'font-size: clamp(1.35rem, 2.35vw, 1.85rem);', 'Optional launcher headline has stronger hierarchy');

const pkg = JSON.parse(read('package.json'));
pkg.scripts?.['step108-2-2:optional-visual-polish:qa'] ? pass('Package script step108-2-2:optional-visual-polish:qa exists') : fail('Package script step108-2-2:optional-visual-polish:qa missing');
const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step108-2-2-optional-sections-visual-polish.md', 'Release QA requires Step 108.2.2 QA doc');
assertIncludes(release, 'scripts/qa-step108-2-2-optional-sections-visual-polish.mjs', 'Release QA requires Step 108.2.2 QA script');
assertIncludes(release, 'Step 108.2.2 Optional sections visual polish', 'Release QA runs Step 108.2.2 guardrail');

const drizzleFiles = readdirSync(path.join(root, 'packages/db/drizzle'));
const step10822Migration = drizzleFiles.find((file) => /108-2-2|108\.2\.2|optional-visual|visual-polish/i.test(file));
step10822Migration ? fail(`Step 108.2.2 should not add DB migration, found: ${step10822Migration}`) : pass('No DB migration added for Step 108.2.2');

for (const file of [form]) {
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
  console.error('Step 108.2.2 QA FAILED');
  console.error('==========================================================');
  process.exit(process.exitCode);
}

console.log('\n==========================================================');
console.log('Step 108.2.2 QA PASS');
console.log('==========================================================');
