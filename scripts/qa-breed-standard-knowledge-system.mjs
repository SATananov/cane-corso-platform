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

function check(label, condition) {
  checks.push({ label, condition: Boolean(condition) });
}

const content = read('apps/web/lib/breed-standard-content.ts');
const articles = read('apps/web/lib/knowledge-articles.ts');
const directory = read('apps/web/components/knowledge-article-directory.tsx');
const detail = read('apps/web/components/knowledge-article-detail.tsx');
const myDogs = read('apps/web/components/my-dogs-overview.tsx');
const css = read('apps/web/app/globals.css');
const pkg = JSON.parse(read('package.json'));

check('Breed standard content file exists', exists('apps/web/lib/breed-standard-content.ts'));
check('BreedStandardOverview component exists', exists('apps/web/components/breed-standard-overview.tsx'));
check('BreedStandardDiagramCard component exists', exists('apps/web/components/breed-standard-diagram-card.tsx'));
check('BreedStandardArticlePanel component exists', exists('apps/web/components/breed-standard-article-panel.tsx'));
check('OwnerPhotoGuidePanel component exists', exists('apps/web/components/owner-photo-guide-panel.tsx'));

check('Exact 11% body proportion is present', content.includes('11%'));
check('Exact 36% head proportion is present', content.includes('36%'));
check('Exact muzzle skull ratio 1 : 2 is present', content.includes('1 : 2'));
check('Slightly convergent axes wording is present', content.includes('slightly convergent') || content.includes('Лека конвергенция'));
check('Educational disclaimer is present', content.includes('USG educational visualization') && content.includes('not automatic judging'));

check('FCI primary source exists', content.includes('FCI Standard N°343') && content.includes('343g02-en.pdf'));
check('AKC support source exists', content.includes('AKC Official Standard'));
check('UKC support source exists', content.includes('UKC Cane Corso Italiano Breed Standard'));
check('CCAA support source exists', content.includes('CCAA Judge'));

check('Overall proportions asset exists', exists('apps/web/public/brand/standard/usg-standard-overall-proportions.avif'));
check('Head muzzle asset exists', exists('apps/web/public/brand/standard/usg-standard-head-muzzle-ratio.png'));
check('Head axes asset exists', exists('apps/web/public/brand/standard/usg-standard-head-axes.png'));
check('Front structure asset exists', exists('apps/web/public/brand/standard/usg-standard-front-structure.png'));
check('Photo guide asset exists', exists('apps/web/public/brand/standard/usg-standard-photo-guide.avif'));

for (const slug of [
  'cane-corso-standard-proportions',
  'cane-corso-head-and-muzzle',
  'cane-corso-head-axes',
  'cane-corso-front-structure',
  'how-to-photograph-cane-corso-for-review',
]) {
  check(`Knowledge article exists for ${slug}`, articles.includes(`slug: '${slug}'`));
}

check('Knowledge directory renders BreedStandardOverview', directory.includes('BreedStandardOverview'));
check('Knowledge detail renders BreedStandardArticlePanel', detail.includes('BreedStandardArticlePanel'));
check('My Dogs renders OwnerPhotoGuidePanel', myDogs.includes('OwnerPhotoGuidePanel'));
check('Step 35 CSS block exists', css.includes('Step 35 — USG Breed Standard Exact Proportions Pack START'));
check('Package script breed:standard:qa exists', pkg.scripts?.['breed:standard:qa'] === 'node scripts/qa-breed-standard-knowledge-system.mjs');

for (const lockedFile of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
]) {
  check(`Locked logic surface still exists: ${lockedFile}`, exists(lockedFile));
}

const failed = checks.filter((item) => !item.condition);
for (const item of checks) {
  console.log(`${item.condition ? 'PASS' : 'FAIL'} ${item.label}`);
}

if (failed.length) {
  console.error(`\nBreed standard QA failed with ${failed.length} issue(s).`);
  process.exit(1);
}

console.log('\nUSG Breed Standard Knowledge System QA complete.');
