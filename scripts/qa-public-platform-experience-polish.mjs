#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';

const checks = [];
function check(label, condition) {
  checks.push({ label, condition: Boolean(condition) });
}
function read(path) {
  return readFileSync(path, 'utf8');
}
function has(path, needle) {
  return existsSync(path) && read(path).includes(needle);
}

check('Platform page has public experience trust band', has('apps/web/app/(public)/platform/page.tsx', 'section-block--public-experience'));
check('Platform page maps Registry Verify Knowledge Gallery links', has('apps/web/app/(public)/platform/page.tsx', "href: '/registry'") && has('apps/web/app/(public)/platform/page.tsx', "href: '/verify'") && has('apps/web/app/(public)/platform/page.tsx', "href: '/knowledge'") && has('apps/web/app/(public)/platform/page.tsx', "href: '/gallery'"));
check('Knowledge directory includes published trust strip', has('apps/web/components/knowledge-article-directory.tsx', 'knowledge-public-trust-strip'));
check('Knowledge detail includes official article strip', has('apps/web/components/knowledge-article-detail.tsx', 'knowledge-article-official-strip'));
check('Registry orientation includes official seal trust header', has('apps/web/components/public-registry-overview.tsx', 'registry-orientation-panel__header--trust'));
check('Gallery showcase includes official trust rail', has('apps/web/app/(public)/gallery/page.tsx', 'usg-gallery-trust-rail'));
check('BG Verify copy no longer uses owner record wording', !has('apps/web/components/verify-entry-panel.tsx', 'owner запис'));
check('BG Verify result no longer uses Registry profile wording', !has('apps/web/components/verification-result-panel.tsx', 'Registry профилът'));
check('BG Registry copy avoids registry mojomix in authority text', !has('apps/web/components/public-registry-overview.tsx', 'Официално registry присъствие'));
check('Global CSS contains Step 34 public polish block', has('apps/web/app/globals.css', 'Step 34 — Public Platform Experience Polish Batch START'));
check('Global CSS contains responsive public experience grid', has('apps/web/app/globals.css', '.public-experience-band__links'));
check('Global CSS contains knowledge trust strip styles', has('apps/web/app/globals.css', '.knowledge-public-trust-strip'));
check('Step 34 QA document exists', existsSync('docs/qa/step34-public-platform-experience-polish.md'));

const packageJson = JSON.parse(read('package.json'));
check('package script public:experience-polish:qa exists', packageJson.scripts?.['public:experience-polish:qa'] === 'node scripts/qa-public-platform-experience-polish.mjs');

const lockedLogicFiles = [
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'packages/db/src/repositories/ecosystem.repository.ts',
  'packages/db/src/repositories/my-dogs.repository.ts',
];
check('Locked API/DB logic files remain present', lockedLogicFiles.every((file) => existsSync(file)));

for (const item of checks) {
  console.log(`${item.condition ? 'PASS' : 'FAIL'} ${item.label}`);
}

const failed = checks.filter((item) => !item.condition);
if (failed.length) {
  console.error(`\nStep 34 public platform experience polish QA failed with ${failed.length} failed check(s).`);
  process.exit(1);
}

console.log('\nStep 34 public platform experience polish QA complete.');
