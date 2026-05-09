#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readmePath = path.join(root, 'README.md');
const packagePath = path.join(root, 'package.json');
const docPath = path.join(root, 'docs/qa/step97-product-presentation-browser-smoke-evidence.md');
const releaseQaPath = path.join(root, 'scripts/qa-fullstack-all-in-one-release-lock.mjs');

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function assertIncludes(label, content, needle) {
  if (content.includes(needle)) pass(label);
  else fail(`${label} missing: ${needle}`);
}

function assertNotIncludes(label, content, needle) {
  if (!content.includes(needle)) pass(label);
  else fail(`${label} should not include: ${needle}`);
}

function assertFile(label, filePath) {
  if (existsSync(filePath)) pass(label);
  else fail(`${label} missing`);
}

console.log('\n--- Step 97 Product Presentation & Browser Smoke Evidence QA ---');

assertFile('Root README.md exists', readmePath);
assertFile('Root package.json exists', packagePath);
assertFile('Step 97 QA document exists', docPath);
assertFile('All-in-one release QA script exists', releaseQaPath);

const readme = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : '';
const qaDoc = existsSync(docPath) ? readFileSync(docPath, 'utf8') : '';
const releaseQa = existsSync(releaseQaPath) ? readFileSync(releaseQaPath, 'utf8') : '';
const pkg = existsSync(packagePath) ? JSON.parse(readFileSync(packagePath, 'utf8')) : { scripts: {} };

assertIncludes('README records Step 97 checkpoint', readme, 'Step 97 — Product Presentation & Browser Smoke Evidence');
assertIncludes('README keeps Step 96 as previous visual architecture state', readme, 'Step 96:** README visual architecture overview');
assertIncludes('README has product presentation evidence section', readme, '## Product presentation and browser smoke evidence');
assertIncludes('README explains evidence-ready browser review', readme, 'It does not replace real browser testing');
assertIncludes('README includes presentation narrative', readme, '### Presentation narrative');
assertIncludes('README includes guest/public route matrix', readme, '### Guest/public smoke routes');
assertIncludes('README includes member route matrix', readme, '### Member smoke routes');
assertIncludes('README includes admin route matrix', readme, '### Admin smoke routes');
assertIncludes('README includes evidence capture format', readme, '### Evidence capture format');
assertIncludes('README includes evidence folder suggestion', readme, 'docs/qa/evidence/step97-browser-smoke/');
assertIncludes('README includes Step 97 QA command', readme, 'pnpm step97:browser-smoke:evidence:qa');
assertIncludes('README includes runtime DB proof route', readme, '/api/health/db');
assertIncludes('README includes public home route', readme, '`/`');
assertIncludes('README includes platform route', readme, '`/platform`');
assertIncludes('README includes registry route', readme, '`/registry`');
assertIncludes('README includes registry detail route', readme, '`/registry/[published-slug]`');
assertIncludes('README includes gallery route', readme, '`/gallery`');
assertIncludes('README includes knowledge route', readme, '`/knowledge`');
assertIncludes('README includes FAQ route', readme, '`/faq`');
assertIncludes('README includes community route', readme, '`/community`');
assertIncludes('README includes partners route', readme, '`/partners`');
assertIncludes('README includes access route', readme, '`/access`');
assertIncludes('README includes verify route', readme, '`/verify`');
assertIncludes('README includes member center route', readme, '`/member`');
assertIncludes('README includes profile route', readme, '`/profile`');
assertIncludes('README includes my dogs route', readme, '`/my-dogs`');
assertIncludes('README includes new dog route', readme, '`/my-dogs/new`');
assertIncludes('README includes partner apply route', readme, '`/partners/apply`');
assertIncludes('README includes review route', readme, '`/review`');
assertIncludes('README includes admin registry route', readme, '`/admin/registry`');
assertIncludes('README includes admin partners route', readme, '`/admin/partners`');
assertIncludes('README includes admin ecosystem route', readme, '`/admin/ecosystem`');
assertIncludes('README includes admin knowledge route', readme, '`/admin/knowledge`');
assertIncludes('README states screenshots remain manual/browser task', readme, 'Actual screenshots remain a manual/browser task');
assertNotIncludes('README Mermaid ER diagram does not contain the Step 96 extra dogs brace typo', readme, 'string lifecycleStatus\n    }\n    }\n\n    dog_media');

assertIncludes('Step 97 doc records purpose', qaDoc, 'Step 97 adds a presentation-ready browser smoke evidence layer');
assertIncludes('Step 97 doc records protected Registry boundary', qaDoc, 'Registry publication logic');
assertIncludes('Step 97 doc records protected Auth/session boundary', qaDoc, 'Auth/session logic');
assertIncludes('Step 97 doc records protected Neon boundary', qaDoc, 'Neon schema and migrations');
assertIncludes('Step 97 doc records local validation chain', qaDoc, 'pnpm step97:browser-smoke:evidence:qa');

if (pkg.scripts?.['step97:browser-smoke:evidence:qa'] === 'node scripts/qa-step97-product-presentation-browser-smoke-evidence.mjs') {
  pass('Package script step97:browser-smoke:evidence:qa exists');
} else {
  fail('Package script step97:browser-smoke:evidence:qa missing or incorrect');
}

assertIncludes('All-in-one release QA requires Step 97 document', releaseQa, 'docs/qa/step97-product-presentation-browser-smoke-evidence.md');
assertIncludes('All-in-one release QA requires Step 97 script', releaseQa, 'scripts/qa-step97-product-presentation-browser-smoke-evidence.mjs');
assertIncludes('All-in-one release QA requires Step 97 package script', releaseQa, 'step97:browser-smoke:evidence:qa');
assertIncludes('All-in-one release QA runs Step 97 script', releaseQa, 'Step 97 product presentation/browser smoke evidence');

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
  console.error('\nStep 97 Product Presentation & Browser Smoke Evidence QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 97 Product Presentation & Browser Smoke Evidence QA complete.');
