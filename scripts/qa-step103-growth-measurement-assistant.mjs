#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
};

function assertFile(relativePath) {
  if (exists(relativePath)) pass(`${relativePath} exists`);
  else fail(`${relativePath} exists`);
}

function assertIncludes(label, content, fragment) {
  if (content.includes(fragment)) pass(label);
  else fail(`${label} — missing: ${fragment}`);
}

console.log('--- Step 103 USG Growth & Measurement Assistant QA ---');

const requiredFiles = [
  'apps/web/lib/usg-measurement-assistant.ts',
  'apps/web/components/usg-measurement-assistant-panel.tsx',
  'apps/web/components/my-dog-form-workspace.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step103-usg-growth-measurement-assistant.md',
  'scripts/qa-step103-growth-measurement-assistant.mjs',
  'package.json',
  'README.md',
];

for (const file of requiredFiles) assertFile(file);

const helper = read('apps/web/lib/usg-measurement-assistant.ts');
assertIncludes('Helper exports deterministic evaluator', helper, 'evaluateUsgMeasurementAssistant');
assertIncludes('Helper contains puppy reference month data', helper, 'puppyGrowthReference');
assertIncludes('Helper contains body +11% proportion', helper, 'input.heightWithersCm * 1.11');
assertIncludes('Helper contains head 36% proportion', helper, 'input.heightWithersCm * 0.36');
assertIncludes('Helper contains muzzle/skull 1:2 orientation', helper, 'input.skullLengthCm / 2');
assertIncludes('Helper contains adult male standard range', helper, 'heightWithersCm: { low: 64, high: 68 }');
assertIncludes('Helper contains adult female standard range', helper, 'heightWithersCm: { low: 60, high: 64 }');

const panel = read('apps/web/components/usg-measurement-assistant-panel.tsx');
assertIncludes('Panel is client-side interactive', panel, "'use client'");
assertIncludes('Panel calls evaluator', panel, 'evaluateUsgMeasurementAssistant');
assertIncludes('Panel has Bulgarian safety copy', panel, 'не е ветеринарна диагноза');
assertIncludes('Panel has Italian safety copy', panel, 'Non è diagnosi veterinaria');
assertIncludes('Panel has English safety copy', panel, 'not a veterinary diagnosis');
assertIncludes('Panel states private archive behavior', panel, 'Личен архив с измервания');
assertIncludes('Panel keeps non-automatic authority boundary', panel, 'не сертифицира автоматично');

const workspace = read('apps/web/components/my-dog-form-workspace.tsx');
assertIncludes('Member dog form imports assistant panel', workspace, "@/components/usg-measurement-assistant-panel");
assertIncludes('Member dog form renders assistant panel', workspace, '<UsgMeasurementAssistantPanel');
assertIncludes('Member dog form passes profile name', workspace, 'dogName={values.name}');
assertIncludes('Member dog form passes profile birth date', workspace, 'dateOfBirth={values.dateOfBirth}');

const css = read('apps/web/app/globals.css');
assertIncludes('USG measurement assistant CSS exists', css, 'Step 103 — USG Growth & Measurement Assistant');
assertIncludes('USG measurement assistant dark style exists', css, '.usg-measurement-assistant');
assertIncludes('USG measurement assistant heritage style exists', css, "[data-theme='heritage'] .usg-measurement-assistant");
assertIncludes('USG measurement assistant responsive style exists', css, '@media (max-width: 640px)');

const doc = read('docs/qa/step103-usg-growth-measurement-assistant.md');
assertIncludes('Step 103 doc records no DB persistence', doc, 'Nothing is saved to the database');
assertIncludes('Step 103 doc records authority boundaries', doc, 'Registry publication authority');
assertIncludes('Step 103 doc records safety copy', doc, 'not a veterinary diagnosis');

const packageJson = JSON.parse(read('package.json'));
if (packageJson.scripts?.['step103:growth-measurement:qa']) pass('Package script step103:growth-measurement:qa exists');
else fail('Package script step103:growth-measurement:qa exists');

const releaseQa = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');
assertIncludes('All-in-one release QA includes Step 103 doc', releaseQa, 'docs/qa/step103-usg-growth-measurement-assistant.md');
assertIncludes('All-in-one release QA includes Step 103 script', releaseQa, 'scripts/qa-step103-growth-measurement-assistant.mjs');
assertIncludes('All-in-one release QA runs Step 103 guardrail', releaseQa, 'Step 103 USG growth/measurement assistant');

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
for (const file of lockedFiles) assertFile(file);

const migrationFiles = fs.readdirSync(path.join(root, 'packages/db/drizzle')).filter((file) => file.includes('step103') || file.includes('measurement'));
if (migrationFiles.length === 0) pass('No Step 103 database migration was added');
else fail(`Unexpected Step 103 database migration files: ${migrationFiles.join(', ')}`);

if (process.exitCode) {
  console.error('Step 103 USG Growth & Measurement Assistant QA failed.');
  process.exit(process.exitCode);
}

console.log('Step 103 USG Growth & Measurement Assistant QA complete.');
