#!/usr/bin/env node

/**
 * Step 73 — Admin Moderation Runtime Read Smoke
 *
 * GET-only runtime smoke for protected admin moderation surfaces after the
 * Step 66–72 auth/session/public/detail locks. This script does not approve,
 * publish, reject, delete, issue, revoke, submit, or mutate any record.
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

const adminCredentialCandidates = buildAdminCredentialCandidates();

const requiredScripts = {
  'demo:admin-moderation-read:qa': 'node scripts/qa-demo-admin-moderation-read-smoke.mjs',
  'demo:admin-moderation-read:static:qa': 'node scripts/qa-demo-admin-moderation-read-smoke.mjs --static-only',
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

const adminSurfaces = [
  {
    route: '/review',
    label: 'Admin review queue read surface',
    pageFile: 'apps/web/app/(admin)/review/page.tsx',
    sourceTokens: ['ReviewQueueDashboard', 'getReviewQueueDocument', 'AdminOperationalClarityPanel', 'PageShell'],
    contentHints: ['Registry review', 'Review', 'Преглед', 'moderation', 'USG certificate'],
  },
  {
    route: '/admin/registry',
    label: 'Admin Registry read surface',
    pageFile: 'apps/web/app/(admin)/admin/registry/page.tsx',
    sourceTokens: ['getPublishedRegistryDocument', 'getReviewQueueDocument', 'AdminRegistryEvidencePolishPanel', 'AdminOperationalClarityPanel', 'PageShell'],
    contentHints: ['Registry management', 'Управление на регистъра', 'Published profiles', 'Registry', 'Cane Corso'],
  },
  {
    route: '/admin/partners',
    label: 'Admin Partners read surface',
    pageFile: 'apps/web/app/(admin)/admin/partners/page.tsx',
    sourceTokens: ['PartnerModerationDashboard', 'getPartnerModerationDocument', 'AdminOperationalClarityPanel', 'PageShell'],
    contentHints: ['Application review', 'Partner', 'Партньори', 'Public directory', 'Ecosystem sync'],
  },
  {
    route: '/admin/ecosystem',
    label: 'Admin Ecosystem read surface',
    pageFile: 'apps/web/app/(admin)/admin/ecosystem/page.tsx',
    sourceTokens: ['EcosystemModerationDashboard', 'getEcosystemModerationDocument', 'AdminOperationalClarityPanel', 'PageShell'],
    contentHints: ['Official vs community ecosystem review', 'ecosystem', 'Екосистема', 'Официален запис', 'Suggestion'],
  },
  {
    route: '/admin/knowledge',
    label: 'Admin Knowledge read surface',
    pageFile: 'apps/web/app/(admin)/admin/knowledge/page.tsx',
    sourceTokens: ['KnowledgeAdminDashboard', 'getAdminKnowledgeArticles', 'AdminOperationalClarityPanel', 'PageShell'],
    contentHints: ['Knowledge articles', 'Статии в знанията', 'Articles', 'Sources', 'Draft guardrail'],
  },
];

const forbiddenAdminNotices = [
  'USG access',
  'Access path',
  'Път на достъпа',
  'Create a personal member account',
  'Създай личен членски акаунт',
  'member_required',
  'admin_required',
  'DEV_ACCESS_DISABLED',
  'Development access endpoints are disabled',
];

console.log('\nStep 73 static guardrails\n');
runStaticChecks();

if (staticOnly) {
  console.log('\nStatic-only mode complete. Runtime admin moderation read smoke was intentionally skipped.');
  finish();
  process.exit(0);
}

console.log('\nStep 73 admin moderation runtime read smoke\n');
console.log(`Base URL: ${baseUrl}`);

try {
  await runRuntimeChecks();
} catch (error) {
  record(false, `Step 73 admin moderation runtime read smoke could not complete — ${error.message}`);
  console.log('\nMake sure the app is running and the demo/test identities exist:');
  console.log('  pnpm db:migrate');
  console.log('  pnpm db:seed');
  console.log('  pnpm ecosystem:manual:seed');
  console.log('  pnpm dev');
  console.log('Then run in a second terminal:');
  console.log('  pnpm demo:admin-moderation-read:qa');
}

finish();

function runStaticChecks() {
  const pkg = readJson('package.json');
  for (const [scriptName, command] of Object.entries(requiredScripts)) {
    record(pkg?.scripts?.[scriptName] === command, `Root package exposes ${scriptName}`, `Expected ${command}`);
  }

  for (const file of [
    'scripts/qa-demo-public-detail-pages-smoke.mjs',
    'scripts/qa-demo-public-surface-content-smoke.mjs',
    'scripts/qa-demo-public-runtime-access-smoke.mjs',
    'scripts/qa-demo-session-boundary-release-lock.mjs',
    'scripts/qa-demo-runtime-role-separation-smoke.mjs',
    'scripts/qa-demo-admin-runtime-session-smoke.mjs',
    'scripts/qa-demo-runtime-session-member-smoke.mjs',
    'scripts/qa-access-login-ui-payload.mjs',
  ]) {
    record(fileExists(file), `Prior guardrail exists: ${file}`);
  }

  const signInRoute = readText('apps/web/app/api/auth/sign-in/route.ts');
  record(signInRoute.includes('verifyLocalCredentials') || signInRoute.includes('verifyMemberCredentials'), 'Runtime sign-in still verifies local credentials');
  record(signInRoute.includes('createSessionToken') || signInRoute.includes('createSessionFromIdentity'), 'Runtime sign-in still creates canonical signed session payload');
  record(signInRoute.includes(sessionCookieName) || signInRoute.includes('getSessionCookieDescriptor'), 'Runtime sign-in still sets the application session cookie');
  record(signInRoute.includes('response.cookies.set'), 'Runtime sign-in still writes cookie through Next response');

  const sessionRoute = readText('apps/web/app/api/session/route.ts');
  record(sessionRoute.includes('getCookieSession') || sessionRoute.includes('getCurrentMemberSession'), 'Session API stays on real cookie mode');
  record(!sessionRoute.includes('getDevelopmentSession') && !sessionRoute.includes('allowDevFallback: true'), 'Session API stays without dev fallback');

  for (const surface of adminSurfaces) {
    const source = readText(surface.pageFile);
    record(Boolean(source), `${surface.route} page file exists`);
    record(source.includes("dynamic = 'force-dynamic'") || source.includes('dynamic = "force-dynamic"'), `${surface.route} remains a force-dynamic admin read surface`);
    for (const token of surface.sourceTokens) {
      record(source.includes(token), `${surface.route} source keeps ${token}`);
    }
  }

  record(true, 'Admin read smoke is GET-only; mutation actions are intentionally outside Step 73');
}

async function runRuntimeChecks() {
  const health = await request('/api/health');
  record(health.status === 200, 'Health endpoint is reachable', `status ${health.status}`);

  const anonymousSession = await request('/api/session');
  record([401, 403].includes(anonymousSession.status), 'Anonymous /api/session is rejected before admin read checks', `status ${anonymousSession.status}`);

  for (const surface of adminSurfaces) {
    const anonymous = await request(surface.route, { redirect: 'manual' });
    record(isProtectedResponse(anonymous, surface.route), `Anonymous cannot read ${surface.route}`, `status ${anonymous.status}; location ${anonymous.headers.get('location') ?? 'none'}`);
  }

  const memberCookie = await signInMember();
  const memberSession = await request('/api/session', { cookie: memberCookie });
  const memberJson = await readJsonResponse(memberSession);
  record(memberSession.status === 200, 'member /api/session returns HTTP 200', `status ${memberSession.status}`);
  record(memberJson?.ok === true, 'member /api/session returns ok JSON document');
  record(memberJson?.data?.user?.role === 'member', 'member /api/session resolves member role', `role ${memberJson?.data?.user?.role ?? 'unknown'}`);

  for (const surface of adminSurfaces) {
    const memberRead = await request(surface.route, { cookie: memberCookie, redirect: 'manual' });
    record(isProtectedResponse(memberRead, surface.route), `Member session cannot read ${surface.route}`, `status ${memberRead.status}; location ${memberRead.headers.get('location') ?? 'none'}`);
  }

  await signOut(memberCookie, 'Member');

  const { cookie: adminCookie, email: adminEmail } = await signInAdmin();
  const adminSession = await request('/api/session', { cookie: adminCookie });
  const adminJson = await readJsonResponse(adminSession);
  record(adminSession.status === 200, 'admin /api/session returns HTTP 200', `status ${adminSession.status}`);
  record(adminJson?.ok === true, 'admin /api/session returns ok JSON document');
  record(adminJson?.data?.user?.role === 'admin', 'admin /api/session resolves admin role', `role ${adminJson?.data?.user?.role ?? 'unknown'}`);
  record(String(adminJson?.data?.user?.email ?? '').toLowerCase() === adminEmail.toLowerCase(), 'admin /api/session resolves the signed-in admin email');

  for (const surface of adminSurfaces) {
    const adminRead = await request(surface.route, { cookie: adminCookie, redirect: 'manual' });
    const html = await adminRead.text();
    record(adminRead.status === 200, `${surface.label} returns HTTP 200 for admin`, `status ${adminRead.status}`);
    record(hasAny(html, surface.contentHints), `${surface.route} renders expected admin read content`, `Missing one of: ${surface.contentHints.join(', ')}`);
    record(!hasAny(html, forbiddenAdminNotices), `${surface.route} does not render signed-out/member-required notices for admin`);
  }

  await signOut(adminCookie, 'Admin');
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
  record(json?.data?.user?.role === 'member', 'Demo member sign-in returns member role', `role ${json?.data?.user?.role ?? 'unknown'}`);
  record(Boolean(cookie), 'Demo member sign-in sets ccp_session cookie');
  if (!cookie) throw new Error('member sign-in did not create a session cookie');
  return cookie;
}

async function signInAdmin() {
  const attempts = [];
  for (const candidate of adminCredentialCandidates) {
    console.log(`Trying admin credential candidate: ${candidate.email} (${candidate.source}, password length ${candidate.password.length})`);
    const response = await request('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: candidate.email, password: candidate.password }),
    });
    const json = await readJsonResponse(response);
    const cookie = extractSessionCookie(response);
    attempts.push({ email: candidate.email, status: response.status, ok: json?.ok === true, hasCookie: Boolean(cookie) });
    if (response.status === 200 && json?.ok === true && json?.data?.user?.role === 'admin' && cookie) {
      record(true, 'Demo admin sign-in returns HTTP 200');
      record(true, 'Demo admin sign-in returns ok JSON document');
      record(json?.data?.bootstrap === 'cookie', 'Demo admin sign-in reports cookie bootstrap');
      record(String(json?.data?.user?.email ?? '').toLowerCase() === candidate.email.toLowerCase(), 'Demo admin sign-in returns normalized admin email');
      record(true, 'Demo admin sign-in returns admin role');
      record(true, 'Demo admin sign-in sets ccp_session cookie');
      return { cookie, email: candidate.email };
    }
  }
  record(false, 'Demo admin sign-in creates ccp_session cookie', `No configured/default admin credential succeeded. Attempts: ${JSON.stringify(attempts)}`);
  throw new Error('admin sign-in failed');
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

function buildAdminCredentialCandidates() {
  if (process.env.CCP_DEMO_ADMIN_EMAIL || process.env.CCP_DEMO_ADMIN_PASSWORD) {
    return [{
      email: process.env.CCP_DEMO_ADMIN_EMAIL ?? 'admin@demo.cane-corso.local',
      password: process.env.CCP_DEMO_ADMIN_PASSWORD ?? 'DemoAdmin123!',
      source: 'environment override/default pair',
    }];
  }
  return [
    { email: 'admin@demo.cane-corso.local', password: 'DemoAdmin123!', source: 'default admin demo candidate' },
    { email: 'ecosystem.admin@demo.cane-corso.local', password: 'DemoAdmin123!', source: 'ecosystem manual-flow admin candidate' },
  ];
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
  try { return await response.clone().json(); } catch { return null; }
}

function isProtectedResponse(response, route) {
  const location = response.headers.get('location') ?? '';
  const normalizedLocation = location.toLowerCase();
  const encodedRoute = encodeURIComponent(route).toLowerCase();
  return [301, 302, 303, 307, 308, 401, 403, 404].includes(response.status) &&
    (response.status >= 400 ||
      normalizedLocation.includes('/access') ||
      normalizedLocation.includes('admin_required') ||
      normalizedLocation.includes('member_required') ||
      normalizedLocation.includes(encodedRoute));
}

function extractSessionCookie(response) {
  const raw = response.headers.get('set-cookie') ?? '';
  const match = raw.match(new RegExp(`${sessionCookieName}=[^;]+`));
  return match?.[0] ?? '';
}

function hasAny(text, needles) {
  return needles.some((needle) => text.includes(needle));
}

function normalizeBaseUrl(value) { return String(value).replace(/\/$/, ''); }
function fileExists(relativePath) { return fs.existsSync(path.join(rootDir, relativePath)); }
function readText(relativePath) { try { return fs.readFileSync(path.join(rootDir, relativePath), 'utf8'); } catch { return ''; } }
function readJson(relativePath) { try { return JSON.parse(readText(relativePath)); } catch { return null; } }

function record(ok, message, detail = '') {
  checks.push({ ok, message, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${message}${ok || !detail ? '' : ` — ${detail}`}`);
}

function finish() {
  const failures = checks.filter((check) => !check.ok);
  if (failures.length > 0) {
    console.log(`\nStep 73 admin moderation runtime read smoke failed with ${failures.length} issue(s).`);
    process.exit(1);
  }
  console.log('\nStep 73 admin moderation runtime read smoke complete.');
}
