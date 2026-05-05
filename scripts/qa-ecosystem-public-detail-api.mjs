#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
const failures = [];

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

function expectNotIncludes(source, relativePath, forbidden, description) {
  expect(description, !source.includes(forbidden), `${relativePath} must not include ${forbidden}`);
}

const packageJson = read('package.json');
const step22Doc = read('docs/qa/step22-public-ecosystem-detail-api-guardrails.md');
const apiRoute = read('apps/web/app/api/ecosystem/[slug]/route.ts');
const pageRoute = read('apps/web/app/(public)/community/[slug]/page.tsx');
const server = read('apps/web/lib/ecosystem.server.ts');
const repository = read('packages/db/src/repositories/ecosystem.repository.ts');
const contracts = read('packages/contracts/src/ecosystem/ecosystem.types.ts');

expectIncludes(
  packageJson,
  'package.json',
  '"ecosystem:detail:api:qa": "node scripts/qa-ecosystem-public-detail-api.mjs"',
  'Root package exposes the Step 22 public detail API QA command',
);

expectAllIncludes(
  step22Doc,
  'docs/qa/step22-public-ecosystem-detail-api-guardrails.md',
  [
    'Step 22 — Public Ecosystem Detail API Guardrails',
    'GET /api/ecosystem/[slug]',
    'status = published',
    'submissionChannel != community_suggestion',
    'cane-corso-platform_clean_after_step22_public_ecosystem_detail_api_guardrails.zip',
  ],
  'Step 22 QA document records the API route, safety boundary, and checkpoint target',
);

expectAllIncludes(
  apiRoute,
  'apps/web/app/api/ecosystem/[slug]/route.ts',
  [
    "export const dynamic = 'force-dynamic'",
    'getPublishedEcosystemProfileDocument',
    'jsonOk(document)',
    "jsonError('INVALID_ECOSYSTEM_PROFILE_SLUG'",
    "jsonError(\n        'ECOSYSTEM_PROFILE_NOT_FOUND'",
    "jsonError(\n      'ECOSYSTEM_PROFILE_FETCH_FAILED'",
  ],
  'Public ecosystem detail API returns published profile documents and safe error envelopes',
);

expectNotIncludes(
  apiRoute,
  'apps/web/app/api/ecosystem/[slug]/route.ts',
  'requireRequestSessionCookie',
  'Public ecosystem detail API must not require an authenticated member session',
);

expectNotIncludes(
  apiRoute,
  'apps/web/app/api/ecosystem/[slug]/route.ts',
  'getOwnerEcosystemDocumentForApi',
  'Public ecosystem detail API must not expose owner workspace data',
);

expectNotIncludes(
  apiRoute,
  'apps/web/app/api/ecosystem/[slug]/route.ts',
  'getAdminEcosystemModerationDocumentForApi',
  'Public ecosystem detail API must not expose admin moderation data',
);

expectAllIncludes(
  pageRoute,
  'apps/web/app/(public)/community/[slug]/page.tsx',
  [
    'getPublishedEcosystemProfileDocument',
    'notFound()',
  ],
  'Public detail page and public detail API share the same server-side published lookup',
);

expectAllIncludes(
  server,
  'apps/web/lib/ecosystem.server.ts',
  [
    'getPublishedEcosystemProfileDocument',
    'repository.getPublishedListingBySlug(slug)',
  ],
  'Server layer still exposes the single published ecosystem profile lookup helper',
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
  'Repository still enforces published-only non-suggestion access for the API and page',
);

expectIncludes(
  contracts,
  'packages/contracts/src/ecosystem/ecosystem.types.ts',
  'export interface EcosystemProfileDocument',
  'Contracts still expose the public ecosystem profile document type used by the API',
);

for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.description}${check.detail ? ` — ${check.detail}` : ''}`);
}

if (failures.length > 0) {
  console.error('\nEcosystem public detail API QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nEcosystem public detail API QA complete. Step 22 is ready for local verification.');
