import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function pass(message) {
  console.log('PASS', message);
}

function assertExists(file, message) {
  if (!fs.existsSync(file)) {
    throw new Error('FAIL ' + message + ' — missing ' + file);
  }
  pass(message);
}

function assertIncludes(file, needle, message) {
  const text = read(file);
  if (!text.includes(needle)) {
    throw new Error('FAIL ' + message + ' — missing "' + needle + '" in ' + file);
  }
  pass(message);
}

assertExists('docs/qa/step44-trust-surfaces-browser-visual-review.md', 'Step 44 browser visual review document exists');
assertExists('docs/release/trust-surfaces-browser-review-step44.md', 'Step 44 release review document exists');

assertIncludes('package.json', '"trust:browser-review:qa"', 'Root package exposes Step 44 QA command');

assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', '/registry', 'Step 44 checklist includes Registry');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', '/verify', 'Step 44 checklist includes Verify');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', '/gallery', 'Step 44 checklist includes Gallery');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', '/certified', 'Step 44 checklist includes Certified');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', '/review', 'Step 44 checklist includes Admin review');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', '/admin/registry', 'Step 44 checklist includes Admin Registry');

assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', 'Registry = official public identity layer', 'Step 44 checklist records Registry boundary');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', 'Verify = public verification path', 'Step 44 checklist records Verify boundary');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', 'USG Certificate = separate admin-issued decision', 'Step 44 checklist records certificate boundary');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', 'USG Gallery = curated showcase layer', 'Step 44 checklist records Gallery boundary');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', 'Certified archive = official certificate archive', 'Step 44 checklist records Certified boundary');

assertExists('apps/web/components/owner-review-readiness-panel.tsx', 'Step 36 owner readiness panel remains present');
assertExists('apps/web/components/review-decision-readiness-panel.tsx', 'Step 37 admin decision panel remains present');
assertExists('apps/web/components/public-registry-trust-readability-panel.tsx', 'Step 39 public Registry trust panel remains present');
assertExists('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'Step 40 admin Registry evidence panel remains present');
assertExists('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'Step 41 Verify/certificate trust panel remains present');
assertExists('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Step 42/43 Gallery/Certified trust panel remains present');

assertIncludes('apps/web/app/(public)/certified/page.tsx', 'GalleryCertifiedShowcaseTrustPanel', 'Certified page remains wired to trust panel');
assertIncludes('apps/web/app/(public)/gallery/page.tsx', 'GalleryCertifiedShowcaseTrustPanel', 'Gallery page remains wired to trust panel');

for (const locked of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(admin)/review/actions.ts',
  'apps/web/lib/knowledge-articles.ts'
]) {
  assertExists(locked, 'Locked surface still exists: ' + locked);
}

console.log('\nStep 44 Trust Surfaces Browser Visual Review QA complete.');
