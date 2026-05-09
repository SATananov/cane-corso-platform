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

const componentPath = "apps/web/components/review-decision-readiness-panel.tsx";

writeFile(componentPath, `import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import type { ReviewQueueStatus } from '@cane-corso-platform/contracts';

type DecisionReadinessLane = {
  id: 'registry' | 'certificate' | 'gallery' | 'owner';
  title: string;
  description: string;
  state: string;
  ready: boolean;
};

type EvidenceItem = {
  id: 'identity' | 'story' | 'photos' | 'registryMedia' | 'pedigree' | 'assessment';
  label: string;
  description: string;
  ready: boolean;
  optional?: boolean;
};

interface ReviewDecisionReadinessPanelProps {
  locale: Locale;
  status: ReviewQueueStatus;
  dogName: string;
  ownerPhotoCount: number;
  registryVisiblePhotoCount: number;
  gallerySelectedPhotoCount: number;
  hasPedigree: boolean;
  hasMicrochip: boolean;
  hasOwnerStory: boolean;
  hasAdminAssessment: boolean;
  hasCertificate: boolean;
  publicHref?: string | null;
  verifyHref?: string | null;
}

const copyByLocale = {
  en: {
    eyebrow: 'Admin decision support',
    title: 'Evidence before public action',
    description:
      'Use this panel as a decision checklist before approving Registry visibility, issuing a USG certificate, or curating USG Gallery media.',
    evidenceTitle: 'Evidence checklist',
    ready: 'Ready',
    missing: 'Needs review',
    optional: 'Optional',
    photosCount: 'owner photos',
    registryCount: 'Registry-visible photos',
    galleryCount: 'Gallery selected photos',
    openPublic: 'Open public Registry profile',
    openVerify: 'Open Verify result',
    items: {
      identity: {
        label: 'Identity and basic facts',
        description: 'Name, owner, microchip or equivalent identity details should be clear before publication.',
      },
      story: {
        label: 'Owner description',
        description: 'The owner profile should include enough context for a meaningful public profile.',
      },
      photos: {
        label: 'Owner photo evidence',
        description: 'At least three owner-uploaded photos are preferred for a serious review.',
      },
      registryMedia: {
        label: 'Registry media visibility',
        description: 'At least one photo should be explicitly approved for public Registry visibility.',
      },
      pedigree: {
        label: 'Pedigree support',
        description: 'Pedigree information supports the assessment, but may remain optional when unknown.',
      },
      assessment: {
        label: 'Admin assessment',
        description: 'Official admin assessment should explain Registry readiness and USG certificate direction.',
      },
    },
    lanes: {
      registry: {
        title: 'Registry',
        description: 'Approve/publish only when identity, owner story, and public media are ready.',
      },
      certificate: {
        title: 'USG Certificate',
        description: 'Certificate remains a separate admin judgment after Registry publication.',
      },
      gallery: {
        title: 'USG Gallery',
        description: 'Gallery is curated. Owner uploads do not become showcase photos automatically.',
      },
      owner: {
        title: 'Owner boundary',
        description: 'Private owner profile and public Registry presentation remain separate layers.',
      },
    },
    states: {
      draft: 'Not public yet',
      submitted: 'Under review',
      needsChanges: 'Returned for corrections',
      approved: 'Approved, not published',
      published: 'Published',
      certificateReady: 'Certificate decision available',
      certificateIssued: 'Certificate issued',
      galleryReady: 'Curated media selected',
      galleryPending: 'No curated Gallery media',
      ownerProtected: 'Owner-controlled source data',
    },
  },
  bg: {
    eyebrow: 'Админ решение',
    title: 'Доказателства преди публично действие',
    description:
      'Използвай този панел като чеклист преди одобрение за Registry, издаване на USG сертификат или избор на снимки за USG Галерия.',
    evidenceTitle: 'Чеклист за преглед',
    ready: 'Готово',
    missing: 'За преглед',
    optional: 'По избор',
    photosCount: 'снимки от собственика',
    registryCount: 'снимки видими в Registry',
    galleryCount: 'снимки избрани за Галерия',
    openPublic: 'Отвори публичния Registry профил',
    openVerify: 'Отвори Verify резултата',
    items: {
      identity: {
        label: 'Идентичност и основни факти',
        description: 'Име, собственик, микрочип или еквивалентни данни трябва да са ясни преди публикация.',
      },
      story: {
        label: 'Описание от собственика',
        description: 'Профилът трябва да има достатъчно контекст, за да изглежда смислено публично.',
      },
      photos: {
        label: 'Снимкови доказателства',
        description: 'За сериозен преглед са препоръчителни поне три качени снимки от собственика.',
      },
      registryMedia: {
        label: 'Видимост на снимки в Registry',
        description: 'Поне една снимка трябва да е изрично одобрена за публичния Registry профил.',
      },
      pedigree: {
        label: 'Родословна опора',
        description: 'Родословието помага за оценката, но може да остане optional, ако данните са неизвестни.',
      },
      assessment: {
        label: 'Админ оценка',
        description: 'Официалната админ оценка трябва да обяснява готовността за Registry и посоката за USG сертификат.',
      },
    },
    lanes: {
      registry: {
        title: 'Registry',
        description: 'Одобрявай/публикувай само когато идентичността, описанието и публичните снимки са готови.',
      },
      certificate: {
        title: 'USG сертификат',
        description: 'Сертификатът остава отделно админ решение след публикация в Registry.',
      },
      gallery: {
        title: 'USG Галерия',
        description: 'Галерията е curated слой. Снимките от собственика не стават showcase автоматично.',
      },
      owner: {
        title: 'Owner граница',
        description: 'Личният owner профил и публичното Registry представяне остават отделни слоеве.',
      },
    },
    states: {
      draft: 'Все още не е публично',
      submitted: 'В преглед',
      needsChanges: 'Върнато за корекции',
      approved: 'Одобрено, но непубликувано',
      published: 'Публикувано',
      certificateReady: 'Има решение за сертификат',
      certificateIssued: 'Сертификатът е издаден',
      galleryReady: 'Има избрани Gallery снимки',
      galleryPending: 'Няма избрани Gallery снимки',
      ownerProtected: 'Owner-controlled source data',
    },
  },
  it: {
    eyebrow: 'Supporto decisione admin',
    title: 'Evidenze prima dell’azione pubblica',
    description:
      'Usa questo pannello come checklist prima di approvare Registry, emettere un certificato USG o curare media per USG Gallery.',
    evidenceTitle: 'Checklist evidenze',
    ready: 'Pronto',
    missing: 'Da rivedere',
    optional: 'Opzionale',
    photosCount: 'foto proprietario',
    registryCount: 'foto visibili nel Registry',
    galleryCount: 'foto selezionate Gallery',
    openPublic: 'Apri profilo pubblico Registry',
    openVerify: 'Apri risultato Verify',
    items: {
      identity: {
        label: 'Identità e dati principali',
        description: 'Nome, proprietario, microchip o dati equivalenti devono essere chiari prima della pubblicazione.',
      },
      story: {
        label: 'Descrizione proprietario',
        description: 'Il profilo dovrebbe avere contesto sufficiente per una presentazione pubblica significativa.',
      },
      photos: {
        label: 'Evidenza fotografica',
        description: 'Almeno tre foto caricate dal proprietario sono preferibili per una revisione seria.',
      },
      registryMedia: {
        label: 'Visibilità media Registry',
        description: 'Almeno una foto dovrebbe essere approvata per la visibilità pubblica nel Registry.',
      },
      pedigree: {
        label: 'Supporto pedigree',
        description: 'Il pedigree supporta la valutazione, ma può restare opzionale se sconosciuto.',
      },
      assessment: {
        label: 'Valutazione admin',
        description: 'La valutazione ufficiale admin dovrebbe spiegare Registry readiness e direzione certificato USG.',
      },
    },
    lanes: {
      registry: {
        title: 'Registry',
        description: 'Approva/pubblica solo quando identità, descrizione e media pubblici sono pronti.',
      },
      certificate: {
        title: 'Certificato USG',
        description: 'Il certificato resta una decisione admin separata dopo la pubblicazione Registry.',
      },
      gallery: {
        title: 'USG Gallery',
        description: 'La Gallery è curata. Le foto del proprietario non diventano showcase automaticamente.',
      },
      owner: {
        title: 'Confine owner',
        description: 'Profilo privato owner e presentazione pubblica Registry restano livelli separati.',
      },
    },
    states: {
      draft: 'Non ancora pubblico',
      submitted: 'In revisione',
      needsChanges: 'Restituito per correzioni',
      approved: 'Approvato, non pubblicato',
      published: 'Pubblicato',
      certificateReady: 'Decisione certificato disponibile',
      certificateIssued: 'Certificato emesso',
      galleryReady: 'Media Gallery selezionati',
      galleryPending: 'Nessun media Gallery selezionato',
      ownerProtected: 'Dati sorgente controllati owner',
    },
  },
} as const;

function getStatusState(status: ReviewQueueStatus, copy: (typeof copyByLocale)['en']) {
  if (status === 'published') return copy.states.published;
  if (status === 'approved') return copy.states.approved;
  if (status === 'needs_changes') return copy.states.needsChanges;
  if (status === 'submitted') return copy.states.submitted;
  return copy.states.draft;
}

export function ReviewDecisionReadinessPanel({
  locale,
  status,
  dogName,
  ownerPhotoCount,
  registryVisiblePhotoCount,
  gallerySelectedPhotoCount,
  hasPedigree,
  hasMicrochip,
  hasOwnerStory,
  hasAdminAssessment,
  hasCertificate,
  publicHref,
  verifyHref,
}: ReviewDecisionReadinessPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  const evidenceItems: EvidenceItem[] = [
    {
      id: 'identity',
      label: copy.items.identity.label,
      description: copy.items.identity.description,
      ready: hasMicrochip,
    },
    {
      id: 'story',
      label: copy.items.story.label,
      description: copy.items.story.description,
      ready: hasOwnerStory,
    },
    {
      id: 'photos',
      label: copy.items.photos.label,
      description: copy.items.photos.description,
      ready: ownerPhotoCount >= 3,
    },
    {
      id: 'registryMedia',
      label: copy.items.registryMedia.label,
      description: copy.items.registryMedia.description,
      ready: registryVisiblePhotoCount > 0,
    },
    {
      id: 'pedigree',
      label: copy.items.pedigree.label,
      description: copy.items.pedigree.description,
      ready: hasPedigree,
      optional: true,
    },
    {
      id: 'assessment',
      label: copy.items.assessment.label,
      description: copy.items.assessment.description,
      ready: hasAdminAssessment,
    },
  ];

  const lanes: DecisionReadinessLane[] = [
    {
      id: 'registry',
      title: copy.lanes.registry.title,
      description: copy.lanes.registry.description,
      state: getStatusState(status, copy),
      ready: status === 'approved' || status === 'published',
    },
    {
      id: 'certificate',
      title: copy.lanes.certificate.title,
      description: copy.lanes.certificate.description,
      state: hasCertificate ? copy.states.certificateIssued : copy.states.certificateReady,
      ready: hasCertificate,
    },
    {
      id: 'gallery',
      title: copy.lanes.gallery.title,
      description: copy.lanes.gallery.description,
      state: gallerySelectedPhotoCount > 0 ? copy.states.galleryReady : copy.states.galleryPending,
      ready: gallerySelectedPhotoCount > 0,
    },
    {
      id: 'owner',
      title: copy.lanes.owner.title,
      description: copy.lanes.owner.description,
      state: copy.states.ownerProtected,
      ready: true,
    },
  ];

  return (
    <section className="review-decision-readiness" aria-label={copy.title}>
      <div className="review-decision-readiness__head">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h4>{copy.title}</h4>
          <p>{copy.description}</p>
        </div>
        <div className="review-decision-readiness__counts" aria-label={dogName}>
          <span>{ownerPhotoCount} {copy.photosCount}</span>
          <span>{registryVisiblePhotoCount} {copy.registryCount}</span>
          <span>{gallerySelectedPhotoCount} {copy.galleryCount}</span>
        </div>
      </div>

      <div className="review-decision-readiness__lanes">
        {lanes.map((lane) => (
          <article className={lane.ready ? 'review-decision-readiness__lane is-ready' : 'review-decision-readiness__lane'} key={lane.id}>
            <span>{lane.title}</span>
            <strong>{lane.state}</strong>
            <p>{lane.description}</p>
          </article>
        ))}
      </div>

      <div className="review-decision-readiness__body">
        <div>
          <h5>{copy.evidenceTitle}</h5>
          <div className="review-decision-readiness__evidence-grid">
            {evidenceItems.map((item) => (
              <article className={item.ready ? 'review-decision-readiness__evidence is-ready' : 'review-decision-readiness__evidence'} key={item.id}>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.description}</p>
                </div>
                <span>{item.ready ? copy.ready : item.optional ? copy.optional : copy.missing}</span>
              </article>
            ))}
          </div>
        </div>

        {publicHref || verifyHref ? (
          <div className="review-decision-readiness__links">
            {publicHref ? (
              <Link href={publicHref} className="button-secondary small">
                {copy.openPublic}
              </Link>
            ) : null}
            {verifyHref ? (
              <Link href={verifyHref} className="button-ghost small">
                {copy.openVerify}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
`);

