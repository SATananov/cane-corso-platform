import Link from 'next/link';
import type { Dog, DogMedia, PublicRegistryEntry } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n';
import { getPedigreeFilledCount, getPedigreePhotoCount } from '@/lib/dog-pedigree';
import { ImageLightbox } from '@/components/image-lightbox';
import { StatusBadge } from '@/components/status-badge';

export type OwnerSpotlightDog = Dog & {
  media?: DogMedia[];
};

interface OwnerCaneCorsoSpotlightProps {
  locale: Locale;
  dog: OwnerSpotlightDog | null;
  registryEntry?: PublicRegistryEntry | null;
  variant?: 'profile' | 'workspace';
  editHref?: string;
  mediaHref?: string;
  publicHref?: string;
  verifyHref?: string;
  createHref?: string;
}

const copy = {
  en: {
    eyebrow: 'Your Cane Corso',
    titleProfile: 'The most important profile information first',
    titleWorkspace: 'Main Cane Corso profile',
    emptyTitle: 'No Cane Corso profile yet',
    emptyDescription: 'Start with one profile, add clear photos, then submit it for review when it is ready.',
    emptyAction: 'Add Cane Corso',
    introProfile: 'See the dog, photos, status, ratings, certificate, and the next action without searching through panels.',
    introWorkspace: 'This is the profile that needs your attention now. Photos, status, ratings, and next actions stay together.',
    noPhoto: 'Add the first strong Cane Corso photo',
    photoSet: 'Photos',
    mainPhoto: 'Main photo',
    addPhoto: 'Add photos',
    status: 'Status',
    visibility: 'Visibility',
    registryClass: 'Registry class',
    pedigree: 'Pedigree',
    certificate: 'Certificate',
    communityRating: 'Community rating',
    adminAssessment: 'USG assessment',
    updatedAt: 'Last update',
    publicAfterPublish: 'Visible after publication',
    privateOnly: 'Private until review and publication',
    noCommunityRatings: 'No community ratings yet',
    communityLocked: 'Opens after publication',
    adminPending: 'Awaiting USG assessment',
    certificatePending: 'Not issued yet',
    nextStep: 'Next action',
    nextDraft: 'Finish the profile and photos, then send it for review.',
    nextReview: 'The profile is in review. Keep the information clear while the administrator checks it.',
    nextPublished: 'The profile is public. You can improve presentation, photos, and pedigree depth anytime.',
    edit: 'Edit profile',
    media: 'Photos',
    publicProfile: 'Public profile',
    verify: 'Verification',
    votes: 'votes',
  },
  bg: {
    eyebrow: 'Твоето Cane Corso',
    titleProfile: 'Най-важната информация за профила е най-отгоре',
    titleWorkspace: 'Основен Cane Corso профил',
    emptyTitle: 'Все още няма Cane Corso профил',
    emptyDescription: 'Започни с един профил, добави ясни снимки и го изпрати за преглед, когато е готов.',
    emptyAction: 'Добави Cane Corso',
    introProfile: 'Виж кучето, снимките, статуса, оценките, сертификата и следващото действие без търсене из панели.',
    introWorkspace: 'Това е профилът, който има нужда от внимание сега. Снимките, статусът, оценките и действията са на едно място.',
    noPhoto: 'Добави първата силна снимка на Cane Corso',
    photoSet: 'Снимки',
    mainPhoto: 'Основна снимка',
    addPhoto: 'Добави снимки',
    status: 'Статус',
    visibility: 'Видимост',
    registryClass: 'Клас в регистъра',
    pedigree: 'Родословие',
    certificate: 'Сертификат',
    communityRating: 'Оценка от общността',
    adminAssessment: 'USG оценка',
    updatedAt: 'Последна редакция',
    publicAfterPublish: 'Видимо след публикуване',
    privateOnly: 'Лично до преглед и публикуване',
    noCommunityRatings: 'Все още няма оценки от общността',
    communityLocked: 'Отваря се след публикуване',
    adminPending: 'Очаква USG оценка',
    certificatePending: 'Все още не е издаден',
    nextStep: 'Следващо действие',
    nextDraft: 'Довърши профила и снимките, после го изпрати за преглед.',
    nextReview: 'Профилът е изпратен за преглед. Поддържай информацията ясна, докато администраторът я проверява.',
    nextPublished: 'Профилът е публичен. Можеш да подобряваш представянето, снимките и родословието по всяко време.',
    edit: 'Редактирай профила',
    media: 'Снимки',
    publicProfile: 'Публичен профил',
    verify: 'Проверка',
    votes: 'гласа',
  },
  it: {
    eyebrow: 'Il tuo Cane Corso',
    titleProfile: 'Le informazioni più importanti sono subito visibili',
    titleWorkspace: 'Profilo Cane Corso principale',
    emptyTitle: 'Nessun profilo Cane Corso ancora',
    emptyDescription: 'Inizia con un profilo, aggiungi foto chiare e invialo alla revisione quando è pronto.',
    emptyAction: 'Aggiungi Cane Corso',
    introProfile: 'Vedi cane, foto, stato, valutazioni, certificato e prossima azione senza cercare tra molti pannelli.',
    introWorkspace: 'Questo è il profilo che richiede attenzione ora. Foto, stato, valutazioni e azioni restano insieme.',
    noPhoto: 'Aggiungi la prima foto forte del Cane Corso',
    photoSet: 'Foto',
    mainPhoto: 'Foto principale',
    addPhoto: 'Aggiungi foto',
    status: 'Stato',
    visibility: 'Visibilità',
    registryClass: 'Classe registro',
    pedigree: 'Pedigree',
    certificate: 'Certificato',
    communityRating: 'Valutazione comunità',
    adminAssessment: 'Valutazione USG',
    updatedAt: 'Ultima modifica',
    publicAfterPublish: 'Visibile dopo pubblicazione',
    privateOnly: 'Privato fino a revisione e pubblicazione',
    noCommunityRatings: 'Nessuna valutazione dalla comunità',
    communityLocked: 'Si apre dopo la pubblicazione',
    adminPending: 'In attesa di valutazione USG',
    certificatePending: 'Non ancora emesso',
    nextStep: 'Prossima azione',
    nextDraft: 'Completa profilo e foto, poi invialo alla revisione.',
    nextReview: 'Il profilo è in revisione. Mantieni le informazioni chiare mentre l’amministratore le controlla.',
    nextPublished: 'Il profilo è pubblico. Puoi migliorare presentazione, foto e pedigree in ogni momento.',
    edit: 'Modifica profilo',
    media: 'Foto',
    publicProfile: 'Profilo pubblico',
    verify: 'Verifica',
    votes: 'voti',
  },
} as const;

