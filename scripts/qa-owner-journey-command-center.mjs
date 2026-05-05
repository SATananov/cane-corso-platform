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

const componentPath = 'apps/web/components/owner-journey-command-center.tsx';
const ownerCenterPath = 'apps/web/components/owner-center-workspace.tsx';
const memberPagePath = 'apps/web/app/(member)/member/page.tsx';
const headerPath = 'apps/web/components/site-header.tsx';
const cssPath = 'apps/web/app/globals.css';
const docPath = 'docs/qa/step46-owner-journey-command-center.md';
const pkg = JSON.parse(read('package.json'));

check('Step 46 component exists', exists(componentPath));
check('Step 46 member route exists', exists(memberPagePath));
check('Step 46 QA document exists', exists(docPath));
check('Package script owner:journey:qa exists', pkg.scripts?.['owner:journey:qa'] === 'node scripts/qa-owner-journey-command-center.mjs');

const component = read(componentPath);
const ownerCenter = read(ownerCenterPath);
const memberPage = read(memberPagePath);
const header = read(headerPath);
const css = read(cssPath);
const docs = read(docPath);

for (const locale of ['en', 'bg', 'it']) {
  check(`Command center copy includes locale ${locale}`, component.includes(`${locale}: {`));
}

for (const required of [
  'Private profile',
  'Admin review',
  'Registry',
  'USG certificate',
  'Gallery / showcase',
]) {
  check(`Command center includes lifecycle concept: ${required}`, component.includes(required));
}

for (const status of ['draft', 'submitted', 'needs_changes', 'approved', 'published', 'archived']) {
  check(`Command center maps lifecycle status ${status}`, component.includes(`${status}:`));
}

check('Command center uses OwnerCenterDocument read model', component.includes('OwnerCenterDocument'));
check('Command center computes recommended next action', component.includes('getNextAction'));
check('Command center builds milestones from read model', component.includes('buildMilestones'));
check('Command center does not import server mutation actions', !component.includes('/actions') && !component.includes('updateDog(') && !component.includes('deleteDog(') && !component.includes('submitDog('));

check('Owner center imports command center', ownerCenter.includes("OwnerJourneyCommandCenter"));
check('Owner center renders command center before tasks', ownerCenter.includes('<OwnerJourneyCommandCenter document={document} locale={locale} />'));
check('Member page uses PageShell', memberPage.includes('PageShell'));
check('Member page uses OwnerCenterWorkspace', memberPage.includes('OwnerCenterWorkspace'));
check('Member page redirects unauthenticated users through access path', memberPage.includes("next: '/member'") && memberPage.includes('buildAccessPath'));
check('Member page records read-only orchestration boundary', memberPage.includes('read-only orchestration'));

check('Header exposes direct member center link', header.includes("href: '/member'") && header.includes('memberCenterLabel'));
check('Header keeps direct profile link', header.includes("href: '/profile'"));
check('Header keeps direct admin link without dropdown', header.includes("href: '/admin'") && !header.includes('dropdown'));

check('Step 46 CSS block exists', css.includes('Step 46 — Owner Journey Command Center & Status Clarity'));
check('Command center CSS class exists', css.includes('.owner-journey-command-center'));
check('Milestone CSS class exists', css.includes('.owner-journey-milestone'));
check('Dog strip CSS class exists', css.includes('.owner-journey-dog-strip'));
check('Heritage command center CSS exists', css.includes("[data-theme='heritage'] .owner-journey-command-center"));
check('Responsive command center CSS exists', css.includes('@media (max-width: 1180px)') && css.includes('.owner-journey-milestones'));

for (const lockedFile of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'apps/web/lib/session.server.ts',
  'apps/web/lib/registry.server.ts',
  'apps/web/lib/review.server.ts',
  'packages/db/src/schema/index.ts',
]) {
  check(`Locked authority file still exists: ${lockedFile}`, exists(lockedFile));
}

check('QA doc records hard boundaries', docs.includes('Registry publish logic') && docs.includes('Certificate issue / revoke logic') && docs.includes('Auth / session logic'));
check('QA doc records dedicated /member route', docs.includes('`/member`'));
check('QA doc records read-only orchestration intent', docs.includes('read-only orchestration'));

const failed = checks.filter((item) => !item.condition);
for (const item of checks) {
  console.log(`${item.condition ? 'PASS' : 'FAIL'} ${item.label}`);
}

if (failed.length) {
  console.error(`\nStep 46 owner journey QA failed with ${failed.length} issue(s).`);
  process.exit(1);
}

console.log('\nStep 46 owner journey command center QA complete.');
