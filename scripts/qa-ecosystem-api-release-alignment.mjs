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
const apiRoute = read('apps/web/app/api/ecosystem/[slug]/route.ts');
const apiQa = read('scripts/qa-ecosystem-public-detail-api.mjs');
const releaseReadinessQa = read('scripts/qa-ecosystem-release-readiness.mjs');
const postReleaseQa = read('scripts/qa-ecosystem-post-release-guardrails.mjs');
const step22Doc = read('docs/qa/step22-public-ecosystem-detail-api-guardrails.md');
const step23Doc = read('docs/qa/step23-ecosystem-detail-api-release-alignment.md');
const nextBuildPlan = read('docs/release/ecosystem-next-build-plan.md');

expectIncludes(
  packageJson,
  'package.json',
  '"ecosystem:api-release:qa": "node scripts/qa-ecosystem-api-release-alignment.mjs"',
  'Root package exposes the Step 23 API release alignment QA command',
);

expectIncludes(
  packageJson,
  'package.json',
  '"ecosystem:detail:api:qa": "node scripts/qa-ecosystem-public-detail-api.mjs"',
  'Root package keeps the Step 22 public detail API QA command',
);

expectAllIncludes(
  apiRoute,
  'apps/web/app/api/ecosystem/[slug]/route.ts',
  ['GET', 'getPublishedEcosystemProfileDocument(', 'ECOSYSTEM_PROFILE_NOT_FOUND'],
  'Step 22 public detail API route remains present and published-profile based',
);

expectNotIncludes(
  apiRoute,
  'apps/web/app/api/ecosystem/[slug]/route.ts',
  'export async function POST',
  'Public ecosystem detail API remains read-only',
);

expectAllIncludes(
  apiQa,
  'scripts/qa-ecosystem-public-detail-api.mjs',
  [
    'Step 22 public detail API QA command',
    'must not require an authenticated member session',
    'must not expose owner workspace data',
    'must not expose admin moderation data',
  ],
  'Step 22 API QA continues to guard privacy and public visibility',
);

expectAllIncludes(
  releaseReadinessQa,
  'scripts/qa-ecosystem-release-readiness.mjs',
  [
    'docs/qa/step22-public-ecosystem-detail-api-guardrails.md',
    'docs/qa/step23-ecosystem-detail-api-release-alignment.md',
    'ecosystem:api-release:qa',
    'Step 23 API release alignment remains safely scoped',
  ],
  'Release readiness QA is aligned with Step 22 and Step 23',
);

expectAllIncludes(
  postReleaseQa,
  'scripts/qa-ecosystem-post-release-guardrails.mjs',
  [
    'docs/qa/step22-public-ecosystem-detail-api-guardrails.md',
    'docs/qa/step23-ecosystem-detail-api-release-alignment.md',
    'Public ecosystem detail API remains read-only and published-profile based',
    'Step 22 API guardrails and Step 23 alignment stay safely scoped',
  ],
  'Post-release guardrail QA is aligned with Step 22 and Step 23',
);

expectAllIncludes(
  step22Doc,
  'docs/qa/step22-public-ecosystem-detail-api-guardrails.md',
  ['Step 22 — Public Ecosystem Detail API Guardrails', 'GET /api/ecosystem/[slug]', 'read-only'],
  'Step 22 API document remains available',
);

expectAllIncludes(
  step23Doc,
  'docs/qa/step23-ecosystem-detail-api-release-alignment.md',
  [
    'Step 23 — Ecosystem Detail API Release Alignment',
    'Status: **PASS / READY FOR LOCAL VERIFICATION**',
    'Step 22 API route is part of release readiness',
    'cane-corso-platform_clean_after_step23_ecosystem_detail_api_release_alignment.zip',
  ],
  'Step 23 document records alignment scope and checkpoint target',
);

expectAllIncludes(
  nextBuildPlan,
  'docs/release/ecosystem-next-build-plan.md',
  ['Step 22 — Public Ecosystem Detail API Guardrails', 'Step 23 — Ecosystem Detail API Release Alignment'],
  'Next build plan records the Step 22 and Step 23 API direction',
);

for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.description}${check.detail ? ` — ${check.detail}` : ''}`);
}

if (failures.length > 0) {
  console.error('\nEcosystem API release alignment QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nEcosystem API release alignment QA complete. Step 22 API guardrails and Step 23 alignment remain safely scoped.');
