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

const componentPath = "apps/web/components/public-registry-trust-readability-panel.tsx";

writeFile(componentPath, `import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

type PublicRegistryTrustLane = {
  id: 'registry' | 'assessment' | 'certificate' | 'community' | 'member';
  title: string;
  description: string;
  state: string;
  ready: boolean;
};

type PublicRegistryTrustCopy = {
  eyebrow: string;
  title: string;
  description: string;
  registry: string;
  assessment: string;
  certificate: string;
  community: string;
  member: string;
  ready: string;
  pending: string;
  available: string;
  limited: string;
  votes: string;
  openVerify: string;
  openCertificate: string;
  lanes: {
    registry: string;
    registryDescription: string;
    assessment: string;
    assessmentDescription: string;
    certificate: string;
    certificateDescription: string;
    community: string;
    communityDescription: string;
    member: string;
    memberDescription: string;
  };
};

interface PublicRegistryTrustReadabilityPanelProps {
  locale: Locale;
  dogName: string;
  hasMemberAccess: boolean;
  hasCertificate: boolean;
  hasAdminAssessment: boolean;
  hasPublicMedia: boolean;
  hasPedigree: boolean;
  communityVoteCount: number;
  verifyHref?: string | null;
  certificateHref?: string | null;
}

const copyByLocale: Record<string, PublicRegistryTrustCopy> = {
  en: {
    eyebrow: 'Public trust reading',
    title: 'How to read this Registry profile',
    description:
      'This public page is a trusted Registry presentation. It connects Registry, USG Certificate, Verify and community signals without mixing them into one decision.',
    registry: 'Registry',
    assessment: 'Admin assessment',
    certificate: 'USG Certificate',
    community: 'Community',
    member: 'Member depth',
    ready: 'Visible',
    pending: 'Pending',
    available: 'Available',
    limited: 'Limited for guests',
    votes: 'votes',
    openVerify: 'Open Verify',
    openCertificate: 'Open Certificate',
    lanes: {
      registry: 'Published Registry identity',
      registryDescription: 'The Cane Corso has an approved public Registry presence with public-facing media and core identity.',
      assessment: 'Official assessment layer',
      assessmentDescription: 'Admin assessment explains quality/readiness signals and remains separate from community voting.',
      certificate: 'Certificate decision',
      certificateDescription: 'A USG certificate appears only when issued. Registry publication alone is not the same as certification.',
      community: 'Community signal',
      communityDescription: 'Community rating is social feedback and never replaces the official admin/certificate layer.',
      member: 'Deeper member view',
      memberDescription: 'Guests see a trusted public preview. Members can access richer profile depth when available.',
    },
  },
  bg: {
    eyebrow: 'Публично четене на доверие',
    title: 'Как да се чете този Registry профил',
    description:
      'Тази публична страница е доверено Registry представяне. Тя свързва Registry, USG сертификат, Verify и сигналите от общността, без да ги смесва като едно решение.',
    registry: 'Registry',
    assessment: 'Админ оценка',
    certificate: 'USG сертификат',
    community: 'Общност',
    member: 'Членски слой',
    ready: 'Видимо',
    pending: 'Очаква',
    available: 'Налично',
    limited: 'Ограничено за гост',
    votes: 'гласа',
    openVerify: 'Отвори Verify',
    openCertificate: 'Отвори сертификата',
    lanes: {
      registry: 'Публикувана Registry идентичност',
      registryDescription: 'Cane Corso има одобрено публично присъствие в Registry с публични снимки и основна идентичност.',
      assessment: 'Официален слой за оценка',
      assessmentDescription: 'Админ оценката обяснява сигналите за качество/готовност и остава отделна от гласуването на общността.',
      certificate: 'Решение за сертификат',
      certificateDescription: 'USG сертификат се показва само когато е издаден. Публикация в Registry не е същото като сертифициране.',
      community: 'Сигнал от общността',
      communityDescription: 'Оценката от общността е социална обратна връзка и не заменя официалния admin/certificate слой.',
      member: 'По-дълбок членски изглед',
      memberDescription: 'Гостите виждат доверен публичен преглед. Членовете могат да достъпят по-богат профилен слой, когато е наличен.',
    },
  },
  it: {
    eyebrow: 'Lettura pubblica della fiducia',
    title: 'Come leggere questo profilo Registry',
    description:
      'Questa pagina pubblica è una presentazione Registry affidabile. Collega Registry, certificato USG, Verify e segnali community senza confonderli in una sola decisione.',
    registry: 'Registry',
    assessment: 'Valutazione admin',
    certificate: 'Certificato USG',
    community: 'Community',
    member: 'Livello membro',
    ready: 'Visibile',
    pending: 'In attesa',
    available: 'Disponibile',
    limited: 'Limitato per ospiti',
    votes: 'voti',
    openVerify: 'Apri Verify',
    openCertificate: 'Apri certificato',
    lanes: {
      registry: 'Identità Registry pubblicata',
      registryDescription: 'Il Cane Corso ha una presenza pubblica approvata nel Registry con media pubblici e identità principale.',
      assessment: 'Livello di valutazione ufficiale',
      assessmentDescription: 'La valutazione admin spiega segnali di qualità/prontezza e resta separata dal voto community.',
      certificate: 'Decisione certificato',
      certificateDescription: 'Un certificato USG appare solo quando emesso. La pubblicazione Registry non equivale alla certificazione.',
      community: 'Segnale community',
      communityDescription: 'La valutazione community è feedback sociale e non sostituisce il livello ufficiale admin/certificato.',
      member: 'Vista membro più profonda',
      memberDescription: 'Gli ospiti vedono un’anteprima pubblica affidabile. I membri possono accedere a un livello profilo più ricco quando disponibile.',
    },
  },
};

function getCopy(locale: Locale) {
  return copyByLocale[locale] ?? copyByLocale.en;
}

function getState(ready: boolean, copy: PublicRegistryTrustCopy) {
  return ready ? copy.ready : copy.pending;
}

export function PublicRegistryTrustReadabilityPanel({
  locale,
  dogName,
  hasMemberAccess,
  hasCertificate,
  hasAdminAssessment,
  hasPublicMedia,
  hasPedigree,
  communityVoteCount,
  verifyHref,
  certificateHref,
}: PublicRegistryTrustReadabilityPanelProps) {
  const copy = getCopy(locale);

  const lanes: PublicRegistryTrustLane[] = [
    {
      id: 'registry',
      title: copy.lanes.registry,
      description: copy.lanes.registryDescription,
      state: hasPublicMedia ? copy.ready : copy.pending,
      ready: hasPublicMedia,
    },
    {
      id: 'assessment',
      title: copy.lanes.assessment,
      description: copy.lanes.assessmentDescription,
      state: getState(hasAdminAssessment, copy),
      ready: hasAdminAssessment,
    },
    {
      id: 'certificate',
      title: copy.lanes.certificate,
      description: copy.lanes.certificateDescription,
      state: hasCertificate ? copy.available : copy.pending,
      ready: hasCertificate,
    },
    {
      id: 'community',
      title: copy.lanes.community,
      description: copy.lanes.communityDescription,
      state: communityVoteCount > 0 ? communityVoteCount + ' ' + copy.votes : copy.pending,
      ready: communityVoteCount > 0,
    },
    {
      id: 'member',
      title: copy.lanes.member,
      description: copy.lanes.memberDescription,
      state: hasMemberAccess ? copy.available : copy.limited,
      ready: hasMemberAccess,
    },
  ];

  return (
    <section className="public-registry-trust-readability" aria-label={copy.title}>
      <div className="public-registry-trust-readability__head">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h3>{copy.title}</h3>
          <p>{copy.description}</p>
        </div>
        <div className="public-registry-trust-readability__identity" aria-label={dogName}>
          <span>{copy.registry}</span>
          <strong>{dogName}</strong>
          <small>{hasPedigree ? copy.lanes.member : copy.limited}</small>
        </div>
      </div>

      <div className="public-registry-trust-readability__grid">
        {lanes.map((lane) => (
          <article className={lane.ready ? 'public-registry-trust-readability__lane is-ready' : 'public-registry-trust-readability__lane'} key={lane.id}>
            <span>{lane.title}</span>
            <strong>{lane.state}</strong>
            <p>{lane.description}</p>
          </article>
        ))}
      </div>

      {verifyHref || certificateHref ? (
        <div className="public-registry-trust-readability__actions">
          {verifyHref ? (
            <Link href={verifyHref} className="button-primary small">
              {copy.openVerify}
            </Link>
          ) : null}
          {certificateHref ? (
            <Link href={certificateHref} className="button-secondary small">
              {copy.openCertificate}
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
`);

