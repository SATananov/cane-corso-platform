#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const expectedDatabase = process.env.CCP_EXPECTED_DATABASE ?? 'cane_corso_platform';
const runtimeBaseUrl = (process.env.CCP_RUNTIME_BASE_URL ?? '').replace(/\/$/, '');
const runRuntime = process.argv.includes('--runtime') || Boolean(runtimeBaseUrl);
const checks = [];

function resolve(relativePath) {
  return path.join(root, relativePath);
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
  condition ? pass(label) : fail(label, detail);
}

function assertNoDemoDatabaseTarget(content, label) {
  expect(!/DATABASE_URL[^\n]*cane_corso_platform_demo/i.test(content), `${label} does not document demo as runtime DATABASE_URL`);
  expect(!/DATABASE_URL_DIRECT[^\n]*cane_corso_platform_demo/i.test(content), `${label} does not document demo as migration DATABASE_URL_DIRECT`);
}

async function runRuntimeCheck() {
  const baseUrl = runtimeBaseUrl || 'http://localhost:3000';
  const endpoint = `${baseUrl}/api/health/db`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        accept: 'application/json',
        'user-agent': 'ccp-step84-db-target-guardrail',
      },
      redirect: 'manual',
    });
    const body = await response.json();
    const data = body?.data;

    expect(response.status === 200, 'Runtime DB health endpoint returns 200 OK', `status ${response.status}`);
    expect(body?.ok === true, 'Runtime DB health response uses the API success envelope');
    expect(data?.status === 'ok', 'Runtime DB target status is ok', `status ${data?.status ?? 'missing'}`);
    expect(data?.expectedDatabase === expectedDatabase, `Runtime expected database is ${expectedDatabase}`);
    expect(data?.activeDatabase === expectedDatabase, `Runtime active database is ${expectedDatabase}`, `active: ${data?.activeDatabase ?? 'missing'}`);
    expect(data?.configuredRuntimeDatabase === expectedDatabase, `Runtime DATABASE_URL points to ${expectedDatabase}`, `configured: ${data?.configuredRuntimeDatabase ?? 'missing'}`);
    expect(data?.configuredMigrationDatabase === expectedDatabase, `Runtime DATABASE_URL_DIRECT points to ${expectedDatabase}`, `configured: ${data?.configuredMigrationDatabase ?? 'missing'}`);
    expect(data?.databaseMatchesExpected === true, 'Runtime active database matches expected target');
    expect(data?.runtimeDatabaseMatchesExpected === true, 'Runtime DATABASE_URL matches expected target');
    expect(data?.migrationDatabaseMatchesExpected === true, 'Runtime DATABASE_URL_DIRECT matches expected target');
  } catch (error) {
    fail('Runtime DB target smoke could not complete', error instanceof Error ? error.message : String(error));
  }
}

console.log('--- Step 84 runtime DB target guardrail QA ---');

const packageJson = JSON.parse(read('package.json'));
expect(packageJson.scripts?.['db:target:qa'] === 'node scripts/qa-runtime-db-target-guardrail.mjs', 'Package script db:target:qa exists');
expect(exists('apps/web/app/api/health/db/route.ts'), 'Runtime DB health route exists');
expect(exists('apps/web/lib/database-target.server.ts'), 'Runtime DB target server helper exists');
expect(exists('docs/qa/step84-runtime-db-target-guardrail.md'), 'Step 84 QA document exists');

const route = read('apps/web/app/api/health/db/route.ts');
expect(route.includes("export const runtime = 'nodejs'"), 'DB health route is forced to Node.js runtime for pg');
expect(route.includes("export const dynamic = 'force-dynamic'"), 'DB health route is dynamic and not cached');
expect(route.includes('getRuntimeDatabaseTargetDocument'), 'DB health route uses the runtime DB target helper');
expect(route.includes("'cache-control': 'no-store'"), 'DB health route disables response caching');

const helper = read('apps/web/lib/database-target.server.ts');
expect(helper.includes("DEFAULT_EXPECTED_DATABASE = 'cane_corso_platform'"), 'Runtime helper defaults to the main production database');
expect(helper.includes('DATABASE_EXPECTED_NAME'), 'Runtime helper supports DATABASE_EXPECTED_NAME override');
expect(helper.includes('current_database()') && helper.includes('current_schema()'), 'Runtime helper queries PostgreSQL for current_database and current_schema');
expect(helper.includes('getConfiguredDatabaseName'), 'Runtime helper parses database names without exposing full connection strings');
expect(!helper.includes('console.log(process.env.DATABASE_URL'), 'Runtime helper does not log DATABASE_URL');

const healthTypes = read('packages/contracts/src/common/health-api.types.ts');
expect(healthTypes.includes('DatabaseTargetHealthDocument'), 'Contracts export DatabaseTargetHealthDocument');
expect(healthTypes.includes("status: 'ok' | 'misconfigured' | 'unavailable'"), 'DB target contract includes guardrail statuses');

const pgTypes = read('packages/db/src/pg.d.ts');
expect(pgTypes.includes('query<TRow'), 'pg declaration supports typed Pool.query for runtime health');

const rootEnvExample = read('.env.example');
expect(rootEnvExample.includes('DATABASE_EXPECTED_NAME=cane_corso_platform'), 'Root .env.example documents DATABASE_EXPECTED_NAME');
assertNoDemoDatabaseTarget(rootEnvExample, 'Root .env.example');

const webEnvExample = read('apps/web/.env.example');
expect(webEnvExample.includes('DATABASE_EXPECTED_NAME=cane_corso_platform'), 'Web .env.example documents DATABASE_EXPECTED_NAME');
assertNoDemoDatabaseTarget(webEnvExample, 'Web .env.example');

const deployGuide = read('docs/deploy/netlify-deployment-guide.md');
expect(deployGuide.includes('DATABASE_EXPECTED_NAME=cane_corso_platform'), 'Netlify deploy guide documents the expected live DB target');
expect(deployGuide.includes('/api/health/db'), 'Netlify deploy guide documents the runtime DB health endpoint');
expect(deployGuide.includes('Deploy project without cache'), 'Netlify deploy guide recommends no-cache deploy after env changes');

const agents = read('AGENTS.md');
expect(!agents.includes('Neon is NOT connected yet'), 'AGENTS no longer says Neon is not connected');
expect(agents.includes('Live target database: `cane_corso_platform`'), 'AGENTS documents the live target database');
expect(agents.includes('Demo/reference database: `cane_corso_platform_demo`'), 'AGENTS documents demo database separation');
expect(agents.includes('/api/health/db'), 'AGENTS documents runtime DB target verification');

const lockedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/auth/sign-in/route.ts',
  'apps/web/app/api/auth/sign-up/route.ts',
];

for (const file of lockedFiles) {
  expect(exists(file), `Locked file still exists: ${file}`);
}

if (runRuntime) {
  await runRuntimeCheck();
} else {
  pass('Runtime fetch skipped by default; set CCP_RUNTIME_BASE_URL and run with --runtime after deploy');
}

const failed = checks.filter((check) => !check.ok);
if (failed.length) {
  console.error(`\nStep 84 runtime DB target guardrail QA failed: ${failed.length} issue(s).`);
  process.exit(1);
}

console.log('\nStep 84 runtime DB target guardrail QA complete.');
