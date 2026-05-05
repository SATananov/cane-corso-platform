#!/usr/bin/env node

/**
 * Step 66 — Demo Runtime Session / Member Area Smoke after UI Login Fix
 *
 * Runtime smoke for the fixed Access login flow. It verifies that a real demo
 * login creates a signed cookie session and that member-only surfaces open with
 * that cookie, without using dev fallback access.
 *
 * Usage:
 *   pnpm demo:runtime-session:qa
 *   CCP_DEMO_RUNTIME_BASE_URL=http://localhost:3000 pnpm demo:runtime-session:qa
 *   node scripts/qa-demo-runtime-session-member-smoke.mjs --static-only
 *
 * Requirements for runtime mode:
 *   - The web app is running locally.
 *   - The database has migrations applied.
 *   - The demo seed has been run so member@demo.cane-corso.local has credentials.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const staticOnly = args.has('--static-only');

const baseUrl = normalizeBaseUrl(
  process.env.CCP_DEMO_RUNTIME_BASE_URL ??
    process.env.CCP_RUNTIME_SMOKE_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    'http://localhost:3000',
);

const demoEmail = process.env.CCP_DEMO_MEMBER_EMAIL ?? 'member@demo.cane-corso.local';
const demoPassword = process.env.CCP_DEMO_MEMBER_PASSWORD ?? 'DemoMember123!';
const sessionCookieName = 'ccp_session';
const requestTimeoutMs = Number(process.env.CCP_DEMO_RUNTIME_TIMEOUT_MS ?? 10_000);

const checks = [];

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
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

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, '');
}

function resolveUrl(route) {
  return `${baseUrl}${route.startsWith('/') ? route : `/${route}`}`;
}

async function request(route, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(resolveUrl(route), {
      redirect: 'manual',
      ...options,
      headers: {
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function readJson(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { __rawText: text };
  }
}

function getSetCookieHeaders(headers) {
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie();
  }

  const value = headers.get('set-cookie');
  return value ? [value] : [];
}

function extractSessionCookie(response) {
  const setCookieHeaders = getSetCookieHeaders(response.headers);
  const sessionCookie = setCookieHeaders.find((value) => value.startsWith(`${sessionCookieName}=`));

  if (!sessionCookie) {
    return null;
  }

  return sessionCookie.split(';')[0];
}

function hasClearedSessionCookie(response) {
  return getSetCookieHeaders(response.headers).some((value) => {
    const normalized = value.toLowerCase();
    return value.startsWith(`${sessionCookieName}=`) && (normalized.includes('max-age=0') || normalized.includes('expires='));
  });
}

function expectJsonOk(document, label) {
  expect(document?.ok === true, label, document?.error?.message ?? document?.__rawText);
}

function runStaticGuardrails() {
  console.log('\nStep 66 static guardrails\n');

  const packageJson = JSON.parse(read('package.json'));
  const signInRoute = read('apps/web/app/api/auth/sign-in/route.ts');
  const sessionRoute = read('apps/web/app/api/session/route.ts');
  const memberPage = read('apps/web/app/(member)/member/page.tsx');
  const profilePage = read('apps/web/app/(member)/profile/page.tsx');
  const myDogsPage = read('apps/web/app/(member)/my-dogs/page.tsx');
  const loginPanel = read('apps/web/components/member-access-panel.tsx');

  expect(
    packageJson.scripts?.['demo:runtime-session:qa'] === 'node scripts/qa-demo-runtime-session-member-smoke.mjs',
    'Root package exposes demo:runtime-session:qa',
  );
  expect(
    packageJson.scripts?.['demo:runtime-session:static:qa'] ===
      'node scripts/qa-demo-runtime-session-member-smoke.mjs --static-only',
    'Root package exposes demo:runtime-session:static:qa',
  );
  expect(signInRoute.includes('createLocalAuthRepository().verifyMemberCredentials'), 'Runtime sign-in verifies local demo credentials');
  expect(signInRoute.includes('createSessionFromIdentity(identity)'), 'Runtime sign-in creates canonical signed session payload');
  expect(signInRoute.includes('getSessionCookieDescriptor(session)'), 'Runtime sign-in sets the application session cookie');
  expect(signInRoute.includes('response.cookies.set'), 'Runtime sign-in writes cookie through Next response');
  expect(sessionRoute.includes('getCurrentMemberSession({ allowDevFallback: false })'), 'Session API does not use dev fallback in runtime check');
  expect(memberPage.includes("redirect(buildAccessPath({ intent: 'member'"), 'Member command center redirects signed-out users to Access');
  expect(profilePage.includes('getCurrentProfileDocument({ allowDevFallback: false })'), 'Profile page requires a real cookie session');
  expect(myDogsPage.includes('getCurrentMemberDogsDocument({ allowDevFallback: false })'), 'My Cane Corso page requires a real cookie session');
  expect(loginPanel.includes('function buildSignInPayload'), 'Access UI still builds a normalized sign-in payload');
  expect(loginPanel.includes('handleSuccessfulAuth(data.session.user.role)'), 'Access UI still uses shared role-aware redirect after sign-in');
  expect(!loginPanel.includes("router.push('/member');"), 'Access UI still avoids hardcoded member redirect');
}

async function runRuntimeSmoke() {
  console.log('\nStep 66 runtime smoke\n');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Demo email: ${demoEmail}`);
  console.log(`Demo password length: ${demoPassword.length}`);

  const healthResponse = await request('/api/health');
  expect(healthResponse.status === 200, 'Health endpoint is reachable', `status ${healthResponse.status}`);

  const anonymousSessionResponse = await request('/api/session');
  expect(anonymousSessionResponse.status === 401, 'Anonymous /api/session is rejected before login', `status ${anonymousSessionResponse.status}`);

  const anonymousMemberResponse = await request('/member');
  const anonymousLocation = anonymousMemberResponse.headers.get('location') ?? '';
  expect(
    [301, 302, 303, 307, 308].includes(anonymousMemberResponse.status) && anonymousLocation.includes('/access'),
    'Anonymous /member redirects to Access',
    `status ${anonymousMemberResponse.status}, location ${anonymousLocation}`,
  );
  expect(anonymousLocation.includes('member_required') && anonymousLocation.includes('next='), 'Anonymous member redirect preserves member intent and next route');

  const signInResponse = await request('/api/auth/sign-in', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email: `  ${demoEmail.toUpperCase()}  `,
      password: demoPassword,
    }),
  });
  const signInDocument = await readJson(signInResponse);

  expect(signInResponse.status === 200, 'Demo sign-in returns HTTP 200', `status ${signInResponse.status}`);
  expectJsonOk(signInDocument, 'Demo sign-in returns ok JSON document');
  expect(signInDocument?.data?.bootstrap === 'cookie', 'Demo sign-in reports cookie bootstrap');
  expect(signInDocument?.data?.session?.user?.email === demoEmail, 'Demo sign-in returns normalized demo email');
  expect(signInDocument?.data?.session?.user?.role === 'member', 'Demo sign-in returns member role');

  const cookieHeader = extractSessionCookie(signInResponse);
  expect(Boolean(cookieHeader), 'Demo sign-in sets ccp_session cookie');

  if (!cookieHeader) {
    return;
  }

  const authenticatedSessionResponse = await request('/api/session', {
    headers: {
      cookie: cookieHeader,
    },
  });
  const authenticatedSessionDocument = await readJson(authenticatedSessionResponse);
  expect(authenticatedSessionResponse.status === 200, 'Authenticated /api/session returns HTTP 200', `status ${authenticatedSessionResponse.status}`);
  expectJsonOk(authenticatedSessionDocument, 'Authenticated /api/session returns ok JSON document');
  expect(authenticatedSessionDocument?.data?.bootstrap === 'cookie', 'Authenticated /api/session stays on cookie bootstrap');
  expect(authenticatedSessionDocument?.data?.session?.user?.email === demoEmail, 'Authenticated /api/session resolves demo member');

  for (const surface of [
    {
      route: '/member',
      label: 'Member command center opens with session cookie',
      mustIncludeAny: ['Member Command Center', 'Команден център на члена', 'Centro comando membro'],
    },
    {
      route: '/profile',
      label: 'Profile page opens with session cookie',
      mustIncludeAny: ['Owner profile', 'Профил на собственика', 'Profilo owner'],
    },
    {
      route: '/my-dogs',
      label: 'My Cane Corso page opens with session cookie',
      mustIncludeAny: ['Cane Corso'],
    },
  ]) {
    const response = await request(surface.route, {
      headers: {
        cookie: cookieHeader,
      },
    });
    const html = await response.text();
    expect(response.status === 200, surface.label, `status ${response.status}`);
    expect(surface.mustIncludeAny.some((needle) => html.includes(needle)), `${surface.route} renders expected member content`);
    expect(!html.includes('member_required'), `${surface.route} does not render the signed-out access notice`);
  }

  const signOutResponse = await request('/api/session', {
    method: 'DELETE',
    headers: {
      cookie: cookieHeader,
    },
  });
  const signOutDocument = await readJson(signOutResponse);
  expect(signOutResponse.status === 200, 'Session DELETE returns HTTP 200', `status ${signOutResponse.status}`);
  expectJsonOk(signOutDocument, 'Session DELETE returns ok JSON document');
  expect(signOutDocument?.data?.signedOut === true, 'Session DELETE reports signed out');
  expect(hasClearedSessionCookie(signOutResponse), 'Session DELETE clears ccp_session cookie');
}

try {
  runStaticGuardrails();

  if (staticOnly) {
    console.log('\nStatic-only mode complete. Runtime smoke was intentionally skipped.');
  } else {
    await runRuntimeSmoke();
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  fail('Step 66 runtime smoke could not complete', message);

  console.error('\nMake sure the app is running and the demo database has been seeded:');
  console.error('  pnpm db:migrate');
  console.error('  pnpm db:seed');
  console.error('  pnpm dev');
  console.error('Then run in a second terminal:');
  console.error('  pnpm demo:runtime-session:qa');
}

const failed = checks.filter((check) => !check.ok);

if (failed.length > 0) {
  console.error(`\nStep 66 demo runtime session smoke failed with ${failed.length} issue(s).`);
  process.exit(1);
}

console.log('\nStep 66 demo runtime session smoke complete.');
