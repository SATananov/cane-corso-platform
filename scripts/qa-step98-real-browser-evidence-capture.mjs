#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readmePath = path.join(root, 'README.md');
const packagePath = path.join(root, 'package.json');
const docPath = path.join(root, 'docs/qa/step98-real-browser-evidence-capture.md');
const evidenceReadmePath = path.join(root, 'docs/qa/evidence/step98-real-browser-evidence/README.md');
const releaseQaPath = path.join(root, 'scripts/qa-fullstack-all-in-one-release-lock.mjs');

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function assertFile(label, filePath) {
  if (existsSync(filePath)) pass(label);
  else fail(`${label} missing`);
}

function assertIncludes(label, content, needle) {
  if (content.includes(needle)) pass(label);
  else fail(`${label} missing: ${needle}`);
}

function assertNotIncludes(label, content, needle) {
  if (!content.includes(needle)) pass(label);
  else fail(`${label} should not include: ${needle}`);
}

console.log('\n--- Step 98 Real Browser Evidence Capture Protocol QA ---');

assertFile('Root README.md exists', readmePath);
assertFile('Root package.json exists', packagePath);
assertFile('Step 98 QA document exists', docPath);
assertFile('Step 98 evidence folder README exists', evidenceReadmePath);
assertFile('All-in-one release QA script exists', releaseQaPath);

const readme = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : '';
const qaDoc = existsSync(docPath) ? readFileSync(docPath, 'utf8') : '';
const evidenceReadme = existsSync(evidenceReadmePath) ? readFileSync(evidenceReadmePath, 'utf8') : '';
const releaseQa = existsSync(releaseQaPath) ? readFileSync(releaseQaPath, 'utf8') : '';
const pkg = existsSync(packagePath) ? JSON.parse(readFileSync(packagePath, 'utf8')) : { scripts: {} };

assertIncludes('README records Step 98 current checkpoint', readme, 'Step 98 — Real Browser Evidence Capture Protocol');
assertIncludes('README keeps Step 97 as presentation evidence state', readme, 'Step 97:** Product presentation and browser smoke evidence layer');
assertIncludes('README includes real browser evidence section', readme, '## Real browser evidence capture protocol');
assertIncludes('README includes Step 98 evidence folder', readme, 'docs/qa/evidence/step98-real-browser-evidence/');
assertIncludes('README includes Step 98 QA command', readme, 'pnpm step98:real-browser:evidence:qa');
assertIncludes('README keeps Step 97 QA command', readme, 'pnpm step97:browser-smoke:evidence:qa');
assertIncludes('README requires runtime DB capture', readme, '21-runtime-db-health.txt');
assertIncludes('README requires active database confirmation', readme, 'activeDatabase');
assertIncludes('README requires ok status confirmation', readme, 'status` is `ok`');
assertIncludes('README states screenshots are manual', readme, 'does not claim that screenshots are already captured');
assertIncludes('README warns not to include secrets', readme, 'Do not include secrets');
assertIncludes('README warns not to include session cookies', readme, 'session cookies');
assertNotIncludes('README does not keep duplicate Current continuation point section', readme, '## Current continuation point');

const expectedEvidenceItems = [
  '01-public-home.png',
  '02-public-platform.png',
  '03-public-registry.png',
  '04-public-registry-detail.png',
  '05-public-gallery.png',
  '06-public-knowledge.png',
  '07-public-faq.png',
  '08-public-community.png',
  '09-public-partners.png',
  '10-access.png',
  '11-verify.png',
  '12-member-center.png',
  '13-member-profile.png',
  '14-member-my-dogs.png',
  '15-member-new-dog.png',
  '16-admin-review.png',
  '17-admin-registry.png',
  '18-admin-ecosystem.png',
  '19-admin-partners.png',
  '20-admin-knowledge.png',
  '21-runtime-db-health.txt',
];

for (const item of expectedEvidenceItems) {
  assertIncludes(`README includes evidence item ${item}`, readme, item);
  assertIncludes(`Evidence README includes evidence item ${item}`, evidenceReadme, item);
}

assertIncludes('Step 98 doc records purpose', qaDoc, 'Step 98 turns the Step 97 browser smoke route map into a practical manual evidence workflow');
assertIncludes('Step 98 doc records screenshot privacy rule', qaDoc, 'Do not include secrets');
assertIncludes('Step 98 doc records protected Registry boundary', qaDoc, 'Registry publication logic');
assertIncludes('Step 98 doc records protected Auth/session boundary', qaDoc, 'Auth/session logic');
assertIncludes('Step 98 doc records protected Neon boundary', qaDoc, 'Neon schema and migrations');
assertIncludes('Step 98 doc records local validation chain', qaDoc, 'pnpm step98:real-browser:evidence:qa');
assertIncludes('Evidence README records privacy rules', evidenceReadme, 'Privacy rules');
assertIncludes('Evidence README forbids raw connection string', evidenceReadme, 'raw connection string');

if (pkg.scripts?.['step98:real-browser:evidence:qa'] === 'node scripts/qa-step98-real-browser-evidence-capture.mjs') {
  pass('Package script step98:real-browser:evidence:qa exists');
} else {
  fail('Package script step98:real-browser:evidence:qa missing or incorrect');
}

assertIncludes('All-in-one release QA requires Step 98 document', releaseQa, 'docs/qa/step98-real-browser-evidence-capture.md');
assertIncludes('All-in-one release QA requires Step 98 script', releaseQa, 'scripts/qa-step98-real-browser-evidence-capture.mjs');
assertIncludes('All-in-one release QA requires Step 98 package script', releaseQa, 'step98:real-browser:evidence:qa');
assertIncludes('All-in-one release QA runs Step 98 script', releaseQa, 'Step 98 real browser evidence capture protocol');

const lockedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'apps/web/app/api/health/db/route.ts',
  'apps/web/app/api/session/route.ts',
  'apps/web/app/api/auth/sign-in/route.ts',
];

for (const file of lockedFiles) {
  assertFile(`Locked authority file remains present: ${file}`, path.join(root, file));
}

if (process.exitCode) {
  console.error('\nStep 98 Real Browser Evidence Capture Protocol QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 98 Real Browser Evidence Capture Protocol QA complete.');
