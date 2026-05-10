#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
};

function assertFile(relativePath) {
  if (exists(relativePath)) pass(`${relativePath} exists`);
  else fail(`${relativePath} exists`);
}

function assertIncludes(label, content, fragment) {
  if (content.includes(fragment)) pass(label);
  else fail(`${label} — missing: ${fragment}`);
}

function assertNotIncludes(label, content, fragment) {
  if (!content.includes(fragment)) pass(label);
  else fail(`${label} — unexpected: ${fragment}`);
}

console.log('--- Step 100 Owner/Dog Privacy Boundary QA ---');

const registryPagePath = 'apps/web/app/(public)/registry/[slug]/page.tsx';
const publicRegistryProfilePath = 'apps/web/components/public-registry-profile.tsx';
const memberProfilePath = 'apps/web/app/(member)/profile/page.tsx';
const myDogsOverviewPath = 'apps/web/components/my-dogs-overview.tsx';
const roleAwarePath = 'apps/web/components/role-aware-action-panel.tsx';
const readmePath = 'README.md';
const qaDocPath = 'docs/qa/step100-owner-dog-privacy-boundary.md';

[
  registryPagePath,
  publicRegistryProfilePath,
  memberProfilePath,
  myDogsOverviewPath,
  roleAwarePath,
  readmePath,
  qaDocPath,
].forEach(assertFile);

const registryPage = exists(registryPagePath) ? read(registryPagePath) : '';
const publicRegistryProfile = exists(publicRegistryProfilePath) ? read(publicRegistryProfilePath) : '';
const memberProfile = exists(memberProfilePath) ? read(memberProfilePath) : '';
const myDogsOverview = exists(myDogsOverviewPath) ? read(myDogsOverviewPath) : '';
const roleAware = exists(roleAwarePath) ? read(roleAwarePath) : '';
const readme = exists(readmePath) ? read(readmePath) : '';
const packageJson = JSON.parse(read('package.json'));
const releaseQa = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');

assertIncludes('Registry detail route derives owner viewer from current session and registry owner', registryPage, 'const isOwnerViewer = Boolean(currentSession?.user.profileId && currentSession.user.profileId === document?.entry.owner.profileId);');
assertIncludes('Registry detail route passes isOwnerViewer into public profile component', registryPage, 'isOwnerViewer={isOwnerViewer}');
assertIncludes('Registry hero copy explains user-first public core', registryPage, 'Публичният профил показва най-важното първо');

assertIncludes('Public registry profile accepts isOwnerViewer prop', publicRegistryProfile, 'isOwnerViewer?: boolean;');
assertIncludes('Protected registry depth is owner/admin only', publicRegistryProfile, 'const viewerCanSeeProtectedRegistryDepth = isOwnerViewer || isAdminViewer;');
assertIncludes('Public essentials card is rendered for non-owner/admin viewers', publicRegistryProfile, 'registry-public-essentials-card');
assertIncludes('Public essentials copy names approved photos', publicRegistryProfile, 'publicEssentialsPhotos');
assertIncludes('Public essentials copy names Cane Corso name', publicRegistryProfile, 'publicEssentialsIdentity');
assertIncludes('Public essentials copy names birth date', publicRegistryProfile, 'publicEssentialsBirthDate');
assertIncludes('Public essentials copy names owner public name', publicRegistryProfile, 'publicEssentialsOwner');
assertIncludes('Birth date remains visible in public essentials', publicRegistryProfile, '<dd>{entry.dog.dateOfBirth ?? copy.labels.notAvailable}</dd>');
assertIncludes('Microchip is owner/admin-only', publicRegistryProfile, 'viewerCanSeeProtectedRegistryDepth ? entry.dog.microchipNumber');
assertIncludes('Pedigree number is owner/admin-only', publicRegistryProfile, 'viewerCanSeeProtectedRegistryDepth ? entry.dog.pedigreeNumber');
assertIncludes('Registry class is owner/admin-only outside safe public view', publicRegistryProfile, 'viewerCanSeeProtectedRegistryDepth ? formatRegistryClass');
assertIncludes('Parent line is gated by protected depth', publicRegistryProfile, 'viewerCanSeeProtectedRegistryDepth && parents.length > 0');
assertIncludes('Community rating panel is gated by protected depth', publicRegistryProfile, 'viewerCanSeeProtectedRegistryDepth ? (\n        <CommunityRatingPanel');
assertIncludes('Pedigree tree is gated by protected depth', publicRegistryProfile, 'viewerCanSeeProtectedRegistryDepth ? (\n        <section className="content-card registry-pedigree-card">');
assertIncludes('Registry story is gated by protected depth', publicRegistryProfile, 'viewerCanSeeProtectedRegistryDepth ? (\n        <section className="content-card registry-story-card">');
assertNotIncludes('Old member-registration unlock claim is removed from registry copy', publicRegistryProfile, 'unlock after member registration');
assertNotIncludes('Old Bulgarian member unlock claim is removed from registry copy', publicRegistryProfile, 'отключват след членска регистрация');

assertIncludes('Owner profile page explains full owner data is owner/admin visible', memberProfile, 'Ти и админът виждате пълните данни');
assertIncludes('Owner profile page clarifies public Registry uses only safe owner presentation', memberProfile, 'публичният Регистър използва само публичното име');
assertIncludes('My Dogs overview explains other people see only approved public core', myDogsOverview, 'Другите хора виждат само одобрени снимки, име на Cane Corso, дата на раждане и публично име на собственика.');
assertIncludes('My Dogs overview explains full Cane Corso data stays owner/admin only', myDogsOverview, 'Пълните Cane Corso данни остават видими само за теб и админ.');
assertIncludes('Role-aware profile panel says profile means owner data', roleAware, 'Това е профилът на човека, не на Cane Corso.');
assertIncludes('Role-aware My Dogs panel says full data stays owner/admin-only', roleAware, 'Пълните данни са за теб и админ.');

assertIncludes('README current checkpoint is Step 100', readme, 'Step 100 — Owner and Cane Corso Privacy Boundary');
assertIncludes('README trust rules explain owner data visibility', readme, 'Owner profile data is visible to the owner and admin; the owner can update it.');
assertIncludes('README trust rules explain dog data visibility', readme, 'Full Cane Corso data is visible to the owner and admin; the owner can update it.');
assertIncludes('README trust rules explain approved public Registry core', readme, 'Approved public Registry view shows only approved photos, Cane Corso name, birth date, and owner public name');

if (packageJson.scripts?.['step100:owner-dog-privacy:qa']) pass('Package script step100:owner-dog-privacy:qa exists');
else fail('Package script step100:owner-dog-privacy:qa exists');
assertIncludes('All-in-one release QA includes Step 100 required doc', releaseQa, 'docs/qa/step100-owner-dog-privacy-boundary.md');
assertIncludes('All-in-one release QA includes Step 100 script', releaseQa, 'scripts/qa-step100-owner-dog-privacy-boundary.mjs');
assertIncludes('All-in-one release QA runs Step 100 guardrail', releaseQa, 'Step 100 owner/dog privacy boundary');

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

for (const file of lockedFiles) assertFile(file);

if (process.exitCode) {
  console.error('Step 100 Owner/Dog Privacy Boundary QA failed.');
  process.exit(process.exitCode);
}

console.log('Step 100 Owner/Dog Privacy Boundary QA complete.');
