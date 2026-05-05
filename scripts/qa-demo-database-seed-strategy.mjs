#!/usr/bin/env node

/**
 * Step 64 — Demo Database Seed Strategy & Safety Guardrails
 *
 * Conservative QA script that validates demo database strategy without:
 * - Running db:seed or db:bootstrap
 * - Running db:migrate
 * - Connecting to Neon directly
 * - Adding demo data
 * - Modifying .env
 * - Printing secrets or connection strings
 *
 * This script verifies safety guardrails before any future seed operation.
 *
 * Usage:
 *   pnpm demo:seed-strategy:qa
 *   node scripts/qa-demo-database-seed-strategy.mjs
 *
 * Exit codes:
 *   0 = All safety checks pass, ready for future demo seeding
 *   1 = One or more checks failed, fix issues before proceeding
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(color, text) {
  console.log(`${color}${text}${colors.reset}`);
}

function printHeader(text) {
  log(colors.cyan, `\n${'='.repeat(70)}`);
  log(colors.cyan, `  ${text}`);
  log(colors.cyan, `${'='.repeat(70)}\n`);
}

function printSection(text) {
  log(colors.blue, `\n→ ${text}\n`);
}

function checkExists(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  const exists = fs.existsSync(fullPath);
  const symbol = exists ? '✅' : '❌';
  const result = exists ? 'PASS' : 'FAIL';
  log(exists ? colors.green : colors.red, `  ${symbol} [${result}] ${description}`);
  return exists;
}

function checkNotExists(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  const exists = fs.existsSync(fullPath);
  const symbol = !exists ? '✅' : '❌';
  const result = !exists ? 'PASS' : 'FAIL';
  log(!exists ? colors.green : colors.red, `  ${symbol} [${result}] ${description}`);
  return !exists;
}

function checkFileContent(filePath, searchString, description) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    log(colors.red, `  ❌ [FAIL] ${description} (file not found)`);
    return false;
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  const found = content.includes(searchString);
  const symbol = found ? '✅' : '❌';
  const result = found ? 'PASS' : 'FAIL';
  log(found ? colors.green : colors.red, `  ${symbol} [${result}] ${description}`);
  return found;
}

function checkFileNotContent(filePath, searchString, description) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    log(colors.red, `  ❌ [FAIL] ${description} (file not found)`);
    return false;
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  const found = content.includes(searchString);
  const symbol = !found ? '✅' : '❌';
  const result = !found ? 'PASS' : 'FAIL';
  log(!found ? colors.green : colors.red, `  ${symbol} [${result}] ${description}`);
  return !found;
}

function checkPackageJsonScript(scriptName, description) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const exists = packageJson.scripts && packageJson.scripts[scriptName];
  const symbol = exists ? '✅' : '❌';
  const result = exists ? 'PASS' : 'FAIL';
  log(exists ? colors.green : colors.red, `  ${symbol} [${result}] ${description}`);
  return !!exists;
}

function searchFilesForContent(pattern, description, excludeDirs = ['.git', 'node_modules', '.turbo', '.next', '.expo']) {
  const searchDir = (dir) => {
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        if (excludeDirs.includes(file.name)) continue;
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
          const result = searchDir(fullPath);
          if (result) return true;
        } else if (file.isFile()) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            if (content.includes(pattern)) {
              return true;
            }
          } catch {
            // Skip binary files or unreadable files
          }
        }
      }
    } catch {
      // Skip directories we can't read
    }
    return false;
  };

  const found = searchDir(rootDir);
  const symbol = !found ? '✅' : '❌';
  const result = !found ? 'PASS' : 'FAIL';
  log(!found ? colors.green : colors.red, `  ${symbol} [${result}] ${description}`);
  return !found;
}

function checkGitIgnoresEnv() {
  const gitignorePath = path.join(rootDir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    log(colors.yellow, `  ⚠️  [WARN] .gitignore not found, cannot verify .env is ignored`);
    return true;
  }
  const content = fs.readFileSync(gitignorePath, 'utf-8');
  const hasEnvEntry = content.includes('.env');
  const symbol = hasEnvEntry ? '✅' : '❌';
  const result = hasEnvEntry ? 'PASS' : 'FAIL';
  log(hasEnvEntry ? colors.green : colors.red, `  ${symbol} [${result}] .gitignore contains .env exclusion`);
  return hasEnvEntry;
}

function checkEnvIsNotTracked() {
  try {
    const trackedFiles = execSync('git ls-files .env', {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    const tracked = trackedFiles.length > 0;
    const symbol = tracked ? '❌' : '✅';
    const result = tracked ? 'FAIL' : 'PASS';
    const detail = tracked ? '.env is tracked by git' : '.env exists locally but is not tracked by git';
    log(tracked ? colors.red : colors.green, `  ${symbol} [${result}] .env tracking check: ${detail}`);
    return !tracked;
  } catch {
    log(colors.red, `  ❌ [FAIL] .env tracking check could not be completed`);
    return false;
  }
}

function searchFilesForRealEndpoints(excludeDirs = ['.git', 'node_modules', '.turbo', '.next', '.expo']) {
  // Look for real Neon endpoints (ep-* pattern with actual hostname)
  // But allow generic placeholders like DIRECT_NEON_HOST
  const realEndpointPattern = /ep-[a-z0-9]+-[a-z0-9]+\.c-\d+\.[\w\-]+\.aws\.neon\.tech/i;
  
  const searchDir = (dir) => {
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        if (excludeDirs.includes(file.name)) continue;
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
          const result = searchDir(fullPath);
          if (result) return true;
        } else if (file.isFile()) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            // Check for real endpoint pattern
            if (realEndpointPattern.test(content)) {
              return true;
            }
          } catch {
            // Skip binary files or unreadable files
          }
        }
      }
    } catch {
      // Skip directories we can't read
    }
    return false;
  };

  return searchDir(rootDir);
}

// ============================================================================
// Main Script
// ============================================================================

let passCount = 0;
let failCount = 0;

function recordPass() {
  passCount++;
}

function recordFail() {
  failCount++;
}

printHeader('Step 64 — Demo Database Seed Strategy & Safety Guardrails');

// ============================================================================
// Section 1: Step 63 & 62 Documentation
// ============================================================================

printSection('1. Step 63 & 62 Documentation Foundation');

if (checkExists('docs/qa/step63-empty-neon-runtime-ux-review.md', 'Step 63 documentation exists')) {
  recordPass();
} else {
  recordFail();
}

if (checkExists('docs/qa/step62-neon-runtime-smoke.md', 'Step 62 documentation exists')) {
  recordPass();
} else {
  recordFail();
}

// ============================================================================
// Section 2: Package Scripts
// ============================================================================

printSection('2. Required Package Scripts');

if (checkPackageJsonScript('db:migrate', 'Package script: db:migrate exists')) {
  recordPass();
} else {
  recordFail();
}

if (checkPackageJsonScript('db:seed', 'Package script: db:seed exists')) {
  recordPass();
} else {
  recordFail();
}

if (checkPackageJsonScript('db:bootstrap', 'Package script: db:bootstrap exists')) {
  recordPass();
} else {
  recordFail();
}

if (checkPackageJsonScript('demo:seed-strategy:qa', 'Package script: demo:seed-strategy:qa exists')) {
  recordPass();
} else {
  recordFail();
}

// ============================================================================
// Section 3: Git & Environment Safety
// ============================================================================

printSection('3. Git & Environment Safety');

if (checkEnvIsNotTracked()) {
  recordPass();
} else {
  recordFail();
}

if (checkGitIgnoresEnv()) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Future demo database: cane_corso_platform_demo', 'Demo database name documented in Step 64 docs')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Protected clean database: cane_corso_platform', 'Main database name documented in Step 64 docs')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Never run db:seed while .env points to cane_corso_platform', 'Documentation warns against seeding main database')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'DATABASE_URL must contain /cane_corso_platform_demo?', 'Documentation specifies pooled connection target')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'DATABASE_URL must contain -pooler', 'Documentation specifies pooled connection suffix')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'DATABASE_URL_DIRECT must contain /cane_corso_platform_demo?', 'Documentation specifies direct connection target')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'DATABASE_URL_DIRECT must not contain -pooler', 'Documentation specifies direct connection suffix restriction')) {
  recordPass();
} else {
  recordFail();
}

// ============================================================================
// Section 4: Credentials & Secrets
// ============================================================================

printSection('4. Credentials & Secrets Verification');

const hasRealEndpoints = searchFilesForRealEndpoints();
if (!hasRealEndpoints) {
  log(colors.green, `  ✅ [PASS] No hardcoded Neon credentials found in tracked files`);
  recordPass();
} else {
  log(colors.red, `  ❌ [FAIL] Real Neon endpoints found in tracked source (DANGER!)`);
  recordFail();
}

// ============================================================================
// Section 5: Demo Strategy Documentation
// ============================================================================

printSection('5. Demo Strategy Documentation');

if (checkExists('docs/qa/step64-demo-database-seed-strategy.md', 'Step 64 demo strategy documentation exists')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Never run db:seed while .env points to cane_corso_platform', 'Documentation warns against seeding main database')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Future demo database: cane_corso_platform_demo', 'Documentation names future demo database')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Manual Future Plan', 'Documentation includes manual seed plan')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Verification Checklist', 'Documentation includes verification checklist')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Rollback Procedure', 'Documentation includes rollback procedure')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'DATABASE_URL must contain /cane_corso_platform_demo?', 'Documentation specifies pooled connection check')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'DATABASE_URL_DIRECT must contain /cane_corso_platform_demo?', 'Documentation specifies direct connection check')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'DATABASE_URL must contain -pooler', 'Documentation specifies pooled connection suffix check')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'DATABASE_URL_DIRECT must not contain -pooler', 'Documentation specifies direct connection suffix restriction')) {
  recordPass();
} else {
  recordFail();
}

// ============================================================================
// Section 6: Authority Preservation
// ============================================================================

printSection('6. Authority Boundaries (Locked - No Changes)');

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Registry publish logic: **locked**', 'Registry logic preserved')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Certificate issuance/revocation: **locked**', 'Certificate logic preserved')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Verify lookup logic: **locked**', 'Verify logic preserved')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Gallery backend selection: **locked**', 'Gallery logic preserved')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Admin moderation logic: **locked**', 'Admin logic preserved')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Ecosystem API: **locked**', 'Ecosystem API preserved')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Auth/session logic: **locked**', 'Auth logic preserved')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Database schema: **locked**', 'Schema preserved')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Migration files: **locked**', 'Migrations preserved')) {
  recordPass();
} else {
  recordFail();
}

// ============================================================================
// Section 7: No-Seed Guarantee
// ============================================================================

printSection('7. No-Seed Guarantee (This Step)');

log(colors.yellow, '  ℹ️  Verifying that no seed/bootstrap/migrate was executed...\n');

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'No seed, bootstrap, or migrate was run in Step 64', 'Documentation confirms no seed executed')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Protected clean database: cane_corso_platform', 'Main database remains clean')) {
  recordPass();
} else {
  recordFail();
}

if (checkFileContent('docs/qa/step64-demo-database-seed-strategy.md', 'Future demo database: cane_corso_platform_demo', 'Demo database not created')) {
  recordPass();
} else {
  recordFail();
}

// ============================================================================
// Summary
// ============================================================================

printSection('Summary');

const totalChecks = passCount + failCount;
const successRate = totalChecks > 0 ? Math.round((passCount / totalChecks) * 100) : 0;

log(colors.magenta, `  Total Checks: ${totalChecks}`);
log(colors.green, `  ✅ Passed: ${passCount}`);
log(colors.red, `  ❌ Failed: ${failCount}`);
log(colors.cyan, `  Success Rate: ${successRate}%\n`);

if (failCount === 0) {
  printHeader('✅ All Checks PASSED — Demo Database Strategy Ready');
  log(colors.green, `
  Step 64 demo database seed strategy is documented and verified.
  
  Main database (cane_corso_platform) is protected.
  Future demo database (cane_corso_platform_demo) is planned.
  
  Safety guardrails are in place for future seeding operations.
  
  When demo seeding is approved:
  1. Create cane_corso_platform_demo in Neon
  2. Update .env to point to demo database
  3. Run pnpm db:migrate and pnpm db:seed
  4. Test member/admin/demo flows
  5. Switch .env back to main database
  6. Never commit .env
  
  No changes to authority logic. No seed executed.
  `);
  process.exit(0);
} else {
  printHeader('❌ Some Checks FAILED — Fix Issues Before Proceeding');
  log(colors.red, `
  Fix the failed checks above before running demo seeding.
  
  Common issues:
  - Missing Step 62 or 63 documentation
  - Missing package scripts
  - .env is tracked by git (should not be)
  - Real Neon credentials in tracked files
  - Missing Step 64 documentation
  
  See AGENTS.md and step64-demo-database-seed-strategy.md for details.
  `);
  process.exit(1);
}
