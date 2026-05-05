#!/usr/bin/env node

/**
 * Step 69 — Session Boundary Release Lock
 *
 * Static release guardrail for the Step 66–68 runtime auth/session boundary.
 *
 * This script does not duplicate the runtime smoke tests. Instead, it locks the
 * release contract around the existing runtime proof scripts and documentation:
 *   - Step 66 member runtime session smoke
 *   - Step 67 admin runtime session smoke
 *   - Step 68 member/admin runtime role separation smoke
 *
 * Usage:
 *   pnpm demo:session-boundary-release:qa
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const checks = [];

const requiredScripts = {
  'demo:runtime-session:static:qa': 'node scripts/qa-demo-runtime-session-member-smoke.mjs --static-only',
  'demo:runtime-session:qa': 'node scripts/qa-demo-runtime-session-member-smoke.mjs',
  'demo:admin-runtime-session:static:qa': 'node scripts/qa-demo-admin-runtime-session-smoke.mjs --static-only',
  'demo:admin-runtime-session:qa': 'node scripts/qa-demo-admin-runtime-session-smoke.mjs',
  'demo:role-separation:static:qa': 'node scripts/qa-demo-runtime-role-separation-smoke.mjs --static-only',
  'demo:role-separation:qa': 'node scripts/qa-demo-runtime-role-separation-smoke.mjs',
  'demo:session-boundary-release:qa': 'node scripts/qa-demo-session-boundary-release-lock.mjs',
  'access:login-ui:qa': 'node scripts/qa-access-login-ui-payload.mjs',
  'workspace:syntax': 'node scripts/check-workshop-syntax.mjs',
  typecheck: 'turbo typecheck',
};

const requiredFiles = [
  'scripts/qa-demo-runtime-session-member-smoke.mjs',
  'scripts/qa-demo-admin-runtime-session-smoke.mjs',
  'scripts/qa-demo-runtime-role-separation-smoke.mjs',
  'scripts/qa-access-login-ui-payload.mjs',
  'docs/qa/step66-demo-runtime-session-member-smoke.md',
  'docs/qa/step67-admin-runtime-session-smoke.md',
  'docs/qa/step68-runtime-role-separation-smoke.md',
  'docs/qa/step69-session-boundary-release-lock.md',
  'apps/web/app/api/auth/sign-in/route.ts',
  'apps/web/app/api/session/route.ts',
  'apps/web/app/(member)/member/page.tsx',
  'apps/web/app/(member)/profile/page.tsx',
  'apps/web/app/(member)/my-dogs/page.tsx',
];

const adminSurfaceFiles = [
  ['apps/web/app/(admin)/review/page.tsx', 'apps/web/app/review/page.tsx'],
  ['apps/web/app/(admin)/admin/registry/page.tsx', 'apps/web/app/admin/registry/page.tsx'],
  ['apps/web/app/(admin)/admin/partners/page.tsx', 'apps/web/app/admin/partners/page.tsx'],
  ['apps/web/app/(admin)/admin/ecosystem/page.tsx', 'apps/web/app/admin/ecosystem/page.tsx'],
  ['apps/web/app/(admin)/admin/knowledge/page.tsx', 'apps/web/app/admin/knowledge/page.tsx'],
];

function resolve(relativePath) {
  return path.join(rootDir, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(resolve(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(resolve(relativePath), 'utf8');
}

function pass(label) {
  checks.push({ label, ok: true });
  console.log(`PASS ${label}`);
}

function fail(label, detail) {
  checks.push({ label, ok: false });
  console.error(`FAIL ${label}${detail ? ` — ${detail}` : ''}`);
}

function expect(condition, label, detail) {
  if (condition) {
    pass(label);
  } else {
    fail(label, detail);
  }
}

function includesAll(content, needles) {
  return needles.every((needle) => content.includes(needle));
}

function includesAny(content, needles) {
  return needles.some((needle) => content.includes(needle));
}

function firstExisting(candidates) {
  return candidates.find((candidate) => exists(candidate));
}

function checkPackageScripts(packageJson) {
  for (const [scriptName, expectedValue] of Object.entries(requiredScripts)) {
    expect(
      packageJson.scripts?.[scriptName] === expectedValue,
      `Root package exposes ${scriptName}`,
      `expected: ${expectedValue}`,
    );
  }
}

function checkRequiredFiles() {
  for (const file of requiredFiles) {
    expect(exists(file), `Required session-boundary file exists: ${file}`);
  }

  for (const candidates of adminSurfaceFiles) {
    const found = firstExisting(candidates);
    expect(Boolean(found), `Protected admin surface file exists: ${candidates[0].replace('apps/web/app/(admin)', '')}`, candidates.join(' OR '));
  }
}

function checkRuntimeAuthContract() {
  const signInRoute = read('apps/web/app/api/auth/sign-in/route.ts');
  const sessionRoute = read('apps/web/app/api/session/route.ts');

  expect(signInRoute.includes('createLocalAuthRepository().verifyMemberCredentials'), 'Runtime sign-in still verifies local credentials');
  expect(signInRoute.includes('createSessionFromIdentity(identity)'), 'Runtime sign-in still creates canonical signed session payload');
  expect(signInRoute.includes('getSessionCookieDescriptor(session)'), 'Runtime sign-in still sets the application session cookie');
  expect(signInRoute.includes('response.cookies.set'), 'Runtime sign-in still writes cookie through Next response');
  expect(sessionRoute.includes('getCurrentMemberSession({ allowDevFallback: false })'), 'Session API stays in real cookie mode without dev fallback');
}

function checkMemberRuntimeSmokeCoverage() {
  const memberSmoke = read('scripts/qa-demo-runtime-session-member-smoke.mjs');

  expect(memberSmoke.includes("'member@demo.cane-corso.local'") || memberSmoke.includes('"member@demo.cane-corso.local"'), 'Step 66 smoke keeps demo member credential coverage');
  expect(memberSmoke.includes("'DemoMember123!'") || memberSmoke.includes('"DemoMember123!"'), 'Step 66 smoke keeps demo member password coverage without printing it');
  expect(includesAll(memberSmoke, ['/api/session', '/api/auth/sign-in', '/member', '/profile', '/my-dogs']), 'Step 66 smoke covers member sign-in, session API, and member surfaces');
  expect(memberSmoke.includes('ccp_session'), 'Step 66 smoke verifies the ccp_session cookie');
  expect(memberSmoke.includes('Session DELETE clears ccp_session cookie'), 'Step 66 smoke verifies logout clears the session cookie');
}

function checkAdminRuntimeSmokeCoverage() {
  const adminSmoke = read('scripts/qa-demo-admin-runtime-session-smoke.mjs');

  expect(
    includesAny(adminSmoke, ['admin@demo.cane-corso.local', 'ecosystem.admin@demo.cane-corso.local']),
    'Step 67 smoke keeps demo admin credential coverage',
  );
  expect(includesAll(adminSmoke, ['/api/session', '/api/auth/sign-in', '/review', '/admin/registry', '/admin/partners', '/admin/ecosystem', '/admin/knowledge']), 'Step 67 smoke covers admin sign-in, session API, and protected admin surfaces');
  expect(adminSmoke.includes('ccp_session'), 'Step 67 smoke verifies the ccp_session cookie');
  expect(adminSmoke.includes('Admin session DELETE clears ccp_session cookie'), 'Step 67 smoke verifies admin logout clears the session cookie');
  expect(adminSmoke.includes('Admin surface protection is verified by runtime HTTP checks'), 'Step 67 static guardrail avoids implementation-specific admin source markers');
}

function checkRoleSeparationSmokeCoverage() {
  const roleSmoke = read('scripts/qa-demo-runtime-role-separation-smoke.mjs');

  expect(includesAll(roleSmoke, ['/member', '/profile', '/my-dogs']), 'Step 68 smoke covers member-allowed surfaces');
  expect(includesAll(roleSmoke, ['/review', '/admin/registry', '/admin/partners', '/admin/ecosystem', '/admin/knowledge']), 'Step 68 smoke covers admin-only surfaces');
  expect(roleSmoke.includes('Member session cannot open'), 'Step 68 smoke asserts member sessions cannot open admin surfaces');
  expect(roleSmoke.includes('Admin review queue opens with admin session cookie'), 'Step 68 smoke asserts admin sessions can open admin surfaces');
  expect(roleSmoke.includes('await signOut(memberIdentity, \'Member\')') || roleSmoke.includes("await signOut(memberIdentity, 'Member')"), 'Step 68 smoke signs out the member session');
  expect(roleSmoke.includes('await signOut(adminIdentity, \'Admin\')') || roleSmoke.includes("await signOut(adminIdentity, 'Admin')"), 'Step 68 smoke signs out the admin session');
  expect(roleSmoke.includes('session DELETE clears ccp_session cookie'), 'Step 68 smoke verifies logout clears the session cookie');
  expect(roleSmoke.includes('Role separation authority is verified by runtime HTTP checks'), 'Step 68 static guardrail keeps runtime HTTP checks as source of truth');
}

function checkDocumentationReleaseChain() {
  const step66Doc = read('docs/qa/step66-demo-runtime-session-member-smoke.md');
  const step67Doc = read('docs/qa/step67-admin-runtime-session-smoke.md');
  const step68Doc = read('docs/qa/step68-runtime-role-separation-smoke.md');
  const step69Doc = read('docs/qa/step69-session-boundary-release-lock.md');

  expect(step66Doc.includes('pnpm demo:runtime-session:qa'), 'Step 66 QA document records member runtime smoke command');
  expect(step67Doc.includes('pnpm demo:admin-runtime-session:qa'), 'Step 67 QA document records admin runtime smoke command');
  expect(step68Doc.includes('pnpm demo:role-separation:qa'), 'Step 68 QA document records role separation smoke command');
  expect(step68Doc.includes('runtime HTTP checks are the source of truth') || step68Doc.includes('runtime HTTP checks'), 'Step 68 QA document records runtime-source-of-truth boundary');
  expect(
    includesAll(step69Doc, [
      'pnpm demo:session-boundary-release:qa',
      'pnpm demo:role-separation:qa',
      'pnpm demo:admin-runtime-session:qa',
      'pnpm demo:runtime-session:qa',
      'pnpm access:login-ui:qa',
      'pnpm workspace:syntax',
      'pnpm typecheck',
    ]),
    'Step 69 QA document records the full release validation chain',
  );
  expect(
    includesAll(step69Doc, ['Step 66', 'Step 67', 'Step 68', 'PASS / LOCK']),
    'Step 69 QA document records the Step 66–68 PASS / LOCK boundary',
  );
  expect(
    includesAll(step69Doc, ['Registry', 'Certificate', 'Verify', 'Gallery', 'Ecosystem', 'Auth/session implementation']),
    'Step 69 QA document records protected locked-section boundaries',
  );
}

function main() {
  console.log('\nStep 69 — Session Boundary Release Lock\n');

  const packageJson = JSON.parse(read('package.json'));

  checkPackageScripts(packageJson);
  checkRequiredFiles();
  checkRuntimeAuthContract();
  checkMemberRuntimeSmokeCoverage();
  checkAdminRuntimeSmokeCoverage();
  checkRoleSeparationSmokeCoverage();
  checkDocumentationReleaseChain();

  const failed = checks.filter((check) => !check.ok);

  if (failed.length > 0) {
    console.error(`\nStep 69 session boundary release lock failed with ${failed.length} issue(s).`);
    process.exit(1);
  }

  console.log('\nStep 69 session boundary release lock complete.');
}

main();
