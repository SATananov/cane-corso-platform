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

assertExists('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'Admin Registry evidence polish panel exists');
assertExists('docs/qa/step40-admin-registry-evidence-polish.md', 'Step 40 QA document exists');

assertIncludes('package.json', '"admin:registry-evidence:qa"', 'Root package exposes Step 40 QA command');

assertIncludes('apps/web/app/(admin)/admin/registry/page.tsx', 'AdminRegistryEvidencePolishPanel', 'Admin Registry page renders evidence polish panel');
assertIncludes('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'Registry публикация', 'Panel explains Registry publication');
assertIncludes('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'USG сертификат', 'Panel explains certificate decision');
assertIncludes('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'USG Gallery', 'Panel explains Gallery curation');
assertIncludes('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'Owner source data', 'Panel explains owner source boundary');
assertIncludes('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'presentation-only', 'Panel is explicitly presentation-only');

assertIncludes('apps/web/app/globals.css', 'step40-admin-registry-evidence-polish', 'Step 40 CSS block exists');
assertIncludes('docs/qa/step40-admin-registry-evidence-polish.md', 'Locked boundaries', 'Step 40 QA doc records locked boundaries');

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

console.log('\nStep 40 Admin Registry Evidence / Control Clarity Polish QA complete.');
