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

assertExists('apps/web/components/public-registry-trust-readability-panel.tsx', 'Public Registry trust readability panel exists');
assertExists('docs/qa/step39-public-registry-trust-readability-polish.md', 'Step 39 QA document exists');

assertIncludes('package.json', '"public:registry-trust:qa"', 'Root package exposes Step 39 QA command');

assertIncludes('apps/web/components/public-registry-profile.tsx', 'PublicRegistryTrustReadabilityPanel', 'Public Registry profile renders trust readability panel');
assertIncludes('apps/web/components/public-registry-profile.tsx', 'hasPublicMedia', 'Public Registry profile passes media readiness signal');
assertIncludes('apps/web/components/public-registry-profile.tsx', 'communityVoteCount', 'Public Registry profile passes community signal');
assertIncludes('apps/web/components/public-registry-profile.tsx', "verifyHref={verifyTarget ? '/verify/' + verifyTarget : null}", 'Public Registry profile passes Verify route safely');
assertIncludes('apps/web/components/public-registry-profile.tsx', "certificateHref={verifyTarget ? '/certificate/' + verifyTarget : null}", 'Public Registry profile passes Certificate route safely');

assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'Registry', 'Trust panel preserves Registry lane');
assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'USG Certificate', 'Trust panel preserves USG Certificate lane');
assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'Verify', 'Trust panel preserves Verify action copy');
assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'Community', 'Trust panel preserves community lane');
assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'Member depth', 'Trust panel preserves member-depth lane');
assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'bg:', 'Trust panel includes Bulgarian copy');
assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'it:', 'Trust panel includes Italian copy');

assertIncludes('apps/web/app/globals.css', 'step39-public-registry-trust-readability', 'Step 39 CSS block exists');

assertIncludes('docs/qa/step39-public-registry-trust-readability-polish.md', 'Locked boundaries', 'Step 39 QA doc records locked boundaries');

for (const locked of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/(admin)/review/actions.ts',
  'apps/web/lib/knowledge-articles.ts'
]) {
  assertExists(locked, 'Locked surface still exists: ' + locked);
}

console.log('\nStep 39 Public Registry Trust / Readability Polish QA complete.');
