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
  if (!pass) {
    failures.push(`${description}${detail ? ` — ${detail}` : ''}`);
  }
}

function has(source, filePath, values, description) {
  const missing = values.filter((value) => !source.includes(value));
  ok(description, missing.length === 0, missing.length ? `${filePath} missing ${missing.join(', ')}` : filePath);
}

const page = read('apps/web/app/(public)/knowledge/page.tsx');
const component = read('apps/web/components/knowledge-center.tsx');
const content = read('apps/web/lib/knowledge-center-content.ts');
const css = read('apps/web/app/globals.css');
const pkg = read('package.json');
const doc = read('docs/qa/step28-cane-corso-knowledge-center-foundation.md');

has(pkg, 'package.json', ['"knowledge:center:qa": "node scripts/qa-cane-corso-knowledge-center-foundation.mjs"'], 'Root package exposes Step 28 Knowledge Center QA command');
has(page, 'apps/web/app/(public)/knowledge/page.tsx', ['KnowledgeCenter', 'getKnowledgeCenterContent', 'heroChips={copy.hero.chips}', 'heroNote={copy.hero.note}'], 'Knowledge page uses new Step 28 Knowledge Center structure');
has(component, 'apps/web/components/knowledge-center.tsx', ['knowledge-timeline', 'knowledge-fact-grid', 'knowledge-disclaimer', 'knowledge-source-grid', 'knowledge-field-list'], 'Knowledge Center component renders timeline, facts, disclaimer, sources, and future fields');
has(content, 'apps/web/lib/knowledge-center-content.ts', [
  'Cane Corso Knowledge Center',
  'FCI Standard N°343',
  'Roman Molossian',
  'Apulia',
  'Utility dog, polyvalent',
  'Hip dysplasia',
  'Elbow dysplasia',
  'Cardiac',
  'Patellar luxation',
  'NCL',
  'DSR / DSRA',
  'Responsible breeding',
  'Travel & transport',
  'Adoption & rescue',
  'Public responsibility',
  'https://www.fci.be/nomenclature/standards/343g02-en.pdf',
  'https://www.akc.org/dog-breeds/cane-corso/',
  'https://www.canecorso.org/akc-canine-health-foundation--chic.html',
], 'Knowledge content includes professional breed history, standard, health, owner guide, and source references');
has(content, 'apps/web/lib/knowledge-center-content.ts', ['en:', 'bg:', 'it:'], 'Knowledge content keeps BG / EN / IT localization coverage');
has(css, 'apps/web/app/globals.css', ['Step 28 — Cane Corso Knowledge Center Foundation', '.knowledge-center', '.knowledge-section', "[data-theme='heritage'] .knowledge-section", '@media (max-width: 760px)'], 'Knowledge Center styles include dark, heritage, and responsive coverage');
has(doc, 'docs/qa/step28-cane-corso-knowledge-center-foundation.md', ['Step 28 — Cane Corso Knowledge Center Foundation', 'locked Registry / Certificate / Gallery logic', 'FCI', 'AKC', 'CCAA / CHIC', 'PASS / LOCK'], 'Step 28 QA document records scope, source discipline, and safety boundary');

if (failures.length > 0) {
  console.error('\nStep 28 Knowledge Center QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nStep 28 Knowledge Center QA complete. Knowledge Center foundation is ready for browser review.');
