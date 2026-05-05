import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const cssPath = resolve(root, 'apps/web/app/certificate-v2.css');
const css = readFileSync(cssPath, 'utf8');

const checks = [
  ['Step 33.1 certificate seal polish block is present', 'Step 33.1 — Certificate official seal print polish START'],
  ['Official seal desktop size is reduced from the first trust-system pass', 'width: 300px !important;'],
  ['Official seal desktop height is reduced from the first trust-system pass', 'height: 300px !important;'],
  ['Official seal desktop placement is refined to the lower-right print area', 'right: 66px !important;'],
  ['Official seal desktop bottom placement is refined', 'bottom: 66px !important;'],
  ['Official seal print size is refined for A4 output', 'width: 59mm !important;'],
  ['Official seal print height is refined for A4 output', 'height: 59mm !important;'],
  ['Official seal print placement is refined for A4 output', 'right: 13.6mm !important;'],
  ['Official seal print bottom placement is refined for A4 output', 'bottom: 13.8mm !important;'],
  ['Original certificate seal selector remains available', '.usgCertSeal'],
  ['Official USG certificate seal step remains available', 'Step 33'],
];

let failed = 0;
for (const [label, needle] of checks) {
  if (css.includes(needle)) {
    console.log(`PASS ${label}`);
  } else {
    failed += 1;
    console.error(`FAIL ${label} — missing ${needle}`);
  }
}

if (failed > 0) {
  console.error(`Certificate seal polish QA failed with ${failed} issue(s).`);
  process.exit(1);
}

console.log('Certificate seal polish QA complete.');
