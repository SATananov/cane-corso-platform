import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
};
const assertIncludes = (content, phrase, message) => {
  if (content.includes(phrase)) pass(message);
  else fail(`${message} — missing: ${phrase}`);
};
const assertNotIncludes = (content, phrase, message) => {
  if (!content.includes(phrase)) pass(message);
  else fail(`${message} — found banned phrase: ${phrase}`);
};

console.log('--- Step 93.2 USG Identity & Bulgarico Observational Framework QA ---');

const files = [
  'apps/web/components/usg-identity-bulgarico-panel.tsx',
  'apps/web/app/(public)/platform/page.tsx',
  'apps/web/components/knowledge-center.tsx',
  'apps/web/components/platform-guide.tsx',
  'apps/web/lib/knowledge-articles.ts',
  'apps/web/app/globals.css',
  'docs/qa/step93-2-usg-identity-bulgarico-framework.md',
  'scripts/qa-usg-identity-bulgarico-framework.mjs',
  'README.md',
  'package.json',
];

for (const relativePath of files) {
  if (exists(relativePath)) pass(`Required file exists: ${relativePath}`);
  else fail(`Required file exists: ${relativePath}`);
}

const component = read('apps/web/components/usg-identity-bulgarico-panel.tsx');
const platformPage = read('apps/web/app/(public)/platform/page.tsx');
const knowledgeCenter = read('apps/web/components/knowledge-center.tsx');
const guide = read('apps/web/components/platform-guide.tsx');
const articles = read('apps/web/lib/knowledge-articles.ts');
const css = read('apps/web/app/globals.css');
const readme = read('README.md');
const doc = read('docs/qa/step93-2-usg-identity-bulgarico-framework.md');
const packageJson = JSON.parse(read('package.json'));

assertIncludes(component, 'Unico Suo Genere', 'Component explains USG identity');
assertIncludes(component, 'ЕДИНСТВЕНО ПО РОДА СИ', 'Component includes Bulgarian premium USG seal language');
assertIncludes(component, 'USG Bulgarico', 'Component includes USG Bulgarico name');
assertIncludes(component, 'not a new breed', 'Component states Bulgarico is not a new breed');
assertIncludes(component, 'не е официален стандарт', 'Component states Bulgarico is not an official standard in Bulgarian');
assertIncludes(component, 'color alone does not prove type', 'Component contains color caveat in English');
assertIncludes(component, 'цветът сам по себе си не доказва тип', 'Component contains color caveat in Bulgarian');
assertIncludes(component, 'Evidence levels', 'Component describes evidence levels');
assertIncludes(component, 'Нива на доказуемост', 'Component describes evidence levels in Bulgarian');
assertIncludes(component, 'not a pedigree', 'Component states USG Certificate is not a pedigree');
assertIncludes(component, 'не е родословие', 'Component states certificate is not pedigree in Bulgarian');
assertIncludes(component, 'FCI', 'Component includes FCI boundary');
assertIncludes(component, 'Registry', 'Component explains Registry surface');
assertIncludes(component, 'Certificate', 'Component explains Certificate surface');
assertIncludes(component, 'Verify', 'Component explains Verify surface');
assertIncludes(component, 'Gallery', 'Component explains Gallery surface');
assertIncludes(component, 'Community', 'Component explains Community surface');
assertIncludes(component, 'Knowledge', 'Component explains Knowledge surface');

assertIncludes(platformPage, 'UsgIdentityBulgaricoPanel', 'Platform page renders USG identity panel');
assertIncludes(knowledgeCenter, 'UsgIdentityBulgaricoPanel', 'Knowledge center renders USG identity panel');
assertIncludes(css, 'Step 93.2 — USG Identity & Bulgarico Observational Framework', 'Step 93.2 CSS block exists');
assertIncludes(css, '.usg-identity-framework', 'USG identity CSS class exists');
assertIncludes(css, "[data-theme='heritage'] .usg-identity-framework", 'Heritage/light theme styling exists');

