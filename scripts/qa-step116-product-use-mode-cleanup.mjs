#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failed = false;

function read(file) {
  return readFileSync(path.join(root, file), 'utf8');
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  failed = true;
}

function assertFile(file) {
  if (!existsSync(path.join(root, file))) fail(`Required file missing: ${file}`);
  else pass(`Required file exists: ${file}`);
}

function assertIncludes(label, text, token) {
  if (!text.includes(token)) fail(`${label} missing token: ${token}`);
  else pass(`${label} includes ${token}`);
}

function assertNotIncludes(label, text, token) {
  if (text.includes(token)) fail(`${label} should not include: ${token}`);
  else pass(`${label} does not include ${token}`);
}

function assertNoCyrillic(label, text) {
  if (/[А-Яа-я]/.test(text)) fail(`${label} contains mixed Cyrillic copy`);
  else pass(`${label} has no mixed Cyrillic copy`);
}

console.log('\n====================================================================');
console.log('Step 116 — Product Use-Mode Cleanup QA');
console.log('====================================================================\n');

const requiredFiles = [
  'apps/web/components/member-access-panel.tsx',
  'apps/web/components/section-content-guide-panel.tsx',
  'apps/web/components/admin-operational-clarity-panel.tsx',
  'apps/web/components/role-aware-action-panel.tsx',
  'apps/web/app/(public)/platform/page.tsx',
  'apps/web/app/access/page.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step116-product-use-mode-cleanup.md',
  'scripts/qa-step116-product-use-mode-cleanup.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

for (const file of requiredFiles) assertFile(file);

const memberAccess = read('apps/web/components/member-access-panel.tsx');
assertIncludes('Access panel', memberAccess, 'Имейлът или паролата не съвпадат. Провери данните и опитай отново.');
assertIncludes('Access panel', memberAccess, 'Email or password does not match. Check your details and try again.');
assertIncludes('Access panel', memberAccess, 'Email o password non corrispondono. Controlla i dati e riprova.');
assertNotIncludes('Access panel user-facing error', memberAccess, 'login payload');
assertNotIncludes('Access panel user-facing error', memberAccess, 'password length');
assertNotIncludes('Access panel user-facing error', memberAccess, 'DemoMember123!');
assertIncludes('Access route', read('apps/web/app/access/page.tsx'), "showDevelopmentTools={isDevelopmentAccessEnabled() && params.debug === '1'}");

const guide = read('apps/web/components/section-content-guide-panel.tsx');
assertIncludes('Section guide', guide, 'section-content-guide__use-mode');
assertIncludes('Section guide', guide, 'getUseModeSummary');
assertIncludes('Section guide', guide, 'getUseModeHint');
assertIncludes('Section guide', guide, 'Скрито по подразбиране, за да работиш първо по реалното действие.');
assertIncludes('Section guide', guide, 'section-content-guide__details--progressive');
assertNotIncludes('Section guide visible copy', guide, 'Пълнота на секцията');
assertNotIncludes('Section guide visible copy', guide, 'Какво е това');
assertNotIncludes('Section guide visible copy', guide, 'Гост, член, партньор и админ');

const adminClarity = read('apps/web/components/admin-operational-clarity-panel.tsx');
assertIncludes('Admin clarity', adminClarity, 'admin-operational-clarity-panel__details');
assertIncludes('Admin clarity', adminClarity, 'Помощ за решение');
assertIncludes('Admin clarity', adminClarity, 'Реалната опашка и действията остават първи.');
assertNotIncludes('Admin clarity visible copy', adminClarity, 'Админ оперативна яснота');
assertNotIncludes('Admin clarity visible copy', adminClarity, 'Admin operational clarity');

const roleAware = read('apps/web/components/role-aware-action-panel.tsx');
assertIncludes('Role-aware member copy', roleAware, 'Пълните данни са лични и се използват само при USG преглед.');
assertIncludes('Role-aware owner privacy copy', roleAware, 'Full data stays private; the public Registry uses only a safe public owner name.');
assertIncludes('Role-aware Italian privacy copy', roleAware, 'I dati completi restano privati; il Registro pubblico usa solo un nome pubblico sicuro.');
assertNotIncludes('Role-aware member copy', roleAware, 'Пълните данни са за теб и админ.');
assertNotIncludes('Role-aware member copy', roleAware, 'until admin review');

const enStart = roleAware.indexOf('const en:');
const itStart = roleAware.indexOf('const it:');
const copyStart = roleAware.indexOf('const copyByLocale');
if (enStart === -1 || itStart === -1 || copyStart === -1) fail('Role-aware locale blocks not found');
else {
  assertNoCyrillic('Role-aware EN block', roleAware.slice(enStart, itStart));
  assertNoCyrillic('Role-aware IT block', roleAware.slice(itStart, copyStart));
}

const platform = read('apps/web/app/(public)/platform/page.tsx');
assertIncludes('Platform page', platform, "eyebrow: 'Структура на платформата'");
assertIncludes('Platform page', platform, "eyebrow: 'Product structure'");
assertIncludes('Platform page', platform, "eyebrow: 'Struttura della piattaforma'");
assertNotIncludes('Platform page product copy', platform, 'MASTER PLAN');
assertNotIncludes('Platform page product copy', platform, 'Master plan');
assertNotIncludes('Platform page product copy', platform, 'next evolution');
assertNotIncludes('Platform page product copy', platform, 'Следващата еволюция');
assertNotIncludes('Platform page product copy', platform, 'prossima evoluzione');

const access = read('apps/web/app/access/page.tsx');
assertIncludes('Access page', access, "title: 'Избери как да продължиш'");
assertIncludes('Access page', access, "title: 'Choose how you want to continue'");
assertIncludes('Access page', access, "title: 'Scegli come continuare'");
assertNotIncludes('Access page product copy', access, 'This page explains how guest access');
assertNotIncludes('Access page product copy', access, 'Тази страница подрежда пътя');

const css = read('apps/web/app/globals.css');
assertIncludes('CSS', css, 'Step 116 — Product use-mode cleanup');
assertIncludes('CSS', css, '.section-content-guide__use-mode-summary');
assertIncludes('CSS', css, '.admin-operational-clarity-panel__summary');
assertIncludes('CSS', css, '.admin-operational-clarity-panel__body');

const release = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');
assertIncludes('Release QA', release, 'docs/qa/step116-product-use-mode-cleanup.md');
assertIncludes('Release QA', release, 'scripts/qa-step116-product-use-mode-cleanup.mjs');
assertIncludes('Release QA', release, 'step116:product-use-mode:qa');
assertIncludes('Release QA', release, "['Step 116 product use-mode cleanup', 'scripts/qa-step116-product-use-mode-cleanup.mjs']");

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step116:product-use-mode:qa'] === 'node scripts/qa-step116-product-use-mode-cleanup.mjs') {
  pass('Package script step116:product-use-mode:qa exists');
} else {
  fail('Package script step116:product-use-mode:qa missing or incorrect');
}

const protectedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'packages/db/drizzle/0014_dog_health_records.sql',
];

for (const file of protectedFiles) {
  assertFile(file);
  const content = read(file);
  assertNotIncludes(file, content, 'Step 116');
  assertNotIncludes(file, content, 'product-use-mode');
}

if (failed) {
  console.error('\nStep 116 Product Use-Mode Cleanup QA FAILED');
  process.exit(1);
}

console.log('\nStep 116 Product Use-Mode Cleanup QA PASS');
