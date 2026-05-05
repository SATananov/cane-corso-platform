#!/usr/bin/env node

/**
 * Step 70 — Public Runtime Access Smoke after Session Boundary Lock
 *
 * This smoke test protects the next layer after Steps 66–69:
 * public pages must remain reachable for anonymous visitors while member/admin
 * surfaces stay governed by the already locked runtime auth/session boundary.
 *
 * Usage:
 *   pnpm demo:public-runtime-access:static:qa
 *   pnpm demo:public-runtime-access:qa
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const staticOnly = process.argv.includes('--static-only');
const baseUrl = (process.env.CCP_DEMO_RUNTIME_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const checks = [];

const requiredScripts = {
  'demo:public-runtime-access:qa': 'node scripts/qa-demo-public-runtime-access-smoke.mjs',
  'demo:public-runtime-access:static:qa': 'node scripts/qa-demo-public-runtime-access-smoke.mjs --static-only',
  'demo:session-boundary-release:qa': 'node scripts/qa-demo-session-boundary-release-lock.mjs',
  'demo:role-separation:qa': 'node scripts/qa-demo-runtime-role-separation-smoke.mjs',
  'demo:admin-runtime-session:qa': 'node scripts/qa-demo-admin-runtime-session-smoke.mjs',
  'demo:runtime-session:qa': 'node scripts/qa-demo-runtime-session-member-smoke.mjs',
  'access:login-ui:qa': 'node scripts/qa-access-login-ui-payload.mjs',
  'workspace:syntax': 'node scripts/check-workshop-syntax.mjs',
  typecheck: 'turbo typecheck',
};

const publicRouteFiles = [
  ['/', 'apps/web/app/page.tsx'],
  ['/access', 'apps/web/app/access/page.tsx'],
  ['/platform', 'apps/web/app/(public)/platform/page.tsx'],
  ['/registry', 'apps/web/app/(public)/registry/page.tsx'],
  ['/gallery', 'apps/web/app/(public)/gallery/page.tsx'],
  ['/certified', 'apps/web/app/(public)/certified/page.tsx'],
  ['/knowledge', 'apps/web/app/(public)/knowledge/page.tsx'],
  ['/partners', 'apps/web/app/(public)/partners/page.tsx'],
  ['/community', 'apps/web/app/(public)/community/page.tsx'],
  ['/verify', 'apps/web/app/verify/page.tsx'],
  ['/guide', 'apps/web/app/(public)/guide/page.tsx'],
  ['/faq', 'apps/web/app/(public)/faq/page.tsx'],
  ['/manifesto', 'apps/web/app/(public)/manifesto/page.tsx'],
];

const runtimePublicRoutes = [
  '/',
  '/access',
  '/platform',
  '/registry',
  '/gallery',
  '/certified',
  '/knowledge',
  '/partners',
  '/community',
  '/verify',
  '/guide',
  '/faq',
  '/manifesto',
];

const protectedRouteFiles = [
  'apps/web/app/(member)/member/page.tsx',
  'apps/web/app/(member)/profile/page.tsx',
  'apps/web/app/(member)/my-dogs/page.tsx',
  'apps/web/app/(admin)/review/page.tsx',
  'apps/web/app/(admin)/admin/registry/page.tsx',
  'apps/web/app/(admin)/admin/partners/page.tsx',
  'apps/web/app/(admin)/admin/ecosystem/page.tsx',
  'apps/web/app/(admin)/admin/knowledge/page.tsx',
];

const requiredBoundaryDocs = [
  'docs/qa/step66-demo-runtime-session-member-smoke.md',
  'docs/qa/step67-admin-runtime-session-smoke.md',
  'docs/qa/step68-runtime-role-separation-smoke.md',
  'docs/qa/step69-session-boundary-release-lock.md',
  'docs/qa/step70-public-runtime-access-smoke.md',
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

function checkPackageScripts(packageJson) {
  for (const [scriptName, expectedValue] of Object.entries(requiredScripts)) {
    expect(
      packageJson.scripts?.[scriptName] === expectedValue,
      `Root package exposes ${scriptName}`,
      `expected: ${expectedValue}`,
    );
  }
}

function checkPublicRouteFiles() {
  for (const [route, file] of publicRouteFiles) {
    expect(exists(file), `Public route ${route} page file exists`, file);
  }
}

function checkProtectedBoundaryFiles() {
  for (const file of protectedRouteFiles) {
    expect(exists(file), `Protected session-boundary file still exists: ${file}`);
  }
}

function checkDocs() {
  for (const file of requiredBoundaryDocs) {
    expect(exists(file), `QA document exists: ${file}`);
  }

  const step69Doc = read('docs/qa/step69-session-boundary-release-lock.md');
  expect(
    includesAll(step69Doc, ['Step 66', 'Step 67', 'Step 68', 'PASS / LOCK']),
    'Step 69 document keeps the locked session-boundary history',
  );

  const step70Doc = read('docs/qa/step70-public-runtime-access-smoke.md');
  expect(
    includesAll(step70Doc, ['pnpm demo:public-runtime-access:qa', 'public pages', 'anonymous visitors']),
    'Step 70 document records the public runtime access smoke command and purpose',
  );
  expect(
    includesAll(step70Doc, ['Step 66', 'Step 67', 'Step 68', 'Step 69']),
    'Step 70 document records that the auth/session boundary stays locked',
  );
}

function checkRuntimeBoundaryScripts() {
  const step69Script = read('scripts/qa-demo-session-boundary-release-lock.mjs');
  const roleScript = read('scripts/qa-demo-runtime-role-separation-smoke.mjs');
  const memberScript = read('scripts/qa-demo-runtime-session-member-smoke.mjs');
  const adminScript = read('scripts/qa-demo-admin-runtime-session-smoke.mjs');

  expect(step69Script.includes('Step 69 — Session Boundary Release Lock'), 'Step 69 release lock script remains present');
  expect(roleScript.includes('Member session cannot open'), 'Step 68 role separation smoke still asserts member cannot open admin surfaces');
  expect(memberScript.includes('/member') && memberScript.includes('/profile') && memberScript.includes('/my-dogs'), 'Step 66 member smoke still covers member surfaces');
  expect(adminScript.includes('/review') && adminScript.includes('/admin/registry') && adminScript.includes('/admin/knowledge'), 'Step 67 admin smoke still covers protected admin surfaces');
}

function checkPublicSourceSemantics() {
  const entryPage = read('apps/web/app/page.tsx');
  const registryPage = read('apps/web/app/(public)/registry/page.tsx');
  const accessPage = read('apps/web/app/access/page.tsx');

  expect(entryPage.includes('EntryExperience'), 'Root route still renders the cinematic entry experience');
  expect(registryPage.includes('getOptionalCookieMemberSession'), 'Registry can read optional session without requiring one');
  expect(accessPage.includes('getOptionalCookieMemberSession'), 'Access page can read optional session without requiring one');
  expect(accessPage.includes('intent') && accessPage.includes('next'), 'Access page keeps intent/next routing context');
}

async function request(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: 'GET',
    redirect: 'manual',
    headers: {
      'user-agent': 'ccp-step70-public-runtime-access-smoke',
      accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
    },
  });
  const body = await response.text();
  return { response, body };
}

function isOkPublicStatus(status) {
  return status >= 200 && status < 300;
}

function isAccessRedirect(response) {
  const location = response.headers.get('location') ?? '';
  return response.status >= 300 && response.status < 400 && location.includes('/access');
}

function looksLikeServerError(status, body) {
  return status >= 500 || /Internal Server Error|Application error|NEXT_REDIRECT_ERROR/i.test(body);
}

async function runRuntimeChecks() {
  console.log(`\nStep 70 public runtime access smoke\n\nBase URL: ${baseUrl}`);

  try {
    const health = await fetch(`${baseUrl}/api/health`, { redirect: 'manual' });
    expect(health.ok, 'Health endpoint is reachable', `status ${health.status}`);
  } catch (error) {
    fail('Step 70 public runtime access smoke could not complete', error.message);
    return;
  }

  for (const pathname of runtimePublicRoutes) {
    try {
      const { response, body } = await request(pathname);
      const shortBody = body.replace(/\s+/g, ' ').slice(0, 220);

      expect(
        isOkPublicStatus(response.status),
        `Anonymous public route ${pathname} returns a successful response`,
        `status ${response.status}; ${shortBody}`,
      );
      expect(
        !isAccessRedirect(response),
        `Anonymous public route ${pathname} does not redirect to Access`,
        response.headers.get('location') ?? '',
      );
      expect(
        !looksLikeServerError(response.status, body),
        `Anonymous public route ${pathname} does not render a server error`,
        `status ${response.status}; ${shortBody}`,
      );
    } catch (error) {
      fail(`Anonymous public route ${pathname} can be fetched`, error.message);
    }
  }
}

async function main() {
  console.log('\nStep 70 static guardrails\n');

  const packageJson = JSON.parse(read('package.json'));
  checkPackageScripts(packageJson);
  checkPublicRouteFiles();
  checkProtectedBoundaryFiles();
  checkDocs();
  checkRuntimeBoundaryScripts();
  checkPublicSourceSemantics();

  if (staticOnly) {
    console.log('\nStatic-only mode complete. Runtime public access smoke was intentionally skipped.');
  } else {
    await runRuntimeChecks();
  }

  const failed = checks.filter((check) => !check.ok);

  if (failed.length > 0) {
    console.error(`\nStep 70 public runtime access smoke failed with ${failed.length} issue(s).`);
    if (!staticOnly) {
      console.error('\nMake sure the app is running before the runtime smoke:');
      console.error('  pnpm dev');
      console.error('Then run in a second terminal:');
      console.error('  pnpm demo:public-runtime-access:qa');
      console.error('\nIf your app uses another port, set:');
      console.error('  $env:CCP_DEMO_RUNTIME_BASE_URL = "http://localhost:3001"');
    }
    process.exit(1);
  }

  console.log('\nStep 70 public runtime access smoke complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
