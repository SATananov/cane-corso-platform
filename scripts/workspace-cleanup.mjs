#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');

const packageNames = ['auth', 'config', 'contracts', 'db', 'storage', 'ui'];
const stalePaths = [
  'apps/web/apps',
  'apps/web/packages',
  'apps/web/scripts',
  'apps/web/.next',
  'apps/web/.turbo',
  'apps/web/node_modules',
  'apps/web/tsconfig.tsbuildinfo',
  'apps/mobile/.expo',
  'node_modules',
  '.turbo',
  ...packageNames.flatMap((packageName) => [
    `packages/${packageName}/node_modules`,
    `packages/${packageName}/.turbo`,
    `packages/${packageName}/tsconfig.tsbuildinfo`,
  ]),
];

const generatedRoots = packageNames.map((packageName) => `packages/${packageName}/src`);

async function pathExists(absolutePath) {
  try {
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

async function removeIfExists(relativePath) {
  const absolutePath = path.join(root, relativePath);

  if (!(await pathExists(absolutePath))) {
    return false;
  }

  if (dryRun) {
    console.log(`[dry-run] remove ${relativePath}`);
    return true;
  }

  await fs.rm(absolutePath, { recursive: true, force: true });
  console.log(`removed ${relativePath}`);
  return true;
}

async function walkAndRemoveGenerated(relativeDir) {
  const absoluteDir = path.join(root, relativeDir);

  if (!(await pathExists(absoluteDir))) {
    return;
  }

  const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
  for (const entry of entries) {
    const relativeEntryPath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      await walkAndRemoveGenerated(relativeEntryPath);
      continue;
    }

    if (entry.name.endsWith('.js') || entry.name.endsWith('.d.ts') || entry.name.endsWith('.map')) {
      await removeIfExists(relativeEntryPath);
    }
  }
}

async function main() {
  console.log(dryRun ? 'Workspace cleanup preview' : 'Workspace cleanup');

  for (const relativePath of stalePaths) {
    await removeIfExists(relativePath);
  }

  for (const relativeDir of generatedRoots) {
    await walkAndRemoveGenerated(relativeDir);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
