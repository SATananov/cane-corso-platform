import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function pass(description, ok, detail = '') {
  checks.push({ description, ok, detail });
}

function includes(relativePath, needle, description) {
  const content = read(relativePath);
  pass(description, content.includes(needle), `${relativePath} should include ${needle}`);
}

function notIncludes(relativePath, needle, description) {
  const content = read(relativePath);
  pass(description, !content.includes(needle), `${relativePath} should not include ${needle}`);
}

const packageJson = read('package.json');
pass('Package script content:authority:qa exists', packageJson.includes('content:authority:qa'), 'package.json');
pass('Step 93 QA doc exists', exists('docs/qa/step93-content-authority-placeholder-removal.md'), 'docs/qa/step93-content-authority-placeholder-removal.md');
pass('Step 93 QA script exists', exists('scripts/qa-content-authority-placeholder-removal.mjs'), 'scripts/qa-content-authority-placeholder-removal.mjs');

includes('apps/web/lib/knowledge-articles.ts', 'стария римски молос', 'BG history article explains the old Roman Molossian root');
includes('apps/web/lib/knowledge-articles.ts', 'Апулия', 'BG history article mentions Apulia / Southern Italy');
includes('apps/web/lib/knowledge-articles.ts', 'Модерен Cane Corso: семеен пазител, не моден символ', 'BG history article has complete modern responsibility section');
includes('apps/web/lib/knowledge-articles.ts', 'Социализация, контрол и зряло притежание', 'BG history facts connect history to responsible ownership');
includes('apps/web/lib/knowledge-articles.ts', 'sourceReferences: [sharedSources.fciStandard, sharedSources.fciBreed, sharedSources.akcBreed]', 'History article remains source-backed');

notIncludes('apps/web/lib/knowledge-articles.ts', 'USG редакционна основа • Step', 'Public BG Knowledge labels do not expose step numbers');
notIncludes('apps/web/lib/knowledge-articles.ts', 'USG стандарт на породата • Step', 'Public BG standard labels do not expose step numbers');
notIncludes('apps/web/components/knowledge-education-experience.tsx', 'Step 47', 'Knowledge education copy does not expose old step language');
notIncludes('apps/web/lib/knowledge-center-content.ts', 'Step 28', 'Knowledge center copy does not expose old release-step language');
notIncludes('apps/web/lib/knowledge-center-content.ts', 'Бъдещ модел на съдържание', 'Knowledge center no longer sounds like a future placeholder model');
notIncludes('apps/web/components/community-discovery-experience.tsx', 'future public signal layer', 'Community lost/found lane is presented as active orientation, not future placeholder');
notIncludes('apps/web/components/community-discovery-experience.tsx', 'Future moderated discovery', 'Community breeding lane is presented as active orientation, not future placeholder');
notIncludes('apps/web/app/access/page.tsx', 'бъдещи обяви', 'Access page no longer says community listings are future-only');
notIncludes('apps/web/lib/i18n.ts', 'Бъдещи практични секции', 'BG Knowledge cards no longer present practical knowledge as future-only');
notIncludes('apps/web/lib/i18n.ts', 'Тук ще се появи по-дългото представяне', 'Owner preview does not show unfinished placeholder language');
notIncludes('apps/web/lib/i18n.ts', 'Очаква попълване', 'Owner preview uses calmer incomplete-data wording');

includes('apps/web/lib/i18n.ts', 'Добави спокойно описание: произход, характер, линия, ежедневие', 'Owner preview guides users with complete content direction');
includes('apps/web/lib/knowledge-center-content.ts', 'посетителят вижда завършена информация, а не празни полета', 'BG Knowledge model explicitly avoids empty-placeholder feeling');

const lockedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'packages/db/drizzle/0012_ecosystem_match_requests.sql',
];
for (const file of lockedFiles) {
  pass(`Locked authority file remains present: ${file}`, exists(file), file);
}

let failed = 0;
for (const check of checks) {
  if (check.ok) {
    console.log(`PASS ${check.description}`);
  } else {
    failed += 1;
    console.error(`FAIL ${check.description}`);
    if (check.detail) console.error(`     ${check.detail}`);
  }
}

if (failed > 0) {
  console.error(`\nContent authority placeholder-removal QA failed: ${failed} failure(s).`);
  process.exit(1);
}

console.log('\nContent authority placeholder-removal QA complete.');
