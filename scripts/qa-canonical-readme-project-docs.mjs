import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
};

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

console.log('--- Step 93.1 canonical README and project docs QA ---');

if (exists('README.md')) pass('Root README.md exists');
else fail('Root README.md exists');

const readme = exists('README.md') ? read('README.md') : '';

const requiredReadmePhrases = [
  'Cane Corso Platform — USG / Unico Suo Genere',
  'Current checkpoint',
  'Core product surfaces',
  'Trust and privacy rules',
  'Community model',
  'Admin-mediated',
  'Registry and certificate boundaries',
  'Knowledge and content authority',
  'Tech stack',
  'Environment setup',
  'QA commands',
  'Clean checkpoint ZIP rules',
  'Netlify deployment',
  'Browser smoke checklist',
  'Development principles',
  'docs/archive/package-notes/',
];

for (const phrase of requiredReadmePhrases) {
  if (readme.includes(phrase)) pass(`README includes: ${phrase}`);
  else fail(`README includes: ${phrase}`);
}

const bannedReadmePhrases = [
  'cane-corso-platform_clean_after_step9_checkpoint_hygiene.zip',
  'Step 8 are documented',
  'first seeded member uses:',
  'working platform placeholder',
];

for (const phrase of bannedReadmePhrases) {
  if (!readme.includes(phrase)) pass(`README avoids outdated phrase: ${phrase}`);
  else fail(`README avoids outdated phrase: ${phrase}`);
}

const packageJson = JSON.parse(read('package.json'));
if (packageJson.scripts?.['docs:readme:qa']) pass('Package script docs:readme:qa exists');
else fail('Package script docs:readme:qa exists');

if (exists('docs/qa/step93-1-canonical-readme-project-docs.md')) pass('Step 93.1 QA doc exists');
else fail('Step 93.1 QA doc exists');

if (exists('docs/archive/package-notes')) pass('Package notes archive exists');
else fail('Package notes archive exists');

const rootFiles = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name);

const allowedRootReadmes = new Set([
  'README.md',
  'README_SOFTUNI_CAPSTONE.md',
]);

const rootPatchClutter = rootFiles.filter((name) => {
  if (allowedRootReadmes.has(name)) return false;
  return /^(README_|PATCH_|PATCH_NOTES|QA_|STEP\d|USG_|PACKAGING_|CLEAN_ZIP)/.test(name);
});

if (rootPatchClutter.length === 0) pass('Root directory has no legacy patch README/notes clutter');
else fail(`Root directory has legacy patch README/notes clutter: ${rootPatchClutter.join(', ')}`);

const archivedExamples = [
  'docs/archive/package-notes/README_PATCH.txt',
  'docs/archive/package-notes/PATCH_NOTES.txt',
  'docs/archive/package-notes/PACKAGING_NOTES_CANE_CORSO_PLATFORM.txt',
];

for (const relativePath of archivedExamples) {
  if (exists(relativePath)) pass(`Archived package note exists: ${relativePath}`);
  else fail(`Archived package note exists: ${relativePath}`);
}

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

for (const relativePath of lockedFiles) {
  if (exists(relativePath)) pass(`Locked authority file remains present: ${relativePath}`);
  else fail(`Locked authority file remains present: ${relativePath}`);
}

if (process.exitCode) {
  console.error('Canonical README QA failed.');
  process.exit(process.exitCode);
}

console.log('Canonical README and project docs QA complete.');
