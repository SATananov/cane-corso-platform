#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(file) { return readFileSync(path.join(root, file), 'utf8'); }
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function assertFile(file) { existsSync(path.join(root, file)) ? pass(`Required file exists: ${file}`) : fail(`Missing required file: ${file}`); }
function assertIncludes(file, needle, label) { read(file).includes(needle) ? pass(label) : fail(`${label}: missing ${needle}`); }
function assertNotIncludes(file, needle, label) { read(file).includes(needle) ? fail(`${label}: found forbidden ${needle}`) : pass(label); }

console.log('\n====================================================================');
console.log('Step 115 — Platform-wide Progressive Disclosure UX QA');
console.log('====================================================================\n');

const requiredFiles = [
  'apps/web/components/progressive-choice-panel.tsx',
  'apps/web/components/knowledge-article-detail.tsx',
  'apps/web/components/section-content-guide-panel.tsx',
  'apps/web/components/owner-cane-corso-section-workspace.tsx',
  'apps/web/components/cane-corso-pregnancy-puppy-guide.tsx',
  'apps/web/components/owner-health-growth-tracker.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step115-platform-progressive-disclosure-ux.md',
  'scripts/qa-step115-platform-progressive-disclosure-ux.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];
for (const file of requiredFiles) assertFile(file);

const progressive = 'apps/web/components/progressive-choice-panel.tsx';
assertIncludes(progressive, "'use client'", 'Reusable progressive panel is client-side');
assertIncludes(progressive, 'role="tablist"', 'Reusable progressive panel renders tablist');
assertIncludes(progressive, 'role="tab"', 'Reusable progressive panel renders real tabs');
assertIncludes(progressive, 'role="tabpanel"', 'Reusable progressive panel renders selected panel');
assertIncludes(progressive, 'aria-selected={isActive}', 'Tabs expose active state');
assertIncludes(progressive, 'setActiveId', 'Progressive panel switches selected content');
assertIncludes(progressive, 'actionHref', 'Progressive panel supports clear CTA links');
assertIncludes(progressive, 'button-secondary small', 'Progressive panel CTA is an active button-style link');

const article = 'apps/web/components/knowledge-article-detail.tsx';
assertIncludes(article, "import { ProgressiveChoicePanel }", 'Knowledge article imports progressive panel');
assertIncludes(article, 'chooseSectionText', 'Knowledge article explains hidden section model');
assertIncludes(article, 'className="knowledge-article-progressive"', 'Knowledge article uses progressive panel class');
assertIncludes(article, 'items={article.sections.map', 'Knowledge article maps article sections to active buttons');
assertNotIncludes(article, 'article.sections.map((section) => (\n            <section className="knowledge-article-section"', 'Knowledge article no longer renders every section at once');

const guide = 'apps/web/components/section-content-guide-panel.tsx';
assertIncludes(guide, "import { ProgressiveChoicePanel }", 'Section guide imports progressive panel');
assertIncludes(guide, 'getDetailsDescription', 'Section guide tells users one topic opens at a time');
assertIncludes(guide, 'section-content-guide__details--progressive', 'Section guide uses progressive details container');
assertIncludes(guide, 'className="section-content-guide__progressive"', 'Section guide uses progressive panel class');
assertNotIncludes(guide, '<details className="section-content-guide__details">', 'Section guide no longer uses a long collapsed details block');

const owner = 'apps/web/components/owner-cane-corso-section-workspace.tsx';
assertIncludes(owner, "import { ProgressiveChoicePanel }", 'Owner Cane Corso workspace imports progressive panel');
assertIncludes(owner, 'className="owner-cane-section-progressive"', 'Owner Cane Corso workspace uses progressive panel class');
assertIncludes(owner, 'actionHref: buildHref(section.hrefKind, dog)', 'Owner choices keep active destination links');
assertIncludes(owner, 'actionLabel: section.action', 'Owner choices keep clear action labels');
assertNotIncludes(owner, '<div className="owner-cane-section-grid">', 'Owner workspace no longer displays every long action card at once');
assertNotIncludes(owner, '<p>{section.body}</p>\n            <p>{section.body}</p>', 'Owner workspace does not duplicate section body copy');

const pregnancy = 'apps/web/components/cane-corso-pregnancy-puppy-guide.tsx';
assertIncludes(pregnancy, 'activeTable ? <GuideTableCard table={activeTable}', 'Pregnancy guide still shows one selected table only');
assertIncludes(pregnancy, 'setActiveSectionId', 'Pregnancy guide still switches selected table');

const tracker = 'apps/web/components/owner-health-growth-tracker.tsx';
assertIncludes(tracker, 'owner-health-insight-switch', 'Health/Growth keeps active insight tabs');
assertIncludes(tracker, "activeInsightPanel === 'records'", 'Health/Growth records remain hidden until selected');

const css = 'apps/web/app/globals.css';
assertIncludes(css, 'Step 115 — Platform-wide Progressive Disclosure UX Pass START', 'Step 115 CSS block exists');
assertIncludes(css, '.progressive-choice-panel__tabs button', 'Progressive button CSS exists');
assertIncludes(css, '.progressive-choice-panel__body', 'Progressive selected body CSS exists');
assertIncludes(css, '.owner-cane-section-progressive', 'Owner progressive CSS exists');
assertIncludes(css, '.section-content-guide__details--progressive', 'Section guide progressive CSS exists');
assertIncludes(css, '.knowledge-article-progressive', 'Knowledge article progressive CSS exists');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step115:platform-progressive-disclosure:qa'] === 'node scripts/qa-step115-platform-progressive-disclosure-ux.mjs') pass('Package script step115:platform-progressive-disclosure:qa exists');
else fail('Package script step115:platform-progressive-disclosure:qa missing');

const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step115-platform-progressive-disclosure-ux.md', 'Release QA requires Step 115 doc');
assertIncludes(release, 'scripts/qa-step115-platform-progressive-disclosure-ux.mjs', 'Release QA requires Step 115 script');
assertIncludes(release, 'step115:platform-progressive-disclosure:qa', 'Release QA requires Step 115 package script');
assertIncludes(release, 'Step 115 platform-wide progressive disclosure UX', 'Release QA runs Step 115 script');

for (const lockedFile of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'packages/db/drizzle/0014_dog_health_records.sql',
]) {
  assertFile(lockedFile);
  assertNotIncludes(lockedFile, 'Step 115', `${lockedFile} not touched by Step 115 marker`);
  assertNotIncludes(lockedFile, 'platform-progressive-disclosure', `${lockedFile} not touched by Step 115 patch`);
}

if (process.exitCode) {
  console.error('\nStep 115 Platform-wide Progressive Disclosure UX QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 115 Platform-wide Progressive Disclosure UX QA PASS');
