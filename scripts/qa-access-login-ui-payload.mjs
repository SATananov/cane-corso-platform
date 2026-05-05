#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const checks = [];

function pass(label) {
  checks.push({ label, ok: true });
  console.log(`PASS ${label}`);
}

function fail(label) {
  checks.push({ label, ok: false });
  console.error(`FAIL ${label}`);
}

function expectIncludes(source, needle, label) {
  if (source.includes(needle)) {
    pass(label);
  } else {
    fail(label);
  }
}

function expectNotIncludes(source, needle, label) {
  if (!source.includes(needle)) {
    pass(label);
  } else {
    fail(label);
  }
}

const componentPath = 'apps/web/components/member-access-panel.tsx';
const packagePath = 'package.json';
const component = readFileSync(componentPath, 'utf8');
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));

expectIncludes(component, 'function buildSignInPayload', 'Access login builds a normalized sign-in payload');
expectIncludes(component, 'email: source.email.trim().toLowerCase()', 'Access login normalizes email before POST');
expectIncludes(component, 'password: source.password.trim()', 'Access login removes accidental leading/trailing password whitespace before POST');
expectIncludes(component, "endpoint: '/api/auth/sign-in'", 'Access login debug identifies the sign-in endpoint');
expectIncludes(component, 'rawPasswordLength', 'Access login debug exposes raw password length without printing password');
expectIncludes(component, 'getSignInErrorMessage', 'Access login has 401 diagnostic status copy');
expectIncludes(component, 'handleSuccessfulAuth(data.session.user.role)', 'Access login redirects through the shared role-aware auth handler');
expectNotIncludes(component, "router.push('/member');", 'Access login no longer hardcodes /member redirect after sign-in');
expectIncludes(component, 'autoCapitalize="none"', 'Access login fields disable browser auto-capitalization');
expectIncludes(component, 'autoCorrect="off"', 'Access login fields disable browser auto-correction');
expectIncludes(component, 'spellCheck={false}', 'Access login fields disable spellcheck mutation');

if (pkg.scripts?.['access:login-ui:qa'] === 'node scripts/qa-access-login-ui-payload.mjs') {
  pass('Package script access:login-ui:qa exists');
} else {
  fail('Package script access:login-ui:qa exists');
}

const failed = checks.filter((check) => !check.ok);

if (failed.length > 0) {
  console.error(`\nAccess login UI payload QA failed with ${failed.length} issue(s).`);
  process.exit(1);
}

console.log('\nAccess login UI payload QA complete.');
