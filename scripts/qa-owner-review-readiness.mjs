import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function check(label, condition) {
  checks.push({ label, condition: Boolean(condition) });
}

const component = read('apps/web/components/owner-review-readiness-panel.tsx');
const myDogsOverview = read('apps/web/components/my-dogs-overview.tsx');
const myDogFormWorkspace = read('apps/web/components/my-dog-form-workspace.tsx');
const previewCard = read('apps/web/components/dog-profile-preview-card.tsx');
const css = read('apps/web/app/globals.css');
const docs = read('docs/qa/step36-owner-review-readiness.md');
const pkg = JSON.parse(read('package.json'));

check('OwnerReviewReadinessPanel component exists', exists('apps/web/components/owner-review-readiness-panel.tsx'));
check('Owner review readiness QA document exists', exists('docs/qa/step36-owner-review-readiness.md'));
check('Package script owner:review-readiness:qa exists', pkg.scripts?.['owner:review-readiness:qa'] === 'node scripts/qa-owner-review-readiness.mjs');

for (const locale of ['en', 'bg', 'it']) {
  check(`Readiness copy includes locale ${locale}`, component.includes(`${locale}: {`));
}

for (const requiredBoundary of ['Owner profile', 'Registry', 'USG Certificate', 'USG Gallery']) {
  check(`Trust boundary copy includes ${requiredBoundary}`, component.includes(requiredBoundary));
}

for (const item of ['identity', 'details', 'story', 'photos', 'pedigree', 'review']) {
  check(`Readiness checklist includes ${item}`, component.includes(`id: '${item}'`) || component.includes(`${item}: [`));
}

check('My Dogs overview imports readiness panel', myDogsOverview.includes("OwnerReviewReadinessPanel"));
check('My Dogs spotlight renders overview readiness panel', myDogsOverview.includes('context="overview"'));
check('My Dogs spotlight passes media route to readiness panel', myDogsOverview.includes('mediaHref={`/my-dogs/${featuredDog.id}/media`}'));
check('My Dogs spotlight passes public and verify routes to readiness panel', myDogsOverview.includes('publicHref={featuredPublicHref}') && myDogsOverview.includes('verifyHref={featuredVerifyHref}'));

check('Dog form workspace imports readiness panel', myDogFormWorkspace.includes("OwnerReviewReadinessPanel"));
check('Dog form workspace renders form readiness panel', myDogFormWorkspace.includes('context="form"'));
check('Dog form workspace wraps form in main stack', myDogFormWorkspace.includes('form-workspace-main-stack'));
check('Dog form workspace tracks pedigree readiness counts', myDogFormWorkspace.includes('getPedigreeFilledCount') && myDogFormWorkspace.includes('getPedigreePhotoCount'));

check('Preview card imports readiness panel', previewCard.includes("OwnerReviewReadinessPanel"));
check('Preview card renders live preview readiness panel', previewCard.includes('context="preview"'));
check('Preview card passes gallery and pedigree counts', previewCard.includes('galleryImageCount={galleryImages.length}') && previewCard.includes('pedigreeFilledCount={pedigreeFilledCount}'));

check('Step 36 CSS block exists', css.includes('Step 36 — Owner review readiness & public presentation batch START'));
check('Readiness visual class exists', css.includes('.owner-review-readiness'));
check('Compact visual modifier exists', css.includes('.owner-review-readiness--compact'));
check('Form main stack class exists', css.includes('.form-workspace-main-stack'));
check('Responsive readiness CSS exists', css.includes('@media (max-width: 760px)') && css.includes('.owner-review-readiness__metrics'));
check('Heritage theme readiness CSS exists', css.includes("[data-theme='heritage'] .owner-review-readiness"));

for (const lockedFile of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/(admin)/admin/registry/page.tsx',
]) {
  check(`Locked surface still exists: ${lockedFile}`, exists(lockedFile));
}

check('QA doc records locked boundary', docs.includes('Registry / Certificate / Gallery / Verify / Admin moderation / Ecosystem API-DB / Auth'));
check('QA doc records Step 36 scope', docs.includes('Owner / My Dogs Review Readiness & Public Presentation Batch'));

const failed = checks.filter((item) => !item.condition);
for (const item of checks) {
  console.log(`${item.condition ? 'PASS' : 'FAIL'} ${item.label}`);
}

if (failed.length) {
  console.error(`\nOwner review readiness QA failed with ${failed.length} issue(s).`);
  process.exit(1);
}

console.log('\nOwner review readiness QA complete.');
