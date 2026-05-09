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

console.log('--- Step 101 USG Standard Knowledge Layer QA ---');

const componentPath = 'apps/web/components/usg-standard-knowledge-panel.tsx';
const knowledgeCenterPath = 'apps/web/components/knowledge-center.tsx';
const myDogsOverviewPath = 'apps/web/components/my-dogs-overview.tsx';
const reviewPagePath = 'apps/web/app/(admin)/review/page.tsx';
const faqPagePath = 'apps/web/app/(public)/faq/page.tsx';
const globalsPath = 'apps/web/app/globals.css';
const readmePath = 'README.md';
const qaDocPath = 'docs/qa/step101-usg-standard-knowledge-layer.md';
const releaseQaPath = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';

[
  componentPath,
  knowledgeCenterPath,
  myDogsOverviewPath,
  reviewPagePath,
  faqPagePath,
  globalsPath,
  readmePath,
  qaDocPath,
  releaseQaPath,
].forEach(assertFile);

const component = exists(componentPath) ? read(componentPath) : '';
const knowledgeCenter = exists(knowledgeCenterPath) ? read(knowledgeCenterPath) : '';
const myDogsOverview = exists(myDogsOverviewPath) ? read(myDogsOverviewPath) : '';
const reviewPage = exists(reviewPagePath) ? read(reviewPagePath) : '';
const faqPage = exists(faqPagePath) ? read(faqPagePath) : '';
const globals = exists(globalsPath) ? read(globalsPath) : '';
const readme = exists(readmePath) ? read(readmePath) : '';
const releaseQa = exists(releaseQaPath) ? read(releaseQaPath) : '';
const packageJson = JSON.parse(read('package.json'));

assertIncludes('USG standard guide component exports main knowledge panel', component, 'export function UsgStandardKnowledgePanel');
assertIncludes('USG standard guide component exports owner checklist panel', component, 'export function UsgOwnerPhotoChecklistPanel');
assertIncludes('USG standard guide component exports admin review panel', component, 'export function UsgAdminVisualReviewPanel');
assertIncludes('USG standard guide component exports FAQ boundary panel', component, 'export function UsgFaqKnowledgeBoundaryPanel');
assertIncludes('USG guide keeps FCI / ENCI wording visible', component, 'FCI / ENCI');
assertIncludes('USG guide includes photo help card', component, 'Какви снимки най-много помагат за преглед');
assertIncludes('USG guide includes bite caution', component, 'Захапката е част от картината');
assertIncludes('USG guide includes growth caution', component, 'Таблиците за малки и подрастващи са само ориентир');

assertIncludes('Knowledge Center renders the USG standard panel', knowledgeCenter, '<UsgStandardKnowledgePanel locale={locale} />');
assertIncludes('My Dogs renders the owner photo checklist panel', myDogsOverview, '<UsgOwnerPhotoChecklistPanel locale={locale} />');
assertIncludes('Review page renders the admin visual review panel', reviewPage, '<UsgAdminVisualReviewPanel locale={locale} />');
assertIncludes('FAQ page renders the guide boundary panel', faqPage, '<UsgFaqKnowledgeBoundaryPanel locale={locale} />');

assertIncludes('Global CSS includes Step 101 block', globals, 'Step 101 — USG Standard Knowledge Layer');
assertIncludes('Global CSS includes usg-standard-guide class', globals, '.usg-standard-guide');
assertIncludes('Global CSS includes usg-standard-shortcut class', globals, '.usg-standard-shortcut');

assertIncludes('README current checkpoint is Step 101', readme, 'Step 101 — USG Standard Knowledge Layer');
assertIncludes('README notes Knowledge guide under public surfaces', readme, 'USG standard guide');
assertIncludes('README includes Step 101 section', readme, '### Step 101 — USG Standard Knowledge Layer');

if (packageJson.scripts?.['step101:usg-standard-knowledge:qa']) pass('Package script step101:usg-standard-knowledge:qa exists');
else fail('Package script step101:usg-standard-knowledge:qa exists');

assertIncludes('All-in-one release QA includes Step 101 doc', releaseQa, 'docs/qa/step101-usg-standard-knowledge-layer.md');
assertIncludes('All-in-one release QA includes Step 101 script', releaseQa, 'scripts/qa-step101-usg-standard-knowledge-layer.mjs');
assertIncludes('All-in-one release QA runs Step 101 guardrail', releaseQa, 'Step 101 USG standard knowledge layer');

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
  console.error('Step 101 USG Standard Knowledge Layer QA failed.');
  process.exit(process.exitCode);
}

console.log('Step 101 USG Standard Knowledge Layer QA complete.');
