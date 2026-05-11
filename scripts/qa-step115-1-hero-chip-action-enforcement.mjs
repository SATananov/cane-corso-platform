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
console.log('Step 115.1 — Hero Chip Action Enforcement QA');
console.log('====================================================================\n');

const requiredFiles = [
  'apps/web/components/page-shell.tsx',
  'apps/web/components/page-hero-chip-row.tsx',
  'apps/web/app/(public)/knowledge/page.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step115-1-hero-chip-action-enforcement.md',
  'scripts/qa-step115-1-hero-chip-action-enforcement.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];
for (const file of requiredFiles) assertFile(file);

const heroRow = 'apps/web/components/page-hero-chip-row.tsx';
assertIncludes(heroRow, "'use client'", 'Hero chip row is client-side');
assertIncludes(heroRow, 'useState', 'Hero chip row can reveal selected chip info');
assertIncludes(heroRow, 'page-hero-chip-control__panel', 'Hero chip row renders contextual panel');
assertIncludes(heroRow, 'chip.href', 'Hero chip row supports real links');
assertIncludes(heroRow, 'data-pregnancy-guide-target={chip.targetId}', 'Hero chip row preserves progressive target buttons');
assertIncludes(heroRow, 'aria-expanded', 'Hero chip buttons expose expanded state');
assertIncludes(heroRow, 'setActiveChipId', 'Hero chip buttons are not inert');
assertIncludes(heroRow, 'fallback.body', 'Plain legacy chips still reveal helpful context');

const pageShell = 'apps/web/components/page-shell.tsx';
assertIncludes(pageShell, "import { PageHeroChipRow }", 'PageShell imports hero chip row');
assertIncludes(pageShell, 'description?: string;', 'PageShell hero chips support descriptions');
assertIncludes(pageShell, 'actionHref?: string;', 'PageShell hero chips support active CTA href');
assertIncludes(pageShell, '<PageHeroChipRow chips={heroChips} helpLabel={helpLabel} />', 'PageShell delegates all hero chips to active control');
assertNotIncludes(pageShell, 'aria-disabled="true"', 'PageShell no longer renders inert hero chips');

const knowledgePage = 'apps/web/app/(public)/knowledge/page.tsx';
assertIncludes(knowledgePage, 'getKnowledgeHeroChips', 'Knowledge page maps hero chips to actions');
assertIncludes(knowledgePage, '/knowledge/cane-corso-history-and-identity', 'Knowledge history chip links to article');
assertIncludes(knowledgePage, '/knowledge/official-standard-owner-reading', 'Knowledge FCI chip links to standard article');
assertIncludes(knowledgePage, '/knowledge/training-socialization-and-public-safety', 'Knowledge temperament/care chip links to training article');
assertIncludes(knowledgePage, '/knowledge/health-screening-and-responsible-care', 'Knowledge health chip links to health article');
assertIncludes(knowledgePage, '/knowledge/cane-corso-pregnancy-birth-puppy-growth-calendar', 'Knowledge breeding chip links to pregnancy guide');
assertIncludes(knowledgePage, 'heroChips={getKnowledgeHeroChips(locale, copy.hero.chips, actionLabel)}', 'Knowledge PageShell receives active hero chips');

const css = 'apps/web/app/globals.css';
assertIncludes(css, 'Step 115.1 — Hero Chip Action Enforcement START', 'Step 115.1 CSS block exists');
assertIncludes(css, '.page-hero-chip-control__panel', 'Hero chip contextual panel CSS exists');
assertIncludes(css, '.page-hero__badge--button.is-active', 'Hero chip active state CSS exists');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step115-1:hero-chip-actions:qa'] === 'node scripts/qa-step115-1-hero-chip-action-enforcement.mjs') pass('Package script step115-1:hero-chip-actions:qa exists');
else fail('Package script step115-1:hero-chip-actions:qa missing');

const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step115-1-hero-chip-action-enforcement.md', 'Release QA requires Step 115.1 doc');
assertIncludes(release, 'scripts/qa-step115-1-hero-chip-action-enforcement.mjs', 'Release QA requires Step 115.1 script');
assertIncludes(release, 'step115-1:hero-chip-actions:qa', 'Release QA requires Step 115.1 package script');
assertIncludes(release, 'Step 115.1 hero chip action enforcement', 'Release QA runs Step 115.1 script');

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
  assertNotIncludes(lockedFile, 'Step 115.1', `${lockedFile} not touched by Step 115.1 marker`);
  assertNotIncludes(lockedFile, 'hero-chip-action', `${lockedFile} not touched by Step 115.1 patch`);
}

if (process.exitCode) {
  console.error('\nStep 115.1 Hero Chip Action Enforcement QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 115.1 Hero Chip Action Enforcement QA PASS');
