#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const checks = [];

function expectExists(relativePath, description) {
  const ok = existsSync(path.join(root, relativePath));
  checks.push({ description, ok, detail: relativePath });
  if (!ok) failures.push(`${description} missing: ${relativePath}`);
}

function expectFileIncludes(relativePath, expected, description) {
  const absolutePath = path.join(root, relativePath);
  const ok = existsSync(absolutePath) && readFileSync(absolutePath, 'utf8').includes(expected);
  checks.push({ description, ok, detail: `${relativePath} -> ${expected}` });
  if (!ok) failures.push(`${description} missing expected content in ${relativePath}: ${expected}`);
}

expectExists('packages/db/drizzle/0002_ecosystem_listings.sql', 'Ecosystem SQL migration');
expectExists('packages/db/drizzle/0009_partner_service_ecosystem_sync.sql', 'Partner service ecosystem sync migration');
expectExists('packages/db/src/repositories/ecosystem.repository.ts', 'Ecosystem repository');
expectExists('packages/contracts/src/ecosystem/ecosystem.types.ts', 'Ecosystem contracts');
expectExists('apps/web/app/(member)/ecosystem/page.tsx', 'Member ecosystem page');
expectExists('apps/web/app/(public)/partners/page.tsx', 'Public ecosystem directory page');
expectExists('apps/web/app/(admin)/admin/partners/page.tsx', 'Admin ecosystem moderation page');
expectExists('apps/web/app/api/ecosystem/route.ts', 'Public/member ecosystem API route');
expectExists('apps/web/app/api/ecosystem/moderation/route.ts', 'Admin ecosystem moderation API route');
expectExists('apps/web/components/ecosystem-directory.tsx', 'Public ecosystem directory component');
expectExists('apps/web/components/ecosystem-owner-workspace.tsx', 'Member ecosystem workspace component');
expectExists('apps/web/components/ecosystem-moderation-dashboard.tsx', 'Admin ecosystem moderation component');

expectFileIncludes('packages/db/src/repositories/ecosystem.repository.ts', 'async listPublishedDirectory', 'Repository public directory implementation');
expectFileIncludes('packages/db/src/repositories/ecosystem.repository.ts', 'async listModerationQueue', 'Repository moderation queue implementation');
expectFileIncludes('packages/db/src/repositories/ecosystem.repository.ts', 'async submitOwnerListing', 'Repository owner submission implementation');
expectFileIncludes('packages/contracts/src/ecosystem/ecosystem.types.ts', "'adoption_new_home'", 'Ecosystem adoption/new home layer');
expectFileIncludes('packages/contracts/src/ecosystem/ecosystem.types.ts', "'breeding_match'", 'Ecosystem breeding/match layer');
expectFileIncludes('packages/contracts/src/ecosystem/ecosystem.types.ts', "'puppy_listing'", 'Ecosystem puppies layer');
expectFileIncludes('packages/contracts/src/ecosystem/ecosystem.types.ts', "'event'", 'Ecosystem events layer');
expectFileIncludes('apps/web/lib/ecosystem-ui.ts', 'getEcosystemListingStatusLabels', 'Localized ecosystem status labels');
expectFileIncludes('apps/web/next.config.ts', 'outputFileTracingRoot', 'Next.js monorepo root pin');
expectFileIncludes('apps/web/app/api/ecosystem/route.ts', "scope === 'mine'", 'Ecosystem API member scope');
expectFileIncludes('apps/web/app/api/ecosystem/moderation/route.ts', "intent === 'publish'", 'Ecosystem moderation publish branch');
expectFileIncludes('docs/architecture/workshop-alignment.md', 'ecosystem moderation engine foundation', 'Architecture doc checkpoint');
expectFileIncludes('packages/db/src/repositories/partners.repository.ts', 'syncPartnerServiceEcosystemListing', 'Partner approval syncs into ecosystem listings');
expectFileIncludes('packages/db/src/repositories/partners.repository.ts', 'ecosystemListings', 'Partner repository can write ecosystem listings');
expectFileIncludes('packages/db/scripts/seed-demo-member.mjs', 'partner-service-${seededPartner.slug}', 'Demo seed creates partner ecosystem listing');
expectFileIncludes('packages/db/drizzle/0009_partner_service_ecosystem_sync.sql', "'partner-service-' || slug", 'Migration backfills approved partner services into ecosystem listings');
expectFileIncludes('docs/architecture/workshop-alignment.md', 'Partner / Services MVP sync slice', 'Architecture doc partner service sync checkpoint');

for (const check of checks) {
  console.log(`${check.ok ? '✔' : '✘'} ${check.description} — ${check.detail}`);
}

if (failures.length > 0) {
  console.error('\nEcosystem engine QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nEcosystem engine QA passed.');
