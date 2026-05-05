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

function expectNotIncludes(source, relativePath, forbidden, description) {
  expect(description, !source.includes(forbidden), `${relativePath} must not include ${forbidden}`);
}

const packageJson = read('package.json');
const adminEcosystemPage = read('apps/web/app/(admin)/admin/ecosystem/page.tsx');
const adminEcosystemActions = read('apps/web/app/(admin)/admin/ecosystem/actions.ts');
const moderationApi = read('apps/web/app/api/ecosystem/moderation/route.ts');
const serverSource = read('apps/web/lib/ecosystem.server.ts');
const repositorySource = read('packages/db/src/repositories/ecosystem.repository.ts');
const moderationDashboard = read('apps/web/components/ecosystem-moderation-dashboard.tsx');
const publicDirectory = read('apps/web/components/ecosystem-directory.tsx');
const ownerWorkspace = read('apps/web/components/ecosystem-owner-workspace.tsx');
const lifecycleQa = read('scripts/qa-ecosystem-submission-lifecycle.mjs');

const lockedPublicFiles = [
  'apps/web/app/(public)/registry/page.tsx',
  'apps/web/app/(public)/registry/[slug]/page.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/certificate/[code]/page.tsx',
  'apps/web/app/verify/page.tsx',
  'apps/web/app/verify/[code]/page.tsx',
  'apps/web/app/(public)/community/page.tsx',
  'apps/web/app/(public)/partners/page.tsx',
  'apps/web/app/(public)/partners/[slug]/page.tsx',
];

for (const file of lockedPublicFiles) {
  expect(`Locked public section file still exists: ${file}`, existsSync(path.join(root, file)), file);
}

expectIncludes(
  packageJson,
  'package.json',
  '"ecosystem:admin:qa": "node scripts/qa-admin-moderation-practical.mjs"',
  'Root script exposes admin moderation practical QA command',
);

expectAllIncludes(
  adminEcosystemPage,
  'apps/web/app/(admin)/admin/ecosystem/page.tsx',
  [
    "export const dynamic = 'force-dynamic'",
    'getEcosystemModerationDocument()',
    '<EcosystemModerationDashboard document={document} locale={locale} />',
    'nothing from the ecosystem becomes visible before admin review',
    'нищо от екосистемата не става видимо преди админ преглед',
  ],
  'Admin ecosystem page stays server-gated, dynamic, and explicit about moderation before publication',
);

expectAllIncludes(
  serverSource,
  'apps/web/lib/ecosystem.server.ts',
  [
    'requireEcosystemAdminSession',
    'getOptionalCookieMemberSession()',
    "redirect('/access')",
    'canManagePartners(session.user.role)',
    "redirect('/my-dogs')",
    'getAdminEcosystemModerationDocumentForApi',
    'requireRequestSessionCookie()',
    'canManagePartners(session.session.user.role)',
    "throw new SessionUnavailableError('Administrator session is required.')",
  ],
  'Server layer gates admin page and API moderation behind administrator permission checks',
);

expectAllIncludes(
  adminEcosystemActions,
  'apps/web/app/(admin)/admin/ecosystem/actions.ts',
  [
    "'use server'",
    "revalidatePath('/ecosystem')",
    "revalidatePath('/community')",
    "revalidatePath('/partners')",
    "revalidatePath('/admin/ecosystem')",
    'requestEcosystemChangesAction',
    "decision: 'needs_changes'",
    'approveEcosystemListingAction',
    "decision: 'approve'",
    'publishEcosystemListingAction',
    'publishEcosystemListing({',
  ],
  'Admin server actions validate listing id, separate review decisions, and revalidate member/public/admin surfaces',
);

expectAllIncludes(
  moderationApi,
  'apps/web/app/api/ecosystem/moderation/route.ts',
  [
    'getAdminEcosystemModerationDocumentForApi()',
    "intent?: 'approve' | 'needs_changes' | 'publish'",
    "body.intent !== 'approve' && body.intent !== 'needs_changes' && body.intent !== 'publish'",
    "body.intent === 'publish'",
    'publishEcosystemListingForApi({ listingId: body.listingId })',
    'reviewEcosystemListingForApi({ listingId: body.listingId, decision: body.intent })',
    "jsonError('SESSION_NOT_AVAILABLE'",
    "jsonError('INVALID_INTENT'",
  ],
  'Moderation API supports safe GET/POST branches and rejects invalid or non-admin requests',
);

