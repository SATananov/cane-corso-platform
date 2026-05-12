#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'package.json',
  '.env.example',
  'AGENTS.md',
  'docs/architecture/full-stack-requirements.md',
  'docs/architecture/nextjs-rendering-data-cache-map.md',
  'docs/architecture/performance-optimization-pass.md',
  'docs/architecture/production-readiness-final-checklist.md',
  'docs/architecture/neon-readiness-contract.md',
  'docs/architecture/auth-session-jwt-contract.md',
  'docs/release/fullstack-nextjs-product-release-final-lock.md',
  'docs/qa/final-fullstack-nextjs-product-release-lock.md',
  'docs/qa/step95-repository-hygiene-release-gate.md',
  'docs/qa/step96-readme-visual-architecture-neon-schema.md',
  'docs/qa/step97-product-presentation-browser-smoke-evidence.md',
  'docs/qa/step98-real-browser-evidence-capture.md',
  'docs/qa/step99-platform-active-section-intent-routing.md',
  'docs/qa/step100-owner-dog-privacy-boundary.md',
  'docs/qa/step101-usg-standard-knowledge-layer.md',
  'docs/qa/step102-language-purity-terminology-lock.md',
  'docs/qa/step103-usg-growth-measurement-assistant.md',
  'docs/qa/step104-owner-growth-measurement-archive.md',
  'docs/qa/step105-production-clarity-user-first.md',
  'docs/qa/step106-full-product-structure-reset.md',
  'docs/qa/step107-usg-product-lock.md',
  'docs/architecture/usg-intelligence-layer-foundation.md',
  'docs/qa/step108-usg-intelligence-layer-foundation.md',
  'docs/architecture/fci-standard-conformity-engine.md',
  'docs/qa/step108-1-fci-standard-conformity-engine.md',
  'docs/qa/step108-1-1-fci-intelligence-empty-state-location-polish.md',
  'docs/qa/step108-2-basic-first-profile-ux.md',
  'docs/qa/step108-2-1-basic-first-profile-layout-repair.md',
  'docs/qa/step108-2-2-optional-sections-visual-polish.md',
  'docs/qa/step109-owner-health-growth-tracker.md',
  'docs/qa/step109-1-access-password-photo-guide-polish.md',
  'docs/qa/step110-member-dashboard-real-user-ux-cleanup.md',
  'docs/qa/step111-usg-heritage-di-casa-tananov-archive.md',
  'docs/qa/step111-1-usg-heritage-written-story-toggle.md',
  'docs/qa/step111-2-usg-platform-origin-story.md',
  'docs/qa/step111-3-heritage-navigation-member-clarity.md',
  'docs/qa/step112-mobile-browser-ux-readiness.md',
  'docs/qa/step113-softuni-demo-data-pack.md',
  'docs/qa/step113-1-owner-cane-corso-section-workspace.md',
  'docs/qa/step113-2-cane-corso-pregnancy-puppy-growth-knowledge.md',
  'docs/qa/step113-3-active-guide-navigation.md',
  'docs/qa/step114-progressive-growth-ux.md',
  'docs/qa/step114-1-growth-chart-axis-data-clarity.md',
  'docs/qa/step115-platform-progressive-disclosure-ux.md',
  'docs/qa/step115-1-hero-chip-action-enforcement.md',
  'docs/qa/step115-2-page-hero-locale-fallback-polish.md',
  'docs/qa/step116-product-use-mode-cleanup.md',
  'docs/qa/step117-usg-authenticity-check-foundation.md',
  'docs/qa/step118-photo-evidence-flow.md',
  'docs/qa/step118-1-standard-match-bonus-clarity.md',
  'docs/qa/step119-usg-authenticity-data-foundation-ml-safe-labels.md',
  'docs/qa/step120-photo-readiness-action-guidance.md',
  'docs/qa/step121-admin-photo-review-human-labels.md',
  'docs/qa/step122-authenticity-dataset-preparation-guardrails.md',
  'docs/qa/step123-ml-safe-photo-assistant-prototype.md',
  'docs/product/current-platform-state-bg.md',
  'docs/qa/step124-current-platform-readme.md',
  'docs/qa/step125-real-user-production-readiness-ui-tone.md',
  'docs/qa/step126-admin-ml-safe-review-assistant-polish.md',
  'docs/qa/step127-real-browser-product-journey-review.md',
  'docs/qa/evidence/step127-real-browser-product-journey-review/README.md',
  'docs/qa/step128-product-priority-navigation-demo-data-separation.md',
  'docs/qa/step129-netlify-live-product-evidence-lock.md',
  'docs/qa/step130-first-real-user-onboarding-polish.md',
  'docs/qa/step130-1-journey-visual-readability-polish.md',
  'docs/qa/step131-ask-mark-i-assistant-foundation.md',
  'docs/qa/evidence/step129-netlify-live-product-evidence-lock/README.md',
  'docs/architecture/language-terminology-lock.md',
  'docs/qa/evidence/step98-real-browser-evidence/README.md',
  'scripts/qa-fullstack-all-in-one-release-lock.mjs',
  'scripts/qa-step95-repository-hygiene-release-gate.mjs',
  'scripts/qa-step96-readme-visual-architecture-neon-schema.mjs',
  'scripts/qa-step97-product-presentation-browser-smoke-evidence.mjs',
  'scripts/qa-step98-real-browser-evidence-capture.mjs',
  'scripts/qa-step99-platform-active-section-intent-routing.mjs',
  'scripts/qa-step100-owner-dog-privacy-boundary.mjs',
  'scripts/qa-step101-usg-standard-knowledge-layer.mjs',
  'scripts/qa-step102-language-purity-terminology-lock.mjs',
  'scripts/qa-step103-growth-measurement-assistant.mjs',
  'scripts/qa-step104-owner-growth-measurement-archive.mjs',
  'scripts/qa-step105-production-clarity-user-first.mjs',
  'scripts/qa-step106-full-product-structure-reset.mjs',
  'scripts/qa-step107-usg-product-lock.mjs',
  'scripts/qa-step108-usg-intelligence-layer-foundation.mjs',
  'scripts/qa-step108-1-fci-standard-conformity-engine.mjs',
  'scripts/qa-step108-1-1-fci-intelligence-empty-state-location-polish.mjs',
  'scripts/qa-step108-2-basic-first-profile-ux.mjs',
  'scripts/qa-step108-2-1-basic-first-profile-layout-repair.mjs',
  'scripts/qa-step108-2-2-optional-sections-visual-polish.mjs',
  'scripts/qa-step109-owner-health-growth-tracker.mjs',
  'scripts/qa-step109-1-access-password-photo-guide-polish.mjs',
  'scripts/qa-step110-member-dashboard-real-user-ux-cleanup.mjs',
  'scripts/qa-step111-usg-heritage-di-casa-tananov-archive.mjs',
  'scripts/qa-step111-1-usg-heritage-written-story-toggle.mjs',
  'scripts/qa-step111-2-usg-platform-origin-story.mjs',
  'scripts/qa-step111-3-heritage-navigation-member-clarity.mjs',
  'scripts/qa-step112-mobile-browser-ux-readiness.mjs',
  'scripts/qa-step113-softuni-demo-data-pack.mjs',
  'scripts/qa-step113-1-owner-cane-corso-section-workspace.mjs',
  'scripts/qa-step113-2-cane-corso-pregnancy-puppy-growth-knowledge.mjs',
  'scripts/qa-step113-3-active-guide-navigation.mjs',
  'scripts/qa-step114-progressive-growth-ux.mjs',
  'scripts/qa-step114-1-growth-chart-axis-data-clarity.mjs',
  'scripts/qa-step115-platform-progressive-disclosure-ux.mjs',
  'scripts/qa-step115-1-hero-chip-action-enforcement.mjs',
  'scripts/qa-step115-2-page-hero-locale-fallback-polish.mjs',
  'scripts/qa-step116-product-use-mode-cleanup.mjs',
  'scripts/qa-step117-usg-authenticity-check-foundation.mjs',
  'scripts/qa-step118-photo-evidence-flow.mjs',
  'scripts/qa-step118-1-standard-match-bonus-clarity.mjs',
  'scripts/qa-step119-usg-authenticity-data-foundation-ml-safe-labels.mjs',
  'scripts/qa-step120-photo-readiness-action-guidance.mjs',
  'scripts/qa-step121-admin-photo-review-human-labels.mjs',
  'scripts/qa-step122-authenticity-dataset-preparation-guardrails.mjs',
  'scripts/qa-step123-ml-safe-photo-assistant-prototype.mjs',
  'scripts/qa-step124-current-platform-readme.mjs',
  'scripts/qa-step125-real-user-production-readiness-ui-tone.mjs',
  'scripts/qa-step126-admin-ml-safe-review-assistant-polish.mjs',
  'scripts/qa-step127-real-browser-product-journey-review.mjs',
  'scripts/qa-step128-product-priority-navigation-demo-data-separation.mjs',
  'scripts/qa-step129-netlify-live-product-evidence-lock.mjs',
  'scripts/qa-step130-first-real-user-onboarding-polish.mjs',
  'scripts/qa-step130-1-journey-visual-readability-polish.mjs',
  'scripts/qa-step131-ask-mark-i-assistant-foundation.mjs',
];

