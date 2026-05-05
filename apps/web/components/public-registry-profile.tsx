import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import type { PublicRegistryEntry, PublicRegistryProfileDocument } from '@cane-corso-platform/contracts';
import { CommunityRatingPanel } from '@/components/community-rating-panel';
import { ImageLightbox } from '@/components/image-lightbox';
import { PedigreeTree } from '@/components/pedigree-tree';
import { PublicRegistryTrustReadabilityPanel } from '@/components/public-registry-trust-readability-panel';
import { issueDogCertificateAction, removeDogProfileAction, removeRegistryEntryAction, revokeCertificateAction } from '@/app/(admin)/admin/registry/actions';

const copyByLocale = {
  en: {
    labels: {
      publishedProfile: 'Published registry profile',
      owner: 'Owner',
      location: 'Location',
      publishedAt: 'Published at',
      certificate: 'Certificate',
      verify: 'Verify certificate',
      backToRegistry: 'Back to registry',
      microchip: 'Microchip',
      pedigree: 'Pedigree',
      birthDate: 'Birth date',
      registryClass: 'Registry class',
      protectedValue: 'Protected',
      notAvailable: 'Not available',
      longStory: 'Registry story',
      profilePathEyebrow: 'Trust path',
      profilePathTitle: 'How this published presence should be read',
      profilePathDescription: 'The strongest lesson from the original project still applies here: a registry profile, a certificate, and Verify should feel connected, but never confused as the same thing.',
      profilePathA: 'Published profile',
      profilePathACopy: 'This public page confirms that the Cane Corso has a visible approved registry identity.',
      profilePathB: 'USG certificate',
      profilePathBCopy: 'Certificate approval remains a separate trust layer and appears only when it has actually been issued.',
      profilePathC: 'Verify route',
      profilePathCCopy: 'When an active certificate exists, Verify becomes the direct public confirmation path.',
      guestPreviewEyebrow: 'Public preview',
      guestPreviewTitle: 'This public profile is intentionally limited for guests.',
      guestPreviewDescription:
        'The public registry proves that the profile exists and is trusted. Richer identity layers, deeper story context, and expanded registry details unlock after member registration.',
      joinMember: 'Become a member',
      memberAccess: 'Member access',
      lockedDetailsTitle: 'Registered access unlocks the richer profile view',
      lockedDetailsDescription:
        'After member registration, visitors can continue into the fuller Cane Corso profile view and future premium registry depth.',
      lockedItemIdentity: 'Expanded identity and profile details',
      lockedItemPedigree: 'Pedigree and registry context',
      lockedItemStory: 'Long-form presentation and future premium layers',
      teaserTitle: 'Preview of the full registry story',
      teaserLocked: 'Continue after registration to unlock the full profile depth.',
      memberExclusive: 'Member-only depth',
      memberExclusiveValue: 'Available after registration',
      usgOfficialRating: 'Admin / USG rating',
      usgCommunityRating: 'User rating',
      usgSealTitle: 'USG',
      usgSealSubtitle: 'Certified',
      noUsgRating: 'Awaiting USG certificate review',
      noCommunityVotes: 'No community votes yet',
      votes: 'votes',
      registryApproved: 'Published in Registry',
      certificateApproved: 'USG certificate',
      yes: 'Yes',
      no: 'Not yet',
      officialAssessment: 'Official admin assessment',
      officialAssessmentDescription: 'This is the admin evaluation layer. It remains separate from community rating and from the USG certificate decision.',
      publicAdminNote: 'Public admin note',
      criteriaScores: 'Criteria scores',
      breedTypeScore: 'Breed type',
      temperamentScore: 'Temperament',
      pedigreeScore: 'Pedigree',
      healthScore: 'Health info',
      presentationScore: 'Presentation',
      overallScore: 'Overall score',
      awaitingAdminAssessment: 'Awaiting admin assessment',
      mother: 'Mother',
      father: 'Father',
      parents: 'Parent line',
      gallery: 'Profile photos',
      galleryLead: 'Photos attached to this Registry profile. USG Gallery remains a separate admin-curated showcase.',
      galleryCount: 'profile photos',
      primaryPhoto: 'Main photo',
      pedigreeEyebrow: 'Pedigree view',
      pedigreeTitle: 'Family tree prepared for the public profile',
      pedigreeDescription: 'The public profile should carry the same family logic the member prepared privately, with the main Cane Corso at the center and the parent line clearly visible.',
      adminView: 'Admin view',
      adminDetails: 'Protected admin details',
      slug: 'Public slug',
      adminActions: 'Admin actions',
      removeFromRegistry: 'Remove from registry',
      revokeCertificate: 'Revoke certificate',
      issueCertificate: 'Issue USG certificate',
      issueCertificateWithPhoto: 'Issue with this photo',
      chooseForCertificate: 'Choose for certificate',
      selectedForCertificate: 'Selected for certificate',
      chooseCertificatePhoto: 'Choose certificate photo',
      chooseCertificatePhotoDescription: 'Choose any photo from this Cane Corso profile for the certificate. It can be different from the main cover photo; owner uploads photos from My Cane Corso → profile/photos.',
      openCertificate: 'Open certificate',
      certificateControl: 'Certificate control',
      certificateNotIssued: 'No active USG certificate yet',
      dangerZone: 'Danger zone',
      removeDog: 'Delete Cane Corso',
    },
  },
  bg: {
    labels: {
      publishedProfile: 'Публикуван профил в регистъра',
      owner: 'Собственик',
      location: 'Локация',
      publishedAt: 'Публикуван на',
      certificate: 'Сертификат',
      verify: 'Провери сертификата',
      backToRegistry: 'Назад към регистъра',
      microchip: 'Микрочип',
      pedigree: 'Родословие',
      birthDate: 'Дата на раждане',
      registryClass: 'Клас в регистъра',
      protectedValue: 'Защитено',
      notAvailable: 'Няма данни',
      longStory: 'История за регистъра',
      profilePathEyebrow: 'Път на доверието',
      profilePathTitle: 'Как трябва да се чете това публикувано присъствие',
      profilePathDescription: 'Най-силният урок от стария проект остава валиден и тук: профилът в регистъра, сертификатът и Verify трябва да се усещат свързани, но никога като едно и също.',
      profilePathA: 'Публикуван профил',
      profilePathACopy: 'Тази публична страница потвърждава, че Cane Corso има видима одобрена идентичност в регистъра.',
      profilePathB: 'USG сертификат',
      profilePathBCopy: 'Сертификатът остава отделен trust слой и се показва само когато реално е издаден.',
      profilePathC: 'Път към Verify',
      profilePathCCopy: 'Когато има активен сертификат, Verify става директният публичен път за потвърждение.',
      guestPreviewEyebrow: 'Публичен преглед',
      guestPreviewTitle: 'Този публичен профил умишлено показва ограничен преглед за гост.',
      guestPreviewDescription:
        'Публичният регистър доказва, че профилът съществува и е доверен. По-богатите слоеве на идентичност, по-дълбоката история и разширените данни от регистъра се отключват след членска регистрация.',
      joinMember: 'Стани член',
      memberAccess: 'Вход за членове',
      lockedDetailsTitle: 'Регистрираният достъп отключва по-богатия профилен изглед',
      lockedDetailsDescription:
        'След членска регистрация посетителят преминава към по-пълния Cane Corso профил и бъдещия премиум слой на регистъра.',
      lockedItemIdentity: 'Разширени данни за профила и идентичността',
      lockedItemPedigree: 'Родословен и регистров контекст',
      lockedItemStory: 'Пълна история и бъдещи премиум слоеве',
      teaserTitle: 'Преглед от пълната registry история',
      teaserLocked: 'Продължи след регистрация, за да отключиш пълната дълбочина на профила.',
      memberExclusive: 'Членски достъп',
      memberExclusiveValue: 'Отключва се след регистрация',
      usgOfficialRating: 'Оценка от админа / USG',
      usgCommunityRating: 'Оценка от потребителите',
      usgSealTitle: 'USG',
      usgSealSubtitle: 'Сертифициран',
      noUsgRating: 'Очаква USG сертификатна оценка',
      noCommunityVotes: 'Все още няма гласове от общността',
      votes: 'гласа',
      registryApproved: 'Публикуван в Регистъра',
      certificateApproved: 'USG сертификат',
      yes: 'Да',
      no: 'Все още не',
      officialAssessment: 'Официална админ оценка',
      officialAssessmentDescription: 'Това е оценката от администратора. Тя остава отделна от оценката на потребителите и от решението за USG сертификат.',
      publicAdminNote: 'Публична админ бележка',
      criteriaScores: 'Оценки по критерии',
      breedTypeScore: 'Породен тип',
      temperamentScore: 'Темперамент',
      pedigreeScore: 'Родословие',
      healthScore: 'Здравна инфо',
      presentationScore: 'Представяне',
      overallScore: 'Обща оценка',
      awaitingAdminAssessment: 'Очаква админ оценка',
      mother: 'Майка',
      father: 'Баща',
      parents: 'Родителска линия',
      gallery: 'Снимки към профила',
      galleryLead: 'Снимки, свързани с този профил в Регистъра. USG Галерията остава отделна админ селекция.',
      galleryCount: 'снимки в профила',
      primaryPhoto: 'Основна снимка',
      pedigreeEyebrow: 'Родословен изглед',
      pedigreeTitle: 'Семейно дърво, подготвено за публичния профил',
      pedigreeDescription: 'Публичният профил трябва да носи същата семейна логика, която собственикът е подготвил лично — с основния Cane Corso в центъра и ясно видима родителска линия.',
      adminView: 'Админ изглед',
      adminDetails: 'Допълнителни админ детайли',
      slug: 'Публичен slug',
      adminActions: 'Админ действия',
      removeFromRegistry: 'Махни от регистъра',
      revokeCertificate: 'Отнеми сертификата',
      issueCertificate: 'Издай USG сертификат',
      issueCertificateWithPhoto: 'Издай с тази снимка',
      chooseForCertificate: 'Избери за сертификат',
      selectedForCertificate: 'Избрана за сертификата',
      chooseCertificatePhoto: 'Избери снимка за сертификата',
      chooseCertificatePhotoDescription: 'Избери която и да е снимка от профила за сертификата. Може да е различна от основната/корицата; собственикът качва снимките от Моите Cane Corso → профил/снимки.',
      openCertificate: 'Отвори сертификата',
      certificateControl: 'Контрол на сертификата',
      certificateNotIssued: 'Все още няма активен USG сертификат',
      dangerZone: 'Опасна зона',
      removeDog: 'Изтрий Cane Corso',
    },
  },
  it: {
    labels: {
      publishedProfile: 'Profilo pubblicato nel registro',
      owner: 'Proprietario',
      location: 'Località',
      publishedAt: 'Pubblicato il',
      certificate: 'Certificato',
      verify: 'Verifica certificato',
      backToRegistry: 'Torna al registro',
      microchip: 'Microchip',
      pedigree: 'Pedigree',
      birthDate: 'Data di nascita',
      registryClass: 'Classe del registro',
      protectedValue: 'Protetto',
      notAvailable: 'Non disponibile',
      longStory: 'Storia del registro',
      profilePathEyebrow: 'Percorso di fiducia',
      profilePathTitle: 'Come leggere questa presenza pubblicata',
      profilePathDescription: 'La lezione più forte del vecchio progetto resta valida anche qui: profilo nel registro, certificato e Verify devono sentirsi collegati, ma mai confusi come la stessa cosa.',
      profilePathA: 'Profilo pubblicato',
      profilePathACopy: 'Questa pagina pubblica conferma che il Cane Corso possiede un’identità approvata e visibile nel registro.',
      profilePathB: 'Certificato USG',
      profilePathBCopy: 'Il certificato resta un livello di fiducia separato e compare solo quando è stato realmente emesso.',
      profilePathC: 'Percorso Verify',
      profilePathCCopy: 'Quando esiste un certificato attivo, Verify diventa il percorso pubblico diretto di conferma.',
      guestPreviewEyebrow: 'Anteprima pubblica',
      guestPreviewTitle: 'Questo profilo pubblico mostra intenzionalmente una vista limitata per gli ospiti.',
      guestPreviewDescription:
        'Il registro pubblico dimostra che il profilo esiste ed è affidabile. I livelli più ricchi di identità, la storia completa e i dettagli estesi del registro si sbloccano dopo la registrazione membro.',
      joinMember: 'Diventa membro',
      memberAccess: 'Accesso membri',
      lockedDetailsTitle: 'L’accesso registrato sblocca una vista profilo più ricca',
      lockedDetailsDescription:
        'Dopo la registrazione membro, il visitatore continua nella vista più completa del profilo Cane Corso e nei futuri livelli premium del registro.',
      lockedItemIdentity: 'Dettagli estesi del profilo e dell’identità',
      lockedItemPedigree: 'Contesto pedigree e registro',
      lockedItemStory: 'Storia completa e futuri livelli premium',
      teaserTitle: 'Anteprima della storia completa del registro',
      teaserLocked: 'Continua dopo la registrazione per sbloccare tutta la profondità del profilo.',
      memberExclusive: 'Accesso membro',
      memberExclusiveValue: 'Disponibile dopo la registrazione',
      usgOfficialRating: 'Valutazione admin / USG',
      usgCommunityRating: 'Valutazione utenti',
      usgSealTitle: 'USG',
      usgSealSubtitle: 'Certificato',
      noUsgRating: 'In attesa della valutazione certificata USG',
      noCommunityVotes: 'Nessun voto della community',
      votes: 'voti',
      registryApproved: 'Pubblicato nel Registro',
      certificateApproved: 'Certificato USG',
      yes: 'Sì',
      no: 'Non ancora',
      officialAssessment: 'Valutazione ufficiale admin',
      officialAssessmentDescription: 'Questo è il layer di valutazione admin. Resta separato dal voto community e dalla decisione sul certificato USG.',
      publicAdminNote: 'Nota pubblica admin',
      criteriaScores: 'Punteggi criteri',
      breedTypeScore: 'Tipo di razza',
      temperamentScore: 'Temperamento',
      pedigreeScore: 'Pedigree',
      healthScore: 'Info salute',
      presentationScore: 'Presentazione',
      overallScore: 'Valutazione generale',
      awaitingAdminAssessment: 'In attesa della valutazione admin',
      mother: 'Madre',
      father: 'Padre',
      parents: 'Linea genitoriale',
      gallery: 'Foto del profilo',
      galleryLead: 'Foto collegate a questo profilo del Registro. La USG Gallery resta una selezione admin separata.',
      galleryCount: 'foto nel profilo',
      primaryPhoto: 'Foto principale',
      pedigreeEyebrow: 'Vista pedigree',
      pedigreeTitle: 'Albero familiare preparato per il profilo pubblico',
      pedigreeDescription: 'Il profilo pubblico dovrebbe portare la stessa logica familiare preparata privatamente dal membro, con il Cane Corso principale al centro e la linea genitoriale ben visibile.',
      adminView: 'Vista admin',
      adminDetails: 'Dettagli admin protetti',
      slug: 'Slug pubblico',
      adminActions: 'Azioni admin',
      removeFromRegistry: 'Rimuovi dal registro',
      revokeCertificate: 'Revoca certificato',
      issueCertificate: 'Emetti certificato USG',
      issueCertificateWithPhoto: 'Emetti con questa foto',
      chooseForCertificate: 'Scegli per certificato',
      selectedForCertificate: 'Scelta per certificato',
      chooseCertificatePhoto: 'Scegli foto certificato',
      chooseCertificatePhotoDescription: 'Scegli qualsiasi foto da questo profilo Cane Corso per il certificato. Può essere diversa dalla foto principale; il proprietario carica le foto da My Cane Corso → profilo/foto.',
      openCertificate: 'Apri certificato',
      certificateControl: 'Controllo certificato',
      certificateNotIssued: 'Nessun certificato USG attivo',
      dangerZone: 'Zona pericolosa',
      removeDog: 'Elimina Cane Corso',
    },
  },
} as const;