const profilePath = "apps/web/components/public-registry-profile.tsx";
let profile = read(profilePath);

if (!profile.includes("PublicRegistryTrustReadabilityPanel")) {
  profile = profile.replace(
    "import { PedigreeTree } from '@/components/pedigree-tree';",
    "import { PedigreeTree } from '@/components/pedigree-tree';\nimport { PublicRegistryTrustReadabilityPanel } from '@/components/public-registry-trust-readability-panel';"
  );

  const target = `            <div className="registry-approval-grid registry-approval-grid--profile">
              <div className="registry-approval-card registry-approval-card--approved">
                <span>{copy.labels.registryApproved}</span>
                <strong>{copy.labels.yes}</strong>
              </div>
              <div className={\`registry-approval-card \${hasCertificate ? 'registry-approval-card--approved' : 'registry-approval-card--pending'}\`}>
                <span>{copy.labels.certificateApproved}</span>
                <strong>{hasCertificate ? copy.labels.yes : copy.labels.no}</strong>
              </div>
            </div>


            <div className="registry-admin-assessment-public">`;

  const replacement = `            <div className="registry-approval-grid registry-approval-grid--profile">
              <div className="registry-approval-card registry-approval-card--approved">
                <span>{copy.labels.registryApproved}</span>
                <strong>{copy.labels.yes}</strong>
              </div>
              <div className={\`registry-approval-card \${hasCertificate ? 'registry-approval-card--approved' : 'registry-approval-card--pending'}\`}>
                <span>{copy.labels.certificateApproved}</span>
                <strong>{hasCertificate ? copy.labels.yes : copy.labels.no}</strong>
              </div>
            </div>

            <PublicRegistryTrustReadabilityPanel
              locale={locale}
              dogName={entry.dog.name}
              hasMemberAccess={hasMemberAccess}
              hasCertificate={hasCertificate}
              hasAdminAssessment={Boolean(entry.adminAssessment?.overallScore || entry.adminAssessment?.publicNote)}
              hasPublicMedia={galleryImages.length > 0}
              hasPedigree={Boolean(entry.dog.pedigreeNumber || parents.length > 0)}
              communityVoteCount={entry.communityRating.totalRatings}
              verifyHref={verifyTarget ? '/verify/' + verifyTarget : null}
              certificateHref={verifyTarget ? '/certificate/' + verifyTarget : null}
            />

            <div className="registry-admin-assessment-public">`;

  if (!profile.includes(target)) {
    throw new Error("Could not find Registry approval grid insertion point in public-registry-profile.tsx");
  }

  profile = profile.replace(target, replacement);
  write(profilePath, profile);
} else {
  console.log("SKIP PublicRegistryTrustReadabilityPanel already wired");
}

