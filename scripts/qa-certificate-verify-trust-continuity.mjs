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

assertExists('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'Verify certificate trust continuity panel exists');
assertExists('docs/qa/step41-certificate-verify-trust-continuity.md', 'Step 41 QA document exists');

assertIncludes('package.json', '"certificate:verify-trust:qa"', 'Root package exposes Step 41 QA command');

assertIncludes('apps/web/components/verification-result-panel.tsx', 'VerifyCertificateTrustContinuityPanel', 'Verify result panel renders trust continuity panel');

assertIncludes('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'Verify', 'Trust continuity panel explains Verify');
assertIncludes('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'USG Certificate', 'Trust continuity panel explains USG Certificate');
assertIncludes('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'Registry', 'Trust continuity panel explains Registry');
assertIncludes('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'Trust continuity', 'Trust continuity panel explains continuity layer');
assertIncludes('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'отделно админ решение', 'Trust continuity panel keeps certificate as separate admin decision');

assertIncludes('apps/web/app/globals.css', 'step41-verify-certificate-trust-continuity', 'Step 41 CSS block exists');
assertIncludes('apps/web/app/globals.css', '@media print', 'Print safety CSS exists');
assertIncludes('apps/web/app/globals.css', '.verify-certificate-trust-continuity', 'Trust continuity CSS selector exists');

assertIncludes('docs/qa/step41-certificate-verify-trust-continuity.md', 'presentation-only', 'Step 41 QA doc records presentation-only boundary');
assertIncludes('docs/qa/step41-certificate-verify-trust-continuity.md', 'Print safety', 'Step 41 QA doc records print safety');

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

console.log('\nStep 41 Certificate / Verify Public Trust Continuity QA complete.');
