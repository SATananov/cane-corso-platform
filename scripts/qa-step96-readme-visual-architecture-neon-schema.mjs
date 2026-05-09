#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readmePath = path.join(root, 'README.md');
const packagePath = path.join(root, 'package.json');
const docPath = path.join(root, 'docs/qa/step96-readme-visual-architecture-neon-schema.md');

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function assertIncludes(label, content, needle) {
  if (content.includes(needle)) pass(label);
  else fail(`${label} missing: ${needle}`);
}

function assertFile(label, filePath) {
  if (existsSync(filePath)) pass(label);
  else fail(`${label} missing`);
}

console.log('\n--- Step 96 README Visual Architecture & Neon Database Schema QA ---');

assertFile('Root README.md exists', readmePath);
assertFile('Step 96 QA document exists', docPath);
assertFile('Root package.json exists', packagePath);

const readme = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : '';
const pkg = existsSync(packagePath) ? JSON.parse(readFileSync(packagePath, 'utf8')) : { scripts: {} };

assertIncludes('README records Step 96 checkpoint', readme, 'Step 96 — README Visual Architecture & Neon Database Schema');
assertIncludes('README keeps Step 95 as previous hygiene/release gate state', readme, 'Step 95:** Repository root cleanup');
assertIncludes('README has visual architecture overview section', readme, '## Visual architecture overview');
assertIncludes('README has Neon database overview section', readme, '## Neon database overview');
assertIncludes('README documents runtime responsibility map', readme, '### Runtime responsibility map');
assertIncludes('README documents core data flow', readme, '### Core data flow');
assertIncludes('README includes Mermaid flowchart', readme, '```mermaid\nflowchart LR');
assertIncludes('README includes Mermaid ER diagram', readme, '```mermaid\nerDiagram');
assertIncludes('README includes Mermaid sequence diagram', readme, '```mermaid\nsequenceDiagram');
assertIncludes('Architecture diagram includes Netlify', readme, 'Netlify Deploy');
assertIncludes('Architecture diagram includes Next.js App Router', readme, 'Next.js App Router');
assertIncludes('Architecture diagram includes Tailwind CSS', readme, 'Tailwind CSS UI Layer');
assertIncludes('Architecture diagram includes Drizzle ORM', readme, 'Drizzle ORM');
assertIncludes('Architecture diagram includes Neon PostgreSQL', readme, 'Neon PostgreSQL');
assertIncludes('Architecture diagram includes shared packages', readme, 'Shared TS Packages');
assertIncludes('Database diagram includes profiles', readme, 'profiles {');
assertIncludes('Database diagram includes dogs', readme, 'dogs {');
assertIncludes('Database diagram includes registry entries', readme, 'registry_entries {');
assertIncludes('Database diagram includes certificates', readme, 'certificates {');
assertIncludes('Database diagram includes ecosystem listings', readme, 'ecosystem_listings {');
assertIncludes('Database diagram includes partner applications', readme, 'partner_applications {');
assertIncludes('Database diagram includes knowledge articles', readme, 'knowledge_articles {');
assertIncludes('Data flow shows member profile creation', readme, 'Create or edit Cane Corso profile');
assertIncludes('Data flow shows admin review', readme, 'Review submission');
assertIncludes('Data flow shows public Registry/Verify result', readme, 'Registry / Verify data available publicly');

if (pkg.scripts?.['step96:readme-visuals:qa'] === 'node scripts/qa-step96-readme-visual-architecture-neon-schema.mjs') {
  pass('Package script step96:readme-visuals:qa exists');
} else {
  fail('Package script step96:readme-visuals:qa missing or incorrect');
}

const lockedFiles = [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/app/api/ecosystem/moderation/route.ts',
  'apps/web/app/api/health/db/route.ts',
];

for (const file of lockedFiles) {
  assertFile(`Locked authority file remains present: ${file}`, path.join(root, file));
}

if (process.exitCode) {
  console.error('\nStep 96 README Visual Architecture & Neon Database Schema QA FAILED');
  process.exit(process.exitCode);
}

console.log('\nStep 96 README Visual Architecture & Neon Database Schema QA complete.');