const requiredPackageScripts = [
  'requirements:qa',
  'platform:product-release:qa',
  'demo:release-candidate-lock:qa',
  'owner:submission-happy-path:qa',
  'admin:moderation-action-flow:qa',
  'registry:certificate-release-flow:qa',
  'nextjs:rendering-cache:qa',
  'performance:optimization:qa',
  'production:readiness:qa',
  'submission:qna:qa',
  'docs:readme:qa',
  'step95:repo-hygiene:qa',
  'step96:readme-visuals:qa',
  'step97:browser-smoke:evidence:qa',
  'step98:real-browser:evidence:qa',
  'step99:active-section-routing:qa',
  'step100:owner-dog-privacy:qa',
  'step101:usg-standard-knowledge:qa',
  'step102:language-purity:qa',
  'step103:growth-measurement:qa',
  'step104:growth-archive:qa',
  'step105:production-clarity:qa',
  'step106:product-structure:qa',
  'step107:product-lock:qa',
  'step108:usg-intelligence:qa',
  'step108-1:fci-conformity:qa',
  'step108-1-1:fci-ux-polish:qa',
  'step108-2:basic-first-profile:qa',
  'step108-2-1:profile-layout-repair:qa',
  'step108-2-2:optional-visual-polish:qa',
  'step109:owner-health-growth:qa',
  'step109-1:access-photo-guide:qa',
  'step110:member-dashboard:qa',
  'step111:usg-heritage:qa',
  'step111-1:usg-heritage-story:qa',
  'step111-2:usg-platform-origin:qa',
  'step111-3:heritage-nav-member-clarity:qa',
  'step112:mobile-browser:qa',
  'step113:demo-data:qa',
  'step113-1:owner-workspace:qa',
  'step113-2:pregnancy-puppy-knowledge:qa',
  'step113-3:active-guide-navigation:qa',
  'step114:progressive-growth-ux:qa',
  'step114-1:growth-chart-clarity:qa',
  'step115:platform-progressive-disclosure:qa',
  'step115-1:hero-chip-actions:qa',
  'step115-2:hero-locale-fallback:qa',
  'step116:product-use-mode:qa',
  'step117:authenticity-check:qa',
  'step118:photo-evidence:qa',
  'step118-1:standard-match-bonus:qa',
  'step119:authenticity-data-foundation:qa',
  'step120:photo-readiness-action:qa',
  'step121:admin-photo-review:qa',
  'step122:dataset-guardrails:qa',
  'step123:ml-safe-photo-assistant:qa',
  'step124:current-platform-readme:qa',
  'step125:real-user-production-readiness:qa',
  'step126:admin-ml-safe-review-assistant:qa',
  'step127:browser-product-journey:qa',
  'step128:product-priority-demo-separation:qa',
  'step129:live-product-evidence:qa',
  'step130:first-real-user-onboarding:qa',
  'step130-1:journey-visual-readability:qa',
  'step131:ask-mark-i:qa',
  'demo:seed:softuni',
  'db:target:qa',
  'deploy:netlify:qa',
  'workspace:verify',
  'workspace:syntax',
  'typecheck',
  'release:all:qa',
  'release:fullstack-final:qa',
];

