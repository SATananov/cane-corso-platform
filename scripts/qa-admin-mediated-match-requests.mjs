#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
let failed = false;
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { failed = true; console.error(`FAIL ${message}`); }
function assert(condition, message) { condition ? pass(message) : fail(message); }

const contracts = read('packages/contracts/src/ecosystem/ecosystem.types.ts');
const schema = read('packages/db/src/schema/ecosystem.ts');
const migration = read('packages/db/drizzle/0012_ecosystem_match_requests.sql');
const repository = read('packages/db/src/repositories/ecosystem.repository.ts');
const server = read('apps/web/lib/ecosystem.server.ts');
const publicActions = read('apps/web/app/(public)/community/[slug]/actions.ts');
const detail = read('apps/web/components/ecosystem-profile-detail.tsx');
const adminActions = read('apps/web/app/(admin)/admin/ecosystem/actions.ts');
const adminDashboard = read('apps/web/components/ecosystem-moderation-dashboard.tsx');
const moderationApi = read('apps/web/app/api/ecosystem/moderation/route.ts');
const css = read('apps/web/app/globals.css');
const pkg = JSON.parse(read('package.json'));

assert(contracts.includes('EcosystemMatchRequestStatus'), 'Contracts define match request status');
assert(contracts.includes('SubmitEcosystemMatchRequestInput'), 'Contracts define member match request input');
assert(contracts.includes('ReviewEcosystemMatchRequestInput'), 'Contracts define admin match review input');
assert(contracts.includes('matchRequests: EcosystemModerationMatchRequest[]'), 'Moderation document exposes match requests');
assert(schema.includes("ecosystemMatchRequests = pgTable('ecosystem_match_requests'"), 'DB schema defines ecosystem_match_requests table');
assert(migration.includes('CREATE TABLE IF NOT EXISTS ecosystem_match_requests'), 'Step 91 migration creates match requests table');
assert(migration.includes('requester_profile_id'), 'Migration stores requester profile');
assert(repository.includes('submitMatchRequest'), 'Repository supports member match request submission');
assert(repository.includes('reviewMatchRequest'), 'Repository supports admin match review');
assert(repository.includes("listing.ownerProfileId === requesterProfileId"), 'Repository prevents owners from matching their own listings');
assert(repository.includes("listing.status !== 'published'"), 'Repository only allows requests for published listings');
assert(repository.includes('ADMIN_MEDIATED_TYPES'), 'Repository restricts match requests to mediated sensitive listing types');
assert(server.includes('submitCurrentMemberEcosystemMatchRequest'), 'Web server layer exposes member match request action');
assert(server.includes('reviewEcosystemMatchRequest'), 'Web server layer exposes admin match review action');
assert(publicActions.includes('submitEcosystemMatchRequestAction'), 'Public detail route has match request server action');
assert(detail.includes('ecosystem-match-request-form'), 'Public detail renders match request form');
assert(detail.includes('Телефон само за админ') && detail.includes('Имейл само за админ'), 'Bulgarian detail copy protects contact fields');
assert(adminActions.includes('approveEcosystemMatchRequestAction'), 'Admin can allow connection');
assert(adminActions.includes('declineEcosystemMatchRequestAction'), 'Admin can decline connection');
assert(adminActions.includes('markEcosystemMatchConnectedAction'), 'Admin can mark connection as completed');
assert(adminDashboard.includes('Заявки за свързване през админ'), 'Admin dashboard includes Bulgarian match queue');
assert(adminDashboard.includes('document.matchRequests.map'), 'Admin dashboard renders match requests');
assert(moderationApi.includes('approve_match') && moderationApi.includes('reviewEcosystemMatchRequestForApi'), 'Moderation API supports match request decisions');
assert(css.includes('Step 91 — Admin-mediated match requests foundation'), 'Step 91 CSS block exists');
assert(pkg.scripts['community:match-requests:qa'] === 'node scripts/qa-admin-mediated-match-requests.mjs', 'Package script community:match-requests:qa exists');

const lockedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/health/db/route.ts',
];
for (const file of lockedFiles) assert(fs.existsSync(path.join(root, file)), `Locked authority file remains present: ${file}`);

if (failed) { console.error('\nAdmin-mediated match requests QA failed.'); process.exit(1); }
console.log('\nAdmin-mediated match requests QA complete.');