const dashboardPath = "apps/web/components/review-queue-dashboard.tsx";
let dashboard = read(dashboardPath);

if (!dashboard.includes("ReviewDecisionReadinessPanel")) {
  dashboard = dashboard.replace(
    "import { ImageLightbox } from '@/components/image-lightbox';",
    "import { ImageLightbox } from '@/components/image-lightbox';\nimport { ReviewDecisionReadinessPanel } from '@/components/review-decision-readiness-panel';"
  );

  const target = `                  <div className="review-queue-item__note">
                    <span className="eyebrow-label">{copy.labels.reviewNote}</span>
                    <p>{translateSystemNote(item.currentReviewNote, copy) || copy.labels.noReviewNote}</p>
                  </div>


                  <div className="review-admin-assessment">`;

  const replacement = `                  <div className="review-queue-item__note">
                    <span className="eyebrow-label">{copy.labels.reviewNote}</span>
                    <p>{translateSystemNote(item.currentReviewNote, copy) || copy.labels.noReviewNote}</p>
                  </div>

                  <ReviewDecisionReadinessPanel
                    locale={locale}
                    status={item.status}
                    dogName={item.dog.name}
                    ownerPhotoCount={item.ownerMedia.length}
                    registryVisiblePhotoCount={item.ownerMedia.filter((media) => media.isVisibleInRegistry).length}
                    gallerySelectedPhotoCount={item.ownerMedia.filter((media) => media.isVisibleInUsgGallery).length}
                    hasPedigree={Boolean(item.dog.pedigreeNumber)}
                    hasMicrochip={Boolean(item.dog.microchipNumber)}
                    hasOwnerStory={Boolean(item.dog.shortDescription)}
                    hasAdminAssessment={Boolean(
                      assessment?.overallScore ||
                      (assessment?.registryDecision && assessment.registryDecision !== 'not_reviewed') ||
                      (assessment?.certificateDecision && assessment.certificateDecision !== 'not_reviewed')
                    )}
                    hasCertificate={hasCertificate}
                    publicHref={item.status === 'published' ? \`/registry/\${item.publicRegistrySlug ?? item.dog.slug}\` : null}
                    verifyHref={hasCertificate ? \`/verify/\${item.certificateCode ?? item.verificationSlug}\` : null}
                  />

                  <div className="review-admin-assessment">`;

  if (!dashboard.includes(target)) {
    throw new Error("Could not find review note insertion point in review-queue-dashboard.tsx");
  }

  dashboard = dashboard.replace(target, replacement);
  write(dashboardPath, dashboard);
} else {
  console.log("SKIP dashboard already contains ReviewDecisionReadinessPanel");
}

