import Link from 'next/link';
import type { DogLifecycleStatus, Visibility } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';

type ReadinessItem = {
  id: 'identity' | 'details' | 'story' | 'photos' | 'pedigree' | 'review';
  ready: boolean;
  optional?: boolean;
};

type OwnerReadinessAction = {
  href: string;
  label: string;
  tone: 'secondary' | 'ghost';
};

export interface OwnerReviewReadinessPanelProps {
  locale: Locale;
  context?: 'overview' | 'form' | 'preview';
  dogName?: string | null;
  slug?: string | null;
  lifecycleStatus: DogLifecycleStatus;
  visibility: Visibility;
  hasPublication?: boolean;
  hasCertificate?: boolean;
  hasName?: boolean;
  hasSlug?: boolean;
  hasDateOfBirth?: boolean;
  hasColor?: boolean;
  hasShortDescription?: boolean;
  hasCity?: boolean;
  hasCountry?: boolean;
  hasPrimaryImage?: boolean;
  galleryImageCount?: number;
  pedigreeFilledCount?: number;
  pedigreePhotoCount?: number;
  editHref?: string;
  mediaHref?: string;
  publicHref?: string;
  verifyHref?: string;
  compact?: boolean;
}

const readinessCopy = {
  en: {
    eyebrow: 'Owner review readiness',
    title: 'Prepare this Cane Corso for calm admin review',
    titleOverview: 'Featured profile review readiness',
    titlePreview: 'Live review readiness',
    description:
      'This is a member guidance layer only. It helps the owner prepare a complete profile before admin review, without changing Registry, Certificate, Gallery, Verify, Auth, or moderation logic.',
    readyLabel: 'Ready for review',
    attentionLabel: 'Needs owner attention',
    publicLabel: 'Public after admin publish',
    privateLabel: 'Owner workspace only',
    complete: 'Ready',
    missing: 'Needs work',
    optional: 'Helpful',
    score: 'readiness',
    items: {
      identity: ['Identity', 'Name and URL slug are present.'],
      details: ['Core details', 'Birth date, color, city, and country are set.'],
      story: ['Owner story', 'A short description is ready for review.'],
      photos: ['Three-photo profile set', 'Primary image plus up to three owner photos.'],
      pedigree: ['Pedigree support', 'Family data/photos add context when available.'],
      review: ['Review path', 'Saved as draft or submitted without forcing certificate/gallery decisions.'],
    },
    boundariesTitle: 'Trust boundaries stay separate',
    boundaries: [
      'Owner profile: private workspace and draft changes.',
      'Registry: visible only after admin publication.',
      'USG Certificate: separate official admin decision.',
      'USG Gallery: curated by admin, never automatic from owner uploads.',
    ],
    actions: {
      edit: 'Edit profile',
      media: 'Manage media',
      public: 'Public profile',
      verify: 'Open Verify',
    },
    counts: {
      photos: 'profile photos',
      ancestors: 'filled ancestors',
      ancestorPhotos: 'ancestor photos',
    },
  },
  bg: {
    eyebrow: 'Готовност за owner review',
    title: 'Подготви това Cane Corso спокойно за admin преглед',
    titleOverview: 'Готовност на избрания профил за преглед',
    titlePreview: 'Live готовност за преглед',
    description:
      'Това е само насочващ слой за собственика. Помага профилът да бъде подготвен преди admin review, без да променя Registry, Certificate, Gallery, Verify, Auth или moderation логиките.',
    readyLabel: 'Готово за преглед',
    attentionLabel: 'Има нужда от внимание',
    publicLabel: 'Публично след admin публикация',
    privateLabel: 'Само в owner workspace',
    complete: 'Готово',
    missing: 'За довършване',
    optional: 'Полезно',
    score: 'готовност',
    items: {
      identity: ['Идентичност', 'Име и URL slug са попълнени.'],
      details: ['Основни данни', 'Дата, цвят, град и държава са зададени.'],
      story: ['Owner описание', 'Краткото описание е готово за преглед.'],
      photos: ['Комплект от 3 снимки', 'Основна снимка плюс owner снимки за профила.'],
      pedigree: ['Родословна подкрепа', 'Семейни данни/снимки добавят контекст, когато ги има.'],
      review: ['Път за преглед', 'Профилът може да е draft или submitted без автоматичен сертификат/галерия.'],
    },
    boundariesTitle: 'Границите на доверие остават отделни',
    boundaries: [
      'Owner profile: лична зона и draft промени.',
      'Registry: видим само след admin публикация.',
      'USG Certificate: отделно официално admin решение.',
      'USG Gallery: избира се от admin, не автоматично от качените снимки.',
    ],
    actions: {
      edit: 'Редактирай профил',
      media: 'Управлявай снимки',
      public: 'Публичен профил',
      verify: 'Отвори Verify',
    },
    counts: {
      photos: 'профилни снимки',
      ancestors: 'попълнени предци',
      ancestorPhotos: 'снимки на предци',
    },
  },
  it: {
    eyebrow: 'Prontezza review owner',
    title: 'Prepara questo Cane Corso per una review admin ordinata',
    titleOverview: 'Prontezza del profilo in evidenza',
    titlePreview: 'Prontezza live per review',
    description:
      'Questo è solo un layer guida per il proprietario. Aiuta a preparare un profilo completo prima della review admin, senza cambiare Registry, Certificate, Gallery, Verify, Auth o moderation logic.',
    readyLabel: 'Pronto per review',
    attentionLabel: 'Richiede attenzione owner',
    publicLabel: 'Pubblico dopo publish admin',
    privateLabel: 'Solo owner workspace',
    complete: 'Pronto',
    missing: 'Da completare',
    optional: 'Utile',
    score: 'prontezza',
    items: {
      identity: ['Identita', 'Nome e URL slug sono presenti.'],
      details: ['Dati principali', 'Data, colore, citta e paese sono impostati.'],
      story: ['Storia owner', 'Una descrizione breve e pronta per review.'],
      photos: ['Set di 3 foto', 'Immagine primaria piu foto owner del profilo.'],
      pedigree: ['Supporto pedigree', 'Dati/foto di famiglia aggiungono contesto quando disponibili.'],
      review: ['Percorso review', 'Draft o submitted senza forzare certificate/gallery.'],
    },
    boundariesTitle: 'I confini di fiducia restano separati',
    boundaries: [
      'Owner profile: workspace privato e modifiche draft.',
      'Registry: visibile solo dopo pubblicazione admin.',
      'USG Certificate: decisione ufficiale admin separata.',
      'USG Gallery: curata da admin, mai automatica dagli upload owner.',
    ],
    actions: {
      edit: 'Modifica profilo',
      media: 'Gestisci media',
      public: 'Profilo pubblico',
      verify: 'Apri Verify',
    },
    counts: {
      photos: 'foto profilo',
      ancestors: 'antenati compilati',
      ancestorPhotos: 'foto antenati',
    },
  },
} as const;

