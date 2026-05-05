const fs = require("fs");
const path = require("path");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
  console.log("UPDATED", file);
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, "utf8");
  console.log("WROTE", filePath);
}

function insertImport(fileText, importLine) {
  if (fileText.includes(importLine.trim())) {
    return fileText;
  }

  const imports = [...fileText.matchAll(/^import .*$/gm)];

  if (!imports.length) {
    return importLine + fileText;
  }

  const lastImport = imports.at(-1);
  const insertAt = lastImport.index + lastImport[0].length + 1;
  return fileText.slice(0, insertAt) + importLine + fileText.slice(insertAt);
}

function injectCertifiedPanel(fileText) {
  const tag = '<GalleryCertifiedShowcaseTrustPanel variant="certified" />';

  if (fileText.includes(tag)) {
    console.log("Certified trust panel already rendered.");
    return fileText;
  }

  const openContainerPatterns = [
    {
      name: "main container",
      regex: /(<main\b[^>]*>)/,
      replacement: `$1\n      ${tag}`,
    },
    {
      name: "section container",
      regex: /(<section\b[^>]*>)/,
      replacement: `$1\n      ${tag}`,
    },
    {
      name: "div container",
      regex: /(<div\b[^>]*>)/,
      replacement: `$1\n      ${tag}`,
    },
    {
      name: "fragment return",
      regex: /(return\s*\(\s*<>\s*)/,
      replacement: `$1\n      ${tag}`,
    },
    {
      name: "React fragment return",
      regex: /(return\s*\(\s*<React\.Fragment[^>]*>\s*)/,
      replacement: `$1\n      ${tag}`,
    },
  ];

  for (const pattern of openContainerPatterns) {
    if (pattern.regex.test(fileText)) {
      console.log("INSERTED certified trust panel via", pattern.name);
      return fileText.replace(pattern.regex, pattern.replacement);
    }
  }

  const directSelfClosingReturn = fileText.match(/return\s+(<[\w.]+[\s\S]*?\/>);/m);

  if (directSelfClosingReturn) {
    console.log("WRAPPED direct self-closing JSX return");
    return fileText.replace(
      directSelfClosingReturn[0],
      `return (
    <>
      ${tag}
      ${directSelfClosingReturn[1]}
    </>
  );`
    );
  }

  const directJsxReturn = fileText.match(/return\s+(<[\w.]+[\s\S]*?<\/[\w.]+>);/m);

  if (directJsxReturn) {
    console.log("WRAPPED direct JSX return");
    return fileText.replace(
      directJsxReturn[0],
      `return (
    <>
      ${tag}
      ${directJsxReturn[1]}
    </>
  );`
    );
  }

  throw new Error(
    "Could not safely insert Certified trust panel. Send the contents of apps/web/app/(public)/certified/page.tsx for a targeted manual patch."
  );
}

const certifiedPagePath = "apps/web/app/(public)/certified/page.tsx";

if (!fs.existsSync(certifiedPagePath)) {
  throw new Error("Certified page not found: " + certifiedPagePath);
}

if (!fs.existsSync("apps/web/components/gallery-certified-showcase-trust-panel.tsx")) {
  throw new Error("Step 42 shared GalleryCertifiedShowcaseTrustPanel is missing. Apply Step 42 completion first.");
}

let certifiedPage = read(certifiedPagePath);

certifiedPage = insertImport(
  certifiedPage,
  "import { GalleryCertifiedShowcaseTrustPanel } from '@/components/gallery-certified-showcase-trust-panel';\n"
);

certifiedPage = injectCertifiedPanel(certifiedPage);

write(certifiedPagePath, certifiedPage);

writeFile("docs/qa/step43-certified-archive-targeted-trust-pass.md", `# Step 43 — Certified Archive Targeted Trust Pass

Status: ready for local verification.

## Scope

Step 43 wires the existing shared Step 42 trust panel into the public Certified archive route.

This is a targeted pass because the Certified page structure is different from the Gallery route and must not be patched blindly.

## Purpose

The Certified archive should clearly communicate:

- Certified presence is based on official USG certificate logic.
- Certified archive is separate from community popularity.
- Certified archive is separate from Gallery showcase selection.
- Registry remains the public identity foundation.
- Verify / Certificate continuity remains unchanged.

## Locked boundaries

Step 43 must not change:

- Certificate issue/revoke logic
- Verify lookup logic
- Registry publish logic
- Gallery backend selection logic
- Admin moderation backend
- Ecosystem API/DB
- Auth/session

## Local verification

Run:

\`\`\`bash
pnpm certified:archive-trust:qa
pnpm gallery:showcase-trust:qa
pnpm certificate:verify-trust:qa
pnpm workspace:syntax
pnpm typecheck
\`\`\`
`);

writeFile("scripts/qa-certified-archive-targeted-trust-pass.mjs", `import fs from 'node:fs';

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

assertExists('apps/web/app/(public)/certified/page.tsx', 'Certified archive page exists');
assertExists('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Shared Gallery/Certified trust panel exists');
assertExists('docs/qa/step43-certified-archive-targeted-trust-pass.md', 'Step 43 QA document exists');

assertIncludes('package.json', '"certified:archive-trust:qa"', 'Root package exposes Step 43 QA command');

assertIncludes('apps/web/app/(public)/certified/page.tsx', 'GalleryCertifiedShowcaseTrustPanel', 'Certified page renders shared trust panel');
assertIncludes('apps/web/app/(public)/certified/page.tsx', 'variant="certified"', 'Certified page uses certified trust variant');

assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'USG Certified', 'Shared panel supports Certified archive mark');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'official archive', 'Shared panel marks Certified as official archive');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Certificate issued', 'Certified variant explains certificate-issued boundary');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Verify continuity', 'Certified variant explains Verify continuity');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Gallery boundary', 'Certified variant explains Gallery boundary');

assertIncludes('apps/web/app/globals.css', 'step42-gallery-certified-showcase-trust', 'Step 42 shared CSS remains present');

assertIncludes('docs/qa/step43-certified-archive-targeted-trust-pass.md', 'Locked boundaries', 'Step 43 QA doc records locked boundaries');

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

console.log('\\nStep 43 Certified Archive Targeted Trust Pass QA complete.');
`);

const packagePath = "package.json";
const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts["certified:archive-trust:qa"] = "node scripts/qa-certified-archive-targeted-trust-pass.mjs";
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log("UPDATED", packagePath);

console.log("Step 43 patch applied.");
