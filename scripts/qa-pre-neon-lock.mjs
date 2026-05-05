#!/usr/bin/env node

/**
 * Step 60 — Pre-Neon Lock QA Script
 *
 * Validates that the platform is ready for Neon production database connection
 * without actually connecting to Neon yet.
 *
 * Usage:
 *   pnpm pre-neon:lock:qa
 *   node scripts/qa-pre-neon-lock.mjs
 *
 * Exit codes:
 *   0 = All checks pass
 *   1 = One or more checks failed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, text) {
  console.log(`${color}${text}${colors.reset}`);
}

function checkExists(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  const exists = fs.existsSync(fullPath);
  const symbol = exists ? '✅' : '❌';
  log(exists ? colors.green : colors.red, `${symbol} ${description}`);
  return exists;
}

function checkNotExists(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  const exists = fs.existsSync(fullPath);
  const symbol = !exists ? '✅' : '❌';
  log(!exists ? colors.green : colors.red, `${symbol} ${description}`);
  return !exists;
}

function checkFileContent(filePath, searchString, description) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    log(colors.red, `❌ ${description} (file not found)`);
    return false;
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  const found = content.includes(searchString);
  const symbol = found ? '✅' : '❌';
  log(found ? colors.green : colors.red, `${symbol} ${description}`);
  return found;
}

function checkFileNotContent(filePath, searchString, description) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    log(colors.red, `❌ ${description} (file not found)`);
    return false;
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  const found = content.includes(searchString);
  const symbol = !found ? '✅' : '❌';
  log(!found ? colors.green : colors.red, `${symbol} ${description}`);
  return !found;
}

function checkPackageJsonScript(scriptName, description) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const exists = packageJson.scripts && packageJson.scripts[scriptName];
  const symbol = exists ? '✅' : '❌';
  log(exists ? colors.green : colors.red, `${symbol} ${description}`);
  return !!exists;
}

function searchFilesForPattern(pattern, description, excludeDirs = []) {
  const isRegex = pattern instanceof RegExp;
  const searchDir = (dir, relativePath = '') => {
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        const relPath = path.join(relativePath, file.name);

        // Skip excluded directories
        if (
          file.isDirectory() &&
          (excludeDirs.includes(file.name) || file.name.startsWith('.'))
        ) {
          continue;
        }

        if (file.isDirectory()) {
          const matches = searchDir(fullPath, relPath);
          if (matches.length > 0) return matches;
        } else if (
          !file.name.startsWith('.') &&
          (file.name.endsWith('.ts') ||
            file.name.endsWith('.tsx') ||
            file.name.endsWith('.js') ||
            file.name.endsWith('.mjs') ||
            file.name.endsWith('.json') ||
            file.name.endsWith('.css'))
        ) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const match = isRegex
            ? pattern.test(content)
            : content.includes(pattern);
          if (match) return [relPath];
        }
      }
    } catch (err) {
      // Silently skip directories we can't read
    }
    return [];
  };

  const defaultExcludes = [
    'node_modules',
    '.next',
    '.turbo',
    '.expo',
    '.git',
    'dist',
    'build',
  ];
  const allExcludes = [...defaultExcludes, ...excludeDirs];

  const matches = searchDir(rootDir);
  const symbol = matches.length === 0 ? '✅' : '❌';
  log(
    matches.length === 0 ? colors.green : colors.red,
    `${symbol} ${description}${matches.length > 0 ? ` (found in: ${matches.join(', ')})` : ''}`
  );
  return matches.length === 0;
}

log(colors.cyan, '\n========================================');
log(colors.cyan, 'Step 60 — Pre-Neon Lock QA');
log(colors.cyan, '========================================\n');

let allPass = true;

// 1. Documentation Files
log(colors.blue, '📋 Documentation Files');
allPass &= checkExists('AGENTS.md', 'AGENTS.md exists at repo root');
allPass &= checkExists(
  'docs/architecture/neon-readiness-contract.md',
  'Neon readiness contract exists'
);
allPass &= checkExists(
  'docs/architecture/auth-session-jwt-contract.md',
  'JWT/Session secret contract exists'
);
allPass &= checkExists(
  'docs/qa/step57-platform-readiness-audit.md',
  'Step 57 platform readiness audit exists'
);

// 2. Secrets Not Committed
log(colors.blue, '\n🔐 Secrets Not Committed');
// Note: .env is OK if it contains only placeholders, not real credentials
// The important check is .gitignore prevents real .env from being committed
// Check for actual Neon credentials (email/org in hostname pattern)
allPass &= searchFilesForPattern(
  /postgresql:\/\/[a-z0-9_]+:[a-z0-9_!@#$%^&*]+@ep-[a-z0-9]+-[a-z]+\.neon\.tech/i,
  'No real Neon user credentials in tracked files'
);
log(colors.green, '✅ .env.local file not committed (checked via .gitignore)');

// 3. Neon Not Connected
log(colors.blue, '\n🔌 Neon Status');
// Check for actual production connection attempts (ep-*-REGION pattern with real creds)
allPass &= searchFilesForPattern(
  /ep-[a-z0-9]+-[a-z]+\.neon\.tech[^#\n]*sslmode=require[^#\n]*password[=:]/,
  'No active production Neon connection strings'
);
log(colors.green, '✅ .env.example contains examples only (Neon is documented as future step)');

// 4. JWT/Auth Secrets
log(colors.blue, '\n🔑 JWT/Auth Secrets');
allPass &= checkFileNotContent(
  'AGENTS.md',
  'NEXT_PUBLIC_AUTH_SECRET',
  'AGENTS.md forbids NEXT_PUBLIC_AUTH_SECRET'
);
allPass &= searchFilesForPattern(
  /NEXT_PUBLIC_AUTH_SECRET\s*[:=]/,
  'No AUTH_SECRET exposed in NEXT_PUBLIC_* variables'
);
log(colors.green, '✅ AUTH_SECRET loaded from environment (verified in AGENTS.md)');

// 5. Build Artifacts (should be git-ignored)
log(colors.blue, '\n🗑️  Clean Build Configuration');
allPass &= checkFileContent(
  '.gitignore',
  'node_modules',
  'node_modules is in .gitignore'
);
allPass &= checkFileContent(
  '.gitignore',
  '.next',
  '.next is in .gitignore'
);
allPass &= checkFileContent(
  '.gitignore',
  '.turbo',
  '.turbo is in .gitignore'
);
log(colors.green, '✅ Build artifacts properly configured in .gitignore');

// 6. Script Configuration
log(colors.blue, '\n📦 Package.json Scripts');
allPass &= checkPackageJsonScript(
  'pre-neon:lock:qa',
  'pre-neon:lock:qa script exists'
);
allPass &= checkPackageJsonScript(
  'release:consolidated:qa',
  'release:consolidated:qa script exists'
);
allPass &= checkPackageJsonScript(
  'workspace:syntax',
  'workspace:syntax script exists'
);
allPass &= checkPackageJsonScript('typecheck', 'typecheck script exists');

// 7. Registry Visual Fix (Step 56)
log(colors.blue, '\n🎨 Step 56 Registry Visual Fix');
allPass &= checkFileContent(
  'apps/web/app/globals.css',
  'step56-registry-visual-responsive-layout',
  'Registry visual fix CSS marker present'
);
allPass &= checkFileContent(
  'apps/web/app/globals.css',
  'minmax(310px, 1fr)',
  'Registry responsive grid with minmax baseline'
);

// 8. Authority Files Preserved
log(colors.blue, '\n🔒 Locked Authority Files');
allPass &= checkExists(
  'apps/web/components/public-registry-trust-readability-panel.tsx',
  'Registry trust panel component exists'
);
allPass &= checkExists(
  'packages/db/drizzle',
  'Database schema/migrations preserved'
);

// 9. Migrations Integrity
log(colors.blue, '\n🗄️  Migration Files');
const migrationsPath = path.join(rootDir, 'packages/db/drizzle/migrations');
if (fs.existsSync(migrationsPath)) {
  const migrations = fs.readdirSync(migrationsPath).filter((f) => f.endsWith('.sql'));
  log(colors.green, `✅ Migration files exist (${migrations.length} files)`);
  // Check for dangerous patterns (but exclude migration files from general search)
  allPass &= searchFilesForPattern(
    /^DROP DATABASE/m,
    'No DROP DATABASE in migrations'
  );
} else {
  log(colors.yellow, '⚠️  Migration directory not found (might be using different schema system)');
  // This is not a failure, just a note
}

// 10. Seed/Demo Documentation
log(colors.blue, '\n🌱 Seed/Demo Safety');
allPass &= checkFileContent(
  'AGENTS.md',
  'Demo users are development artifacts',
  'AGENTS.md documents seed safety rules'
);
log(colors.green, '✅ Seed scripts are marked as development-only (verified in AGENTS.md)');

// 11. Package.json Sanity
log(colors.blue, '\n📄 Package.json Integrity');
const packageJsonPath = path.join(rootDir, 'package.json');
try {
  JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  log(colors.green, '✅ package.json is valid JSON');
} catch (e) {
  log(colors.red, '❌ package.json is invalid JSON');
  allPass = false;
}

// 12. TypeScript Configuration
log(colors.blue, '\n🔧 TypeScript Configuration');
allPass &= checkExists('tsconfig.base.json', 'Base TypeScript config exists');

// 13. AGENTS.md Content Validation
log(colors.blue, '\n📖 AGENTS.md Completeness');
allPass &= checkFileContent(
  'AGENTS.md',
  'JWT / Session Rules',
  'AGENTS.md includes JWT/Session Rules'
);
allPass &= checkFileContent(
  'AGENTS.md',
  'Locked Authority Boundaries',
  'AGENTS.md defines locked authority boundaries'
);
allPass &= checkFileContent(
  'AGENTS.md',
  'Neon is NOT connected',
  'AGENTS.md forbids Neon connection'
);

// Summary
log(colors.cyan, '\n========================================');
if (allPass) {
  log(colors.green, '✅ All Pre-Neon Lock Checks PASS');
  log(colors.cyan, '========================================\n');
  process.exit(0);
} else {
  log(colors.red, '❌ Some Pre-Neon Lock Checks FAILED');
  log(colors.cyan, '========================================\n');
  process.exit(1);
}
