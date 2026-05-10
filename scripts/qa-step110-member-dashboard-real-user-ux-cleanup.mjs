#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(file) { return readFileSync(path.join(root, file), 'utf8'); }
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function assertFile(file) { existsSync(path.join(root, file)) ? pass(`Required file exists: ${file}`) : fail(`Missing required file: ${file}`); }
function assertIncludes(file, needle, label) { read(file).includes(needle) ? pass(label) : fail(`${label}: missing ${needle}`); }
function assertNotIncludes(file, needle, label) { read(file).includes(needle) ? fail(`${label}: found ${needle}`) : pass(label); }
function assertBefore(file, first, second, label) {
  const content = read(file);
  const a = content.indexOf(first);
  const b = content.indexOf(second);
  if (a === -1) fail(`${label}: missing first marker ${first}`);
  else if (b === -1) fail(`${label}: missing second marker ${second}`);
  else if (a < b) pass(label);
  else fail(`${label}: wrong order`);
}

console.log('\n==========================================================');
console.log('Step 110 — Member Dashboard Real User UX Cleanup QA');
console.log('==========================================================\n');

const requiredFiles = [
  'apps/web/app/(member)/member/page.tsx',
  'apps/web/components/owner-center-workspace.tsx',
  'apps/web/components/owner-journey-command-center.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step110-member-dashboard-real-user-ux-cleanup.md',
  'scripts/qa-step110-member-dashboard-real-user-ux-cleanup.mjs',
];
for (const file of requiredFiles) assertFile(file);

const memberPage = 'apps/web/app/(member)/member/page.tsx';
assertIncludes(memberPage, 'Твоят Cane Corso център', 'Bulgarian member hero is real-user focused');
assertIncludes(memberPage, 'Health and growth', 'English health shortcut copy exists');
assertIncludes(memberPage, 'Здраве и растеж', 'Bulgarian health shortcut copy exists');
assertIncludes(memberPage, 'Salute e crescita', 'Italian health shortcut copy exists');
assertIncludes(memberPage, 'member-home-reset--real-user', 'Member page uses Step 110 real-user layout class');
assertIncludes(memberPage, 'data-layout="priority"', 'Member page marks the start grid as priority actions');
assertIncludes(memberPage, 'healthHref', 'Member page computes Health & Growth shortcut');
assertIncludes(memberPage, '`/my-dogs/${firstDog.id}/health`', 'Health shortcut routes to selected Cane Corso health page when possible');
assertIncludes(memberPage, "'/my-dogs/new'", 'Health shortcut falls back to add profile when no Cane Corso exists');
assertBefore(memberPage, '<section className="member-start-grid', '<OwnerCenterWorkspace document={document} locale={locale} />', 'Member actions stay before the live owner workspace');
assertNotIncludes(memberPage, 'member-status-card', 'Old explanatory status card removed from /member');
assertNotIncludes(memberPage, 'statusText', 'Old status copy removed from /member');

const workspace = 'apps/web/components/owner-center-workspace.tsx';
assertIncludes(workspace, 'owner-center-stack--real-user', 'Owner workspace uses real-user stack class');
assertIncludes(workspace, 'owner-center-panel--priority', 'Owner workspace promotes next practical action');
assertIncludes(workspace, 'owner-center-lane-grid--primary', 'Owner workspace uses direct action lane grid');
assertIncludes(workspace, 'Дневник за грижа', 'Bulgarian care log lane exists');
assertIncludes(workspace, 'Health and growth', 'Health & Growth lane exists');
assertIncludes(workspace, 'href: \'__health__\'', 'Health lane uses dynamic placeholder');
assertIncludes(workspace, 'firstDog ? `/my-dogs/${firstDog.id}/health` : \'/my-dogs/new\'', 'Owner workspace computes dynamic health link');
assertIncludes(workspace, 'member-journey-details', 'Full owner journey is moved into expandable detail');
assertIncludes(workspace, '<OwnerJourneyCommandCenter document={document} locale={locale} />', 'Owner journey component remains available');
assertNotIncludes(workspace, 'owner-center-ecosystem-intro', 'Extra ecosystem intro is removed from first dashboard flow');

