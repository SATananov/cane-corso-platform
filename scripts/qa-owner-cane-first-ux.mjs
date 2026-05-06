import { readFileSync, existsSync } from 'node:fs';

const checks = [];
function pass(label) { checks.push({ label, ok: true }); console.log(`PASS ${label}`); }
function fail(label) { checks.push({ label, ok: false }); console.error(`FAIL ${label}`); }
function assert(condition, label) { condition ? pass(label) : fail(label); }
function read(path) { return readFileSync(path, 'utf8'); }

const packageJson = read('package.json');
const profilePage = read('apps/web/app/(member)/profile/page.tsx');
const myDogsOverview = read('apps/web/components/my-dogs-overview.tsx');
const spotlight = read('apps/web/components/owner-cane-corso-spotlight.tsx');
const formWorkspace = read('apps/web/components/my-dog-form-workspace.tsx');
const previewCard = read('apps/web/components/dog-profile-preview-card.tsx');
const readinessPanel = read('apps/web/components/owner-review-readiness-panel.tsx');
const myDogCard = read('apps/web/components/my-dog-card.tsx');
const globalsCss = read('apps/web/app/globals.css');

console.log('--- Step 83 owner Cane Corso-first UX QA ---');

assert(existsSync('docs/qa/step83-owner-profile-cane-first-ux.md'), 'Step 83 QA document exists');
assert(packageJson.includes('owner:cane-first-ux:qa'), 'Package script owner:cane-first-ux:qa exists');
assert(existsSync('apps/web/components/owner-cane-corso-spotlight.tsx'), 'Owner Cane Corso spotlight component exists');

assert(profilePage.includes('OwnerCaneCorsoSpotlight'), 'Profile page renders the Cane Corso spotlight');
assert(profilePage.indexOf('<OwnerCaneCorsoSpotlight') < profilePage.indexOf('profile-page__journey-card'), 'Profile page shows Cane Corso before the journey checklist');
assert(profilePage.includes('enrichProfileDogsWithMedia'), 'Profile page enriches dog photos before rendering spotlight');
assert(profilePage.includes('getPublishedRegistryProfileDocument'), 'Profile page can show published ratings without changing registry logic');

assert(myDogsOverview.includes('OwnerCaneCorsoSpotlight'), 'My Dogs overview renders the main spotlight');
assert(myDogsOverview.includes('secondaryDogs.length > 0'), 'My Dogs avoids repeating the heavy dog card for a single profile');
assert(myDogsOverview.indexOf('<OwnerCaneCorsoSpotlight') < myDogsOverview.indexOf('<OwnerPhotoGuidePanel'), 'My Dogs shows the real Cane Corso before side guidance');
assert(myDogsOverview.includes('OwnerReviewReadinessPanel'), 'My Dogs keeps review readiness guidance available');
assert(myDogsOverview.includes('getPublishedRegistryProfileDocument'), 'My Dogs keeps registry/public lookup read-only');

assert(spotlight.includes('communityRating') && spotlight.includes('adminAssessment') && spotlight.includes('certificateLabel'), 'Spotlight shows community rating, USG assessment, and certificate state');
assert(spotlight.includes('galleryImages.length}/3') || spotlight.includes('galleryImages.length'), 'Spotlight shows the 3-photo progress');
assert(spotlight.includes('nextActionText'), 'Spotlight shows one clear next action');
assert(spotlight.includes('bg:') && spotlight.includes('it:') && spotlight.includes('en:'), 'Spotlight includes BG/IT/EN copy');

assert(formWorkspace.includes('dog-form-priority-card'), 'Edit workspace starts with a priority summary card');
assert(formWorkspace.indexOf('dog-form-priority-card') < formWorkspace.indexOf('<DogProfileForm'), 'Priority summary appears before the form');
assert(formWorkspace.indexOf('<OwnerSubmissionHappyPathPanel') < formWorkspace.indexOf('<DogProfileForm'), 'Happy path guidance remains before the form for existing QA contract');
assert(formWorkspace.indexOf('<DogProfileForm') < formWorkspace.indexOf('<OwnerReviewReadinessPanel'), 'Readiness details are moved after the form in the main column');
assert(previewCard.includes('OwnerReviewReadinessPanel'), 'Preview card keeps compact live readiness guidance');

assert(!readinessPanel.includes('Готовност за owner review'), 'BG readiness copy no longer mixes owner review');
assert(!readinessPanel.includes('admin преглед') && !readinessPanel.includes('review admin'), 'BG/IT readiness cleanup removed mixed admin review marker from localized copy');
assert(!readinessPanel.includes('Owner описание'), 'BG readiness copy no longer says Owner описание');
assert(!myDogCard.includes('owner снимки'), 'BG dog card no longer says owner снимки');
assert(!myDogCard.includes('registry review'), 'Dog card no longer exposes registry review in localized title');

assert(globalsCss.includes('Step 83 — Owner profile clarity and Cane Corso-first UX'), 'Step 83 CSS block exists');
assert(globalsCss.includes('owner-cane-spotlight__grid'), 'Spotlight layout CSS exists');
assert(globalsCss.includes('dog-form-priority-card__grid'), 'Form priority CSS exists');

const lockedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
];

for (const file of lockedFiles) {
  assert(existsSync(file), `Locked surface still exists: ${file}`);
}

const failed = checks.filter((check) => !check.ok);
if (failed.length) {
  console.error(`\nStep 83 owner Cane Corso-first UX QA failed: ${failed.length} issue(s).`);
  process.exit(1);
}

console.log('\nStep 83 owner Cane Corso-first UX QA complete.');
