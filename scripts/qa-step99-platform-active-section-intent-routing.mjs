#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failed = false;

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  failed = true;
}

function read(file) {
  const full = path.join(root, file);
  if (!existsSync(full)) {
    fail(`Missing file: ${file}`);
    return '';
  }
  pass(`File exists: ${file}`);
  return readFileSync(full, 'utf8');
}

function assertIncludes(file, content, needle, label = needle) {
  if (content.includes(needle)) pass(`${file} includes ${label}`);
  else fail(`${file} missing ${label}`);
}

function assertBefore(file, content, first, second, label) {
  const a = content.indexOf(first);
  const b = content.indexOf(second);
  if (a === -1) fail(`${file} missing first marker for ${label}: ${first}`);
  else if (b === -1) fail(`${file} missing second marker for ${label}: ${second}`);
  else if (a < b) pass(`${label}`);
  else fail(`${label}`);
}

console.log('\n--- Step 99 Platform-wide Active Section Priority & Intent Routing QA ---');

const roleAware = read('apps/web/components/role-aware-action-panel.tsx');
assertIncludes('role-aware-action-panel.tsx', roleAware, 'Активна секция', 'BG active section label');
assertIncludes('role-aware-action-panel.tsx', roleAware, 'Основно действие', 'BG primary action label');
assertIncludes('role-aware-action-panel.tsx', roleAware, 'Информация и помощ', 'BG info/help label');
assertIncludes('role-aware-action-panel.tsx', roleAware, 'role-aware-action-panel__location', 'active section location marker');
assertIncludes('role-aware-action-panel.tsx', roleAware, 'role-aware-action-panel__action-label', 'primary action marker');
assertIncludes('role-aware-action-panel.tsx', roleAware, 'role-aware-action-panel__info-link', 'info routing link');
assertIncludes('role-aware-action-panel.tsx', roleAware, 'function getInfoAction', 'central info routing helper');
assertIncludes('role-aware-action-panel.tsx', roleAware, "surface === 'member' || surface === 'myDogs' || surface === 'profile'", 'member surfaces route info to Knowledge');

const globals = read('apps/web/app/globals.css');
assertIncludes('globals.css', globals, 'Step 99 — Platform-wide Active Section Priority & Intent Routing', 'Step 99 CSS block');
assertIncludes('globals.css', globals, '.role-aware-action-panel__location', 'active section CSS');
assertIncludes('globals.css', globals, '.role-aware-action-panel__info-link', 'info routing CSS');
assertIncludes('globals.css', globals, '.role-aware-action-panel__secondary-label', 'secondary action label CSS');

const memberPage = read('apps/web/app/(member)/member/page.tsx');
assertBefore('member/page.tsx', memberPage, '<OwnerCenterWorkspace document={document} locale={locale} />', '<OwnerOnboardingFinalPanel locale={locale} surface="member" />', 'Member Center shows live owner workspace before onboarding explanation');
assertBefore('member/page.tsx', memberPage, '<OwnerCenterWorkspace document={document} locale={locale} />', '<SectionContentGuidePanel locale={locale} surface="member" />', 'Member Center keeps section guidance after owner workspace');

const myDogs = read('apps/web/components/my-dogs-overview.tsx');
assertBefore('my-dogs-overview.tsx', myDogs, '<section className="route-hero-card route-hero-card--member">', '<RoleAwareActionPanel locale={locale} surface="myDogs"', 'My Dogs starts with the active section hero before routing support');
assertBefore('my-dogs-overview.tsx', myDogs, '<RoleAwareActionPanel locale={locale} surface="myDogs"', '<SectionContentGuidePanel locale={locale} surface="myDogs" />', 'My Dogs supporting information stays after main section context');

