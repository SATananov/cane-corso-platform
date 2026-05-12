#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failed = false;

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  failed = true;
}

function read(file) {
  return readFileSync(path.join(root, file), 'utf8');
}

function assertFile(file) {
  if (!existsSync(path.join(root, file))) fail(`Required file missing: ${file}`);
  else pass(`Required file exists: ${file}`);
}

function assertIncludes(file, needle, message) {
  const content = read(file);
  if (!content.includes(needle)) fail(`${message}: missing ${needle}`);
  else pass(message);
}

function assertNotIncludes(file, needle, message) {
  const content = read(file);
  if (content.includes(needle)) fail(`${message}: found ${needle}`);
  else pass(message);
}

console.log('\n======================================================');
console.log('Step 133 — Owner Next Action Deep Links & Guided Sections QA');
console.log('======================================================\n');

const requiredFiles = [
  'apps/web/components/usg-owner-path-timeline.tsx',
  'apps/web/components/dog-profile-form.tsx',
  'apps/web/components/form-section-card.tsx',
  'apps/web/components/owner-review-readiness-panel.tsx',
  'apps/web/components/owner-cane-corso-section-workspace.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step133-owner-next-action-deep-links-guided-sections.md',
  'scripts/qa-step133-owner-next-action-deep-links-guided-sections.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

requiredFiles.forEach(assertFile);

assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', '/my-dogs/new', 'Empty owner path links to create profile');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'edit#dog-profile-core', 'Core profile step deep-links to core form section');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'edit#dog-profile-origin', 'Origin step deep-links to origin/pedigree section');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'edit#dog-profile-review', 'Review step deep-links to review section');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'health#growth-table', 'Care step deep-links to growth tracker table');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'href: registryComplete ? publicHref : undefined', 'Registry link appears only when publication exists');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'href: certificateComplete ? verifyHref : undefined', 'Verify link appears only when certificate exists');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'aria-disabled="true"', 'Passive locked steps are not rendered as active links');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'MARK I подсказва следващата практична стъпка', 'MARK I hint is short and helper-only');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'Официалните USG решения остават човешки преглед.', 'Human review authority boundary is explicit');

assertIncludes('apps/web/components/dog-profile-form.tsx', 'id="dog-profile-core"', 'Core form anchor exists');
assertIncludes('apps/web/components/dog-profile-form.tsx', 'id="dog-profile-origin"', 'Origin form anchor exists');
assertIncludes('apps/web/components/dog-profile-form.tsx', 'id="dog-profile-review"', 'Review form anchor exists');
assertIncludes('apps/web/components/dog-profile-form.tsx', 'openGuidedSectionFromHash', 'Edit form opens guided sections from hash');
assertIncludes('apps/web/components/dog-profile-form.tsx', "setOpenPanels((current) => ({ ...current, identity: true, pedigree: true }))", 'Origin hash opens identity and pedigree panels');
assertIncludes('apps/web/components/dog-profile-form.tsx', 'setIsPedigreeVisible(true)', 'Origin hash expands pedigree editor');
assertIncludes('apps/web/components/dog-profile-form.tsx', "setOpenPanels((current) => ({ ...current, checks: true }))", 'Review hash opens checks panel');

assertIncludes('apps/web/components/form-section-card.tsx', 'id?: string', 'FormSectionCard supports anchor ids');
assertIncludes('apps/web/components/form-section-card.tsx', 'id={id}', 'FormSectionCard renders anchor id');

assertIncludes('apps/web/components/owner-review-readiness-panel.tsx', 'props.hasPublication && props.publicHref', 'Readiness panel shows public action only after publication');
assertIncludes('apps/web/components/owner-review-readiness-panel.tsx', 'props.hasCertificate && props.verifyHref', 'Readiness panel shows Verify action only after certificate');

assertIncludes('apps/web/components/owner-cane-corso-section-workspace.tsx', 'edit#dog-profile-core', 'Owner workspace profile action points to core section');
assertIncludes('apps/web/components/owner-cane-corso-section-workspace.tsx', 'edit#dog-profile-review', 'Owner workspace review action points to review section');
assertIncludes('apps/web/components/owner-cane-corso-section-workspace.tsx', 'dog.publication ? `/registry/${dog.publication.publicSlug}#ratings` : undefined', 'Ratings action is passive until publication exists');

assertIncludes('apps/web/app/globals.css', 'Step 133 — Owner Next Action Deep Links & Guided Sections', 'Step 133 CSS marker exists');
assertIncludes('apps/web/app/globals.css', '.usg-owner-path-step:not(.is-passive):hover', 'Passive owner path cards do not get active hover styling');
assertIncludes('apps/web/app/globals.css', '.usg-owner-path-step__action', 'Owner path cards expose action/passive labels visually');
assertIncludes('apps/web/app/globals.css', '.usg-owner-path-step.is-passive', 'Passive owner path styling exists');

const presentationFiles = [
  'apps/web/components/usg-owner-path-timeline.tsx',
  'apps/web/components/dog-profile-form.tsx',
  'apps/web/components/owner-review-readiness-panel.tsx',
  'apps/web/components/owner-cane-corso-section-workspace.tsx',
  'apps/web/app/globals.css',
];

const forbiddenClaims = [
  'AI proves breed',
  'AI доказва породата',
  'ML proves breed',
  'guaranteed pure',
  '100% pure',
  'automatic certificate',
  'automatic Registry approval',
  'automatically approved',
  'diagnoses disease',
  'medical diagnosis system',
  'автоматично одобрява',
  'автоматично издава сертификат',
];

for (const file of presentationFiles) {
  for (const claim of forbiddenClaims) {
    assertNotIncludes(file, claim, `${file} avoids unsafe claim: ${claim}`);
  }
}

const lockedBackendFiles = [
  'packages/db/src/repositories/registry.ts',
  'packages/db/src/repositories/certificates.ts',
  'packages/db/src/repositories/ecosystem.ts',
  'packages/auth/src/session.ts',
  'apps/web/app/api/auth/session/route.ts',
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/app/api/dogs/route.ts',
];

for (const file of lockedBackendFiles) {
  if (existsSync(path.join(root, file))) {
    assertNotIncludes(file, 'Step 133', `${file} remains outside Step 133 scope`);
  }
}

assertIncludes('package.json', 'step133:owner-next-actions:qa', 'Package script for Step 133 is registered');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'step133-owner-next-action-deep-links-guided-sections.md', 'Release QA requires Step 133 doc');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'qa-step133-owner-next-action-deep-links-guided-sections.mjs', 'Release QA requires Step 133 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'Step 133 Owner Next Action Deep Links and Guided Sections', 'Release QA runs Step 133 QA');

if (failed) {
  console.error('\n======================================================');
  console.error('Step 133 Owner Next Action Deep Links & Guided Sections QA FAILED');
  console.error('======================================================');
  process.exit(1);
}

console.log('\n======================================================');
console.log('Step 133 Owner Next Action Deep Links & Guided Sections QA PASS');
console.log('======================================================');