expectAllIncludes(
  moderationDashboard,
  'apps/web/components/ecosystem-moderation-dashboard.tsx',
  [
    "const canReview = item.listing.status === 'pending_review'",
    "const canPublish = item.listing.status === 'approved' && !isSuggestion",
    "item.listing.status === 'draft'",
    "item.listing.status === 'needs_changes'",
    "item.listing.status === 'published'",
    'draftReadOnly',
    'needsChangesReadOnly',
    'publishedReadOnly',
    'approvedSuggestionReadOnly',
    'canReview ? (',
    'canPublish ? (',
    'readOnlyReason ?',
    'requestEcosystemChangesAction',
    'approveEcosystemListingAction',
    'publishEcosystemListingAction',
    'internalDescription',
  ],
  'Admin moderation UI exposes actions only for pending review and approved real listings',
);

expectAllIncludes(
  repositorySource,
  'packages/db/src/repositories/ecosystem.repository.ts',
  [
    'async listModerationQueue()',
    'pendingReview: items.filter',
    'needsChanges: items.filter',
    'approved: items.filter',
    'published: items.filter',
    "input.decision === 'approve' ? 'approved' : 'needs_changes'",
    'await db.insert(ecosystemReviews).values',
    "current.submissionChannel === 'community_suggestion'",
    "throw new Error('Community suggestions stay internal until an admin converts them into a real listing.')",
    "current.status !== 'approved' && current.status !== 'published'",
    "throw new Error('Only approved listings can be published.')",
    "status: 'published'",
    'publishedAt: current.publishedAt ?? now',
    "decision: 'publish'",
  ],
  'Repository enforces practical moderation rules and stores review/publish history',
);

expectAllIncludes(
  repositorySource,
  'packages/db/src/repositories/ecosystem.repository.ts',
  [
    "where(and(eq(ecosystemListings.status, 'published'), ne(ecosystemListings.submissionChannel, 'community_suggestion')))",
    "officialPublished: countByChannel(items, 'official_listing')",
    "communityPublished: countByChannel(items, 'community_listing')",
  ],
  'Public directory remains publication-only and excludes internal suggestions',
);

expectAllIncludes(
  publicDirectory,
  'apps/web/components/ecosystem-directory.tsx',
  [
    'document.items.map',
    'document.summary.officialPublished',
    'document.summary.communityPublished',
    'channelLabels[item.submissionChannel]',
  ],
  'Public directory renders only the repository-approved public result',
);

expectAllIncludes(
  ownerWorkspace,
  'apps/web/components/ecosystem-owner-workspace.tsx',
  [
    'statusLabels[item.status]',
    'canEditMemberListing(item.status)',
    'saveEcosystemDraftAction',
    'submitEcosystemListingAction',
  ],
  'Member workspace shows lifecycle status and keeps editable-state controls scoped to safe statuses',
);

expectIncludes(
  lifecycleQa,
  'scripts/qa-ecosystem-submission-lifecycle.mjs',
  'Admin moderation UI gates review and publish actions by precise lifecycle state',
  'Admin practical QA builds on the Step 11 lifecycle guardrail',
);

expectIncludes(
  moderationDashboard,
  'apps/web/components/ecosystem-moderation-dashboard.tsx',
  "const canPublish = item.listing.status === 'approved' && !isSuggestion",
  'Admin publish action is limited to approved real listings',
);

expectNotIncludes(
  moderationDashboard,
  'apps/web/components/ecosystem-moderation-dashboard.tsx',
  "item.listing.status === 'approved' || item.listing.status === 'published'",
  'Published listings must not be treated as publishable again',
);

expectNotIncludes(
  moderationDashboard,
  'apps/web/components/ecosystem-moderation-dashboard.tsx',
  "const canReview = item.listing.status !== 'published'",
  'Draft and needs-changes listings must not expose admin review actions',
);

for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.description}${check.detail ? ` — ${check.detail}` : ''}`);
}

if (failures.length > 0) {
  console.error('\nAdmin moderation practical QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nAdmin moderation practical QA complete.');