const cssPath = "apps/web/app/globals.css";
let css = read(cssPath);

if (!css.includes("step39-public-registry-trust-readability")) {
  css += `

/* step39-public-registry-trust-readability */
.public-registry-trust-readability {
  display: grid;
  gap: 1.15rem;
  padding: 1.15rem;
  border: 1px solid rgba(212, 175, 55, 0.24);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(212, 175, 55, 0.13), transparent 40%),
    linear-gradient(135deg, rgba(12, 12, 14, 0.94), rgba(31, 27, 21, 0.9));
  box-shadow: 0 20px 64px rgba(0, 0, 0, 0.22);
  color: #f8f5ef;
}

.public-registry-trust-readability__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(180px, 0.34fr);
  gap: 1rem;
  align-items: start;
}

.public-registry-trust-readability__head h3 {
  margin: 0.25rem 0;
  color: #f8f5ef;
}

.public-registry-trust-readability__head p,
.public-registry-trust-readability__lane p {
  margin: 0;
  color: rgba(248, 245, 239, 0.72);
}

.public-registry-trust-readability__identity {
  display: grid;
  gap: 0.28rem;
  justify-items: end;
  padding: 0.85rem;
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 22px;
  background: rgba(248, 245, 239, 0.08);
  text-align: right;
}

.public-registry-trust-readability__identity span,
.public-registry-trust-readability__identity small {
  color: rgba(212, 175, 55, 0.82);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.public-registry-trust-readability__identity strong {
  color: #f8f5ef;
  font-size: 1.05rem;
}

.public-registry-trust-readability__grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.72rem;
}

.public-registry-trust-readability__lane {
  display: grid;
  gap: 0.42rem;
  padding: 0.85rem;
  border: 1px solid rgba(248, 245, 239, 0.1);
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.18);
}

.public-registry-trust-readability__lane.is-ready {
  border-color: rgba(212, 175, 55, 0.45);
  background: rgba(212, 175, 55, 0.12);
}

.public-registry-trust-readability__lane span {
  color: rgba(212, 175, 55, 0.88);
  font-size: 0.74rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.public-registry-trust-readability__lane strong {
  color: #f8f5ef;
  font-size: 0.94rem;
}

.public-registry-trust-readability__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

:root[data-theme='heritage'] .public-registry-trust-readability {
  background:
    radial-gradient(circle at top left, rgba(212, 175, 55, 0.16), transparent 42%),
    linear-gradient(135deg, rgba(18, 15, 11, 0.98), rgba(43, 34, 19, 0.92));
}

@media (max-width: 1120px) {
  .public-registry-trust-readability__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 780px) {
  .public-registry-trust-readability__head,
  .public-registry-trust-readability__grid {
    grid-template-columns: 1fr;
  }

  .public-registry-trust-readability__identity {
    justify-items: start;
    text-align: left;
  }
}
`;
  write(cssPath, css);
} else {
  console.log("SKIP Step 39 CSS already present");
}

