#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(file) { return readFileSync(path.join(root, file), 'utf8'); }
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function assertFile(file) { existsSync(path.join(root, file)) ? pass(`Required file exists: ${file}`) : fail(`Missing required file: ${file}`); }
function assertIncludes(file, needle, label) { read(file).includes(needle) ? pass(label) : fail(`${label}: missing ${needle}`); }
function assertNotIncludes(file, needle, label) { read(file).includes(needle) ? fail(`${label}: found ${needle}`) : pass(label); }

console.log('\n==========================================================');
console.log('Step 111 — USG Heritage / di Casa Tananov Personal Archive QA');
console.log('==========================================================\n');

const requiredFiles = [
  'apps/web/app/(public)/heritage/page.tsx',
  'apps/web/components/usg-founder-heritage-panel.tsx',
  'apps/web/app/(public)/platform/page.tsx',
  'apps/web/app/globals.css',
  'docs/qa/step111-usg-heritage-di-casa-tananov-archive.md',
  'scripts/qa-step111-usg-heritage-di-casa-tananov-archive.mjs',
  'apps/web/public/brand/heritage/di-casa-tananov/mark-i.jpg',
  'apps/web/public/brand/heritage/di-casa-tananov/hera.jpg',
  'apps/web/public/brand/heritage/di-casa-tananov/thor.jpg',
  'apps/web/public/brand/heritage/di-casa-tananov/reia.jpg',
  'apps/web/public/brand/heritage/di-casa-tananov/mark-ii.jpg',
  'apps/web/public/brand/heritage/di-casa-tananov/ara.jpg',
  'apps/web/public/brand/heritage/di-casa-tananov/broly.jpg',
];
for (const file of requiredFiles) assertFile(file);

const component = 'apps/web/components/usg-founder-heritage-panel.tsx';
assertIncludes(component, 'di Casa Tananov', 'Personal archive identity uses di Casa Tananov');
assertIncludes(component, 'Личен архив, не развъдник', 'Bulgarian copy clearly says this is not a kennel');
assertIncludes(component, 'not a kennel page', 'English copy clearly says this is not a kennel page');
assertIncludes(component, 'non pagina di allevamento', 'Italian copy clearly says this is not an breeding/kennel page');
assertIncludes(component, 'не представя USG като развъдник', 'Bulgarian boundary protects breeder positioning');
assertIncludes(component, 'does not present USG as a breeder', 'English boundary protects breeder positioning');
assertIncludes(component, 'non presenta USG come allevamento', 'Italian boundary protects breeder positioning');
assertIncludes(component, 'Mark I di Casa Tananov', 'Mark I archive identity exists');
assertIncludes(component, 'Hera di Casa Tananov', 'Hera archive identity exists');
assertIncludes(component, 'Thor di Casa Tananov', 'Thor archive identity exists');
assertIncludes(component, 'Reia di Casa Tananov', 'Reia archive identity exists');
assertIncludes(component, 'Mark II di Casa Tananov', 'Mark II archive identity exists');
assertIncludes(component, 'Ara di Casa Tananov', 'Ara archive identity exists');
assertIncludes(component, 'Broly di Casa Tananov', 'Broly archive identity exists');
assertIncludes(component, 'The last puppy that became the first chapter', 'Mark I is described as the first chapter path marker');
assertIncludes(component, 'Последното кученце, което стана първа глава', 'BG Mark I first chapter copy exists');
assertIncludes(component, 'official breed systems', 'Component respects official breed systems');
assertNotIncludes(component, 'купи сега', 'Component does not contain buy-now sales wording');
assertNotIncludes(component, 'купете', 'Component does not contain direct purchase CTA wording');
assertNotIncludes(component, 'за продажба', 'Component does not present dogs for sale');
assertNotIncludes(component, 'цена', 'Component does not contain pricing wording');
assertNotIncludes(component, 'available puppies', 'Component does not sell puppies');
assertNotIncludes(component, 'for sale', 'Component does not sell dogs');

const heritagePage = 'apps/web/app/(public)/heritage/page.tsx';
assertIncludes(heritagePage, '<UsgFounderHeritagePanel locale={locale} variant="full" />', 'Full heritage page renders archive component');
assertIncludes(heritagePage, 'Not a kennel page', 'Heritage hero includes non-kennel boundary');
assertIncludes(heritagePage, 'Не е развъдник', 'BG heritage hero includes non-kennel boundary');
assertIncludes(heritagePage, 'not a pedigree authority or breeding claim', 'Heritage hero protects official authority boundary');
assertIncludes(heritagePage, 'visualSrc="/brand/heritage/di-casa-tananov/mark-i.jpg"', 'Heritage hero uses Mark I as the visual anchor');

const platformPage = 'apps/web/app/(public)/platform/page.tsx';
assertIncludes(platformPage, "import { UsgFounderHeritagePanel }", 'Platform imports the heritage panel');
assertIncludes(platformPage, '<UsgFounderHeritagePanel locale={locale} variant="compact" />', 'Platform renders compact heritage teaser');

const styles = 'apps/web/app/globals.css';
assertIncludes(styles, 'Step 111 — USG Heritage / di Casa Tananov Personal Archive START', 'Step 111 CSS block exists');
assertIncludes(styles, '.usg-founder-heritage__grid', 'Heritage image grid CSS exists');
assertIncludes(styles, '[data-theme=\'heritage\'] .usg-founder-heritage', 'Heritage theme CSS support exists');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['step111:usg-heritage:qa']) pass('Package script step111:usg-heritage:qa exists');
else fail('Package script step111:usg-heritage:qa missing');

const releaseQa = 'scripts/qa-fullstack-all-in-one-release-lock.mjs';
assertIncludes(releaseQa, 'docs/qa/step111-usg-heritage-di-casa-tananov-archive.md', 'Release QA requires Step 111 docs');
assertIncludes(releaseQa, 'scripts/qa-step111-usg-heritage-di-casa-tananov-archive.mjs', 'Release QA requires Step 111 script');
assertIncludes(releaseQa, "['Step 111 USG heritage / di Casa Tananov archive'", 'Release QA runs Step 111 script');

if (process.exitCode) {
  console.error('\nStep 111 USG heritage archive QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 111 USG heritage archive QA PASS');