interface PublicRegistryProfileProps {
  document: PublicRegistryProfileDocument;
  locale: Locale;
  hasMemberAccess: boolean;
  isAdminViewer?: boolean;
  ratingStatus?: string | null;
}

function formatDateLabel(locale: Locale, value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) {
    return value;
  }

  const [, year, month, day] = match;

  if (locale === 'bg') {
    return `${day}.${month}.${year}`;
  }

  if (locale === 'it') {
    return `${day}/${month}/${year}`;
  }

  return `${year}-${month}-${day}`;
}

function formatLocation(city: string | null, country: string | null, fallback: string) {
  const parts = [city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : fallback;
}

function formatRegistryClass(locale: Locale, value: string | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  const normalized = value.toLowerCase();

  if (locale === 'bg') {
    if (normalized === 'owner_declared_cane_corso') return 'Деклариран от собственика Cane Corso';
    if (normalized === 'registry_certified_cane_corso') return 'Сертифициран в регистъра Cane Corso';
    if (normalized === 'usg_certified_cane_corso') return 'USG сертифициран Cane Corso';
  }

  if (locale === 'it') {
    if (normalized === 'owner_declared_cane_corso') return 'Profilo dichiarato dal proprietario';
    if (normalized === 'registry_certified_cane_corso') return 'Cane Corso certificato dal registro';
    if (normalized === 'usg_certified_cane_corso') return 'Cane Corso certificato USG';
  }

  return normalized
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildStoryPreview(value: string | null, fallback: string) {
  const source = (value ?? '').trim();

  if (!source) {
    return fallback;
  }

  if (source.length <= 220) {
    return source;
  }

  return `${source.slice(0, 217).trimEnd()}…`;
}

function renderStars(value: number | null) {
  const filled = value == null ? 0 : Math.max(0, Math.min(5, Math.round(value)));

  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={`registry-rating-stars__star${index < filled ? ' registry-rating-stars__star--filled' : ''}`}>
      ★
    </span>
  ));
}

