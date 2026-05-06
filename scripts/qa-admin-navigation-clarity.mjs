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
const reviewQueueDashboard = read('apps/web/components/review-queue-dashboard.tsx');
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
assert(adminTaskMenu.includes('useState(false)'), 'Admin dropdown uses controlled open state');
assert(adminTaskMenu.includes('setIsOpen(false)'), 'Admin dropdown can close after selection');
assert(adminTaskMenu.includes('handleMenuItemSelect'), 'Admin dropdown uses a dedicated close handler for task selection');
assert(adminTaskMenu.includes('window.requestAnimationFrame(() => setIsOpen(false))'), 'Admin dropdown repeats close after navigation paint for reliable collapse');
assert(adminTaskMenu.includes('onClick={handleMenuItemSelect}'), 'Admin dropdown items close the menu on click');
assert(adminTaskMenu.includes('aria-expanded={isOpen}'), 'Admin dropdown exposes expanded state');

assert(adminLayout.includes('admin-workflow-strip'), 'Admin layout adds visible workflow strip to every admin page');
assert(adminLayout.includes("href: '/review', label: copy.review, primary: true"), 'Admin workflow strip makes Review the first/primary link');
assert(adminLayout.includes('Одобряването на Cane Corso започва от Преглед.'), 'Admin workflow strip explains where approval starts in BG');

assert(adminMembersPage.includes('reviewHint'), 'Members page has explicit review guidance copy');
assert(adminMembersPage.includes('Тази страница показва данните на собственика'), 'Members page says it shows owner data, not approval');
assert(adminMembersPage.includes('<Link href="/review" className="button-primary small">'), 'Members page provides direct Review CTA');
assert(adminMembersPage.includes('openRegistryControl'), 'Members page provides Registry control copy');
assert(adminMembersPage.includes('<Link href="/admin/registry" className="button-secondary small">'), 'Members page provides direct Registry control CTA');
assert(adminMembersPage.includes('admin-inline-guidance admin-inline-guidance--review'), 'Members page renders visible inline guidance');

assert(reviewQueueDashboard.includes("total: 'Записи в прегледа'"), 'Review stats no longer call total records an active queue');
assert(reviewQueueDashboard.includes("published: 'Вече публикувани'"), 'Review published count is labeled as already published in BG');
assert(reviewQueueDashboard.includes('без „Изпрати за преглед“'), 'Review explains that saved profiles/photos are not pending until submitted');
assert(reviewQueueDashboard.includes('review-queue-card__scope-note'), 'Review renders a visible scope note above the list');

assert(globalsCss.includes('Step 80 — Admin task navigation and approval clarity START'), 'Step 80 CSS block exists');
assert(globalsCss.includes('.admin-task-menu__panel'), 'CSS styles admin dropdown panel');
assert(globalsCss.includes('.admin-workflow-strip'), 'CSS styles admin workflow strip');
assert(globalsCss.includes('.admin-inline-guidance'), 'CSS styles inline member guidance');
assert(globalsCss.includes('.admin-inline-guidance__actions'), 'CSS styles inline member action group');
assert(globalsCss.includes('.admin-task-menu__panel[hidden]'), 'CSS hides the controlled admin dropdown panel');
assert(globalsCss.includes('Step 81 — Admin dropdown close guard and review wording clarity START'), 'Step 81 dropdown/review clarity CSS block exists');
assert(globalsCss.includes('.review-queue-card__scope-note'), 'CSS styles Review scope note');

assert(packageJson.scripts['admin:navigation-clarity:qa'] === 'node scripts/qa-admin-navigation-clarity.mjs', 'Package script admin:navigation-clarity:qa exists');
assert(packageJson.scripts['admin:real-netlify-flow:qa'] === 'node scripts/qa-admin-real-netlify-flow.mjs', 'Step 79 QA remains wired');
assert(packageJson.scripts['user:clarity-scroll:qa'] === 'node scripts/qa-user-clarity-scroll-reduction.mjs', 'Step 78 QA remains wired');
assert(packageJson.scripts['deploy:netlify:qa'] === 'node scripts/qa-netlify-deploy-readiness.mjs', 'Netlify deploy QA remains wired');

assert(qaDoc.includes('Администраторско падащо меню'), 'Step 80 doc records the admin dropdown intent');
assert(qaDoc.includes('Преглед е първото и най-видимо администраторско действие'), 'Step 80 doc records Review as the first action');
assert(qaDoc.includes('Не се пипа backend логиката на Registry / Certificate / Verify / Gallery / Ecosystem'), 'Step 80 doc records locked backend boundary');

if (failures > 0) {
  console.error(`\nStep 80 Admin navigation clarity QA failed with ${failures} failure(s).`);
  process.exit(1);
}

console.log('\nStep 80 Admin navigation clarity QA complete.');
