#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failed = false;
const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => { console.error(`FAIL ${message}`); failed = true; };
const read = (file) => {
  const full = path.join(root, file);
  if (!existsSync(full)) { fail(`${file} exists`); return ''; }
  pass(`${file} exists`);
  return readFileSync(full, 'utf8');
};
const includes = (label, text, needle) => text.includes(needle) ? pass(`${label} includes ${needle}`) : fail(`${label} includes ${needle}`);
const notIncludes = (label, text, needle) => text.includes(needle) ? fail(`${label} does not include ${needle}`) : pass(`${label} does not include ${needle}`);

console.log('--- Step 106 Full Product Structure Reset QA ---');

const navigation = read('apps/web/lib/navigation.ts');
const header = read('apps/web/components/site-header.tsx');
const member = read('apps/web/app/(member)/member/page.tsx');
const sectionGuide = read('apps/web/components/section-content-guide-panel.tsx');
const knowledgePage = read('apps/web/app/(public)/knowledge/page.tsx');
const knowledgeCenter = read('apps/web/components/knowledge-center.tsx');
const communityPage = read('apps/web/app/(public)/community/page.tsx');
const myDogs = read('apps/web/components/my-dogs-overview.tsx');
const css = read('apps/web/app/globals.css');
const envExample = read('.env.example');
const pkg = read('package.json');
const doc = read('docs/qa/step106-full-product-structure-reset.md');

includes('Navigation', navigation, "{ label: t.navigation.knowledge, href: '/knowledge' }");
includes('Navigation', navigation, "{ label: labels.verify, href: '/verify' }");
notIncludes('Navigation primary', navigation, "gallery: string");
includes('Header', header, "{ href: '/my-dogs', label: t.navigation.myDogs, accent: true");
includes('Header', header, "memberRequestsLabel");
notIncludes('Header guest', header, "{ href: '/access?intent=partner', label: t.common.joinPartner");

includes('Member page', member, 'member-home-reset');
includes('Member page', member, 'Какво искаш да направиш сега?');
notIncludes('Member page', member, 'OwnerOnboardingFinalPanel');
notIncludes('Member page', member, 'SectionContentGuidePanel');
notIncludes('Member page', member, 'RoleAwareActionPanel');

includes('Section guide', sectionGuide, 'section-content-guide--quiet');
includes('Section guide', sectionGuide, 'section-content-guide__details-copy');
notIncludes('Section guide compact row', sectionGuide, '<p>{copy.description}</p>');

notIncludes('Knowledge page', knowledgePage, 'RoleAwareActionPanel');
notIncludes('Knowledge page', knowledgePage, 'SectionContentGuidePanel');
includes('Knowledge center', knowledgeCenter, 'knowledge-center--library-first');
includes('Knowledge center', knowledgeCenter, 'Статии по тема');
notIncludes('Knowledge center', knowledgeCenter, 'KnowledgeEducationExperience');
notIncludes('Knowledge center', knowledgeCenter, 'showLibrary');

includes('Community page', communityPage, 'Намери помощ, дом, партньор, места и услуги');
includes('Community page', communityPage, 'community-secondary-details');
notIncludes('Community page', communityPage, 'old project');
notIncludes('Community page', communityPage, 'Future abbinamento');
notIncludes('Community page', communityPage, 'layer community');
notIncludes('Community page', communityPage, 'RoleAwareActionPanel');
notIncludes('Community page', communityPage, 'SectionContentGuidePanel');

includes('My Dogs', myDogs, 'owner-secondary-help');
notIncludes('My Dogs', myDogs, '<RoleAwareActionPanel');
notIncludes('My Dogs', myDogs, '<SectionContentGuidePanel');

includes('CSS', css, 'Step 106 — full product structure reset');
includes('CSS', css, '.member-start-grid');
includes('CSS', css, '.section-content-guide--quiet');
includes('Env example', envExample, 'AUTH_SECRET=replace-with-a-long-random-local-secret');
includes('Package script', pkg, 'step106:product-structure:qa');
includes('Step 106 doc', doc, 'Full Product Structure Reset');

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
  if (existsSync(path.join(root, file))) pass(`${file} exists`);
  else fail(`${file} exists`);
}

if (failed) {
  console.error('Step 106 Full Product Structure Reset QA FAILED');
  process.exit(1);
}
console.log('Step 106 Full Product Structure Reset QA complete.');
