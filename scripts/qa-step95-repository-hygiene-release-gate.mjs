#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failed = false;

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  failed = true;
  console.error(`FAIL ${message}`);
}

function assert(condition, message) {
  condition ? pass(message) : fail(message);
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

console.log('--- Step 95 Repository Hygiene & Release Gate Repair QA ---');

const readme = exists('README.md') ? read('README.md') : '';
const pkg = JSON.parse(read('package.json'));
const releaseQa = exists('scripts/qa-fullstack-all-in-one-release-lock.mjs')
  ? read('scripts/qa-fullstack-all-in-one-release-lock.mjs')
  : '';

assert(exists('README.md'), 'Root README.md exists');
assert(readme.includes('Step 95 — Repository Hygiene & Release Gate Repair'), 'README records Step 95 checkpoint');
assert(readme.includes('Step 94.3 — Content Completeness Cleanup & Intent Balance'), 'README records Step 94.3 as previous product state');
assert(readme.includes('docs/archive/package-notes/'), 'README keeps legacy package notes archive path');
assert(readme.includes('apps/web/.env.example'), 'README explains nested .env.example is allowed');

const rootFiles = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name);

const allowedRootReadmes = new Set([
  'README.md',
  'README_SOFTUNI_CAPSTONE.md',
]);

const legacyRootNotes = rootFiles.filter((name) => {
  if (allowedRootReadmes.has(name)) return false;
  return /^(README_|PATCH_|PATCH_NOTES|QA_|STEP\d|USG_|PACKAGING_|CLEAN_ZIP)/.test(name);
});
assert(legacyRootNotes.length === 0, `Root legacy patch/notes clutter removed (${legacyRootNotes.length})`);

const legacyApplyScripts = rootFiles.filter((name) => /^apply-step\d+\.cjs$/.test(name) || /^complete-step\d+\.cjs$/.test(name));
assert(legacyApplyScripts.length === 0, `Root legacy apply scripts removed (${legacyApplyScripts.length})`);

const archivedExamples = [
  'docs/archive/package-notes/README_PATCH.txt',
  'docs/archive/package-notes/PATCH_NOTES.txt',
  'docs/archive/package-notes/PACKAGING_NOTES_CANE_CORSO_PLATFORM.txt',
  'docs/archive/package-notes/legacy-apply-scripts/apply-step37.cjs',
  'docs/archive/package-notes/legacy-apply-scripts/complete-step42.cjs',
];
for (const file of archivedExamples) {
  assert(exists(file), `Archived legacy file exists: ${file}`);
}

const accidentalNestedArtifacts = [
  'packages/apps',
  'packages/docs',
  'packages/scripts',
  'packages/package.json',
];
for (const file of accidentalNestedArtifacts) {
  assert(!exists(file), `Accidental nested patch artifact absent: ${file}`);
}

assert(exists('docs/qa/step95-repository-hygiene-release-gate.md'), 'Step 95 QA document exists');
assert(pkg.scripts?.['step95:repo-hygiene:qa'] === 'node scripts/qa-step95-repository-hygiene-release-gate.mjs', 'Package script step95:repo-hygiene:qa exists');
assert(pkg.scripts?.['release:all:qa'] === 'node scripts/qa-fullstack-all-in-one-release-lock.mjs', 'release:all:qa still points to all-in-one gate');

assert(releaseQa.includes("['Runtime DB target guardrail', 'scripts/qa-runtime-db-target-guardrail.mjs']"), 'All-in-one release QA runs DB target guardrail');
assert(releaseQa.includes("['Netlify deploy readiness', 'scripts/qa-netlify-deploy-readiness.mjs']"), 'All-in-one release QA runs Netlify deploy readiness');
assert(releaseQa.includes("['Canonical README/project docs', 'scripts/qa-canonical-readme-project-docs.mjs']"), 'All-in-one release QA runs README docs guardrail');
assert(!releaseQa.includes("['Pre-Neon lock', 'scripts/qa-pre-neon-lock.mjs']"), 'All-in-one release QA no longer runs historical pre-Neon lock');
assert(releaseQa.includes("!file.endsWith('.env.example')"), 'All-in-one release QA allows nested .env.example files only');

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
  assert(exists(file), `Locked authority file remains present: ${file}`);
}

if (failed) {
  console.error('\nStep 95 Repository Hygiene & Release Gate Repair QA failed.');
  process.exit(1);
}

console.log('\nStep 95 Repository Hygiene & Release Gate Repair QA complete.');
