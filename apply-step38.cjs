const fs = require("fs");
const path = require("path");

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, "utf8");
  console.log("WROTE", filePath);
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

const evidenceDoc = `# Step 38 — Review Flow Browser Evidence & Release Lock

Status: ready for local browser verification.

## Purpose

Step 38 locks the owner/admin review readiness cycle introduced in Step 36 and Step 37.

It does not add product logic. It creates a clear QA/evidence boundary for the full review flow:

1. Owner prepares a Cane Corso profile.
2. Owner understands private profile vs public Registry visibility.
3. Admin reviews the submission with evidence support.
4. Admin keeps Registry, USG Certificate, USG Gallery and Owner data as separate layers.
5. Locked Registry / Certificate / Gallery / Verify / Ecosystem / Auth logic remains untouched.

## Browser evidence checklist

### Owner flow

Open:

- \`/my-dogs\`
- \`/my-dogs/new\`
- an existing edit route if available

Verify:

- Owner Review Readiness panel is visible.
- Checklist explains identity, details, story, photos, pedigree and review path.
- Owner understands that Registry, USG Certificate and USG Gallery are separate decisions.
- Owner photo guide remains available.
- Breed Standard proportions layer remains available through Knowledge/My Dogs guide.
- No mixed BG/EN wording appears in the visible BG flow except brand/product terms.

### Admin review flow

Open:

- \`/review\`

Verify:

- Review Decision Readiness panel is visible for review queue items.
- Panel shows evidence counts for owner photos, Registry-visible photos and Gallery-selected photos.
- Registry lane is separate from USG Certificate lane.
- USG Gallery lane is curated and not automatic.
- Owner boundary is clearly explained.
- Existing admin assessment and action controls remain available.
- No backend moderation behavior is changed by the presentation panel.

### Locked boundaries

Do not change or retest as modified logic unless a future step explicitly targets them:

- Registry publish logic
- Certificate issue/revoke logic
- Verify lookup logic
- Gallery selection backend logic
- Admin moderation backend
- Ecosystem API/DB
- Auth/session

## Required local commands

Run:

\`\`\`bash
pnpm review:flow-evidence:qa
pnpm admin:review-decision:qa
pnpm owner:review-readiness:qa
pnpm breed:standard:qa
pnpm public:experience-polish:qa
pnpm brand:trust:qa
pnpm certificate:seal-polish:qa
pnpm entry:first-scene:qa
pnpm knowledge:admin-articles:qa
pnpm knowledge:browser-bg:qa
pnpm workspace:syntax
pnpm typecheck
\`\`\`

## Release note

When all checks pass and browser evidence is accepted, create:

\`ccp_step38_review_flow_evidence_release_lock_clean.zip\`

This becomes the clean continuation checkpoint after Step 38.
`;

writeFile("docs/qa/step38-review-flow-browser-evidence-release-lock.md", evidenceDoc);

const qaScript = `import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function pass(message) {
  console.log('PASS', message);
}

function assertExists(file, message) {
  if (!fs.existsSync(file)) {
    throw new Error(\`FAIL \${message} — missing \${file}\`);
  }
  pass(message);
}

function assertIncludes(file, needle, message) {
  const text = read(file);
  if (!text.includes(needle)) {
    throw new Error(\`FAIL \${message} — missing "\${needle}" in \${file}\`);
  }
  pass(message);
}

assertExists('docs/qa/step38-review-flow-browser-evidence-release-lock.md', 'Step 38 browser evidence release-lock document exists');
assertExists('apps/web/components/owner-review-readiness-panel.tsx', 'Step 36 owner readiness panel still exists');
assertExists('apps/web/components/review-decision-readiness-panel.tsx', 'Step 37 admin decision readiness panel still exists');

assertIncludes('package.json', '"review:flow-evidence:qa"', 'Root package exposes Step 38 review flow evidence QA command');

assertIncludes('apps/web/components/owner-review-readiness-panel.tsx', 'Owner profile', 'Owner readiness panel preserves Owner profile boundary');
assertIncludes('apps/web/components/owner-review-readiness-panel.tsx', 'USG Certificate', 'Owner readiness panel preserves USG Certificate boundary');
assertIncludes('apps/web/components/owner-review-readiness-panel.tsx', 'USG Gallery', 'Owner readiness panel preserves USG Gallery boundary');

assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'Owner boundary', 'Admin decision panel preserves Owner boundary lane');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'registryMedia', 'Admin decision panel preserves Registry media evidence');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'gallerySelectedPhotoCount', 'Admin decision panel preserves Gallery selected evidence');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'hasAdminAssessment', 'Admin decision panel preserves admin assessment evidence');

assertIncludes('apps/web/components/my-dogs-overview.tsx', 'OwnerReviewReadinessPanel', 'My Dogs overview still renders owner readiness panel');
assertIncludes('apps/web/components/dog-form-workspace.tsx', 'OwnerReviewReadinessPanel', 'Dog form workspace still renders owner readiness panel');
assertIncludes('apps/web/components/dog-profile-preview-card.tsx', 'OwnerReviewReadinessPanel', 'Dog profile preview still renders compact readiness panel');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'ReviewDecisionReadinessPanel', 'Review queue still renders admin decision panel');

assertIncludes('apps/web/app/globals.css', 'step36-owner-review-readiness', 'Step 36 CSS block remains present');
assertIncludes('apps/web/app/globals.css', 'step37-review-decision-readiness', 'Step 37 CSS block remains present');

assertIncludes('docs/qa/step38-review-flow-browser-evidence-release-lock.md', 'Owner flow', 'Step 38 doc records owner browser checklist');
assertIncludes('docs/qa/step38-review-flow-browser-evidence-release-lock.md', 'Admin review flow', 'Step 38 doc records admin browser checklist');
assertIncludes('docs/qa/step38-review-flow-browser-evidence-release-lock.md', 'Locked boundaries', 'Step 38 doc records locked boundaries');

for (const locked of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/(admin)/review/actions.ts',
  'apps/web/lib/knowledge-articles.ts'
]) {
  assertExists(locked, \`Locked surface still exists: \${locked}\`);
}

console.log('\\nStep 38 Review Flow Browser Evidence & Release Lock QA complete.');
`;

writeFile("scripts/qa-review-flow-browser-evidence-release-lock.mjs", qaScript);

const releaseDoc = `# Review Cycle Release Lock — Steps 36–38

## Locked status target

- Step 36 — Owner / My Dogs Review Readiness: PASS / LOCK
- Step 37 — Admin Review Decision Console: PASS / LOCK
- Step 38 — Review Flow Browser Evidence & Release Lock: PASS / LOCK after local verification

## Product boundary

The review cycle now has a clearer two-sided experience:

- Owner side: preparation, readiness, photo guidance, private/public boundary.
- Admin side: evidence review, Registry lane, USG Certificate lane, USG Gallery curation lane, owner-source boundary.
- QA side: repeatable browser evidence checklist and guardrail script.

## Non-goals

This release lock does not change:

- Registry publishing logic
- Certificate issuing/revoking logic
- Verify lookup
- Gallery backend selection logic
- Ecosystem API/DB
- Auth/session

## Clean checkpoint name

\`ccp_step38_review_flow_evidence_release_lock_clean.zip\`
`;

writeFile("docs/release/review-cycle-release-lock-step38.md", releaseDoc);

const packagePath = "package.json";
const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts["review:flow-evidence:qa"] = "node scripts/qa-review-flow-browser-evidence-release-lock.mjs";
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log("UPDATED", packagePath);

console.log("Step 38 patch applied.");
