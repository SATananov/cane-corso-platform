#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readmePath = path.join(root, 'docs/product/current-platform-state-bg.md');
const rootReadmePath = path.join(root, 'README.md');
const pkgPath = path.join(root, 'package.json');
const fullReleasePath = path.join(root, 'scripts/qa-fullstack-all-in-one-release-lock.mjs');

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function assertFile(filePath, label) {
  if (!existsSync(filePath)) fail(`${label} missing`);
  else pass(`${label} exists`);
}

function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) fail(`${label}: missing ${needle}`);
  else pass(label);
}

function assertNotIncludes(text, needle, label) {
  if (text.includes(needle)) fail(`${label}: found forbidden wording ${needle}`);
  else pass(label);
}

console.log('\n========================================');
console.log('Step 124 — Current Platform README QA');
console.log('========================================\n');

assertFile(readmePath, 'Bulgarian current-state README');
assertFile(rootReadmePath, 'Root README');
assertFile(pkgPath, 'package.json');
assertFile(fullReleasePath, 'Full-stack release QA script');

const bgReadme = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : '';
const rootReadme = existsSync(rootReadmePath) ? readFileSync(rootReadmePath, 'utf8') : '';
const pkg = existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath, 'utf8')) : { scripts: {} };
const fullRelease = existsSync(fullReleasePath) ? readFileSync(fullReleasePath, 'utf8') : '';

for (const phrase of [
  'Step 123 — ML-safe Photo Assistant Prototype',
  'Провери за истинско',
  'USG Standard Match',
  'Photo Readiness',
  'Admin Review',
  'human-in-the-loop',
  'Dataset guardrails',
  'ML-safe Photo Assistant Prototype',
  'не доказва порода',
  'Registry',
  'Certificate',
  'FCI',
]) {
  assertIncludes(bgReadme, phrase, `Current-state README documents ${phrase}`);
}

for (const phrase of [
  'Step 119',
  'Step 120',
  'Step 121',
  'Step 122',
  'Step 123',
]) {
  assertIncludes(bgReadme, phrase, `Current-state README includes ${phrase}`);
}

for (const unsafe of [
  'AI доказа породата',
  'AI доказва породата',
  'AI approved breed',
  'purebred proof',
  'истинско / фалшиво',
]) {
  assertNotIncludes(bgReadme, unsafe, 'No unsafe AI/breed-proof claim in current-state README');
}

assertIncludes(rootReadme, 'Step 123 — ML-safe Photo Assistant Prototype', 'Root README checkpoint updated to Step 123');
assertIncludes(rootReadme, 'docs/product/current-platform-state-bg.md', 'Root README links Bulgarian current-state README');
assertIncludes(rootReadme, 'USG Standard Match', 'Root README documents Standard Match boundary');
assertIncludes(rootReadme, 'ML-safe Photo Assistant prototype', 'Root README documents ML-safe assistant boundary');

if (!pkg.scripts?.['step124:current-platform-readme:qa']) fail('package script step124:current-platform-readme:qa missing');
else pass('package script step124:current-platform-readme:qa exists');

assertIncludes(fullRelease, 'docs/qa/step124-current-platform-readme.md', 'Full release QA requires Step 124 QA doc');
assertIncludes(fullRelease, 'scripts/qa-step124-current-platform-readme.mjs', 'Full release QA requires Step 124 QA script');
assertIncludes(fullRelease, 'step124:current-platform-readme:qa', 'Full release QA requires Step 124 package script');

if (process.exitCode) {
  console.error('\n========================================');
  console.error('Step 124 Current Platform README QA FAILED');
  console.error('========================================');
  process.exit(process.exitCode);
}

console.log('\n========================================');
console.log('Step 124 Current Platform README QA PASS');
console.log('========================================');
