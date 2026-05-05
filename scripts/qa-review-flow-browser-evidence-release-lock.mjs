import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function pass(message) {
  console.log('PASS', message);
}

function assertExists(file, message) {
  if (!fs.existsSync(file)) {
    throw new Error(`FAIL ${message} — missing ${file}`);
  }
  pass(message);
}

function assertIncludes(file, needle, message) {
  const text = read(file);
  if (!text.includes(needle)) {
    throw new Error(`FAIL ${message} — missing "${needle}" in ${file}`);
  }
  pass(message);
}

assertExists('docs/qa/step38-review-flow-browser-evidence-release-lock.md', 'Step 38 browser evidence release-lock document exists');
assertExists('docs/release/review-cycle-release-lock-step38.md', 'Step 38 release lock document exists');

assertExists('apps/web/components/owner-review-readiness-panel.tsx', 'Step 36 owner readiness panel still exists');
assertExists('apps/web/components/review-decision-readiness-panel.tsx', 'Step 37 admin decision readiness panel still exists');

assertIncludes('package.json', '"review:flow-evidence:qa"', 'Root package exposes Step 38 review flow evidence QA command');

assertIncludes('apps/web/components/owner-review-readiness-panel.tsx', 'Owner profile', 'Owner readiness panel preserves Owner profile boundary');
assertIncludes('apps/web/components/owner-review-readiness-panel.tsx', 'Registry', 'Owner readiness panel preserves Registry boundary');
assertIncludes('apps/web/components/owner-review-readiness-panel.tsx', 'USG Certificate', 'Owner readiness panel preserves USG Certificate boundary');
assertIncludes('apps/web/components/owner-review-readiness-panel.tsx', 'USG Gallery', 'Owner readiness panel preserves USG Gallery boundary');

assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'Owner boundary', 'Admin decision panel preserves Owner boundary lane');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'Registry', 'Admin decision panel preserves Registry lane');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'USG Certificate', 'Admin decision panel preserves certificate lane');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'USG Gallery', 'Admin decision panel preserves Gallery lane');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'registryMedia', 'Admin decision panel preserves Registry media evidence');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'gallerySelectedPhotoCount', 'Admin decision panel preserves Gallery selected evidence');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'hasAdminAssessment', 'Admin decision panel preserves admin assessment evidence');

assertIncludes('apps/web/components/my-dogs-overview.tsx', 'OwnerReviewReadinessPanel', 'My Dogs overview still renders owner readiness panel');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'ReviewDecisionReadinessPanel', 'Review queue still renders admin decision panel');

assertIncludes('scripts/qa-owner-review-readiness.mjs', 'Step 36 CSS block exists', 'Step 36 owner readiness QA keeps the CSS guardrail');
assertIncludes('apps/web/app/globals.css', 'step37-review-decision-readiness', 'Step 37 CSS block remains present');

assertIncludes('docs/qa/step38-review-flow-browser-evidence-release-lock.md', 'Owner flow', 'Step 38 doc records owner browser checklist');
assertIncludes('docs/qa/step38-review-flow-browser-evidence-release-lock.md', 'Admin review flow', 'Step 38 doc records admin browser checklist');
assertIncludes('docs/qa/step38-review-flow-browser-evidence-release-lock.md', 'Locked boundaries', 'Step 38 doc records locked boundaries');

assertIncludes('docs/release/review-cycle-release-lock-step38.md', 'Step 36', 'Release doc records Step 36 lock target');
assertIncludes('docs/release/review-cycle-release-lock-step38.md', 'Step 37', 'Release doc records Step 37 lock target');
assertIncludes('docs/release/review-cycle-release-lock-step38.md', 'Step 38', 'Release doc records Step 38 lock target');

for (const locked of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/(admin)/review/actions.ts',
  'apps/web/lib/knowledge-articles.ts'
]) {
  assertExists(locked, `Locked surface still exists: ${locked}`);
}

console.log('\nStep 38 Review Flow Browser Evidence & Release Lock QA complete.');
