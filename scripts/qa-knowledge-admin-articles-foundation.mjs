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
const contractsIndex = read('packages/contracts/src/index.ts');
const contractTypes = read('packages/contracts/src/knowledge/knowledge.types.ts');
const articleLib = read('apps/web/lib/knowledge-articles.ts');
const knowledgePage = read('apps/web/app/(public)/knowledge/page.tsx');
const knowledgeComponent = read('apps/web/components/knowledge-center.tsx');
const directoryComponent = read('apps/web/components/knowledge-article-directory.tsx');
const detailComponent = read('apps/web/components/knowledge-article-detail.tsx');
const publicArticlePage = read('apps/web/app/(public)/knowledge/[slug]/page.tsx');
const adminPage = read('apps/web/app/(admin)/admin/knowledge/page.tsx');
const adminDashboard = read('apps/web/components/knowledge-admin-dashboard.tsx');
const css = read('apps/web/app/globals.css');
const doc = read('docs/qa/step30-admin-managed-knowledge-articles-foundation.md');

has(pkg, 'package.json', [
  '"knowledge:admin-articles:qa": "node scripts/qa-knowledge-admin-articles-foundation.mjs"',
], 'Root package exposes Step 30 Knowledge admin articles QA command');

has(contractsIndex, 'packages/contracts/src/index.ts', [
  "export * from './knowledge/knowledge.types';",
], 'Contracts package exports Knowledge article types');

has(contractTypes, 'packages/contracts/src/knowledge/knowledge.types.ts', [
  'knowledgeArticleStatuses',
  'KnowledgeArticleStatus',
  'KnowledgeArticleCategory',
  'KnowledgeReadingLevel',
  'KnowledgeArticleSourceReference',
  'KnowledgeArticleSection',
  'KnowledgeArticleSummary',
  'KnowledgeArticle',
], 'Knowledge contract defines article status, category, source, section, summary, and full article types');

has(articleLib, 'apps/web/lib/knowledge-articles.ts', [
  'getPublishedKnowledgeArticles',
  'getAdminKnowledgeArticles',
  'getPublishedKnowledgeArticleBySlug',
  'getKnowledgeArticleStaticParams',
  'knowledgeArticleAdminModelFields',
  'admin-draft-knowledge-governance',
  "status: 'draft'",
  "status: 'published'",
  'sourceReferences',
  'relatedSlugs',
  'en:',
  'bg:',
  'it:',
], 'Knowledge article library provides localized static fallback records, admin model fields, statuses, sources, and public filters');

has(knowledgePage, 'apps/web/app/(public)/knowledge/page.tsx', [
  'getPublishedKnowledgeArticles',
  'articles={articles}',
  'locale={locale}',
], 'Public Knowledge page passes published article records into the Knowledge Center');

has(knowledgeComponent, 'apps/web/components/knowledge-center.tsx', [
  'KnowledgeArticleDirectory',
  'articles: readonly KnowledgeArticle[]',
  'Public Knowledge Center articles',
  'Публични статии в секцията Знания',
], 'Knowledge Center renders the public article directory without removing previous Step 28 content sections');

has(directoryComponent, 'apps/web/components/knowledge-article-directory.tsx', [
  'href={`/knowledge/${article.slug}`}',
  'knowledgeArticleCategoryLabels',
  'knowledgeArticleStatusLabels',
  'knowledgeReadingLevelLabels',
], 'Public article directory links to Knowledge article detail pages with category/status/reading labels');

has(publicArticlePage, 'apps/web/app/(public)/knowledge/[slug]/page.tsx', [
  'generateStaticParams',
  'getKnowledgeArticleStaticParams',
  'getPublishedKnowledgeArticleBySlug',
  'notFound',
  'KnowledgeArticleDetail',
  'Drafts, pending review records, and archived records stay out of the public route',
], 'Public Knowledge article route is published-only and has a draft/pending/archive guardrail');

has(detailComponent, 'apps/web/components/knowledge-article-detail.tsx', [
  'getRelatedPublishedKnowledgeArticles',
  'Ключови факти',
  'Важни бележки',
  'Източници',
  'knowledge-article-detail',
  'knowledge-article-panel--warning',
], 'Knowledge article detail renders facts, warnings, sources, related articles, and localized BG labels');

has(adminPage, 'apps/web/app/(admin)/admin/knowledge/page.tsx', [
  'KnowledgeAdminDashboard',
  'getAdminKnowledgeArticles',
  'read-only',
  'без записи към базата данни',
  'variant="knowledge"',
], 'Admin Knowledge route is read-only foundation and does not add write actions');

has(adminDashboard, 'apps/web/components/knowledge-admin-dashboard.tsx', [
  'knowledgeArticleAdminModelFields',
  'Current article seeds',
  'Текущи начални статии',
  'article.adminNotes',
  'article.sourceReferences.length',
], 'Admin Knowledge dashboard previews future CMS fields and all seeded article records');

has(css, 'apps/web/app/globals.css', [
  'Step 30 — Admin-managed Knowledge Articles Foundation',
  '.knowledge-article-grid',
  '.knowledge-article-card',
  '.knowledge-article-detail',
  '.knowledge-admin-dashboard',
  "[data-theme='heritage'] .knowledge-article-card",
  '@media (max-width: 760px)',
], 'Step 30 CSS adds public article, detail, admin, heritage, and responsive styling');

has(doc, 'docs/qa/step30-admin-managed-knowledge-articles-foundation.md', [
  'Step 30 — Admin-managed Knowledge Articles Foundation',
  'read-only',
  'database migrations',
  'write actions',
  'Registry',
  'Certificate',
  'Gallery',
  'Verify',
  'Ecosystem API / DB logic',
  'pnpm knowledge:admin-articles:qa',
  'PASS / LOCK',
], 'Step 30 QA document records read-only foundation scope, locked boundaries, and browser checklist');

lacks(adminPage, 'apps/web/app/(admin)/admin/knowledge/page.tsx', [
  'action=',
  'form action',
  'use server',
], 'Admin Knowledge foundation stays read-only and adds no write actions');


lacks(`${knowledgeComponent}\n${publicArticlePage}\n${adminPage}\n${adminDashboard}\n${articleLib}`, 'Step 30 visible/admin BG copy', [
  'Knowledge статии',
  'Публични статии в Knowledge Center',
  'без database writes',
  'database migration и write actions',
  'Бъдещият admin editor',
  'Бъдещият admin workflow',
  'published-only видимостта',
  'публичния route',
], 'Step 30 Bulgarian-visible copy avoids the main mixed BG/EN phrases from the new scope');

if (failures.length > 0) {
  console.error('\nStep 30 Knowledge admin articles QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nStep 30 Knowledge admin articles QA complete. Admin-managed Knowledge Articles foundation is ready for local browser review.');