function formatDate(locale: Locale, value: string | null) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

function getGalleryImages(dog: OwnerSpotlightDog): string[] {
  const mediaImages = (dog.media ?? [])
    .filter((item) => item.mediaType === 'image' && item.url)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)
    .map((item) => item.url);

  return Array.from(new Set([dog.mainImageUrl, ...mediaImages].filter((value): value is string => Boolean(value)))).slice(0, 3);
}

type NextActionCopy = {
  nextPublished: string;
  nextReview: string;
  nextDraft: string;
};

function getNextActionText(localeCopy: NextActionCopy, dog: OwnerSpotlightDog) {
  if (dog.publication || dog.lifecycleStatus === 'published') {
    return localeCopy.nextPublished;
  }

  if (dog.lifecycleStatus === 'submitted' || dog.lifecycleStatus === 'approved') {
    return localeCopy.nextReview;
  }

  return localeCopy.nextDraft;
}

export function OwnerCaneCorsoSpotlight({
  locale,
  dog,
  registryEntry = null,
  variant = 'profile',
  editHref,
  mediaHref,
  publicHref,
  verifyHref,
  createHref = '/my-dogs/new',
}: OwnerCaneCorsoSpotlightProps) {
  const localeCopy = copy[locale] ?? copy.en;
  const dictionary = getDictionary(locale);

  if (!dog) {
    return (
      <section className="content-card owner-cane-spotlight owner-cane-spotlight--empty">
        <div className="owner-cane-spotlight__empty-mark" aria-hidden="true">USG</div>
        <div>
          <span className="eyebrow-label">{localeCopy.eyebrow}</span>
          <h2>{localeCopy.emptyTitle}</h2>
          <p>{localeCopy.emptyDescription}</p>
        </div>
        <Link href={createHref} className="button-primary">
          {localeCopy.emptyAction}
        </Link>
      </section>
    );
  }

  const galleryImages = getGalleryImages(dog);
  const coverImage = galleryImages[0] ?? '';
  const pedigreeFilledCount = getPedigreeFilledCount(dog.pedigree);
  const pedigreePhotoCount = getPedigreePhotoCount(dog.pedigree);
  const statusLabel = dictionary.form.status[dog.lifecycleStatus as keyof typeof dictionary.form.status] ?? dog.lifecycleStatus;
  const visibilityLabel = dog.visibility === 'public' ? dictionary.form.fields.public : dictionary.form.fields.private;
  const registryClassLabel = dictionary.form.registryClass[(dog.registryClass ?? 'owner_declared_cane_corso') as keyof typeof dictionary.form.registryClass];
  const communityRating = registryEntry?.communityRating;
  const communityRatingLabel = !dog.publication
    ? localeCopy.communityLocked
    : communityRating?.totalRatings
      ? `${(communityRating.averageRating ?? 0).toFixed(1)} / 5 · ${communityRating.totalRatings} ${localeCopy.votes}`
      : localeCopy.noCommunityRatings;
  const adminAssessmentLabel = !dog.publication
    ? localeCopy.adminPending
    : typeof registryEntry?.adminAssessment?.overallScore === 'number'
      ? `${registryEntry.adminAssessment.overallScore.toFixed(1)} / 5`
      : localeCopy.adminPending;
  const certificateLabel = dog.publication?.certificateCode ?? localeCopy.certificatePending;
  const nextActionText = getNextActionText(localeCopy, dog);
  const safeEditHref = editHref ?? `/my-dogs/${dog.id}/edit`;
  const safeMediaHref = mediaHref ?? `/my-dogs/${dog.id}/media`;
  const safePublicHref = publicHref ?? (dog.publication ? `/registry/${dog.publication.publicSlug}` : '/registry');
  const safeVerifyHref = verifyHref ?? (dog.publication?.certificateCode ? `/verify/${dog.publication.certificateCode}` : '/verify');

  return (
    <section className={`content-card owner-cane-spotlight owner-cane-spotlight--${variant}`}>
      <div className="owner-cane-spotlight__head">
        <div>
          <span className="eyebrow-label">{localeCopy.eyebrow}</span>
          <h2>{variant === 'workspace' ? localeCopy.titleWorkspace : localeCopy.titleProfile}</h2>
          <p>{variant === 'workspace' ? localeCopy.introWorkspace : localeCopy.introProfile}</p>
        </div>
        <StatusBadge status={dog.lifecycleStatus} />
      </div>

      <div className="owner-cane-spotlight__grid">
        <div className={`owner-cane-spotlight__media${coverImage ? ' has-image' : ''}`}>
          {coverImage ? (
            <ImageLightbox src={coverImage} alt={dog.name} imageClassName="owner-cane-spotlight__image" />
          ) : (
            <div className="owner-cane-spotlight__media-empty">
              <span aria-hidden="true">USG</span>
              <strong>{localeCopy.noPhoto}</strong>
            </div>
          )}
          <div className="owner-cane-spotlight__media-badge">{localeCopy.photoSet}: {galleryImages.length}/3</div>
        </div>

        <div className="owner-cane-spotlight__body">
          <div className="owner-cane-spotlight__title-row">
            <div>
              <span>{dog.pedigreeNumber || dog.slug}</span>
              <h3>{dog.name}</h3>
            </div>
            <div className="owner-cane-spotlight__status-note">
              {dog.publication ? localeCopy.publicAfterPublish : localeCopy.privateOnly}
            </div>
          </div>

          <div className="owner-cane-spotlight__gallery-row" aria-label={localeCopy.photoSet}>
            {Array.from({ length: 3 }, (_, index) => {
              const imageUrl = galleryImages[index];
              return imageUrl ? (
                <div className="owner-cane-spotlight__thumb" key={`${dog.id}-spotlight-${index}`}>
                  <ImageLightbox src={imageUrl} alt={`${dog.name} ${index + 1}`} />
                  <span>{index === 0 ? localeCopy.mainPhoto : `0${index + 1}`}</span>
                </div>
              ) : (
                <Link href={safeMediaHref} className="owner-cane-spotlight__thumb owner-cane-spotlight__thumb--empty" key={`${dog.id}-empty-${index}`}>
                  <span>+</span>
                  <strong>{localeCopy.addPhoto}</strong>
                </Link>
              );
            })}
          </div>

          <dl className="owner-cane-spotlight__stats">
            <div>
              <dt>{localeCopy.status}</dt>
              <dd>{statusLabel}</dd>
            </div>
            <div>
              <dt>{localeCopy.visibility}</dt>
              <dd>{visibilityLabel}</dd>
            </div>
            <div>
              <dt>{localeCopy.registryClass}</dt>
              <dd>{registryClassLabel}</dd>
            </div>
            <div>
              <dt>{localeCopy.pedigree}</dt>
              <dd>{pedigreeFilledCount}/14 · {pedigreePhotoCount} {dictionary.form.pedigree.stats.ancestorPhotos.toLowerCase()}</dd>
            </div>
            <div>
              <dt>{localeCopy.communityRating}</dt>
              <dd>{communityRatingLabel}</dd>
            </div>
            <div>
              <dt>{localeCopy.adminAssessment}</dt>
              <dd>{adminAssessmentLabel}</dd>
            </div>
            <div>
              <dt>{localeCopy.certificate}</dt>
              <dd>{certificateLabel}</dd>
            </div>
            <div>
              <dt>{localeCopy.updatedAt}</dt>
              <dd>{formatDate(locale, dog.updatedAt)}</dd>
            </div>
          </dl>

          <div className="owner-cane-spotlight__next">
            <span className="eyebrow-label">{localeCopy.nextStep}</span>
            <p>{nextActionText}</p>
          </div>

          <div className="owner-cane-spotlight__actions">
            <Link href={safeEditHref} className="button-primary small">{localeCopy.edit}</Link>
            <Link href={safeMediaHref} className="button-secondary small">{localeCopy.media}</Link>
            <Link href={safePublicHref} className="button-ghost small">{localeCopy.publicProfile}</Link>
            <Link href={safeVerifyHref} className="button-ghost small">{localeCopy.verify}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