for (const id of ['usg-identity', 'usg-certificate', 'usg-bulgarico']) {
  const count = (guide.match(new RegExp(`id: '${id}'`, 'g')) || []).length;
  if (count === 3) pass(`Platform guide includes ${id} in BG/EN/IT`);
  else fail(`Platform guide includes ${id} in BG/EN/IT — found ${count}`);
}

for (const slug of ['usg-identity-and-platform-trust', 'usg-certificate-evidence-levels', 'usg-bulgarico-observational-framework']) {
  const count = (articles.match(new RegExp(`slug: '${slug}'`, 'g')) || []).length;
  if (count === 3) pass(`Knowledge article seed exists for BG/EN/IT: ${slug}`);
  else fail(`Knowledge article seed exists for BG/EN/IT: ${slug} — found ${count}`);
}

assertIncludes(articles, 'USG identity and platform trust', 'English USG identity article exists');
assertIncludes(articles, 'USG идентичност и доверие в платформата', 'Bulgarian USG identity article exists');
assertIncludes(articles, 'Identità USG e fiducia della piattaforma', 'Italian USG identity article exists');
assertIncludes(articles, 'USG Certificate and evidence levels', 'English certificate article exists');
assertIncludes(articles, 'USG сертификат и нива на доказуемост', 'Bulgarian certificate article exists');
assertIncludes(articles, 'Certificato USG e livelli di evidenza', 'Italian certificate article exists');
assertIncludes(articles, 'USG Bulgarico observational framework', 'English Bulgarico article exists');
assertIncludes(articles, 'USG Bulgarico наблюдателна рамка', 'Bulgarian Bulgarico article exists');
assertIncludes(articles, 'Framework osservativo USG Bulgarico', 'Italian Bulgarico article exists');
assertIncludes(articles, 'does not replace FCI', 'Articles contain official authority boundary');
assertIncludes(articles, 'не заменя FCI', 'Articles contain Bulgarian official authority boundary');
assertIncludes(articles, 'not a pedigree', 'Articles contain certificate pedigree boundary');
assertIncludes(articles, 'не родословие', 'Articles contain Bulgarian certificate pedigree boundary');
assertIncludes(articles, 'color alone does not prove type', 'Articles contain English color caveat');
assertIncludes(articles, 'цветът сам по себе си не доказва тип', 'Articles contain Bulgarian color caveat');

const bannedPublicClaims = [
  'Bulgarico is an official standard',
  'Bulgarico е официален стандарт',
  'Bulgarico è uno standard ufficiale',
  'Bulgarico is a new breed',
  'Bulgarico е нова порода',
  'Bulgarico è una nuova razza',
  'color proves type',
  'цветът доказва тип',
  'colore prova il tipo',
  'will replace FCI',
  'заменя FCI като официален стандарт',
];

for (const phrase of bannedPublicClaims) {
  assertNotIncludes(component, phrase, `Component avoids unsafe claim: ${phrase}`);
  assertNotIncludes(articles, phrase, `Articles avoid unsafe claim: ${phrase}`);
  assertNotIncludes(guide, phrase, `Guide avoids unsafe claim: ${phrase}`);
}

const lockedAuthorityFiles = [
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

for (const relativePath of lockedAuthorityFiles) {
  if (exists(relativePath)) pass(`Locked authority file remains present: ${relativePath}`);
  else fail(`Locked authority file remains present: ${relativePath}`);
}

assertIncludes(readme, 'Step 93.2', 'README records Step 93.2 continuation');
assertIncludes(readme, 'USG Bulgarico', 'README records USG Bulgarico boundary');
assertIncludes(readme, 'evidence levels', 'README records evidence level language');
assertIncludes(doc, 'not a new breed', 'QA doc records Bulgarico boundary');
assertIncludes(doc, 'evidence levels, not value levels', 'QA doc records evidence-level principle');

if (packageJson.scripts?.['usg:identity-bulgarico:qa'] === 'node scripts/qa-usg-identity-bulgarico-framework.mjs') {
  pass('Package script usg:identity-bulgarico:qa exists');
} else {
  fail('Package script usg:identity-bulgarico:qa exists');
}

if (process.exitCode) {
  console.error('USG Identity & Bulgarico QA failed.');
  process.exit(process.exitCode);
}

console.log('USG Identity & Bulgarico QA complete.');
