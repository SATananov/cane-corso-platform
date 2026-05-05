#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function expect(condition, message) {
  if (condition) {
    pass(message);
    return;
  }

  fail(message);
}

const seed = read('packages/db/scripts/seed-demo-member.mjs');
const signInRoute = read('apps/web/app/api/auth/sign-in/route.ts');
const packageJson = JSON.parse(read('package.json'));

expect(seed.includes('DemoMember123!'), 'Demo seed references the demo member password');
expect(seed.includes('INSERT INTO auth_local_credentials'), 'Demo seed creates or upserts local auth credentials');
expect(seed.includes('ON CONFLICT (user_id) DO UPDATE SET'), 'Demo seed remains idempotent for the credential row');
expect(!seed.includes('console.log(passwordHash)'), 'Demo seed does not print the password hash');
expect(!seed.includes('console.log(`') || !seed.includes('${passwordHash}'), 'Demo seed does not interpolate the password hash into logs');
expect(signInRoute.includes('verifyMemberCredentials'), 'Sign-in route still uses verifyMemberCredentials');
expect(packageJson.scripts?.['demo:seed-auth:qa'] === 'node scripts/qa-demo-seed-auth-credentials.mjs', 'Root package exposes the demo seed auth QA script');

const trackedEnvFiles = execSync(
  'git ls-files -- .env .env.local apps/web/.env.local packages/db/.env',
  { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
).trim();

expect(trackedEnvFiles.length === 0, 'No .env files are tracked by git');

if (process.exitCode) {
  console.error('\nDemo seed auth credential QA failed.');
  process.exit(process.exitCode);
}

console.log('\nDemo seed auth credential QA complete.');