const cssPath = "apps/web/app/globals.css";
let css = read(cssPath);

if (!css.includes("step37-review-decision-readiness")) {
  css += `

/* step37-review-decision-readiness */
.review-decision-readiness {
  display: grid;
  gap: 1.25rem;
  padding: 1.25rem;
  border: 1px solid rgba(212, 175, 55, 0.22);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(212, 175, 55, 0.12), transparent 38%),
    linear-gradient(135deg, rgba(14, 14, 16, 0.96), rgba(32, 28, 22, 0.9));
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.2);
  color: #f8f5ef;
}

.review-decision-readiness__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: start;
}

.review-decision-readiness__head h4,
.review-decision-readiness__body h5 {
  margin: 0.2rem 0;
  color: #f8f5ef;
}

.review-decision-readiness__head p,
.review-decision-readiness__lane p,
.review-decision-readiness__evidence p {
  margin: 0;
  color: rgba(248, 245, 239, 0.72);
}

.review-decision-readiness__counts {
  display: grid;
  gap: 0.4rem;
  min-width: 220px;
}

.review-decision-readiness__counts span,
.review-decision-readiness__evidence span {
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 999px;
  padding: 0.42rem 0.68rem;
  background: rgba(248, 245, 239, 0.08);
  color: rgba(248, 245, 239, 0.82);
  font-size: 0.78rem;
  font-weight: 700;
}

.review-decision-readiness__lanes {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.review-decision-readiness__lane {
  display: grid;
  gap: 0.45rem;
  padding: 0.95rem;
  border: 1px solid rgba(248, 245, 239, 0.1);
  border-radius: 22px;
  background: rgba(248, 245, 239, 0.06);
}

.review-decision-readiness__lane.is-ready,
.review-decision-readiness__evidence.is-ready {
  border-color: rgba(212, 175, 55, 0.45);
  background: rgba(212, 175, 55, 0.12);
}

.review-decision-readiness__lane span {
  color: rgba(212, 175, 55, 0.88);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.review-decision-readiness__lane strong {
  color: #f8f5ef;
  font-size: 0.98rem;
}

.review-decision-readiness__body {
  display: grid;
  gap: 1rem;
}

.review-decision-readiness__evidence-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.review-decision-readiness__evidence {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: start;
  padding: 0.85rem;
  border: 1px solid rgba(248, 245, 239, 0.1);
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.18);
}

.review-decision-readiness__evidence strong {
  display: block;
  color: #f8f5ef;
  margin-bottom: 0.25rem;
}

.review-decision-readiness__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

:root[data-theme='heritage'] .review-decision-readiness {
  background:
    radial-gradient(circle at top left, rgba(212, 175, 55, 0.14), transparent 38%),
    linear-gradient(135deg, rgba(18, 15, 11, 0.98), rgba(43, 34, 19, 0.92));
}

@media (max-width: 980px) {
  .review-decision-readiness__head,
  .review-decision-readiness__evidence {
    grid-template-columns: 1fr;
  }

  .review-decision-readiness__counts {
    min-width: 0;
  }

  .review-decision-readiness__lanes,
  .review-decision-readiness__evidence-grid {
    grid-template-columns: 1fr;
  }
}
`;
  write(cssPath, css);
} else {
  console.log("SKIP CSS already contains Step 37 block");
}