const qaScripts = [
  ['Full-stack requirements', 'scripts/qa-full-stack-requirements.mjs'],
  ['Product release pack', 'scripts/qa-platform-product-release-pack.mjs'],
  ['Demo release candidate lock', 'scripts/qa-demo-release-candidate-lock.mjs'],
  ['Owner submission happy path', 'scripts/qa-owner-submission-happy-path.mjs'],
  ['Admin moderation action flow', 'scripts/qa-admin-moderation-action-flow.mjs'],
  ['Registry certificate release flow', 'scripts/qa-registry-certificate-release-flow.mjs'],
  ['Next.js rendering/data/cache map', 'scripts/qa-nextjs-rendering-cache-map.mjs'],
  ['Performance optimization pass', 'scripts/qa-performance-optimization-pass.mjs'],
  ['Production readiness cleanup', 'scripts/qa-production-readiness-cleanup.mjs'],
  ['Submission Q&A package', 'scripts/qa-submission-qna-package.mjs'],
  ['Canonical README/project docs', 'scripts/qa-canonical-readme-project-docs.mjs'],
  ['Step 95 repository hygiene/release gate', 'scripts/qa-step95-repository-hygiene-release-gate.mjs'],
  ['Step 96 README visual architecture/Neon schema', 'scripts/qa-step96-readme-visual-architecture-neon-schema.mjs'],
  ['Step 97 product presentation/browser smoke evidence', 'scripts/qa-step97-product-presentation-browser-smoke-evidence.mjs'],
  ['Step 98 real browser evidence capture protocol', 'scripts/qa-step98-real-browser-evidence-capture.mjs'],
  ['Step 99 platform active section/intent routing', 'scripts/qa-step99-platform-active-section-intent-routing.mjs'],
  ['Step 100 owner/dog privacy boundary', 'scripts/qa-step100-owner-dog-privacy-boundary.mjs'],
  ['Step 101 USG standard knowledge layer', 'scripts/qa-step101-usg-standard-knowledge-layer.mjs'],
  ['Step 102 language purity/terminology lock', 'scripts/qa-step102-language-purity-terminology-lock.mjs'],
  ['Step 103 USG growth/measurement assistant', 'scripts/qa-step103-growth-measurement-assistant.mjs'],
  ['Step 104 owner growth measurement archive', 'scripts/qa-step104-owner-growth-measurement-archive.mjs'],
  ['Step 105 production clarity/user-first pass', 'scripts/qa-step105-production-clarity-user-first.mjs'],
  ['Step 106 full product structure reset', 'scripts/qa-step106-full-product-structure-reset.mjs'],
  ['Step 107 USG product lock', 'scripts/qa-step107-usg-product-lock.mjs'],
  ['Step 108 USG Intelligence layer foundation', 'scripts/qa-step108-usg-intelligence-layer-foundation.mjs'],
  ['Step 108.1 FCI Standard conformity engine', 'scripts/qa-step108-1-fci-standard-conformity-engine.mjs'],
  ['Step 108.1.1 FCI/Intelligence empty-state and location polish', 'scripts/qa-step108-1-1-fci-intelligence-empty-state-location-polish.mjs'],
  ['Step 108.2 Basic-first Cane Corso profile UX', 'scripts/qa-step108-2-basic-first-profile-ux.mjs'],
  ['Step 108.2.1 Basic-first profile layout repair', 'scripts/qa-step108-2-1-basic-first-profile-layout-repair.mjs'],
  ['Step 108.2.2 Optional sections visual polish', 'scripts/qa-step108-2-2-optional-sections-visual-polish.mjs'],
  ['Step 109 Owner health/growth tracker', 'scripts/qa-step109-owner-health-growth-tracker.mjs'],
  ['Step 109.1 Access password/photo guide polish', 'scripts/qa-step109-1-access-password-photo-guide-polish.mjs'],
  ['Step 110 Member dashboard real-user UX cleanup', 'scripts/qa-step110-member-dashboard-real-user-ux-cleanup.mjs'],
  ['Step 111 USG heritage / di Casa Tananov archive', 'scripts/qa-step111-usg-heritage-di-casa-tananov-archive.mjs'],
  ['Step 111.1 USG heritage written story toggle', 'scripts/qa-step111-1-usg-heritage-written-story-toggle.mjs'],
  ['Step 111.2 USG platform origin story', 'scripts/qa-step111-2-usg-platform-origin-story.mjs'],
  ['Step 111.3 Heritage navigation/member clarity', 'scripts/qa-step111-3-heritage-navigation-member-clarity.mjs'],
  ['Step 112 Mobile browser UX readiness', 'scripts/qa-step112-mobile-browser-ux-readiness.mjs'],
  ['Step 113 SoftUni demo data pack', 'scripts/qa-step113-softuni-demo-data-pack.mjs'],
  ['Step 113.1 My Cane Corso section workspace', 'scripts/qa-step113-1-owner-cane-corso-section-workspace.mjs'],
  ['Step 113.2 Cane Corso pregnancy/puppy knowledge', 'scripts/qa-step113-2-cane-corso-pregnancy-puppy-growth-knowledge.mjs'],
  ['Step 113.3 active guide navigation', 'scripts/qa-step113-3-active-guide-navigation.mjs'],
  ['Step 114 progressive disclosure and growth UX', 'scripts/qa-step114-progressive-growth-ux.mjs'],
  ['Step 114.1 growth chart axis/data clarity', 'scripts/qa-step114-1-growth-chart-axis-data-clarity.mjs'],
  ['Step 115 platform-wide progressive disclosure UX', 'scripts/qa-step115-platform-progressive-disclosure-ux.mjs'],
  ['Step 115.1 hero chip action enforcement', 'scripts/qa-step115-1-hero-chip-action-enforcement.mjs'],
  ['Step 115.2 page hero locale fallback polish', 'scripts/qa-step115-2-page-hero-locale-fallback-polish.mjs'],
  ['Step 116 product use-mode cleanup', 'scripts/qa-step116-product-use-mode-cleanup.mjs'],
  ['Step 117 USG authenticity check foundation', 'scripts/qa-step117-usg-authenticity-check-foundation.mjs'],
  ['Step 118 photo evidence flow', 'scripts/qa-step118-photo-evidence-flow.mjs'],
  ['Step 118.1 USG Standard Match bonus clarity', 'scripts/qa-step118-1-standard-match-bonus-clarity.mjs'],
  ['Step 119 USG authenticity data foundation and ML-safe labels', 'scripts/qa-step119-usg-authenticity-data-foundation-ml-safe-labels.mjs'],
  ['Step 120 photo readiness action guidance', 'scripts/qa-step120-photo-readiness-action-guidance.mjs'],
  ['Step 121 admin photo review and human labels', 'scripts/qa-step121-admin-photo-review-human-labels.mjs'],
  ['Step 122 authenticity dataset preparation guardrails', 'scripts/qa-step122-authenticity-dataset-preparation-guardrails.mjs'],
  ['Step 123 ML-safe photo assistant prototype', 'scripts/qa-step123-ml-safe-photo-assistant-prototype.mjs'],
  ['Step 124 current platform README', 'scripts/qa-step124-current-platform-readme.mjs'],
  ['Step 125 real-user production readiness and UI tone', 'scripts/qa-step125-real-user-production-readiness-ui-tone.mjs'],
  ['Step 126 admin ML-safe review assistant polish', 'scripts/qa-step126-admin-ml-safe-review-assistant-polish.mjs'],
  ['Step 127 real browser product journey review', 'scripts/qa-step127-real-browser-product-journey-review.mjs'],
  ['Step 128 product priority navigation and demo data separation', 'scripts/qa-step128-product-priority-navigation-demo-data-separation.mjs'],
  ['Step 129 Netlify live product evidence lock', 'scripts/qa-step129-netlify-live-product-evidence-lock.mjs'],
  ['Step 130 first real user onboarding polish', 'scripts/qa-step130-first-real-user-onboarding-polish.mjs'],
  ['Step 130.1 journey visual readability polish', 'scripts/qa-step130-1-journey-visual-readability-polish.mjs'],
  ['Step 131 Ask MARK I assistant foundation', 'scripts/qa-step131-ask-mark-i-assistant-foundation.mjs'],
  ['Runtime DB target guardrail', 'scripts/qa-runtime-db-target-guardrail.mjs'],
  ['Netlify deploy readiness', 'scripts/qa-netlify-deploy-readiness.mjs'],
  ['Workspace foundation verification', 'scripts/verify-workshop-foundation.mjs'],
  ['Workspace syntax check', 'scripts/check-workshop-syntax.mjs'],
];

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function assertFile(file) {
  if (!existsSync(path.join(root, file))) fail(`Required file missing: ${file}`);
  else pass(`Required file exists: ${file}`);
}

