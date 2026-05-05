#!/usr/bin/env node
import fsSync from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function loadTypeScript() {
  try {
    return require('typescript');
  } catch {
    const pnpmRoot = path.join(process.cwd(), 'node_modules', '.pnpm');

    if (!fsSync.existsSync(pnpmRoot)) {
      throw new Error('TypeScript is not available. Run pnpm install on the real workspace first.');
    }

    const entries = fsSync.readdirSync(pnpmRoot, { withFileTypes: true });
    const match = entries.find((entry) => entry.isDirectory() && entry.name.startsWith('typescript@'));

    if (!match) {
      throw new Error('TypeScript is not available inside node_modules/.pnpm. Run pnpm install on the real workspace first.');
    }

    const tsPath = path.join(pnpmRoot, match.name, 'node_modules', 'typescript', 'lib', 'typescript.js');
    return require(tsPath);
  }
}

const ts = loadTypeScript();
const root = process.cwd();
const includedRoots = ['apps', 'packages', 'scripts'];
const includedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const ignoredDirectoryNames = new Set([
  'node_modules',
  '.git',
  '.next',
  '.turbo',
  '.expo',
  'dist',
  'build',
  'coverage',
  'out',
]);
const ignoredRelativeDirectories = new Set([
  'apps/web/packages',
  'apps/web/scripts',
]);

function getScriptKind(extension) {
  switch (extension) {
    case '.ts':
      return ts.ScriptKind.TS;
    case '.tsx':
      return ts.ScriptKind.TSX;
    case '.js':
      return ts.ScriptKind.JS;
    case '.jsx':
      return ts.ScriptKind.JSX;
    case '.mjs':
      return ts.ScriptKind.JS;
    case '.cjs':
      return ts.ScriptKind.JS;
    default:
      return ts.ScriptKind.Unknown;
  }
}

async function collectFiles(relativeDir, results) {
  const absoluteDir = path.join(root, relativeDir);
  let entries;

  try {
    entries = await fs.readdir(absoluteDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const relativePath = path.join(relativeDir, entry.name);

    if (ignoredRelativeDirectories.has(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      if (ignoredDirectoryNames.has(entry.name)) {
        continue;
      }

      await collectFiles(relativePath, results);
      continue;
    }

    const extension = path.extname(entry.name);
    if (includedExtensions.has(extension)) {
      results.push(relativePath);
    }
  }
}

function formatDiagnostic(relativePath, diagnostic) {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

  if (diagnostic.start == null || !diagnostic.file) {
    return `${relativePath}: ${message}`;
  }

  const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
  return `${relativePath}:${line + 1}:${character + 1} ${message}`;
}

async function main() {
  const files = [];
  for (const relativeRoot of includedRoots) {
    await collectFiles(relativeRoot, files);
  }

  const failures = [];

  for (const relativePath of files.sort()) {
    const absolutePath = path.join(root, relativePath);
    const sourceText = await fs.readFile(absolutePath, 'utf8');
    const extension = path.extname(relativePath);
    const sourceFile = ts.createSourceFile(
      absolutePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      getScriptKind(extension),
    );

    const diagnostics = sourceFile.parseDiagnostics ?? [];
    for (const diagnostic of diagnostics) {
      failures.push(formatDiagnostic(relativePath, diagnostic));
    }
  }

  if (failures.length > 0) {
    console.error('Syntax check failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log(`Syntax check passed for ${files.length} source files.`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
