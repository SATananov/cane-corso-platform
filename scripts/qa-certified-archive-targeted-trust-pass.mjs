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

function assertNotIncludes(file, needle, message) {
  const text = read(file);
  if (text.includes(needle)) {
    throw new Error('FAIL ' + message + ' — found unwanted "' + needle + '" in ' + file);
  }
  pass(message);
}

const certifiedPage = 'apps/web/app/(public)/certified/page.tsx';

assertExists(certifiedPage, 'Certified archive page exists');
assertExists('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Shared Gallery/Certified trust panel exists');
assertExists('docs/qa/step43-certified-archive-targeted-trust-pass.md', 'Step 43 QA document exists');

assertIncludes('package.json', '"certified:archive-trust:qa"', 'Root package exposes Step 43 QA command');

assertIncludes(certifiedPage, 'GalleryCertifiedShowcaseTrustPanel', 'Certified page imports/renders shared trust panel');
assertIncludes(certifiedPage, 'variant="certified"', 'Certified page uses certified trust variant');
assertIncludes(certifiedPage, 'variant="certified" locale={locale}', 'Certified panel receives locale for multi-language support');

assertIncludes(certifiedPage, 'Архив на сертификати', 'Certified page has readable Bulgarian eyebrow');
assertIncludes(certifiedPage, 'USG Сертифицирани', 'Certified page has readable Bulgarian title');
assertIncludes(certifiedPage, 'È separato', 'Certified page has readable Italian copy');

assertNotIncludes(certifiedPage, 'Рђ', 'Certified page no longer contains mojibake marker Рђ');
assertNotIncludes(certifiedPage, 'Рџ', 'Certified page no longer contains mojibake marker Рџ');
assertNotIncludes(certifiedPage, 'Г€', 'Certified page no longer contains mojibake marker Г€');

assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'USG Certified', 'Shared panel supports Certified archive mark');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'official archive', 'Shared panel marks Certified as official archive');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Certificate issued', 'Certified variant explains certificate-issued boundary');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Verify continuity', 'Certified variant explains Verify continuity');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Gallery boundary', 'Certified variant explains Gallery boundary');

assertIncludes('apps/web/app/globals.css', 'step42-gallery-certified-showcase-trust', 'Step 42 shared CSS remains present');
assertIncludes('docs/qa/step43-certified-archive-targeted-trust-pass.md', 'Locked boundaries', 'Step 43 QA doc records locked boundaries');

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

console.log('\nStep 43 Certified Archive Targeted Trust Pass QA complete.');
