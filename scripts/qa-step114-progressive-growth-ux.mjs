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
console.log('Step 114 — Progressive Disclosure UX & Owner Growth Comparison QA');
console.log('====================================================================\n');

const requiredFiles = [
  'apps/web/components/page-shell.tsx',
  'apps/web/app/(public)/knowledge/[slug]/page.tsx',
  'apps/web/components/cane-corso-pregnancy-puppy-guide.tsx',
  'apps/web/components/owner-health-growth-tracker.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step114-progressive-growth-ux.md',
  'scripts/qa-step114-progressive-growth-ux.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];
for (const file of requiredFiles) assertFile(file);

const pageShell = 'apps/web/components/page-shell.tsx';
assertIncludes(pageShell, 'targetId?: string', 'PageShell hero chip targetId contract exists');
assertIncludes(pageShell, 'getHeroChipTargetId', 'PageShell reads progressive target id');
assertIncludes(pageShell, 'page-hero__badge--button', 'PageShell can render chip buttons');
assertIncludes(pageShell, 'data-pregnancy-guide-target', 'PageShell emits guide target data attribute');

const articlePage = 'apps/web/app/(public)/knowledge/[slug]/page.tsx';
assertIncludes(articlePage, 'targetId: href.replace', 'Pregnancy article hero chips map to progressive target ids');
assertIncludes(articlePage, '#pregnancy-calendar', 'Pregnancy anchor remains for compatibility');
assertIncludes(articlePage, '#birth-warnings', 'Birth anchor remains for compatibility');

const guide = 'apps/web/components/cane-corso-pregnancy-puppy-guide.tsx';
assertIncludes(guide, "'use client'", 'Pregnancy guide is client-side for active tabs');
assertIncludes(guide, 'useState(firstSectionId)', 'Pregnancy guide tracks active section state');
assertIncludes(guide, 'setActiveSectionId', 'Pregnancy guide switches active section');
assertIncludes(guide, 'data-pregnancy-guide-target', 'Pregnancy guide buttons use target ids');
assertIncludes(guide, 'pregnancy-puppy-guide__tables--progressive', 'Pregnancy guide renders progressive table panel');
assertIncludes(guide, 'activeTable ? <GuideTableCard table={activeTable}', 'Only selected pregnancy guide table renders');

const tracker = 'apps/web/components/owner-health-growth-tracker.tsx';
assertIncludes(tracker, "type ActiveInsightPanel = 'overview' | 'weight' | 'height' | 'standard' | 'comparison' | 'deviations' | 'records'", 'Owner tracker insight panel union exists');
assertIncludes(tracker, 'GrowthLineChart', 'Owner tracker renders SVG growth line charts');
assertIncludes(tracker, 'buildStandardMetricPoints', 'Standard growth points are generated');
assertIncludes(tracker, 'buildActualMetricPoints', 'Owner measurement chart points are generated');
assertIncludes(tracker, 'owner-health-insight-switch', 'Owner tracker has progressive insight switch');
assertIncludes(tracker, 'standardWeightPoints', 'Standard weight graph data exists');
assertIncludes(tracker, 'standardHeightPoints', 'Standard height graph data exists');
assertIncludes(tracker, 'combinedWeightTitle', 'Combined weight comparison copy exists');
assertIncludes(tracker, 'combinedHeightTitle', 'Combined height comparison copy exists');
assertIncludes(tracker, 'getDeviationText', 'Deviation guidance function exists');
assertIncludes(tracker, "activeInsightPanel === 'records'", 'Measurement tables are hidden behind records tab');
assertIncludes(tracker, 'owner-growth-line-chart__actual', 'Actual owner line chart class exists');
assertIncludes(tracker, 'owner-growth-line-chart__standard', 'Standard line chart class exists');

const css = 'apps/web/app/globals.css';
assertIncludes(css, 'Step 114 — Progressive Disclosure UX & Owner Growth Comparison START', 'Step 114 CSS block exists');
assertIncludes(css, '.pregnancy-puppy-guide__nav--tabs button', 'Pregnancy tab button CSS exists');
assertIncludes(css, '.owner-health-insight-switch', 'Owner health insight switch CSS exists');
assertIncludes(css, '.owner-growth-line-chart__actual', 'Owner actual line chart CSS exists');
assertIncludes(css, '.owner-growth-line-chart__standard', 'Owner standard line chart CSS exists');
assertIncludes(css, '.owner-health-deviation-card', 'Deviation card CSS exists');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step114:progressive-growth-ux:qa'] === 'node scripts/qa-step114-progressive-growth-ux.mjs') pass('Package script step114:progressive-growth-ux:qa exists');
else fail('Package script step114:progressive-growth-ux:qa missing');

const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step114-progressive-growth-ux.md', 'Release QA requires Step 114 doc');
assertIncludes(release, 'scripts/qa-step114-progressive-growth-ux.mjs', 'Release QA requires Step 114 script');
assertIncludes(release, 'step114:progressive-growth-ux:qa', 'Release QA requires Step 114 package script');
assertIncludes(release, 'Step 114 progressive disclosure and growth UX', 'Release QA runs Step 114 script');

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
  assertNotIncludes(lockedFile, 'Step 114', `${lockedFile} not touched by Step 114 marker`);
  assertNotIncludes(lockedFile, 'progressive-growth-ux', `${lockedFile} not touched by Step 114 patch`);
}

if (process.exitCode) {
  console.error('\nStep 114 Progressive Disclosure UX & Owner Growth Comparison QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 114 Progressive Disclosure UX & Owner Growth Comparison QA PASS');
