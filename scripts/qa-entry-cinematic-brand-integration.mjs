#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
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
const appPage = read('apps/web/app/page.tsx');
const css = read('apps/web/app/globals.css');
const doc = read('docs/qa/step31-cinematic-entry-brand-integration.md');

const assetPath = 'apps/web/public/brand/entry/usg-global-ecosystem-cover.png';
const assetAbsolutePath = path.join(root, assetPath);

ok('Cinematic global ecosystem cover asset exists', existsSync(assetAbsolutePath), assetPath);
if (existsSync(assetAbsolutePath)) {
  const size = statSync(assetAbsolutePath).size;
  ok('Cinematic cover asset is non-empty and production-sized', size > 500000, `${assetPath} ${size} bytes`);
}

has(pkg, 'package.json', [
  '"entry:cinematic:qa": "node scripts/qa-entry-cinematic-brand-integration.mjs"',
], 'Root package exposes Step 31 cinematic entry QA command');

has(appPage, 'apps/web/app/page.tsx', [
  "import { EntryExperience } from '@/components/entry-experience';",
  'return <EntryExperience />;',
], 'Root / route remains a dedicated EntryExperience screen');

has(entry, 'apps/web/components/entry-experience.tsx', [
  "const ENTRY_CINEMATIC_COVER = '/brand/entry/usg-global-ecosystem-cover.png' as const;",
  'entry-stage entry-stage--global-cover',
  'entry-stage__cinematic-cover',
  'entry-stage__cinematic-cover-image',
  'A cinematic gateway to the global Cane Corso ecosystem',
  'Кинематографичен вход към глобалната Cane Corso екосистема',
  'Un ingresso cinematografico nell’ecosistema Cane Corso globale',
  'href="/platform"',
  'href="/access?intent=member"',
  'href="/access?intent=partner"',
], 'EntryExperience uses the uploaded global cover as the cinematic start screen in EN/BG/IT with existing access CTAs');

lacks(entry, 'apps/web/components/entry-experience.tsx', [
  'ENTRY_ARTWORK_CANDIDATES',
  'setArtworkIndex',
  'showArtFallback',
  'entry-stage__scene-art-fallback',
], 'Old rotating right-side artwork fallback is removed from the entry component');

has(css, 'apps/web/app/globals.css', [
  '.entry-stage--global-cover',
  '.entry-stage__cinematic-cover',
  '.entry-stage__cinematic-cover-image',
  '.entry-stage__scene-tone',
  '.entry-stage__helper',
  '@keyframes entryGlobalCoverDrift',
  '@media (max-width: 720px)',
], 'Global CSS adds desktop/mobile cinematic entry cover treatment');

has(doc, 'docs/qa/step31-cinematic-entry-brand-integration.md', [
  'Step 31 — Cinematic Entry Page Brand Integration',
  'USG Platform Cover',
  'entry page only',
  'Registry',
  'Certificate',
  'Gallery',
  'Verify',
  'Admin moderation',
  'Ecosystem API / DB logic',
  'pnpm entry:cinematic:qa',
  'PASS / READY FOR LOCAL REVIEW',
], 'Step 31 QA document records scope, locked boundaries, browser checklist, and local QA command');

const lockedFiles = [
  'apps/web/app/(public)/registry/page.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/(public)/certified/page.tsx',
  'apps/web/app/verify/page.tsx',
  'apps/web/app/(admin)/admin/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
];

for (const filePath of lockedFiles) {
  ok('Locked surface remains present for Step 31 guardrail', existsSync(path.join(root, filePath)), filePath);
}

if (failures.length > 0) {
  console.error('\nStep 31 cinematic entry integration QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nStep 31 cinematic entry integration QA complete. Entry brand integration is ready for local browser review.');
