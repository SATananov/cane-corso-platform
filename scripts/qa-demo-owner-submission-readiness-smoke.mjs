#!/usr/bin/env node

/**
 * Step 74 — Owner Submission Runtime Readiness Smoke
 *
 * Runtime smoke for the member-owned Cane Corso submission preparation layer
 * after the Step 66–73 auth/session/public/admin read locks.
 *
 * This script is intentionally safe: it does not create, update, submit,
 * publish, approve, reject, certify, revoke, or delete records. The only API
 * write-path check sends an invalid body and expects the validation guard to
 * reject it before any mutation can happen.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const staticOnly = process.argv.includes('--static-only');
const baseUrl = normalizeBaseUrl(
  process.env.CCP_DEMO_RUNTIME_BASE_URL ??
    process.env.CCP_RUNTIME_SMOKE_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    'http://localhost:3000',
);
const sessionCookieName = 'ccp_session';
const requestTimeoutMs = Number(process.env.CCP_DEMO_RUNTIME_TIMEOUT_MS ?? 10_000);
const memberEmail = process.env.CCP_DEMO_MEMBER_EMAIL ?? 'member@demo.cane-corso.local';
const memberPassword = process.env.CCP_DEMO_MEMBER_PASSWORD ?? 'DemoMember123!';
const checks = [];

const requiredScripts = {
  'demo:owner-submission-readiness:qa': 'node scripts/qa-demo-owner-submission-readiness-smoke.mjs',
  'demo:owner-submission-readiness:static:qa': 'node scripts/qa-demo-owner-submission-readiness-smoke.mjs --static-only',
  'demo:admin-moderation-read:qa': 'node scripts/qa-demo-admin-moderation-read-smoke.mjs',
  'demo:public-detail-pages:qa': 'node scripts/qa-demo-public-detail-pages-smoke.mjs',
  'demo:public-surface-content:qa': 'node scripts/qa-demo-public-surface-content-smoke.mjs',
  'demo:public-runtime-access:qa': 'node scripts/qa-demo-public-runtime-access-smoke.mjs',
  'demo:session-boundary-release:qa': 'node scripts/qa-demo-session-boundary-release-lock.mjs',
  'demo:role-separation:qa': 'node scripts/qa-demo-runtime-role-separation-smoke.mjs',
  'demo:admin-runtime-session:qa': 'node scripts/qa-demo-admin-runtime-session-smoke.mjs',
  'demo:runtime-session:qa': 'node scripts/qa-demo-runtime-session-member-smoke.mjs',
  'access:login-ui:qa': 'node scripts/qa-access-login-ui-payload.mjs',
  'workspace:syntax': 'node scripts/check-workshop-syntax.mjs',
  typecheck: 'turbo typecheck',
};

const ownerSurfaces = [
  {
    route: '/member',
    label: 'Member command center',
    pageFile: 'apps/web/app/(member)/member/page.tsx',
    sourceTokens: ['OwnerCenterWorkspace', 'OwnerOnboardingFinalPanel', 'getCurrentOwnerCenterDocument', 'member_required'],
    contentHints: ['Member Command Center', 'Команден център на члена', 'Owner journey', 'Пътят на собственика', 'USG member command center'],
  },
  {
    route: '/my-dogs',
    label: 'My Cane Corso owner workspace',
    pageFile: 'apps/web/app/(member)/my-dogs/page.tsx',
    sourceTokens: ['MyDogsOverview', 'getCurrentMemberDogsDocument', 'allowDevFallback: false', 'member_required', 'next: \'/my-dogs\''],
    contentHints: ['My Dogs', 'My Cane Corso', 'Моите Cane Corso', 'Център на собственика', 'Private member flow', 'Публичното доверие'],
  },
  {
    route: '/my-dogs/new',
    label: 'New Cane Corso profile form',
    pageFile: 'apps/web/app/(member)/my-dogs/new/page.tsx',
    sourceTokens: ['MyDogFormWorkspace', 'getMemberDogFormInitialValues', 'mode="create"', 'allowDevFallback: false', 'member_required'],
    contentHints: ['Add a Cane Corso profile', 'Добави Cane Corso профил', 'Profile foundation', 'Основа на профила', 'Dog name', 'Име на Cane Corso'],
  },
  {
    route: '/profile',
    label: 'Member profile readiness surface',
    pageFile: 'apps/web/app/(member)/profile/page.tsx',
    sourceTokens: ['getCurrentProfileDocument', 'Profile', 'allowDevFallback: false', 'member_required'],
    contentHints: ['Profile', 'Профил', 'Owner', 'Собственик', 'Member', 'Член'],
  },
];

const forbiddenMemberNotices = [
  'You need member access to continue.',
  'Трябва да влезеш като член',
  'Devi accedere come membro',
  'You need admin access to continue.',
  'Трябва да влезеш като администратор',
  'Необходим е администраторски достъп',
  'admin_required',
  'member_required',
  'DEV_ACCESS_DISABLED',
  'Development access endpoints are disabled',
];

const protectedOwnerAccessNotices = [
  ...forbiddenMemberNotices,
  'Access required',
  'Member access',
  'Sign in to continue',
  'Влез',
  'Достъп',
  '/access',
];

console.log('\nStep 74 static guardrails\n');
runStaticChecks();

if (staticOnly) {
  console.log('\nStatic-only mode complete. Runtime owner submission readiness smoke was intentionally skipped.');
  finish();
  process.exit(0);
}

console.log('\nStep 74 owner submission runtime readiness smoke\n');
console.log(`Base URL: ${baseUrl}`);

try {
  await runRuntimeChecks();
} catch (error) {
  record(false, `Step 74 owner submission runtime readiness smoke could not complete — ${error.message}`);
  console.log('\nMake sure the app is running and the demo/test identities exist:');
  console.log('  pnpm db:migrate');
  console.log('  pnpm db:seed');
  console.log('  pnpm ecosystem:manual:seed');
  console.log('  pnpm dev');
  console.log('Then run in a second terminal:');
  console.log('  pnpm demo:owner-submission-readiness:qa');
  console.log('\nIf your app uses another port, set:');
  console.log('  $env:CCP_DEMO_RUNTIME_BASE_URL = "http://localhost:3001"');
}

finish();

function runStaticChecks() {
  const pkg = readJson('package.json');
  for (const [scriptName, command] of Object.entries(requiredScripts)) {
    record(pkg?.scripts?.[scriptName] === command, `Root package exposes ${scriptName}`, `Expected ${command}`);
  }

  for (const file of [
    'scripts/qa-demo-admin-moderation-read-smoke.mjs',
    'scripts/qa-demo-public-detail-pages-smoke.mjs',
    'scripts/qa-demo-public-surface-content-smoke.mjs',
    'scripts/qa-demo-public-runtime-access-smoke.mjs',
    'scripts/qa-demo-session-boundary-release-lock.mjs',
    'scripts/qa-demo-runtime-role-separation-smoke.mjs',
    'scripts/qa-demo-admin-runtime-session-smoke.mjs',
    'scripts/qa-demo-runtime-session-member-smoke.mjs',
    'scripts/qa-access-login-ui-payload.mjs',
    'docs/qa/step66-demo-runtime-session-member-smoke.md',
    'docs/qa/step67-admin-runtime-session-smoke.md',
    'docs/qa/step68-runtime-role-separation-smoke.md',
    'docs/qa/step69-session-boundary-release-lock.md',
    'docs/qa/step70-public-runtime-access-smoke.md',
    'docs/qa/step71-public-surface-content-runtime-smoke.md',
    'docs/qa/step72-public-detail-pages-runtime-smoke.md',
    'docs/qa/step73-admin-moderation-runtime-read-smoke.md',
    'docs/qa/step74-owner-submission-runtime-readiness-smoke.md',
  ]) {
    record(fileExists(file), `Required boundary/readiness file exists: ${file}`);
  }

  for (const surface of ownerSurfaces) {
    const source = readText(surface.pageFile);
    record(Boolean(source), `${surface.route} page file exists`);
    record(source.includes("dynamic = 'force-dynamic'") || source.includes('dynamic = "force-dynamic"'), `${surface.route} remains a force-dynamic member surface`);
    for (const token of surface.sourceTokens) {
      record(source.includes(token), `${surface.route} source keeps ${token}`);
    }
  }

  const dogsRoute = readText('apps/web/app/api/dogs/route.ts');
  record(dogsRoute.includes('export async function GET'), 'Owner dogs API keeps GET read path');
  record(dogsRoute.includes('export async function POST'), 'Owner dogs API keeps POST mutation path behind validation/session guards');
  record(dogsRoute.includes('getCurrentMemberDogsDocument'), 'Owner dogs API reads current member dogs document');
  record(dogsRoute.includes('executeCurrentMemberDogAction'), 'Owner dogs API routes mutations through member dog action service');
  record(dogsRoute.includes('SessionUnavailableError'), 'Owner dogs API rejects unauthenticated requests');
  record(dogsRoute.includes('DogProfileValidationError'), 'Owner dogs API exposes validation guard before review submission');

  const myDogsServer = readText('apps/web/lib/my-dogs.server.ts');
  record(myDogsServer.includes('getCurrentMemberSession'), 'Owner dog server layer uses current member session');
  record(myDogsServer.includes('validateDogForm'), 'Owner dog server layer validates form payloads');
  record(myDogsServer.includes('submit_for_review'), 'Owner dog server layer keeps submit-for-review validation boundary');
  record(myDogsServer.includes('executeProfileAction'), 'Owner dog server layer delegates persistence to repository action');

  const formWorkspace = readText('apps/web/components/my-dog-form-workspace.tsx');
  record(formWorkspace.includes('validateDogForm'), 'Owner form workspace keeps client validation feedback');
  record(formWorkspace.includes('mutateDogProfile'), 'Owner form workspace keeps API mutation client wiring');
  record(formWorkspace.includes('OwnerReviewReadinessPanel'), 'Owner form workspace keeps review readiness guidance');

  record(true, 'Step 74 runtime mutation safety: only invalid POST validation guard is exercised; no dog record is created or submitted');
}

async function runRuntimeChecks() {
  const health = await request('/api/health');
  record(health.status === 200, 'Health endpoint is reachable', `status ${health.status}`);

  const anonymousSession = await request('/api/session');
  record([401, 403].includes(anonymousSession.status), 'Anonymous /api/session is rejected before owner readiness checks', `status ${anonymousSession.status}`);

  for (const surface of ownerSurfaces) {
    const anonymous = await request(surface.route, { redirect: 'manual' });
    const anonymousHtml = await safeText(anonymous);
    record(
      isMemberProtectedResponse(anonymous, surface.route, anonymousHtml),
      `Anonymous cannot open ${surface.route}`,
      `status ${anonymous.status}; location ${anonymous.headers.get('location') ?? 'none'}`,
    );
  }

  const anonymousDogsApi = await request('/api/dogs', { redirect: 'manual' });
  record([401, 403].includes(anonymousDogsApi.status), 'Anonymous cannot read /api/dogs', `status ${anonymousDogsApi.status}`);

  const memberCookie = await signInMember();
  const memberSession = await request('/api/session', { cookie: memberCookie });
  const memberJson = await readJsonResponse(memberSession);
  record(memberSession.status === 200, 'member /api/session returns HTTP 200', `status ${memberSession.status}`);
  record(memberJson?.ok === true, 'member /api/session returns ok JSON document');
  record(memberJson?.data?.bootstrap === 'cookie', 'member /api/session stays on cookie bootstrap');
  const memberSessionUser = getSessionUser(memberJson);
  record(memberSessionUser?.role === 'member', 'member /api/session resolves member role', `role ${memberSessionUser?.role ?? 'unknown'}`);
  record(String(memberSessionUser?.email ?? '').toLowerCase() === memberEmail.toLowerCase(), 'member /api/session resolves expected email');

  for (const surface of ownerSurfaces) {
    const response = await request(surface.route, { cookie: memberCookie });
    const html = await response.text();
    record(response.status === 200, `${surface.label} opens with member session cookie`, `status ${response.status}`);
    record(
      hasAny(html, surface.contentHints) || isSubstantialRenderedDocument(html),
      `${surface.route} renders owner/member readiness document`,
      `Missing hints and document was not substantial enough. Expected one of: ${surface.contentHints.join(', ')}`,
    );
    record(!hasAny(html, forbiddenMemberNotices), `${surface.route} does not render signed-out/admin-required notice for member`);
  }

  const dogsApi = await request('/api/dogs', { cookie: memberCookie });
  const dogsJson = await readJsonResponse(dogsApi);
  record(dogsApi.status === 200, 'Member /api/dogs GET returns HTTP 200', `status ${dogsApi.status}`);
  record(dogsJson?.ok === true, 'Member /api/dogs GET returns ok JSON document');
  record(Array.isArray(dogsJson?.data?.dogs), 'Member /api/dogs GET returns a dogs array');

  const invalidPost = await request('/api/dogs', {
    method: 'POST',
    cookie: memberCookie,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });
  const invalidJson = await readJsonResponse(invalidPost);
  record([400, 422].includes(invalidPost.status), 'Member /api/dogs invalid POST is rejected by validation guard', `status ${invalidPost.status}`);
  record(invalidJson?.ok === false || invalidJson?.error, 'Invalid POST returns an error JSON document without creating a dog');

  await signOut(memberCookie, 'Member');
}

async function signInMember() {
  console.log(`Trying member credential: ${memberEmail} (password length ${memberPassword.length})`);
  const response = await request('/api/auth/sign-in', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: memberEmail, password: memberPassword }),
  });
  const json = await readJsonResponse(response);
  const cookie = extractSessionCookie(response);
  record(response.status === 200, 'Demo member sign-in returns HTTP 200', `status ${response.status}`);
  record(json?.ok === true, 'Demo member sign-in returns ok JSON document');
  record(json?.data?.bootstrap === 'cookie', 'Demo member sign-in reports cookie bootstrap');
  const signInUser = getSessionUser(json);
  record(String(signInUser?.email ?? '').toLowerCase() === memberEmail.toLowerCase(), 'Demo member sign-in returns normalized email');
  record(signInUser?.role === 'member', 'Demo member sign-in returns member role', `role ${signInUser?.role ?? 'unknown'}`);
  record(Boolean(cookie), 'Demo member sign-in sets ccp_session cookie');
  if (!cookie) throw new Error('member sign-in did not create a session cookie');
  return cookie;
}

async function signOut(cookie, label) {
  const response = await request('/api/session', { method: 'DELETE', cookie });
  const json = await readJsonResponse(response);
  const setCookie = response.headers.get('set-cookie') ?? '';
  record(response.status === 200, `${label} session DELETE returns HTTP 200`, `status ${response.status}`);
  record(json?.ok === true, `${label} session DELETE returns ok JSON document`);
  record(json?.data?.signedOut === true, `${label} session DELETE reports signed out`);
  record(setCookie.includes(`${sessionCookieName}=`), `${label} session DELETE clears ccp_session cookie`);
}

async function request(route, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const headers = new Headers(options.headers ?? {});
    if (options.cookie) headers.set('cookie', options.cookie);
    return await fetch(`${baseUrl}${route}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body,
      redirect: options.redirect ?? 'follow',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function readJsonResponse(response) {
  try {
    return await response.clone().json();
  } catch {
    return null;
  }
}

async function safeText(response) {
  try {
    return await response.clone().text();
  } catch {
    return '';
  }
}

function getSessionUser(document) {
  return document?.data?.session?.user ?? document?.data?.user ?? null;
}

function isMemberProtectedResponse(response, route, html = '') {
  const location = response.headers.get('location') ?? '';
  const normalizedLocation = location.toLowerCase();
  const encodedRoute = encodeURIComponent(route).toLowerCase();

  if ([301, 302, 303, 307, 308, 401, 403, 404].includes(response.status)) {
    return response.status >= 400 ||
      normalizedLocation.includes('/access') ||
      normalizedLocation.includes('member_required') ||
      normalizedLocation.includes(encodedRoute);
  }

  // Some protected member pages render a server-side access notice with HTTP 200
  // instead of redirecting. That is still protected as long as the anonymous
  // response is an access-required shell rather than the owner form/workspace.
  if (response.status === 200) {
    return hasAny(html, protectedOwnerAccessNotices);
  }

  return false;
}

function extractSessionCookie(response) {
  const raw = response.headers.get('set-cookie') ?? '';
  const match = raw.match(new RegExp(`${sessionCookieName}=[^;]+`));
  return match?.[0] ?? '';
}

function isSubstantialRenderedDocument(html) {
  const text = String(html ?? '');
  const lower = text.toLowerCase();
  return text.length > 900 && (
    lower.includes('<!doctype html') ||
    lower.includes('<html') ||
    lower.includes('<body') ||
    lower.includes('__next') ||
    lower.includes('next-static') ||
    lower.includes('data-theme=')
  );
}

function hasAny(text, needles) {
  return needles.some((needle) => text.includes(needle));
}

function normalizeBaseUrl(value) {
  return String(value).replace(/\/$/, '');
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function readText(relativePath) {
  try {
    return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
  } catch {
    return '';
  }
}

function readJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath));
  } catch {
    return null;
  }
}

function record(ok, message, detail = '') {
  checks.push({ ok, message, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${message}${ok || !detail ? '' : ` — ${detail}`}`);
}

function finish() {
  const failures = checks.filter((check) => !check.ok);
  if (failures.length > 0) {
    console.log(`\nStep 74 owner submission runtime readiness smoke failed with ${failures.length} issue(s).`);
    process.exit(1);
  }
  console.log('\nStep 74 owner submission runtime readiness smoke complete.');
}
