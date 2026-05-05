#!/usr/bin/env node

/**
 * Step 71 — Public Surface Content Runtime Smoke
 *
 * Step 70 proved anonymous public routes are reachable. Step 71 proves those
 * same routes render meaningful public content and do not accidentally show
 * protected-route access notices or server error shells.
 *
 * Usage:
 *   pnpm demo:public-surface-content:static:qa
 *   pnpm demo:public-surface-content:qa
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
  'demo:public-surface-content:qa': 'node scripts/qa-demo-public-surface-content-smoke.mjs',
  'demo:public-surface-content:static:qa': 'node scripts/qa-demo-public-surface-content-smoke.mjs --static-only',
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

const publicSurfaces = [
  {
    route: '/',
    file: 'apps/web/app/page.tsx',
    sourceTokens: ['EntryExperience'],
    contentHints: ['UNICO SUO GENERE', 'Cane Corso', 'Влез в платформата', 'Enter the platform', 'Екосистема Cane Corso'],
  },
  {
    route: '/access',
    file: 'apps/web/app/access/page.tsx',
    sourceTokens: ['MemberAccessPanel', 'OwnerOnboardingFinalPanel', 'getOptionalCookieMemberSession'],
    contentHints: ['USG access', 'USG достъп', 'Път на достъпа', 'Access path', 'Create a personal member account', 'Създай личен членски акаунт'],
  },
  {
    route: '/platform',
    file: 'apps/web/app/(public)/platform/page.tsx',
    sourceTokens: ['Master plan structure', 'Cane Corso', 'getOptionalCookieMemberSession'],
    contentHints: ['A living Cane Corso world', 'Жив Cane Corso свят', 'Master plan structure', 'Community layer'],
  },
  {
    route: '/registry',
    file: 'apps/web/app/(public)/registry/page.tsx',
    sourceTokens: ['PublicRegistryOverview', 'getPublishedRegistryDocument', 'getOptionalCookieMemberSession'],
    contentHints: ['Public registry', 'Регистър', 'Registry', 'Cane Corso', 'USG registry'],
  },
  {
    route: '/gallery',
    file: 'apps/web/app/(public)/gallery/page.tsx',
    sourceTokens: ['PageShell', 'Gallery', 'Cane Corso'],
    contentHints: ['Gallery', 'Галерия', 'Cane Corso', 'showcase', 'визуал'],
  },
  {
    route: '/certified',
    file: 'apps/web/app/(public)/certified/page.tsx',
    sourceTokens: ['PageShell', 'Certified'],
    contentHints: ['Certified', 'Сертифицирани', 'USG', 'certificate', 'сертификат'],
  },
  {
    route: '/knowledge',
    file: 'apps/web/app/(public)/knowledge/page.tsx',
    sourceTokens: ['Knowledge', 'Cane Corso'],
    contentHints: ['Knowledge', 'Знания', 'Cane Corso', 'breed', 'породата'],
  },
  {
    route: '/partners',
    file: 'apps/web/app/(public)/partners/page.tsx',
    sourceTokens: ['Partners', 'partner'],
    contentHints: ['Partners', 'Партньори', 'partner', 'services', 'услуги'],
  },
  {
    route: '/community',
    file: 'apps/web/app/(public)/community/page.tsx',
    sourceTokens: ['Community', 'ecosystem'],
    contentHints: ['Community', 'Общност', 'ecosystem', 'екосистема', 'Cane Corso'],
  },
  {
    route: '/verify',
    file: 'apps/web/app/verify/page.tsx',
    sourceTokens: ['VerifyEntryPanel', 'Verify belongs to certificate trust', 'PageShell'],
    contentHints: ['Verify', 'Сертификат', 'certificate trust', 'сертификатното доверие', 'Registry'],
  },
  {
    route: '/guide',
    file: 'apps/web/app/(public)/guide/page.tsx',
    sourceTokens: ['Guide and help', 'About the platform', 'PageShell'],
    contentHints: ['Guide and help', 'Наръчник и помощ', 'About the platform', 'За платформата', 'Guide'],
  },
  {
    route: '/faq',
    file: 'apps/web/app/(public)/faq/page.tsx',
    sourceTokens: ['Чести въпроси', 'Clear answers before', 'PageShell'],
    contentHints: ['Чести въпроси', 'Clear answers', 'FAQ', 'Published in registry', 'Ясни отговори'],
  },
  {
    route: '/manifesto',
    file: 'apps/web/app/(public)/manifesto/page.tsx',
    sourceTokens: ['Manifesto', 'Position before aesthetics', 'Cane Corso only'],
    contentHints: ['Manifesto', 'Манифест', 'Position before aesthetics', 'Позиция преди визия', 'Cane Corso only'],
  },
];

const requiredBoundaryDocs = [
  'docs/qa/step66-demo-runtime-session-member-smoke.md',
  'docs/qa/step67-admin-runtime-session-smoke.md',
  'docs/qa/step68-runtime-role-separation-smoke.md',
  'docs/qa/step69-session-boundary-release-lock.md',
  'docs/qa/step70-public-runtime-access-smoke.md',
  'docs/qa/step71-public-surface-content-runtime-smoke.md',
];

const protectedNoticePatterns = [
  /You need member access to continue\./i,
  /You need admin access to continue\./i,
  /Трябва да влезеш като член/i,
  /Трябва да влезеш като администратор/i,
  /Необходим е администраторски достъп/i,
  /Devi accedere come membro/i,
  /Devi accedere come amministratore/i,
];

const visibleServerErrorPatterns = [
  /<title>\s*(500|Internal Server Error|Application error)\s*<\/title>/i,
  /<h1[^>]*>\s*(500|Internal Server Error|Application error)\s*<\/h1>/i,
  /<meta[^>]+name=["']next-error["'][^>]+content=["'](500|true)["']/i,
  /data-nextjs-error/i,
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

function includesAny(content, needles) {
  return needles.some((needle) => content.includes(needle));
}

function includesAll(content, needles) {
  return needles.every((needle) => content.includes(needle));
}

function compactBody(body) {
  return body.replace(/\s+/g, ' ').slice(0, 260);
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

function checkPublicSurfaceFiles() {
  for (const surface of publicSurfaces) {
    expect(exists(surface.file), `Public surface ${surface.route} page file exists`, surface.file);
    if (!exists(surface.file)) {
      continue;
    }

    const source = read(surface.file);
    expect(
      includesAll(source, surface.sourceTokens),
      `Public surface ${surface.route} keeps expected source content anchors`,
      surface.sourceTokens.join(', '),
    );
  }
}

function checkDocs() {
  for (const file of requiredBoundaryDocs) {
    expect(exists(file), `QA document exists: ${file}`);
  }

  const step70Doc = read('docs/qa/step70-public-runtime-access-smoke.md');
  expect(
    includesAll(step70Doc, ['public pages', 'anonymous visitors', 'Step 66', 'Step 69']),
    'Step 70 document keeps the public runtime access boundary history',
  );

  const step71Doc = read('docs/qa/step71-public-surface-content-runtime-smoke.md');
  expect(
    includesAll(step71Doc, ['Public Surface Content Runtime Smoke', 'demo:public-surface-content:qa', 'Step 70']),
    'Step 71 document records the public content runtime smoke command and dependency',
  );
}

function checkPriorRuntimeScripts() {
  const step70Script = read('scripts/qa-demo-public-runtime-access-smoke.mjs');
  const step69Script = read('scripts/qa-demo-session-boundary-release-lock.mjs');
  const roleScript = read('scripts/qa-demo-runtime-role-separation-smoke.mjs');

  expect(step70Script.includes('Step 70 — Public Runtime Access Smoke'), 'Step 70 public runtime access script remains present');
  expect(step69Script.includes('Step 69 — Session Boundary Release Lock'), 'Step 69 session boundary release script remains present');
  expect(roleScript.includes('Member session cannot open'), 'Step 68 role separation script still proves member/admin separation');
}

async function request(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: 'GET',
    redirect: 'manual',
    headers: {
      'user-agent': 'ccp-step71-public-surface-content-smoke',
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

function hasServerErrorShell(status, body) {
  if (status >= 500) {
    return true;
  }

  // Next.js dev/prod HTML can contain generic strings from runtime bundles or
  // preloaded metadata. Step 70 already proves the route returns a successful
  // response; Step 71 should only fail on a visible rendered error shell.
  return visibleServerErrorPatterns.some((pattern) => pattern.test(body));
}

function hasProtectedNotice(body) {
  return protectedNoticePatterns.some((pattern) => pattern.test(body));
}

async function runRuntimeChecks() {
  console.log(`\nStep 71 public surface content runtime smoke\n\nBase URL: ${baseUrl}`);

  try {
    const health = await fetch(`${baseUrl}/api/health`, { redirect: 'manual' });
    expect(health.ok, 'Health endpoint is reachable', `status ${health.status}`);
  } catch (error) {
    fail('Step 71 public surface content runtime smoke could not complete', error.message);
    return;
  }

  for (const surface of publicSurfaces) {
    try {
      const { response, body } = await request(surface.route);
      const shortBody = compactBody(body);

      expect(
        isOkPublicStatus(response.status),
        `Anonymous public surface ${surface.route} returns HTTP 2xx`,
        `status ${response.status}; ${shortBody}`,
      );
      expect(
        !isAccessRedirect(response),
        `Anonymous public surface ${surface.route} does not redirect to Access`,
        response.headers.get('location') ?? '',
      );
      expect(
        !hasServerErrorShell(response.status, body),
        `Anonymous public surface ${surface.route} does not render a server/error shell`,
        `status ${response.status}; ${shortBody}`,
      );
      expect(
        !hasProtectedNotice(body),
        `Anonymous public surface ${surface.route} does not render protected-route notice copy`,
        shortBody,
      );
      expect(
        body.length > 900,
        `Anonymous public surface ${surface.route} renders a non-empty document`,
        `length ${body.length}`,
      );
      expect(
        includesAny(body, surface.contentHints),
        `Anonymous public surface ${surface.route} renders expected public content hints`,
        surface.contentHints.join(' | '),
      );
    } catch (error) {
      fail(`Anonymous public surface ${surface.route} can be fetched`, error.message);
    }
  }
}

async function main() {
  console.log('\nStep 71 static guardrails\n');

  const packageJson = JSON.parse(read('package.json'));
  checkPackageScripts(packageJson);
  checkPublicSurfaceFiles();
  checkDocs();
  checkPriorRuntimeScripts();

  if (staticOnly) {
    console.log('\nStatic-only mode complete. Runtime public surface content smoke was intentionally skipped.');
  } else {
    await runRuntimeChecks();
  }

  const failed = checks.filter((check) => !check.ok);

  if (failed.length > 0) {
    console.error(`\nStep 71 public surface content runtime smoke failed with ${failed.length} issue(s).`);
    if (!staticOnly) {
      console.error('\nMake sure the app is running before the runtime smoke:');
      console.error('  pnpm dev');
      console.error('Then run in a second terminal:');
      console.error('  pnpm demo:public-surface-content:qa');
      console.error('\nIf your app uses another port, set:');
      console.error('  $env:CCP_DEMO_RUNTIME_BASE_URL = "http://localhost:3001"');
    }
    process.exit(1);
  }

  console.log('\nStep 71 public surface content runtime smoke complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