function formatScore(value: number | null) {
  return value == null ? '— / 5' : `${value.toFixed(1)} / 5`;
}

function getGalleryImages(entry: PublicRegistryEntry): string[] {
  const ordered = [entry.heroImageUrl, ...(entry.galleryImages ?? [])].filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  );

  return Array.from(new Set(ordered)).slice(0, 3);
}

function getParentProfiles(entry: PublicRegistryEntry) {
  const pedigree = entry.dog.pedigree ?? {};
  return [
    { key: 'mother', profile: pedigree.mother ?? null },
    { key: 'father', profile: pedigree.father ?? null },
  ].filter((item) => item.profile && (item.profile.name || item.profile.photoUrl));
}

function renderParentPhoto(profile: NonNullable<ReturnType<typeof getParentProfiles>[number]['profile']>, fallback: string) {
  if (profile.photoUrl) {
    return (
    <ImageLightbox
      src={profile.photoUrl}
      alt={profile.name || fallback}
      imageClassName="registry-parent-card__image"
      openLabel={`Open ${profile.name || fallback} photo`}
    />
  );
  }

  return <div className="registry-parent-card__placeholder">{(profile.name || fallback).slice(0, 1)}</div>;
}

export function PublicRegistryProfile({ document, locale, hasMemberAccess, isAdminViewer = false, ratingStatus }: PublicRegistryProfileProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const entry = document.entry;
  const verifyTarget = entry.certificate?.certificateCode ?? entry.certificate?.verificationSlug ?? null;
  const hasCertificate = Boolean(entry.certificate);
  const storyPreview = buildStoryPreview(entry.dog.longDescription || entry.summary, copy.labels.notAvailable);
  const usgScore = entry.adminAssessment?.overallScore ?? null;
  const assessmentScoreCandidates: Array<{ label: string; value: number | null }> = [
    { label: copy.labels.breedTypeScore, value: entry.adminAssessment?.breedTypeScore ?? null },
    { label: copy.labels.temperamentScore, value: entry.adminAssessment?.temperamentScore ?? null },
    { label: copy.labels.pedigreeScore, value: entry.adminAssessment?.pedigreeScore ?? null },
    { label: copy.labels.healthScore, value: entry.adminAssessment?.healthScore ?? null },
    { label: copy.labels.presentationScore, value: entry.adminAssessment?.presentationScore ?? null },
  ];

  const assessmentScores = assessmentScoreCandidates.filter(
    (item): item is { label: string; value: number } => typeof item.value === 'number',
  );
  const communityScore = entry.communityRating.totalRatings > 0 ? entry.communityRating.averageRating ?? null : null;
  const galleryImages = getGalleryImages(entry);
  const mainImage = galleryImages[0] ?? null;
  const parents = getParentProfiles(entry);

  return (
    <div className="member-route-stack" suppressHydrationWarning>
      <section className="content-card registry-profile-card registry-profile-card--enhanced">
        <div className="registry-profile-card__grid">
          <div className="registry-profile-card__visual-column">
            <div className="registry-profile-card__media">
              {mainImage ? (
                <ImageLightbox
                  src={mainImage}
                  alt={entry.dog.name}
                  imageClassName="registry-profile-card__image"
                  openLabel={`Open ${entry.dog.name} photo`}
                />
              ) : (
                <div className="registry-profile-card__placeholder">UNICO SUO GENERE</div>
              )}

              {hasCertificate ? (
                <div className="registry-media-seal registry-media-seal--top-right registry-media-seal--official" aria-label={copy.labels.certificate}>
                  <img src="/brand/seal/usg-official-seal-compact.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                  <span>{copy.labels.usgSealTitle}</span>
                  <small>{copy.labels.usgSealSubtitle}</small>
                </div>
              ) : null}
            </div>

            {galleryImages.length > 0 ? (
              <div className="registry-gallery-strip registry-gallery-strip--profile">
                <div className="registry-gallery-strip__head">
                  <span className="eyebrow-label">{copy.labels.gallery}</span>
                  <strong>{galleryImages.length}/3 {copy.labels.galleryCount}</strong>
                </div>
                <p className="registry-gallery-strip__lead">{copy.labels.galleryLead}</p>
                <div className="registry-gallery-strip__row">
                  {galleryImages.map((imageUrl, index) => (
                    <div className={`registry-gallery-thumb${index === 0 ? ' is-primary' : ''}`} key={`${entry.entryId}-detail-gallery-${index}`}>
                      <ImageLightbox
                        src={imageUrl}
                        alt={`${entry.dog.name} ${index + 1}`}
                        imageClassName="registry-gallery-thumb__image"
                        openLabel={`Open ${entry.dog.name} photo ${index + 1}`}
                      />
                      <span className="registry-gallery-thumb__badge">{index === 0 ? copy.labels.primaryPhoto : `${index + 1}/3`}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {parents.length > 0 ? (
              <div className="registry-parents-strip registry-parents-strip--profile">
                <span className="eyebrow-label">{copy.labels.parents}</span>
                <div className="registry-parents-strip__grid" suppressHydrationWarning>
                  {parents.map((item) => (
                    <div className="registry-parent-card" key={`${entry.entryId}-detail-${item.key}`}>
                      <div className="registry-parent-card__media">{renderParentPhoto(item.profile!, item.key === 'mother' ? copy.labels.mother : copy.labels.father)}</div>
                      <div className="registry-parent-card__copy">
                        <span>{item.key === 'mother' ? copy.labels.mother : copy.labels.father}</span>
                        <strong>{item.profile?.name || copy.labels.notAvailable}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="registry-rating-stack registry-rating-stack--profile">
              <div className="registry-rating-row">
                <div className="registry-rating-row__copy">
                  <span className="registry-rating-row__label">{copy.labels.usgOfficialRating}</span>
                  <div className="registry-rating-stars">{renderStars(usgScore)}</div>
                </div>
                <div className="registry-rating-row__summary">
                  <strong className="registry-rating-row__value">{formatScore(usgScore)}</strong>
                  <span className="registry-rating-row__meta">{usgScore != null ? (hasCertificate ? copy.labels.certificate : copy.labels.noUsgRating) : copy.labels.awaitingAdminAssessment}</span>
                </div>
              </div>

              <div className="registry-rating-row">
                <div className="registry-rating-row__copy">
                  <span className="registry-rating-row__label">{copy.labels.usgCommunityRating}</span>
                  <div className="registry-rating-stars">{renderStars(communityScore)}</div>
                </div>
                <div className="registry-rating-row__summary">
                  <strong className="registry-rating-row__value">{formatScore(communityScore)}</strong>
                  <span className="registry-rating-row__meta">
                    {entry.communityRating.totalRatings > 0
                      ? `${entry.communityRating.totalRatings} ${copy.labels.votes}`
                      : copy.labels.noCommunityVotes}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="registry-profile-card__copy">
            <div className="registry-profile-card__heading-row">
              <div>
                <span className="eyebrow-label">{copy.labels.publishedProfile}</span>
                <h2>{entry.dog.name}</h2>
              </div>
              {isAdminViewer ? <span className="route-pill route-pill--glow">{copy.labels.adminView}</span> : null}
            </div>
            <p>{entry.summary || entry.dog.shortDescription || copy.labels.notAvailable}</p>

            <div className="registry-approval-grid registry-approval-grid--profile">
              <div className="registry-approval-card registry-approval-card--approved">
                <span>{copy.labels.registryApproved}</span>
                <strong>{copy.labels.yes}</strong>
              </div>
              <div className={`registry-approval-card ${hasCertificate ? 'registry-approval-card--approved' : 'registry-approval-card--pending'}`}>
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

            <div className="registry-admin-assessment-public">
              <div className="registry-admin-assessment-public__head">
                <div>
                  <span className="eyebrow-label">{copy.labels.officialAssessment}</span>
                  <h3>{copy.labels.officialAssessment}</h3>
                  <p>{copy.labels.officialAssessmentDescription}</p>
                </div>
                <div className="registry-admin-assessment-public__overall">
                  <span>{copy.labels.overallScore}</span>
                  <strong>{formatScore(entry.adminAssessment?.overallScore ?? null)}</strong>
                </div>
              </div>

              {entry.adminAssessment?.publicNote ? (
                <div className="registry-admin-assessment-public__note">
                  <span>{copy.labels.publicAdminNote}</span>
                  <p>{entry.adminAssessment.publicNote}</p>
                </div>
              ) : null}

              {assessmentScores.length > 0 ? (
                <div className="registry-admin-assessment-public__criteria">
                  <span>{copy.labels.criteriaScores}</span>
                  <div className="registry-admin-assessment-public__criteria-grid">
                    {assessmentScores.map((item) => (
                      <div key={item.label}>
                        <small>{item.label}</small>
                        <strong>{item.value}/5</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="registry-admin-assessment-public__pending">{copy.labels.awaitingAdminAssessment}</p>
              )}
            </div>

            {entry.certificate?.certificateCode ? (
              <div className="registry-profile-card__certificate-strip">
                <span className="eyebrow-label">{copy.labels.certificate}</span>
                <strong>{entry.certificate.certificateCode}</strong>
              </div>
            ) : null}

            <div className="registry-trust-path">
              <span className="eyebrow-label">{copy.labels.profilePathEyebrow}</span>
              <div className="registry-trust-path__header">
                <h3>{copy.labels.profilePathTitle}</h3>
                <p>{copy.labels.profilePathDescription}</p>
              </div>
              <div className="registry-trust-path__grid">
                <article className="registry-trust-step">
                  <span>{copy.labels.profilePathA}</span>
                  <p>{copy.labels.profilePathACopy}</p>
                </article>
                <article className="registry-trust-step">
                  <span>{copy.labels.profilePathB}</span>
                  <p>{copy.labels.profilePathBCopy}</p>
                </article>
                <article className="registry-trust-step">
                  <span>{copy.labels.profilePathC}</span>
                  <p>{copy.labels.profilePathCCopy}</p>
                </article>
              </div>
            </div>

            {!hasMemberAccess ? (
              <div className="registry-profile-card__guest-banner">
                <span className="eyebrow-label">{copy.labels.guestPreviewEyebrow}</span>
                <h3>{copy.labels.guestPreviewTitle}</h3>
                <p>{copy.labels.guestPreviewDescription}</p>
              </div>
            ) : null}

            <dl className="registry-profile-card__meta-grid">
              <div>
                <dt>{copy.labels.owner}</dt>
                <dd>{entry.owner.displayName}</dd>
              </div>
              <div>
                <dt>{copy.labels.location}</dt>
                <dd>{formatLocation(entry.owner.city, entry.owner.country, copy.labels.notAvailable)}</dd>
              </div>
              <div>
                <dt>{copy.labels.publishedAt}</dt>
                <dd>{formatDateLabel(locale, entry.publishedAt)}</dd>
              </div>
              <div>
                <dt>{copy.labels.certificate}</dt>
                <dd>{entry.certificate?.certificateCode ?? copy.labels.notAvailable}</dd>
              </div>
              <div>
                <dt>{copy.labels.birthDate}</dt>
                <dd>{hasMemberAccess ? entry.dog.dateOfBirth ?? copy.labels.notAvailable : copy.labels.memberExclusiveValue}</dd>
              </div>
              <div>
                <dt>{copy.labels.registryClass}</dt>
                <dd>{hasMemberAccess ? formatRegistryClass(locale, entry.dog.registryClass, copy.labels.notAvailable) : copy.labels.memberExclusiveValue}</dd>
              </div>
              <div>
                <dt>{copy.labels.microchip}</dt>
                <dd>{hasMemberAccess ? entry.dog.microchipNumber ?? copy.labels.protectedValue : copy.labels.memberExclusiveValue}</dd>
              </div>
              <div>
                <dt>{copy.labels.pedigree}</dt>
                <dd>{hasMemberAccess ? entry.dog.pedigreeNumber ?? copy.labels.notAvailable : copy.labels.memberExclusiveValue}</dd>
              </div>
            </dl>

            {isAdminViewer ? (
              <div className="registry-admin-panel registry-admin-panel--profile">
                <span className="eyebrow-label">{copy.labels.adminDetails}</span>
                <dl className="registry-admin-panel__grid">
                  <div>
                    <dt>{copy.labels.slug}</dt>
                    <dd>{entry.publicSlug}</dd>
                  </div>
                  <div>
                    <dt>{copy.labels.publishedProfile}</dt>
                    <dd>{entry.title}</dd>
                  </div>
                  <div>
                    <dt>{copy.labels.registryApproved}</dt>
                    <dd>{copy.labels.yes}</dd>
                  </div>
                  <div>
                    <dt>{copy.labels.certificateApproved}</dt>
                    <dd>{hasCertificate ? copy.labels.yes : copy.labels.no}</dd>
                  </div>
                </dl>

                <div className="registry-admin-certificate-control">
                  <div className="registry-admin-certificate-header">
                    <div className="registry-admin-certificate-header__content">
                      <span className="eyebrow-label">{copy.labels.certificateControl}</span>
                      <p className="registry-admin-certificate-header__note">{copy.labels.chooseCertificatePhotoDescription}</p>
                    </div>
                    <div className="registry-admin-certificate-header__code">
                      <p className="registry-admin-certificate-header__code-value">
                        {hasCertificate ? entry.certificate?.certificateCode : copy.labels.certificateNotIssued}
                      </p>
                    </div>
                    {hasCertificate && verifyTarget ? (
                      <Link href={`/certificate/${verifyTarget}`} className="button-primary small">
                        {copy.labels.openCertificate}
                      </Link>
                    ) : null}
                  </div>

                  <div className="registry-admin-certificate-photos">
                    <div className="registry-admin-certificate-photos__label">
                      <strong>{copy.labels.chooseCertificatePhoto}</strong>
                    </div>
                    {galleryImages.length > 0 ? (
                      <div className="registry-admin-certificate-photos__grid">
                        {galleryImages.map((imageUrl, index) => {
                          const isSelected = hasCertificate && entry.certificate?.certificateImageUrl === imageUrl;
                          return (
                            <form action={issueDogCertificateAction} className={`registry-admin-certificate-photo-card${isSelected ? ' is-selected' : ''}`} key={`${entry.dogId}-certificate-choice-${index}`}>
                              <input type="hidden" name="dogId" value={entry.dogId} />
                              <input type="hidden" name="certificateImageUrl" value={imageUrl} />
                              <div className="registry-admin-certificate-photo-card__image-wrapper">
                                <img src={imageUrl} alt={`${entry.dog.name} certificate choice ${index + 1}`} className="registry-admin-certificate-photo-card__image" loading="lazy" decoding="async" />
                                {isSelected && (
                                  <div className="registry-admin-certificate-photo-card__selected-badge">
                                    {copy.labels.selectedForCertificate}
                                  </div>
                                )}
                              </div>
                              <button
                                type="submit"
                                className={isSelected ? 'button-secondary small' : 'button-primary small'}
                                disabled={isSelected}
                              >
                                {hasCertificate
                                  ? isSelected
                                    ? copy.labels.selectedForCertificate
                                    : copy.labels.chooseForCertificate
                                  : copy.labels.issueCertificateWithPhoto}
                              </button>
                            </form>
                          );
                        })}
                      </div>
                    ) : (
                      <form action={issueDogCertificateAction} className="registry-admin-certificate-photos__no-gallery">
                        <input type="hidden" name="dogId" value={entry.dogId} />
                        <button type="submit" className="button-primary small">
                          {copy.labels.issueCertificate}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="registry-profile-card__actions">
              <Link href="/registry" className="button-secondary small">
                {copy.labels.backToRegistry}
              </Link>
              {verifyTarget ? (
                <>
                  <Link href={`/verify/${verifyTarget}`} className="button-primary small">
                    {copy.labels.verify}
                  </Link>
                  <Link href={`/certificate/${verifyTarget}`} className="button-secondary small">
                    {copy.labels.openCertificate}
                  </Link>
                </>
              ) : null}
            </div>

            {isAdminViewer ? (
              <div className="registry-admin-actions">
                <div className="registry-admin-actions__group">
                  <span className="eyebrow-label">{copy.labels.adminActions}</span>
                  <div className="registry-admin-actions__row registry-admin-actions__row--normal">
                    <form action={removeRegistryEntryAction}>
                      <input type="hidden" name="dogId" value={entry.dogId} />
                      <button type="submit" className="button-secondary small">
                        {copy.labels.removeFromRegistry}
                      </button>
                    </form>
                    {hasCertificate ? (
                      <form action={revokeCertificateAction}>
                        <input type="hidden" name="dogId" value={entry.dogId} />
                        <button type="submit" className="button-secondary small">
                          {copy.labels.revokeCertificate}
                        </button>
                      </form>
                    ) : null}
                  </div>
                </div>
                <div className="registry-admin-actions__group registry-admin-actions__group--destructive">
                  <span className="eyebrow-label">{copy.labels.dangerZone}</span>
                  <div className="registry-admin-actions__row registry-admin-actions__row--destructive">
                    <form action={removeDogProfileAction}>
                      <input type="hidden" name="dogId" value={entry.dogId} />
                      <button type="submit" className="button-secondary button-secondary--danger small">
                        {copy.labels.removeDog}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <CommunityRatingPanel
        locale={locale}
        variant="registry"
        slug={entry.publicSlug}
        targetId={entry.entryId}
        summary={entry.communityRating}
        vote={document.communityVote}
        status={ratingStatus}
      />

      <section className="content-card registry-pedigree-card">
        <span className="eyebrow-label">{copy.labels.pedigreeEyebrow}</span>
        <h2>{copy.labels.pedigreeTitle}</h2>
        <p>{copy.labels.pedigreeDescription}</p>
        <PedigreeTree
          dogName={entry.dog.name}
          pedigree={entry.dog.pedigree ?? {}}
          rootImageUrl={mainImage}
        />
      </section>

      {hasMemberAccess ? (
        <section className="content-card registry-story-card">
          <span className="eyebrow-label">{copy.labels.longStory}</span>
          <h2>{copy.labels.longStory}</h2>
          <p>{entry.dog.longDescription || entry.summary || copy.labels.notAvailable}</p>
        </section>
      ) : (
        <>
          <section className="content-card registry-locked-card">
            <div className="registry-locked-card__grid">
              <div>
                <span className="eyebrow-label">{copy.labels.memberExclusive}</span>
                <h2>{copy.labels.lockedDetailsTitle}</h2>
                <p>{copy.labels.lockedDetailsDescription}</p>
              </div>

              <div className="registry-locked-card__actions">
                <Link href="/access?intent=member" className="button-primary small">
                  {copy.labels.joinMember}
                </Link>
                <Link href="/access?intent=member" className="button-secondary small">
                  {copy.labels.memberAccess}
                </Link>
              </div>
            </div>

            <div className="registry-locked-list">
              <div className="registry-locked-list__item">{copy.labels.lockedItemIdentity}</div>
              <div className="registry-locked-list__item">{copy.labels.lockedItemPedigree}</div>
              <div className="registry-locked-list__item">{copy.labels.lockedItemStory}</div>
            </div>
          </section>

          <section className="content-card registry-story-card registry-story-card--teaser">
            <span className="eyebrow-label">{copy.labels.teaserTitle}</span>
            <h2>{copy.labels.teaserTitle}</h2>
            <p>{storyPreview}</p>
            <p className="registry-story-card__locked-note">{copy.labels.teaserLocked}</p>
          </section>
        </>
      )}
    </div>
  );
}
