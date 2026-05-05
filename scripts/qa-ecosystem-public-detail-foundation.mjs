#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const checks = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!existsSync(absolutePath)) {
    failures.push(`Missing file: ${relativePath}`);
    return '';
  }
  return readFileSync(absolutePath, 'utf8');
}

function expect(description, passed, detail = '') {
  checks.push({ description, passed, detail });
  if (!passed) {
    failures.push(`${description}${detail ? ` — ${detail}` : ''}`);
  }
}

function expectIncludes(source, relativePath, expected, description) {
  expect(description, source.includes(expected), `${relativePath} -> ${expected}`);
}

function expectAllIncludes(source, relativePath, expectedValues, description) {
  const missing = expectedValues.filter((value) => !source.includes(value));
  expect(description, missing.length === 0, missing.length ? `${relativePath} missing ${missing.join(', ')}` : relativePath);
}

const packageJson = read('package.json');
const step20Doc = read('docs/qa/step20-public-ecosystem-detail-foundation.md');
const route = read('apps/web/app/(public)/community/[slug]/page.tsx');
const component = read('apps/web/components/ecosystem-profile-detail.tsx');
const directory = read('apps/web/components/ecosystem-directory.tsx');
const server = read('apps/web/lib/ecosystem.server.ts');
const repository = read('packages/db/src/repositories/ecosystem.repository.ts');
const contracts = read('packages/contracts/src/ecosystem/ecosystem.types.ts');
const globals = read('apps/web/app/globals.css');

expectIncludes(
  packageJson,
  'package.json',
  '"ecosystem:detail:qa": "node scripts/qa-ecosystem-public-detail-foundation.mjs"',
  'Root package exposes the Step 20 public detail QA command',
);

expectAllIncludes(
  step20Doc,
  'docs/qa/step20-public-ecosystem-detail-foundation.md',
  [
    'Step 20 — Public Ecosystem Detail Page Foundation',
    '/community/[slug]',
    'status = published',
    'submissionChannel != community_suggestion',
    'cane-corso-platform_clean_after_step20_public_ecosystem_detail_foundation.zip',
  ],
  'Step 20 QA document records the published-only public detail boundary',
);

expectAllIncludes(
  route,
  'apps/web/app/(public)/community/[slug]/page.tsx',
  [
    "export const dynamic = 'force-dynamic'",
    'getPublishedEcosystemProfileDocument',
    'notFound()',
    'EcosystemProfileDetail',
    'visualSrc="/brand/seal/usg-seal-wide.png"',
  ],
  'Public ecosystem detail route is dynamic, published-only, and uses the USG detail component',
);

expectAllIncludes(
  component,
  'apps/web/components/ecosystem-profile-detail.tsx',
  [
    'EcosystemProfileDocument',
    'getEcosystemListingTypeLabels',
    'getEcosystemSubmissionChannelLabels',
    'Back to community',
    'Назад към общността',
    'Torna alla community',
    'listing.websiteUrl',
    'listing.coverageNote',
    'listing.rulesNote',
  ],
  'Public ecosystem detail component renders localized profile, contact, coverage, and rules information',
);

expectAllIncludes(
  directory,
  'apps/web/components/ecosystem-directory.tsx',
  [
    'openDetail',
    'getCommunityProfileHref',
    'encodeURIComponent(slug)',
  ],
  'Public ecosystem directory links published cards to the new encoded detail route',
);

expectAllIncludes(
  server,
  'apps/web/lib/ecosystem.server.ts',
  [
    'getPublishedEcosystemProfileDocument',
    'repository.getPublishedListingBySlug(slug)',
  ],
  'Server helper exposes published ecosystem detail lookup',
);

expectAllIncludes(
  repository,
  'packages/db/src/repositories/ecosystem.repository.ts',
  [
    'getPublishedListingBySlug(slug: string)',
    "eq(ecosystemListings.status, 'published')",
    "ne(ecosystemListings.submissionChannel, 'community_suggestion')",
    'return listing ? { listing: mapListingRow(listing) } : null',
  ],
  'Repository enforces published-only and non-suggestion public detail lookup',
);

expectIncludes(
  contracts,
  'packages/contracts/src/ecosystem/ecosystem.types.ts',
  'export interface EcosystemProfileDocument',
  'Contracts expose the ecosystem public profile document type',
);

expectAllIncludes(
  globals,
  'apps/web/app/globals.css',
  [
    'Ecosystem Step 20: public ecosystem detail page foundation.',
    '.ecosystem-profile-hero',
    '.ecosystem-profile-meta-list',
  ],
  'Step 20 styling is scoped to the ecosystem detail foundation classes',
);

for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.description}${check.detail ? ` — ${check.detail}` : ''}`);
}

if (failures.length) {
  console.error('\nEcosystem public detail foundation QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nEcosystem public detail foundation QA complete. Step 20 is ready for local verification.');
