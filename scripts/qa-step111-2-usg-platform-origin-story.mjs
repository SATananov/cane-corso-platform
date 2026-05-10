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
console.log('Step 111.2 — USG Platform Origin Story QA');
console.log('==========================================================\n');

const requiredFiles = [
  'apps/web/components/usg-founder-heritage-panel.tsx',
  'apps/web/app/(public)/heritage/page.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step111-2-usg-platform-origin-story.md',
  'scripts/qa-step111-2-usg-platform-origin-story.mjs',
  'docs/qa/step111-1-usg-heritage-written-story-toggle.md',
  'scripts/qa-step111-1-usg-heritage-written-story-toggle.mjs',
];
for (const file of requiredFiles) assertFile(file);

const component = 'apps/web/components/usg-founder-heritage-panel.tsx';
assertIncludes(component, 'platformStorySummary', 'Platform origin copy object exists');
assertIncludes(component, 'Как се роди идеята за платформата', 'BG platform-origin button exists');
assertIncludes(component, 'От проба-грешка към Cane Corso екосистема', 'BG platform-origin title exists');
assertIncludes(component, 'След години с Cane Corso разбрах, че информация за породата има, но тя е разпръсната.', 'BG scattered information origin exists');
assertIncludes(component, 'Затова реших да уча', 'BG learning-to-build chapter exists');
assertIncludes(component, 'не е нужно всеки собственик на Cane Corso да започва от нулата като мен', 'BG owner-support motivation exists');
assertIncludes(component, 'Не просто сайт, а платформа', 'BG system/platform distinction exists');
assertIncludes(component, 'цялостна екосистема само за Cane Corso и за собственици', 'BG complete ecosystem intent exists');
assertIncludes(component, 'хотели и boarding за големи породи', 'BG services/boarding layer exists');
assertIncludes(component, 'ветеринарни клиники, магазини, pet-friendly места', 'BG clinics/shops/pet-friendly layer exists');
assertIncludes(component, 'знание, инструменти, общност и подкрепа на едно място', 'BG one-place owner support exists');
assertIncludes(component, 'usg-founder-heritage-story--platform-origin', 'Platform origin renders as separate optional details block');
assertIncludes(component, 'UNICO SUO GENERE</span>', 'Platform origin details use USG label');
assertIncludes(component, 'How the USG platform idea was born', 'English platform-origin button exists');
assertIncludes(component, 'Come è nata l’idea della piattaforma', 'Italian platform-origin button exists');

assertNotIncludes(component, 'breeder business', 'Platform origin copy avoids breeder-business framing');
assertNotIncludes(component, 'for sale', 'Platform origin copy avoids sales language');
assertNotIncludes(component, 'official new standard', 'Platform origin copy avoids official-standard claims');

const styles = 'apps/web/app/globals.css';
assertIncludes(styles, 'Step 111.2 — USG Platform Origin Story START', 'Step 111.2 CSS block exists');
assertIncludes(styles, '.usg-founder-heritage-story--platform-origin', 'Platform origin CSS modifier exists');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step111-2:usg-platform-origin:qa']) pass('Package script step111-2:usg-platform-origin:qa exists');
else fail('Package script step111-2:usg-platform-origin:qa missing');

const releaseQa = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(releaseQa, 'docs/qa/step111-2-usg-platform-origin-story.md', 'Release QA requires Step 111.2 docs');
assertIncludes(releaseQa, 'scripts/qa-step111-2-usg-platform-origin-story.mjs', 'Release QA requires Step 111.2 script');
assertIncludes(releaseQa, "['Step 111.2 USG platform origin story'", 'Release QA runs Step 111.2 script');
assertIncludes(releaseQa, 'step111-2:usg-platform-origin:qa', 'Release QA requires Step 111.2 package script');

if (process.exitCode) {
  console.error('\nStep 111.2 USG platform origin story QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 111.2 USG platform origin story QA PASS');
