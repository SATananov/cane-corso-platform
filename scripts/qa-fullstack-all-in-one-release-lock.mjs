#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'package.json',
  '.env.example',
  'AGENTS.md',
  'docs/architecture/full-stack-requirements.md',
  'docs/architecture/nextjs-rendering-data-cache-map.md',
  'docs/architecture/performance-optimization-pass.md',
  'docs/architecture/production-readiness-final-checklist.md',
  'docs/architecture/neon-readiness-contract.md',
  'docs/architecture/auth-session-jwt-contract.md',
  'docs/release/fullstack-nextjs-product-release-final-lock.md',
  'docs/qa/final-fullstack-nextjs-product-release-lock.md',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
];

const requiredPackageScripts = [
  'requirements:qa',
  'platform:product-release:qa',
  'demo:release-candidate-lock:qa',
  'owner:submission-happy-path:qa',
  'admin:moderation-action-flow:qa',
  'registry:certificate-release-flow:qa',
  'nextjs:rendering-cache:qa',
  'performance:optimization:qa',
  'production:readiness:qa',
  'submission:qna:qa',
  'pre-neon:lock:qa',
  'workspace:verify',
  'workspace:syntax',
  'typecheck',
  'release:all:qa',
  'release:fullstack-final:qa',
];

const qaScripts = [
  ['Full-stack requirements', 'scripts/qa-full-stack-requirements.mjs'],
  ['Product release pack', 'scripts/qa-platform-product-release-pack.mjs'],
  ['Demo release candidate lock', 'scripts/qa-demo-release-candidate-lock.mjs'],
  ['Owner submission happy path', 'scripts/qa-owner-submission-happy-path.mjs'],
  ['Admin moderation action flow', 'scripts/qa-admin-moderation-action-flow.mjs'],
  ['Registry certificate release flow', 'scripts/qa-registry-certificate-release-flow.mjs'],
  ['Next.js rendering/data/cache map', 'scripts/qa-nextjs-rendering-cache-map.mjs'],
  ['Performance optimization pass', 'scripts/qa-performance-optimization-pass.mjs'],
  ['Production readiness cleanup', 'scripts/qa-production-readiness-cleanup.mjs'],
  ['Submission Q&A package', 'scripts/qa-submission-qna-package.mjs'],
  ['Pre-Neon lock', 'scripts/qa-pre-neon-lock.mjs'],
  ['Workspace foundation verification', 'scripts/verify-workshop-foundation.mjs'],
  ['Workspace syntax check', 'scripts/check-workshop-syntax.mjs'],
];

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function assertFile(file) {
  if (!existsSync(path.join(root, file))) fail(`Required file missing: ${file}`);
  else pass(`Required file exists: ${file}`);
}

function walk(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const rel = path.relative(root, full).replaceAll(path.sep, '/');
    const st = statSync(full);
    if (st.isDirectory()) walk(full, results);
    else results.push(rel);
  }
  return results;
}

console.log('\n========================================');
console.log('Cane Corso Platform — Full-Stack All-in-One Release Lock QA');
console.log('========================================\n');

for (const file of requiredFiles) assertFile(file);

const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const scriptName of requiredPackageScripts) {
  if (!pkg.scripts?.[scriptName]) fail(`Package script missing: ${scriptName}`);
  else pass(`Package script exists: ${scriptName}`);
}

const files = walk(root);
const forbiddenPatterns = [
  /(^|\/)node_modules\//,
  /(^|\/)\.next\//,
  /(^|\/)\.turbo\//,
  /(^|\/)\.expo\//,
  /(^|\/)\.git\//,
  /(^|\/)package-lock\.json$/,
  /(^|\/)yarn\.lock$/,
  /\.log$/,
  /\.zip$/,
  /\.tsbuildinfo$/,
];
const forbidden = files.filter((file) => forbiddenPatterns.some((pattern) => pattern.test(file)));
if (forbidden.length > 0) {
  fail(`Forbidden artifacts found:\n${forbidden.slice(0, 50).join('\n')}`);
} else {
  pass('No forbidden clean-ZIP artifacts found in working tree');
}

const envFiles = files.filter((file) => /(^|\/)\.env(\..*)?$/.test(file) && file !== '.env.example');
if (envFiles.length > 0) fail(`Real environment files found: ${envFiles.join(', ')}`);
else pass('No real environment files committed; .env.example only');

for (const [label, script] of qaScripts) {
  if (!existsSync(path.join(root, script))) {
    fail(`${label} script missing: ${script}`);
    continue;
  }
  console.log(`\n--- ${label} ---`);
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, CCP_STATIC_ONLY: '1' },
  });
  if (result.status !== 0) {
    fail(`${label} failed with exit code ${result.status}`);
    break;
  }
  pass(`${label} passed`);
}

if (process.exitCode) {
  console.error('\n========================================');
  console.error('Full-stack all-in-one release lock QA FAILED');
  console.error('========================================');
  process.exit(process.exitCode);
}

console.log('\n========================================');
console.log('Full-stack all-in-one release lock QA PASS');
console.log('========================================');
console.log('\nNext local commands:');
console.log('  pnpm workspace:verify');
console.log('  pnpm workspace:syntax');
console.log('  pnpm typecheck');
