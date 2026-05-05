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

writeFile("docs/qa/step44-trust-surfaces-browser-visual-review.md", `# Step 44 — Trust Surfaces Browser Visual Review Evidence Lock

Status: ready for local browser review.

## Purpose

Step 44 locks the visual review process for the full trust/showcase cycle after Steps 36–43.

This step does not change product logic or UI. It creates a browser evidence checklist for the public and admin trust surfaces.

## Routes to review

Open locally:

- \`/\`
- \`/platform\`
- \`/registry\`
- one public Registry detail page if seeded/available
- \`/verify\`
- one Verify result page if seeded/available
- one Certificate page if seeded/available
- \`/gallery\`
- \`/certified\`
- \`/my-dogs\`
- \`/review\`
- \`/admin/registry\`

## Visual checklist

For each route, verify:

- The page does not feel overloaded by trust panels.
- Trust panels are visually premium and aligned with the black/gold USG identity.
- Dark / Heritage mode contrast is readable.
- Light mode does not lose text contrast.
- Mobile width does not break panel grids.
- No Bulgarian mojibake appears.
- No mixed BG/EN wording appears except accepted brand/product terms such as Registry, Verify, USG, Certificate, Gallery.
- Header remains visually stable.
- Buttons remain readable and clickable.
- Cards do not collide with hero sections.
- No admin-only explanation appears on public guest pages unless intentionally public-facing.

## Trust boundary checklist

Verify the user can understand:

- Registry = official public identity layer.
- Verify = public verification path.
- USG Certificate = separate admin-issued decision.
- USG Gallery = curated showcase layer.
- Certified archive = official certificate archive.
- Owner uploads do not automatically become public Gallery photos.
- Community signals do not replace admin/certificate authority.

## Locked boundaries

Step 44 must not change:

- Registry publish logic
- Certificate issue/revoke logic
- Verify lookup logic
- Gallery backend selection logic
- Admin moderation backend
- Ecosystem API/DB
- Auth/session

## Required local commands

Run:

\`\`\`bash
pnpm trust:browser-review:qa
pnpm certified:archive-trust:qa
pnpm gallery:showcase-trust:qa
pnpm certificate:verify-trust:qa
pnpm admin:registry-evidence:qa
pnpm public:registry-trust:qa
pnpm review:flow-evidence:qa
pnpm workspace:syntax
pnpm typecheck
\`\`\`

## Browser evidence result

Use this section after manual review:

- [ ] Desktop dark mode reviewed
- [ ] Desktop light mode reviewed
- [ ] Heritage mode reviewed
- [ ] Mobile width reviewed
- [ ] Public trust pages reviewed
- [ ] Admin trust pages reviewed
- [ ] No blocking visual issue found
- [ ] If issues exist, list them below before Step 45

### Notes

Add screenshots or notes here during local review.
`);

writeFile("docs/release/trust-surfaces-browser-review-step44.md", `# Trust Surfaces Browser Review Lock — Step 44

## Locked cycle

- Step 36 — Owner readiness
- Step 37 — Admin review decision
- Step 38 — Review flow evidence lock
- Step 39 — Public Registry trust/readability
- Step 40 — Admin Registry evidence clarity
- Step 41 — Certificate / Verify public trust continuity
- Step 42 — Gallery showcase trust polish
- Step 43 — Certified archive targeted trust pass
- Step 44 — Browser visual review evidence lock

## Release intent

Step 44 prepares the trust/showcase surfaces for visual approval before adding more product functionality.

## Clean checkpoint name

\`ccp_step44_trust_surfaces_browser_visual_review_clean.zip\`
`);

writeFile("scripts/qa-trust-surfaces-browser-review.mjs", `import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function pass(message) {
  console.log('PASS', message);
}

function assertExists(file, message) {
  if (!fs.existsSync(file)) {
    throw new Error('FAIL ' + message + ' — missing ' + file);
  }
  pass(message);
}

function assertIncludes(file, needle, message) {
  const text = read(file);
  if (!text.includes(needle)) {
    throw new Error('FAIL ' + message + ' — missing "' + needle + '" in ' + file);
  }
  pass(message);
}

assertExists('docs/qa/step44-trust-surfaces-browser-visual-review.md', 'Step 44 browser visual review document exists');
assertExists('docs/release/trust-surfaces-browser-review-step44.md', 'Step 44 release review document exists');

assertIncludes('package.json', '"trust:browser-review:qa"', 'Root package exposes Step 44 QA command');

assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', '/registry', 'Step 44 checklist includes Registry');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', '/verify', 'Step 44 checklist includes Verify');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', '/gallery', 'Step 44 checklist includes Gallery');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', '/certified', 'Step 44 checklist includes Certified');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', '/review', 'Step 44 checklist includes Admin review');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', '/admin/registry', 'Step 44 checklist includes Admin Registry');

assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', 'Registry = official public identity layer', 'Step 44 checklist records Registry boundary');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', 'Verify = public verification path', 'Step 44 checklist records Verify boundary');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', 'USG Certificate = separate admin-issued decision', 'Step 44 checklist records certificate boundary');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', 'USG Gallery = curated showcase layer', 'Step 44 checklist records Gallery boundary');
assertIncludes('docs/qa/step44-trust-surfaces-browser-visual-review.md', 'Certified archive = official certificate archive', 'Step 44 checklist records Certified boundary');

assertExists('apps/web/components/owner-review-readiness-panel.tsx', 'Step 36 owner readiness panel remains present');
assertExists('apps/web/components/review-decision-readiness-panel.tsx', 'Step 37 admin decision panel remains present');
assertExists('apps/web/components/public-registry-trust-readability-panel.tsx', 'Step 39 public Registry trust panel remains present');
assertExists('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'Step 40 admin Registry evidence panel remains present');
assertExists('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'Step 41 Verify/certificate trust panel remains present');
assertExists('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Step 42/43 Gallery/Certified trust panel remains present');

assertIncludes('apps/web/app/(public)/certified/page.tsx', 'GalleryCertifiedShowcaseTrustPanel', 'Certified page remains wired to trust panel');
assertIncludes('apps/web/app/(public)/gallery/page.tsx', 'GalleryCertifiedShowcaseTrustPanel', 'Gallery page remains wired to trust panel');

for (const locked of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(admin)/review/actions.ts',
  'apps/web/lib/knowledge-articles.ts'
]) {
  assertExists(locked, 'Locked surface still exists: ' + locked);
}

console.log('\\nStep 44 Trust Surfaces Browser Visual Review QA complete.');
`);

const packagePath = "package.json";
const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts["trust:browser-review:qa"] = "node scripts/qa-trust-surfaces-browser-review.mjs";
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log("UPDATED", packagePath);

console.log("Step 44 evidence pack applied.");
