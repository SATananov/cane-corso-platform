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
console.log('Step 130 — First Real User Onboarding Polish QA');
console.log('===============================================================\n');

const requiredFiles = [
  'apps/web/components/usg-journey-carousel.tsx',
  'apps/web/components/usg-review-steps-rail.tsx',
  'apps/web/components/entry-experience.tsx',
  'apps/web/app/(public)/platform/page.tsx',
  'apps/web/app/(member)/member/page.tsx',
  'apps/web/components/my-dogs-overview.tsx',
  'apps/web/components/review-queue-dashboard.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step130-first-real-user-onboarding-polish.md',
  'scripts/qa-step130-first-real-user-onboarding-polish.mjs',
  'scripts/qa-step129-netlify-live-product-evidence-lock.mjs',
  'scripts/qa-step128-product-priority-navigation-demo-data-separation.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

requiredFiles.forEach(assertFile);

assertIncludes('apps/web/components/usg-journey-carousel.tsx', "type JourneyVariant = 'public' | 'member' | 'myDogsEmpty'", 'Shared journey carousel supports public/member/My Dogs variants');
assertIncludes('apps/web/components/usg-journey-carousel.tsx', 'data-step130="journey-carousel"', 'Journey carousel has Step 130 marker');
assertIncludes('apps/web/components/usg-journey-carousel.tsx', 'Провери Cane Corso сертификат или профил', 'Public Bulgarian journey starts with verify/check orientation');
assertIncludes('apps/web/components/usg-journey-carousel.tsx', 'Добави своя Cane Corso', 'Member Bulgarian journey starts with adding a Cane Corso');
assertIncludes('apps/web/components/usg-journey-carousel.tsx', 'Сами по себе си не доказват родословие', 'My Dogs copy keeps photo evidence boundary');
assertIncludes('apps/web/components/usg-journey-carousel.tsx', 'human review', 'English copy keeps human review boundary');
assertIncludes('apps/web/components/usg-journey-carousel.tsx', '/brand/heritage/di-casa-tananov/', 'Carousel may use heritage imagery as visual atmosphere');

assertIncludes('apps/web/components/usg-review-steps-rail.tsx', 'data-step130="review-steps-rail"', 'Admin rail has Step 130 marker');
assertIncludes('apps/web/components/usg-review-steps-rail.tsx', '#review-queue', 'Admin rail links to review queue');
assertIncludes('apps/web/components/usg-review-steps-rail.tsx', '#admin-photo-assistant', 'Admin rail links to photo assistant');
assertIncludes('apps/web/components/usg-review-steps-rail.tsx', '#admin-certificate-flow', 'Admin rail links to certificate flow');
assertIncludes('apps/web/components/usg-review-steps-rail.tsx', 'човешки админ решения', 'Admin rail keeps human decision boundary');

assertIncludes('apps/web/components/entry-experience.tsx', 'entry-journey-carousel', 'Home entry includes public journey carousel');
assertIncludes('apps/web/app/(public)/platform/page.tsx', 'variant="public"', 'Platform guest page includes public journey carousel');
assertIncludes('apps/web/app/(member)/member/page.tsx', 'variant="member"', 'Member dashboard includes member journey carousel');
assertIncludes('apps/web/components/my-dogs-overview.tsx', 'variant="myDogsEmpty"', 'My Dogs empty state includes setup journey');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', '<UsgReviewStepsRail locale={locale} />', 'Admin review dashboard includes compact rail');
assertIncludes('apps/web/app/globals.css', 'Step 130 — First Real User Onboarding Polish', 'Step 130 CSS marker present');
assertIncludes('apps/web/app/globals.css', '.usg-journey-carousel', 'Journey carousel CSS exists');
assertIncludes('apps/web/app/globals.css', '.usg-review-steps-rail', 'Review rail CSS exists');
assertIncludes('docs/qa/step130-first-real-user-onboarding-polish.md', 'presentation-only UX polish', 'Step 130 doc records presentation-only scope');
assertIncludes('package.json', 'step130:first-real-user-onboarding:qa', 'Package script for Step 130 is registered');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'step130-first-real-user-onboarding-polish.md', 'Release QA requires Step 130 doc');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'qa-step130-first-real-user-onboarding-polish.mjs', 'Release QA requires Step 130 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'Step 130 first real user onboarding polish', 'Release QA runs Step 130 QA');

const presentationFiles = [
  'apps/web/components/usg-journey-carousel.tsx',
  'apps/web/components/usg-review-steps-rail.tsx',
  'apps/web/components/entry-experience.tsx',
  'apps/web/app/(public)/platform/page.tsx',
  'apps/web/app/(member)/member/page.tsx',
  'apps/web/components/my-dogs-overview.tsx',
  'apps/web/components/review-queue-dashboard.tsx',
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

if (failed) {
  console.error('\n===============================================================');
  console.error('Step 130 First Real User Onboarding Polish QA FAILED');
  console.error('===============================================================');
  process.exit(1);
}

console.log('\n===============================================================');
console.log('Step 130 First Real User Onboarding Polish QA PASS');
console.log('===============================================================');
