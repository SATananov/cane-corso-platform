#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function file(rel) {
  const full = path.join(root, rel);
  if (!existsSync(full)) {
    fail(`Required file missing: ${rel}`);
    return '';
  }
  pass(`Required file exists: ${rel}`);
  return readFileSync(full, 'utf8');
}
function expect(text, pattern, message) {
  if (pattern instanceof RegExp ? pattern.test(text) : text.includes(pattern)) pass(message);
  else fail(`${message}: missing ${pattern}`);
}
function reject(text, pattern, message) {
  if (pattern instanceof RegExp ? pattern.test(text) : text.includes(pattern)) fail(`${message}: found forbidden ${pattern}`);
  else pass(message);
}

console.log('\n===============================================================');
console.log('Step 126 — Admin ML-safe Review Assistant Polish QA');
console.log('===============================================================\n');

const lib = file('apps/web/lib/usg-photo-review-assistant.ts');
const panel = file('apps/web/components/admin-photo-review-assistant-panel.tsx');
const css = file('apps/web/app/globals.css');
const doc = file('docs/qa/step126-admin-ml-safe-review-assistant-polish.md');
const pkg = file('package.json');
const releaseQa = file('scripts/qa-fullstack-all-in-one-release-lock.mjs');
const migration = file('packages/db/drizzle/0014_dog_health_records.sql');

expect(lib, /Step 126 — Admin ML-safe Review Assistant Polish/, 'Step 126 library marker present');
expect(panel, /Step 126 — Admin ML-safe Review Assistant Polish/, 'Step 126 component marker present');
expect(css, /Step 126 — Admin ML-safe Review Assistant Polish/, 'Step 126 CSS marker present');
expect(lib, /buildUsgPhotoReviewDecisionSupport/, 'Decision-support helper exported');
expect(lib, /ready_for_human_review.*needs_more_photos.*needs_better_primary.*review_carefully/s, 'Readiness states are represented');
expect(lib, /confirm_labels.*request_missing_views.*request_better_primary.*review_extra_photos/s, 'Recommended next actions are represented');
expect(panel, /buildUsgPhotoReviewDecisionSupport/, 'Assistant panel uses decision-support helper');
expect(panel, /Review readiness snapshot/, 'English readiness summary visible');
expect(panel, /Бърза картина за преглед/, 'Bulgarian readiness summary visible');
expect(panel, /Sintesi prontezza revisione/, 'Italian readiness summary visible');
expect(panel, /Потвърди етикетите и продължи USG прегледа/, 'Bulgarian next action uses USG review language');
expect(panel, /Can be prepared as learning candidates after the reviewer confirms the labels/, 'Learning use is gated by human confirmation');
expect(panel, /Още не се подготвя за обучение/, 'Blocked learning state is visible in Bulgarian');
expect(css, /admin-photo-review-assistant__summary/, 'Readiness summary CSS present');
expect(css, /admin-photo-review-assistant__learning-note/, 'Learning note CSS present');
expect(doc, /No automatic approval[\s\S]*No automatic certificate decision/, 'Step 126 doc keeps authority guardrails');
expect(doc, /Human label and assistant suggestion remain separate/, 'Step 126 doc keeps human-label boundary');
expect(pkg, /step126:admin-ml-safe-review-assistant:qa/, 'package.json includes Step 126 QA script');
expect(releaseQa, /docs\/qa\/step126-admin-ml-safe-review-assistant-polish\.md/, 'Full release QA requires Step 126 QA doc');
expect(releaseQa, /scripts\/qa-step126-admin-ml-safe-review-assistant-polish\.mjs/, 'Full release QA requires Step 126 QA script');
expect(releaseQa, /step126:admin-ml-safe-review-assistant:qa/, 'Full release QA requires Step 126 package script');
expect(releaseQa, /Step 126 admin ML-safe review assistant polish/, 'Full release QA runs Step 126 QA');
reject(lib + panel + doc, /AI proves breed|ML proves breed|purebred proof|automatic Registry approval|automatic Certificate approval/i, 'No unsafe AI/breed-proof or automatic approval phrasing');
reject(migration, /Step 126|admin-ml-safe-review-assistant|buildUsgPhotoReviewDecisionSupport/, 'Step 126 does not touch dog health migration');

if (process.exitCode) {
  console.error('\n===============================================================');
  console.error('Step 126 Admin ML-safe Review Assistant Polish QA FAILED');
  console.error('===============================================================');
  process.exit(process.exitCode);
}

console.log('\n===============================================================');
console.log('Step 126 Admin ML-safe Review Assistant Polish QA PASS');
console.log('===============================================================');
