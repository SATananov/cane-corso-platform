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
console.log('Step 128 — Product Priority Navigation & Demo Data Separation QA');
console.log('===============================================================\n');

const requiredFiles = [
  'apps/web/components/page-shell.tsx',
  'apps/web/components/page-hero-chip-row.tsx',
  'apps/web/components/role-aware-action-panel.tsx',
  'apps/web/lib/demo-data-presentation.ts',
  'apps/web/components/review-queue-dashboard.tsx',
  'apps/web/components/my-dogs-overview.tsx',
  'apps/web/app/(member)/my-dogs/new/page.tsx',
  'apps/web/app/(public)/community/page.tsx',
  'apps/web/app/(public)/knowledge/page.tsx',
  'apps/web/app/(admin)/review/page.tsx',
  'apps/web/app/(admin)/admin/registry/page.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step128-product-priority-navigation-demo-data-separation.md',
  'scripts/qa-step128-product-priority-navigation-demo-data-separation.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

requiredFiles.forEach(assertFile);

assertIncludes('apps/web/components/page-shell.tsx', 'module-priority-nav', 'PageShell renders module priority nav');
assertIncludes('apps/web/components/page-shell.tsx', 'buildModulePriorityActions', 'PageShell builds priority actions from cards/hero/help');
assertIncludes('apps/web/components/page-shell.tsx', 'Най-важното в този модул', 'PageShell includes Bulgarian top-priority copy');
assertIncludes('apps/web/components/page-shell.tsx', 'Most important in this module', 'PageShell includes English top-priority copy');
assertIncludes('apps/web/components/page-shell.tsx', 'La cosa più importante in questo modulo', 'PageShell includes Italian top-priority copy');
assertIncludes('apps/web/app/globals.css', '.module-priority-nav', 'CSS for module priority nav exists');
assertIncludes('apps/web/app/globals.css', '.module-priority-nav__primary', 'CSS for priority primary action exists');
assertIncludes('apps/web/app/(admin)/review/page.tsx', "href: '#review-queue'", 'Admin review hero jumps to queue');
assertIncludes('apps/web/app/(admin)/review/page.tsx', "href: '#admin-photo-assistant'", 'Admin review hero jumps to photo assistant');
assertIncludes('apps/web/app/(admin)/review/page.tsx', "href: '#admin-certificate-flow'", 'Admin review hero jumps to certificate flow');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'id="review-queue"', 'Review queue anchor exists');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'admin-photo-assistant', 'Photo assistant anchor exists');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'id="admin-certificate-flow"', 'Certificate flow anchor exists');
assertIncludes('apps/web/components/my-dogs-overview.tsx', 'surface="myDogs"', 'My Dogs has role-aware action priority panel');
assertIncludes('apps/web/app/(member)/my-dogs/new/page.tsx', 'surface="myDogs"', 'Add Cane Corso has role-aware action priority panel');
assertIncludes('apps/web/app/(public)/community/page.tsx', 'surface="community"', 'Community has role-aware action panel');
assertIncludes('apps/web/app/(public)/knowledge/page.tsx', 'surface="knowledge"', 'Knowledge has role-aware action panel');
assertIncludes('apps/web/lib/demo-data-presentation.ts', 'isDemoLikeValue', 'Demo data detection helper exists');
assertIncludes('apps/web/lib/demo-data-presentation.ts', 'Контролен пример', 'Demo data helper has Bulgarian controlled-example copy');
assertIncludes('apps/web/lib/demo-data-presentation.ts', 'Controlled example', 'Demo data helper has English controlled-example copy');
assertIncludes('apps/web/lib/demo-data-presentation.ts', 'Esempio controllato', 'Demo data helper has Italian controlled-example copy');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'cleanDemoProductionText', 'Review dashboard sanitizes demo-like text');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'review-queue-item__demo-badge', 'Review dashboard marks controlled examples');
assertIncludes('apps/web/app/(admin)/admin/registry/page.tsx', 'cleanDemoProductionText', 'Admin registry sanitizes demo-like text');
assertIncludes('apps/web/app/(admin)/admin/registry/page.tsx', 'admin-management-item__demo-badge', 'Admin registry marks controlled examples');
assertIncludes('apps/web/app/globals.css', 'Step 128 — Product Priority Navigation & Demo Data Separation', 'Step 128 CSS marker present');
assertIncludes('package.json', 'step128:product-priority-demo-separation:qa', 'package script for Step 128 is registered');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'step128-product-priority-navigation-demo-data-separation.md', 'Release QA requires Step 128 doc');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'qa-step128-product-priority-navigation-demo-data-separation.mjs', 'Release QA requires Step 128 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'Step 128 product priority navigation and demo data separation', 'Release QA runs Step 128 QA');

assertNotIncludes('apps/web/components/page-shell.tsx', 'localStorage', 'PageShell priority nav does not add client storage');
assertNotIncludes('apps/web/lib/demo-data-presentation.ts', 'DATABASE_URL', 'Demo helper does not read environment/database secrets');
assertNotIncludes('apps/web/lib/demo-data-presentation.ts', 'process.env', 'Demo helper does not branch by runtime environment');

if (failed) {
  console.error('\n===============================================================');
  console.error('Step 128 Product Priority Navigation & Demo Data Separation QA FAILED');
  console.error('===============================================================');
  process.exit(1);
}

console.log('\n===============================================================');
console.log('Step 128 Product Priority Navigation & Demo Data Separation QA PASS');
console.log('===============================================================');
