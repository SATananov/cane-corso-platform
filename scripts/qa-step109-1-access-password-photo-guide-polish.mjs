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

console.log('\n==========================================================');
console.log('Step 109.1 — Access Password Visibility & Photo Guide Polish QA');
console.log('==========================================================\n');

const requiredFiles = [
  'apps/web/components/member-access-panel.tsx',
  'apps/web/components/owner-photo-guide-panel.tsx',
  'apps/web/components/my-dogs-overview.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step109-1-access-password-photo-guide-polish.md',
  'scripts/qa-step109-1-access-password-photo-guide-polish.mjs',
];
for (const file of requiredFiles) assertFile(file);

const access = 'apps/web/components/member-access-panel.tsx';
assertIncludes(access, 'showPasswordLabel', 'Access copy defines show password label');
assertIncludes(access, 'hidePasswordLabel', 'Access copy defines hide password label');
assertIncludes(access, "showPasswordLabel: 'Покажи паролата'", 'Bulgarian show password label exists');
assertIncludes(access, "hidePasswordLabel: 'Скрий паролата'", 'Bulgarian hide password label exists');
assertIncludes(access, "showPasswordLabel: 'Mostra password'", 'Italian show password label exists');
assertIncludes(access, "hidePasswordLabel: 'Nascondi password'", 'Italian hide password label exists');
assertIncludes(access, "showPasswordLabel: 'Show password'", 'English show password label exists');
assertIncludes(access, "hidePasswordLabel: 'Hide password'", 'English hide password label exists');
assertIncludes(access, 'showSignUpPassword', 'Sign-up password visibility state exists');
assertIncludes(access, 'showSignInPassword', 'Sign-in password visibility state exists');
assertIncludes(access, "type={showSignUpPassword ? 'text' : 'password'}", 'Sign-up input toggles password visibility');
assertIncludes(access, "type={showSignInPassword ? 'text' : 'password'}", 'Sign-in input toggles password visibility');
assertIncludes(access, 'aria-pressed={showSignInPassword}', 'Sign-in visibility button exposes pressed state');
assertIncludes(access, 'aria-pressed={showSignUpPassword}', 'Sign-up visibility button exposes pressed state');
assertIncludes(access, 'password-field__toggle', 'Password visibility button class exists');
assertNotIncludes(access, "console.info('[access-login-payload]'", 'Access login no longer prints password-length debug payload');

const guide = 'apps/web/components/owner-photo-guide-panel.tsx';
assertIncludes(guide, 'owner-photo-guide-panel--text-only', 'Owner photo guide uses text-only side card modifier');
assertIncludes(guide, 'owner-photo-guide-panel__action', 'Owner photo guide has clear action link');
assertIncludes(guide, '#owner-photo-review-guidance', 'Owner photo guide links to expandable guidance anchor');
assertIncludes(guide, 'Отвори пълните насоки за снимки', 'Bulgarian owner guide action exists');
assertIncludes(guide, 'Apri la guida foto completa', 'Italian owner guide action exists');
assertNotIncludes(guide, 'getBreedStandardDiagramById', 'Owner side card no longer loads diagram data');
assertNotIncludes(guide, '<img', 'Owner side card no longer renders cramped inline image');

const overview = 'apps/web/components/my-dogs-overview.tsx';
assertIncludes(overview, 'id="owner-photo-review-guidance"', 'Expandable owner photo guidance has a stable anchor');
assertIncludes(overview, 'UsgOwnerPhotoChecklistPanel', 'Full owner photo checklist remains available');

const css = 'apps/web/app/globals.css';
assertIncludes(css, 'Step 109.1 — Access password visibility + owner photo guide polish START', 'Step 109.1 CSS block exists');
assertIncludes(css, '.password-field__toggle', 'Password toggle styling exists');
assertIncludes(css, '.owner-photo-guide-panel--text-only .owner-photo-guide-panel__visual', 'Inline photo visual is hidden by modifier');
assertIncludes(css, '.owner-photo-guide-panel__action', 'Owner photo guide action styling exists');

const pkg = JSON.parse(read('package.json'));
pkg.scripts?.['step109-1:access-photo-guide:qa'] ? pass('Package script step109-1:access-photo-guide:qa exists') : fail('Package script step109-1:access-photo-guide:qa missing');

const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step109-1-access-password-photo-guide-polish.md', 'Release QA requires Step 109.1 doc');
assertIncludes(release, 'scripts/qa-step109-1-access-password-photo-guide-polish.mjs', 'Release QA requires Step 109.1 script');
assertIncludes(release, 'Step 109.1 Access password/photo guide polish', 'Release QA runs Step 109.1 guardrail');

for (const lockedFile of [
  'apps/web/app/(public)/registry/page.tsx',
  'apps/web/app/verify/page.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/(admin)/review/page.tsx',
]) {
  assertNotIncludes(lockedFile, 'password-field__toggle', `${lockedFile} is not touched by access password polish`);
  assertNotIncludes(lockedFile, 'owner-photo-review-guidance', `${lockedFile} is not touched by owner photo guide polish`);
}

if (process.exitCode) {
  console.error('\n==========================================================');
  console.error('Step 109.1 QA FAILED');
  console.error('==========================================================');
  process.exit(process.exitCode);
}

console.log('\n==========================================================');
console.log('Step 109.1 QA PASS');
console.log('==========================================================');
