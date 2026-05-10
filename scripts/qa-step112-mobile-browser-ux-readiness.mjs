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
console.log('Step 112 — Mobile Browser UX Readiness QA');
console.log('==========================================================\n');

const requiredFiles = [
  'apps/web/app/globals.css',
  'docs/qa/step112-mobile-browser-ux-readiness.md',
  'scripts/qa-step112-mobile-browser-ux-readiness.mjs',
  'scripts/qa-mobile-responsive-final-pass.mjs',
  'package.json',
];
for (const file of requiredFiles) assertFile(file);

assertIncludes('apps/web/app/globals.css', 'Step 112 — Mobile Browser UX Readiness Pass START', 'Step 112 CSS block exists');
assertIncludes('apps/web/app/globals.css', '@media (max-width: 920px)', 'Tablet/mobile media query exists');
assertIncludes('apps/web/app/globals.css', '@media (max-width: 760px)', 'Phone media query exists');
assertIncludes('apps/web/app/globals.css', '@media (max-width: 520px)', 'Small-phone media query exists');
assertIncludes('apps/web/app/globals.css', '.site-nav--topline', 'Topline navigation mobile scroll handling exists');
assertIncludes('apps/web/app/globals.css', '.site-utility__menus--workline', 'Member workline mobile scroll handling exists');
assertIncludes('apps/web/app/globals.css', 'scroll-snap-type: x proximity', 'Navigation uses mobile-friendly scroll snapping');
assertIncludes('apps/web/app/globals.css', '-webkit-overflow-scrolling: touch', 'Touch momentum scrolling exists');
assertIncludes('apps/web/app/globals.css', 'min-height: 44px', 'Touch-friendly 44px minimum target exists');
assertIncludes('apps/web/app/globals.css', '.owner-health-table-wrap', 'Health tracker table mobile wrapper is covered');
assertIncludes('apps/web/app/globals.css', '.health-tracker-input', 'Health tracker inputs are covered');
assertIncludes('apps/web/app/globals.css', 'font-size: 16px', 'Mobile input zoom guard exists');
assertIncludes('apps/web/app/globals.css', '.usg-founder-heritage-card__media', 'Heritage archive cards get mobile media tuning');
assertIncludes('apps/web/app/globals.css', '.role-aware-action-panel__next-step', 'Platform next-step card gets mobile treatment');
assertIncludes('apps/web/app/globals.css', '.member-start-grid--priority', 'Member dashboard priority grid gets mobile treatment');
assertIncludes('apps/web/app/globals.css', 'body {\n    overflow-x: hidden;', 'Page-level horizontal overflow guard exists');
assertIncludes('scripts/qa-mobile-responsive-final-pass.mjs', "qa-step112-mobile-browser-ux-readiness.mjs", 'Mobile responsive final QA imports Step 112');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step112:mobile-browser:qa']) pass('Package script step112:mobile-browser:qa exists');
else fail('Package script step112:mobile-browser:qa missing');

assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'docs/qa/step112-mobile-browser-ux-readiness.md', 'Release QA requires Step 112 docs');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'scripts/qa-step112-mobile-browser-ux-readiness.mjs', 'Release QA requires Step 112 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', "['Step 112 Mobile browser UX readiness'", 'Release QA runs Step 112 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'step112:mobile-browser:qa', 'Release QA requires Step 112 package script');

assertNotIncludes('apps/web/app/api/dogs/[dogId]/health/route.ts', 'Step 112', 'Step 112 did not change health API route');
assertNotIncludes('packages/db/drizzle/0014_dog_health_records.sql', 'Step 112', 'Step 112 did not change DB health migration');

if (process.exitCode) {
  console.error('\nStep 112 Mobile browser UX readiness QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 112 Mobile browser UX readiness QA PASS');
