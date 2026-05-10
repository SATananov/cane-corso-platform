#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(file) { return readFileSync(path.join(root, file), 'utf8'); }
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function assertFile(file) { existsSync(path.join(root, file)) ? pass(`Required file exists: ${file}`) : fail(`Missing required file: ${file}`); }
function assertIncludes(file, needle, label) { read(file).includes(needle) ? pass(label) : fail(`${label}: missing ${needle}`); }
function assertNotIncludes(file, needle, label) { read(file).includes(needle) ? fail(`${label}: found ${needle}`) : pass(label); }

console.log('\n==========================================================');
console.log('Step 111.1 — USG Heritage Written Story Toggle QA');
console.log('==========================================================\n');

const requiredFiles = [
  'apps/web/components/usg-founder-heritage-panel.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step111-1-usg-heritage-written-story-toggle.md',
  'scripts/qa-step111-1-usg-heritage-written-story-toggle.mjs',
  'docs/qa/step111-usg-heritage-di-casa-tananov-archive.md',
  'scripts/qa-step111-usg-heritage-di-casa-tananov-archive.mjs',
];
for (const file of requiredFiles) assertFile(file);

const component = 'apps/web/components/usg-founder-heritage-panel.tsx';
assertIncludes(component, "<details className=\"usg-founder-heritage-story\">", 'Full heritage story is hidden in an expandable details block');
assertIncludes(component, "{variant === 'full' ? (", 'Written story only renders on full heritage surface');
assertIncludes(component, 'Прочети историята на Стефан', 'BG story button copy exists');
assertIncludes(component, 'Историята се отваря само ако посетителят иска да прочете повече.', 'BG story is clearly optional');
assertIncludes(component, 'От първото Cane до идеята за USG', 'BG story title exists');
assertIncludes(component, 'Стефан Тананов', 'Founder name exists in written story');
assertIncludes(component, 'Последното обещано кученце не беше взето. Така при мен дойде Mark I.', 'Mark I origin story exists');
assertIncludes(component, 'Hera роди от Mark I общо 57 малки Cane Corso', '57 gifted puppies story exists');
assertIncludes(component, 'Нито едно не съм продал. Всички съм подарил.', 'Gifted-not-sold principle exists');
assertIncludes(component, 'Не всеки, който иска Cane Corso, е готов за Cane Corso.', 'Personal responsibility test principle exists');
assertIncludes(component, 'Казвам „Cane-то ми“.', 'Stefan voice / Cane identity line exists');
assertIncludes(component, 'Thor — пясъчният Cane Corso', 'Thor fawn chapter exists');
assertIncludes(component, 'Broly също е син на Mark I и Hera', 'Broly lineage/return chapter exists');
assertIncludes(component, 'Никога няма да си оставя Cane Corso-то.', 'Aftercare responsibility principle exists');
assertIncludes(component, 'di Casa Tananov не е представено като развъдник', 'Non-kennel boundary remains explicit');
assertIncludes(component, 'не е текст на развъдник', 'Written story reinforces non-breeder framing');
assertIncludes(component, 'Не го представям като официален стандарт', 'Bulgarian local type observation remains non-official');
assertIncludes(component, 'Read Stefan’s story', 'English optional story button exists');
assertIncludes(component, 'Leggi la storia di Stefan', 'Italian optional story button exists');

assertNotIncludes(component, 'ваксина за бяс', 'Public story avoids rabies-vaccine speculation');
assertNotIncludes(component, 'полудя', 'Public story avoids behavioral/medical speculation wording');
assertNotIncludes(component, 'цена', 'Public story does not include pricing language');
assertNotIncludes(component, 'available puppies', 'Public story does not advertise puppies');
assertNotIncludes(component, 'for sale', 'Public story does not include sales language');

const styles = 'apps/web/app/globals.css';
assertIncludes(styles, 'Step 111.1 — USG Heritage Written Story Toggle START', 'Step 111.1 CSS block exists');
assertIncludes(styles, '.usg-founder-heritage-story__summary', 'Story button/summary CSS exists');
assertIncludes(styles, '.usg-founder-heritage-story__sections', 'Story sections CSS exists');
assertIncludes(styles, '.usg-founder-heritage-story[open]', 'Open state CSS exists');
assertIncludes(styles, '[data-theme=\'heritage\'] .usg-founder-heritage-story', 'Heritage theme story CSS exists');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step111-1:usg-heritage-story:qa']) pass('Package script step111-1:usg-heritage-story:qa exists');
else fail('Package script step111-1:usg-heritage-story:qa missing');

const releaseQa = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(releaseQa, 'docs/qa/step111-1-usg-heritage-written-story-toggle.md', 'Release QA requires Step 111.1 docs');
assertIncludes(releaseQa, 'scripts/qa-step111-1-usg-heritage-written-story-toggle.mjs', 'Release QA requires Step 111.1 script');
assertIncludes(releaseQa, "['Step 111.1 USG heritage written story toggle'", 'Release QA runs Step 111.1 script');

if (process.exitCode) {
  console.error('\nStep 111.1 USG heritage written story toggle QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 111.1 USG heritage written story toggle QA PASS');
