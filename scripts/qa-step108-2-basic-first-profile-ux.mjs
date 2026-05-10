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
console.log('Step 108.2 — Basic-first Cane Corso Profile UX QA');
console.log('==========================================================\n');

const requiredFiles = [
  'apps/web/components/dog-profile-form.tsx',
  'apps/web/components/my-dog-form-workspace.tsx',
  'apps/web/components/dog-profile-preview-card.tsx',
  'apps/web/components/my-dog-card.tsx',
  'apps/web/lib/dog-form.mock.ts',
  'apps/web/lib/dog-form.types.ts',
  'apps/web/lib/dog-form.validation.ts',
  'apps/web/lib/fci-standard-conformity.ts',
  'apps/web/lib/usg-measurement-assistant.ts',
  'apps/web/app/globals.css',
  'packages/contracts/src/dogs/dog.types.ts',
  'packages/contracts/src/intelligence/fci-standard-conformity.types.ts',
  'docs/qa/step108-2-basic-first-profile-ux.md',
  'scripts/qa-step108-2-basic-first-profile-ux.mjs',
];
for (const file of requiredFiles) assertFile(file);

const form = 'apps/web/components/dog-profile-form.tsx';
assertIncludes(form, 'profileFlowCopy', 'Dog form has localized progressive copy');
assertIncludes(form, "type ProgressivePanelKey = 'identity' | 'presentation' | 'location' | 'pedigree' | 'checks';", 'Dog form defines progressive panel keys');
assertIncludes(form, 'basic-profile-helper-card', 'Dog form shows basic-first helper card');
assertIncludes(form, 'dog-form-progressive-actions', 'Dog form shows optional section launcher');
assertIncludes(form, 'setOpenPanels', 'Dog form controls optional sections with state');
assertIncludes(form, "{ value: 'unknown', label: flowT.selectSex }", 'Sex select starts with an explicit placeholder option');
assertIncludes(form, "values.sex === 'male' ? t.fields.male : values.sex === 'female' ? t.fields.female : flowT.notSet", 'Dog form no longer renders unknown sex as female');
assertIncludes(form, 'openPanels.identity ? (', 'Identity details are optional/collapsed');
assertIncludes(form, 'openPanels.presentation ? (', 'Presentation section is optional/collapsed');
assertIncludes(form, 'openPanels.location ? (', 'Location section is optional/collapsed');
assertIncludes(form, 'openPanels.pedigree ? (', 'Pedigree section is optional/collapsed');
assertIncludes(form, 'openPanels.checks ? (', 'USG review/status tools are optional/collapsed');
assertNotIncludes(form, "{ value: 'male', label: t.fields.male },\n                { value: 'female', label: t.fields.female },\n              ]}\n            />\n          </label>", 'Sex select does not silently default to male-only/female-only options');

const workspace = 'apps/web/components/my-dog-form-workspace.tsx';
assertIncludes(workspace, 'guidanceLauncherCopy', 'Workspace has guidance launcher copy');
assertIncludes(workspace, 'isGuidanceVisible', 'Workspace hides USG/FCI guidance behind a toggle');
assertIncludes(workspace, 'dog-form-guidance-launcher', 'Workspace renders optional guidance launcher');
assertIncludes(workspace, 'isGuidanceVisible ? (', 'USG Intelligence / FCI / Measurement panels render only when opened');
assertIncludes(workspace, 'Профилът може да започне с основни данни', 'Bulgarian copy explains basic-first flow');

assertIncludes('apps/web/lib/dog-form.mock.ts', "sex: 'unknown',", 'New dog draft no longer assumes male sex');
assertIncludes('apps/web/lib/dog-form.mock.ts', "city: '',", 'New dog draft keeps city empty');
assertIncludes('apps/web/lib/dog-form.mock.ts', "country: '',", 'New dog draft keeps country empty');
assertIncludes('apps/web/lib/dog-form.types.ts', "export type DogSex = 'unknown' | 'male' | 'female';", 'Dog form values support unknown sex for drafts');
assertIncludes('packages/contracts/src/dogs/dog.types.ts', "export type DogSex = 'unknown' | 'male' | 'female';", 'Contracts support unknown sex for drafts');
assertIncludes('apps/web/lib/dog-form.validation.ts', "values.sex === 'unknown'", 'Submit validation requires sex before review');
assertIncludes('apps/web/lib/i18n.ts', 'sexRequired', 'i18n validation copy includes sexRequired');

assertIncludes('apps/web/lib/fci-standard-conformity.ts', "type StandardSex = Exclude<DogSex, 'unknown'>;", 'FCI engine handles unknown sex safely');
assertIncludes('apps/web/lib/fci-standard-conformity.ts', 'sex_needed_for_standard_range', 'FCI engine records sex-needed evidence');
assertIncludes('packages/contracts/src/intelligence/fci-standard-conformity.types.ts', "| 'sex_needed_for_standard_range'", 'FCI evidence key includes sex-needed state');
assertIncludes('apps/web/lib/usg-measurement-assistant.ts', "type StandardSex = Exclude<DogSex, 'unknown'>;", 'Measurement assistant handles unknown sex safely');
assertIncludes('apps/web/components/usg-measurement-assistant-panel.tsx', "sex === 'male' ? copy.male : sex === 'female' ? copy.female : copy.notSet", 'Measurement panel displays unknown sex as not set');
assertIncludes('apps/web/components/dog-profile-preview-card.tsx', "values.sex === 'male' ? t.fields.male : values.sex === 'female' ? t.fields.female : dictionary.common.notSetYet", 'Preview displays unknown sex as not set');
assertIncludes('apps/web/components/my-dog-card.tsx', "dog.sex === 'male' ? t.fields.male : dog.sex === 'female' ? t.fields.female : dictionary.common.notSetYet", 'Dog card displays unknown sex as not set');

assertIncludes('apps/web/app/globals.css', 'Step 108.2 — Basic-first Cane Corso profile UX START', 'Step 108.2 CSS block exists');
assertIncludes('apps/web/app/globals.css', '.dog-form-progressive-actions__grid', 'Progressive action grid is styled');
assertIncludes('apps/web/app/globals.css', '.dog-form-guidance-launcher', 'Guidance launcher is styled');

const pkg = JSON.parse(read('package.json'));
pkg.scripts?.['step108-2:basic-first-profile:qa'] ? pass('Package script step108-2:basic-first-profile:qa exists') : fail('Package script step108-2:basic-first-profile:qa missing');
const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step108-2-basic-first-profile-ux.md', 'Release QA requires Step 108.2 QA doc');
assertIncludes(release, 'scripts/qa-step108-2-basic-first-profile-ux.mjs', 'Release QA requires Step 108.2 QA script');
assertIncludes(release, 'step108-2:basic-first-profile:qa', 'Release QA requires Step 108.2 package script');
assertIncludes(release, 'Step 108.2 Basic-first Cane Corso profile UX', 'Release QA runs Step 108.2 guardrail');

const drizzleFiles = readdirSync(path.join(root, 'packages/db/drizzle'));
const step1082Migration = drizzleFiles.find((file) => /108-2|108\.2|basic-first|progressive/i.test(file));
step1082Migration ? fail(`Step 108.2 should not add DB migration, found: ${step1082Migration}`) : pass('No DB migration added for Step 108.2');

for (const file of [form, workspace, 'apps/web/lib/fci-standard-conformity.ts']) {
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
  console.error('Step 108.2 QA FAILED');
  console.error('==========================================================');
  process.exit(process.exitCode);
}

console.log('\n==========================================================');
console.log('Step 108.2 QA PASS');
console.log('==========================================================');
