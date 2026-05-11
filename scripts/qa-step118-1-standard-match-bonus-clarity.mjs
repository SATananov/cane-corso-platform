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

console.log('\n====================================================================');
console.log('Step 118.1 — USG Standard Match Bonus Clarity QA');
console.log('====================================================================\n');

const requiredFiles = [
  'apps/web/components/usg-authenticity-check-panel.tsx',
  'apps/web/components/usg-photo-evidence-guide-panel.tsx',
  'apps/web/components/my-dog-form-workspace.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step118-1-standard-match-bonus-clarity.md',
  'scripts/qa-step118-1-standard-match-bonus-clarity.mjs',
  'scripts/qa-step117-usg-authenticity-check-foundation.mjs',
  'scripts/qa-step118-photo-evidence-flow.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

for (const file of requiredFiles) assertFile(file);

const panel = read('apps/web/components/usg-authenticity-check-panel.tsx');
assertIncludes('Authenticity panel', panel, 'Step 118.1 — USG Standard Match bonus clarity');
assertIncludes('Authenticity panel', panel, 'USG Standard Match');
assertIncludes('Authenticity panel', panel, 'доброволна бонус проверка');
assertIncludes('Authenticity panel', panel, 'образец за сравнение със стандарта');
assertIncludes('Authenticity panel', panel, 'процентът показва визуално и измеримо съответствие');
assertIncludes('Authenticity panel', panel, 'Доброволен бонус за потребителя');
assertIncludes('Authenticity panel', panel, 'Нива на съответствие');
assertIncludes('Authenticity panel', panel, '0–39%: недостатъчно данни');
assertIncludes('Authenticity panel', panel, '90–100%: много силно съответствие, нужно е човешко потвърждение');
assertIncludes('Authenticity panel', panel, "type AuthenticityQualificationKey = 'insufficient' | 'partial' | 'good' | 'strong' | 'very_strong';");
assertIncludes('Authenticity panel', panel, "if (score >= 90) return 'very_strong';");
assertIncludes('Authenticity panel', panel, 'authenticity-check-mini-card--score-guide');
assertIncludes('Authenticity panel', panel, 'authenticity-check-panel__bonus-badge');
assertIncludes('Authenticity panel', panel, 'Final USG review, Registry publication and Certificate decisions remain human-controlled');
assertIncludes('Authenticity panel', panel, 'Финалният USG преглед, публикуването в Регистъра и Сертификатът остават човешки решения');
assertIncludes('Authenticity panel', panel, 'Не доказва порода или родословие');
assertNotIncludes('Authenticity panel', panel, 'AI потвърди');
assertNotIncludes('Authenticity panel', panel, 'чистокръвно');
assertNotIncludes('Authenticity panel', panel, 'automatic breed proof');

const photo = read('apps/web/components/usg-photo-evidence-guide-panel.tsx');
assertIncludes('Photo evidence panel', photo, 'Standard Match comparison');
assertIncludes('Photo evidence panel', photo, 'Тази доброволна бонус проверка');
assertIncludes('Photo evidence panel', photo, 'пример за сравнение с образец за сравнение със стандарта');
assertIncludes('Photo evidence panel', photo, 'without claiming that a photo proves breed identity');
assertIncludes('Photo evidence panel', photo, 'без да твърди, че снимка доказва порода');

const workspace = read('apps/web/components/my-dog-form-workspace.tsx');
assertIncludes('Dog form workspace', workspace, 'USG бонус проверката');
assertIncludes('Dog form workspace', workspace, 'Standard Match сравнение');
assertIncludes('Dog form workspace', workspace, 'без автоматично твърдение за порода');

const css = read('apps/web/app/globals.css');
assertIncludes('CSS', css, 'Step 118.1 — USG Standard Match bonus clarity');
assertIncludes('CSS', css, '.authenticity-check-panel__bonus-badge');
assertIncludes('CSS', css, '.authenticity-check-mini-card--score-guide');

const pkg = JSON.parse(read('package.json'));
if (!pkg.scripts?.['step118-1:standard-match-bonus:qa']) fail('Package script step118-1:standard-match-bonus:qa missing');
else pass('Package script step118-1:standard-match-bonus:qa exists');

const releaseQa = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');
assertIncludes('Release QA', releaseQa, 'docs/qa/step118-1-standard-match-bonus-clarity.md');
assertIncludes('Release QA', releaseQa, 'scripts/qa-step118-1-standard-match-bonus-clarity.mjs');
assertIncludes('Release QA', releaseQa, 'step118-1:standard-match-bonus:qa');
assertIncludes('Release QA', releaseQa, "['Step 118.1 USG Standard Match bonus clarity', 'scripts/qa-step118-1-standard-match-bonus-clarity.mjs']");

const lockedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'packages/db/drizzle/0014_dog_health_records.sql',
];

for (const file of lockedFiles) {
  assertFile(file);
  const text = read(file);
  assertNotIncludes(file, text, 'Step 118.1');
  assertNotIncludes(file, text, 'standard-match-bonus');
}

if (failed) {
  console.error('\nStep 118.1 USG Standard Match Bonus Clarity QA FAILED');
  process.exit(1);
}

console.log('\nStep 118.1 USG Standard Match Bonus Clarity QA PASS');
