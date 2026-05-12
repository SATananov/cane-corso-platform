#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failed = false;

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  failed = true;
}

function read(file) {
  return readFileSync(path.join(root, file), 'utf8');
}

function assertFile(file) {
  if (!existsSync(path.join(root, file))) fail(`Required file missing: ${file}`);
  else pass(`Required file exists: ${file}`);
}

function assertIncludes(file, needle, message) {
  const content = read(file);
  if (!content.includes(needle)) fail(`${message}: missing ${needle}`);
  else pass(message);
}

function assertNotIncludes(file, needle, message) {
  const content = read(file);
  if (content.includes(needle)) fail(`${message}: found ${needle}`);
  else pass(message);
}

console.log('\n===============================================================');
console.log('Step 130.1 — Journey Visual Readability Polish QA');
console.log('===============================================================\n');

const requiredFiles = [
  'apps/web/components/usg-journey-carousel.tsx',
  'apps/web/components/usg-review-steps-rail.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step130-first-real-user-onboarding-polish.md',
  'docs/qa/step130-1-journey-visual-readability-polish.md',
  'scripts/qa-step130-first-real-user-onboarding-polish.mjs',
  'scripts/qa-step130-1-journey-visual-readability-polish.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

requiredFiles.forEach(assertFile);

assertIncludes('apps/web/components/usg-journey-carousel.tsx', 'Започни своя Cane Corso път в USG', 'Bulgarian public title is softened for owner journey tone');
assertIncludes('apps/web/components/usg-journey-carousel.tsx', 'Start your Cane Corso journey in USG', 'English public title is softened for owner journey tone');
assertIncludes('apps/web/components/usg-journey-carousel.tsx', 'Inizia il tuo percorso Cane Corso in USG', 'Italian public title is softened for owner journey tone');
assertIncludes('apps/web/components/usg-journey-carousel.tsx', 'Първите ясни действия след вход', 'Member title uses clear action tone');
assertIncludes('apps/web/components/usg-journey-carousel.tsx', 'Изгради първия профил стъпка по стъпка', 'My Dogs empty journey uses step-by-step profile tone');

assertIncludes('apps/web/app/globals.css', 'Step 130.1 — Journey Visual Readability Polish', 'Step 130.1 CSS marker present');
assertIncludes('apps/web/app/globals.css', 'width: min(1240px, calc(100% - 1.5rem));', 'Entry journey is wider on desktop');
assertIncludes('apps/web/app/globals.css', 'color: rgba(212, 175, 55, 0.045);', 'USG watermark is more subtle');
assertIncludes('apps/web/app/globals.css', 'grid-template-columns: repeat(5, minmax(128px, 1fr));', 'Desktop journey tabs have readable minimum width');
assertIncludes('apps/web/app/globals.css', 'min-height: 66px;', 'Journey tabs are taller for readability');
assertIncludes('apps/web/app/globals.css', '-webkit-line-clamp: 2;', 'Journey tab labels allow two readable lines');
assertIncludes('apps/web/app/globals.css', 'white-space: normal;', 'Journey tab labels no longer force one-line truncation');
assertIncludes('apps/web/app/globals.css', '.usg-journey-carousel__dot.is-active strong', 'Active journey tab has stronger readable state');
assertIncludes('apps/web/app/globals.css', '@media (max-width: 520px)', 'Very small mobile receives one-column tab fallback');

assertIncludes('docs/qa/step130-1-journey-visual-readability-polish.md', 'presentation-only polish pass', 'Step 130.1 doc records presentation-only scope');
assertIncludes('package.json', 'step130-1:journey-visual-readability:qa', 'Package script for Step 130.1 is registered');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'step130-1-journey-visual-readability-polish.md', 'Release QA requires Step 130.1 doc');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'qa-step130-1-journey-visual-readability-polish.mjs', 'Release QA requires Step 130.1 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'Step 130.1 journey visual readability polish', 'Release QA runs Step 130.1 QA');

const presentationFiles = [
  'apps/web/components/usg-journey-carousel.tsx',
  'apps/web/components/usg-review-steps-rail.tsx',
  'apps/web/app/globals.css',
];

for (const file of presentationFiles) {
  assertNotIncludes(file, 'DATABASE_URL', `${file} does not read database environment`);
  assertNotIncludes(file, 'document.cookie', `${file} does not read/write cookies`);
  assertNotIncludes(file, 'localStorage', `${file} does not add client storage`);
}

const forbiddenProofClaims = [
  'AI proves breed',
  'AI доказва породата',
  'ML proves breed',
  'breed proof by AI',
  'доказва породата чрез AI',
];
for (const claim of forbiddenProofClaims) {
  assertNotIncludes('apps/web/components/usg-journey-carousel.tsx', claim, `Journey carousel avoids unsafe proof claim: ${claim}`);
  assertNotIncludes('apps/web/components/usg-review-steps-rail.tsx', claim, `Review rail avoids unsafe proof claim: ${claim}`);
}

const lockedBackendFiles = [
  'packages/db/src/repositories/registry.ts',
  'packages/db/src/repositories/certificates.ts',
  'packages/db/src/repositories/ecosystem.ts',
  'packages/auth/src/session.ts',
  'apps/web/app/api/auth/session/route.ts',
];

for (const file of lockedBackendFiles) {
  if (existsSync(path.join(root, file))) pass(`Locked backend file remains present and not required by Step 130.1: ${file}`);
}

if (failed) {
  console.error('\n===============================================================');
  console.error('Step 130.1 Journey Visual Readability Polish QA FAILED');
  console.error('===============================================================');
  process.exit(1);
}

console.log('\n===============================================================');
console.log('Step 130.1 Journey Visual Readability Polish QA PASS');
console.log('===============================================================');
