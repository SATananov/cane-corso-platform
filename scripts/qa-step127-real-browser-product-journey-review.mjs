#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function file(rel) {
  const full = path.join(root, rel);
  if (!existsSync(full)) {
    fail(`Required file missing: ${rel}`);
    return '';
  }
  pass(`Required file exists: ${rel}`);
  return readFileSync(full, 'utf8');
}
function expect(text, pattern, message) {
  if (pattern instanceof RegExp ? pattern.test(text) : text.includes(pattern)) pass(message);
  else fail(`${message}: missing ${pattern}`);
}
function reject(text, pattern, message) {
  if (pattern instanceof RegExp ? pattern.test(text) : text.includes(pattern)) fail(`${message}: found forbidden ${pattern}`);
  else pass(message);
}
function assertPath(rel, message) {
  if (existsSync(path.join(root, rel))) pass(message ?? `Path exists: ${rel}`);
  else fail(`Path missing: ${rel}`);
}

console.log('\n================================================================');
console.log('Step 127 — Real Browser Product Journey Review QA');
console.log('================================================================\n');

const doc = file('docs/qa/step127-real-browser-product-journey-review.md');
const evidence = file('docs/qa/evidence/step127-real-browser-product-journey-review/README.md');
const pkgText = file('package.json');
const releaseQa = file('scripts/qa-fullstack-all-in-one-release-lock.mjs');
const step126Doc = file('docs/qa/step126-admin-ml-safe-review-assistant-polish.md');
const step125Doc = file('docs/qa/step125-real-user-production-readiness-ui-tone.md');
const migration = file('packages/db/drizzle/0014_dog_health_records.sql');

const publicRoutes = [
  ['apps/web/app/page.tsx', '`/`'],
  ['apps/web/app/(public)/platform/page.tsx', '`/platform`'],
  ['apps/web/app/(public)/registry/page.tsx', '`/registry`'],
  ['apps/web/app/(public)/registry/[slug]/page.tsx', '`/registry/[published-slug]`'],
  ['apps/web/app/(public)/gallery/page.tsx', '`/gallery`'],
  ['apps/web/app/(public)/certified/page.tsx', '`/certified`'],
  ['apps/web/app/verify/page.tsx', '`/verify`'],
  ['apps/web/app/verify/[code]/page.tsx', '`/verify/[code]`'],
  ['apps/web/app/certificate/[code]/page.tsx', '`/certificate/[code]`'],
  ['apps/web/app/(public)/knowledge/page.tsx', '`/knowledge`'],
  ['apps/web/app/(public)/knowledge/[slug]/page.tsx', '`/knowledge/[slug]`'],
  ['apps/web/app/(public)/community/page.tsx', '`/community`'],
  ['apps/web/app/(public)/community/[slug]/page.tsx', '`/community/[slug]`'],
  ['apps/web/app/(public)/partners/page.tsx', '`/partners`'],
  ['apps/web/app/(public)/partners/[slug]/page.tsx', '`/partners/[slug]`'],
  ['apps/web/app/(public)/faq/page.tsx', '`/faq`'],
  ['apps/web/app/access/page.tsx', '`/access`'],
  ['apps/web/app/api/health/db/route.ts', '`/api/health/db`'],
];

const memberRoutes = [
  ['apps/web/app/(member)/member/page.tsx', '`/member`'],
  ['apps/web/app/(member)/profile/page.tsx', '`/profile`'],
  ['apps/web/app/(member)/my-dogs/page.tsx', '`/my-dogs`'],
  ['apps/web/app/(member)/my-dogs/new/page.tsx', '`/my-dogs/new`'],
  ['apps/web/app/(member)/my-dogs/[dogId]/edit/page.tsx', '`/my-dogs/[dogId]/edit`'],
  ['apps/web/app/(member)/my-dogs/[dogId]/media/page.tsx', '`/my-dogs/[dogId]/media`'],
  ['apps/web/app/(member)/my-dogs/[dogId]/health/page.tsx', '`/my-dogs/[dogId]/health`'],
  ['apps/web/app/(member)/ecosystem/page.tsx', '`/ecosystem`'],
  ['apps/web/app/(member)/partners/apply/page.tsx', '`/partners/apply`'],
];

const adminRoutes = [
  ['apps/web/app/(admin)/review/page.tsx', '`/review`'],
  ['apps/web/app/(admin)/admin/page.tsx', '`/admin`'],
  ['apps/web/app/(admin)/admin/members/page.tsx', '`/admin/members`'],
  ['apps/web/app/(admin)/admin/registry/page.tsx', '`/admin/registry`'],
  ['apps/web/app/(admin)/admin/partners/page.tsx', '`/admin/partners`'],
  ['apps/web/app/(admin)/admin/ecosystem/page.tsx', '`/admin/ecosystem`'],
  ['apps/web/app/(admin)/admin/knowledge/page.tsx', '`/admin/knowledge`'],
];

