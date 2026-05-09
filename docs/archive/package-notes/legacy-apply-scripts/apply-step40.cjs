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

const componentPath = "apps/web/components/admin-registry-evidence-polish-panel.tsx";

writeFile(componentPath, `const lanes = [
  {
    title: 'Registry публикация',
    state: 'Официален публичен слой',
    description:
      'Registry показва одобрената публична идентичност на Cane Corso. Публикацията не е автоматичен USG сертификат.',
  },
  {
    title: 'USG сертификат',
    state: 'Отделно админ решение',
    description:
      'Сертификатът се издава отделно след преглед. Verify и certificate документът трябва да останат синхронизирани.',
  },
  {
    title: 'USG Gallery',
    state: 'Curated showcase',
    description:
      'Галерията е избран showcase слой. Owner снимките не влизат автоматично там без админ селекция.',
  },
  {
    title: 'Owner source data',
    state: 'Източник, не публичен финал',
    description:
      'Данните от собственика са база за review. Админът решава кое става публично и кое остава вътрешно.',
  },
];

const checklist = [
  'Провери дали Registry профилът има ясна идентичност и публична снимка.',
  'Провери дали admin assessment обяснява решението преди сертификат.',
  'Провери дали Verify пътят е логичен само при наличен certificate/verification code.',
  'Провери дали Gallery изборът е отделен от Registry снимките.',
];

export function AdminRegistryEvidencePolishPanel() {
  return (
    <section className="admin-registry-evidence-polish" aria-label="Admin Registry evidence clarity">
      <div className="admin-registry-evidence-polish__head">
        <div>
          <span className="eyebrow-label">Admin Registry evidence</span>
          <h2>Контролен слой за Registry, сертификат и Gallery</h2>
          <p>
            Този панел е визуален guardrail за админ работа. Той не променя логиката, а напомня
            кои решения са отделни: Registry публикация, USG сертификат, Verify и USG Gallery.
          </p>
        </div>
        <div className="admin-registry-evidence-polish__seal">
          <span>USG</span>
          <strong>Review Control</strong>
          <small>presentation-only</small>
        </div>
      </div>

      <div className="admin-registry-evidence-polish__lanes">
        {lanes.map((lane) => (
          <article className="admin-registry-evidence-polish__lane" key={lane.title}>
            <span>{lane.title}</span>
            <strong>{lane.state}</strong>
            <p>{lane.description}</p>
          </article>
        ))}
      </div>

      <div className="admin-registry-evidence-polish__checklist">
        <h3>Преди финално действие</h3>
        <ul>
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
`);

const pagePath = "apps/web/app/(admin)/admin/registry/page.tsx";
let page = read(pagePath);

