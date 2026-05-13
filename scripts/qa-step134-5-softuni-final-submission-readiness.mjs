#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
};
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

console.log('--- Step 134.5 SoftUni final submission readiness QA ---');

const requiredFiles = [
  'README.md',
  'README_SOFTUNI_CAPSTONE.md',
  'AGENTS.md',
  '.env.example',
  'apps/web/.env.example',
  'docs/architecture/softuni-scalability-proof.md',
  'docs/qa/step134-5-softuni-final-submission-readiness.md',
  'packages/db/scripts/seed-softuni-demo-data.mjs',
  'packages/db/scripts/seed-softuni-scalability-dataset.mjs',
  'apps/web/app/api/ecosystem/route.ts',
  'packages/db/src/repositories/ecosystem.repository.ts',
  'packages/contracts/src/ecosystem/ecosystem.types.ts',
  'scripts/qa-canonical-readme-project-docs.mjs',
  'scripts/qa-step95-repository-hygiene-release-gate.mjs',
  'scripts/qa-step107-usg-product-lock.mjs',
];

for (const relativePath of requiredFiles) {
  if (exists(relativePath)) pass(`Required file exists: ${relativePath}`);
  else fail(`Required file exists: ${relativePath}`);
}

const packageJson = exists('package.json') ? JSON.parse(read('package.json')) : { scripts: {} };
const requiredScripts = [
  'demo:seed:softuni',
  'softuni:scalability:seed',
  'step134-5:softuni-final:qa',
  'docs:readme:qa',
  'release:all:qa',
];

for (const scriptName of requiredScripts) {
  if (packageJson.scripts?.[scriptName]) pass(`Package script exists: ${scriptName}`);
  else fail(`Package script exists: ${scriptName}`);
}

const softuniReadme = exists('README_SOFTUNI_CAPSTONE.md') ? read('README_SOFTUNI_CAPSTONE.md') : '';
const requiredReadmePhrases = [
  'Stefan A. Tananov',
  's.tananov@yahoo.com',
  'https://github.com/SATananov/cane-corso-platform',
  'https://cane-corso-platform.netlify.app/',
  'softuni-user@demo.cane-corso.local',
  'softuni-admin@demo.cane-corso.local',
  'SoftuniDemo2026!',
  'Reviewer Quick Start',
  'Visual Product Evidence Map',
  'Personal Motivation',
  'Regression-Based Growth Insight',
  'ASK MARK I',
  'Visual architecture overview',
  'Simplified ERD',
  'Capstone Requirement Mapping',
  'SoftUni Assessment Coverage',
  'pnpm softuni:scalability:seed',
];

for (const phrase of requiredReadmePhrases) {
  if (softuniReadme.includes(phrase)) pass(`SoftUni README includes: ${phrase}`);
  else fail(`SoftUni README includes: ${phrase}`);
}

const forbiddenReadmePhrases = [
  's.tanannov@yahoo.com',
  'softuni.demo@usg.local',
  'softuni.admin@usg.local',
  'softuni.partner@usg.local',
  'DemoMember123!',
  'DemoAdmin123!',
  'DemoPartner123!',
];

for (const phrase of forbiddenReadmePhrases) {
  if (!softuniReadme.includes(phrase)) pass(`SoftUni README avoids outdated demo phrase: ${phrase}`);
  else fail(`SoftUni README avoids outdated demo phrase: ${phrase}`);
}

const scalabilitySeed = exists('packages/db/scripts/seed-softuni-scalability-dataset.mjs')
  ? read('packages/db/scripts/seed-softuni-scalability-dataset.mjs')
  : '';

const scalabilitySeedPhrases = [
  'TARGET_RECORDS = 10_000',
  'BATCH_SIZE = 500',
  'ON CONFLICT (slug)'.toLowerCase(),
  'SoftUni scalability seed complete',
  'softuni-scale-listing',
];

for (const phrase of scalabilitySeedPhrases) {
  const haystack = phrase === 'ON CONFLICT (slug)'.toLowerCase() ? scalabilitySeed.toLowerCase() : scalabilitySeed;
  if (haystack.includes(phrase)) pass(`Scalability seed includes: ${phrase}`);
  else fail(`Scalability seed includes: ${phrase}`);
}

const ecosystemApi = exists('apps/web/app/api/ecosystem/route.ts') ? read('apps/web/app/api/ecosystem/route.ts') : '';
for (const phrase of ['searchParams.get(\'page\')', 'searchParams.get(\'pageSize\')', 'getPublishedEcosystemDirectoryDocument(']) {
  if (ecosystemApi.includes(phrase)) pass(`Ecosystem API supports paging marker: ${phrase}`);
  else fail(`Ecosystem API supports paging marker: ${phrase}`);
}