function walk(dir, results = []) {
  if (!existsSync(dir)) return results;
  const skippedDirs = new Set(['node_modules', '.next', '.turbo', '.expo', '.git', 'dist', 'build', 'coverage']);
  for (const entry of readdirSync(dir)) {
    if (skippedDirs.has(entry)) continue;
    const full = path.join(dir, entry);
    const rel = path.relative(root, full).replaceAll(path.sep, '/');
    const st = statSync(full);
    if (st.isDirectory()) walk(full, results);
    else results.push(rel);
  }
  return results;
}

function collectProjectFiles() {
  const git = spawnSync('git', ['ls-files'], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });

  if (git.status === 0 && git.stdout.trim()) {
    return git.stdout
      .split(/\r?\n/)
      .map((file) => file.trim())
      .filter(Boolean)
      .map((file) => file.replaceAll('\\', '/'));
  }

  return walk(root);
}


console.log('\n========================================');
console.log('Cane Corso Platform — Full-Stack All-in-One Release Lock QA');
console.log('========================================\n');

for (const file of requiredFiles) assertFile(file);

const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const scriptName of requiredPackageScripts) {
  if (!pkg.scripts?.[scriptName]) fail(`Package script missing: ${scriptName}`);
  else pass(`Package script exists: ${scriptName}`);
}

