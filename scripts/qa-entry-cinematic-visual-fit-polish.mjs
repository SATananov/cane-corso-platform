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
const doc = read('docs/qa/step31-1-cinematic-entry-visual-fit-polish.md');

has(pkg, 'package.json', [
  '"entry:cinematic-fit:qa": "node scripts/qa-entry-cinematic-visual-fit-polish.mjs"',
], 'Root package exposes Step 31.1 cinematic fit QA command');

has(entry, 'apps/web/components/entry-experience.tsx', [
  'entryNavItems',
  'entry-mini-brand entry-mini-brand--lockup',
  'entry-page__nav',
  'entry-page__nav-link',
  'entry-page__login',
  'Регистър, знания, общност и партньори — ясно разделени',
  'Единен екосистемен дом за регистрация, знания, общност и партньорства',
  'Registry, knowledge, community, and partners — clearly separated',
  'Registro, conoscenza, comunità e partner — separati con chiarezza',
], 'EntryExperience uses the approved first-scene copy and compact premium entry navigation');

has(css, 'apps/web/app/globals.css', [
  'Step 31.1 — Cinematic Entry Visual Fit Polish',
  '.entry-mini-brand--lockup',
  '.entry-mini-brand__seal',
  '.entry-page__nav',
  '.entry-page__nav-link.is-active',
  '.entry-stage--global-cover',
  'brightness(1.04)',
  'backdrop-filter: blur(14px) saturate(1.08)',
  '@media (max-width: 1180px)',
  '@media (max-width: 720px)',
], 'Global CSS adds Step 31.1 desktop/mobile fit polish for the cinematic entry screen');

has(doc, 'docs/qa/step31-1-cinematic-entry-visual-fit-polish.md', [
  'Step 31.1 — Cinematic Entry Visual Fit Polish',
  'compact entry-only luxury topbar',
  'Регистър, знания, общност и партньори',
  'Locked boundaries',
  'pnpm entry:cinematic-fit:qa',
], 'Step 31.1 QA document records scope, visual intent, locked boundaries, and local commands');

lacks(entry, 'apps/web/components/entry-experience.tsx', [
  'admin-draft-knowledge-governance',
  'syncPartnerServiceEcosystemListing',
  'issueCertificate',
], 'Step 31.1 entry component does not introduce admin/ecosystem/certificate logic');

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
  ok('Locked surface remains present for Step 31.1 guardrail', existsSync(path.join(root, filePath)), filePath);
}

if (failures.length > 0) {
  console.error('\nStep 31.1 cinematic entry visual fit QA failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nStep 31.1 cinematic entry visual fit QA complete. Entry screen polish is ready for local browser review.');
