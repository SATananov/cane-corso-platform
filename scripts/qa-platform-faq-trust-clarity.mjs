import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => { console.error(`FAIL ${message}`); process.exitCode = 1; };
const assertIncludes = (content, phrase, message) => content.includes(phrase) ? pass(message) : fail(`${message} — missing: ${phrase}`);
const assertNotIncludes = (content, phrase, message) => !content.includes(phrase) ? pass(message) : fail(`${message} — found banned phrase: ${phrase}`);

console.log('--- Step 93.3 Platform-wide FAQ & Trust Clarity QA ---');

const requiredFiles = [
  'apps/web/app/(public)/faq/page.tsx',
  'apps/web/app/globals.css',
  'apps/web/lib/knowledge-articles.ts',
  'docs/qa/step93-3-platform-wide-faq-trust-clarity.md',
  'scripts/qa-platform-faq-trust-clarity.mjs',
  'README.md',
  'package.json',
];
for (const relativePath of requiredFiles) exists(relativePath) ? pass(`Required file exists: ${relativePath}`) : fail(`Required file exists: ${relativePath}`);

const faq = read('apps/web/app/(public)/faq/page.tsx');
const css = read('apps/web/app/globals.css');
const articles = read('apps/web/lib/knowledge-articles.ts');
const doc = read('docs/qa/step93-3-platform-wide-faq-trust-clarity.md');
const readme = read('README.md');
const packageJson = JSON.parse(read('package.json'));

for (const phrase of ['FAQ / Център за яснота', 'FAQ / Clarity center', 'FAQ / Centro chiarezza', 'цялата USG Cane Corso екосистема', 'whole USG Cane Corso ecosystem', 'tutto l’ecosistema USG Cane Corso']) {
  assertIncludes(faq, phrase, `FAQ includes localized clarity phrase: ${phrase}`);
}
for (const surface of ['Registry', 'Certificate', 'Verify', 'Gallery', 'Community', 'Partners', 'Knowledge', 'USG Bulgarico']) {
  assertIncludes(faq, surface, `FAQ covers surface: ${surface}`);
}
for (const phrase of ['USG Certificate е платформен trust документ', 'USG Certificate is a platform trust document', 'USG Certificate è un documento di fiducia della piattaforma', 'не е FCI родословие', 'It is not an FCI pedigree', 'Non è pedigree FCI', 'Verify проверява издаден от USG сертификатен код', 'Verify checks a USG-issued certificate code', 'Verify controlla un codice certificato emesso da USG']) {
  assertIncludes(faq, phrase, `FAQ includes certificate / verify boundary: ${phrase}`);
}
for (const phrase of ['Липсата на документи не доказва автоматично', 'Lack of documents is not automatic proof', 'La mancanza di documenti non prova automaticamente', 'Цветът може да се наблюдава заедно', 'Color can be observed together', 'Il colore può essere osservato insieme']) {
  assertIncludes(faq, phrase, `FAQ includes evidence / color nuance: ${phrase}`);
}
for (const href of ['https://www.fci.be/en/nomenclature/ITALIAN-CANE-CORSO-343.html', 'https://www.fci.be/nomenclature/standards/343g02-en.pdf', 'https://www.enci.it/media/2603/343.pdf', 'https://images.akc.org/pdf/breeds/standards/CaneCorso.pdf', 'https://www.akc.org/expert-advice/dog-breeds/cane-corso-history/', 'https://www.ukcdogs.com/cane-corso-italiano', 'https://www.canecorso.org/uploads/1/1/8/2/118210967/2022_ccaa_judges_manual.pdf', 'https://www.iccgb.co.uk/about-the-breed/history-of-the-cane-corso/']) {
  assertIncludes(faq, href, `FAQ includes official/specialist source link: ${href}`);
}
for (const name of ['Dr. Paolo Breber', 'Società Amatori Cane Corso', 'Giovanni Bonnetti', 'Vito Indiveri', 'Stefano Gandolfi', 'Malavasi', 'Antonio Morsiani', 'Basir', 'Babak']) {
  assertIncludes(faq, name, `FAQ includes revival-history reading name: ${name}`);
}
for (const phrase of ['admin-mediated', 'Админ-посредничеството', 'mediazione admin', 'target="_blank" rel="noreferrer"', 'platform-faq-reference-grid', 'platform-faq-boundary-list']) {
  assertIncludes(faq, phrase, `FAQ includes structure/flow phrase: ${phrase}`);
}
assertIncludes(css, 'Step 93.3 — Platform-wide FAQ & Trust Clarity Center', 'Step 93.3 CSS block exists');
for (const className of ['.platform-faq-priority', '.platform-faq-nav', '.platform-faq-section', '.platform-faq-reference-card', '.platform-faq-boundary']) {
  assertIncludes(css, className, `FAQ CSS class exists: ${className}`);
}
assertIncludes(css, "[data-theme='heritage'] .platform-faq-priority-card", 'FAQ has heritage/light theme styling');
for (const key of ['akcHistory', 'enciStandard', 'iccgbHistory']) assertIncludes(articles, key, `Knowledge source reference exists: ${key}`);
for (const href of ['https://www.akc.org/expert-advice/dog-breeds/cane-corso-history/', 'https://www.enci.it/media/2603/343.pdf', 'https://www.iccgb.co.uk/about-the-breed/history-of-the-cane-corso/']) assertIncludes(articles, href, `Knowledge source dictionary includes: ${href}`);
assertIncludes(doc, 'Platform-wide FAQ', 'QA doc records platform-wide FAQ scope');
assertIncludes(doc, 'Source links', 'QA doc records source links');
assertIncludes(doc, 'Revival-history names', 'QA doc records revival-history names');
assertIncludes(readme, 'Step 93.3', 'README records Step 93.3');
assertIncludes(readme, 'platform-wide FAQ', 'README records platform-wide FAQ intent');
packageJson.scripts?.['platform:faq-trust:qa'] === 'node scripts/qa-platform-faq-trust-clarity.mjs' ? pass('Package script platform:faq-trust:qa exists') : fail('Package script platform:faq-trust:qa exists');

for (const phrase of ['USG officially certifies purebred status without evidence', 'USG Certificate replaces pedigree', 'Bulgarico officially replaces the Cane Corso standard', 'color alone proves type', 'цветът сам по себе си доказва тип', 'il colore da solo prova il tipo']) {
  assertNotIncludes(faq, phrase, `FAQ avoids unsafe claim: ${phrase}`);
  assertNotIncludes(articles, phrase, `Knowledge avoids unsafe claim: ${phrase}`);
}

for (const relativePath of ['apps/web/app/api/registry/route.ts', 'apps/web/app/api/registry/[slug]/route.ts', 'apps/web/app/api/verify/[code]/route.ts', 'apps/web/components/certificate-v2-document.tsx', 'apps/web/components/verification-result-panel.tsx', 'apps/web/app/(public)/gallery/page.tsx', 'apps/web/app/api/ecosystem/route.ts', 'apps/web/app/api/ecosystem/moderation/route.ts', 'apps/web/app/api/health/db/route.ts', 'netlify.toml', 'drizzle.config.ts']) {
  exists(relativePath) ? pass(`Locked authority file remains present: ${relativePath}`) : fail(`Locked authority file remains present: ${relativePath}`);
}

if (process.exitCode) { console.error('Platform FAQ & Trust Clarity QA failed.'); process.exit(process.exitCode); }
console.log('Platform FAQ & Trust Clarity QA complete.');
