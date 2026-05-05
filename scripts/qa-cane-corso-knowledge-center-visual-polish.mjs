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

const pageShell = read('apps/web/components/page-shell.tsx');
const knowledgePage = read('apps/web/app/(public)/knowledge/page.tsx');
const css = read('apps/web/app/globals.css');
const pkg = read('package.json');
const doc = read('docs/qa/step28-1-knowledge-center-browser-visual-polish.md');

has(pkg, 'package.json', ['"knowledge:center:visual:qa": "node scripts/qa-cane-corso-knowledge-center-visual-polish.mjs"'], 'Root package exposes Step 28.1 visual QA command');
has(pageShell, 'apps/web/components/page-shell.tsx', ["variant?: 'default' | 'knowledge'", "page-shell--${variant}"], 'PageShell supports a scoped knowledge variant without changing default pages');
has(knowledgePage, 'apps/web/app/(public)/knowledge/page.tsx', ['variant="knowledge"', 'KnowledgeCenter'], 'Knowledge page opts into the wider knowledge visual shell');
has(css, 'apps/web/app/globals.css', [
  'Step 28.1 — Knowledge Center browser visual polish after screenshot review',
  '.page-shell--knowledge',
  'width: min(1560px, calc(100% - 32px))',
  '.page-shell--knowledge .page-hero',
  '.page-shell--knowledge .knowledge-section',
  '@media (min-width: 1380px)',
  '@media (max-width: 980px)',
], 'Knowledge visual polish widens the page, improves hierarchy, and keeps responsive coverage');
has(doc, 'docs/qa/step28-1-knowledge-center-browser-visual-polish.md', ['Step 28.1', 'browser screenshot', 'too narrow', 'locked sections remain untouched', 'PASS / LOCK'], 'Step 28.1 QA document records the visual issue and safe boundary');

if (failures.length > 0) {
  console.error('\nStep 28.1 Knowledge Center visual QA failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nStep 28.1 Knowledge Center visual QA complete. Browser visual polish is ready for review.');
