#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

let failures = 0;
function pass(message) {
  console.log(`PASS ${message}`);
}
function fail(message) {
  failures += 1;
  console.error(`FAIL ${message}`);
}
function assert(condition, message) {
  condition ? pass(message) : fail(message);
}

const header = read('apps/web/components/site-header.tsx');
const adminTaskMenu = read('apps/web/components/admin-task-menu.tsx');
const adminLayout = read('apps/web/app/(admin)/layout.tsx');
const adminMembersPage = read('apps/web/app/(admin)/admin/members/page.tsx');
const globalsCss = read('apps/web/app/globals.css');
const packageJson = JSON.parse(read('package.json'));
const qaDoc = read('docs/qa/step80-admin-navigation-clarity.md');

console.log('--- Step 80 Admin navigation clarity QA ---');

assert(header.includes("import { AdminTaskMenu } from '@/components/admin-task-menu';"), 'Site header imports AdminTaskMenu');
assert(header.includes('<AdminTaskMenu locale={locale} />'), 'Site header renders AdminTaskMenu for admin users');
assert(!header.includes("{ href: '/admin', label: t.site.admin"), 'Header no longer renders Admin as a confusing direct-only workline link');

assert(adminTaskMenu.includes("href: '/review'") && adminTaskMenu.includes("primary: true"), 'Admin dropdown makes Review the primary task');
assert(adminTaskMenu.includes("href: '/admin/members'"), 'Admin dropdown links to Members');
assert(adminTaskMenu.includes("href: '/admin/registry'"), 'Admin dropdown links to Registry control');
assert(adminTaskMenu.includes("href: '/admin/partners'"), 'Admin dropdown links to Partners');
assert(adminTaskMenu.includes("href: '/admin/ecosystem'"), 'Admin dropdown links to Ecosystem');
assert(adminTaskMenu.includes("href: '/admin/knowledge'"), 'Admin dropdown links to Knowledge');
assert(adminTaskMenu.includes('Работи по задача'), 'Admin dropdown uses task-first BG guidance');
assert(adminTaskMenu.includes('role="menu"'), 'Admin dropdown exposes menu semantics');

assert(adminLayout.includes('admin-workflow-strip'), 'Admin layout adds visible workflow strip to every admin page');
assert(adminLayout.includes("href: '/review', label: copy.review, primary: true"), 'Admin workflow strip makes Review the first/primary link');
assert(adminLayout.includes('Одобряването на Cane Corso започва от Преглед.'), 'Admin workflow strip explains where approval starts in BG');

assert(adminMembersPage.includes('reviewHint'), 'Members page has explicit review guidance copy');
assert(adminMembersPage.includes('Тази страница показва owner данни'), 'Members page says it shows owner data, not approval');
assert(adminMembersPage.includes('<Link href="/review" className="button-primary small">'), 'Members page provides direct Review CTA');
assert(adminMembersPage.includes('admin-inline-guidance admin-inline-guidance--review'), 'Members page renders visible inline guidance');

assert(globalsCss.includes('Step 80 — Admin task navigation and approval clarity START'), 'Step 80 CSS block exists');
assert(globalsCss.includes('.admin-task-menu__panel'), 'CSS styles admin dropdown panel');
assert(globalsCss.includes('.admin-workflow-strip'), 'CSS styles admin workflow strip');
assert(globalsCss.includes('.admin-inline-guidance'), 'CSS styles inline member guidance');

assert(packageJson.scripts['admin:navigation-clarity:qa'] === 'node scripts/qa-admin-navigation-clarity.mjs', 'Package script admin:navigation-clarity:qa exists');
assert(packageJson.scripts['admin:real-netlify-flow:qa'] === 'node scripts/qa-admin-real-netlify-flow.mjs', 'Step 79 QA remains wired');
assert(packageJson.scripts['user:clarity-scroll:qa'] === 'node scripts/qa-user-clarity-scroll-reduction.mjs', 'Step 78 QA remains wired');
assert(packageJson.scripts['deploy:netlify:qa'] === 'node scripts/qa-netlify-deploy-readiness.mjs', 'Netlify deploy QA remains wired');

assert(qaDoc.includes('Admin dropdown / task menu'), 'Step 80 doc records the admin dropdown intent');
assert(qaDoc.includes('Преглед е първият и най-видим admin action'), 'Step 80 doc records Review as the first action');
assert(qaDoc.includes('Не се пипа Registry / Certificate / Verify / Gallery / Ecosystem backend логика'), 'Step 80 doc records locked backend boundary');

if (failures > 0) {
  console.error(`\nStep 80 Admin navigation clarity QA failed with ${failures} failure(s).`);
  process.exit(1);
}

console.log('\nStep 80 Admin navigation clarity QA complete.');
