#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failed = false;

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  failed = true;
}

function read(file) {
  const full = path.join(root, file);
  if (!existsSync(full)) {
    fail(`${file} exists`);
    return '';
  }
  pass(`${file} exists`);
  return readFileSync(full, 'utf8');
}

function assertIncludes(label, text, needle) {
  if (!text.includes(needle)) fail(`${label} includes ${needle}`);
  else pass(`${label} includes ${needle}`);
}

function assertNotIncludes(label, text, needle) {
  if (text.includes(needle)) fail(`${label} does not include ${needle}`);
  else pass(`${label} does not include ${needle}`);
}

function assertIncludesAny(label, text, needles) {
  if (needles.some((needle) => text.includes(needle))) pass(`${label} includes one accepted progressive marker`);
  else fail(`${label} includes one of ${needles.join(' | ')}`);
}

function assertOrder(label, text, first, second) {
  const a = text.indexOf(first);
  const b = text.indexOf(second);
  if (a === -1 || b === -1 || a >= b) fail(`${label} order: ${first} before ${second}`);
  else pass(`${label} order: ${first} before ${second}`);
}

console.log('--- Step 105 Production Clarity / User-first QA ---');

const sectionGuide = read('apps/web/components/section-content-guide-panel.tsx');
const knowledgeCenter = read('apps/web/components/knowledge-center.tsx');
const knowledgeCopy = read('apps/web/lib/knowledge-center-content.ts');
const articleDirectory = read('apps/web/components/knowledge-article-directory.tsx');
const css = read('apps/web/app/globals.css');
const pkg = read('package.json');
const allInOne = read('scripts/qa-fullstack-all-in-one-release-lock.mjs');
const doc = read('docs/qa/step105-production-clarity-user-first.md');

assertIncludes('Section guide', sectionGuide, 'section-content-guide--compact');
assertIncludesAny('Section guide details/progressive model', sectionGuide, ['<details className="section-content-guide__details">', 'section-content-guide__details--progressive']);
assertIncludesAny('Section guide BG explanation label', sectionGuide, ['Кратко обяснение', 'Избери тема']);
assertIncludesAny('Section guide IT explanation label', sectionGuide, ['Spiegazione breve', 'Scegli tema']);
assertIncludesAny('Section guide EN explanation label', sectionGuide, ['Short explanation', 'Choose topic']);
assertOrder('Section guide', sectionGuide, 'section-content-guide__compact-row', 'section-content-guide__details');

assertIncludes('Knowledge center', knowledgeCenter, 'knowledge-center--product-clarity');
assertIncludes('Knowledge center', knowledgeCenter, 'knowledge-product-choice-grid');
assertIncludes('Knowledge center', knowledgeCenter, 'Прочети по тема');
assertIncludes('Knowledge center', knowledgeCenter, 'USG идея и Bulgarico');
assertIncludes('Knowledge center', knowledgeCenter, '<details className="knowledge-product-detail">');
assertOrder('Knowledge center', knowledgeCenter, '<KnowledgeArticleDirectory', '<UsgIdentityBulgaricoPanel');
assertOrder('Knowledge center', knowledgeCenter, '<KnowledgeArticleDirectory', '<UsgStandardKnowledgePanel');
assertNotIncludes('Knowledge center public render', knowledgeCenter, 'copy.editorialModel');

assertIncludes('Knowledge copy', knowledgeCopy, 'Cane Corso знания за собственици и гости');
assertIncludes('Knowledge copy', knowledgeCopy, 'Подредено по теми');
assertNotIncludes('Knowledge copy', knowledgeCopy, 'Готово за многоезична база');
assertNotIncludes('Knowledge copy', knowledgeCopy, 'структурата е подготвена');
assertNotIncludes('Knowledge copy', knowledgeCopy, 'ready to become a multilingual knowledge base');

assertIncludes('Article directory', articleDirectory, 'Публикувани знания');
assertNotIncludes('Article directory', articleDirectory, 'Step 30');
assertNotIncludes('Article directory', articleDirectory, 'admin-ready');
assertNotIncludes('Article directory', articleDirectory, 'Публикуван слой Знания');

assertIncludes('CSS', css, 'Step 105 — production clarity');
assertIncludes('CSS', css, 'Step 105 — Knowledge product mode');
assertIncludes('CSS', css, '.knowledge-product-detail');
assertIncludes('CSS', css, '.section-content-guide--compact');

assertIncludes('package.json', pkg, 'step105:production-clarity:qa');
assertIncludes('all-in-one QA', allInOne, 'step105:production-clarity:qa');
assertIncludes('all-in-one QA', allInOne, 'qa-step105-production-clarity-user-first.mjs');

assertIncludes('Step 105 doc', doc, 'User-first production clarity');
assertIncludes('Step 105 doc', doc, 'No DB migration');
assertIncludes('Step 105 doc', doc, 'Registry / Certificate / Verify / Gallery');

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

for (const file of lockedFiles) {
  if (!existsSync(path.join(root, file))) fail(`${file} exists`);
  else pass(`${file} exists`);
}

if (failed) {
  console.error('Step 105 Production Clarity / User-first QA FAILED');
  process.exit(1);
}

console.log('Step 105 Production Clarity / User-first QA complete.');
