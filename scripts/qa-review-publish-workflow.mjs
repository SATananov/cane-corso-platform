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

async function expectHttpOk(baseUrl, route, description) {
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}${route}`);
    const ok = response.ok;
    checks.push({ description, ok, detail: `${route} -> ${response.status}` });
    if (!ok) {
      failures.push(`${description} returned ${response.status} for ${route}`);
    }
  } catch (error) {
    checks.push({ description, ok: false, detail: `${route} -> request failed` });
    failures.push(`${description} request failed for ${route}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

expectExists('apps/web/app/(admin)/review/actions.ts', 'Admin review server actions');
expectExists('apps/web/app/(public)/registry/page.tsx', 'Public registry overview page');
expectExists('apps/web/app/(public)/registry/[slug]/page.tsx', 'Public registry profile page');
expectExists('apps/web/app/api/registry/route.ts', 'Public registry API route');
expectExists('apps/web/app/api/registry/[slug]/route.ts', 'Public registry detail API route');
expectExists('apps/web/app/api/verify/[code]/route.ts', 'Verify API route');
expectExists('apps/web/app/verify/[code]/page.tsx', 'Verify page');
expectExists('apps/mobile/App.tsx', 'Expo QA workspace');
expectExists('apps/mobile/src/api.ts', 'Expo shared API client');
expectExists('apps/mobile/src/react-native-compat.d.ts', 'Expo compatibility type shim');
expectExists('packages/db/src/repositories/my-dogs.repository.ts', 'Repository publish/registry implementation');

expectFileIncludes('apps/web/app/(admin)/review/actions.ts', 'revalidatePath(`/registry/${result.publicSlug}`)', 'Publish action revalidates public profile');
expectFileIncludes('apps/web/app/(admin)/review/actions.ts', 'revalidatePath(`/verify/${result.verificationSlug}`)', 'Publish action revalidates verify profile');
expectFileIncludes('packages/db/src/repositories/my-dogs.repository.ts', 'async publishSubmission', 'Repository publish workflow');
expectFileIncludes('packages/db/src/repositories/my-dogs.repository.ts', 'async listPublishedRegistryEntries', 'Repository public registry list');
expectFileIncludes('packages/db/src/repositories/my-dogs.repository.ts', 'async getPublishedRegistryEntryBySlug', 'Repository public registry detail');
expectFileIncludes('packages/db/src/repositories/my-dogs.repository.ts', 'async getVerificationDocumentByCode', 'Repository verification lookup');
expectFileIncludes('apps/mobile/App.tsx', 'Resolve verify record', 'Mobile verify lookup control');
expectFileIncludes('apps/mobile/App.tsx', 'Pull to refresh the mobile workspace', 'Mobile end-to-end QA copy');
expectFileIncludes('apps/mobile/src/api.ts', 'fetchOptionalVerificationDocument', 'Mobile optional verify lookup helper');

const qaBaseUrl = process.env.QA_BASE_URL;
if (qaBaseUrl) {
  await expectHttpOk(qaBaseUrl, '/api/health', 'Live health endpoint');
  await expectHttpOk(qaBaseUrl, '/api/registry', 'Live registry endpoint');
}

for (const check of checks) {
  console.log(`${check.ok ? '✔' : '✘'} ${check.description} — ${check.detail}`);
}

if (failures.length > 0) {
  console.error('\nWorkflow QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nReview / publish / registry / verify workflow QA passed.');
