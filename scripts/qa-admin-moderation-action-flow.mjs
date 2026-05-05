
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

const title = 'Admin moderation action-flow QA';
const packageJson = read('package.json');

hasFile('apps/web/components/admin-moderation-action-flow-panel.tsx');
hasFile('docs/qa/milestone2-admin-moderation-action-flow.md');
hasContent('package.json', 'admin:moderation-action-flow:qa', 'Package script admin:moderation-action-flow:qa exists');
hasContent('apps/web/components/review-queue-dashboard.tsx', 'AdminModerationActionFlowPanel', 'Review dashboard imports/renders admin action-flow panel');
hasContent('apps/web/components/admin-moderation-action-flow-panel.tsx', 'Owner submission', 'Action flow includes owner submission step');
hasContent('apps/web/components/admin-moderation-action-flow-panel.tsx', 'Admin assessment', 'Action flow includes admin assessment step');
hasContent('apps/web/components/admin-moderation-action-flow-panel.tsx', 'Decision action', 'Action flow includes decision action step');
hasContent('apps/web/components/admin-moderation-action-flow-panel.tsx', 'Publication and trust', 'Action flow includes publication and trust step');
hasContent('apps/web/components/admin-moderation-action-flow-panel.tsx', '/admin/registry', 'Action flow links to Registry admin');
hasContent('apps/web/app/(admin)/review/actions.ts', 'applyReviewDecisionAction', 'Admin decision server action remains available');
hasContent('apps/web/app/(admin)/review/actions.ts', 'publishReviewedSubmissionAction', 'Admin publish server action remains available');
hasContent('apps/web/app/(admin)/review/actions.ts', 'issueReviewCertificateAction', 'Admin certificate issue server action remains available');
hasContent('apps/web/app/(admin)/review/actions.ts', 'revokeReviewCertificateAction', 'Admin certificate revoke server action remains available');
hasContent('apps/web/lib/review.server.ts', 'requireReviewAdminSession', 'Admin actions keep server-side admin session guard');
hasContent('docs/qa/milestone2-admin-moderation-action-flow.md', 'No Auth, session', 'Milestone doc records locked Auth/session boundary');
hasContent('apps/web/app/api/session/route.ts', 'export async function', 'Session API boundary file still exists');

finish(title);
