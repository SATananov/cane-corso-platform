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
console.log('Step 114.1 — Growth Chart Axis & Data Clarity QA');
console.log('====================================================================\n');

const requiredFiles = [
  'apps/web/components/owner-health-growth-tracker.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step114-1-growth-chart-axis-data-clarity.md',
  'scripts/qa-step114-1-growth-chart-axis-data-clarity.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];
for (const file of requiredFiles) assertFile(file);

const tracker = 'apps/web/components/owner-health-growth-tracker.tsx';
assertIncludes(tracker, "chartHint: 'Числата долу са възраст в месеци", 'BG chart hint explains bottom numbers');
assertIncludes(tracker, "chartAgeAxis: 'Възраст (месеци)'", 'BG x-axis label exists');
assertIncludes(tracker, "chartWeightAxis: 'Тегло (кг)'", 'BG weight y-axis label exists');
assertIncludes(tracker, "chartHeightAxis: 'Височина при холката (см)'", 'BG height y-axis label exists');
assertIncludes(tracker, "chartAgeHeader: 'Възраст'", 'BG chart data age header exists');
assertIncludes(tracker, "chartActualHeader: 'Запис на моето Cane Corso'", 'BG actual owner header exists');
assertIncludes(tracker, "chartStandardHeader: 'Среден ориентир'", 'BG standard midpoint header exists');
assertIncludes(tracker, "chartRangeHeader: 'Ориентировъчен диапазон'", 'BG range header exists');
assertIncludes(tracker, "monthShort: 'м.'", 'BG short month label exists');
assertIncludes(tracker, 'owner-growth-line-chart__axis-title--x', 'SVG x-axis title is rendered');
assertIncludes(tracker, 'owner-growth-line-chart__axis-title--y', 'SVG y-axis title is rendered');
assertIncludes(tracker, 'owner-growth-line-chart__value-label', 'SVG value scale labels are rendered');
assertIncludes(tracker, 'owner-growth-line-chart__hint', 'Visible chart hint is rendered');
assertIncludes(tracker, 'owner-growth-line-chart__data-head', 'Chart data header row is rendered');
assertIncludes(tracker, 'role="table"', 'Chart data uses table role for clarity');
assertIncludes(tracker, 'xAxisLabel={t.chartAgeAxis}', 'All line chart calls receive x-axis label');
assertIncludes(tracker, 'yAxisLabel={t.chartWeightAxis}', 'Weight charts receive kg y-axis label');
assertIncludes(tracker, 'yAxisLabel={t.chartHeightAxis}', 'Height charts receive cm y-axis label');
assertIncludes(tracker, 'valueColumnLabel={t.chartStandardHeader}', 'Standard chart uses standard value header');
assertIncludes(tracker, 'valueColumnLabel={t.chartActualHeader}', 'Owner/comparison charts use owner value header');

const css = 'apps/web/app/globals.css';
assertIncludes(css, 'Step 114.1 — Growth chart axis and data clarity START', 'Step 114.1 CSS block exists');
assertIncludes(css, '.owner-growth-line-chart__axis-title', 'Axis title CSS exists');
assertIncludes(css, '.owner-growth-line-chart__value-label', 'Value label CSS exists');
assertIncludes(css, '.owner-growth-line-chart__hint', 'Chart hint CSS exists');
assertIncludes(css, '.owner-growth-line-chart__data-head', 'Chart data header CSS exists');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step114-1:growth-chart-clarity:qa'] === 'node scripts/qa-step114-1-growth-chart-axis-data-clarity.mjs') pass('Package script step114-1:growth-chart-clarity:qa exists');
else fail('Package script step114-1:growth-chart-clarity:qa missing');

const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step114-1-growth-chart-axis-data-clarity.md', 'Release QA requires Step 114.1 doc');
assertIncludes(release, 'scripts/qa-step114-1-growth-chart-axis-data-clarity.mjs', 'Release QA requires Step 114.1 script');
assertIncludes(release, 'step114-1:growth-chart-clarity:qa', 'Release QA requires Step 114.1 package script');
assertIncludes(release, 'Step 114.1 growth chart axis/data clarity', 'Release QA runs Step 114.1 script');

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
  assertNotIncludes(lockedFile, 'Step 114.1', `${lockedFile} not touched by Step 114.1 marker`);
  assertNotIncludes(lockedFile, 'growth-chart-clarity', `${lockedFile} not touched by Step 114.1 patch`);
}

if (process.exitCode) {
  console.error('\nStep 114.1 Growth Chart Axis & Data Clarity QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 114.1 Growth Chart Axis & Data Clarity QA PASS');
