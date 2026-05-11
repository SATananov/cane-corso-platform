#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(file) { return readFileSync(path.join(root, file), 'utf8'); }
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function assertFile(file) { existsSync(path.join(root, file)) ? pass(`Required file exists: ${file}`) : fail(`Missing required file: ${file}`); }
function assertIncludes(file, needle, label) { read(file).includes(needle) ? pass(label) : fail(`${label}: missing ${needle}`); }
function assertNotIncludes(file, needle, label) { read(file).includes(needle) ? fail(`${label}: found forbidden ${needle}`) : pass(label); }

console.log('\n====================================================================');
console.log('Step 115.2 — Page Hero Locale Fallback Polish QA');
console.log('====================================================================\n');

const requiredFiles = [
  'apps/web/components/page-hero-chip-row.tsx',
  'apps/web/app/(member)/ecosystem/page.tsx',
  'apps/web/app/(admin)/admin/ecosystem/page.tsx',
  'docs/qa/step115-2-page-hero-locale-fallback-polish.md',
  'scripts/qa-step115-2-page-hero-locale-fallback-polish.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];
for (const file of requiredFiles) assertFile(file);

const heroRow = 'apps/web/components/page-hero-chip-row.tsx';
assertIncludes(heroRow, 'function buildLocaleSignal', 'Hero chip fallback builds a locale signal');
assertIncludes(heroRow, "...chips.flatMap((chip) => [chip.label, chip.title ?? '', chip.description ?? '', chip.actionLabel ?? ''])", 'Hero chip fallback reads chip text, not only Help label');
assertIncludes(heroRow, '/[\\u0400-\\u04ff]/.test(localeSignal)', 'Hero chip fallback detects Bulgarian Cyrillic text');
assertIncludes(heroRow, '/[àèéìòù]/i.test(localeSignal)', 'Hero chip fallback detects Italian accented text');
assertIncludes(heroRow, 'scheda|comunità|piattaforma|proprietario|preparazione|voci|ecosistema', 'Hero chip fallback detects common Italian platform words');
assertIncludes(heroRow, 'getFallbackCopy(helpLabel, normalizedChips)', 'Hero chip row passes normalized chip text into fallback copy');
assertIncludes(heroRow, 'Избран фокус', 'Bulgarian fallback title is preserved');
assertIncludes(heroRow, 'Focus selezionato', 'Italian fallback title is preserved');
assertIncludes(heroRow, 'Selected focus', 'English fallback title is preserved');

const memberEcosystem = 'apps/web/app/(member)/ecosystem/page.tsx';
assertIncludes(memberEcosystem, "actionLabel: 'Отвори'", 'Member ecosystem has Bulgarian action label');
assertIncludes(memberEcosystem, "helpLabel: 'Помощ'", 'Member ecosystem has Bulgarian help label');
assertIncludes(memberEcosystem, "actionLabel: 'Apri'", 'Member ecosystem has Italian action label');
assertIncludes(memberEcosystem, "helpLabel: 'Aiuto'", 'Member ecosystem has Italian help label');
assertIncludes(memberEcosystem, 'actionLabel={copy.actionLabel}', 'Member PageShell receives localized action label');
assertIncludes(memberEcosystem, 'helpLabel={copy.helpLabel}', 'Member PageShell receives localized help label');

const adminEcosystem = 'apps/web/app/(admin)/admin/ecosystem/page.tsx';
assertIncludes(adminEcosystem, "helpLabel: 'Помощ'", 'Admin ecosystem has Bulgarian help label');
assertIncludes(adminEcosystem, "helpLabel: 'Aiuto'", 'Admin ecosystem has Italian help label');
assertIncludes(adminEcosystem, 'helpLabel={copy.helpLabel}', 'Admin PageShell receives localized help label');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step115-2:hero-locale-fallback:qa'] === 'node scripts/qa-step115-2-page-hero-locale-fallback-polish.mjs') pass('Package script step115-2:hero-locale-fallback:qa exists');
else fail('Package script step115-2:hero-locale-fallback:qa missing');

const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step115-2-page-hero-locale-fallback-polish.md', 'Release QA requires Step 115.2 doc');
assertIncludes(release, 'scripts/qa-step115-2-page-hero-locale-fallback-polish.mjs', 'Release QA requires Step 115.2 script');
assertIncludes(release, 'step115-2:hero-locale-fallback:qa', 'Release QA requires Step 115.2 package script');
assertIncludes(release, 'Step 115.2 page hero locale fallback polish', 'Release QA runs Step 115.2 script');

for (const lockedFile of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'packages/db/drizzle/0014_dog_health_records.sql',
]) {
  assertFile(lockedFile);
  assertNotIncludes(lockedFile, 'Step 115.2', `${lockedFile} not touched by Step 115.2 marker`);
  assertNotIncludes(lockedFile, 'locale fallback polish', `${lockedFile} not touched by Step 115.2 patch`);
}

if (process.exitCode) {
  console.error('\nStep 115.2 Page Hero Locale Fallback Polish QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 115.2 Page Hero Locale Fallback Polish QA PASS');
