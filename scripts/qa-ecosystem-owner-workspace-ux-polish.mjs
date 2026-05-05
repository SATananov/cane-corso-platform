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
const ownerWorkspace = read('apps/web/components/ecosystem-owner-workspace.tsx');
const globalsCss = read('apps/web/app/globals.css');
const ownerResubmitQa = read('scripts/qa-ecosystem-owner-resubmit-guardrails.mjs');
const step25Doc = read('docs/qa/step25-ecosystem-owner-workspace-ux-safety-polish.md');
const nextBuildPlan = read('docs/release/ecosystem-next-build-plan.md');
const publicDetailApi = read('apps/web/app/api/ecosystem/[slug]/route.ts');
const publicDetailPage = read('apps/web/app/(public)/community/[slug]/page.tsx');
const moderationDashboard = read('apps/web/components/ecosystem-moderation-dashboard.tsx');

const lockedSurfaceFiles = [
  'apps/web/app/(public)/registry/page.tsx',
  'apps/web/app/(public)/registry/[slug]/page.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/certificate/[code]/page.tsx',
  'apps/web/app/verify/page.tsx',
  'apps/web/app/verify/[code]/page.tsx',
  'apps/web/app/(public)/community/page.tsx',
  'apps/web/app/(public)/community/[slug]/page.tsx',
  'apps/web/app/(public)/partners/page.tsx',
  'apps/web/app/(public)/partners/[slug]/page.tsx',
  'apps/web/app/(admin)/review/page.tsx',
  'apps/web/app/(admin)/admin/partners/page.tsx',
  'apps/web/app/(admin)/admin/ecosystem/page.tsx',
];

for (const file of lockedSurfaceFiles) {
  expect(`Locked surface file still exists: ${file}`, existsSync(path.join(root, file)), file);
}

expectIncludes(packageJson, 'package.json', '"ecosystem:owner-workspace:ux:qa": "node scripts/qa-ecosystem-owner-workspace-ux-polish.mjs"', 'Root package exposes the Step 25 owner workspace UX QA command');

expectAllIncludes(
  ownerWorkspace,
  'apps/web/components/ecosystem-owner-workspace.tsx',
  [
    'Owner workspace safety',
    'Безопасност на работното пространство',
    'Sicurezza dello spazio proprietario',
    'workspaceNoticeBody',
    'queueDescription',
    'editableState',
    'lockedState',
    'draftActionHint',
    'needsChangesActionHint',
    'pendingActionHint',
    'approvedActionHint',
    'publishedActionHint',
    'function getOwnerActionHint(copy: EcosystemOwnerCopy, status: EcosystemListingStatus)',
    "status === 'draft'",
    "status === 'needs_changes'",
    "status === 'pending_review'",
    "status === 'approved'",
    'ecosystem-owner-guardrail-card',
    'ecosystem-owner-queue-copy',
    'ecosystem-owner-item__state-note',
    'ecosystem-owner-item__state-note--editable',
    'ecosystem-owner-item__state-note--locked',
  ],
  'Owner workspace contains Step 25 safety copy, localized hints, and status guidance UI',
);

expectAllIncludes(
  ownerWorkspace,
  'apps/web/components/ecosystem-owner-workspace.tsx',
  [
    'function canEditMemberListing(status: EcosystemListingStatus)',
    "return status === 'draft' || status === 'needs_changes';",
    'const editable = canEditMemberListing(item.status);',
    'editable ? (',
    '<EcosystemListingForm copy={copy} locale={locale} item={item} mode="edit" />',
    'ecosystem-owner-item__locked-note',
  ],
  'Owner edit/resubmit boundary remains draft and needs-changes only',
);

expectNotIncludes(ownerWorkspace, 'apps/web/components/ecosystem-owner-workspace.tsx', "status === 'pending_review' || status === 'approved' || status === 'published'", 'Step 25 must not make reviewed or public states editable');

