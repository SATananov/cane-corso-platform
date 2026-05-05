#!/usr/bin/env node

/**
 * Step 67 — Admin Runtime Session / Protected Admin Surface Smoke
 *
 * Runtime smoke for a real admin cookie session. It verifies that anonymous
 * users cannot open protected admin surfaces, a seeded demo admin can sign in
 * through the normal Access login API, and protected admin surfaces open only
 * with the signed ccp_session cookie.
 *
 * This script intentionally treats the runtime HTTP checks as the source of
 * truth. Static checks verify QA command wiring and route existence only; they
 * do not assume whether admin protection is implemented in a page, layout,
 * middleware, shared helper, or route-level redirect.
 *
 * Usage:
 *   pnpm demo:admin-runtime-session:qa
 *   CCP_DEMO_RUNTIME_BASE_URL=http://localhost:3000 pnpm demo:admin-runtime-session:qa
 *   node scripts/qa-demo-admin-runtime-session-smoke.mjs --static-only
 *
 * Optional credential overrides:
 *   CCP_DEMO_ADMIN_EMAIL=admin@demo.cane-corso.local
 *   CCP_DEMO_ADMIN_PASSWORD=DemoAdmin123!
 *
 * Requirements for runtime mode:
 *   - The web app is running locally.
 *   - The database has migrations applied.
 *   - A demo/test admin identity exists with local auth credentials.
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

const configuredAdminEmail = process.env.CCP_DEMO_ADMIN_EMAIL;
const configuredAdminPassword = process.env.CCP_DEMO_ADMIN_PASSWORD;
const sessionCookieName = 'ccp_session';
const requestTimeoutMs = Number(process.env.CCP_DEMO_RUNTIME_TIMEOUT_MS ?? 10_000);

const credentialCandidates = buildCredentialCandidates();

const requiredAdminSurfaces = [
  {
    route: '/review',
    label: 'Admin review queue opens with admin session cookie',
    fileCandidates: ['apps/web/app/(admin)/review/page.tsx', 'apps/web/app/review/page.tsx'],
    expectedNeedles: ['Review', 'Преглед', 'Revisione', 'moderation', 'review'],
  },
  {
    route: '/admin/registry',
    label: 'Admin Registry opens with admin session cookie',
    fileCandidates: ['apps/web/app/(admin)/admin/registry/page.tsx', 'apps/web/app/admin/registry/page.tsx'],
    expectedNeedles: ['Registry', 'Регистър', 'Registro', 'Cane Corso'],
  },
  {
    route: '/admin/partners',
    label: 'Admin Partners opens with admin session cookie',
    fileCandidates: ['apps/web/app/(admin)/admin/partners/page.tsx', 'apps/web/app/admin/partners/page.tsx'],
    expectedNeedles: ['Partners', 'Партньори', 'Partner', 'services'],
  },
  {
    route: '/admin/ecosystem',
    label: 'Admin Ecosystem opens with admin session cookie',
    fileCandidates: ['apps/web/app/(admin)/admin/ecosystem/page.tsx', 'apps/web/app/admin/ecosystem/page.tsx'],
    expectedNeedles: ['Ecosystem', 'Екосистема', 'Ecosistema', 'community'],
  },
  {
    route: '/admin/knowledge',
    label: 'Admin Knowledge opens with admin session cookie',
    fileCandidates: ['apps/web/app/(admin)/admin/knowledge/page.tsx', 'apps/web/app/admin/knowledge/page.tsx'],
    expectedNeedles: ['Knowledge', 'Знания', 'Conoscenza', 'article'],
  },
];

const checks = [];

function buildCredentialCandidates() {
  if (configuredAdminEmail || configuredAdminPassword) {
    return [
      {
        email: configuredAdminEmail ?? 'admin@demo.cane-corso.local',
        password: configuredAdminPassword ?? 'DemoAdmin123!',
        source: 'environment override/default pair',
      },
    ];
  }

  return [
    {
      email: 'admin@demo.cane-corso.local',
      password: 'DemoAdmin123!',
      source: 'default admin demo candidate',
    },
    {
      email: 'ecosystem.admin@demo.cane-corso.local',
      password: 'DemoAdmin123!',
      source: 'ecosystem manual-flow admin candidate',
    },
  ];
}

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function readFirstExisting(candidates) {
  for (const candidate of candidates) {
    if (exists(candidate)) {
      return {
        relativePath: candidate,
        content: read(candidate),
      };
    }
  }

  return null;
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

function isRedirectStatus(status) {
  return [301, 302, 303, 307, 308].includes(status);
}

function expectJsonOk(document, label) {
  expect(document?.ok === true, label, document?.error?.message ?? document?.__rawText);
}

function runStaticGuardrails() {
  console.log('\nStep 67 static guardrails\n');

  const packageJson = JSON.parse(read('package.json'));
  const signInRoute = read('apps/web/app/api/auth/sign-in/route.ts');
  const sessionRoute = read('apps/web/app/api/session/route.ts');

  expect(
    packageJson.scripts?.['demo:admin-runtime-session:qa'] === 'node scripts/qa-demo-admin-runtime-session-smoke.mjs',
    'Root package exposes demo:admin-runtime-session:qa',
  );
  expect(
    packageJson.scripts?.['demo:admin-runtime-session:static:qa'] ===
      'node scripts/qa-demo-admin-runtime-session-smoke.mjs --static-only',
    'Root package exposes demo:admin-runtime-session:static:qa',
  );
  expect(signInRoute.includes('createLocalAuthRepository().verifyMemberCredentials'), 'Runtime admin sign-in uses local credential verification');
  expect(signInRoute.includes('createSessionFromIdentity(identity)'), 'Runtime admin sign-in creates canonical signed session payload');
  expect(signInRoute.includes('getSessionCookieDescriptor(session)'), 'Runtime admin sign-in sets the application session cookie');
  expect(signInRoute.includes('response.cookies.set'), 'Runtime admin sign-in writes cookie through Next response');
  expect(sessionRoute.includes('getCurrentMemberSession({ allowDevFallback: false })'), 'Session API stays on real cookie mode without dev fallback');

  for (const surface of requiredAdminSurfaces) {
    const page = readFirstExisting(surface.fileCandidates);
    expect(Boolean(page), `${surface.route} page file exists`, surface.fileCandidates.join(' OR '));
  }

  pass('Admin surface protection is verified by runtime HTTP checks, not implementation-specific source markers');
}

async function trySignInWithCandidate(candidate) {
  const signInResponse = await request('/api/auth/sign-in', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email: `  ${candidate.email.toUpperCase()}  `,
      password: candidate.password,
    }),
  });
  const signInDocument = await readJson(signInResponse);
  const cookieHeader = extractSessionCookie(signInResponse);

  return {
    candidate,
    signInResponse,
    signInDocument,
    cookieHeader,
  };
}

async function signInDemoAdmin() {
  const attempts = [];

  for (const candidate of credentialCandidates) {
    console.log(`Trying admin credential candidate: ${candidate.email} (${candidate.source}, password length ${candidate.password.length})`);
    const result = await trySignInWithCandidate(candidate);
    attempts.push({
      email: candidate.email,
      status: result.signInResponse.status,
      ok: result.signInDocument?.ok === true,
      role: result.signInDocument?.data?.session?.user?.role,
      hasCookie: Boolean(result.cookieHeader),
    });

    if (
      result.signInResponse.status === 200 &&
      result.signInDocument?.ok === true &&
      result.signInDocument?.data?.session?.user?.role === 'admin' &&
      result.cookieHeader
    ) {
      return result;
    }
  }

  return { attempts };
}

async function runRuntimeSmoke() {
  console.log('\nStep 67 admin runtime smoke\n');
  console.log(`Base URL: ${baseUrl}`);

  const healthResponse = await request('/api/health');
  expect(healthResponse.status === 200, 'Health endpoint is reachable', `status ${healthResponse.status}`);

  const anonymousSessionResponse = await request('/api/session');
  expect(anonymousSessionResponse.status === 401, 'Anonymous /api/session is rejected before admin login', `status ${anonymousSessionResponse.status}`);

  for (const surface of requiredAdminSurfaces) {
    const anonymousResponse = await request(surface.route);
    const location = anonymousResponse.headers.get('location') ?? '';
    const protectedByRedirect = isRedirectStatus(anonymousResponse.status) && location.includes('/access');
    const protectedByHardRejection = [401, 403, 404].includes(anonymousResponse.status);

    expect(
      protectedByRedirect || protectedByHardRejection,
      `Anonymous ${surface.route} is protected`,
      `status ${anonymousResponse.status}, location ${location}`,
    );

    if (protectedByRedirect) {
      expect(
        location.includes('admin') || location.includes('next='),
        `Anonymous ${surface.route} redirect preserves admin intent or next route`,
        location,
      );
    }
  }

  const adminSignIn = await signInDemoAdmin();

  if (!adminSignIn.cookieHeader) {
    fail(
      'Demo admin sign-in creates ccp_session cookie',
      `No configured/default admin credential succeeded. Attempts: ${JSON.stringify(adminSignIn.attempts)}`,
    );
    return;
  }

  const { candidate, signInResponse, signInDocument, cookieHeader } = adminSignIn;

  expect(signInResponse.status === 200, 'Demo admin sign-in returns HTTP 200', `status ${signInResponse.status}`);
  expectJsonOk(signInDocument, 'Demo admin sign-in returns ok JSON document');
  expect(signInDocument?.data?.bootstrap === 'cookie', 'Demo admin sign-in reports cookie bootstrap');
  expect(signInDocument?.data?.session?.user?.email === candidate.email, 'Demo admin sign-in returns normalized admin email');
  expect(signInDocument?.data?.session?.user?.role === 'admin', 'Demo admin sign-in returns admin role');
  expect(Boolean(cookieHeader), 'Demo admin sign-in sets ccp_session cookie');

  const authenticatedSessionResponse = await request('/api/session', {
    headers: {
      cookie: cookieHeader,
    },
  });
  const authenticatedSessionDocument = await readJson(authenticatedSessionResponse);
  expect(authenticatedSessionResponse.status === 200, 'Authenticated admin /api/session returns HTTP 200', `status ${authenticatedSessionResponse.status}`);
  expectJsonOk(authenticatedSessionDocument, 'Authenticated admin /api/session returns ok JSON document');
  expect(authenticatedSessionDocument?.data?.bootstrap === 'cookie', 'Authenticated admin /api/session stays on cookie bootstrap');
  expect(authenticatedSessionDocument?.data?.session?.user?.role === 'admin', 'Authenticated /api/session resolves admin role');
  expect(authenticatedSessionDocument?.data?.session?.user?.email === candidate.email, 'Authenticated /api/session resolves demo admin email');

  for (const surface of requiredAdminSurfaces) {
    const response = await request(surface.route, {
      headers: {
        cookie: cookieHeader,
      },
    });
    const html = await response.text();

    expect(response.status === 200, surface.label, `status ${response.status}`);
    expect(!html.includes('admin_required') && !html.includes('member_required'), `${surface.route} does not render signed-out/admin-required notice`);
    expect(
      surface.expectedNeedles.some((needle) => html.includes(needle)),
      `${surface.route} renders expected admin surface content`,
    );
  }

  const signOutResponse = await request('/api/session', {
    method: 'DELETE',
    headers: {
      cookie: cookieHeader,
    },
  });
  const signOutDocument = await readJson(signOutResponse);
  expect(signOutResponse.status === 200, 'Admin session DELETE returns HTTP 200', `status ${signOutResponse.status}`);
  expectJsonOk(signOutDocument, 'Admin session DELETE returns ok JSON document');
  expect(signOutDocument?.data?.signedOut === true, 'Admin session DELETE reports signed out');
  expect(hasClearedSessionCookie(signOutResponse), 'Admin session DELETE clears ccp_session cookie');
}

try {
  runStaticGuardrails();

  if (staticOnly) {
    console.log('\nStatic-only mode complete. Runtime admin smoke was intentionally skipped.');
  } else {
    await runRuntimeSmoke();
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  fail('Step 67 admin runtime smoke could not complete', message);

  console.error('\nMake sure the app is running and a demo/test admin identity exists:');
  console.error('  pnpm db:migrate');
  console.error('  pnpm db:seed');
  console.error('  pnpm dev');
  console.error('Then run in a second terminal:');
  console.error('  pnpm demo:admin-runtime-session:qa');
  console.error('\nIf your local admin demo credentials differ, run with:');
  console.error('  $env:CCP_DEMO_ADMIN_EMAIL = "admin@demo.cane-corso.local"');
  console.error('  $env:CCP_DEMO_ADMIN_PASSWORD = "DemoAdmin123!"');
}

const failed = checks.filter((check) => !check.ok);

if (failed.length > 0) {
  console.error(`\nStep 67 admin runtime session smoke failed with ${failed.length} issue(s).`);
  process.exit(1);
}

console.log('\nStep 67 admin runtime session smoke complete.');
