import Link from 'next/link';
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

type ReviewDecisionStatusCopy = {
  states: {
    draft: string;
    submitted: string;
    needsChanges: string;
    approved: string;
    published: string;
  };
};

function getStatusState(status: ReviewQueueStatus, copy: ReviewDecisionStatusCopy) {
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