const journey = 'apps/web/components/owner-journey-command-center.tsx';
assertIncludes(journey, 'miniLabels', 'Owner journey mini stat labels are localized');
assertIncludes(journey, "total: 'Общо'", 'Bulgarian total label exists');
assertIncludes(journey, "draft: 'Чернови'", 'Bulgarian drafts label exists');
assertIncludes(journey, "review: 'Преглед'", 'Bulgarian review label exists');
assertIncludes(journey, "public: 'Публични'", 'Bulgarian public label exists');
assertIncludes(journey, "fix: 'Корекции'", 'Bulgarian fix label exists');
assertIncludes(journey, 'copy.miniLabels.total', 'Mini stat total label uses localized copy');
assertIncludes(journey, 'copy.miniLabels.draft', 'Mini stat draft label uses localized copy');
assertIncludes(journey, 'copy.miniLabels.review', 'Mini stat review label uses localized copy');
assertIncludes(journey, 'copy.miniLabels.public', 'Mini stat public label uses localized copy');
assertIncludes(journey, 'copy.miniLabels.fix', 'Mini stat fix label uses localized copy');
assertNotIncludes(journey, '<span>Total</span>', 'Hardcoded Total label removed');
assertNotIncludes(journey, '<span>Draft</span>', 'Hardcoded Draft label removed');
assertNotIncludes(journey, '<span>Review</span>', 'Hardcoded Review label removed');
assertNotIncludes(journey, '<span>Public</span>', 'Hardcoded Public label removed');
assertNotIncludes(journey, '<span>Fix</span>', 'Hardcoded Fix label removed');
assertNotIncludes(journey, 'Галерия / showcase', 'Mixed BG/showcase label removed');

const css = 'apps/web/app/globals.css';
assertIncludes(css, 'Step 110 — Member Dashboard Real User UX Cleanup START', 'Step 110 CSS block exists');
assertIncludes(css, '.member-home-reset--real-user', 'Member real-user layout CSS exists');
assertIncludes(css, '.member-start-grid--priority', 'Priority member action grid CSS exists');
assertIncludes(css, '.owner-center-panel--priority', 'Priority owner panel CSS exists');
assertIncludes(css, '.member-journey-details', 'Expandable owner journey CSS exists');

const doc = 'docs/qa/step110-member-dashboard-real-user-ux-cleanup.md';
assertIncludes(doc, 'Member Dashboard Real User UX Cleanup', 'Step 110 doc title exists');
assertIncludes(doc, 'No intended changes to', 'Step 110 doc records boundaries');
assertIncludes(doc, 'Health & Growth', 'Step 110 doc records Health & Growth shortcut');

const pkg = JSON.parse(read('package.json'));
pkg.scripts?.['step110:member-dashboard:qa'] === 'node scripts/qa-step110-member-dashboard-real-user-ux-cleanup.mjs'
  ? pass('Package script step110:member-dashboard:qa exists')
  : fail('Package script step110:member-dashboard:qa missing');

const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step110-member-dashboard-real-user-ux-cleanup.md', 'Release QA requires Step 110 doc');
assertIncludes(release, 'scripts/qa-step110-member-dashboard-real-user-ux-cleanup.mjs', 'Release QA requires Step 110 script');
assertIncludes(release, 'step110:member-dashboard:qa', 'Release QA requires Step 110 package script');
assertIncludes(release, 'Step 110 Member dashboard real-user UX cleanup', 'Release QA runs Step 110 guardrail');

for (const lockedFile of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'apps/web/app/api/dogs/[dogId]/health/route.ts',
  'packages/db/drizzle/0014_dog_health_records.sql',
]) {
  assertFile(lockedFile);
  assertNotIncludes(lockedFile, 'member-home-reset--real-user', `${lockedFile} not touched by member dashboard CSS/classes`);
  assertNotIncludes(lockedFile, 'Step 110', `${lockedFile} not touched by Step 110 marker`);
}

if (process.exitCode) {
  console.error('\n==========================================================');
  console.error('Step 110 QA FAILED');
  console.error('==========================================================');
  process.exit(process.exitCode);
}

console.log('\n==========================================================');
console.log('Step 110 QA PASS');
console.log('==========================================================');