const profile = read('apps/web/app/(member)/profile/page.tsx');
assertBefore('profile/page.tsx', profile, '<section className="route-hero-card route-hero-card--member profile-page__hero">', '<RoleAwareActionPanel locale={locale} surface="profile"', 'Profile starts with the active profile section before routing support');
assertBefore('profile/page.tsx', profile, '<div className="stats-grid four-up profile-page__stats">', '<SectionContentGuidePanel locale={locale} surface="profile" />', 'Profile keeps guidance below active profile status');

const publicRoutes = [
  ['apps/web/app/(public)/registry/page.tsx', '<PublicRegistryOverview', '<SectionContentGuidePanel locale={locale} surface="registry" />', 'Registry list/content appears before supporting guide'],
  ['apps/web/app/(public)/community/page.tsx', '<EcosystemDirectory document={document}', '<SectionContentGuidePanel locale={locale} surface="community" />', 'Community intent directory appears before supporting guide'],
  ['apps/web/app/(public)/partners/page.tsx', '<PartnerDirectoryOverview document={document}', '<SectionContentGuidePanel locale={locale} surface="partners" />', 'Partners directory appears before supporting guide'],
  ['apps/web/app/(public)/knowledge/page.tsx', '<KnowledgeCenter copy={copy}', '<SectionContentGuidePanel locale={locale} surface="knowledge" />', 'Knowledge content appears before supporting guide'],
  ['apps/web/app/(public)/faq/page.tsx', '<section className="content-card platform-faq-priority"', '<SectionContentGuidePanel locale={locale} surface="faq" />', 'FAQ answers appear before supporting guide'],
];

for (const [file, first, second, label] of publicRoutes) {
  const content = read(file);
  assertBefore(file, content, first, second, label);
}

const ecosystemPage = read('apps/web/app/(member)/ecosystem/page.tsx');
assertBefore('ecosystem/page.tsx', ecosystemPage, '<EcosystemOwnerWorkspace document={document.ecosystem} locale={locale} />', '<SectionContentGuidePanel locale={locale} surface="ecosystemWorkspace" />', 'Member ecosystem workspace appears before explanatory guide');

const partnerApply = read('apps/web/app/(member)/partners/apply/page.tsx');
assertBefore('partners/apply/page.tsx', partnerApply, '<PartnerApplicationWorkspace document={document}', '<SectionContentGuidePanel locale={locale} surface="partnerApply" />', 'Partner application form appears before explanatory guide');

const reviewPage = read('apps/web/app/(admin)/review/page.tsx');
assertBefore('review/page.tsx', reviewPage, '<ReviewQueueDashboard document={document} locale={locale} />', '<SectionContentGuidePanel locale={locale} surface="review" />', 'Admin review queue appears before explanatory guide');

const doc = read('docs/qa/step99-platform-active-section-intent-routing.md');
assertIncludes('docs/qa/step99-platform-active-section-intent-routing.md', doc, 'Platform-wide Active Section Priority & Intent Routing', 'Step 99 doc title');
assertIncludes('docs/qa/step99-platform-active-section-intent-routing.md', doc, 'Public pages explain. Logged-in pages lead to action.', 'UX principle');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step99:active-section-routing:qa']) pass('Package script step99:active-section-routing:qa exists');
else fail('Package script step99:active-section-routing:qa missing');

const release = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');
assertIncludes('qa-fullstack-all-in-one-release-lock.mjs', release, 'step99:active-section-routing:qa', 'release gate includes Step 99 script');
assertIncludes('qa-fullstack-all-in-one-release-lock.mjs', release, 'qa-step99-platform-active-section-intent-routing.mjs', 'release gate runs Step 99 QA');

const lockedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'apps/web/app/api/health/db/route.ts',
];

for (const file of lockedFiles) {
  if (existsSync(path.join(root, file))) pass(`Locked authority file remains present: ${file}`);
  else fail(`Locked authority file missing: ${file}`);
}

if (failed) {
  console.error('\nStep 99 Platform-wide Active Section Priority & Intent Routing QA FAILED');
  process.exit(1);
}

console.log('\nStep 99 Platform-wide Active Section Priority & Intent Routing QA complete.');
