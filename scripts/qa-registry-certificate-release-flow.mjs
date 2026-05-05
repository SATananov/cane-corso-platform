
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

const title = 'Registry certificate release-flow QA';

hasFile('apps/web/components/registry-certificate-release-flow-panel.tsx');
hasFile('docs/qa/milestone3-registry-certificate-release-flow.md');
hasContent('package.json', 'registry:certificate-release-flow:qa', 'Package script registry:certificate-release-flow:qa exists');
hasContent('apps/web/app/(public)/registry/page.tsx', 'RegistryCertificateReleaseFlowPanel', 'Public Registry renders release-flow panel');
hasContent('apps/web/app/(admin)/admin/registry/page.tsx', 'RegistryCertificateReleaseFlowPanel', 'Admin Registry renders release-flow panel');
hasContent('apps/web/components/registry-certificate-release-flow-panel.tsx', 'Registry publish', 'Release flow includes Registry publish step');
hasContent('apps/web/components/registry-certificate-release-flow-panel.tsx', 'Certificate issue', 'Release flow includes certificate issue step');
hasContent('apps/web/components/registry-certificate-release-flow-panel.tsx', 'Verify trust', 'Release flow includes Verify trust step');
hasContent('apps/web/app/(admin)/review/actions.ts', 'revalidatePath(`/verify/${result.verificationSlug}`)', 'Certificate issue revalidates Verify slug');
hasContent('apps/web/app/(admin)/review/actions.ts', 'revalidatePath(`/verify/${result.certificateCode}`)', 'Certificate issue revalidates Verify code');
hasContent('apps/web/app/api/verify/[code]/route.ts', 'export async function GET', 'Verify route handler still exists');
hasContent('apps/web/app/api/registry/[slug]/route.ts', 'export async function GET', 'Registry detail route handler still exists');
hasContent('docs/qa/milestone3-registry-certificate-release-flow.md', 'No certificate issuance logic', 'Milestone doc records locked trust authority boundary');

finish(title);