const qaDocPath = "docs/qa/step39-public-registry-trust-readability-polish.md";
writeFile(qaDocPath, `# Step 39 — Public Registry Profile Trust / Readability Polish

Status: ready for local verification.

## Scope

Step 39 adds a public-facing trust/readability panel to the Registry profile detail page.

The goal is to help guests, members and admins understand:

- Registry publication
- Official admin assessment
- USG Certificate decision
- Verify route
- Community rating
- Member-only profile depth

## Files

- \`apps/web/components/public-registry-trust-readability-panel.tsx\`
- \`apps/web/components/public-registry-profile.tsx\`
- \`apps/web/app/globals.css\`
- \`scripts/qa-public-registry-trust-readability-polish.mjs\`
- \`docs/qa/step39-public-registry-trust-readability-polish.md\`
- \`package.json\`

## Locked boundaries

Step 39 must not change:

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
pnpm public:registry-trust:qa
pnpm review:flow-evidence:qa
pnpm workspace:syntax
pnpm typecheck
\`\`\`
`);

const qaScriptPath = "scripts/qa-public-registry-trust-readability-polish.mjs";
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

assertExists('apps/web/components/public-registry-trust-readability-panel.tsx', 'Public Registry trust readability panel exists');
assertExists('docs/qa/step39-public-registry-trust-readability-polish.md', 'Step 39 QA document exists');

assertIncludes('package.json', '"public:registry-trust:qa"', 'Root package exposes Step 39 QA command');

assertIncludes('apps/web/components/public-registry-profile.tsx', 'PublicRegistryTrustReadabilityPanel', 'Public Registry profile renders trust readability panel');
assertIncludes('apps/web/components/public-registry-profile.tsx', 'hasPublicMedia', 'Public Registry profile passes media readiness signal');
assertIncludes('apps/web/components/public-registry-profile.tsx', 'communityVoteCount', 'Public Registry profile passes community signal');
assertIncludes('apps/web/components/public-registry-profile.tsx', "verifyHref={verifyTarget ? '/verify/' + verifyTarget : null}", 'Public Registry profile passes Verify route safely');
assertIncludes('apps/web/components/public-registry-profile.tsx', "certificateHref={verifyTarget ? '/certificate/' + verifyTarget : null}", 'Public Registry profile passes Certificate route safely');

assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'Registry', 'Trust panel preserves Registry lane');
assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'USG Certificate', 'Trust panel preserves USG Certificate lane');
assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'Verify', 'Trust panel preserves Verify action copy');
assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'Community', 'Trust panel preserves community lane');
assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'Member depth', 'Trust panel preserves member-depth lane');
assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'bg:', 'Trust panel includes Bulgarian copy');
assertIncludes('apps/web/components/public-registry-trust-readability-panel.tsx', 'it:', 'Trust panel includes Italian copy');

assertIncludes('apps/web/app/globals.css', 'step39-public-registry-trust-readability', 'Step 39 CSS block exists');

assertIncludes('docs/qa/step39-public-registry-trust-readability-polish.md', 'Locked boundaries', 'Step 39 QA doc records locked boundaries');

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

console.log('\\nStep 39 Public Registry Trust / Readability Polish QA complete.');
`);

const packagePath = "package.json";
const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts["public:registry-trust:qa"] = "node scripts/qa-public-registry-trust-readability-polish.mjs";
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log("UPDATED", packagePath);

console.log("Step 39 patch applied.");
