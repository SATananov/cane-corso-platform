import { readFileSync, existsSync } from 'node:fs';

const checks = [];
function pass(label) { checks.push({ label, ok: true }); console.log(`PASS ${label}`); }
function fail(label) { checks.push({ label, ok: false }); console.error(`FAIL ${label}`); }
function assert(condition, label) { condition ? pass(label) : fail(label); }
function read(path) { return readFileSync(path, 'utf8'); }

const profilePage = read('apps/web/app/(member)/profile/page.tsx');
const myDogsOverview = read('apps/web/components/my-dogs-overview.tsx');
const memberPage = read('apps/web/app/(member)/member/page.tsx');
const onboardingPanel = read('apps/web/components/owner-onboarding-final-panel.tsx');
const globalsCss = read('apps/web/app/globals.css');
const packageJson = read('package.json');

console.log('--- Step 78 user clarity and scroll reduction QA ---');

assert(existsSync('docs/qa/step78-user-clarity-scroll-reduction.md'), 'Step 78 QA document exists');
assert(packageJson.includes('"user:clarity-scroll:qa"'), 'Package script user:clarity-scroll:qa exists');

assert(onboardingPanel.includes('<details className="owner-onboarding-final-panel__details"'), 'Owner onboarding guidance is collapsible');
assert(onboardingPanel.includes("const shouldOpen = surface === 'access'"), 'Owner guidance stays open on access and compact in member/profile surfaces');
assert(onboardingPanel.includes('copy.summary') && onboardingPanel.includes('copy.openLabel'), 'Collapsed guidance still explains how the workflow works');

assert(profilePage.includes('profile-page__hero-actions-grid--priority'), 'Profile hero uses priority action layout');
assert(!profilePage.includes('profile-page__center-card'), 'Profile page removes extra bottom section-card hub noise');
assert(!profilePage.includes('@/components/section-card'), 'Profile page does not import SectionCard after cleanup');
assert(profilePage.includes('primaryNextHref'), 'Profile page computes one primary next action');

assert(!myDogsOverview.includes('InfoPanelGrid'), 'My Dogs removes the large top step grid before the real workspace');
assert(!myDogsOverview.includes('@/components/section-card'), 'My Dogs removes the extra section card hub import');
assert(myDogsOverview.indexOf('my-dogs-directory-card') < myDogsOverview.indexOf('<OwnerPhotoGuidePanel'), 'My Dogs shows the real profile workspace before the guidance sidebar');
assert(!myDogsOverview.includes('route-hero-actions') || !myDogsOverview.includes('t.common.manageMedia}\n          </Link>\n        </div>\n      </section>'), 'My Dogs hero does not overload the top with media management');

assert(!memberPage.includes('cards={copy.cards}'), 'Member command center hero does not render extra navigation cards before the workspace');
assert(memberPage.includes('OwnerCenterWorkspace'), 'Member command center keeps the existing owner workspace');

assert(globalsCss.includes('Step 78 — User clarity and scroll reduction polish START'), 'Step 78 CSS block exists');
assert(globalsCss.includes('owner-onboarding-final-panel__summary'), 'Step 78 CSS styles compact guidance summary');
assert(globalsCss.includes('profile-page__hero-actions-grid--priority'), 'Step 78 CSS styles profile priority actions');

assert(profilePage.includes('getCurrentProfileDocument') && profilePage.includes('getCurrentMemberDogsDocument'), 'Profile server data authority remains intact');
assert(myDogsOverview.includes('OwnerReviewReadinessPanel'), 'My Dogs review readiness remains intact');
assert(myDogsOverview.includes('getPublishedRegistryProfileDocument'), 'Registry/public lookup remains read-only and intact');

const failed = checks.filter((check) => !check.ok);
if (failed.length) {
  console.error(`\nStep 78 QA failed: ${failed.length} issue(s).`);
  process.exit(1);
}

console.log('\nStep 78 user clarity and scroll reduction QA complete.');
