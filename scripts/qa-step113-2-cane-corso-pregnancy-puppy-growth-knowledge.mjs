#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(file) { return readFileSync(path.join(root, file), 'utf8'); }
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function assertFile(file) { existsSync(path.join(root, file)) ? pass(`Required file exists: ${file}`) : fail(`Missing required file: ${file}`); }
function assertIncludes(file, needle, label) { read(file).includes(needle) ? pass(label) : fail(`${label}: missing ${needle}`); }
function assertNotIncludes(file, needle, label) { read(file).includes(needle) ? fail(`${label}: found forbidden ${needle}`) : pass(label); }

console.log('\n====================================================================');
console.log('Step 113.2 — Cane Corso Pregnancy & Puppy Growth Knowledge QA');
console.log('====================================================================\n');

const requiredFiles = [
  'apps/web/lib/knowledge-articles.ts',
  'apps/web/components/cane-corso-pregnancy-puppy-guide.tsx',
  'apps/web/components/knowledge-article-detail.tsx',
  'apps/web/components/knowledge-center.tsx',
  'apps/web/components/owner-cane-corso-section-workspace.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step113-2-cane-corso-pregnancy-puppy-growth-knowledge.md',
  'scripts/qa-step113-2-cane-corso-pregnancy-puppy-growth-knowledge.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];
for (const file of requiredFiles) assertFile(file);

const articles = 'apps/web/lib/knowledge-articles.ts';
assertIncludes(articles, "slug: 'cane-corso-pregnancy-birth-puppy-growth-calendar'", 'Knowledge article slug exists');
assertIncludes(articles, 'Бременност, раждане и първи 40 дни при Cane Corso', 'Bulgarian article title exists');
assertIncludes(articles, 'Cane Corso pregnancy, birth, and first 40 days', 'English article title exists');
assertIncludes(articles, 'Gravidanza, parto e primi 40 giorni nel Cane Corso', 'Italian article title exists');
assertIncludes(articles, "category: 'breeding'", 'Article uses responsible breeding category');
assertIncludes(articles, 'Датата на заклещване не винаги е датата на зачеване', 'BG tie/conception boundary exists');
assertIncludes(articles, 'около 58–72 дни от покриване', 'BG wider mating window exists');
assertIncludes(articles, 'Около 62–64 дни от овулация', 'BG ovulation timing exists');
assertIncludes(articles, 'Не давай “инжекция за изчистване”', 'BG no cleaning injection warning exists');
assertIncludes(articles, 'sharedSources.msdWhelping', 'MSD whelping source registered');
assertIncludes(articles, 'sharedSources.cornellDystocia', 'Cornell dystocia source registered');
assertIncludes(articles, 'sharedSources.vcaNewbornPuppies', 'VCA newborn puppies source registered');
assertIncludes(articles, 'sharedSources.esccapWormControl', 'ESCCAP worm control source registered');

const guide = 'apps/web/components/cane-corso-pregnancy-puppy-guide.tsx';
assertIncludes(guide, 'CaneCorsoPregnancyPuppyGuide', 'Guide component exists');
assertIncludes(guide, 'От заклещване / покриване до раждане', 'BG pregnancy calendar table exists');
assertIncludes(guide, 'Проблеми при раждане: не се чака твърде дълго', 'BG birth warning table exists');
assertIncludes(guide, 'След раждането: възстановяване и “изчистване”', 'BG postpartum cleaning boundary table exists');
assertIncludes(guide, 'Малките от Ден 1 до Ден 40', 'BG puppy Day 1-40 table exists');
assertIncludes(guide, 'Ориентир за обезпаразитяване', 'BG deworming orientation table exists');
assertIncludes(guide, 'Не давай окситоцин, антибиотици, калций', 'BG no medication without vet copy exists');
assertIncludes(guide, 'Не отваряй очи насила', 'BG eye-opening safety copy exists');
assertIncludes(guide, 'USG пази записи; не предписва лекарства', 'BG no prescription boundary exists');
assertIncludes(guide, "tone: 'warning'", 'Warning table tone exists');

const detail = 'apps/web/components/knowledge-article-detail.tsx';
assertIncludes(detail, "import { CaneCorsoPregnancyPuppyGuide }", 'Article detail imports guide component');
assertIncludes(detail, "article.slug === 'cane-corso-pregnancy-birth-puppy-growth-calendar'", 'Article detail renders guide by slug');

const center = 'apps/web/components/knowledge-center.tsx';
assertIncludes(center, '/knowledge/cane-corso-pregnancy-birth-puppy-growth-calendar', 'Knowledge quick choice links to guide');
assertIncludes(center, 'Разплод и първи 40 дни', 'BG quick card exists');
assertIncludes(center, 'Riproduzione e primi 40 giorni', 'IT quick card exists');

const workspace = 'apps/web/components/owner-cane-corso-section-workspace.tsx';
assertIncludes(workspace, "key: 'breedingGuide'", 'My Cane Corso guide card exists');
assertIncludes(workspace, 'Бременност, раждане и първи 40 дни', 'My Cane Corso BG guide card title exists');
assertIncludes(workspace, "hrefKind: 'knowledge'", 'My Cane Corso card uses knowledge link kind');
assertIncludes(workspace, "return '/knowledge/cane-corso-pregnancy-birth-puppy-growth-calendar';", 'My Cane Corso card links to public Knowledge guide');
assertIncludes(workspace, '`/ecosystem#community-intent-form`', 'Existing community listing flow remains linked');

const css = 'apps/web/app/globals.css';
assertIncludes(css, 'Step 113.2 — Cane Corso Pregnancy & Puppy Growth Knowledge Guide START', 'Step 113.2 CSS block exists');
assertIncludes(css, '.pregnancy-puppy-guide', 'Pregnancy guide CSS exists');
assertIncludes(css, '.owner-cane-section-card--breedingGuide', 'Owner guide card CSS exists');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step113-2:pregnancy-puppy-knowledge:qa'] === 'node scripts/qa-step113-2-cane-corso-pregnancy-puppy-growth-knowledge.mjs') pass('Package script step113-2:pregnancy-puppy-knowledge:qa exists');
else fail('Package script step113-2:pregnancy-puppy-knowledge:qa missing');

const release = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(release, 'docs/qa/step113-2-cane-corso-pregnancy-puppy-growth-knowledge.md', 'Release QA requires Step 113.2 doc');
assertIncludes(release, 'scripts/qa-step113-2-cane-corso-pregnancy-puppy-growth-knowledge.mjs', 'Release QA requires Step 113.2 script');
assertIncludes(release, 'step113-2:pregnancy-puppy-knowledge:qa', 'Release QA requires Step 113.2 package script');
assertIncludes(release, 'Step 113.2 Cane Corso pregnancy/puppy knowledge', 'Release QA runs Step 113.2 script');

for (const lockedFile of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'packages/db/drizzle/0014_dog_health_records.sql',
]) {
  assertFile(lockedFile);
  assertNotIncludes(lockedFile, 'pregnancy-birth-puppy-growth-calendar', `${lockedFile} not touched by Step 113.2 guide`);
  assertNotIncludes(lockedFile, 'Step 113.2', `${lockedFile} not touched by Step 113.2 marker`);
}

if (process.exitCode) {
  console.error('\nStep 113.2 Cane Corso Pregnancy & Puppy Growth Knowledge QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 113.2 Cane Corso Pregnancy & Puppy Growth Knowledge QA PASS');
