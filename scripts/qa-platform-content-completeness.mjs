#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = async (file) => fs.readFile(path.join(root, file), 'utf8');

const requiredSurfaces = [
  'platform',
  'registry',
  'gallery',
  'certified',
  'verify',
  'knowledge',
  'faq',
  'community',
  'partners',
  'member',
  'myDogs',
  'profile',
  'ecosystemWorkspace',
  'partnerApply',
  'adminDashboard',
  'review',
  'adminRegistry',
  'adminPartners',
  'adminEcosystem',
  'adminKnowledge',
  'adminMembers',
];

const renderTargets = [
  ['apps/web/app/(public)/platform/page.tsx', 'platform'],
  ['apps/web/app/(public)/registry/page.tsx', 'registry'],
  ['apps/web/app/(public)/gallery/page.tsx', 'gallery'],
  ['apps/web/app/(public)/certified/page.tsx', 'certified'],
  ['apps/web/app/verify/page.tsx', 'verify'],
  ['apps/web/app/verify/[code]/page.tsx', 'verify'],
  ['apps/web/app/(public)/faq/page.tsx', 'faq'],
  ['apps/web/app/(public)/partners/page.tsx', 'partners'],
  ['apps/web/app/(member)/profile/page.tsx', 'profile'],
  ['apps/web/app/(member)/ecosystem/page.tsx', 'ecosystemWorkspace'],
  ['apps/web/app/(member)/partners/apply/page.tsx', 'partnerApply'],
  ['apps/web/app/(admin)/admin/page.tsx', 'adminDashboard'],
  ['apps/web/app/(admin)/review/page.tsx', 'review'],
  ['apps/web/app/(admin)/admin/registry/page.tsx', 'adminRegistry'],
  ['apps/web/app/(admin)/admin/partners/page.tsx', 'adminPartners'],
  ['apps/web/app/(admin)/admin/ecosystem/page.tsx', 'adminEcosystem'],
  ['apps/web/app/(admin)/admin/knowledge/page.tsx', 'adminKnowledge'],
  ['apps/web/app/(admin)/admin/members/page.tsx', 'adminMembers'],
];

const step106ActiveSectionTargets = [
  ['apps/web/app/(public)/knowledge/page.tsx', 'knowledge', 'KnowledgeCenter'],
  ['apps/web/app/(public)/community/page.tsx', 'community', 'EcosystemDirectory'],
  ['apps/web/app/(member)/member/page.tsx', 'member', 'member-home-reset'],
  ['apps/web/components/my-dogs-overview.tsx', 'myDogs', 'owner-secondary-help'],
];

const protectedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/app/api/session/route.ts',
  'apps/web/lib/registry.server.ts',
  'packages/db/src/repositories/my-dogs.repository.ts',
];

const failures = [];
function pass(message) {
  console.log(`PASS ${message}`);
}
function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}
function expect(condition, message) {
  if (condition) pass(message);
  else fail(message);
}

const componentPath = 'apps/web/components/section-content-guide-panel.tsx';
const component = await read(componentPath);
expect(component.includes('export function SectionContentGuidePanel'), 'Section content guide component exists');
expect(component.includes('const bg: ContentMap'), 'Bulgarian content map exists');
expect(component.includes('const en: ContentMap'), 'English content map exists');
expect(component.includes('const it: ContentMap'), 'Italian content map exists');
expect(component.includes('Пълнота на секцията'), 'Bulgarian content uses section-completeness copy');
expect(component.includes('Completezza della sezione'), 'Italian content uses section-completeness copy');
expect(component.includes('Conoscenze'), 'Italian content avoids English Knowledge label inside the guide copy');

for (const surface of requiredSurfaces) {
  expect(component.includes(`| '${surface}'`) || component.includes(`${surface}: {`), `Surface copy exists for ${surface}`);
}

for (const [file, surface] of renderTargets) {
  const text = await read(file);
  expect(text.includes("@/components/section-content-guide-panel"), `${file} imports SectionContentGuidePanel`);
  expect(text.includes(`surface="${surface}"`), `${file} renders content guide surface ${surface}`);
}

for (const [file, surface, marker] of step106ActiveSectionTargets) {
  const text = await read(file);
  expect(!text.includes("@/components/section-content-guide-panel"), `${file} keeps Step 106 active-section structure without SectionContentGuidePanel`);
  expect(text.includes(marker), `${file} renders active product content for ${surface}`);
}

const css = await read('apps/web/app/globals.css');
expect(css.includes('Step 94.3 — platform content completeness guide'), 'Step 94.3 CSS block exists');
expect(css.includes('.section-content-guide__cards'), 'Section guide card grid CSS exists');

const packageJson = JSON.parse(await read('package.json'));
expect(Boolean(packageJson.scripts?.['platform:content-completeness:qa']), 'Package script platform:content-completeness:qa exists');

const docs = await read('docs/qa/step94-3-platform-content-completeness.md');
expect(docs.includes('Step 94.3'), 'Step 94.3 QA documentation exists');
expect(docs.includes('no DB/Auth/API authority changes'), 'Step 94.3 documentation records no authority changes');

const rolePanel = await read('apps/web/components/role-aware-action-panel.tsx');
expect(!rolePanel.includes('Object.fromEntries(\n  Object.entries(bg)'), 'Role-aware action copy no longer derives EN/IT from Bulgarian');
expect(rolePanel.includes('const it: SurfaceMap'), 'Role-aware action panel has explicit Italian map');
expect(rolePanel.includes('Cosa vuoi fare adesso?'), 'Role-aware Italian action copy is real Italian');

const galleryPage = await read('apps/web/app/(public)/gallery/page.tsx');
for (const forbidden of ['layer showcase', 'Trazione community', 'layer trust', 'USG Gallery da admin']) {
  expect(!galleryPage.includes(forbidden), `Gallery Italian copy avoids mixed term: ${forbidden}`);
}

for (const protectedFile of protectedFiles) {
  const text = await read(protectedFile);
  expect(!text.includes('SectionContentGuidePanel'), `Protected authority file is untouched by content guide: ${protectedFile}`);
}

if (failures.length > 0) {
  console.error(`\nPlatform content completeness QA failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log('\nPlatform content completeness QA complete.');
