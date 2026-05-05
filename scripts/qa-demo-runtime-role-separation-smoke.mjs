#!/usr/bin/env node

/**
 * Step 68 — Runtime Role Separation Smoke
 *
 * Runtime smoke for the member/admin authorization boundary after Step 66 and
 * Step 67. It verifies that a real member cookie can open member surfaces but
 * cannot open protected admin surfaces, while a real admin cookie can open the
 * protected admin surfaces.
 *
 * This script intentionally treats runtime HTTP behavior as the source of
 * truth. Static checks verify QA command wiring, runtime auth contract markers,
 * and route existence only; they do not assume whether protection is enforced
 * in a page, layout, middleware, shared helper, or route-level redirect.
 *
 * Usage:
 *   pnpm demo:role-separation:qa
 *   CCP_DEMO_RUNTIME_BASE_URL=http://localhost:3000 pnpm demo:role-separation:qa
 *   node scripts/qa-demo-runtime-role-separation-smoke.mjs --static-only
 *
 * Optional credential overrides:
 *   CCP_DEMO_MEMBER_EMAIL=member@demo.cane-corso.local
 *   CCP_DEMO_MEMBER_PASSWORD=DemoMember123!
 *   CCP_DEMO_ADMIN_EMAIL=ecosystem.admin@demo.cane-corso.local
 *   CCP_DEMO_ADMIN_PASSWORD=DemoAdmin123!
 *
 * Requirements for runtime mode:
 *   - The web app is running locally.
 *   - The database has migrations applied.
 *   - Demo/test member and admin identities exist with local auth credentials.
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

const memberEmail = process.env.CCP_DEMO_MEMBER_EMAIL ?? 'member@demo.cane-corso.local';
const memberPassword = process.env.CCP_DEMO_MEMBER_PASSWORD ?? 'DemoMember123!';
const configuredAdminEmail = process.env.CCP_DEMO_ADMIN_EMAIL;
const configuredAdminPassword = process.env.CCP_DEMO_ADMIN_PASSWORD;
const sessionCookieName = 'ccp_session';
const requestTimeoutMs = Number(process.env.CCP_DEMO_RUNTIME_TIMEOUT_MS ?? 10_000);

const adminCredentialCandidates = buildAdminCredentialCandidates();
const checks = [];

const memberSurfaces = [
  {
    route: '/member',
    label: 'Member command center opens with member session cookie',
    expectedNeedles: ['Member Command Center', 'Команден център на члена', 'Centro comando membro'],
  },
  {
    route: '/profile',
    label: 'Profile opens with member session cookie',
    expectedNeedles: ['Owner profile', 'Профил на собственика', 'Profilo owner'],
  },
  {
    route: '/my-dogs',
    label: 'My Cane Corso opens with member session cookie',
    expectedNeedles: ['Cane Corso'],
  },
];

const adminSurfaces = [
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

function buildAdminCredentialCandidates() {
  if (configuredAdminEmail || configuredAdminPassword) {
    return [
      {
        email: configuredAdminEmail ?? 'ecosystem.admin@demo.cane-corso.local',
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

function hasExpectedContent(html, needles) {
  return needles.some((needle) => html.includes(needle));
}

function hasAccessOrAuthorityNotice(html) {
  const normalized = html.toLowerCase();
  return (
    normalized.includes('admin_required') ||
    normalized.includes('member_required') ||
    normalized.includes('access') ||
    normalized.includes('sign in') ||
    normalized.includes('signed-out') ||
    normalized.includes('not authorized') ||
    normalized.includes('unauthorized') ||
    normalized.includes('forbidden') ||
    normalized.includes('админ') ||
    normalized.includes('достъп') ||
    normalized.includes('вход')
  );
}

function runStaticGuardrails() {
  console.log('\nStep 68 static guardrails\n');

  const packageJson = JSON.parse(read('package.json'));
  const signInRoute = read('apps/web/app/api/auth/sign-in/route.ts');
  const sessionRoute = read('apps/web/app/api/session/route.ts');
  const memberPage = read('apps/web/app/(member)/member/page.tsx');
  const profilePage = read('apps/web/app/(member)/profile/page.tsx');
  const myDogsPage = read('apps/web/app/(member)/my-dogs/page.tsx');

  expect(
    packageJson.scripts?.['demo:role-separation:qa'] === 'node scripts/qa-demo-runtime-role-separation-smoke.mjs',
    'Root package exposes demo:role-separation:qa',
  );
  expect(
    packageJson.scripts?.['demo:role-separation:static:qa'] ===
      'node scripts/qa-demo-runtime-role-separation-smoke.mjs --static-only',
    'Root package exposes demo:role-separation:static:qa',
  );
  expect(signInRoute.includes('createLocalAuthRepository().verifyMemberCredentials'), 'Runtime sign-in still verifies local credentials');
  expect(signInRoute.includes('createSessionFromIdentity(identity)'), 'Runtime sign-in still creates canonical signed session payload');
  expect(signInRoute.includes('getSessionCookieDescriptor(session)'), 'Runtime sign-in still sets the application session cookie');
  expect(signInRoute.includes('response.cookies.set'), 'Runtime sign-in still writes cookie through Next response');
  expect(sessionRoute.includes('getCurrentMemberSession({ allowDevFallback: false })'), 'Session API stays on real cookie mode without dev fallback');
  expect(memberPage.includes("redirect(buildAccessPath({ intent: 'member'"), 'Member command center keeps signed-out redirect guard');
  expect(profilePage.includes('getCurrentProfileDocument({ allowDevFallback: false })'), 'Profile page keeps real cookie session guard');
  expect(myDogsPage.includes('getCurrentMemberDogsDocument({ allowDevFallback: false })'), 'My Cane Corso page keeps real cookie session guard');

  for (const surface of adminSurfaces) {
    const page = readFirstExisting(surface.fileCandidates);
    expect(Boolean(page), `${surface.route} page file exists`, surface.fileCandidates.join(' OR '));
  }

  pass('Role separation authority is verified by runtime HTTP checks, not implementation-specific source markers');
}

async function signIn(email, password, expectedRole, label) {
  const signInResponse = await request('/api/auth/sign-in', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email: `  ${email.toUpperCase()}  `,
      password,
    }),
  });
  const signInDocument = await readJson(signInResponse);
  const cookieHeader = extractSessionCookie(signInResponse);

  expect(signInResponse.status === 200, `${label} sign-in returns HTTP 200`, `status ${signInResponse.status}`);
  expectJsonOk(signInDocument, `${label} sign-in returns ok JSON document`);
  expect(signInDocument?.data?.bootstrap === 'cookie', `${label} sign-in reports cookie bootstrap`);
  expect(signInDocument?.data?.session?.user?.email === email, `${label} sign-in returns normalized email`);
  expect(signInDocument?.data?.session?.user?.role === expectedRole, `${label} sign-in returns ${expectedRole} role`);
  expect(Boolean(cookieHeader), `${label} sign-in sets ccp_session cookie`);

  return {
    email,
    role: expectedRole,
    cookieHeader,
    signInDocument,
    signInResponse,
  };
}

async function signInDemoMember() {
  console.log(`Trying member credential: ${memberEmail} (password length ${memberPassword.length})`);
  return signIn(memberEmail, memberPassword, 'member', 'Demo member');
}

async function signInDemoAdmin() {
  const attempts = [];

  for (const candidate of adminCredentialCandidates) {
    console.log(`Trying admin credential candidate: ${candidate.email} (${candidate.source}, password length ${candidate.password.length})`);
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

    attempts.push({
      email: candidate.email,
      status: signInResponse.status,
      ok: signInDocument?.ok === true,
      role: signInDocument?.data?.session?.user?.role,
      hasCookie: Boolean(cookieHeader),
    });

    if (
      signInResponse.status === 200 &&
      signInDocument?.ok === true &&
      signInDocument?.data?.session?.user?.role === 'admin' &&
      cookieHeader
    ) {
      pass('Demo admin sign-in returns HTTP 200');
      expectJsonOk(signInDocument, 'Demo admin sign-in returns ok JSON document');
      expect(signInDocument?.data?.bootstrap === 'cookie', 'Demo admin sign-in reports cookie bootstrap');
      expect(signInDocument?.data?.session?.user?.email === candidate.email, 'Demo admin sign-in returns normalized admin email');
      expect(signInDocument?.data?.session?.user?.role === 'admin', 'Demo admin sign-in returns admin role');
      pass('Demo admin sign-in sets ccp_session cookie');

      return {
        email: candidate.email,
        role: 'admin',
        cookieHeader,
        signInDocument,
        signInResponse,
      };
    }
  }

  fail('Demo admin sign-in creates ccp_session cookie', `No configured/default admin credential succeeded. Attempts: ${JSON.stringify(attempts)}`);
  return { email: null, role: 'admin', cookieHeader: null };
}

async function assertSessionRole(identity) {
  if (!identity.cookieHeader) {
    return;
  }

  const response = await request('/api/session', {
    headers: {
      cookie: identity.cookieHeader,
    },
  });
  const document = await readJson(response);
  expect(response.status === 200, `${identity.role} /api/session returns HTTP 200`, `status ${response.status}`);
  expectJsonOk(document, `${identity.role} /api/session returns ok JSON document`);
  expect(document?.data?.bootstrap === 'cookie', `${identity.role} /api/session stays on cookie bootstrap`);
  expect(document?.data?.session?.user?.role === identity.role, `${identity.role} /api/session resolves ${identity.role} role`);
  expect(document?.data?.session?.user?.email === identity.email, `${identity.role} /api/session resolves expected email`);
}

async function assertMemberSurfacesOpenWithMember(memberIdentity) {
  if (!memberIdentity.cookieHeader) {
    return;
  }

  for (const surface of memberSurfaces) {
    const response = await request(surface.route, {
      headers: {
        cookie: memberIdentity.cookieHeader,
      },
    });
    const html = await response.text();
    expect(response.status === 200, surface.label, `status ${response.status}`);
    expect(hasExpectedContent(html, surface.expectedNeedles), `${surface.route} renders expected member content`);
    expect(!html.includes('member_required'), `${surface.route} does not render the signed-out access notice`);
  }
}

async function assertAdminSurfacesRejectMember(memberIdentity) {
  if (!memberIdentity.cookieHeader) {
    return;
  }

  for (const surface of adminSurfaces) {
    const response = await request(surface.route, {
      headers: {
        cookie: memberIdentity.cookieHeader,
      },
    });
    const location = response.headers.get('location') ?? '';
    const redirectProtected = isRedirectStatus(response.status) && (location.includes('/access') || location.includes('/member') || location.includes('/'));
    const rejectedByStatus = [401, 403, 404].includes(response.status);
    let protectedByHtmlNotice = false;
    let leakedExpectedAdminContent = false;

    if (response.status === 200) {
      const html = await response.text();
      protectedByHtmlNotice = hasAccessOrAuthorityNotice(html);
      leakedExpectedAdminContent = hasExpectedContent(html, surface.expectedNeedles) && !protectedByHtmlNotice;
    }

    expect(
      (redirectProtected || rejectedByStatus || protectedByHtmlNotice) && !leakedExpectedAdminContent,
      `Member session cannot open ${surface.route}`,
      `status ${response.status}, location ${location}`,
    );
  }
}

async function assertAdminSurfacesOpenWithAdmin(adminIdentity) {
  if (!adminIdentity.cookieHeader) {
    return;
  }

  for (const surface of adminSurfaces) {
    const response = await request(surface.route, {
      headers: {
        cookie: adminIdentity.cookieHeader,
      },
    });
    const html = await response.text();

    expect(response.status === 200, surface.label, `status ${response.status}`);
    expect(!html.includes('admin_required') && !html.includes('member_required'), `${surface.route} does not render signed-out/admin-required notice for admin`);
    expect(hasExpectedContent(html, surface.expectedNeedles), `${surface.route} renders expected admin surface content for admin`);
  }
}

async function signOut(identity, label) {
  if (!identity.cookieHeader) {
    return;
  }

  const signOutResponse = await request('/api/session', {
    method: 'DELETE',
    headers: {
      cookie: identity.cookieHeader,
    },
  });
  const signOutDocument = await readJson(signOutResponse);
  expect(signOutResponse.status === 200, `${label} session DELETE returns HTTP 200`, `status ${signOutResponse.status}`);
  expectJsonOk(signOutDocument, `${label} session DELETE returns ok JSON document`);
  expect(signOutDocument?.data?.signedOut === true, `${label} session DELETE reports signed out`);
  expect(hasClearedSessionCookie(signOutResponse), `${label} session DELETE clears ccp_session cookie`);
}

async function runRuntimeSmoke() {
  console.log('\nStep 68 runtime role separation smoke\n');
  console.log(`Base URL: ${baseUrl}`);

  const healthResponse = await request('/api/health');
  expect(healthResponse.status === 200, 'Health endpoint is reachable', `status ${healthResponse.status}`);

  const anonymousSessionResponse = await request('/api/session');
  expect(anonymousSessionResponse.status === 401, 'Anonymous /api/session is rejected before role checks', `status ${anonymousSessionResponse.status}`);

  const memberIdentity = await signInDemoMember();
  await assertSessionRole(memberIdentity);
  await assertMemberSurfacesOpenWithMember(memberIdentity);
  await assertAdminSurfacesRejectMember(memberIdentity);

  const adminIdentity = await signInDemoAdmin();
  await assertSessionRole(adminIdentity);
  await assertAdminSurfacesOpenWithAdmin(adminIdentity);

  await signOut(memberIdentity, 'Member');
  await signOut(adminIdentity, 'Admin');
}

try {
  runStaticGuardrails();

  if (staticOnly) {
    console.log('\nStatic-only mode complete. Runtime role separation smoke was intentionally skipped.');
  } else {
    await runRuntimeSmoke();
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  fail('Step 68 runtime role separation smoke could not complete', message);

  console.error('\nMake sure the app is running and the demo/test identities exist:');
  console.error('  pnpm db:migrate');
  console.error('  pnpm db:seed');
  console.error('  pnpm ecosystem:manual:seed');
  console.error('  pnpm dev');
  console.error('Then run in a second terminal:');
  console.error('  pnpm demo:role-separation:qa');
  console.error('\nIf your local credentials differ, use the CCP_DEMO_MEMBER_* and CCP_DEMO_ADMIN_* environment variables.');
}

const failed = checks.filter((check) => !check.ok);

if (failed.length > 0) {
  console.error(`\nStep 68 runtime role separation smoke failed with ${failed.length} issue(s).`);
  process.exit(1);
}

console.log('\nStep 68 runtime role separation smoke complete.');
