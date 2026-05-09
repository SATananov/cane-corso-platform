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

function insertComponentIntoJsx(fileText, componentTag, fileLabel) {
  if (fileText.includes(componentTag)) {
    console.log("SKIP component already rendered in", fileLabel);
    return fileText;
  }

  const patterns = [
    {
      name: "main",
      regex: /(<main[^>]*>)/,
      replacement: `$1\n      ${componentTag}`,
    },
    {
      name: "section",
      regex: /(<section[^>]*>)/,
      replacement: `$1\n      ${componentTag}`,
    },
    {
      name: "return wrapper div",
      regex: /(return\s*\(\s*<div[^>]*>)/,
      replacement: `$1\n      ${componentTag}`,
    },
    {
      name: "return fragment",
      regex: /(return\s*\(\s*<>)/,
      replacement: `$1\n      ${componentTag}`,
    },
  ];

  for (const pattern of patterns) {
    if (pattern.regex.test(fileText)) {
      console.log("INSERTED", componentTag, "via", pattern.name, "in", fileLabel);
      return fileText.replace(pattern.regex, pattern.replacement);
    }
  }

  throw new Error("Could not find safe JSX insertion point in " + fileLabel);
}

const componentPath = "apps/web/components/gallery-certified-showcase-trust-panel.tsx";

writeFile(componentPath, `type ShowcaseTrustPanelProps = {
  variant?: 'gallery' | 'certified';
};

const copy = {
  gallery: {
    eyebrow: 'Curated showcase trust',
    title: 'USG Gallery е избран showcase слой',
    description:
      'Галерията показва внимателно избрани снимки и публично представяне. Owner uploads, Registry photos и USG Gallery не са едно и също — Gallery остава curated слой.',
    mark: 'USG Gallery',
    small: 'curated showcase',
    lanes: [
      {
        title: 'Curated selection',
        state: 'Админ избор',
        description: 'Снимките се появяват тук само когато са избрани за showcase, не автоматично при качване от owner.',
      },
      {
        title: 'Registry boundary',
        state: 'Отделен слой',
        description: 'Registry профилът доказва публична идентичност; Gallery представя най-силното визуално присъствие.',
      },
      {
        title: 'Certificate boundary',
        state: 'Не е сертификат',
        description: 'Gallery участие не означава автоматично USG Certificate. Сертификатът остава отделно решение.',
      },
      {
        title: 'Public trust',
        state: 'Ясно четене',
        description: 'Публичният потребител трябва да разбира защо дадено Cane Corso е показано като showcase.',
      },
    ],
  },
  certified: {
    eyebrow: 'Certified showcase trust',
    title: 'Certified archive е официален trust слой',
    description:
      'Certified секцията представя Cane Corso профили с официална USG certificate логика. Тя трябва да остане отделна от community популярност и Gallery showcase.',
    mark: 'USG Certified',
    small: 'official archive',
    lanes: [
      {
        title: 'Certificate issued',
        state: 'Официално решение',
        description: 'Certified присъствие означава, че има отделно админ решение за USG certificate.',
      },
      {
        title: 'Verify continuity',
        state: 'Проверим път',
        description: 'Потребителят трябва да може да свърже Certified профил, Verify и Certificate presentation.',
      },
      {
        title: 'Registry foundation',
        state: 'Публична основа',
        description: 'Registry остава основният публичен identity layer преди Certified/Certificate четене.',
      },
      {
        title: 'Gallery boundary',
        state: 'Не е showcase автоматично',
        description: 'Certified статусът не означава автоматично Gallery селекция — Gallery е отделен curated слой.',
      },
    ],
  },
} as const;

export function GalleryCertifiedShowcaseTrustPanel({ variant = 'gallery' }: ShowcaseTrustPanelProps) {
  const content = copy[variant];

  return (
    <section className={\`gallery-certified-showcase-trust gallery-certified-showcase-trust--\${variant}\`} aria-label={content.title}>
      <div className="gallery-certified-showcase-trust__head">
        <div>
          <span className="eyebrow-label">{content.eyebrow}</span>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
        </div>
        <div className="gallery-certified-showcase-trust__mark">
          <span>USG</span>
          <strong>{content.mark}</strong>
          <small>{content.small}</small>
        </div>
      </div>

      <div className="gallery-certified-showcase-trust__grid">
        {content.lanes.map((lane) => (
          <article className="gallery-certified-showcase-trust__lane" key={lane.title}>
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

const galleryPagePath = "apps/web/app/(public)/gallery/page.tsx";
let galleryPage = read(galleryPagePath);

if (!galleryPage.includes("GalleryCertifiedShowcaseTrustPanel")) {
  galleryPage = insertImport(
    galleryPage,
    "import { GalleryCertifiedShowcaseTrustPanel } from '@/components/gallery-certified-showcase-trust-panel';\n"
  );

  galleryPage = insertComponentIntoJsx(
    galleryPage,
    "<GalleryCertifiedShowcaseTrustPanel variant=\"gallery\" />",
    galleryPagePath
  );

  write(galleryPagePath, galleryPage);
} else {
  console.log("SKIP Gallery page already has GalleryCertifiedShowcaseTrustPanel");
}

const certifiedPagePath = "apps/web/app/(public)/certified/page.tsx";

if (fs.existsSync(certifiedPagePath)) {
  let certifiedPage = read(certifiedPagePath);

  if (!certifiedPage.includes("GalleryCertifiedShowcaseTrustPanel")) {
    certifiedPage = insertImport(
      certifiedPage,
      "import { GalleryCertifiedShowcaseTrustPanel } from '@/components/gallery-certified-showcase-trust-panel';\n"
    );

    certifiedPage = insertComponentIntoJsx(
      certifiedPage,
      "<GalleryCertifiedShowcaseTrustPanel variant=\"certified\" />",
      certifiedPagePath
    );

    write(certifiedPagePath, certifiedPage);
  } else {
    console.log("SKIP Certified page already has GalleryCertifiedShowcaseTrustPanel");
  }
} else {
  console.log("SKIP Certified page not found:", certifiedPagePath);
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
} else {
  console.log("SKIP Step 42 CSS already present");
}

const qaDocPath = "docs/qa/step42-gallery-certified-showcase-trust-polish.md";
writeFile(qaDocPath, `# Step 42 — Gallery / Certified Showcase Trust Polish

Status: ready for local verification.

## Scope

Step 42 adds presentation-only trust/readability panels to the public Gallery and Certified showcase surfaces.

The goal is to make these boundaries clear:

- USG Gallery is a curated showcase layer.
- Owner uploads do not automatically become Gallery showcase images.
- Registry publication is separate from Gallery showcase selection.
- USG Certificate / Certified archive is separate from Gallery participation.
- Verify and Certificate continuity remain unchanged.

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

const qaScriptPath = "scripts/qa-gallery-certified-showcase-trust-polish.mjs";
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

assertExists('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Gallery/Certified showcase trust panel exists');
assertExists('docs/qa/step42-gallery-certified-showcase-trust-polish.md', 'Step 42 QA document exists');

assertIncludes('package.json', '"gallery:showcase-trust:qa"', 'Root package exposes Step 42 QA command');

assertIncludes('apps/web/app/(public)/gallery/page.tsx', 'GalleryCertifiedShowcaseTrustPanel', 'Public Gallery page renders showcase trust panel');
assertIncludes('apps/web/app/(public)/gallery/page.tsx', 'variant="gallery"', 'Public Gallery page uses gallery variant');

if (fs.existsSync('apps/web/app/(public)/certified/page.tsx')) {
  assertIncludes('apps/web/app/(public)/certified/page.tsx', 'GalleryCertifiedShowcaseTrustPanel', 'Certified page renders showcase trust panel');
  assertIncludes('apps/web/app/(public)/certified/page.tsx', 'variant="certified"', 'Certified page uses certified variant');
}

assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'USG Gallery е избран showcase слой', 'Panel explains Gallery as curated showcase');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Owner uploads', 'Panel explains owner uploads boundary');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Registry boundary', 'Panel explains Registry boundary');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'Certificate boundary', 'Panel explains certificate boundary');
assertIncludes('apps/web/components/gallery-certified-showcase-trust-panel.tsx', 'USG Certified', 'Panel supports Certified archive variant');

assertIncludes('apps/web/app/globals.css', 'step42-gallery-certified-showcase-trust', 'Step 42 CSS block exists');

assertIncludes('docs/qa/step42-gallery-certified-showcase-trust-polish.md', 'Locked boundaries', 'Step 42 QA doc records locked boundaries');

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

console.log("Step 42 patch applied.");
