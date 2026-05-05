#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const node = process.execPath;

function runStep(label, command, args) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runStep('Workshop verification', node, ['scripts/verify-workshop-foundation.mjs']);
runStep('Workspace syntax', node, ['scripts/check-workshop-syntax.mjs']);

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const shouldRunFullChecks = process.argv.includes('--full');

if (shouldRunFullChecks) {
  const pnpmAvailable = spawnSync(pnpmCommand, ['--version'], {
    cwd: root,
    stdio: 'ignore',
    shell: false,
    env: process.env,
  }).status === 0;

  if (!pnpmAvailable) {
    console.warn('\nSkipped full typecheck/build because pnpm is not available in PATH.');
    process.exit(0);
  }

  const lockfileExists = existsSync(path.join(root, 'pnpm-lock.yaml'));
  if (!lockfileExists) {
    console.warn('\nSkipped full typecheck/build because pnpm-lock.yaml is missing.');
    process.exit(0);
  }

  runStep('Workspace typecheck', pnpmCommand, ['typecheck']);
  runStep('Workspace build', pnpmCommand, ['build']);
}
