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

function write(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
  console.log("UPDATED", filePath);
}

const componentPath = "apps/web/components/verify-certificate-trust-continuity-panel.tsx";

writeFile(componentPath, `const trustLanes = [
  {
    title: 'Verify',
    state: 'Публична проверка',
    description:
      'Verify потвърждава публичния резултат и връзката към официалния Registry / certificate слой.',
  },
  {
    title: 'USG Certificate',
    state: 'Официален документ',
    description:
      'Сертификатът е отделно админ решение и не се появява само защото Cane Corso е в Registry.',
  },
  {
    title: 'Registry',
    state: 'Публикувана идентичност',
    description:
      'Registry профилът показва публично одобрена идентичност, снимки и основни данни.',
  },
  {
    title: 'Trust continuity',
    state: 'Една система',
    description:
      'Потребителят трябва ясно да разбира връзката Registry → Verify → Certificate без смесване на решенията.',
  },
];

export function VerifyCertificateTrustContinuityPanel() {
  return (
    <section className="verify-certificate-trust-continuity" aria-label="Verify and certificate trust continuity">
      <div className="verify-certificate-trust-continuity__head">
        <div>
          <span className="eyebrow-label">Official trust continuity</span>
          <h2>Verify, Registry и USG сертификат — една ясна система</h2>
          <p>
            Този слой помага публичният резултат да се чете правилно: Registry показва одобрена
            идентичност, Verify потвърждава публичната проверка, а USG сертификатът остава отделно
            официално админ решение.
          </p>
        </div>
        <div className="verify-certificate-trust-continuity__mark">
          <span>USG</span>
          <strong>Verified Trust</strong>
          <small>public continuity</small>
        </div>
      </div>

      <div className="verify-certificate-trust-continuity__grid">
        {trustLanes.map((lane) => (
          <article className="verify-certificate-trust-continuity__lane" key={lane.title}>
            <span>{lane.title}</span>
            <strong>{lane.state}</strong>
            <p>{lane.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
`);

const verifyPanelPath = "apps/web/components/verification-result-panel.tsx";
let verifyPanel = read(verifyPanelPath);

