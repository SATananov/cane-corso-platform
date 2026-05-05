#!/usr/bin/env node

/**
 * Milestone 1 — Owner Submission Happy-Path QA
 *
 * Static guardrail for the product-facing owner submission flow.
 * It verifies the new happy-path panel is wired into the member dog form
 * without touching auth/session, Registry, Certificate, Verify, Gallery,
 * admin moderation authority, or Neon connection boundaries.
 */

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function check(label, condition, detail = '') {
  checks.push({ label, condition: Boolean(condition), detail });
}

function packageScript(name) {
  return JSON.parse(read('package.json')).scripts?.[name];
}

const componentPath = 'apps/web/components/owner-submission-happy-path-panel.tsx';
const workspacePath = 'apps/web/components/my-dog-form-workspace.tsx';
const cssPath = 'apps/web/app/globals.css';
const docPath = 'docs/qa/milestone1-owner-submission-happy-path.md';

check('Owner submission happy-path component exists', exists(componentPath));
check('Milestone 1 QA document exists', exists(docPath));
check(
  'Package script owner:submission-happy-path:qa exists',
  packageScript('owner:submission-happy-path:qa') === 'node scripts/qa-owner-submission-happy-path.mjs',
);

const component = read(componentPath);
const workspace = read(workspacePath);
const css = read(cssPath);
const doc = read(docPath);

for (const locale of ['en', 'bg', 'it']) {
  check(`Happy-path copy includes locale ${locale}`, component.includes(`${locale}: {`));
}

for (const step of ['profile', 'draft', 'submission', 'admin']) {
  check(`Happy-path component includes ${step} step`, component.includes(`${step}: [`));
}

for (const boundary of ['Auth', 'session', 'Registry', 'Certificate', 'Gallery', 'Verify', 'admin authority']) {
  check(`Happy-path copy/doc records ${boundary} boundary`, component.includes(boundary) || doc.includes(boundary));
}

check('Happy-path component receives DogLifecycleStatus', component.includes('DogLifecycleStatus'));
check('Happy-path component tracks draft persistence', component.includes('hasPersistedProfile'));
check('Happy-path component tracks submitted-or-beyond lifecycle', component.includes('submittedOrBeyond'));
check('Happy-path component keeps media workspace CTA member-owned', component.includes('/my-dogs/${props.dogId}/media'));
check('Happy-path component keeps overview CTA member-owned', component.includes('href="/my-dogs"'));

check('Dog form workspace imports happy-path panel', workspace.includes("OwnerSubmissionHappyPathPanel"));
check('Dog form workspace renders happy-path panel before DogProfileForm', workspace.indexOf('<OwnerSubmissionHappyPathPanel') < workspace.indexOf('<DogProfileForm'));
check('Dog form workspace derives live validation issues', workspace.includes('hasBlockingSubmissionIssues'));
check('Dog form workspace keeps client validation', workspace.includes('validateDogForm'));
check('Dog form workspace keeps API mutation client wiring', workspace.includes('mutateDogProfile'));
check('Dog form workspace keeps submit_for_review action', workspace.includes("runAction('submit_for_review')"));
check('Dog form workspace keeps save_draft action', workspace.includes("runAction('save_draft')"));

check('Milestone 1 CSS block exists', css.includes('Milestone 1 — Owner submission happy-path flow START'));
check('Happy-path visual root class exists', css.includes('.owner-submission-happy-path'));
check('Happy-path responsive CSS exists', css.includes('@media (max-width: 760px)') && css.includes('.owner-submission-happy-path__steps'));
check('Happy-path heritage theme CSS exists', css.includes("[data-theme='heritage'] .owner-submission-happy-path"));

for (const lockedFile of [
  'apps/web/app/api/session/route.ts',
  'apps/web/app/api/auth/sign-in/route.ts',
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/app/(admin)/review/actions.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
]) {
  check(`Locked authority file still exists: ${lockedFile}`, exists(lockedFile));
}

check('Milestone 1 doc records local validation chain', doc.includes('pnpm owner:submission-happy-path:qa') && doc.includes('pnpm typecheck'));
check('Milestone 1 doc records browser test path', doc.includes('/my-dogs/new') && doc.includes('submit for review'));

const failed = checks.filter((item) => !item.condition);
for (const item of checks) {
  console.log(`${item.condition ? 'PASS' : 'FAIL'} ${item.label}${item.detail ? ` — ${item.detail}` : ''}`);
}

if (failed.length) {
  console.error(`\nOwner submission happy-path QA failed with ${failed.length} issue(s).`);
  process.exit(1);
}

console.log('\nOwner submission happy-path QA complete.');
