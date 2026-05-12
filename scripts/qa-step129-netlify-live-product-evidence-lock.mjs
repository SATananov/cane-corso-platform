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

async function runtimeCheck(baseUrl) {
  const normalized = baseUrl.replace(/\/$/, '');
  const healthUrl = `${normalized}/api/health`;
  const dbUrl = `${normalized}/api/health/db`;

  console.log(`\nRuntime evidence check: ${normalized}`);

  const healthResponse = await fetch(healthUrl, { cache: 'no-store' });
  if (!healthResponse.ok) {
    fail(`/api/health returned HTTP ${healthResponse.status}`);
    return;
  }
  const health = await healthResponse.json();
  if (health?.ok === true && health?.data?.environment === 'production') pass('/api/health confirms production ok');
  else fail('/api/health did not confirm production ok');

  const dbResponse = await fetch(dbUrl, { cache: 'no-store' });
  if (!dbResponse.ok) {
    fail(`/api/health/db returned HTTP ${dbResponse.status}`);
    return;
  }
  const db = await dbResponse.json();
  const data = db?.data ?? {};
  if (db?.ok === true) pass('/api/health/db returned ok');
  else fail('/api/health/db did not return ok');
  if (data.provider === 'neon') pass('/api/health/db confirms Neon provider');
  else fail('/api/health/db did not confirm Neon provider');
  if (data.activeDatabase === 'cane_corso_platform') pass('/api/health/db confirms active production database');
  else fail(`/api/health/db active database mismatch: ${data.activeDatabase ?? 'missing'}`);
  if (data.activeSchema === 'public') pass('/api/health/db confirms public schema');
  else fail(`/api/health/db active schema mismatch: ${data.activeSchema ?? 'missing'}`);
  if (data.databaseMatchesExpected === true) pass('/api/health/db confirms expected database match');
  else fail('/api/health/db expected database match is not true');
}

console.log('\n===============================================================');
console.log('Step 129 — Netlify Live Product Evidence Lock QA');
console.log('===============================================================\n');

const requiredFiles = [
  'docs/qa/step129-netlify-live-product-evidence-lock.md',
  'docs/qa/evidence/step129-netlify-live-product-evidence-lock/README.md',
  'scripts/qa-step129-netlify-live-product-evidence-lock.mjs',
  'docs/qa/step128-product-priority-navigation-demo-data-separation.md',
  'scripts/qa-step128-product-priority-navigation-demo-data-separation.mjs',
  'apps/web/components/page-shell.tsx',
  'apps/web/components/review-queue-dashboard.tsx',
  'apps/web/lib/demo-data-presentation.ts',
  'apps/web/components/admin-photo-review-assistant-panel.tsx',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

requiredFiles.forEach(assertFile);

assertIncludes('docs/qa/step129-netlify-live-product-evidence-lock.md', '/api/health/db', 'Step 129 doc requires DB health evidence');
assertIncludes('docs/qa/step129-netlify-live-product-evidence-lock.md', 'activeDatabase: cane_corso_platform', 'Step 129 doc locks production database expectation');
assertIncludes('docs/qa/step129-netlify-live-product-evidence-lock.md', 'Guest/public product journey', 'Step 129 doc covers guest journey');
assertIncludes('docs/qa/step129-netlify-live-product-evidence-lock.md', 'Member/owner product journey', 'Step 129 doc covers member journey');
assertIncludes('docs/qa/step129-netlify-live-product-evidence-lock.md', 'Admin/reviewer product journey', 'Step 129 doc covers admin journey');
assertIncludes('docs/qa/step129-netlify-live-product-evidence-lock.md', 'Controlled example/demo-like data', 'Step 129 doc covers controlled example separation');
assertIncludes('docs/qa/step129-netlify-live-product-evidence-lock.md', 'does not claim to prove breed', 'Step 129 doc keeps ML-safe boundary');
assertIncludes('docs/qa/evidence/step129-netlify-live-product-evidence-lock/README.md', '01-health-api.png', 'Step 129 evidence folder lists health API capture');
assertIncludes('docs/qa/evidence/step129-netlify-live-product-evidence-lock/README.md', '02-health-db.png', 'Step 129 evidence folder lists DB health capture');
assertIncludes('docs/qa/evidence/step129-netlify-live-product-evidence-lock/README.md', '06-admin-review-photo-assistant.png', 'Step 129 evidence folder lists photo assistant capture');
assertIncludes('docs/qa/evidence/step129-netlify-live-product-evidence-lock/README.md', 'Do not store secrets', 'Step 129 evidence folder warns against secrets');
assertIncludes('apps/web/components/page-shell.tsx', 'module-priority-nav', 'Step 128 priority nav remains present');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'id="review-queue"', 'Admin review queue anchor remains present');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'admin-photo-assistant', 'Admin photo assistant anchor remains present');
assertIncludes('apps/web/lib/demo-data-presentation.ts', 'cleanDemoProductionText', 'Controlled demo data helper remains present');
assertIncludes('apps/web/components/admin-photo-review-assistant-panel.tsx', 'Тук няма AI/ML резултат', 'Photo assistant keeps no-AI-proof Bulgarian boundary');
assertIncludes('package.json', 'step129:live-product-evidence:qa', 'package script for Step 129 is registered');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'step129-netlify-live-product-evidence-lock.md', 'Release QA requires Step 129 doc');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'qa-step129-netlify-live-product-evidence-lock.mjs', 'Release QA requires Step 129 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'Step 129 Netlify live product evidence lock', 'Release QA runs Step 129 QA');

assertNotIncludes('docs/qa/step129-netlify-live-product-evidence-lock.md', 'postgres://', 'Step 129 doc does not include connection strings');
assertNotIncludes('docs/qa/evidence/step129-netlify-live-product-evidence-lock/README.md', 'postgres://', 'Step 129 evidence README does not include connection strings');

if (process.argv.includes('--runtime')) {
  const baseUrl = process.env.CCP_RUNTIME_BASE_URL;
  if (!baseUrl) fail('Runtime mode requires CCP_RUNTIME_BASE_URL');
  else await runtimeCheck(baseUrl);
} else {
  pass('Runtime fetch skipped by default; set CCP_RUNTIME_BASE_URL and run with --runtime after deploy');
}

if (failed) {
  console.error('\n===============================================================');
  console.error('Step 129 Netlify Live Product Evidence Lock QA FAILED');
  console.error('===============================================================');
  process.exit(1);
}

console.log('\n===============================================================');
console.log('Step 129 Netlify Live Product Evidence Lock QA PASS');
console.log('===============================================================');