const ecosystemRepository = exists('packages/db/src/repositories/ecosystem.repository.ts')
  ? read('packages/db/src/repositories/ecosystem.repository.ts')
  : '';
for (const phrase of ['PublishedDirectoryOptions', 'MAX_DIRECTORY_PAGE_SIZE', '.limit(pagination.pageSize).offset(pagination.offset)', 'count(*)', 'document.pagination']) {
  if (ecosystemRepository.includes(phrase)) pass(`Ecosystem repository paging marker exists: ${phrase}`);
  else fail(`Ecosystem repository paging marker exists: ${phrase}`);
}

const ecosystemTypes = exists('packages/contracts/src/ecosystem/ecosystem.types.ts')
  ? read('packages/contracts/src/ecosystem/ecosystem.types.ts')
  : '';
for (const phrase of ['pagination?:', 'totalItems: number', 'hasNextPage: boolean']) {
  if (ecosystemTypes.includes(phrase)) pass(`Ecosystem contract exposes pagination marker: ${phrase}`);
  else fail(`Ecosystem contract exposes pagination marker: ${phrase}`);
}

const canonicalQa = exists('scripts/qa-canonical-readme-project-docs.mjs') ? read('scripts/qa-canonical-readme-project-docs.mjs') : '';
if (canonicalQa.includes('README_SOFTUNI_CAPSTONE.md') && canonicalQa.includes('allowedRootReadmes')) {
  pass('Canonical README QA explicitly allows README_SOFTUNI_CAPSTONE.md');
} else {
  fail('Canonical README QA explicitly allows README_SOFTUNI_CAPSTONE.md');
}

const step95Qa = exists('scripts/qa-step95-repository-hygiene-release-gate.mjs')
  ? read('scripts/qa-step95-repository-hygiene-release-gate.mjs')
  : '';
if (step95Qa.includes('README_SOFTUNI_CAPSTONE.md') && step95Qa.includes('allowedRootReadmes')) {
  pass('Step 95 repository hygiene QA explicitly allows README_SOFTUNI_CAPSTONE.md');
} else {
  fail('Step 95 repository hygiene QA explicitly allows README_SOFTUNI_CAPSTONE.md');
}

const step107Qa = exists('scripts/qa-step107-usg-product-lock.mjs') ? read('scripts/qa-step107-usg-product-lock.mjs') : '';
if (step107Qa.includes('README_SOFTUNI_CAPSTONE.md') && step107Qa.includes('allowedRootReadmes')) {
  pass('Step 107 product lock QA explicitly allows README_SOFTUNI_CAPSTONE.md');
} else {
  fail('Step 107 product lock QA explicitly allows README_SOFTUNI_CAPSTONE.md');
}

const fullReleaseQa = exists('scripts/qa-fullstack-all-in-one-release-lock.mjs')
  ? read('scripts/qa-fullstack-all-in-one-release-lock.mjs')
  : '';
for (const phrase of [
  'README_SOFTUNI_CAPSTONE.md',
  'docs/architecture/softuni-scalability-proof.md',
  'docs/qa/step134-5-softuni-final-submission-readiness.md',
  'scripts/qa-step134-5-softuni-final-submission-readiness.mjs',
  'step134-5:softuni-final:qa',
  'Step 134.5 SoftUni final submission readiness',
]) {
  if (fullReleaseQa.includes(phrase)) pass(`Release QA includes Step 134.5 marker: ${phrase}`);
  else fail(`Release QA includes Step 134.5 marker: ${phrase}`);
}

if (exists('.git')) {
  const commitCount = spawnSync('git', ['rev-list', '--count', 'HEAD'], { cwd: root, encoding: 'utf8' });
  const commitDays = spawnSync('git', ['log', '--date=short', '--pretty=%ad'], { cwd: root, encoding: 'utf8' });

  if (commitCount.status === 0) {
    const count = Number(commitCount.stdout.trim());
    if (count >= 15) pass(`Git commit count is at least 15 (${count})`);
    else fail(`Git commit count is at least 15 (${count})`);
  } else {
    fail('Git commit count can be read');
  }

  if (commitDays.status === 0) {
    const days = new Set(commitDays.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
    if (days.size >= 3) pass(`Git commit days are at least 3 (${days.size})`);
    else fail(`Git commit days are at least 3 (${days.size})`);
  } else {
    fail('Git commit days can be read');
  }
} else {
  pass('Git history check skipped in clean ZIP extraction; verify commit count/days in the actual GitHub repository before hand-in');
}

if (process.exitCode) {
  console.error('Step 134.5 SoftUni final submission readiness QA FAIL');
  process.exit(process.exitCode);
}

console.log('Step 134.5 SoftUni final submission readiness QA PASS');