const files = collectProjectFiles();
const forbiddenPatterns = [
  /(^|\/)node_modules\//,
  /(^|\/)\.next\//,
  /(^|\/)\.turbo\//,
  /(^|\/)\.expo\//,
  /(^|\/)\.git\//,
  /(^|\/)package-lock\.json$/,
  /(^|\/)yarn\.lock$/,
  /\.log$/,
  /\.zip$/,
  /\.tsbuildinfo$/,
];
const forbidden = files.filter((file) => forbiddenPatterns.some((pattern) => pattern.test(file)));
if (forbidden.length > 0) {
  fail(`Forbidden artifacts found:\n${forbidden.slice(0, 50).join('\n')}`);
} else {
  pass('No forbidden clean-ZIP artifacts found in working tree');
}

const envFiles = files.filter((file) => /(^|\/)\.env(\..*)?$/.test(file) && !file.endsWith('.env.example'));
if (envFiles.length > 0) fail(`Real environment files found: ${envFiles.join(', ')}`);
else pass('No real environment files committed; .env.example files only');

for (const [label, script] of qaScripts) {
  if (!existsSync(path.join(root, script))) {
    fail(`${label} script missing: ${script}`);
    continue;
  }
  console.log(`\n--- ${label} ---`);
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, CCP_STATIC_ONLY: '1' },
  });
  if (result.status !== 0) {
    fail(`${label} failed with exit code ${result.status}`);
    break;
  }
  pass(`${label} passed`);
}

if (process.exitCode) {
  console.error('\n========================================');
  console.error('Full-stack all-in-one release lock QA FAILED');
  console.error('========================================');
  process.exit(process.exitCode);
}

console.log('\n========================================');
console.log('Full-stack all-in-one release lock QA PASS');
console.log('========================================');
console.log('\nNext local commands:');
console.log('  pnpm workspace:verify');
console.log('  pnpm workspace:syntax');
console.log('  pnpm typecheck');
