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
console.log('Step 111.3 — Heritage Navigation & Member Home Clarity QA');
console.log('==========================================================\n');

const requiredFiles = [
  'apps/web/lib/navigation.ts',
  'apps/web/components/site-header.tsx',
  'apps/web/app/(public)/platform/page.tsx',
  'apps/web/components/role-aware-action-panel.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step111-3-heritage-navigation-member-clarity.md',
  'scripts/qa-step111-3-heritage-navigation-member-clarity.mjs',
];
for (const file of requiredFiles) assertFile(file);

assertIncludes('apps/web/lib/navigation.ts', "heritage: 'История'", 'BG Heritage label exists in public navigation');
assertIncludes('apps/web/lib/navigation.ts', "heritage: 'Heritage'", 'EN Heritage label exists in public navigation');
assertIncludes('apps/web/lib/navigation.ts', "heritage: 'Storia'", 'IT Heritage label exists in public navigation');
assertIncludes('apps/web/lib/navigation.ts', "{ label: labels.heritage, href: '/heritage' }", 'Public navigation links to /heritage');
assertIncludes('apps/web/components/site-header.tsx', "locale === 'bg' ? 'Център'", 'BG member workline label changed to Център');
assertIncludes('apps/web/components/site-header.tsx', "locale === 'it' ? 'Centro'", 'IT member workline label changed to Centro');
assertIncludes('apps/web/components/site-header.tsx', ": 'Center'", 'EN member workline label changed to Center');
assertNotIncludes('apps/web/components/site-header.tsx', "? 'Старт'", 'Header no longer uses BG Старт label');
assertIncludes('apps/web/app/(public)/platform/page.tsx', 'hero-usg-grounding-seal', 'Platform hero renders subtle USG seal block');
assertIncludes('apps/web/app/(public)/platform/page.tsx', 'История • грижа • доверие', 'BG hero seal copy exists');
assertIncludes('apps/web/app/(public)/platform/page.tsx', 'Ecosystem for Cane Corso and owners', 'EN hero seal copy exists');
assertIncludes('apps/web/components/role-aware-action-panel.tsx', 'nextStep?:', 'Role-aware copy supports optional next-step card');
assertIncludes('apps/web/components/role-aware-action-panel.tsx', 'Следваща стъпка', 'BG next-step card exists');
assertIncludes('apps/web/components/role-aware-action-panel.tsx', 'Най-лесният път напред', 'BG next-step title exists');
assertIncludes('apps/web/components/role-aware-action-panel.tsx', 'Следи здраве и растеж', 'BG health/growth action appears in next-step card');
assertIncludes('apps/web/components/role-aware-action-panel.tsx', 'USG те води по действия', 'BG action-first note exists');
assertIncludes('apps/web/components/role-aware-action-panel.tsx', 'role-aware-action-panel__next-step', 'Next-step aside renders in role-aware panel');
assertIncludes('apps/web/app/globals.css', 'Step 111.3 — Heritage Navigation & Member Home Clarity Polish START', 'Step 111.3 CSS block exists');
assertIncludes('apps/web/app/globals.css', '.hero-usg-grounding-seal', 'Hero seal CSS exists');
assertIncludes('apps/web/app/globals.css', '.role-aware-action-panel__next-step', 'Next-step CSS exists');
assertIncludes('apps/web/app/globals.css', '.platform-member-focus.role-aware-action-panel', 'Platform member focus layout polish exists');
const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step111-3:heritage-nav-member-clarity:qa']) pass('Package script step111-3:heritage-nav-member-clarity:qa exists');
else fail('Package script step111-3:heritage-nav-member-clarity:qa missing');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'docs/qa/step111-3-heritage-navigation-member-clarity.md', 'Release QA requires Step 111.3 docs');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'scripts/qa-step111-3-heritage-navigation-member-clarity.mjs', 'Release QA requires Step 111.3 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', "['Step 111.3 Heritage navigation/member clarity'", 'Release QA runs Step 111.3 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'step111-3:heritage-nav-member-clarity:qa', 'Release QA requires Step 111.3 package script');
if (process.exitCode) { console.error('\nStep 111.3 Heritage navigation/member clarity QA FAILED'); process.exit(process.exitCode); }
console.log('\nStep 111.3 Heritage navigation/member clarity QA PASS');
