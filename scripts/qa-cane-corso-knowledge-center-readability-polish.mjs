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
  ok(description, present.length === 0, present.length ? `${filePath} still contains ${present.join(', ')}` : filePath);
}

const knowledgePage = read('apps/web/app/(public)/knowledge/page.tsx');
const content = read('apps/web/lib/knowledge-center-content.ts');
const css = read('apps/web/app/globals.css');
const pkg = read('package.json');
const doc = read('docs/qa/step28-2-knowledge-center-readability-polish.md');
const bgStart = content.indexOf('  bg: {');
const bgEnd = content.indexOf('  it: {', bgStart);
const bgBlock = bgStart >= 0 && bgEnd > bgStart ? content.slice(bgStart, bgEnd) : '';

has(pkg, 'package.json', ['"knowledge:center:readability:qa": "node scripts/qa-cane-corso-knowledge-center-readability-polish.mjs"'], 'Root package exposes Step 28.2 readability QA command');
has(content, 'apps/web/lib/knowledge-center-content.ts', [
  'const officialSourcesBg',
  'Cane Corso справочник за собственици и гости',
  'Базирано на проверими източници',
  'Регистърът не е сертификат',
  'Здравната информация насочва, не диагностицира',
  'items: officialSourcesBg',
], 'Bulgarian Knowledge copy is shorter, cleaner, and localized for browser readability');
lacks(bgBlock, 'apps/web/lib/knowledge-center-content.ts#bg', [
  'Сериозен породен guide за собственици, гости и USG екосистемата',
  'случаен текст от интернет',
  'judge manual',
  'trust path',
  'BG • EN • IT ready',
], 'Old mixed-language Bulgarian phrases were removed from the BG Knowledge layer');
has(knowledgePage, 'apps/web/app/(public)/knowledge/page.tsx', [
  "icon: 'knowledge' as const",
  'variant="knowledge"',
], 'Knowledge hero cards remain present but no longer force repeated same-page action links');
lacks(knowledgePage, 'apps/web/app/(public)/knowledge/page.tsx', ["href: '#knowledge-center'"], 'Hero cards do not render repeated Open/Отвори links to the same anchor');
has(css, 'apps/web/app/globals.css', [
  'Step 28.2 — Knowledge Center readability and Bulgarian language polish after browser screenshots',
  '.page-shell--knowledge .page-hero__title',
  'line-height: 1.04',
  'text-wrap: balance',
  '.page-shell--knowledge .knowledge-timeline',
  'grid-template-columns: repeat(3, minmax(0, 1fr))',
  '.page-shell--knowledge .knowledge-mini-grid--four',
  'font-family: var(--font-sans',
  'scroll-margin-top: 132px',
], 'Knowledge CSS improves title fit, card readability, timeline density, and sticky-header scroll margin');
has(doc, 'docs/qa/step28-2-knowledge-center-readability-polish.md', [
  'Step 28.2',
  'readability',
  'Bulgarian language polish',
  'locked sections remain untouched',
  'PASS / LOCK',
], 'Step 28.2 QA document records the screenshot issue and safe boundary');

if (failures.length > 0) {
  console.error('\nStep 28.2 Knowledge Center readability QA failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nStep 28.2 Knowledge Center readability QA complete. Browser polish is ready for review.');
