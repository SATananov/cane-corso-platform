import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function pass(message) {
  console.log('PASS', message);
}

function assertIncludes(file, needle, message) {
  const text = read(file);
  if (!text.includes(needle)) {
    throw new Error(`FAIL ${message} — missing "${needle}" in ${file}`);
  }
  pass(message);
}

function assertExists(file, message) {
  if (!fs.existsSync(file)) {
    throw new Error(`FAIL ${message} — missing ${file}`);
  }
  pass(message);
}

assertExists('apps/web/components/review-decision-readiness-panel.tsx', 'ReviewDecisionReadinessPanel component exists');
assertExists('docs/qa/step37-admin-review-decision-console.md', 'Step 37 QA document exists');

assertIncludes('package.json', '"admin:review-decision:qa"', 'Package exposes admin:review-decision:qa script');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'ReviewDecisionReadinessPanel', 'Review queue imports/renders decision readiness panel');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'registryVisiblePhotoCount', 'Review queue passes Registry media evidence count');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'gallerySelectedPhotoCount', 'Review queue passes Gallery curated evidence count');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'hasAdminAssessment', 'Review queue passes admin assessment evidence');

assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'Owner boundary', 'Decision panel includes Owner boundary copy');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'Registry', 'Decision panel includes Registry lane');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'USG Certificate', 'Decision panel includes certificate lane');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'USG Gallery', 'Decision panel includes Gallery lane');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'identity', 'Evidence checklist includes identity');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'registryMedia', 'Evidence checklist includes Registry media');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'assessment', 'Evidence checklist includes admin assessment');

assertIncludes('apps/web/app/globals.css', 'step37-review-decision-readiness', 'Step 37 CSS block exists');
assertIncludes('docs/qa/step37-admin-review-decision-console.md', 'Locked boundaries', 'Step 37 QA doc records locked boundaries');

for (const locked of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/(admin)/review/actions.ts'
]) {
  assertExists(locked, `Locked surface still exists: ${locked}`);
}

console.log('\nStep 37 Admin Review Decision Console QA complete.');
