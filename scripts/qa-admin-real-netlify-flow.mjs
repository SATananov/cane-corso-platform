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
  if (condition) pass(message);
  else fail(message);
}

const adminPagePath = 'apps/web/app/(admin)/admin/page.tsx';
const adminPage = read(adminPagePath);
const packageJson = JSON.parse(read('package.json'));
const netlifyToml = read('netlify.toml');
const envExample = read('.env.example');
const dbClient = read('packages/db/src/client.ts');
const healthRoute = read('apps/web/app/api/health/route.ts');
const qaDocPath = 'docs/qa/step79-admin-real-netlify-flow.md';
const qaDoc = read(qaDocPath);

console.log('--- Step 79 Admin clarity / real Netlify DB boundary QA ---');

assert(adminPage.includes('Какво чака админ действие?'), 'Admin home headline is action-first in BG');
assert(adminPage.includes('Започни от Преглед'), 'Admin home tells the admin to start from Review');
assert(adminPage.includes('не ги виждаш в Registry'), 'Admin home explains uploaded data may not be in Registry yet');
assert(adminPage.includes('Личните owner данни не са публичен Registry'), 'Admin guide separates private owner data from public Registry');
assert(adminPage.includes('<Link href="/review" className="button-primary small">'), 'Admin guide primary action opens Review first');
assert(adminPage.includes("href: '/review'"), 'Admin review card points to the review queue');
assert(adminPage.includes("href: '/admin/members'"), 'Admin members card points to member/owner data');
assert(adminPage.includes("href: '/admin/registry'"), 'Admin registry card points to public Registry control');

const forbiddenAdminTerms = ['Отвори слоя', 'Модерационен слой', 'Слой за идентичности', 'Публичен слой'];
for (const term of forbiddenAdminTerms) {
  assert(!adminPage.includes(term), `Admin home no longer uses confusing architecture label: ${term}`);
}

assert(packageJson.scripts['admin:real-netlify-flow:qa'] === 'node scripts/qa-admin-real-netlify-flow.mjs', 'Package script admin:real-netlify-flow:qa exists');
assert(packageJson.scripts['deploy:netlify:qa'] === 'node scripts/qa-netlify-deploy-readiness.mjs', 'Existing Netlify deploy QA script remains wired');
assert(packageJson.scripts['owner:profile-photo-journey:qa'] === 'node scripts/qa-owner-profile-photo-simple-journey.mjs', 'Step 77 owner profile photo QA script remains wired');
assert(packageJson.scripts['user:clarity-scroll:qa'] === 'node scripts/qa-user-clarity-scroll-reduction.mjs', 'Step 78 clarity QA script remains wired');

const buildBlockMatch = netlifyToml.match(/\[build\.environment\][\s\S]*$/);
const buildEnvironmentBlock = buildBlockMatch ? buildBlockMatch[0] : '';
assert(netlifyToml.includes('command = "pnpm --filter @cane-corso-platform/web build"'), 'Netlify build command builds the web app only');
assert(!netlifyToml.includes('db:seed') && !netlifyToml.includes('db:bootstrap') && !netlifyToml.includes('ecosystem:manual:seed'), 'Netlify config does not run demo seed/bootstrap commands');
assert(!/DATABASE_URL\s*=/.test(buildEnvironmentBlock), 'Netlify config does not hardcode DATABASE_URL');
assert(!/NEON_DATABASE_URL\s*=/.test(buildEnvironmentBlock), 'Netlify config does not hardcode NEON_DATABASE_URL');
assert(!/AUTH_SECRET\s*=/.test(buildEnvironmentBlock), 'Netlify config does not hardcode AUTH_SECRET');

assert(envExample.includes('Do not put real secrets here'), '.env.example clearly marks itself as example-only');
assert(envExample.includes('USER:PASSWORD') && envExample.includes('ep-example'), '.env.example uses placeholder Neon credentials only');
assert(!envExample.includes('SATananov') && !envExample.includes('stana'), '.env.example does not contain personal/GitHub credentials');

assert(dbClient.includes('process.env.DATABASE_URL') && dbClient.includes('process.env.NEON_DATABASE_URL'), 'DB client reads runtime DATABASE_URL/NEON_DATABASE_URL from environment');
assert(dbClient.includes('Missing required environment variable: DATABASE_URL'), 'DB client fails clearly when production database env is missing');
assert(dbClient.includes("explicitProvider === 'neon'"), 'DB client keeps Neon provider support');
assert(dbClient.includes("config.ssl = { rejectUnauthorized: false };"), 'DB client keeps SSL support for Neon-style connections');
assert(healthRoute.includes("database: process.env.DATABASE_URL ? 'configured' : 'missing'"), 'Health endpoint reports configured/missing production database state');

assert(qaDoc.includes('Реалната Neon база остава само в **Netlify Environment Variables**'), 'Step 79 doc states real DB secrets live only in Netlify env vars');
assert(qaDoc.includes('Не се записва `DATABASE_URL` в ZIP'), 'Step 79 doc states DATABASE_URL must not be stored in the ZIP');
assert(qaDoc.includes('Review → Publish → Registry'), 'Step 79 doc records the intended admin workflow');

if (failures > 0) {
  console.error(`\nStep 79 QA failed with ${failures} failure(s).`);
  process.exit(1);
}

console.log('\nStep 79 Admin clarity / real Netlify DB boundary QA complete.');
