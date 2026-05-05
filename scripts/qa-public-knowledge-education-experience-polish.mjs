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
const education = read('apps/web/components/knowledge-education-experience.tsx');
const readerCompass = read('apps/web/components/knowledge-article-reader-compass.tsx');
const knowledgeCenter = read('apps/web/components/knowledge-center.tsx');
const articleDetail = read('apps/web/components/knowledge-article-detail.tsx');
const css = read('apps/web/app/globals.css');
const doc = read('docs/qa/step47-public-knowledge-education-experience-polish.md');

has(pkg, 'package.json', [
  '"knowledge:experience-polish:qa": "node scripts/qa-public-knowledge-education-experience-polish.mjs"',
], 'Root package exposes Step 47 QA command');

has(education, 'apps/web/components/knowledge-education-experience.tsx', [
  'KnowledgeEducationExperience',
  'Breed education experience',
  'Образователно преживяване за породата',
  'Esperienza educativa di razza',
  'priorityCategories',
  'knowledge-learning-path',
  'knowledge-reading-zone-grid',
  'knowledge-boundary-panel',
  '/knowledge/cane-corso-history-and-identity',
  '/knowledge/official-standard-owner-reading',
  '/knowledge/health-screening-and-responsible-care',
  '/member',
], 'Public Knowledge education experience includes multilingual guided path, category zones, and boundary panel');

has(readerCompass, 'apps/web/components/knowledge-article-reader-compass.tsx', [
  'KnowledgeArticleReaderCompass',
  'Reader compass',
  'Компас за читателя',
  'Bussola lettore',
  'does not replace official kennel-club material',
  'не заменя официални киноложки материали',
  'non sostituisce materiali kennel-club ufficiali',
], 'Article reader compass adds multilingual responsible-use context');

has(knowledgeCenter, 'apps/web/components/knowledge-center.tsx', [
  "import { KnowledgeEducationExperience } from '@/components/knowledge-education-experience';",
  '<KnowledgeEducationExperience articles={articles} locale={locale} actionLabel={actionLabel} />',
  '<KnowledgeArticleDirectory',
], 'Knowledge Center renders Step 47 experience before the article directory');

has(articleDetail, 'apps/web/components/knowledge-article-detail.tsx', [
  "import { KnowledgeArticleReaderCompass } from '@/components/knowledge-article-reader-compass';",
  '<KnowledgeArticleReaderCompass article={article} locale={locale} relatedCount={related.length} />',
  '<div className="knowledge-article-layout">',
], 'Knowledge article detail renders Step 47 reader compass before article body layout');

has(css, 'apps/web/app/globals.css', [
  'Step 47 — Public Knowledge / Breed Education Experience Polish',
  '.knowledge-section--education-experience',
  '.knowledge-education-hero',
  '.knowledge-learning-path',
  '.knowledge-reading-zone-grid',
  '.knowledge-boundary-panel',
  '.knowledge-article-reader-compass',
  "[data-theme='heritage'] .knowledge-section--education-experience",
  '@media (max-width: 1180px)',
  '@media (max-width: 760px)',
], 'Step 47 CSS covers desktop, Heritage, and responsive Knowledge experience surfaces');

has(doc, 'docs/qa/step47-public-knowledge-education-experience-polish.md', [
  'Step 47',
  'Public Knowledge / Breed Education Experience Polish',
  'Presentation/read-model only',
  'Registry publish logic',
  'Certificate issue / revoke logic',
  'Verify lookup logic',
  'Gallery backend selection logic',
  'Admin moderation backend',
  'Ecosystem API / DB logic',
  'Auth / session logic',
  'pnpm knowledge:experience-polish:qa',
], 'Step 47 QA document records scope, command, and locked boundaries');

lacks(education + readerCompass + knowledgeCenter + articleDetail, 'Step 47 public Knowledge files', [
  'use server',
  'issueCertificate',
  'revokeCertificate',
  'publishRegistry',
  'updateSession',
  'moderateEcosystem',
], 'Step 47 public Knowledge files do not import or declare mutation authority logic');

for (const lockedFile of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'apps/web/lib/session.server.ts',
  'apps/web/lib/registry.server.ts',
  'apps/web/lib/review.server.ts',
  'packages/db/src/schema/index.ts',
]) {
  ok(`Locked authority file still exists: ${lockedFile}`, existsSync(path.join(root, lockedFile)));
}

if (failures.length > 0) {
  console.error('\nStep 47 Public Knowledge education experience QA failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nStep 47 Public Knowledge education experience QA complete. Ready for local browser review and typecheck.');
