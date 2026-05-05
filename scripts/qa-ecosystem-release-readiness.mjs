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
const lifecycleQa = read('scripts/qa-ecosystem-submission-lifecycle.mjs');
const adminQa = read('scripts/qa-admin-moderation-practical.mjs');
const ownerQa = read('scripts/qa-owner-center-workspace.mjs');
const releaseReadinessDoc = read('docs/qa/step14-ecosystem-release-readiness.md');
const releaseChecklist = read('docs/release/ecosystem-release-checklist.md');
const evidenceTemplate = read('docs/evidence/ecosystem-flow-evidence-template.md');
const seededDbChecklist = read('docs/evidence/ecosystem-seeded-db-state-checklist.md');
const seededDbQaDoc = read('docs/qa/step17-ecosystem-seeded-db-state-qa.md');
const seededDbPgFixDoc = read('docs/qa/step17-1-seeded-db-pg-resolution-fix.md');
const releaseLockDoc = read('docs/qa/step18-ecosystem-release-lock.md');
const step19GuardrailDoc = read('docs/qa/step19-post-release-guardrails.md');
const step21DetailPolishDoc = read('docs/qa/step21-public-ecosystem-detail-polish.md');
const step22DetailApiDoc = read('docs/qa/step22-public-ecosystem-detail-api-guardrails.md');
const step23ApiReleaseAlignmentDoc = read('docs/qa/step23-ecosystem-detail-api-release-alignment.md');
const nextBuildPlan = read('docs/release/ecosystem-next-build-plan.md');
const lockedSections = read('docs/architecture/locked-sections-step8.md');

const requiredQaScripts = [
  ['workspace:verify', 'node scripts/verify-workshop-foundation.mjs'],
  ['workspace:syntax', 'node scripts/check-workshop-syntax.mjs'],
  ['owner-center:qa', 'node scripts/qa-owner-center-workspace.mjs'],
  ['ecosystem:qa', 'node scripts/qa-ecosystem-engine.mjs'],
  ['ecosystem:lifecycle:qa', 'node scripts/qa-ecosystem-submission-lifecycle.mjs'],
  ['ecosystem:admin:qa', 'node scripts/qa-admin-moderation-practical.mjs'],
  ['ecosystem:release:qa', 'node scripts/qa-ecosystem-release-readiness.mjs'],
  ['ecosystem:detail:polish:qa', 'node scripts/qa-ecosystem-public-detail-polish.mjs'],
  ['ecosystem:detail:api:qa', 'node scripts/qa-ecosystem-public-detail-api.mjs'],
  ['ecosystem:api-release:qa', 'node scripts/qa-ecosystem-api-release-alignment.mjs'],
  ['ecosystem:manual:db:qa', 'node scripts/qa-ecosystem-seeded-db-state.mjs'],
  ['typecheck', 'turbo typecheck'],
  ['checkpoint:zip', 'powershell -ExecutionPolicy Bypass -File scripts/create-clean-checkpoint.ps1'],
];

for (const [scriptName, command] of requiredQaScripts) {
  expectIncludes(
    packageJson,
    'package.json',
    `"${scriptName}": "${command}"`,
    `Root package exposes ${scriptName}`,
  );
}

const releaseFiles = [
  'docs/qa/step9-checkpoint-hygiene.md',
  'docs/qa/step10-owner-center-workspace.md',
  'docs/qa/step10-1-owner-center-i18n-polish.md',
  'docs/qa/step10-2-ecosystem-submission-form-ux.md',
  'docs/qa/step11-ecosystem-submission-lifecycle-qa.md',
  'docs/qa/step12-admin-moderation-practical-qa.md',
  'docs/qa/step14-ecosystem-release-readiness.md',
  'docs/evidence/ecosystem-flow-evidence-template.md',
  'docs/release/ecosystem-release-checklist.md',
  'docs/qa/step17-ecosystem-seeded-db-state-qa.md',
  'docs/evidence/ecosystem-seeded-db-state-checklist.md',
  'docs/qa/step17-1-seeded-db-pg-resolution-fix.md',
  'docs/qa/step21-public-ecosystem-detail-polish.md',
  'docs/qa/step22-public-ecosystem-detail-api-guardrails.md',
  'docs/qa/step23-ecosystem-detail-api-release-alignment.md',
];

for (const file of releaseFiles) {
  expect(`Release evidence file exists: ${file}`, existsSync(path.join(root, file)), file);
}

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
  expect(`Locked section file still exists: ${file}`, existsSync(path.join(root, file)), file);
}

expectAllIncludes(
  releaseReadinessDoc,
  'docs/qa/step14-ecosystem-release-readiness.md',
  [
    'Step 14 — Ecosystem Flow Evidence + Release Readiness',
    'Status: release-readiness guardrail pass',
    'Step 13 remains manual evidence required',
    'pnpm ecosystem:release:qa',
    'cane-corso-platform_clean_after_step14_ecosystem_release_readiness.zip',
  ],
  'Step 14 QA document records the release-readiness purpose and final checkpoint target',
);

