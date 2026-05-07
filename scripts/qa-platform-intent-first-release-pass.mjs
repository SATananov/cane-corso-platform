import { readFileSync, existsSync } from 'node:fs';

const checks = [];
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function expect(condition, message) { condition ? pass(message) : fail(message); }
function read(path) { return readFileSync(path, 'utf8'); }
function expectOrder(text, first, second, message) {
  const a = text.indexOf(first);
  const b = text.indexOf(second);
  expect(a >= 0 && b >= 0 && a < b, message);
}

console.log('--- Step 92 platform intent-first release pass QA ---');

expect(existsSync('docs/qa/step92-platform-intent-first-release-pass.md'), 'Step 92 QA doc exists');
expect(existsSync('scripts/qa-platform-intent-first-release-pass.mjs'), 'Step 92 QA script exists');

const pkg = read('package.json');
expect(pkg.includes('platform:intent-release:qa'), 'Package script platform:intent-release:qa exists');

const registryPage = read('apps/web/app/(public)/registry/page.tsx');
expectOrder(registryPage, '<PublicRegistryOverview', '<RegistryCertificateReleaseFlowPanel', 'Registry overview appears before explanatory release-flow panel');

const registryDetail = read('apps/web/app/(public)/registry/[slug]/page.tsx');
expect(registryDetail.includes('Публичният профил показва най-важното първо'), 'Registry detail BG hero note is intent-first');
expect(!registryDetail.includes('project spirit'), 'Registry detail no longer uses mixed project-spirit copy');

const galleryPage = read('apps/web/app/(public)/gallery/page.tsx');
expect(galleryPage.includes("import { InfoPanelGrid }"), 'Gallery imports lower support grid');
expectOrder(galleryPage, '<section className="content-card usg-gallery-showcase">', '<GalleryCertifiedShowcaseTrustPanel', 'Gallery showcase appears before explanatory trust panel');
expect(!galleryPage.slice(0, galleryPage.indexOf('<section className="content-card usg-gallery-showcase">')).includes('cards={copy.cards}'), 'Gallery no longer renders explanation cards above the showcase');
expect(galleryPage.includes('USG Галерия'), 'Gallery BG title stays focused on the gallery content');

const verifyLanding = read('apps/web/app/verify/page.tsx');
expectOrder(verifyLanding, '<VerifyEntryPanel', '<InfoPanelGrid', 'Verify entry form appears before explanation panels');
for (const phrase of ['Verify договор', 'trust пътя', 'registry публикацията', 'Owner workspace', 'review и публикацията']) {
  expect(!verifyLanding.includes(phrase), `Verify landing avoids mixed BG/EN phrase: ${phrase}`);
}

const verifyResult = read('apps/web/app/verify/[code]/page.tsx');
expectOrder(verifyResult, '<VerificationResultPanel', '<InfoPanelGrid', 'Verify result appears before explanation panels');
for (const phrase of ['verify резултат', 'registry профил', 'trust слой', 'Owner път']) {
  expect(!verifyResult.includes(phrase), `Verify result avoids mixed BG/EN phrase: ${phrase}`);
}

const reviewPage = read('apps/web/app/(admin)/review/page.tsx');
expectOrder(reviewPage, '<ReviewQueueDashboard', '<AdminOperationalClarityPanel', 'Admin review queue appears before helper panel');
expect(reviewPage.includes('Преглед за Регистър'), 'Admin review BG hero chip is localized');
expect(!reviewPage.includes('Registry преглед'), 'Admin review avoids mixed Registry review chip');

const adminEcosystemPage = read('apps/web/app/(admin)/admin/ecosystem/page.tsx');
expectOrder(adminEcosystemPage, '<EcosystemModerationDashboard', '<AdminOperationalClarityPanel', 'Admin ecosystem queue appears before helper panel');

const memberEcosystemPage = read('apps/web/app/(member)/ecosystem/page.tsx');
expect(memberEcosystemPage.includes('Проверка, Преглед и Админ'), 'Member ecosystem BG hero note uses localized section names');

for (const locked of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
]) {
  expect(existsSync(locked), `Locked authority file remains present: ${locked}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('Platform intent-first release pass QA complete.');
