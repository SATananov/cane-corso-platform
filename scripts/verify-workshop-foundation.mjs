
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const failures = [];
const checks = [];

function expectExists(relativePath, description) {
  const ok = existsSync(path.join(root, relativePath));
  checks.push({ description, ok, detail: relativePath });
  if (!ok) failures.push(`${description} missing: ${relativePath}`);
}

function isGitTracked(relativePath) {
  try {
    const output = execSync('git ls-files --error-unmatch -- ' + JSON.stringify(relativePath), {
      cwd: root,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();

    return output.length > 0;
  } catch {
    return false;
  }
}

function expectMissing(relativePath, description) {
  const ok = !existsSync(path.join(root, relativePath));
  checks.push({ description, ok, detail: `${relativePath} removed from workspace` });
  if (!ok) failures.push(`${description} should be removed from the working tree: ${relativePath}`);
}

function expectNotTracked(relativePath, description) {
  const ok = !isGitTracked(relativePath);
  checks.push({ description, ok, detail: `${relativePath} not tracked by git` });
  if (!ok) failures.push(`${description} should not be committed to git: ${relativePath}`);
}

function expectFileIncludes(relativePath, expected, description) {
  const absolutePath = path.join(root, relativePath);
  const ok = existsSync(absolutePath) && readFileSync(absolutePath, 'utf8').includes(expected);
  checks.push({ description, ok, detail: `${relativePath} -> ${expected}` });
  if (!ok) failures.push(`${description} missing expected content in ${relativePath}: ${expected}`);
}

expectExists('tsconfig.base.json', 'Shared workspace TypeScript config');
expectExists('scripts/workspace-cleanup.mjs', 'Workspace cleanup script');
expectExists('scripts/verify-workshop-foundation.mjs', 'Workshop verification script');
expectExists('scripts/check-workshop-syntax.mjs', 'Workspace syntax check script');
expectExists('scripts/workshop-doctor.mjs', 'Workspace doctor script');
expectMissing('apps/web/apps', 'Nested duplicate web app directory');
expectMissing('apps/web/packages', 'Nested duplicate package directory');
expectMissing('apps/web/scripts', 'Nested duplicate script directory');
expectNotTracked('apps/web/.next', 'Committed Next build output');
expectNotTracked('apps/web/node_modules', 'Committed app node_modules');
expectNotTracked('apps/mobile/.expo', 'Committed Expo local state');
expectNotTracked('node_modules', 'Committed root node_modules');
expectNotTracked('packages/auth/node_modules', 'Committed package auth node_modules');
expectNotTracked('packages/config/node_modules', 'Committed package config node_modules');
expectNotTracked('packages/contracts/node_modules', 'Committed package contracts node_modules');
expectNotTracked('packages/db/node_modules', 'Committed package db node_modules');
expectNotTracked('packages/storage/node_modules', 'Committed package storage node_modules');
expectNotTracked('packages/ui/node_modules', 'Committed package ui node_modules');
expectExists('apps/web/app/api/health/route.ts', 'Health API route');
expectExists('apps/web/app/api/session/route.ts', 'Session API route');
expectExists('apps/web/app/api/session/bootstrap/route.ts', 'Bootstrap session API route');
expectExists('apps/web/app/api/auth/provider/route.ts', 'Auth provider API route');
expectExists('apps/web/app/api/dogs/route.ts', 'Dogs collection API route');
expectExists('apps/web/app/api/dogs/[dogId]/route.ts', 'Single dog API route');
expectExists('apps/web/app/api/dogs/[dogId]/media/route.ts', 'Dog media collection API route');
expectExists('apps/web/app/api/dogs/[dogId]/media/[mediaId]/route.ts', 'Dog media item API route');
expectExists('apps/web/app/api/dogs/[dogId]/media/upload/route.ts', 'Dog media upload API route');
expectExists('apps/mobile/package.json', 'Expo mobile manifest');
expectExists('apps/mobile/App.tsx', 'Expo mobile app entry');
expectExists('packages/ui/package.json', 'Shared UI package manifest');
expectExists('packages/storage/package.json', 'Shared storage package manifest');
expectExists('apps/web/tailwind.config.ts', 'Tailwind config');
expectExists('apps/web/postcss.config.mjs', 'PostCSS config');
expectFileIncludes('package.json', 'workspace:cleanup', 'Root cleanup script registration');
expectFileIncludes('package.json', 'workspace:verify', 'Root verification script registration');
expectFileIncludes('package.json', 'workspace:syntax', 'Root syntax script registration');
expectFileIncludes('package.json', 'workspace:doctor', 'Root doctor script registration');
expectFileIncludes('apps/web/package.json', '@cane-corso-platform/auth', 'Web app auth dependency linkage');
expectFileIncludes('apps/web/package.json', 'tailwindcss', 'Web app Tailwind dependency setup');
expectFileIncludes('docs/architecture/workshop-alignment.md', 'API-first', 'Architecture roadmap text');
expectFileIncludes('apps/web/components/my-dog-form-workspace.tsx', 'mutateDogProfile', 'My Dogs workspace API mutation wiring');
expectFileIncludes('apps/web/app/layout.tsx', 'SessionBootstrapSync', 'Automatic bootstrap session sync in layout');
expectFileIncludes('apps/mobile/App.tsx', 'fetchDogsDocument', 'Expo app reads My Dogs from shared API');
expectExists('apps/web/lib/member-profile.server.ts', 'Member profile query helper');
expectExists('apps/web/lib/my-dog-media.server.ts', 'Dog media server query helper');
expectExists('packages/db/src/repositories/dog-media.repository.ts', 'Dog media repository');
expectFileIncludes('apps/web/package.json', '@cane-corso-platform/storage', 'Web app storage dependency linkage');
expectExists('apps/web/app/(member)/my-dogs/[dogId]/media/page.tsx', 'Dog media member route');
expectFileIncludes('apps/web/lib/my-dogs.server.ts', 'executeCurrentMemberDogAction', 'My Dogs server query helper');
expectFileIncludes('apps/web/app/(member)/my-dogs/actions.ts', 'executeCurrentMemberDogAction', 'My Dogs server action uses query helper');
expectFileIncludes('apps/web/tsconfig.json', '"packages"', 'Web tsconfig excludes nested duplicate packages');
expectFileIncludes('apps/web/tsconfig.json', '"scripts"', 'Web tsconfig excludes nested duplicate scripts');
expectFileIncludes('apps/mobile/tsconfig.json', 'react-jsx', 'Mobile tsconfig is self-contained');

for (const check of checks) {
  console.log(`${check.ok ? '✔' : '✘'} ${check.description} — ${check.detail}`);
}

if (failures.length > 0) {
  console.error('\nVerification failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nWorkshop foundation verification passed.');
