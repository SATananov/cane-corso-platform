
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
let failures = 0;

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
}

function check(condition, message) {
  if (condition) {
    console.log(`PASS ${message}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${message}`);
}

function hasFile(relativePath, message = `${relativePath} exists`) {
  check(fs.existsSync(path.join(root, relativePath)), message);
}

function hasContent(relativePath, needle, message) {
  check(read(relativePath).includes(needle), message);
}

function finish(title) {
  if (failures > 0) {
    console.error(`\n${title} failed with ${failures} issue(s).`);
    process.exit(1);
  }
  console.log(`\n${title} complete.`);
}

const title = 'Platform product release pack QA';

const requiredScripts = [
  'owner:submission-happy-path:qa',
  'admin:moderation-action-flow:qa',
  'registry:certificate-release-flow:qa',
  'nextjs:rendering-cache:qa',
  'performance:optimization:qa',
  'production:readiness:qa',
  'submission:qna:qa',
  'platform:product-release:qa',
];

for (const scriptName of requiredScripts) {
  hasContent('package.json', `"${scriptName}"`, `Package script ${scriptName} exists`);
}

const requiredFiles = [
  'apps/web/components/owner-submission-happy-path-panel.tsx',
  'apps/web/components/admin-moderation-action-flow-panel.tsx',
  'apps/web/components/registry-certificate-release-flow-panel.tsx',
  'docs/architecture/nextjs-rendering-data-cache-map.md',
  'docs/architecture/performance-optimization-pass.md',
  'docs/architecture/production-readiness-final-checklist.md',
  'docs/submission/full-stack-nextjs-q-and-a.md',
  'docs/submission/demo-script.md',
  'docs/submission/technical-architecture-summary.md',
];

for (const relativePath of requiredFiles) {
  hasFile(relativePath);
}

hasContent('apps/web/components/my-dog-form-workspace.tsx', 'OwnerSubmissionHappyPathPanel', 'Owner happy-path panel remains integrated');
hasContent('apps/web/components/review-queue-dashboard.tsx', 'AdminModerationActionFlowPanel', 'Admin action-flow panel integrated');
hasContent('apps/web/app/(public)/registry/page.tsx', 'RegistryCertificateReleaseFlowPanel', 'Public Registry release-flow panel integrated');
hasContent('apps/web/app/(admin)/admin/registry/page.tsx', 'RegistryCertificateReleaseFlowPanel', 'Admin Registry release-flow panel integrated');

const lockedAuthorityFiles = [
  'apps/web/app/api/session/route.ts',
  'apps/web/app/api/auth/sign-in/route.ts',
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/registry/[slug]/route.ts',
  'apps/web/app/api/verify/[code]/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'packages/db/src/repositories/my-dogs.repository.ts',
];

for (const relativePath of lockedAuthorityFiles) {
  hasFile(relativePath, `Locked authority file still exists: ${relativePath}`);
}

hasContent('docs/submission/full-stack-nextjs-q-and-a.md', 'What did you build?', 'Q&A package contains presentation-ready answer');
hasContent('docs/architecture/production-readiness-final-checklist.md', 'Release gate', 'Production checklist includes final release gate');

finish(title);
