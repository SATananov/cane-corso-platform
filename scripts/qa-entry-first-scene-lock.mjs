#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!existsSync(absolutePath)) {
    failures.push(`Missing file: ${relativePath}`);
    return '';
  }
  return readFileSync(absolutePath, 'utf8');
}

function ok(description, pass, detail = '') {
  console.log(`${pass ? 'PASS' : 'FAIL'} ${description}${detail ? ` — ${detail}` : ''}`);
  if (!pass) failures.push(`${description}${detail ? ` — ${detail}` : ''}`);
}

function has(source, filePath, values, description) {
  const missing = values.filter((value) => !source.includes(value));
  ok(description, missing.length === 0, missing.length ? `${filePath} missing ${missing.join(', ')}` : filePath);
}

function lacks(source, filePath, values, description) {
  const present = values.filter((value) => source.includes(value));
  ok(description, present.length === 0, present.length ? `${filePath} contains ${present.join(', ')}` : filePath);
}

const pkg = read('package.json');
const entry = read('apps/web/components/entry-experience.tsx');
const css = read('apps/web/app/globals.css');
const doc = read('docs/qa/step31-2-entry-first-scene-lock.md');

has(pkg, 'package.json', [
  '"entry:first-scene:qa": "node scripts/qa-entry-first-scene-lock.mjs"',
], 'Root package exposes Step 31.2 first-scene QA command');

has(entry, 'apps/web/components/entry-experience.tsx', [
  'useState(0)',
  'Step 31.2: keep the approved registry/knowledge/community/partners scene as the first impression',
  'Регистър, знания, общност и партньори — ясно разделени',
  'Registry, knowledge, community, and partners — clearly separated',
  'Registro, conoscenza, comunità e partner — separati con chiarezza',
  'Кинематографичен вход към глобалната Cane Corso екосистема',
  'entry-stage__indicator',
  'onClick={() => setActiveScene(index)}',
], 'EntryExperience keeps the approved scene first while preserving manual supporting scene access');

lacks(entry, 'apps/web/components/entry-experience.tsx', [
  'setInterval',
  'ENTRY_ROTATION_MS',
  'window.setInterval',
], 'EntryExperience no longer auto-rotates away from the approved first impression');

has(css, 'apps/web/app/globals.css', [
  'Step 31.2 — Entry First Scene Lock & Hero Balance Fix',
  'font-size: clamp(2.55rem, 4.05vw, 4.55rem)',
  'max-width: min(600px, 100%)',
  'font-size: clamp(2.1rem, 10vw, 3.35rem)',
], 'Global CSS adds Step 31.2 viewport balance overrides');

has(doc, 'docs/qa/step31-2-entry-first-scene-lock.md', [
  'Step 31.2 — Entry First Scene Lock',
  'Регистър, знания, общност и партньори',
  'manual brand pills',
  'Locked boundaries',
  'pnpm entry:first-scene:qa',
], 'Step 31.2 QA document records scope, lock behavior, boundaries, and local commands');

const lockedFiles = [
  'apps/web/app/(public)/registry/page.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/(public)/certified/page.tsx',
  'apps/web/app/verify/page.tsx',
  'apps/web/app/(admin)/admin/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/lib/knowledge-articles.ts',
];

for (const filePath of lockedFiles) {
  ok('Locked surface remains present for Step 31.2 guardrail', existsSync(path.join(root, filePath)), filePath);
}

if (failures.length > 0) {
  console.error('\nStep 31.2 first-scene lock QA failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nStep 31.2 first-scene lock QA complete. The approved registry/knowledge/community/partners scene is now the stable first impression.');
