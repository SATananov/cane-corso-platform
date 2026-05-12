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
console.log('Step 132 — USG Owner Path & Next Action Timeline QA');
console.log('======================================================\n');

const requiredFiles = [
  'apps/web/components/usg-owner-path-timeline.tsx',
  'apps/web/app/(member)/member/page.tsx',
  'apps/web/components/my-dogs-overview.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step132-owner-path-next-action-timeline.md',
  'scripts/qa-step132-owner-path-next-action-timeline.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

requiredFiles.forEach(assertFile);

assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'export function UsgOwnerPathTimeline', 'Owner path timeline component is exported');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', "OwnerPathTimelineSurface = 'member' | 'myDogs'", 'Timeline supports member and My Dogs surfaces');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'USG път на собственика', 'Bulgarian owner path copy exists');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'Следващото действие за твоя Cane Corso е видимо тук', 'Bulgarian next-action title exists');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'USG преглед', 'USG review timeline step exists');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'Сертификат / Проверка', 'Certificate/Verify timeline step exists');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'Човешкият преглед остава официалното решение.', 'Human review authority boundary exists');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'Сертификатното доверие е отделно USG решение, не автоматично.', 'Certificate remains separate decision');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'getPedigreeFilledCount', 'Timeline uses existing pedigree helper instead of new DB logic');
assertIncludes('apps/web/components/usg-owner-path-timeline.tsx', 'getImageCount', 'Timeline derives photo readiness from presentation data');

assertIncludes('apps/web/app/(member)/member/page.tsx', "@/components/usg-owner-path-timeline", 'Member dashboard imports owner path timeline');
assertIncludes('apps/web/app/(member)/member/page.tsx', 'className="member-home-owner-path"', 'Member dashboard renders owner path timeline');
assertIncludes('apps/web/components/my-dogs-overview.tsx', "@/components/usg-owner-path-timeline", 'My Dogs overview imports owner path timeline');
assertIncludes('apps/web/components/my-dogs-overview.tsx', 'className="my-dogs-owner-path"', 'My Dogs overview renders owner path timeline');

assertIncludes('apps/web/app/globals.css', 'Step 132 — USG Owner Path & Next Action Timeline', 'Step 132 CSS marker exists');
assertIncludes('apps/web/app/globals.css', '.usg-owner-path-timeline', 'Owner path CSS block exists');
assertIncludes('apps/web/app/globals.css', '.usg-owner-path-step.is-current', 'Current step styling exists');
assertIncludes('apps/web/app/globals.css', '.usg-owner-path-step.is-attention', 'Attention step styling exists');
assertIncludes('apps/web/app/globals.css', '@media (max-width: 760px)', 'Mobile fallback exists');

const presentationOnlyFiles = [
  'apps/web/components/usg-owner-path-timeline.tsx',
  'apps/web/app/(member)/member/page.tsx',
  'apps/web/components/my-dogs-overview.tsx',
  'apps/web/app/globals.css',
];

const forbiddenTechInNewComponent = [
  'OPENAI_API_KEY',
  'DATABASE_URL',
  'fetch(',
  'document.cookie',
  'localStorage',
  'createClient',
  'drizzle',
  'process.env',
];

for (const token of forbiddenTechInNewComponent) {
  assertNotIncludes('apps/web/components/usg-owner-path-timeline.tsx', token, `Owner path timeline avoids ${token}`);
}

const forbiddenClaims = [
  'AI proves breed',
  'AI доказва породата',
  'ML proves breed',
  'guaranteed pure',
  '100% pure',
  'automatic certificate',
  'automatic Registry approval',
  'diagnoses disease',
  'medical diagnosis system',
  'автоматично одобрява',
];

for (const file of presentationOnlyFiles) {
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
];

for (const file of lockedBackendFiles) {
  if (existsSync(path.join(root, file))) pass(`Locked backend/authority file remains outside Step 132 scope: ${file}`);
}

assertIncludes('package.json', 'step132:owner-path-timeline:qa', 'Package script for Step 132 is registered');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'step132-owner-path-next-action-timeline.md', 'Release QA requires Step 132 doc');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'qa-step132-owner-path-next-action-timeline.mjs', 'Release QA requires Step 132 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'Step 132 USG Owner Path and Next Action Timeline', 'Release QA runs Step 132 QA');

if (failed) {
  console.error('\n======================================================');
  console.error('Step 132 USG Owner Path & Next Action Timeline QA FAILED');
  console.error('======================================================');
  process.exit(1);
}

console.log('\n======================================================');
console.log('Step 132 USG Owner Path & Next Action Timeline QA PASS');
console.log('======================================================');
