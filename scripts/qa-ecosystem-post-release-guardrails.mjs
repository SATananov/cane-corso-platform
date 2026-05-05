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

const packageJson = read('package.json');
const step18Doc = read('docs/qa/step18-ecosystem-release-lock.md');
const step19Doc = read('docs/qa/step19-post-release-guardrails.md');
const step21DetailPolishDoc = read('docs/qa/step21-public-ecosystem-detail-polish.md');
const step22DetailApiDoc = read('docs/qa/step22-public-ecosystem-detail-api-guardrails.md');
const step23ApiReleaseAlignmentDoc = read('docs/qa/step23-ecosystem-detail-api-release-alignment.md');
const nextBuildPlan = read('docs/release/ecosystem-next-build-plan.md');
const releaseChecklist = read('docs/release/ecosystem-release-checklist.md');
const evidenceTemplate = read('docs/evidence/ecosystem-flow-evidence-template.md');
const releaseReadinessQa = read('scripts/qa-ecosystem-release-readiness.mjs');
const communityPage = read('apps/web/app/(public)/community/page.tsx');
const partnersPage = read('apps/web/app/(public)/partners/page.tsx');
const memberEcosystemPage = read('apps/web/app/(member)/ecosystem/page.tsx');
const adminEcosystemPage = read('apps/web/app/(admin)/admin/ecosystem/page.tsx');
const publicDetailApiRoute = read('apps/web/app/api/ecosystem/[slug]/route.ts');

expectIncludes(
  packageJson,
  'package.json',
  '"ecosystem:postrelease:qa": "node scripts/qa-ecosystem-post-release-guardrails.mjs"',
  'Root package exposes the Step 19 post-release QA command',
);

expectIncludes(
  packageJson,
  'package.json',
  '"ecosystem:detail:api:qa": "node scripts/qa-ecosystem-public-detail-api.mjs"',
  'Root package exposes the Step 22 public detail API QA command',
);

expectIncludes(
  packageJson,
  'package.json',
  '"ecosystem:api-release:qa": "node scripts/qa-ecosystem-api-release-alignment.mjs"',
  'Root package exposes the Step 23 API release alignment QA command',
);

expectAllIncludes(
  step18Doc,
  'docs/qa/step18-ecosystem-release-lock.md',
  [
    'Step 18 — Ecosystem Release Lock',
    'Status: **PASS / LOCK**',
    'Step 13 manual browser evidence: **PASS / LOCK**',
    'The correct public ecosystem evidence route is `/community`',
    '`/partners` remains valid only as the partner directory sanity check',
  ],
  'Step 18 release lock remains the canonical release baseline',
);

expectAllIncludes(
  step19Doc,
  'docs/qa/step19-post-release-guardrails.md',
  [
    'Step 19 — Ecosystem Post-Release Guardrails',
    'Status: **PASS / READY FOR LOCAL VERIFICATION**',
    '`/ecosystem` is the authenticated member owner workspace',
    '`/admin/ecosystem` is the admin moderation workspace',
    '`/community` is the correct public ecosystem evidence route',
    '`/partners` is the partner directory sanity check',
    'cane-corso-platform_clean_after_step19_post_release_guardrails.zip',
  ],
  'Step 19 QA document records the post-release route and lock boundary',
);

expectAllIncludes(
  step21DetailPolishDoc,
  'docs/qa/step21-public-ecosystem-detail-polish.md',
  [
    'Step 21 — Public Ecosystem Detail Polish & Safety Guardrails',
    '/community/[slug]',
    'status = published',
    'submissionChannel != community_suggestion',
    'cane-corso-platform_clean_after_step21_public_ecosystem_detail_polish.zip',
  ],
  'Step 21 QA document records the public detail polish and safety boundary',
);

expectAllIncludes(
  step22DetailApiDoc,
  'docs/qa/step22-public-ecosystem-detail-api-guardrails.md',
  [
    'Step 22 — Public Ecosystem Detail API Guardrails',
    'GET /api/ecosystem/[slug]',
    'status = published',
    'submissionChannel != community_suggestion',
    'cane-corso-platform_clean_after_step22_public_ecosystem_detail_api_guardrails.zip',
  ],
  'Step 22 QA document records the public detail API safety boundary',
);

