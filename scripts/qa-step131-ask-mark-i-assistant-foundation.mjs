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

console.log('\n=======================================================');
console.log('Step 131 — Ask MARK I Assistant Foundation QA');
console.log('=======================================================\n');

const requiredFiles = [
  'apps/web/components/ask-mark-i-panel.tsx',
  'apps/web/lib/ask-mark-i-content.ts',
  'apps/web/components/entry-experience.tsx',
  'apps/web/app/(public)/platform/page.tsx',
  'apps/web/app/(public)/knowledge/page.tsx',
  'apps/web/app/(member)/member/page.tsx',
  'apps/web/components/my-dogs-overview.tsx',
  'apps/web/components/review-queue-dashboard.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step131-ask-mark-i-assistant-foundation.md',
  'scripts/qa-step131-ask-mark-i-assistant-foundation.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

requiredFiles.forEach(assertFile);

assertIncludes('apps/web/components/ask-mark-i-panel.tsx', 'export function AskMarkIPanel', 'Ask MARK I panel component exports correctly');
assertIncludes('apps/web/components/ask-mark-i-panel.tsx', "'use client';", 'Ask MARK I panel is an interactive client component');
assertIncludes('apps/web/components/ask-mark-i-panel.tsx', 'getAskMarkICopy', 'Ask MARK I panel uses curated content provider');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', "export type AskMarkIVariant = 'public' | 'member' | 'myDogs' | 'knowledge' | 'review';", 'Ask MARK I variants cover public/member/myDogs/knowledge/review');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'Попитай MARK I', 'Bulgarian Ask MARK I copy exists');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'Ask MARK I', 'English Ask MARK I copy exists');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'Chiedi a MARK I', 'Italian Ask MARK I copy exists');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'Официалните решения за Регистър и Сертификат остават човешки решения на USG прегледа.', 'Bulgarian authority boundary is explicit');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'They do not replace veterinary advice', 'English veterinary boundary is explicit');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'sostituiscono il veterinario', 'Italian veterinary boundary is explicit');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'photos alone do not prove pedigree or official status', 'Photo guidance avoids proof-by-photo claim');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'Certificate issuance is separate from Registry publication', 'Certificate boundary is explicit');

const integrationChecks = [
  ['apps/web/components/entry-experience.tsx', 'variant="public" className="entry-ask-mark-i"', 'Entry experience includes public Ask MARK I panel'],
  ['apps/web/app/(public)/platform/page.tsx', 'variant="public" className="section-block--ask-mark-i section-block--ask-mark-i-platform"', 'Platform page includes public Ask MARK I panel'],
  ['apps/web/app/(public)/knowledge/page.tsx', 'variant="knowledge" className="knowledge-ask-mark-i"', 'Knowledge page includes knowledge Ask MARK I panel'],
  ['apps/web/app/(member)/member/page.tsx', 'variant="member" className="member-home-ask-mark-i"', 'Member dashboard includes member Ask MARK I panel'],
  ['apps/web/components/my-dogs-overview.tsx', 'variant="myDogs" className="my-dogs-ask-mark-i"', 'My Dogs includes profile Ask MARK I panel'],
  ['apps/web/components/review-queue-dashboard.tsx', 'variant="review" className="review-ask-mark-i"', 'Review dashboard includes admin Ask MARK I panel'],
];

for (const [file, needle, message] of integrationChecks) assertIncludes(file, needle, message);

assertIncludes('apps/web/app/globals.css', 'Step 131 — Ask MARK I Assistant Foundation', 'Step 131 CSS marker present');
assertIncludes('apps/web/app/globals.css', '.ask-mark-i-panel', 'Ask MARK I panel CSS exists');
assertIncludes('apps/web/app/globals.css', '.ask-mark-i-panel__question-grid button.is-active', 'Active question state is styled');
assertIncludes('apps/web/app/globals.css', '@media (max-width: 700px)', 'Mobile readability fallback exists');
assertIncludes('docs/qa/step131-ask-mark-i-assistant-foundation.md', 'no LLM/API integration', 'Step 131 doc locks no real AI backend scope');
assertIncludes('package.json', 'step131:ask-mark-i:qa', 'Package script for Step 131 is registered');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'step131-ask-mark-i-assistant-foundation.md', 'Release QA requires Step 131 doc');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'qa-step131-ask-mark-i-assistant-foundation.mjs', 'Release QA requires Step 131 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'Step 131 Ask MARK I assistant foundation', 'Release QA runs Step 131 QA');

const presentationOnlyFiles = [
  'apps/web/components/ask-mark-i-panel.tsx',
  'apps/web/lib/ask-mark-i-content.ts',
  'apps/web/app/globals.css',
];

const forbiddenTech = [
  'OPENAI_API_KEY',
  'DATABASE_URL',
  'fetch(',
  'document.cookie',
  'localStorage',
  'createClient',
  'drizzle',
  'pg ',
  'process.env',
];

for (const file of presentationOnlyFiles) {
  for (const token of forbiddenTech) assertNotIncludes(file, token, `${file} stays presentation-only and avoids ${token}`);
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

for (const claim of forbiddenClaims) {
  assertNotIncludes('apps/web/lib/ask-mark-i-content.ts', claim, `Ask MARK I content avoids unsafe claim: ${claim}`);
  assertNotIncludes('apps/web/components/ask-mark-i-panel.tsx', claim, `Ask MARK I panel avoids unsafe claim: ${claim}`);
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
  if (existsSync(path.join(root, file))) pass(`Locked backend/authority file remains present and outside Step 131 scope: ${file}`);
}

if (failed) {
  console.error('\n=======================================================');
  console.error('Step 131 Ask MARK I Assistant Foundation QA FAILED');
  console.error('=======================================================');
  process.exit(1);
}

console.log('\n=======================================================');
console.log('Step 131 Ask MARK I Assistant Foundation QA PASS');
console.log('=======================================================');
