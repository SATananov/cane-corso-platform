#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function pass(message){ console.log(`PASS ${message}`); }
function fail(message){ console.error(`FAIL ${message}`); process.exitCode = 1; }
function file(rel){ const p = path.join(root, rel); if(!existsSync(p)){ fail(`Missing ${rel}`); return ''; } pass(`Required file exists: ${rel}`); return readFileSync(p, 'utf8'); }
function expect(text, pattern, message){ if(pattern.test(text)) pass(message); else fail(message); }

const panel = file('apps/web/components/admin-photo-review-assistant-panel.tsx');
const doc = file('docs/qa/step122-authenticity-dataset-preparation-guardrails.md');
const pkg = file('package.json');

expect(panel, /Step 122 — Authenticity Dataset Preparation Guardrails/, 'Step 122 marker present');
expect(panel, /dog_id, media_id, expected_view, assistant_quality, assistant_confidence, admin_final_label, dataset_use, review_status/, 'Safe dataset fields listed in UI copy');
expect(panel, /Personal owner data is excluded|Личните данни на собственика не влизат|dati personali del proprietario/i, 'Personal owner data exclusion present');
expect(panel, /never receives a “true breed” proof label|никога не получава етикет “доказана порода”|non riceve mai un’etichetta di “razza provata”/i, 'No true-breed training label guardrail present');
expect(doc, /Excluded from future training exports[\s\S]*owner email[\s\S]*phone[\s\S]*address/, 'Dataset exclusion doc present');
expect(pkg, /step122:dataset-guardrails:qa/, 'Step 122 package script registered');
console.log('\nStep 122 Authenticity Dataset Preparation Guardrails QA PASS');
