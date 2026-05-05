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

const pkg = read('package.json');
const component = read('apps/web/components/knowledge-center.tsx');
const content = read('apps/web/lib/knowledge-center-content.ts');
const doc = read('docs/qa/step28-3-knowledge-center-bg-terminology-polish.md');
const bgStart = content.indexOf('  bg: {');
const bgEnd = content.indexOf('  it: {', bgStart);
const bgBlock = bgStart >= 0 && bgEnd > bgStart ? content.slice(bgStart, bgEnd) : '';

has(pkg, 'package.json', ['"knowledge:center:bg-polish:qa": "node scripts/qa-cane-corso-knowledge-center-bg-polish.mjs"'], 'Root package exposes Step 28.3 Bulgarian terminology QA command');
has(component, 'apps/web/components/knowledge-center.tsx', ['function SourceCard({ source, actionLabel }', '<strong>{actionLabel}</strong>', '<SourceCard key={source.href} source={source} actionLabel={actionLabel} />'], 'Source cards use localized action label instead of hard-coded English');
has(content, 'apps/web/lib/knowledge-center-content.ts', [
  'Структура на знанието',
  'Живот със силна пазаческа порода',
  'стария римски молос',
  'официална дата на валидния стандарт 25.09.2023',
  'Универсално работно куче',
  'Силната пазаческа порода изисква спокоен език',
  'Тазобедрена дисплазия',
  'OFA или PennHIP оценка',
  'ДНК тест за Neuronal Ceroid Lipofuscinosis от одобрена лаборатория',
  'Страницата е готова за знание, управлявано от админ',
  'Дисциплина на източниците',
  'Референция от породния клуб за тазобедрени стави, лакти, сърце, колене, NCL и DSR / DSRA скрининг.',
], 'Bulgarian Knowledge copy is localized beyond Step 28.2 and keeps official names where needed');
lacks(bgBlock, 'apps/web/lib/knowledge-center-content.ts#bg', [
  'Knowledge архитектура',
  'guardian порода',
  'Guide слоят',
  'Timeline-ът',
  'registry записи',
  'official valid standard date',
  'Utility dog, polyvalent',
  'with working trial',
  'fawn, stag red, dark wheat, black brindle, grey brindle',
  'Protector, не декорация',
  'recall',
  'Hip dysplasia',
  'Elbow dysplasia',
  'OFA evaluation',
  'approved lab',
  'owner awareness',
  'breeding clearance',
  'Практически guide',
  'Training съдържанието',
  'Breeding guidance',
  'ecosystem услуги',
  'boarding',
  'relocation',
  'Осиновяване и rescue',
  'Community flows',
  'admin review',
  'status-symbol ownership',
  'Бъдещ content model',
  'admin-managed knowledge система',
  'database-backed editorial workflow',
  'Кратък excerpt',
  'Hero image',
  'Featured flag',
  'Source discipline',
  'owner education',
  'health screening',
], 'Visible Bulgarian Knowledge copy no longer carries the mixed-language browser phrases from screenshots');
has(doc, 'docs/qa/step28-3-knowledge-center-bg-terminology-polish.md', ['Step 28.3', 'Bulgarian terminology polish', 'localized source-card action', 'locked sections remain untouched', 'PASS / LOCK'], 'Step 28.3 QA document records the safe boundary');

if (failures.length > 0) {
  console.error('\nStep 28.3 Bulgarian Knowledge terminology QA failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nStep 28.3 Bulgarian Knowledge terminology QA complete.');
