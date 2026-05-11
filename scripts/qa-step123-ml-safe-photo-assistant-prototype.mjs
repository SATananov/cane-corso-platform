#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function pass(message){ console.log(`PASS ${message}`); }
function fail(message){ console.error(`FAIL ${message}`); process.exitCode = 1; }
function file(rel){ const p = path.join(root, rel); if(!existsSync(p)){ fail(`Missing ${rel}`); return ''; } pass(`Required file exists: ${rel}`); return readFileSync(p, 'utf8'); }
function expect(text, pattern, message){ if(pattern.test(text)) pass(message); else fail(message); }
function reject(text, pattern, message){ if(pattern.test(text)) fail(message); else pass(message); }

const lib = file('apps/web/lib/usg-photo-review-assistant.ts');
const panel = file('apps/web/components/admin-photo-review-assistant-panel.tsx');
const doc = file('docs/qa/step123-ml-safe-photo-assistant-prototype.md');
const pkg = file('package.json');

expect(lib, /Step 123 — ML-safe Photo Assistant Prototype/, 'Step 123 library marker present');
expect(lib, /buildUsgPhotoAssistantSuggestion/, 'Deterministic assistant suggestion builder present');
expect(lib, /No AI\/ML breed proof is performed here/, 'No breed proof implementation guardrail present');
expect(lib, /side.*front.*head.*unknown/s, 'Expected view labels are represented');
expect(lib, /good.*usable.*needs_better_photo.*missing/s, 'Assistant quality labels are represented');
expect(panel, /future model may help with blur, lighting, dog visibility, full-body framing, side\/front\/head view and wrong angle detection|Бъдещ модел може да помага за размазване, светлина, видимост на кучето/s, 'Future ML help scope is visible');
expect(doc, /It never proves breed[\s\S]*It never approves Registry[\s\S]*It never issues or approves a USG Certificate/, 'Step 123 doc authority guardrails present');
reject(lib + panel, /purebred proof|AI proves breed|ML proves breed/i, 'No unsafe AI breed-proof phrasing');
expect(pkg, /step123:ml-safe-photo-assistant:qa/, 'Step 123 package script registered');
console.log('\nStep 123 ML-safe Photo Assistant Prototype QA PASS');
