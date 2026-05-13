#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
};
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

console.log('\n======================================================');
console.log('Step 135 — Mobile Capstone Evidence Lock QA');
console.log('======================================================\n');

const requiredFiles = [
  'apps/mobile/App.tsx',
  'apps/mobile/src/api.ts',
  'apps/mobile/package.json',
  'apps/mobile/app.json',
  'apps/mobile/README.md',
  'README_SOFTUNI_CAPSTONE.md',
  'docs/qa/step135-mobile-capstone-evidence-lock.md',
  'scripts/qa-step135-mobile-capstone-evidence-lock.mjs',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'package.json',
];

for (const file of requiredFiles) {
  if (exists(file)) pass(`Required file exists: ${file}`);
  else fail(`Required file exists: ${file}`);
}

const app = exists('apps/mobile/App.tsx') ? read('apps/mobile/App.tsx') : '';
const readme = exists('README_SOFTUNI_CAPSTONE.md') ? read('README_SOFTUNI_CAPSTONE.md') : '';
const mobileReadme = exists('apps/mobile/README.md') ? read('apps/mobile/README.md') : '';
const doc = exists('docs/qa/step135-mobile-capstone-evidence-lock.md') ? read('docs/qa/step135-mobile-capstone-evidence-lock.md') : '';
const packageJson = exists('package.json') ? JSON.parse(read('package.json')) : { scripts: {} };
const releaseQa = exists('scripts/qa-fullstack-all-in-one-release-lock.mjs') ? read('scripts/qa-fullstack-all-in-one-release-lock.mjs') : '';

const appMarkers = [
  'type CapstoneMobileScreenId',
  'const capstoneMobileScreens',
  "'home' | 'access' | 'myDogs' | 'registryVerify' | 'knowledge' | 'profile'",
  'MobileScreenTabs',
  'MobileHomeScreen',
  'MobileAccessScreen',
  'MobileMyDogsScreen',
  'MobileRegistryVerifyScreen',
  'MobileKnowledgeScreen',
  'MobileProfileScreen',
  'Mobile Capstone App',
  'Six mobile screens are available for the Capstone review',
  'Mobile screen 1 / Home',
  'Mobile screen 2 / Access',
  'Mobile screen 3 / My Dogs',
  'Mobile screen 4 / Registry',
  'Mobile screen 5 / Knowledge',
  'Mobile screen 6 / Profile',
  'selectedMobileScreen',
  'accessibilityState={{ selected: isActive }}',
  'fetchPublicRegistryDocument()',
  'fetchOptionalVerificationDocument',
  'fetchEcosystemDirectoryDocument()',
];

for (const marker of appMarkers) {
  if (app.includes(marker)) pass(`Mobile app includes Capstone marker: ${marker}`);
  else fail(`Mobile app includes Capstone marker: ${marker}`);
}

for (const screen of ['Home', 'Access', 'My Dogs', 'Registry', 'Knowledge', 'Profile']) {
  if (app.includes(`label: '${screen}'`)) pass(`Mobile navigation includes screen: ${screen}`);
  else fail(`Mobile navigation includes screen: ${screen}`);
}

if (!app.includes('Mobile QA bridge')) pass('Old mobile-only QA bridge title is removed');
else fail('Old mobile-only QA bridge title is removed');


const mobileReadmeMarkers = [
  'Mobile Capstone App Workspace',
  'six reviewer-friendly mobile screens',
  'Home / Platform Overview',
  'Access / Auth Orientation',
  'My Dogs / Owner Workspace',
  'Registry + Verify',
  'Knowledge / Care Guide',
  'Profile / Account Context',
];

for (const marker of mobileReadmeMarkers) {
  if (mobileReadme.includes(marker)) pass(`Mobile README includes Capstone evidence: ${marker}`);
  else fail(`Mobile README includes Capstone evidence: ${marker}`);
}

const readmeMarkers = [
  'Capstone mobile screens include:',
  'Home / Platform Overview',
  'Access / Auth Orientation',
  'My Dogs / Owner Workspace',
  'Registry + Verify',
  'Knowledge / Care Guide',
  'Profile / Account Context',
  'pnpm step135:mobile-capstone:qa',
  'Step 135 documents 6 Expo mobile screens',
];

for (const marker of readmeMarkers) {
  if (readme.includes(marker)) pass(`SoftUni README includes mobile evidence: ${marker}`);
  else fail(`SoftUni README includes mobile evidence: ${marker}`);
}

const docMarkers = [
  'Step 135 — Mobile Capstone Evidence Lock',
  'Home / Platform Overview',
  'Access / Auth Orientation',
  'My Dogs / Owner Workspace',
  'Registry + Verify',
  'Knowledge / Care Guide',
  'Profile / Account Context',
  'does not change',
  'Auth/session implementation',
  'Database schema or migrations',
];

for (const marker of docMarkers) {
  if (doc.includes(marker)) pass(`Step 135 doc includes: ${marker}`);
  else fail(`Step 135 doc includes: ${marker}`);
}

if (packageJson.scripts?.['step135:mobile-capstone:qa'] === 'node scripts/qa-step135-mobile-capstone-evidence-lock.mjs') {
  pass('Package script for Step 135 is registered');
} else {
  fail('Package script for Step 135 is registered');
}

for (const marker of [
  'docs/qa/step135-mobile-capstone-evidence-lock.md',
  'scripts/qa-step135-mobile-capstone-evidence-lock.mjs',
  'step135:mobile-capstone:qa',
  'Step 135 Mobile Capstone Evidence Lock',
]) {
  if (releaseQa.includes(marker)) pass(`Release QA includes Step 135 marker: ${marker}`);
  else fail(`Release QA includes Step 135 marker: ${marker}`);
}

const forbiddenAppPhrases = [
  'OPENAI_API_KEY',
  'DATABASE_URL',
  'process.env',
  'document.cookie',
  'localStorage',
  'createClient',
  'drizzle',
];

for (const phrase of forbiddenAppPhrases) {
  if (!app.includes(phrase)) pass(`Mobile App.tsx remains client-only and avoids ${phrase}`);
  else fail(`Mobile App.tsx remains client-only and avoids ${phrase}`);
}

const lockedFiles = [
  'packages/auth/src/session.ts',
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/app/api/auth/sign-in/route.ts',
  'apps/web/app/api/auth/sign-up/route.ts',
];

for (const file of lockedFiles) {
  if (exists(file)) pass(`Locked backend/authority file remains present and outside Step 135 scope: ${file}`);
  else fail(`Locked backend/authority file remains present and outside Step 135 scope: ${file}`);
}

console.log('\n======================================================');
if (process.exitCode) {
  console.log('Step 135 Mobile Capstone Evidence Lock QA FAIL');
} else {
  console.log('Step 135 Mobile Capstone Evidence Lock QA PASS');
}
console.log('======================================================');