expectAllIncludes(
  releaseChecklist,
  'docs/release/ecosystem-release-checklist.md',
  [
    'Release checklist — Ecosystem flow',
    'Automated QA sequence',
    'Manual browser evidence required',
    'Member creates ecosystem submission',
    'Admin request changes',
    'Admin approve',
    'Admin publish',
    'Public visibility check',
    'Locked sections must remain untouched',
  ],
  'Release checklist contains the full member-admin-public flow',
);

expectAllIncludes(
  seededDbQaDoc,
  'docs/qa/step17-ecosystem-seeded-db-state-qa.md',
  [
    'Step 17 — Ecosystem Seeded DB State QA',
    'pnpm ecosystem:manual:db:qa',
    'Only the published real listing is public-visible from the Step 16 seed set',
  ],
  'Step 17 QA document records seeded DB state checks',
);

expectAllIncludes(
  seededDbChecklist,
  'docs/evidence/ecosystem-seeded-db-state-checklist.md',
  [
    'Ecosystem Seeded DB State Checklist',
    'pnpm ecosystem:manual:db:qa',
    'step16-published-cane-corso-play-field',
    'step16-suggestion-future-cane-corso-event-idea',
  ],
  'Seeded DB checklist captures public/non-public seed expectations',
);


expectAllIncludes(
  seededDbPgFixDoc,
  'docs/qa/step17-1-seeded-db-pg-resolution-fix.md',
  [
    'Step 17.1 — Seeded DB QA pg Resolution Fix',
    "createRequire(path.join(root, 'packages/db/package.json'))",
    "must not import pg from the root script context",
  ],
  'Step 17.1 QA document records the workspace dependency resolution fix',
);

expectAllIncludes(
  releaseLockDoc,
  'docs/qa/step18-ecosystem-release-lock.md',
  [
    'Step 18 — Ecosystem Release Lock',
    'Status: **PASS / LOCK**',
    'Step 13 manual browser evidence: **PASS / LOCK**',
    'Ecosystem release layer: **PASS / LOCK**',
    'cane-corso-platform_clean_after_ecosystem_release_lock.zip',
    'The correct public ecosystem evidence route is `/community`',
    '`/partners` remains valid only as the partner directory sanity check',
  ],
  'Step 18 QA document records the final ecosystem release lock and route clarification',
);

expectAllIncludes(
  step19GuardrailDoc,
  'docs/qa/step19-post-release-guardrails.md',
  [
    'Step 19 — Ecosystem Post-Release Guardrails',
    'Status: **PASS / READY FOR LOCAL VERIFICATION**',
    '`/community` is the correct public ecosystem evidence route',
    '`/partners` is the partner directory sanity check',
    'cane-corso-platform_clean_after_step19_post_release_guardrails.zip',
  ],
  'Step 19 QA document records the post-release guardrail boundary',
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
  'Step 21 QA document records the public detail polish safety boundary',
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
    'Step 20 — Public Ecosystem Detail Page Foundation',
    '/community/[slug]',
    'published-only access',
  ],
  'Next build plan defines the safe post-release direction',
);

expectAllIncludes(
  evidenceTemplate,
  'docs/evidence/ecosystem-flow-evidence-template.md',
  [
    'Ecosystem flow evidence template',
    'Tester',
    'Environment',
    'Automated checks',
    'Manual evidence',
    '/ecosystem',
    '/admin/ecosystem',
    '/community',
    '/partners',
    'PASS / FAIL',
  ],
  'Evidence template captures screenshots and pass/fail evidence for Step 13',
);

expectAllIncludes(
  lifecycleQa,
  'scripts/qa-ecosystem-submission-lifecycle.mjs',
  [
    'Member server actions preserve draft and submit flows with workspace/admin revalidation',
    'Public/member API separates owner workspace, public directory, draft, and submit intents',
    'Admin moderation UI gates review and publish actions by precise lifecycle state',
    'Public directory renders the approved publication result',
  ],
  'Release readiness builds on Step 11 lifecycle QA',
);

expectAllIncludes(
  adminQa,
  'scripts/qa-admin-moderation-practical.mjs',
  [
    'Admin ecosystem page stays server-gated',
    'Server layer gates admin page and API moderation behind administrator permission checks',
    'Admin publish action is limited to approved real listings',
  ],
  'Release readiness builds on Step 12 admin moderation QA',
);

expectAllIncludes(
  ownerQa,
  'scripts/qa-owner-center-workspace.mjs',
  [
    'ecosystem submission form uses premium grouped layout',
    'Bulgarian page copy uses polished owner center wording',
    'old mixed Bulgarian owner-center fragments removed',
  ],
  'Release readiness builds on Step 10 Owner Center QA',
);

expectAllIncludes(
  lockedSections,
  'docs/architecture/locked-sections-step8.md',
  [
    'Registry',
    'Gallery',
    'Certificate',
    'Verify',
    '/review',
    '/admin/partners',
    '/admin/ecosystem',
  ],
  'Locked-section document remains available as the visual change boundary',
);

for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.description}${check.detail ? ` — ${check.detail}` : ''}`);
}

if (failures.length > 0) {
  console.error('\nEcosystem release readiness QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nEcosystem release readiness QA complete. Step 22 API guardrails and Step 23 API release alignment remain safely scoped.');

/* Step 23 markers:
- docs/qa/step23-ecosystem-detail-api-release-alignment.md
- ecosystem:api-release:qa
- Step 23 API release alignment remains safely scoped
*/
