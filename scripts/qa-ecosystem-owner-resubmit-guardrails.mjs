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
const memberActions = read('apps/web/app/(member)/ecosystem/actions.ts');
const ownerWorkspace = read('apps/web/components/ecosystem-owner-workspace.tsx');
const ecosystemApi = read('apps/web/app/api/ecosystem/route.ts');
const publicDetailApi = read('apps/web/app/api/ecosystem/[slug]/route.ts');
const serverSource = read('apps/web/lib/ecosystem.server.ts');
const repositorySource = read('packages/db/src/repositories/ecosystem.repository.ts');
const moderationApi = read('apps/web/app/api/ecosystem/moderation/route.ts');
const moderationDashboard = read('apps/web/components/ecosystem-moderation-dashboard.tsx');
const publicDirectory = read('apps/web/components/ecosystem-directory.tsx');
const publicDetailPage = read('apps/web/app/(public)/community/[slug]/page.tsx');
const ecosystemContracts = read('packages/contracts/src/ecosystem/ecosystem.types.ts');
const submissionContracts = read('packages/contracts/src/ecosystem/ecosystem-submission.types.ts');
const step24Doc = read('docs/qa/step24-ecosystem-owner-resubmit-guardrails.md');
const nextBuildPlan = read('docs/release/ecosystem-next-build-plan.md');

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

expectIncludes(
  packageJson,
  'package.json',
  '"ecosystem:owner-resubmit:qa": "node scripts/qa-ecosystem-owner-resubmit-guardrails.mjs"',
  'Root package exposes the Step 24 owner resubmit guardrail QA command',
);

expectAllIncludes(
  ecosystemContracts,
  'packages/contracts/src/ecosystem/ecosystem.types.ts',
  ["'draft'", "'pending_review'", "'needs_changes'", "'approved'", "'published'"],
  'Ecosystem listing contract still contains the full lifecycle status boundary',
);

expectAllIncludes(
  submissionContracts,
  'packages/contracts/src/ecosystem/ecosystem-submission.types.ts',
  ["'official_listing'", "'community_listing'", "'community_suggestion'", 'ECOSYSTEM_SUBMISSION_CHANNELS', 'isPublishableEcosystemChannel'],
  'Ecosystem submission contract still contains the official/community/suggestion channel boundary',
);

expectAllIncludes(
  ownerWorkspace,
  'apps/web/components/ecosystem-owner-workspace.tsx',
  [
    'function canEditMemberListing(status: EcosystemListingStatus)',
    "return status === 'draft' || status === 'needs_changes';",
    'Edit and resubmit this entry',
    'Редактирай и изпрати отново този запис',
    'Modifica e reinvia questa voce',
    'Resubmit for review',
    'Изпрати отново за преглед',
    'Reinvia per revisione',
    'const editable = canEditMemberListing(item.status);',
    'editable ? (',
    '<details className="ecosystem-owner-edit-panel">',
    '<EcosystemListingForm copy={copy} locale={locale} item={item} mode="edit" />',
    'ecosystem-owner-item__locked-note',
    'Locked during review / publication',
  ],
  'Owner workspace exposes resubmit only for draft and needs-changes entries and locks reviewed/public states',
);

expectNotIncludes(
  ownerWorkspace,
  'apps/web/components/ecosystem-owner-workspace.tsx',
  "status === 'pending_review' || status === 'approved' || status === 'published'",
  'Owner workspace must not make pending, approved, or published entries editable',
);

expectAllIncludes(
  memberActions,
  'apps/web/app/(member)/ecosystem/actions.ts',
  [
    'saveEcosystemDraftAction',
    'submitEcosystemListingAction',
    'saveCurrentOwnerEcosystemDraft(parseListingInput(formData))',
    'submitCurrentOwnerEcosystemListing(parseListingInput(formData))',
    "revalidatePath('/ecosystem')",
    "revalidatePath('/community')",
    "revalidatePath('/partners')",
    "revalidatePath('/admin/ecosystem')",
  ],
  'Member actions preserve save/resubmit entry points and revalidate owner/public/admin surfaces after mutation',
);

expectAllIncludes(
  ecosystemApi,
  'apps/web/app/api/ecosystem/route.ts',
  [
    "scope === 'mine'",
    'getOwnerEcosystemDocumentForApi()',
    'getPublishedEcosystemDirectoryDocument()',
    "intent?: 'save_draft' | 'submit_for_review'",
    'saveOwnerEcosystemDraftForApi(body.listing)',
    'submitOwnerEcosystemListingForApi(body.listing)',
    "jsonOk(listing, { status: body.intent === 'submit_for_review' ? 201 : 200 })",
    "jsonError('SESSION_NOT_AVAILABLE'",
    "jsonError('ECOSYSTEM_VALIDATION_FAILED'",
  ],
  'Owner API keeps authenticated owner scope separate from public directory and supports draft/resubmit only',
);

expectAllIncludes(
  serverSource,
  'apps/web/lib/ecosystem.server.ts',
  [
    'requireEcosystemMemberSession',
    'requireRequestSessionCookie',
    'repository.listOwnerWorkspace(session.user.profileId)',
    'repository.saveOwnerDraft(session.user.profileId, input)',
    'repository.submitOwnerListing(session.user.profileId, input)',
    'repository.listPublishedDirectory()',
    'repository.getPublishedListingBySlug(slug)',
    'canManagePartners(session.session.user.role)',
  ],
  'Server layer keeps owner mutations authenticated and public reads published-profile based',
);