function normalizeCount(value: number | undefined) {
  return Math.max(0, Number.isFinite(value ?? 0) ? Math.floor(value ?? 0) : 0);
}

function buildItems(props: OwnerReviewReadinessPanelProps): ReadinessItem[] {
  const galleryImageCount = normalizeCount(props.galleryImageCount);
  const pedigreeFilledCount = normalizeCount(props.pedigreeFilledCount);
  const pedigreePhotoCount = normalizeCount(props.pedigreePhotoCount);

  return [
    {
      id: 'identity',
      ready: Boolean(props.hasName ?? props.dogName?.trim()) && Boolean(props.hasSlug ?? props.slug?.trim()),
    },
    {
      id: 'details',
      ready: Boolean(props.hasDateOfBirth) && Boolean(props.hasColor) && Boolean(props.hasCity) && Boolean(props.hasCountry),
    },
    {
      id: 'story',
      ready: Boolean(props.hasShortDescription),
    },
    {
      id: 'photos',
      ready: Boolean(props.hasPrimaryImage) && galleryImageCount >= 3,
    },
    {
      id: 'pedigree',
      ready: pedigreeFilledCount > 0 || pedigreePhotoCount > 0,
      optional: true,
    },
    {
      id: 'review',
      ready: props.lifecycleStatus !== 'draft' || Boolean(props.hasPublication),
      optional: true,
    },
  ];
}