if (!page.includes("AdminRegistryEvidencePolishPanel")) {
  const importLine = "import { AdminRegistryEvidencePolishPanel } from '@/components/admin-registry-evidence-polish-panel';\n";

  if (page.startsWith("import ")) {
    const lastImportMatch = [...page.matchAll(/^import .*$/gm)].at(-1);
    if (!lastImportMatch) {
      throw new Error("Could not find import block in admin registry page.");
    }

    const insertAt = lastImportMatch.index + lastImportMatch[0].length + 1;
    page = page.slice(0, insertAt) + importLine + page.slice(insertAt);
  } else {
    page = importLine + page;
  }

  const render = "<AdminRegistryEvidencePolishPanel />";

  const insertionPatterns = [
    {
      name: "main",
      regex: /(<main[^>]*>)/,
      replacement: `$1\n      ${render}`,
    },
    {
      name: "admin page section",
      regex: /(<section[^>]*>)/,
      replacement: `$1\n      ${render}`,
    },
    {
      name: "return wrapper div",
      regex: /(return\s*\(\s*<div[^>]*>)/,
      replacement: `$1\n      ${render}`,
    },
  ];

  let inserted = false;

  for (const pattern of insertionPatterns) {
    if (pattern.regex.test(page)) {
      page = page.replace(pattern.regex, pattern.replacement);
      console.log("INSERTED AdminRegistryEvidencePolishPanel via", pattern.name);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    throw new Error("Could not find safe render insertion point in admin registry page.");
  }

  write(pagePath, page);
} else {
  console.log("SKIP AdminRegistryEvidencePolishPanel already wired");
}

const cssPath = "apps/web/app/globals.css";
let css = read(cssPath);

if (!css.includes("step40-admin-registry-evidence-polish")) {
  css += `

/* step40-admin-registry-evidence-polish */
.admin-registry-evidence-polish {
  display: grid;
  gap: 1.15rem;
  margin-bottom: 1.25rem;
  padding: 1.2rem;
  border: 1px solid rgba(212, 175, 55, 0.24);
  border-radius: 30px;
  background:
    radial-gradient(circle at top left, rgba(212, 175, 55, 0.14), transparent 42%),
    linear-gradient(135deg, rgba(12, 12, 14, 0.96), rgba(31, 27, 21, 0.92));
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
  color: #f8f5ef;
}

.admin-registry-evidence-polish__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(190px, 0.32fr);
  gap: 1rem;
  align-items: start;
}

.admin-registry-evidence-polish__head h2,
.admin-registry-evidence-polish__checklist h3 {
  margin: 0.25rem 0;
  color: #f8f5ef;
}

.admin-registry-evidence-polish__head p,
.admin-registry-evidence-polish__lane p,
.admin-registry-evidence-polish__checklist li {
  color: rgba(248, 245, 239, 0.74);
}

.admin-registry-evidence-polish__seal {
  display: grid;
  gap: 0.28rem;
  justify-items: end;
  padding: 0.9rem;
  border: 1px solid rgba(212, 175, 55, 0.22);
  border-radius: 24px;
  background: rgba(248, 245, 239, 0.08);
  text-align: right;
}

.admin-registry-evidence-polish__seal span,
.admin-registry-evidence-polish__seal small,
.admin-registry-evidence-polish__lane span {
  color: rgba(212, 175, 55, 0.88);
  font-size: 0.74rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-registry-evidence-polish__seal strong {
  color: #f8f5ef;
  font-size: 1.05rem;
}

.admin-registry-evidence-polish__lanes {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.admin-registry-evidence-polish__lane {
  display: grid;
  gap: 0.45rem;
  padding: 0.9rem;
  border: 1px solid rgba(248, 245, 239, 0.1);
  border-radius: 22px;
  background: rgba(0, 0, 0, 0.18);
}

.admin-registry-evidence-polish__lane strong {
  color: #f8f5ef;
}

.admin-registry-evidence-polish__checklist {
  padding: 1rem;
  border: 1px solid rgba(248, 245, 239, 0.1);
  border-radius: 24px;
  background: rgba(248, 245, 239, 0.06);
}

.admin-registry-evidence-polish__checklist ul {
  display: grid;
  gap: 0.45rem;
  margin: 0.75rem 0 0;
  padding-left: 1.1rem;
}

:root[data-theme='heritage'] .admin-registry-evidence-polish {
  background:
    radial-gradient(circle at top left, rgba(212, 175, 55, 0.16), transparent 42%),
    linear-gradient(135deg, rgba(18, 15, 11, 0.98), rgba(43, 34, 19, 0.92));
}

@media (max-width: 1050px) {
  .admin-registry-evidence-polish__head,
  .admin-registry-evidence-polish__lanes {
    grid-template-columns: 1fr;
  }

  .admin-registry-evidence-polish__seal {
    justify-items: start;
    text-align: left;
  }
}
`;
  write(cssPath, css);
} else {
  console.log("SKIP Step 40 CSS already present");
}

const qaDocPath = "docs/qa/step40-admin-registry-evidence-polish.md";
writeFile(qaDocPath, `# Step 40 — Admin Registry Evidence / Control Clarity Polish

Status: ready for local verification.

## Scope

Step 40 adds a presentation-only evidence/control clarity panel to the Admin Registry area.

The panel explains the separation between:

- Registry publication
- USG Certificate decision
- Verify route
- USG Gallery curation
- Owner source data

## Locked boundaries

Step 40 must not change:

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
pnpm admin:registry-evidence:qa
pnpm public:registry-trust:qa
pnpm review:flow-evidence:qa
pnpm workspace:syntax
pnpm typecheck
\`\`\`
`);

const qaScriptPath = "scripts/qa-admin-registry-evidence-polish.mjs";
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

assertExists('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'Admin Registry evidence polish panel exists');
assertExists('docs/qa/step40-admin-registry-evidence-polish.md', 'Step 40 QA document exists');

assertIncludes('package.json', '"admin:registry-evidence:qa"', 'Root package exposes Step 40 QA command');

assertIncludes('apps/web/app/(admin)/admin/registry/page.tsx', 'AdminRegistryEvidencePolishPanel', 'Admin Registry page renders evidence polish panel');
assertIncludes('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'Registry публикация', 'Panel explains Registry publication');
assertIncludes('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'USG сертификат', 'Panel explains certificate decision');
assertIncludes('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'USG Gallery', 'Panel explains Gallery curation');
assertIncludes('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'Owner source data', 'Panel explains owner source boundary');
assertIncludes('apps/web/components/admin-registry-evidence-polish-panel.tsx', 'presentation-only', 'Panel is explicitly presentation-only');

assertIncludes('apps/web/app/globals.css', 'step40-admin-registry-evidence-polish', 'Step 40 CSS block exists');
assertIncludes('docs/qa/step40-admin-registry-evidence-polish.md', 'Locked boundaries', 'Step 40 QA doc records locked boundaries');

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

console.log('\\nStep 40 Admin Registry Evidence / Control Clarity Polish QA complete.');
`);

const packagePath = "package.json";
const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts["admin:registry-evidence:qa"] = "node scripts/qa-admin-registry-evidence-polish.mjs";
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log("UPDATED", packagePath);

console.log("Step 40 patch applied.");
