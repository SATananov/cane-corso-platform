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
const memberActions = read('apps/web/app/(member)/ecosystem/actions.ts');
const ecosystemApi = read('apps/web/app/api/ecosystem/route.ts');
const moderationApi = read('apps/web/app/api/ecosystem/moderation/route.ts');
const serverSource = read('apps/web/lib/ecosystem.server.ts');
const repositorySource = read('packages/db/src/repositories/ecosystem.repository.ts');
const ownerWorkspace = read('apps/web/components/ecosystem-owner-workspace.tsx');
const moderationDashboard = read('apps/web/components/ecosystem-moderation-dashboard.tsx');
const publicDirectory = read('apps/web/components/ecosystem-directory.tsx');
const contracts = read('packages/contracts/src/ecosystem/ecosystem.types.ts');

const lockedFiles = [
  'apps/web/app/(public)/registry/page.tsx',
  'apps/web/app/(public)/registry/[slug]/page.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/certificate/[code]/page.tsx',
  'apps/web/app/verify/page.tsx',
  'apps/web/app/verify/[code]/page.tsx',
  'apps/web/app/(admin)/review/page.tsx',
  'apps/web/app/(admin)/admin/partners/page.tsx',
  'apps/web/app/(admin)/admin/ecosystem/page.tsx',
];

for (const file of lockedFiles) {
  expect(`Locked section file still exists: ${file}`, existsSync(path.join(root, file)), file);
}

expectIncludes(packageJson, 'package.json', '"ecosystem:lifecycle:qa": "node scripts/qa-ecosystem-submission-lifecycle.mjs"', 'Root script exposes lifecycle QA command');

expectAllIncludes(contracts, 'packages/contracts/src/ecosystem/ecosystem.types.ts', [
  "'draft'",
  "'pending_review'",
  "'needs_changes'",
  "'approved'",
  "'published'",
], 'Ecosystem status contract contains the full member-to-public lifecycle');

expectAllIncludes(memberActions, 'apps/web/app/(member)/ecosystem/actions.ts', [
  'saveEcosystemDraftAction',
  'submitEcosystemListingAction',
  'saveCurrentOwnerEcosystemDraft(parseListingInput(formData))',
  'submitCurrentOwnerEcosystemListing(parseListingInput(formData))',
  "revalidatePath('/ecosystem')",
  "revalidatePath('/admin/partners')",
], 'Member server actions preserve draft and submit flows with workspace/admin revalidation');

expectAllIncludes(ecosystemApi, 'apps/web/app/api/ecosystem/route.ts', [
  "scope === 'mine'",
  'getOwnerEcosystemDocumentForApi()',
  'getPublishedEcosystemDirectoryDocument()',
  "'save_draft' | 'submit_for_review'",
  'saveOwnerEcosystemDraftForApi(body.listing)',
  'submitOwnerEcosystemListingForApi(body.listing)',
  "jsonOk(listing, { status: body.intent === 'submit_for_review' ? 201 : 200 })",
], 'Public/member API separates owner workspace, public directory, draft, and submit intents');

expectAllIncludes(serverSource, 'apps/web/lib/ecosystem.server.ts', [
  'requireEcosystemMemberSession',
  'requireRequestSessionCookie',
  'repository.listOwnerWorkspace(session.user.profileId)',
  'repository.saveOwnerDraft(session.user.profileId, input)',
  'repository.submitOwnerListing(session.user.profileId, input)',
  'repository.listPublishedDirectory()',
  'canManagePartners(session.session.user.role)',
  'repository.reviewListing(session.session.user.profileId, input)',
  'repository.publishListing(session.session.user.profileId, input.listingId)',
], 'Server layer enforces member ownership and admin-only moderation/publish operations');

