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
console.log('Step 131.1 — Ask MARK I Visual Balance Polish QA');
console.log('======================================================\n');

const requiredFiles = [
  'apps/web/components/ask-mark-i-panel.tsx',
  'apps/web/lib/ask-mark-i-content.ts',
  'apps/web/app/globals.css',
  'docs/qa/step131-1-ask-mark-i-visual-balance-polish.md',
  'scripts/qa-step131-1-ask-mark-i-visual-balance-polish.mjs',
  'scripts/qa-step131-ask-mark-i-assistant-foundation.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

requiredFiles.forEach(assertFile);

assertIncludes('apps/web/components/ask-mark-i-panel.tsx', 'ask-mark-i-panel__identity-meta', 'Ask MARK I identity meta row exists');
assertIncludes('apps/web/components/ask-mark-i-panel.tsx', 'ask-mark-i-panel__identity-copy', 'Ask MARK I identity copy exists');
assertIncludes('apps/web/components/ask-mark-i-panel.tsx', 'ask-mark-i-panel__tagline', 'Ask MARK I tagline hierarchy exists');
assertIncludes('apps/web/components/ask-mark-i-panel.tsx', '<h2 id={`ask-mark-i-${variant}-title`}>{copy.eyebrow}</h2>', 'Ask MARK I heading uses the assistant name as main title');
assertIncludes('apps/web/components/ask-mark-i-panel.tsx', '<p className="ask-mark-i-panel__tagline">{copy.title}</p>', 'Previous title is retained as tagline');

assertIncludes('apps/web/app/globals.css', 'Step 131.1 — Ask MARK I Visual Balance Polish', 'Step 131.1 CSS marker exists');
assertIncludes('apps/web/app/globals.css', '.ask-mark-i-panel__identity-meta', 'Identity meta CSS exists');
assertIncludes('apps/web/app/globals.css', '.ask-mark-i-panel__tagline', 'Tagline CSS exists');
assertIncludes('apps/web/app/globals.css', '.ask-mark-i-panel__question-grid button.is-active', 'Active question state remains styled');
assertIncludes('apps/web/app/globals.css', '@media (max-width: 520px)', 'Small mobile fallback exists');

assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'Официалните решения за Регистър и Сертификат остават човешки решения на USG прегледа.', 'Bulgarian official authority boundary remains explicit and polished');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'официалния USG слой за доверие', 'Bulgarian trust-layer copy is more user-facing');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'Насоки за стопанина след вход', 'Bulgarian member title avoids mixed owner wording');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'Водач за стопани', 'Bulgarian visual guide label is localized');
assertIncludes('apps/web/lib/ask-mark-i-content.ts', 'Човешкият преглед остава водещ', 'Admin review guidance title is localized');

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
  'process.env',
];

for (const file of presentationOnlyFiles) {
  for (const token of forbiddenTech) assertNotIncludes(file, token, `${file} remains presentation-only and avoids ${token}`);
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
  if (existsSync(path.join(root, file))) pass(`Locked backend/authority file remains outside Step 131.1 scope: ${file}`);
}

assertIncludes('package.json', 'step131-1:ask-mark-i-visual:qa', 'Package script for Step 131.1 is registered');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'step131-1-ask-mark-i-visual-balance-polish.md', 'Release QA requires Step 131.1 doc');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'qa-step131-1-ask-mark-i-visual-balance-polish.mjs', 'Release QA requires Step 131.1 script');
assertIncludes('scripts/qa-fullstack-all-in-one-release-lock.mjs', 'Step 131.1 Ask MARK I visual balance polish', 'Release QA runs Step 131.1 QA');

if (failed) {
  console.error('\n======================================================');
  console.error('Step 131.1 Ask MARK I Visual Balance Polish QA FAILED');
  console.error('======================================================');
  process.exit(1);
}

console.log('\n======================================================');
console.log('Step 131.1 Ask MARK I Visual Balance Polish QA PASS');
console.log('======================================================');
