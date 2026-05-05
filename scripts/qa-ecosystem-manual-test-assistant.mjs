import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function report(ok, label, detail = '') {
  if (ok) {
    console.log(`PASS ${label}${detail ? ` — ${detail}` : ''}`);
    return;
  }

  failures.push(`${label}${detail ? ` — ${detail}` : ''}`);
  console.error(`FAIL ${label}${detail ? ` — ${detail}` : ''}`);
}

function exists(relativePath, label = relativePath) {
  report(fs.existsSync(path.join(projectRoot, relativePath)), `${label} exists`, relativePath);
}

function includes(relativePath, needle, label) {
  report(read(relativePath).includes(needle), label, `${relativePath} -> ${needle}`);
}

function excludes(relativePath, needle, label) {
  report(!read(relativePath).includes(needle), label, `${relativePath} must not include ${needle}`);
}

exists('packages/db/scripts/seed-ecosystem-manual-flow.mjs', 'Step 16 manual seed script');
exists('docs/qa/step16-ecosystem-manual-test-assistant.md', 'Step 16 QA document');
exists('docs/qa/step16-1-admin-moderation-action-visibility.md', 'Step 16.1 action visibility QA document');
exists('docs/evidence/ecosystem-manual-seeded-flow-guide.md', 'Step 16 seeded evidence guide');
exists('scripts/qa-ecosystem-seeded-db-state.mjs', 'Step 17 seeded DB state QA script');
exists('docs/qa/step17-ecosystem-seeded-db-state-qa.md', 'Step 17 seeded DB state QA document');
exists('docs/evidence/ecosystem-seeded-db-state-checklist.md', 'Step 17 seeded DB state checklist');

includes('package.json', '"ecosystem:manual:seed": "node packages/db/scripts/seed-ecosystem-manual-flow.mjs"', 'Root package exposes manual ecosystem seed command');
includes('package.json', '"ecosystem:manual:qa": "node scripts/qa-ecosystem-manual-test-assistant.mjs"', 'Root package exposes manual ecosystem QA command');
includes('package.json', '"ecosystem:manual:db:qa": "node scripts/qa-ecosystem-seeded-db-state.mjs"', 'Root package exposes seeded DB state QA command');

includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', 'ecosystem.member@demo.cane-corso.local', 'Seed script creates a dedicated member login');
includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', 'ecosystem.admin@demo.cane-corso.local', 'Seed script creates a dedicated admin login');
includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', 'DemoMember123!', 'Seed script documents the member test password');
includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', 'DemoAdmin123!', 'Seed script documents the admin test password');
includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', "role: 'admin'", 'Seed script creates an administrator-capable profile');
includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', "'draft'", 'Seed script prepares a draft state');
includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', "'pending_review'", 'Seed script prepares a pending review state');
includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', "'needs_changes'", 'Seed script prepares a needs-changes state');
includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', "'approved'", 'Seed script prepares an approved state');
includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', "'published'", 'Seed script prepares a published public state');
includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', "'community_suggestion'", 'Seed script prepares an internal-only community suggestion state');
includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', 'ON CONFLICT (id) DO UPDATE', 'Seed script is idempotent for repeated local runs');
includes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', 'auth_local_credentials', 'Seed script creates local-auth credentials for browser login');

includes('docs/evidence/ecosystem-manual-seeded-flow-guide.md', 'http://localhost:3000/ecosystem', 'Evidence guide points to the member workspace');
includes('docs/evidence/ecosystem-manual-seeded-flow-guide.md', 'http://localhost:3000/admin/ecosystem', 'Evidence guide points to admin moderation');
includes('docs/evidence/ecosystem-manual-seeded-flow-guide.md', 'http://localhost:3000/partners', 'Evidence guide points to public visibility check');
includes('docs/evidence/ecosystem-seeded-db-state-checklist.md', 'step16-published-cane-corso-play-field', 'Seeded DB checklist identifies the only public Step 16 seed');
includes('docs/evidence/ecosystem-seeded-db-state-checklist.md', 'step16-suggestion-future-cane-corso-event-idea', 'Seeded DB checklist identifies internal suggestion as non-public');
includes('docs/qa/step16-ecosystem-manual-test-assistant.md', 'Step 16 must remain a seed/test-assistant pass only', 'Step 16 document records the locked-section boundary');

includes('apps/web/components/ecosystem-moderation-dashboard.tsx', "const canReview = item.listing.status === 'pending_review'", 'Admin moderation only reviews pending records');
includes('apps/web/components/ecosystem-moderation-dashboard.tsx', "const canPublish = item.listing.status === 'approved' && !isSuggestion", 'Admin moderation only publishes approved real listings');
includes('apps/web/components/ecosystem-moderation-dashboard.tsx', 'draftReadOnly', 'Admin moderation shows read-only reason for drafts');
includes('apps/web/components/ecosystem-moderation-dashboard.tsx', 'publishedReadOnly', 'Admin moderation shows read-only reason for published records');
excludes('apps/web/components/ecosystem-moderation-dashboard.tsx', "item.listing.status === 'approved' || item.listing.status === 'published'", 'Admin moderation must not offer publish action for already published records');

const lockedFiles = [
  'apps/web/app/(public)/registry/page.tsx',
  'apps/web/app/(public)/registry/[slug]/page.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/certificate/[code]/page.tsx',
  'apps/web/app/verify/page.tsx',
  'apps/web/app/verify/[code]/page.tsx',
  'apps/web/app/(public)/community/page.tsx',
  'apps/web/app/(public)/partners/page.tsx',
  'apps/web/app/(public)/partners/[slug]/page.tsx',
  'apps/web/app/(admin)/review/page.tsx',
  'apps/web/app/(admin)/admin/partners/page.tsx',
  'apps/web/app/(admin)/admin/ecosystem/page.tsx',
];

for (const lockedFile of lockedFiles) {
  exists(lockedFile, `Locked section file still exists: ${lockedFile}`);
}

excludes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', 'DELETE FROM ecosystem_listings', 'Seed script must not wipe ecosystem listings');
excludes('packages/db/scripts/seed-ecosystem-manual-flow.mjs', 'TRUNCATE', 'Seed script must not truncate local data');

includes('scripts/qa-ecosystem-seeded-db-state.mjs', 'Only the Step 16 published real listing is public-visible from the seed set', 'Seeded DB QA verifies public visibility boundary');
includes('scripts/qa-ecosystem-seeded-db-state.mjs', 'No draft/pending/needs-changes/approved/suggestion seed is accidentally public', 'Seeded DB QA blocks unsafe seed publication');
includes('scripts/qa-ecosystem-seeded-db-state.mjs', "createRequire(path.join(root, 'packages/db/package.json'))", 'Seeded DB QA resolves pg from the DB workspace package');
excludes('scripts/qa-ecosystem-seeded-db-state.mjs', "import pg from 'pg'", 'Seeded DB QA must not require pg as a root dependency');
includes('scripts/qa-ecosystem-seeded-db-state.mjs', 'Review history includes request changes, approve, and publish decisions', 'Seeded DB QA verifies review history');

if (failures.length > 0) {
  console.error('\nEcosystem manual test assistant QA failed.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nEcosystem manual test assistant QA complete.');