expectAllIncludes(repositorySource, 'packages/db/src/repositories/ecosystem.repository.ts', [
  "current.status !== 'draft' && current.status !== 'needs_changes'",
  "mode === 'submit' ? 'pending_review' : 'draft'",
  "submittedAt: mode === 'submit' ? now : null",
  "reviewedAt: mode === 'submit' ? null : current.reviewedAt",
  "reviewNote: mode === 'submit' ? null : current.reviewNote",
  "publishedAt: mode === 'submit' ? null : current.publishedAt",
  "where(eq(ecosystemListings.ownerProfileId, ownerProfileId))",
], 'Repository protects owner editability and draft-to-pending transitions');

expectAllIncludes(repositorySource, 'packages/db/src/repositories/ecosystem.repository.ts', [
  "where(and(eq(ecosystemListings.status, 'published'), ne(ecosystemListings.submissionChannel, 'community_suggestion')))",
  "officialPublished: countByChannel(items, 'official_listing')",
  "communityPublished: countByChannel(items, 'community_listing')",
], 'Public directory only exposes published non-suggestion listings');

expectAllIncludes(repositorySource, 'packages/db/src/repositories/ecosystem.repository.ts', [
  "input.decision === 'approve' ? 'approved' : 'needs_changes'",
  'await db.insert(ecosystemReviews).values',
  "current.submissionChannel === 'community_suggestion'",
  "throw new Error('Community suggestions stay internal until an admin converts them into a real listing.')",
  "current.status !== 'approved' && current.status !== 'published'",
  "status: 'published'",
  'publishedAt: current.publishedAt ?? now',
  "decision: 'publish'",
], 'Admin lifecycle stores review history, blocks suggestions from direct publication, and publishes only approved listings');

expectAllIncludes(moderationApi, 'apps/web/app/api/ecosystem/moderation/route.ts', [
  "intent?: 'approve' | 'needs_changes' | 'publish'",
  "body.intent !== 'approve' && body.intent !== 'needs_changes' && body.intent !== 'publish'",
  "body.intent === 'publish'",
  'publishEcosystemListingForApi({ listingId: body.listingId })',
  'reviewEcosystemListingForApi({ listingId: body.listingId, decision: body.intent })',
], 'Moderation API supports approve, request changes, and publish branches');

expectAllIncludes(ownerWorkspace, 'apps/web/components/ecosystem-owner-workspace.tsx', [
  'document.summary.total',
  'document.summary.officialListings',
  'document.summary.communityListings',
  'document.summary.suggestions',
  'document.summary.published',
  'document.items.map',
  'canEditMemberListing(item.status)',
  'saveEcosystemDraftAction',
  'submitEcosystemListingAction',
  'statusLabels[item.status]',
], 'Member workspace displays lifecycle statuses and only reopens editable states');

expectAllIncludes(moderationDashboard, 'apps/web/components/ecosystem-moderation-dashboard.tsx', [
  "const canReview = item.listing.status === 'pending_review'",
  "const canPublish = item.listing.status === 'approved' && !isSuggestion",
  'approveEcosystemListingAction',
  'requestEcosystemChangesAction',
  'publishEcosystemListingAction',
  'readOnlyReason',
], 'Admin moderation UI gates review and publish actions by precise lifecycle state');

expectAllIncludes(publicDirectory, 'apps/web/components/ecosystem-directory.tsx', [
  'document.items.map',
  'document.summary.officialPublished',
  'document.summary.communityPublished',
  'channelLabels[item.submissionChannel]',
], 'Public directory renders the approved publication result and separates official/community visibility');

expectNotIncludes(ownerWorkspace, 'apps/web/components/ecosystem-owner-workspace.tsx', 'review flow', 'Owner workspace has no old review-flow wording');
expectNotIncludes(repositorySource, 'packages/db/src/repositories/ecosystem.repository.ts', "status: 'published',\n      submittedAt: mode === 'submit'", 'Repository does not publish directly from member submit');

for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.description}${check.detail ? ` — ${check.detail}` : ''}`);
}

if (failures.length > 0) {
  console.error('\nEcosystem submission lifecycle QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nEcosystem submission lifecycle QA complete.');
