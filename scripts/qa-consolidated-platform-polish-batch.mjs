#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

async function read(relativePath) {
  return fs.readFile(path.join(root, relativePath), 'utf8');
}

function expectContains(name, text, needle) {
  if (!text.includes(needle)) {
    throw new Error(`${name} missing expected content: ${needle}`);
  }
  console.log(`PASS ${name}`);
}

function expectNotContains(name, text, needle) {
  if (text.includes(needle)) {
    throw new Error(`${name} contains forbidden content: ${needle}`);
  }
  console.log(`PASS ${name}`);
}

async function main() {
  const entry = await read('apps/web/components/entry-experience.tsx');
  expectContains('Entry first scene remains hard locked', entry, 'const activeScene = 0');
  expectContains('Entry approved Bulgarian headline remains present', entry, 'Регистър, знания, общност и партньори — ясно разделени');
  expectNotContains('Entry does not reintroduce automatic scene state', entry, 'useEffect(');
  expectNotContains('Entry does not reintroduce automatic scene state hook', entry, 'useState(');

  const adminDashboard = await read('apps/web/components/knowledge-admin-dashboard.tsx');
  expectContains('Knowledge admin overview metrics added', adminDashboard, 'knowledge-admin-metric-grid');
  expectContains('Knowledge admin future workflow added', adminDashboard, 'Draft → Review → Publish → Maintain');
  expectContains('Knowledge admin BG workflow added', adminDashboard, 'Чернова → Преглед → Публикуване → Поддръжка');
  expectContains('Knowledge admin guardrails added', adminDashboard, 'knowledge-admin-guardrail-grid');
  expectContains('Knowledge admin DB write boundary documented', adminDashboard, 'Няма записи към база данни');

  const directory = await read('apps/web/components/knowledge-article-directory.tsx');
  expectContains('Public Knowledge directory has published-only summary', directory, 'knowledge-article-directory-stats');
  expectContains('Public Knowledge BG published-only label exists', directory, 'Само публикувани');

  const css = await read('apps/web/app/globals.css');
  expectContains('Consolidated Step 32 CSS block exists', css, 'Step 32 — Consolidated polish batch');
  expectContains('Knowledge admin metrics CSS exists', css, '.knowledge-admin-metric-grid');
  expectContains('Entry mobile guardrail CSS exists', css, '.entry-mini-brand__subline');

  const packageJson = JSON.parse(await read('package.json'));
  if (packageJson.scripts?.['platform:polish-batch:qa'] !== 'node scripts/qa-consolidated-platform-polish-batch.mjs') {
    throw new Error('package.json missing platform:polish-batch:qa script');
  }
  console.log('PASS package script platform:polish-batch:qa exists');

  await fs.access(path.join(root, 'docs/qa/step32-consolidated-platform-polish-batch.md'));
  console.log('PASS Step 32 QA document exists');

  console.log('\nStep 32 consolidated platform polish batch QA complete.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
