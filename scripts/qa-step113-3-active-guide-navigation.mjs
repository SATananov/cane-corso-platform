#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(file) { return readFileSync(path.join(root, file), 'utf8'); }
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function assertFile(file) { existsSync(path.join(root, file)) ? pass(`Required file exists: ${file}`) : fail(`Missing required file: ${file}`); }
function assertIncludes(file, needle, label) { read(file).includes(needle) ? pass(label) : fail(`${label}: missing ${needle}`); }
function assertNotIncludes(file, needle, label) { read(file).includes(needle) ? fail(`${label}: found forbidden ${needle}`) : pass(label); }

console.log('\n====================================================================');
console.log('Step 113.3 — Active Guide Navigation & Chip Clarity QA');
console.log('====================================================================\n');

const requiredFiles = [
  'apps/web/components/page-shell.tsx',
  'apps/web/app/(public)/knowledge/[slug]/page.tsx',
  'apps/web/components/cane-corso-pregnancy-puppy-guide.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step113-3-active-guide-navigation.md',
  'scripts/qa-step113-3-active-guide-navigation.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];
for (const file of requiredFiles) assertFile(file);

const pageShell = 'apps/web/components/page-shell.tsx';
assertIncludes(pageShell, 'export interface PageShellHeroChip', 'PageShell linked chip type exists');
assertIncludes(pageShell, 'type PageShellHeroChipInput = string | PageShellHeroChip', 'PageShell keeps backward-compatible string chips');
assertIncludes(pageShell, 'page-hero__badge page-hero__badge--link', 'PageShell renders linked hero chips as active anchors');
assertIncludes(pageShell, 'aria-disabled="true"', 'PageShell marks static chips as non-interactive labels');

const articlePage = 'apps/web/app/(public)/knowledge/[slug]/page.tsx';
assertIncludes(articlePage, 'getArticleHeroChips', 'Knowledge article page maps article chips');
assertIncludes(articlePage, "slug !== 'cane-corso-pregnancy-birth-puppy-growth-calendar'", 'Only pregnancy guide article receives custom chip anchors');
assertIncludes(articlePage, '#pregnancy-calendar', 'Pregnancy hero chip anchor exists');
assertIncludes(articlePage, '#birth-warnings', 'Birth hero chip anchor exists');
assertIncludes(articlePage, '#puppy-day-1-40', 'Puppy hero chip anchor exists');
assertIncludes(articlePage, '#owner-vet-boundary', 'Owner/vet boundary hero chip anchor exists');

const guide = 'apps/web/components/cane-corso-pregnancy-puppy-guide.tsx';
assertIncludes(guide, 'navLabel', 'Guide section nav label exists');
assertIncludes(guide, 'navItems', 'Guide section nav items exist');
assertIncludes(guide, 'pregnancy-puppy-guide__nav', 'Guide section nav renders');
assertIncludes(guide, "id: 'pregnancy-calendar'", 'Pregnancy table id exists');
assertIncludes(guide, "id: 'birth-preparation'", 'Birth preparation table id exists');
assertIncludes(guide, "id: 'birth-warnings'", 'Birth warnings table id exists');
assertIncludes(guide, "id: 'postpartum-care'", 'Postpartum table id exists');
assertIncludes(guide, "id: 'puppy-day-1-40'", 'Puppy Day 1-40 table id exists');
assertIncludes(guide, "id: 'owner-vet-boundary'", 'Owner/vet boundary table id exists');
assertIncludes(guide, 'Отиди директно към секция', 'BG direct navigation label exists');
assertIncludes(guide, 'Обезпаразитяване', 'BG deworming navigation label exists');

const css = 'apps/web/app/globals.css';
assertIncludes(css, 'Step 113.3 — Active Hero Chips & Guide Section Navigation START', 'Step 113.3 CSS block exists');
assertIncludes(css, '.page-hero__badge--link', 'Active hero chip CSS exists');
assertIncludes(css, '.pregnancy-puppy-guide__nav a', 'Guide nav link CSS exists');
assertIncludes(css, 'scroll-margin-top: 7rem', 'Guide section scroll offset exists');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step113-3:active-guide-navigation:qa'] === 'node scripts/qa-step113-3-active-guide-navigation.mjs') pass('Package script step113-3:active-guide-navigation:qa exists');
else fail('Package script step113-3:active-guide-navigation:qa missing');

const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step113-3-active-guide-navigation.md', 'Release QA requires Step 113.3 doc');
assertIncludes(release, 'scripts/qa-step113-3-active-guide-navigation.mjs', 'Release QA requires Step 113.3 script');
assertIncludes(release, 'step113-3:active-guide-navigation:qa', 'Release QA requires Step 113.3 package script');
assertIncludes(release, 'Step 113.3 active guide navigation', 'Release QA runs Step 113.3 script');

for (const lockedFile of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'packages/db/drizzle/0014_dog_health_records.sql',
]) {
  assertFile(lockedFile);
  assertNotIncludes(lockedFile, 'Step 113.3', `${lockedFile} not touched by Step 113.3 marker`);
  assertNotIncludes(lockedFile, 'active-guide-navigation', `${lockedFile} not touched by Step 113.3 navigation patch`);
}

if (process.exitCode) {
  console.error('\nStep 113.3 Active Guide Navigation & Chip Clarity QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 113.3 Active Guide Navigation & Chip Clarity QA PASS');
