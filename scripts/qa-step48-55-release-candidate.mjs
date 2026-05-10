#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

async function read(relativePath) {
  return fs.readFile(path.join(root, relativePath), 'utf8');
}

async function exists(relativePath) {
  try {
    await fs.access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}

async function expectFile(relativePath, message = relativePath) {
  if (await exists(relativePath)) pass(message);
  else fail(message);
}

async function expectIncludes(relativePath, needle, message) {
  const value = await read(relativePath);
  if (value.includes(needle)) pass(message);
  else fail(`${message} — missing ${needle}`);
}

async function expectNotIncludes(relativePath, needle, message) {
  const value = await read(relativePath);
  if (!value.includes(needle)) pass(message);
  else fail(`${message} — unexpected ${needle}`);
}

async function main() {
  const packageJson = JSON.parse(await read('package.json'));
  const scripts = packageJson.scripts ?? {};

  const requiredScripts = [
    'community:discovery:qa',
    'partners:services-experience:qa',
    'mobile:responsive-final:qa',
    'owner:onboarding-final:qa',
    'admin:operational-clarity:qa',
    'i18n:full-copy:qa',
    'ux:sanity:qa',
    'release:consolidated:qa',
  ];

  for (const script of requiredScripts) {
    if (scripts[script]) pass(`Package script ${script} exists`);
    else fail(`Package script ${script} exists`);
  }

  await expectFile('apps/web/components/community-discovery-experience.tsx', 'Step 48 community discovery component exists');
  await expectFile('apps/web/components/partners-services-experience.tsx', 'Step 49 partners services component exists');
  await expectFile('apps/web/components/owner-onboarding-final-panel.tsx', 'Step 51 owner onboarding panel exists');
  await expectFile('apps/web/components/admin-operational-clarity-panel.tsx', 'Step 52 admin operational clarity panel exists');

  await expectIncludes('apps/web/app/(public)/community/page.tsx', '<CommunityDiscoveryExperience', 'Community page renders Step 48 discovery experience');
  await expectIncludes('apps/web/app/(public)/partners/page.tsx', '<PartnersServicesExperience', 'Partners page renders Step 49 service experience');
  await expectIncludes('apps/web/app/access/page.tsx', '<OwnerOnboardingFinalPanel locale={locale} surface="access" />', 'Access page renders Step 51 onboarding panel');
  await expectIncludes('apps/web/app/(member)/member/page.tsx', 'member-home-reset', 'Member page keeps Step 106 member command center');
  await expectNotIncludes('apps/web/app/(member)/member/page.tsx', '<OwnerOnboardingFinalPanel', 'Member page keeps dense onboarding panel out of primary Step 106 flow');
  await expectIncludes('apps/web/app/(member)/profile/page.tsx', '<OwnerOnboardingFinalPanel locale={locale} surface="profile" />', 'Profile page renders Step 51 onboarding panel');

  await expectIncludes('apps/web/app/(admin)/review/page.tsx', 'surface="review"', 'Review admin page renders operational clarity');
  await expectIncludes('apps/web/app/(admin)/admin/registry/page.tsx', 'surface="registry"', 'Admin Registry page renders operational clarity');
  await expectIncludes('apps/web/app/(admin)/admin/partners/page.tsx', 'surface="partners"', 'Admin Partners page renders operational clarity');
  await expectIncludes('apps/web/app/(admin)/admin/ecosystem/page.tsx', 'surface="ecosystem"', 'Admin Ecosystem page renders operational clarity');
  await expectIncludes('apps/web/app/(admin)/admin/knowledge/page.tsx', 'surface="knowledge"', 'Admin Knowledge page renders operational clarity');

  await expectIncludes('apps/web/app/globals.css', 'Step 48-55 — consolidated release readiness experience pass', 'Step 50/54 CSS block exists');
  await expectIncludes('apps/web/app/globals.css', ':where(a, button, input, select, textarea):focus-visible', 'Accessibility focus-visible rule exists');
  await expectIncludes('apps/web/app/globals.css', '@media (max-width: 760px)', 'Mobile responsive rule exists');

  const lockedFiles = [
    'apps/web/app/api/registry/route.ts',
    'apps/web/app/api/registry/[slug]/route.ts',
    'apps/web/app/api/verify/[code]/route.ts',
    'apps/web/app/api/ecosystem/route.ts',
    'apps/web/app/api/ecosystem/moderation/route.ts',
    'apps/web/app/(admin)/review/actions.ts',
    'apps/web/app/(admin)/admin/registry/actions.ts',
    'apps/web/lib/session.server.ts',
    'apps/web/lib/registry.server.ts',
    'apps/web/lib/review.server.ts',
    'packages/db/src/schema/index.ts',
  ];

  for (const file of lockedFiles) {
    await expectFile(file, `Locked authority file still exists: ${file}`);
  }

  const newComponents = [
    'apps/web/components/community-discovery-experience.tsx',
    'apps/web/components/partners-services-experience.tsx',
    'apps/web/components/owner-onboarding-final-panel.tsx',
    'apps/web/components/admin-operational-clarity-panel.tsx',
  ];
  for (const file of newComponents) {
    await expectNotIncludes(file, "from './actions'", `${file} does not import local mutation actions`);
    await expectNotIncludes(file, "from '@/lib/session.server'", `${file} does not import session server logic`);
    await expectNotIncludes(file, "from '@/lib/registry.server'", `${file} does not import registry server logic`);
    await expectNotIncludes(file, "from '@/lib/review.server'", `${file} does not import review server logic`);
  }

  for (const step of [48, 49, 50, 51, 52, 53, 54, 55]) {
    const docs = await fs.readdir(path.join(root, 'docs/qa'));
    if (docs.some((name) => name.startsWith(`step${step}-`))) pass(`Step ${step} QA document exists`);
    else fail(`Step ${step} QA document exists`);
  }

  if (failures.length > 0) {
    console.error(`\nStep 48-55 consolidated QA failed with ${failures.length} issue(s).`);
    process.exit(1);
  }

  console.log('\nStep 48-55 consolidated release candidate QA complete. Ready for local browser review and typecheck.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