if (!verifyPanel.includes("VerifyCertificateTrustContinuityPanel")) {
  const importLine = "import { VerifyCertificateTrustContinuityPanel } from '@/components/verify-certificate-trust-continuity-panel';\n";

  const lastImportMatch = [...verifyPanel.matchAll(/^import .*$/gm)].at(-1);
  if (!lastImportMatch) {
    throw new Error("Could not find import block in verification-result-panel.tsx");
  }

  const insertImportAt = lastImportMatch.index + lastImportMatch[0].length + 1;
  verifyPanel = verifyPanel.slice(0, insertImportAt) + importLine + verifyPanel.slice(insertImportAt);

  const returnOpenRegex = /return\s*\(\s*(<[^>]+>)/;
  if (!returnOpenRegex.test(verifyPanel)) {
    throw new Error("Could not find safe return wrapper in verification-result-panel.tsx");
  }

  verifyPanel = verifyPanel.replace(
    returnOpenRegex,
    "return (\n    $1\n      <VerifyCertificateTrustContinuityPanel />"
  );

  write(verifyPanelPath, verifyPanel);
} else {
  console.log("SKIP VerifyCertificateTrustContinuityPanel already wired");
}

const cssPath = "apps/web/app/globals.css";
let css = read(cssPath);

if (!css.includes("step41-verify-certificate-trust-continuity")) {
  css += `

/* step41-verify-certificate-trust-continuity */
.verify-certificate-trust-continuity {
  display: grid;
  gap: 1.15rem;
  margin: 1rem 0 1.25rem;
  padding: 1.2rem;
  border: 1px solid rgba(212, 175, 55, 0.24);
  border-radius: 30px;
  background:
    radial-gradient(circle at top left, rgba(212, 175, 55, 0.14), transparent 42%),
    linear-gradient(135deg, rgba(12, 12, 14, 0.96), rgba(31, 27, 21, 0.92));
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
  color: #f8f5ef;
}

.verify-certificate-trust-continuity__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(190px, 0.32fr);
  gap: 1rem;
  align-items: start;
}

.verify-certificate-trust-continuity__head h2 {
  margin: 0.25rem 0;
  color: #f8f5ef;
}

.verify-certificate-trust-continuity__head p,
.verify-certificate-trust-continuity__lane p {
  margin: 0;
  color: rgba(248, 245, 239, 0.74);
}

.verify-certificate-trust-continuity__mark {
  display: grid;
  gap: 0.28rem;
  justify-items: end;
  padding: 0.9rem;
  border: 1px solid rgba(212, 175, 55, 0.22);
  border-radius: 24px;
  background: rgba(248, 245, 239, 0.08);
  text-align: right;
}

.verify-certificate-trust-continuity__mark span,
.verify-certificate-trust-continuity__mark small,
.verify-certificate-trust-continuity__lane span {
  color: rgba(212, 175, 55, 0.88);
  font-size: 0.74rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.verify-certificate-trust-continuity__mark strong {
  color: #f8f5ef;
  font-size: 1.05rem;
}

.verify-certificate-trust-continuity__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.verify-certificate-trust-continuity__lane {
  display: grid;
  gap: 0.45rem;
  padding: 0.9rem;
  border: 1px solid rgba(248, 245, 239, 0.1);
  border-radius: 22px;
  background: rgba(0, 0, 0, 0.18);
}

.verify-certificate-trust-continuity__lane strong {
  color: #f8f5ef;
}

:root[data-theme='heritage'] .verify-certificate-trust-continuity {
  background:
    radial-gradient(circle at top left, rgba(212, 175, 55, 0.16), transparent 42%),
    linear-gradient(135deg, rgba(18, 15, 11, 0.98), rgba(43, 34, 19, 0.92));
}

@media print {
  .verify-certificate-trust-continuity {
    display: none !important;
  }
}

@media (max-width: 1050px) {
  .verify-certificate-trust-continuity__head,
  .verify-certificate-trust-continuity__grid {
    grid-template-columns: 1fr;
  }

  .verify-certificate-trust-continuity__mark {
    justify-items: start;
    text-align: left;
  }
}
`;
  write(cssPath, css);
} else {
  console.log("SKIP Step 41 CSS already present");
}

const qaDocPath = "docs/qa/step41-certificate-verify-trust-continuity.md";
writeFile(qaDocPath, `# Step 41 — Certificate / Verify Public Trust Continuity Polish

Status: ready for local verification.

## Scope

Step 41 adds a public trust-continuity panel to the Verify result presentation.

The panel explains the relationship between:

- Registry profile
- Verify result
- USG Certificate
- Trust continuity

## Important boundary

This step is presentation-only.

It must not change:

- Certificate issue/revoke logic
- Verify lookup logic
- Registry publish logic
- Gallery backend selection logic
- Admin moderation backend
- Ecosystem API/DB
- Auth/session

## Print safety

The trust-continuity panel is hidden in print CSS and must not affect the official certificate document print layout.

## Local verification

Run:

\`\`\`bash
pnpm certificate:verify-trust:qa
pnpm admin:registry-evidence:qa
pnpm public:registry-trust:qa
pnpm review:flow-evidence:qa
pnpm workspace:syntax
pnpm typecheck
\`\`\`
`);

const qaScriptPath = "scripts/qa-certificate-verify-trust-continuity.mjs";
writeFile(qaScriptPath, `import fs from 'node:fs';

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

assertExists('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'Verify certificate trust continuity panel exists');
assertExists('docs/qa/step41-certificate-verify-trust-continuity.md', 'Step 41 QA document exists');

assertIncludes('package.json', '"certificate:verify-trust:qa"', 'Root package exposes Step 41 QA command');

assertIncludes('apps/web/components/verification-result-panel.tsx', 'VerifyCertificateTrustContinuityPanel', 'Verify result panel renders trust continuity panel');

assertIncludes('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'Verify', 'Trust continuity panel explains Verify');
assertIncludes('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'USG Certificate', 'Trust continuity panel explains USG Certificate');
assertIncludes('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'Registry', 'Trust continuity panel explains Registry');
assertIncludes('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'Trust continuity', 'Trust continuity panel explains continuity layer');
assertIncludes('apps/web/components/verify-certificate-trust-continuity-panel.tsx', 'отделно админ решение', 'Trust continuity panel keeps certificate as separate admin decision');

assertIncludes('apps/web/app/globals.css', 'step41-verify-certificate-trust-continuity', 'Step 41 CSS block exists');
assertIncludes('apps/web/app/globals.css', '@media print', 'Print safety CSS exists');
assertIncludes('apps/web/app/globals.css', '.verify-certificate-trust-continuity', 'Trust continuity CSS selector exists');

assertIncludes('docs/qa/step41-certificate-verify-trust-continuity.md', 'presentation-only', 'Step 41 QA doc records presentation-only boundary');
assertIncludes('docs/qa/step41-certificate-verify-trust-continuity.md', 'Print safety', 'Step 41 QA doc records print safety');

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

console.log('\\nStep 41 Certificate / Verify Public Trust Continuity QA complete.');
`);

const packagePath = "package.json";
const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts["certificate:verify-trust:qa"] = "node scripts/qa-certificate-verify-trust-continuity.mjs";
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log("UPDATED", packagePath);

console.log("Step 41 patch applied.");
