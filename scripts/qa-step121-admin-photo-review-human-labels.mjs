#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
function pass(message){ console.log(`PASS ${message}`); }
function fail(message){ console.error(`FAIL ${message}`); process.exitCode = 1; }
function file(rel){ const p = path.join(root, rel); if(!existsSync(p)){ fail(`Missing ${rel}`); return ''; } pass(`Required file exists: ${rel}`); return readFileSync(p, 'utf8'); }
function expect(text, pattern, message){ if(pattern.test(text)) pass(message); else fail(message); }

const panel = file('apps/web/components/admin-photo-review-assistant-panel.tsx');
const review = file('apps/web/components/review-queue-dashboard.tsx');
const css = file('apps/web/app/globals.css');
const doc = file('docs/qa/step121-admin-photo-review-human-labels.md');
const pkg = file('package.json');

expect(panel, /Step 121 — Admin Photo Review Assistant & Human Labels Foundation/, 'Step 121 marker present');
expect(panel, /AdminPhotoReviewAssistantPanel/, 'Admin photo assistant component exported');
expect(panel, /good.*usable.*poor.*wrong_angle.*missing_view/s, 'Human label set is represented');
expect(panel, /human label remains the source of truth|крайният човешки етикет остава водещ|etichetta umana finale.*fonte di verità/i, 'Human label authority copy present');
expect(panel, /No AI or ML result here proves breed|няма AI\/ML резултат, който доказва порода/i, 'No AI breed proof copy present');
expect(review, /AdminPhotoReviewAssistantPanel/, 'Admin review queue integrates assistant panel');
expect(css, /admin-photo-review-assistant/, 'Admin photo assistant CSS present');
expect(doc, /Registry and Certificate remain separate USG-controlled outcomes|Registry и Certificate/, 'Step 121 guardrail doc present');
expect(pkg, /step121:admin-photo-review:qa/, 'Step 121 package script registered');
console.log('\nStep 121 Admin Photo Review Assistant & Human Labels Foundation QA PASS');