expectAllIncludes(
  nextBuildPlan,
  'docs/release/ecosystem-next-build-plan.md',
  [
    'Ecosystem Next Build Plan',
    'Do not redesign or refactor locked visual/product surfaces while starting the next module.',
    'Option A — Ecosystem detail pages',
    'Option B — Owner submission editing hardening',
    'Option C — Admin evidence export/checklist helper',
    'Step 20 — Public Ecosystem Detail Page Foundation',
    '/community/[slug]',
    'published-only access',
    '404 for draft, pending review, needs changes, approved-only, and suggestions',
  ],
  'Next build plan defines a safe Step 20 direction without unlocking existing surfaces',
);

expectAllIncludes(
  releaseChecklist,
  'docs/release/ecosystem-release-checklist.md',
  [
    '/community',
    '/partners',
    'partner directory sanity check',
  ],
  'Release checklist keeps the public ecosystem route separate from partner directory sanity check',
);

expectAllIncludes(
  evidenceTemplate,
  'docs/evidence/ecosystem-flow-evidence-template.md',
  [
    '/ecosystem',
    '/admin/ecosystem',
    '/community',
    '/partners',
    'PASS / FAIL',
  ],
  'Evidence template still covers member, admin, public ecosystem, and partner sanity screenshots',
);

expectAllIncludes(
  releaseReadinessQa,
  'scripts/qa-ecosystem-release-readiness.mjs',
  [
    'docs/qa/step18-ecosystem-release-lock.md',
    'docs/qa/step19-post-release-guardrails.md',
    'docs/release/ecosystem-next-build-plan.md',
  ],
  'Release readiness QA is aware of the Step 19 post-release guardrail documents',
);

expectAllIncludes(
  memberEcosystemPage,
  'apps/web/app/(member)/ecosystem/page.tsx',
  [
    "redirect('/access?intent=ecosystem')",
    'OwnerCenterWorkspace',
    'EcosystemOwnerWorkspace',
    "export const dynamic = 'force-dynamic'",
  ],
  'Member ecosystem route remains authenticated and owner-workspace based',
);

expectAllIncludes(
  adminEcosystemPage,
  'apps/web/app/(admin)/admin/ecosystem/page.tsx',
  [
    'EcosystemModerationDashboard',
    'getEcosystemModerationDocument',
    "export const dynamic = 'force-dynamic'",
  ],
  'Admin ecosystem route remains moderation-dashboard based',
);

expectAllIncludes(
  communityPage,
  'apps/web/app/(public)/community/page.tsx',
  [
    'EcosystemDirectory',
    'getPublishedEcosystemDirectoryDocument',
  ],
  'Community route remains the public ecosystem directory surface',
);

expectAllIncludes(
  partnersPage,
  'apps/web/app/(public)/partners/page.tsx',
  [
    'PartnerDirectoryOverview',
    'getPartnerDirectoryDocument',
  ],
  'Partners route remains the partner directory surface',
);

expectAllIncludes(
  publicDetailApiRoute,
  'apps/web/app/api/ecosystem/[slug]/route.ts',
  [
    'getPublishedEcosystemProfileDocument',
    'ECOSYSTEM_PROFILE_NOT_FOUND',
    'jsonOk(document)',
  ],
  'Public ecosystem detail API remains read-only and published-profile based',
);

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

for (const file of lockedFiles) {
  expect(`Locked release surface still exists: ${file}`, existsSync(path.join(root, file)), file);
}

for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.description}${check.detail ? ` — ${check.detail}` : ''}`);
}

if (failures.length > 0) {
  console.error('\nEcosystem post-release guardrail QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nEcosystem post-release guardrail QA complete. Step 22 API guardrails and Step 23 alignment stay safely scoped.');

/* Step 23 markers:
- docs/qa/step23-ecosystem-detail-api-release-alignment.md
- Step 22 API guardrails and Step 23 alignment stay safely scoped
*/
