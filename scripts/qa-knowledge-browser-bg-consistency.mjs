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
const doc = read('docs/qa/step29-knowledge-browser-and-bg-consistency.md');
const i18n = read('apps/web/lib/i18n.ts');
const guide = read('apps/web/components/platform-guide.tsx');
const myDogs = read('apps/web/components/my-dogs-overview.tsx');
const community = read('apps/web/app/(public)/community/page.tsx');
const faq = read('apps/web/app/(public)/faq/page.tsx');
const knowledgeContent = read('apps/web/lib/knowledge-center-content.ts');

function between(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = start >= 0 ? source.indexOf(endMarker, start + startMarker.length) : -1;
  return start >= 0 && end > start ? source.slice(start, end) : '';
}

const guideBg = between(guide, '  bg: {', '  it: {');
const communityBg = between(community, '  bg: {', '  it: {');
const faqBg = between(faq, '    bg: {', '    it: {');
const i18nBg = between(i18n, '  bg: {', '  it: {');

ok('Bulgarian blocks can be isolated for Step 29 copy checks', Boolean(guideBg && communityBg && faqBg && i18nBg), 'guide/community/faq/i18n');

const packageCommand = '"knowledge:browser-bg:qa": "node scripts/qa-knowledge-browser-bg-consistency.mjs"';
has(pkg, 'package.json', [packageCommand], 'Root package exposes Step 29 Knowledge browser/BG consistency QA command');

has(doc, 'docs/qa/step29-knowledge-browser-and-bg-consistency.md', [
  'Step 29 — Knowledge Browser Evidence + BG Consistency',
  'copy/QA only',
  'Registry',
  'Certificate',
  'Gallery',
  'Verify',
  'Admin moderation',
  'Ecosystem API / DB logic',
  'pnpm knowledge:browser-bg:qa',
  'PASS / LOCK',
], 'Step 29 QA document records scope, locked boundaries, browser checklist, and result');

has(knowledgeContent, 'apps/web/lib/knowledge-center-content.ts', [
  'Структура на знанието',
  'Страницата е готова за знание, управлявано от админ',
  'Дисциплина на източниците',
], 'Step 29 keeps the locked Step 28.3 Knowledge Center content available');

has(guide, 'apps/web/components/platform-guide.tsx', [
  'Официално и общностно',
  'Общностният слой разширява полезността',
  'места, услуги, транспорт, хотели за кучета, обекти, подходящи за Cane Corso',
  'Гост: разглежда публичните страници, регистъра, партньорите, общността, знанията и страницата за проверка.',
  'Знанията обясняват породата, не само продукта',
  'Личната работна зона е мястото',
  'Прегледът пази качеството',
  'Партньорите са част от доверената професионална мрежа',
  'Общността разширява екосистемата, без да отслабва доверието',
  'Премиум не е само украса',
], 'Platform guide Bulgarian browser copy is localized around Knowledge, access, community, and trust');

lacks(guideBg, 'apps/web/components/platform-guide.tsx#bg', [
  'Community слоят',
  'review решения',
  'pet-friendly локации',
  'activity или suggestions',
  'public страниците',
  'ecosystem listings',
  'owner workspace',
  'partner application flow',
  'Reviewer / admin',
  'Registry не е просто списък',
  'official publication layer',
  'official read model',
  'Knowledge обяснява',
  'Отвори knowledge',
  'Member workspace',
  'editable',
  'trust курация',
  'registry, partners и community',
  'trusted business',
  'relocation',
  'boarding, transport',
  'registry сайт',
  'Help layer',
  'training fields',
  'moderated engine',
  'Location-based',
  'trust и рядкост',
  'Help входна точка',
  'Official страниците',
  'Community страниците',
], 'Old mixed BG/EN guide phrases were removed');

has(myDogs, 'apps/web/components/my-dogs-overview.tsx', [
  'лично пространство като собственик',
  'Център на собственика',
  'Отваряй знания, грижа и чести въпроси без да се луташ',
  'насоки за собственици',
  'официалния път на доверие',
  'Видимостта в регистъра, проверката и сертификатното доверие остават отделни стъпки.',
  'лична работна зона',
  'Разбирай прегледа и публикацията като отделни моменти',
  'Отвори проверката',
], 'My Dogs Bulgarian guidance supports Knowledge and trust path without mixed terminology');

lacks(myDogs, 'apps/web/components/my-dogs-overview.tsx', [
  'owner пространство',
  'owner зона',
  'Отваряй knowledge',
  'match слой',
  'new home подкрепата',
  'official trust пътя',
  'Registry видимостта',
  'като owner workspace',
  'преди review',
  'Review • публикация',
  'сертификатен trust',
], 'Old mixed BG/EN My Dogs phrases were removed');

has(community, 'apps/web/app/(public)/community/page.tsx', [
  'Куриран слой за бъдещо свързване и развъдни процеси',
  'Разплод и свързване',
  'Бъдещият поток за свързване',
  'чести въпроси и ясни правила',
], 'Community Bulgarian browser copy is aligned with Knowledge and ecosystem terminology');

lacks(communityBg, 'apps/web/app/(public)/community/page.tsx#bg', [
  'match и breeding',
  'Разплод и match',
  'match flow',
  'FAQ и ясни правила',
], 'Old mixed BG/EN community phrases were removed');

has(faq, 'apps/web/app/(public)/faq/page.tsx', [
  'Чести въпроси',
  'Тези чести въпроси пазят точно този дух',
  'Регистър • сертификат • проверка',
  'Общностен слой',
  'бъдещ слой за свързване',
  'одобрена видимост в екосистемата',
  'общностно съдържание',
  'собствеността, профилната работа и подготовката',
], 'FAQ Bulgarian browser copy is localized and clearer');

lacks(faqBg, 'apps/web/app/(public)/faq/page.tsx#bg', [
  'Този FAQ пази точно този дух',
  'Регистър • сертификат • verify',
  'Community слой',
  'match слой',
  'ecosystem видимост',
  'community съдържание',
  'ownership, профилната работа',
], 'Old mixed BG/EN FAQ phrases were removed');

has(i18n, 'apps/web/lib/i18n.ts', [
  'слой на доверие',
  'поток за преглед',
  'дългосрочна база знания за Cane Corso',
  'Публична проверка • слой на доверие • достоверност',
  'Кураторски редакционен слой',
  'Одобрени списъци • подчертани позиции',
  'Проверката потвърждава дали сертификатът принадлежи',
  'личната работна зона',
  'Профилът вече е изпратен за преглед',
], 'Shared Bulgarian i18n copy uses localized terms around Knowledge and trust flows');

lacks(i18nBg, 'apps/web/lib/i18n.ts#bg', [
  'trust layer',
  'review поток',
  'credibility',
  'verify страници',
  'knowledge база',
  'trusted listings',
  'registry профили',
  'partner listings',
  'trust решения',
  'audit-friendly',
  'trust слой',
  'trust-oriented',
  'registry entry',
  'Public verify route',
  'official publication',
  'approval процес',
  'trusted network',
  'moderation повърхност',
  'member пространството',
  'trust checks',
  'verification-ready',
  'featured състояния',
  'owner поток',
  'registry контекст',
  'owner workspace-а',
], 'Shared Bulgarian i18n copy no longer carries the old mixed-language browser phrases from Step 29 scope');

if (failures.length > 0) {
  console.error('\nStep 29 Knowledge browser/BG consistency QA failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nStep 29 Knowledge browser/BG consistency QA complete.');
