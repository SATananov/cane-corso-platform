const fs = require("fs");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, text) {
  fs.writeFileSync(file, text, "utf8");
  console.log("UPDATED", file);
}

function ensureDir(file) {
  const path = require("path");
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function writeFile(file, text) {
  ensureDir(file);
  fs.writeFileSync(file, text, "utf8");
  console.log("WROTE", file);
}

const galleryPage = "apps/web/app/(public)/gallery/page.tsx";
let gallery = read(galleryPage);

if (!gallery.includes("GalleryCertifiedShowcaseTrustPanel")) {
  const imports = [...gallery.matchAll(/^import .*$/gm)];
  const importLine = "import { GalleryCertifiedShowcaseTrustPanel } from '@/components/gallery-certified-showcase-trust-panel';\n";

  if (imports.length) {
    const lastImport = imports.at(-1);
    const insertAt = lastImport.index + lastImport[0].length + 1;
    gallery = gallery.slice(0, insertAt) + importLine + gallery.slice(insertAt);
  } else {
    gallery = importLine + gallery;
  }

  gallery = gallery.replace(/(<main[^>]*>|<section[^>]*>)/, `$1
      <GalleryCertifiedShowcaseTrustPanel variant="gallery" />`);

  write(galleryPage, gallery);
}

const certifiedPage = "apps/web/app/(public)/certified/page.tsx";
if (fs.existsSync(certifiedPage)) {
  const certified = read(certifiedPage);
  if (certified.includes("GalleryCertifiedShowcaseTrustPanel")) {
    console.log("Certified page already has showcase panel.");
  } else {
    console.log("Certified page exists but is not safely auto-wired in this batch. Keeping Certified variant in the component for a targeted later pass.");
  }
}

const cssPath = "apps/web/app/globals.css";
let css = read(cssPath);

if (!css.includes("step42-gallery-certified-showcase-trust")) {
  css += `

/* step42-gallery-certified-showcase-trust */
.gallery-certified-showcase-trust {
  display: grid;
  gap: 1.15rem;
  margin: 1rem 0 1.35rem;
  padding: 1.2rem;
  border: 1px solid rgba(212, 175, 55, 0.24);
  border-radius: 30px;
  background:
    radial-gradient(circle at top left, rgba(212, 175, 55, 0.14), transparent 42%),
    linear-gradient(135deg, rgba(12, 12, 14, 0.96), rgba(31, 27, 21, 0.92));
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
  color: #f8f5ef;
}

.gallery-certified-showcase-trust__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(190px, 0.32fr);
  gap: 1rem;
  align-items: start;
}

.gallery-certified-showcase-trust__head h2 {
  margin: 0.25rem 0;
  color: #f8f5ef;
}

.gallery-certified-showcase-trust__head p,
.gallery-certified-showcase-trust__lane p {
  margin: 0;
  color: rgba(248, 245, 239, 0.74);
}

.gallery-certified-showcase-trust__mark {
  display: grid;
  gap: 0.28rem;
  justify-items: end;
  padding: 0.9rem;
  border: 1px solid rgba(212, 175, 55, 0.22);
  border-radius: 24px;
  background: rgba(248, 245, 239, 0.08);
  text-align: right;
}

.gallery-certified-showcase-trust__mark span,
.gallery-certified-showcase-trust__mark small,
.gallery-certified-showcase-trust__lane span {
  color: rgba(212, 175, 55, 0.88);
  font-size: 0.74rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.gallery-certified-showcase-trust__mark strong {
  color: #f8f5ef;
  font-size: 1.05rem;
}

.gallery-certified-showcase-trust__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.gallery-certified-showcase-trust__lane {
  display: grid;
  gap: 0.45rem;
  padding: 0.9rem;
  border: 1px solid rgba(248, 245, 239, 0.1);
  border-radius: 22px;
  background: rgba(0, 0, 0, 0.18);
}

.gallery-certified-showcase-trust__lane strong {
  color: #f8f5ef;
}

.gallery-certified-showcase-trust--certified {
  border-color: rgba(212, 175, 55, 0.34);
}

:root[data-theme='heritage'] .gallery-certified-showcase-trust {
  background:
    radial-gradient(circle at top left, rgba(212, 175, 55, 0.16), transparent 42%),
    linear-gradient(135deg, rgba(18, 15, 11, 0.98), rgba(43, 34, 19, 0.92));
}

@media (max-width: 1050px) {
  .gallery-certified-showcase-trust__head,
  .gallery-certified-showcase-trust__grid {
    grid-template-columns: 1fr;
  }

  .gallery-certified-showcase-trust__mark {
    justify-items: start;
    text-align: left;
  }
}
`;
  write(cssPath, css);
}

writeFile("docs/qa/step42-gallery-certified-showcase-trust-polish.md", `# Step 42 — Gallery / Certified Showcase Trust Polish

Status: ready for local verification.

## Scope

Step 42 adds a presentation-only trust/readability panel to the public Gallery surface and prepares a Certified variant inside the shared component.

The goal is to make these boundaries clear:

- USG Gallery is a curated showcase layer.
- Owner uploads do not automatically become Gallery showcase images.
- Registry publication is separate from Gallery showcase selection.
- USG Certificate / Certified archive is separate from Gallery participation.
- Verify and Certificate continuity remain unchanged.

## Certified page note

The Certified variant is implemented in the shared component, but the Certified route has a different page structure and is intentionally not force-wired by this blind patch. It can receive a targeted page-specific pass later.

## Locked boundaries

Step 42 must not change:

- Registry publish logic
- Certificate issue/revoke logic
- Verify lookup logic
- Gallery backend selection logic
- Admin moderation backend
- Ecosystem API/DB
- Auth/session

## Local verification

Run:

\`\`\`bash
pnpm gallery:showcase-trust:qa
pnpm certificate:verify-trust:qa
pnpm admin:registry-evidence:qa
pnpm public:registry-trust:qa
pnpm review:flow-evidence:qa
pnpm workspace:syntax
pnpm typecheck
\`\`\`
`);

writeFile("scripts/qa-gallery-certified-showcase-trust-polish.mjs", `import fs from 'node:fs';

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

assertExists('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Gallery/Certified showcase trust panel exists');
assertExists('docs/qa/step42-gallery-certified-showcase-trust-polish.md', 'Step 42 QA document exists');

assertIncludes('package.json', '"gallery:showcase-trust:qa"', 'Root package exposes Step 42 QA command');

assertIncludes('apps/web/app/(public)/gallery/page.tsx', 'GalleryCertifiedShowcaseTrustPanel', 'Public Gallery page renders showcase trust panel');
assertIncludes('apps/web/app/(public)/gallery/page.tsx', 'variant="gallery"', 'Public Gallery page uses gallery variant');

assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'USG Gallery е избран showcase слой', 'Panel explains Gallery as curated showcase');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Owner uploads', 'Panel explains owner uploads boundary');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Registry boundary', 'Panel explains Registry boundary');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Certificate boundary', 'Panel explains certificate boundary');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'USG Certified', 'Panel supports Certified archive variant');

assertIncludes('apps/web/app/globals.css', 'step42-gallery-certified-showcase-trust', 'Step 42 CSS block exists');

assertIncludes('docs/qa/step42-gallery-certified-showcase-trust-polish.md', 'Locked boundaries', 'Step 42 QA doc records locked boundaries');
assertIncludes('docs/qa/step42-gallery-certified-showcase-trust-polish.md', 'Certified page note', 'Step 42 QA doc records Certified route note');

for (const locked of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/(admin)/review/actions.ts',
  'apps/web/lib/knowledge-articles.ts'
]) {
  assertExists(locked, 'Locked surface still exists: ' + locked);
}

console.log('\\nStep 42 Gallery / Certified Showcase Trust Polish QA complete.');
`);

const packagePath = "package.json";
const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts["gallery:showcase-trust:qa"] = "node scripts/qa-gallery-certified-showcase-trust-polish.mjs";
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log("UPDATED", packagePath);

console.log("Step 42 completion applied.");
