#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const failures = [];

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  failures.push(message);
  console.log(`FAIL ${message}`);
}

function assert(condition, message) {
  if (condition) pass(message);
  else fail(message);
}

function read(relativePath) {
  const fullPath = join(root, relativePath);
  if (!existsSync(fullPath)) return "";
  return readFileSync(fullPath, "utf8");
}

console.log("\nStep 75 — Demo Release Candidate Lock\n");

const packageJson = JSON.parse(read("package.json") || "{}");
const scripts = packageJson.scripts || {};

const requiredScripts = [
  "demo:owner-submission-readiness:static:qa",
  "demo:owner-submission-readiness:qa",
  "demo:admin-moderation-read:static:qa",
  "demo:admin-moderation-read:qa",
  "demo:public-detail-pages:static:qa",
  "demo:public-detail-pages:qa",
  "demo:public-surface-content:static:qa",
  "demo:public-surface-content:qa",
  "demo:public-runtime-access:static:qa",
  "demo:public-runtime-access:qa",
  "demo:session-boundary-release:qa",
  "demo:role-separation:static:qa",
  "demo:role-separation:qa",
  "demo:admin-runtime-session:static:qa",
  "demo:admin-runtime-session:qa",
  "demo:runtime-session:static:qa",
  "demo:runtime-session:qa",
  "access:login-ui:qa",
  "workspace:syntax",
  "typecheck",
  "demo:release-candidate-lock:qa",
];

for (const scriptName of requiredScripts) {
  assert(Boolean(scripts[scriptName]), `Root package exposes ${scriptName}`);
}

const requiredFiles = [
  "scripts/qa-demo-owner-submission-readiness-smoke.mjs",
  "scripts/qa-demo-admin-moderation-read-smoke.mjs",
  "scripts/qa-demo-public-detail-pages-smoke.mjs",
  "scripts/qa-demo-public-surface-content-smoke.mjs",
  "scripts/qa-demo-public-runtime-access-smoke.mjs",
  "scripts/qa-demo-session-boundary-release-lock.mjs",
  "scripts/qa-demo-runtime-role-separation-smoke.mjs",
  "scripts/qa-demo-admin-runtime-session-smoke.mjs",
  "scripts/qa-demo-runtime-session-member-smoke.mjs",
  "scripts/qa-access-login-ui-payload.mjs",
  "scripts/qa-demo-release-candidate-lock.mjs",
  "docs/qa/step66-demo-runtime-session-member-smoke.md",
  "docs/qa/step67-admin-runtime-session-smoke.md",
  "docs/qa/step68-runtime-role-separation-smoke.md",
  "docs/qa/step69-session-boundary-release-lock.md",
  "docs/qa/step70-public-runtime-access-smoke.md",
  "docs/qa/step71-public-surface-content-runtime-smoke.md",
  "docs/qa/step72-public-detail-pages-runtime-smoke.md",
  "docs/qa/step73-admin-moderation-runtime-read-smoke.md",
  "docs/qa/step74-owner-submission-runtime-readiness-smoke.md",
  "docs/qa/step75-demo-release-candidate-lock.md",
];

for (const file of requiredFiles) {
  assert(existsSync(join(root, file)), `Required release-candidate file exists: ${file}`);
}

const step71Script = read("scripts/qa-demo-public-surface-content-smoke.mjs");
assert(
  step71Script.includes("server/error shell") && (step71Script.includes("substantial") || step71Script.includes("non-empty document")),
  "Step 71 public surface content smoke keeps the false-positive error-shell fix"
);

const step72Script = read("scripts/qa-demo-public-detail-pages-smoke.mjs");
assert(
  step72Script.includes("Published public detail") && step72Script.includes("returns HTTP 2xx") && step72Script.includes("substantial HTML"),
  "Step 72 public detail smoke accepts verified 2xx published detail documents"
);

const step74Script = read("scripts/qa-demo-owner-submission-readiness-smoke.mjs");
assert(
  step74Script.includes("session") && step74Script.includes("role") && step74Script.includes("/my-dogs/new"),
  "Step 74 owner readiness smoke keeps session-shape and owner form coverage"
);
assert(
  step74Script.includes("invalid POST") || step74Script.includes("validation guard"),
  "Step 74 owner readiness smoke remains mutation-safe and validation-only"
);

const step75Doc = read("docs/qa/step75-demo-release-candidate-lock.md");
assert(
  step75Doc.includes("demo:release-candidate-lock:qa") && step75Doc.includes("Step 66") && step75Doc.includes("Step 74"),
  "Step 75 document records release-candidate QA command and Step 66–74 boundary"
);

console.log("\nRecommended final local runtime validation chain:");
console.log("  pnpm demo:owner-submission-readiness:qa");
console.log("  pnpm demo:admin-moderation-read:qa");
console.log("  pnpm demo:public-detail-pages:qa");
console.log("  pnpm demo:public-surface-content:qa");
console.log("  pnpm demo:public-runtime-access:qa");
console.log("  pnpm demo:session-boundary-release:qa");
console.log("  pnpm demo:role-separation:qa");
console.log("  pnpm demo:admin-runtime-session:qa");
console.log("  pnpm demo:runtime-session:qa");
console.log("  pnpm access:login-ui:qa");
console.log("  pnpm workspace:syntax");
console.log("  pnpm typecheck");

if (failures.length) {
  console.log(`\nStep 75 demo release candidate lock failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log("\nStep 75 demo release candidate lock complete.");