expectAllIncludes(
  repositorySource,
  'packages/db/src/repositories/ecosystem.repository.ts',
  [
    "current.status !== 'draft' && current.status !== 'needs_changes'",
    "throw new Error('Only drafts and listings returned for changes can be edited by the owner.')",
    "mode === 'submit' ? 'pending_review' : 'draft'",
    "submittedAt: mode === 'submit' ? now : null",
    "reviewedAt: mode === 'submit' ? null : current.reviewedAt",
    "reviewNote: mode === 'submit' ? null : current.reviewNote",
    "publishedAt: mode === 'submit' ? null : current.publishedAt",
    'where(eq(ecosystemListings.ownerProfileId, ownerProfileId))',
  ],
  'Repository protects owner edit/resubmit lifecycle and clears review/publication fields on resubmit',
);

expectAllIncludes(
  repositorySource,
  'packages/db/src/repositories/ecosystem.repository.ts',
  [
    "where(and(eq(ecosystemListings.status, 'published'), ne(ecosystemListings.submissionChannel, 'community_suggestion')))",
    'async getPublishedListingBySlug(slug: string): Promise<EcosystemProfileDocument | null>',
    "eq(ecosystemListings.status, 'published')",
    "ne(ecosystemListings.submissionChannel, 'community_suggestion')",
  ],
  'Public directory and detail reads remain published-only and non-suggestion',
);

expectAllIncludes(
  publicDetailApi,
  'apps/web/app/api/ecosystem/[slug]/route.ts',
  [
    'export async function GET',
    'getPublishedEcosystemProfileDocument',
    'ECOSYSTEM_PROFILE_NOT_FOUND',
  ],
  'Step 22 public detail API remains read-only and published-profile based',
);

expectNotIncludes(
  publicDetailApi,
  'apps/web/app/api/ecosystem/[slug]/route.ts',
  'export async function POST',
  'Step 22 public detail API must not gain write actions during owner resubmit work',
);

expectAllIncludes(
  publicDirectory,
  'apps/web/components/ecosystem-directory.tsx',
  ['document.items.map', 'document.summary.officialPublished', 'document.summary.communityPublished', 'channelLabels[item.submissionChannel]'],
  'Public community directory remains a rendered result of the published repository document',
);

expectAllIncludes(
  publicDetailPage,
  'apps/web/app/(public)/community/[slug]/page.tsx',
  ['getPublishedEcosystemProfileDocument', 'notFound()', '<EcosystemProfileDetail document={document} locale={locale} />'],
  'Public ecosystem detail page still 404s non-public slugs and uses the published profile document',
);

expectAllIncludes(
  moderationApi,
  'apps/web/app/api/ecosystem/moderation/route.ts',
  [
    "intent?: 'approve' | 'needs_changes' | 'publish'",
    "body.intent !== 'approve' && body.intent !== 'needs_changes' && body.intent !== 'publish'",
    'publishEcosystemListingForApi({ listingId: body.listingId })',
    'reviewEcosystemListingForApi({ listingId: body.listingId, decision: body.intent })',
  ],
  'Admin moderation API remains separate from owner save/resubmit actions',
);

expectAllIncludes(
  moderationDashboard,
  'apps/web/components/ecosystem-moderation-dashboard.tsx',
  [
    "const canReview = item.listing.status === 'pending_review'",
    "const canPublish = item.listing.status === 'approved' && !isSuggestion",
    'requestEcosystemChangesAction',
    'approveEcosystemListingAction',
    'publishEcosystemListingAction',
    'readOnlyReason',
  ],
  'Admin moderation UI remains status-gated and separate from member resubmit controls',
);

expectAllIncludes(
  step24Doc,
  'docs/qa/step24-ecosystem-owner-resubmit-guardrails.md',
  [
    'Step 24 — Ecosystem Owner Submission Resubmit Guardrails',
    'Status: **PASS / READY FOR LOCAL VERIFICATION**',
    'QA-only safety pass',
    'draft` and `needs_changes',
    '`pending_review`, `approved`, and `published`',
    'cane-corso-platform_clean_after_step24_ecosystem_owner_resubmit_guardrails.zip',
  ],
  'Step 24 QA document records scope, locked boundaries, and checkpoint target',
);

expectAllIncludes(
  nextBuildPlan,
  'docs/release/ecosystem-next-build-plan.md',
  [
    'Step 24 — Ecosystem Owner Submission Resubmit Guardrails',
    'owner-side draft / needs-changes resubmit boundary',
    'does not change `/community`, `/community/[slug]`, public API, admin moderation, Registry, Gallery, Certificate, Verify, Partners, or My Cane Corso',
  ],
  'Next build plan records Step 24 as a safe owner lifecycle guardrail',
);

for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.description}${check.detail ? ` — ${check.detail}` : ''}`);
}

if (failures.length > 0) {
  console.error('\nEcosystem owner resubmit guardrail QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nEcosystem owner resubmit guardrail QA complete. Step 24 stays documentation/QA-only and preserves locked public/admin surfaces.');