const qaDocPath = "docs/qa/step37-admin-review-decision-console.md";
writeFile(qaDocPath, `# Step 37 — Admin Review Decision Console & Evidence Guardrails

Status: ready for local verification.

## Scope

Step 37 adds a presentation-only admin decision-support layer to the existing review queue.

It helps the admin see the evidence boundary before public actions:

- Registry approval/publication
- USG certificate decision
- USG Gallery curation
- Owner/private source-data boundary

## Files

- \`apps/web/components/review-decision-readiness-panel.tsx\`
- \`apps/web/components/review-queue-dashboard.tsx\`
- \`apps/web/app/globals.css\`
- \`scripts/qa-admin-review-decision-console.mjs\`
- \`docs/qa/step37-admin-review-decision-console.md\`
- \`package.json\`

## Locked boundaries

Step 37 must not change:

- Registry publish logic
- Certificate issue/revoke logic
- Verify lookup logic
- Gallery selection backend logic
- Admin moderation backend
- Ecosystem API/DB
- Auth/session

## Local verification

Run:

\`\`\`bash
pnpm admin:review-decision:qa
pnpm owner:review-readiness:qa
pnpm workspace:syntax
pnpm typecheck
\`\`\`
`);

const qaScriptPath = "scripts/qa-admin-review-decision-console.mjs";
writeFile(qaScriptPath, `import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function pass(message) {
  console.log('PASS', message);
}

function assertIncludes(file, needle, message) {
  const text = read(file);
  if (!text.includes(needle)) {
    throw new Error(\`FAIL \${message} — missing "\${needle}" in \${file}\`);
  }
  pass(message);
}

function assertExists(file, message) {
  if (!fs.existsSync(file)) {
    throw new Error(\`FAIL \${message} — missing \${file}\`);
  }
  pass(message);
}

assertExists('apps/web/components/review-decision-readiness-panel.tsx', 'ReviewDecisionReadinessPanel component exists');
assertExists('docs/qa/step37-admin-review-decision-console.md', 'Step 37 QA document exists');

assertIncludes('package.json', '"admin:review-decision:qa"', 'Package exposes admin:review-decision:qa script');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'ReviewDecisionReadinessPanel', 'Review queue imports/renders decision readiness panel');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'registryVisiblePhotoCount', 'Review queue passes Registry media evidence count');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'gallerySelectedPhotoCount', 'Review queue passes Gallery curated evidence count');
assertIncludes('apps/web/components/review-queue-dashboard.tsx', 'hasAdminAssessment', 'Review queue passes admin assessment evidence');

assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'Owner boundary', 'Decision panel includes Owner boundary copy');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'Registry', 'Decision panel includes Registry lane');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'USG Certificate', 'Decision panel includes certificate lane');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'USG Gallery', 'Decision panel includes Gallery lane');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'identity', 'Evidence checklist includes identity');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'registryMedia', 'Evidence checklist includes Registry media');
assertIncludes('apps/web/components/review-decision-readiness-panel.tsx', 'assessment', 'Evidence checklist includes admin assessment');

assertIncludes('apps/web/app/globals.css', 'step37-review-decision-readiness', 'Step 37 CSS block exists');
assertIncludes('docs/qa/step37-admin-review-decision-console.md', 'Locked boundaries', 'Step 37 QA doc records locked boundaries');

for (const locked of [
  'apps/web/app/api/registry/route.ts',
  'apps/web/app/api/ecosystem/route.ts',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/components/verification-result-panel.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/(admin)/review/actions.ts'
]) {
  assertExists(locked, \`Locked surface still exists: \${locked}\`);
}

console.log('\\nStep 37 Admin Review Decision Console QA complete.');
`);

const packagePath = "package.json";
const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts["admin:review-decision:qa"] = "node scripts/qa-admin-review-decision-console.mjs";
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log("UPDATED", packagePath);

console.log("Step 37 patch applied.");