export function OwnerReviewReadinessPanel(props: OwnerReviewReadinessPanelProps) {
  const copy = readinessCopy[props.locale] ?? readinessCopy.en;
  const items = buildItems(props);
  const requiredItems = items.filter((item) => !item.optional);
  const readyRequiredCount = requiredItems.filter((item) => item.ready).length;
  const totalRequiredCount = requiredItems.length;
  const isReady = readyRequiredCount === totalRequiredCount;
  const galleryImageCount = normalizeCount(props.galleryImageCount);
  const pedigreeFilledCount = normalizeCount(props.pedigreeFilledCount);
  const pedigreePhotoCount = normalizeCount(props.pedigreePhotoCount);
  const panelTitle = props.context === 'overview' ? copy.titleOverview : props.context === 'preview' ? copy.titlePreview : copy.title;
  const visibilityLabel = props.hasPublication ? copy.publicLabel : props.visibility === 'public' ? copy.publicLabel : copy.privateLabel;
  const actionLinks: OwnerReadinessAction[] = [];

  if (props.editHref) {
    actionLinks.push({ href: props.editHref, label: copy.actions.edit, tone: 'secondary' });
  }

  if (props.mediaHref) {
    actionLinks.push({ href: props.mediaHref, label: copy.actions.media, tone: 'secondary' });
  }

  if (props.publicHref) {
    actionLinks.push({ href: props.publicHref, label: copy.actions.public, tone: 'ghost' });
  }

  if (props.verifyHref) {
    actionLinks.push({ href: props.verifyHref, label: copy.actions.verify, tone: 'ghost' });
  }

  return (
    <section className={`owner-review-readiness${props.compact ? ' owner-review-readiness--compact' : ''}${isReady ? ' is-ready' : ' needs-attention'}`}>
      <div className="owner-review-readiness__head">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h3>{panelTitle}</h3>
          <p>{copy.description}</p>
        </div>
        <div className="owner-review-readiness__score" aria-label={`${readyRequiredCount}/${totalRequiredCount} ${copy.score}`}>
          <strong>{readyRequiredCount}/{totalRequiredCount}</strong>
          <span>{copy.score}</span>
        </div>
      </div>

      <div className="owner-review-readiness__status-row">
        <span className={`route-pill${isReady ? ' route-pill--glow' : ' subtle'}`}>{isReady ? copy.readyLabel : copy.attentionLabel}</span>
        <span className="route-pill subtle">{visibilityLabel}</span>
      </div>

      <div className="owner-review-readiness__grid">
        {items.map((item) => {
          const [title, description] = copy.items[item.id];
          return (
            <div className={`owner-review-readiness__item${item.ready ? ' is-complete' : ' is-missing'}${item.optional ? ' is-optional' : ''}`} key={item.id}>
              <span>{item.ready ? copy.complete : item.optional ? copy.optional : copy.missing}</span>
              <strong>{title}</strong>
              <p>{description}</p>
            </div>
          );
        })}
      </div>

      <div className="owner-review-readiness__metrics" aria-label={copy.score}>
        <div>
          <strong>{galleryImageCount}/3</strong>
          <span>{copy.counts.photos}</span>
        </div>
        <div>
          <strong>{pedigreeFilledCount}/14</strong>
          <span>{copy.counts.ancestors}</span>
        </div>
        <div>
          <strong>{pedigreePhotoCount}</strong>
          <span>{copy.counts.ancestorPhotos}</span>
        </div>
      </div>

      <div className="owner-review-readiness__boundaries">
        <strong>{copy.boundariesTitle}</strong>
        <ul>
          {copy.boundaries.map((boundary) => (
            <li key={boundary}>{boundary}</li>
          ))}
        </ul>
      </div>

      {actionLinks.length > 0 ? (
        <div className="owner-review-readiness__actions">
          {actionLinks.map((action) => (
            <Link href={action.href} className={action.tone === 'secondary' ? 'button-secondary small' : 'button-ghost small'} key={action.href}>
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