for (const [rel, route] of publicRoutes) {
  assertPath(rel, `Guest/public route file exists for ${route}`);
  expect(doc, route, `Step 127 doc includes guest/public route ${route}`);
}
for (const [rel, route] of memberRoutes) {
  assertPath(rel, `Member route file exists for ${route}`);
  expect(doc, route, `Step 127 doc includes member route ${route}`);
}
for (const [rel, route] of adminRoutes) {
  assertPath(rel, `Admin route file exists for ${route}`);
  expect(doc, route, `Step 127 doc includes admin route ${route}`);
}

expect(doc, /Guest \/ public visitor/, 'Step 127 doc defines guest journey');
expect(doc, /Member \/ owner/, 'Step 127 doc defines member journey');
expect(doc, /Admin \/ reviewer/, 'Step 127 doc defines admin journey');
expect(doc, /Public pages do not expose private owner contact data/, 'Guest review checks public privacy boundary');
expect(doc, /Owner profile and Cane Corso profile are not confused/, 'Member review checks owner vs Cane Corso separation');
expect(doc, /human decision/, 'Admin review checks human decision boundary');
expect(doc, /ML-safe assistant helps with photo\/view readiness only/, 'Admin review checks ML-safe assistant scope');
expect(doc, /does not change:[\s\S]*Registry publication logic[\s\S]*Certificate issue\/revoke logic[\s\S]*Verify lookup logic[\s\S]*Auth\/session behavior[\s\S]*DB schema or migrations/, 'Step 127 doc records protected non-goals');
expect(doc, /docs\/qa\/evidence\/step127-real-browser-product-journey-review\//, 'Step 127 doc points to evidence folder');
expect(doc, /pnpm step127:browser-product-journey:qa/, 'Step 127 doc includes QA command');
expect(evidence, /manual browser review evidence/, 'Evidence README explains manual browser evidence');
expect(evidence, /Guest \/ public journey[\s\S]*Member \/ owner journey[\s\S]*Admin \/ reviewer journey/, 'Evidence README keeps route group order');
expect(evidence, /Do not capture secrets/, 'Evidence README protects secrets');
expect(evidence, /13-runtime-db-health\.txt/, 'Evidence README includes runtime DB evidence name');
expect(evidence, /28-admin-knowledge\.png/, 'Evidence README includes final admin evidence name');

expect(pkgText, /step127:browser-product-journey:qa/, 'package.json includes Step 127 QA script');
expect(releaseQa, /docs\/qa\/step127-real-browser-product-journey-review\.md/, 'Full release QA requires Step 127 QA doc');
expect(releaseQa, /docs\/qa\/evidence\/step127-real-browser-product-journey-review\/README\.md/, 'Full release QA requires Step 127 evidence README');
expect(releaseQa, /scripts\/qa-step127-real-browser-product-journey-review\.mjs/, 'Full release QA requires Step 127 QA script');
expect(releaseQa, /step127:browser-product-journey:qa/, 'Full release QA requires Step 127 package script');
expect(releaseQa, /Step 127 real browser product journey review/, 'Full release QA runs Step 127 QA');

expect(step125Doc, /Real User Production Readiness/, 'Step 127 builds on Step 125 tone cleanup');
expect(step126Doc, /Admin ML-safe Review Assistant Polish/, 'Step 127 builds on Step 126 admin assistant polish');
reject(doc + evidence + step126Doc, /AI proves breed|ML proves breed|purebred proof|automatic Registry approval|automatic Certificate approval/i, 'No unsafe AI/breed-proof or automatic approval phrasing');
reject(migration, /Step 127|browser-product-journey|real-browser-product-journey/, 'Step 127 does not touch dog health migration');

const protectedAuthorityFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'apps/web/app/api/session/route.ts',
  'apps/web/app/api/auth/sign-in/route.ts',
  'apps/web/app/api/auth/sign-up/route.ts',
];
for (const rel of protectedAuthorityFiles) assertPath(rel, `Protected authority file remains present: ${rel}`);

if (process.exitCode) {
  console.error('\n================================================================');
  console.error('Step 127 Real Browser Product Journey Review QA FAILED');
  console.error('================================================================');
  process.exit(process.exitCode);
}

console.log('\n================================================================');
console.log('Step 127 Real Browser Product Journey Review QA PASS');
console.log('================================================================');
