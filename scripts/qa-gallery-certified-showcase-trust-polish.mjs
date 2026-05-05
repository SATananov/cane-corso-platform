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

assertExists('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Gallery/Certified showcase trust panel exists');
assertExists('docs/qa/step42-gallery-certified-showcase-trust-polish.md', 'Step 42 QA document exists');

assertIncludes('package.json', '"gallery:showcase-trust:qa"', 'Root package exposes Step 42 QA command');

assertIncludes('apps/web/app/(public)/gallery/page.tsx', 'GalleryCertifiedShowcaseTrustPanel', 'Public Gallery page renders showcase trust panel');
assertIncludes('apps/web/app/(public)/gallery/page.tsx', 'variant="gallery"', 'Public Gallery page uses gallery variant');

assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'USG Галерия е кураторски слой за витрина', 'Panel explains Gallery as curated showcase in Bulgarian');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Owner uploads', 'Panel explains owner uploads boundary');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Registry boundary', 'Panel explains Registry boundary');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Certificate boundary', 'Panel explains certificate boundary');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'USG Certified', 'Panel supports Certified archive variant');

assertIncludes('apps/web/app/globals.css', 'step42-gallery-certified-showcase-trust', 'Step 42 CSS block exists');

assertIncludes('docs/qa/step42-gallery-certified-showcase-trust-polish.md', 'Locked boundaries', 'Step 42 QA doc records locked boundaries');
assertIncludes('docs/qa/step42-gallery-certified-showcase-trust-polish.md', 'Certified page note', 'Step 42 QA doc records Certified route note');

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

console.log('\nStep 42 Gallery / Certified Showcase Trust Polish QA complete.');