expectAllIncludes(
  globalsCss,
  'apps/web/app/globals.css',
  [
    'Step 25 — Ecosystem owner workspace UX safety polish',
    '.ecosystem-owner-guardrail-card',
    '.ecosystem-owner-queue-copy',
    '.ecosystem-owner-item__state-note',
    '.ecosystem-owner-item__state-note--editable',
    '.ecosystem-owner-item__state-note--locked',
    "[data-theme='heritage'] .ecosystem-owner-guardrail-card",
    "[data-theme='heritage'] .ecosystem-owner-item__state-note",
  ],
  'Global styles include scoped Step 25 owner-workspace-only polish classes',
);

expectAllIncludes(
  step25Doc,
  'docs/qa/step25-ecosystem-owner-workspace-ux-safety-polish.md',
  [
    'Step 25 — Ecosystem Owner Workspace UX Safety Polish',
    'Status: **PASS / READY FOR LOCAL VERIFICATION**',
    'authenticated member `/ecosystem` surface',
    'status-specific action hints',
    'keeps edit/resubmit controls available only for `draft` and `needs_changes`',
    'cane-corso-platform_clean_after_step25_owner_workspace_ux_safety_polish.zip',
  ],
  'Step 25 QA document records scope, locked boundaries, command, and checkpoint target',
);

expectAllIncludes(
  nextBuildPlan,
  'docs/release/ecosystem-next-build-plan.md',
  [
    'Step 25 — Ecosystem Owner Workspace UX Safety Polish',
    'improve member clarity inside `/ecosystem` only',
    'preserve the existing edit boundary where only `draft` and `needs_changes` entries can be changed by the owner',
    'avoid any public visibility, admin moderation, registry, certificate, gallery, verify, partner, or public ecosystem detail changes',
    'pnpm ecosystem:owner-workspace:ux:qa',
  ],
  'Next build plan records Step 25 as a safe owner-workspace UX safety pass',
);

expectAllIncludes(
  ownerResubmitQa,
  'scripts/qa-ecosystem-owner-resubmit-guardrails.mjs',
  [
    'Owner workspace exposes resubmit only for draft and needs-changes entries and locks reviewed/public states',
    'Repository protects owner edit/resubmit lifecycle and clears review/publication fields on resubmit',
    'Public directory and detail reads remain published-only and non-suggestion',
  ],
  'Step 24 owner resubmit guardrail remains available after Step 25 UX polish',
);

expectAllIncludes(publicDetailApi, 'apps/web/app/api/ecosystem/[slug]/route.ts', ['export async function GET', 'getPublishedEcosystemProfileDocument', 'ECOSYSTEM_PROFILE_NOT_FOUND'], 'Step 22 public detail API remains read-only and published-profile based');
expectNotIncludes(publicDetailApi, 'apps/web/app/api/ecosystem/[slug]/route.ts', 'export async function POST', 'Step 25 must not add write actions to the public detail API');
expectAllIncludes(publicDetailPage, 'apps/web/app/(public)/community/[slug]/page.tsx', ['getPublishedEcosystemProfileDocument', 'notFound()', '<EcosystemProfileDetail document={document} locale={locale} />'], 'Public ecosystem detail page remains published-profile based');
expectAllIncludes(moderationDashboard, 'apps/web/components/ecosystem-moderation-dashboard.tsx', ["const canReview = item.listing.status === 'pending_review'", "const canPublish = item.listing.status === 'approved' && !isSuggestion", 'requestEcosystemChangesAction', 'approveEcosystemListingAction', 'publishEcosystemListingAction'], 'Admin moderation controls remain status-gated and separate from owner UX polish');

for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.description}${check.detail ? ` — ${check.detail}` : ''}`);
}

if (failures.length > 0) {
  console.error('\nEcosystem owner workspace UX safety QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nEcosystem owner workspace UX safety QA complete. Step 25 stays scoped to the authenticated owner workspace and preserves locked public/admin surfaces.');
