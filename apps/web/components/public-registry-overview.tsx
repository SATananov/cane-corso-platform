import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import type { PublicRegistryDocument, PublicRegistryEntry } from '@cane-corso-platform/contracts';
import { OverviewStatCard } from '@/components/overview-stat-card';
import { removeDogProfileAction, removeRegistryEntryAction, revokeCertificateAction } from '@/app/(admin)/admin/registry/actions';
import { ImageLightbox } from '@/components/image-lightbox';

const copyByLocale = {
  en: {
    stats: {
      total: 'Published profiles',
      totalNote: 'live public records',
      certified: 'With certificate',
      certifiedNote: 'trust-marked entries',
      countries: 'Countries',
      countriesNote: 'registry coverage',
    },
    labels: {
      directory: 'Registered Cane Corso profiles',
      emptyTitle: 'No public Cane Corso profiles yet',
      emptyDescription: 'Once an approved profile is published, it will appear here with its public registry path and verification access.',
      owner: 'Owner',
      location: 'Location',
      published: 'Published',
      certificate: 'Certificate',
      verify: 'Verify',
      open: 'Open profile',
      pending: 'Pending',
      guestGateEyebrow: 'Open registry preview',
      guestGateTitle: 'Browse the registry publicly and unlock richer profile depth after registration.',
      guestGateDescription:
        'Guest visitors can view the trusted public showcase. Create a member account to unlock fuller registry details, deeper profile stories, and future premium access layers.',
      joinMember: 'Become a member',
      signIn: 'Member access',
      memberDepth: 'Member depth',
      memberDepthCopy: 'The public catalogue stays visible, while richer profile sections are reserved for registered access.',
      orientationEyebrow: 'How the registry works',
      orientationTitle: 'Published identity, trusted certificate, and a direct verification path.',
      orientationDescription:
        'The registry shows public Cane Corso presence. The profile proves publication, the certificate confirms trust, and Verify lets visitors confirm the active public record.',
      orientationA: 'Published profile',
      orientationACopy: 'Public identity, summary, location, and presentation layer for approved Cane Corso entries.',
      orientationB: 'USG certificate',
      orientationBCopy: 'A separate trust signal that may appear on selected profiles and can be confirmed independently.',
      orientationC: 'Verify path',
      orientationCCopy: 'Every active certificate can connect directly to Verify so the visitor confirms the public record.',
      publishedBadge: 'Published in registry',
      certifiedBadge: 'Certified',
      placeholderNote: 'Official registry layer',
      certificateNote: 'Trust verified presence',
      communityRating: 'Community rating',
      noRatings: 'No ratings yet',
      communityFavorite: 'Community favorite',
      usgOfficialRating: 'Admin / USG rating',
      usgCommunityRating: 'User rating',
      usgSealTitle: 'USG',
      usgSealSubtitle: 'Certified',
      noUsgRating: 'Awaiting USG certificate review',
      noCommunityVotes: 'No community votes yet',
      votes: 'votes',
      galleryDescription: 'Explore the Cane Corso profiles that have been approved and published in the official Registry. USG Gallery remains a separate admin-curated selection.',
      registryApproved: 'Published in Registry',
      certificateApproved: 'USG certificate',
      yes: 'Yes',
      no: 'Not yet',
      mother: 'Mother',
      father: 'Father',
      parents: 'Parent line',
      morePhotos: 'Profile photos',
      dateOfBirth: 'Birth date',
      pedigree: 'Pedigree',
      microchip: 'Microchip',
      adminView: 'Admin view',
      protectedView: 'Protected admin details',
      authorityTitle: 'Registry trust layer',
      authorityDescription: 'Official registry presence prepared for public trust and admin review.',
      authorityOwner: 'Declared by owner',
      adminActions: 'Admin actions',
      removeFromRegistry: 'Remove from registry',
      revokeCertificate: 'Revoke certificate',
      removeDog: 'Delete Cane Corso',
    },
  },
  bg: {
    stats: {
      total: 'Публикувани профили',
      totalNote: 'активни публични записи',
      certified: 'Със сертификат',
      certifiedNote: 'доверени присъствия',
      countries: 'Държави',
      countriesNote: 'покритие на регистъра',
    },
    labels: {
      directory: 'Регистрирани Cane Corso профили',
      emptyTitle: 'Все още няма публични Cane Corso профили',
      emptyDescription: 'След като одобрен профил бъде публикуван, той ще се появи тук с публичния си адрес и достъп до страницата за проверка.',
      owner: 'Собственик',
      location: 'Локация',
      published: 'Публикуван',
      certificate: 'Сертификат',
      verify: 'Провери',
      open: 'Отвори профила',
      pending: 'В изчакване',
      guestGateEyebrow: 'Публичен достъп',
      guestGateTitle: 'Разгледай регистъра свободно, а по-богатите профили отключи след регистрация.',
      guestGateDescription:
        'Гостът вижда публичната витрина и доверието на платформата. След членска регистрация се отключват по-пълни детайли от регистъра, по-дълбока история на профила и бъдещ премиум слой.',
      joinMember: 'Стани член',
      signIn: 'Вход за членове',
      memberDepth: 'Разширен членски достъп',
      memberDepthCopy: 'Каталогът остава публичен, а по-богатите секции на профила са запазени за регистриран достъп.',
      orientationEyebrow: 'Как работи регистърът',
      orientationTitle: 'Публикуван профил, доверен сертификат и директен път към проверка.',
      orientationDescription:
        'Регистърът показва публичното присъствие на Cane Corso. Профилът доказва публикацията, сертификатът добавя отделен знак за доверие, а Verify позволява на посетителя да потвърди активния публичен запис.',
      orientationA: 'Публикуван профил',
      orientationACopy: 'Публична идентичност, кратко представяне, локация и премиум присъствие за одобрен профил на Cane Corso.',
      orientationB: 'USG сертификат',
      orientationBCopy: 'Отделен знак за доверие, който може да присъства при избрани профили и се потвърждава самостоятелно.',
      orientationC: 'Път към проверка',
      orientationCCopy: 'Всеки активен сертификат може да отвори директно страницата за проверка, за да потвърди публичния запис.',
      publishedBadge: 'Публикуван в регистъра',
      certifiedBadge: 'Сертифициран',
      placeholderNote: 'Официален слой на регистъра',
      certificateNote: 'Потвърдено доверено присъствие',
      communityRating: 'Оценка от общността',
      noRatings: 'Все още няма оценки',
      communityFavorite: 'Любимец на общността',
      usgOfficialRating: 'Оценка от админа / USG',
      usgCommunityRating: 'Оценка от потребителите',
      usgSealTitle: 'USG',
      usgSealSubtitle: 'Сертифициран',
      noUsgRating: 'Очаква USG сертификатна оценка',
      noCommunityVotes: 'Все още няма гласове от общността',
      votes: 'гласа',
      galleryDescription: 'Разгледай Cane Corso профилите, които са одобрени и публикувани в официалния Регистър. USG Галерията остава отделна селекция, избирана от админ.',
      registryApproved: 'Публикуван в Регистъра',
      certificateApproved: 'USG сертификат',
      yes: 'Да',
      no: 'Все още не',
      mother: 'Майка',
      father: 'Баща',
      parents: 'Родителска линия',
      morePhotos: 'Снимки към профила',
      dateOfBirth: 'Дата на раждане',
      pedigree: 'Родословие',
      microchip: 'Микрочип',
      adminView: 'Админ изглед',
      protectedView: 'Допълнителни админ детайли',
      authorityTitle: 'Доверен слой на регистъра',
      authorityDescription: 'Официално регистърно присъствие, подготвено за публично доверие и админ преглед.',
      authorityOwner: 'Деклариран от собственика',
      adminActions: 'Админ действия',
      removeFromRegistry: 'Махни от регистъра',
      revokeCertificate: 'Отнеми сертификата',
      removeDog: 'Изтрий Cane Corso',
    },
  },
  it: {
    stats: {
      total: 'Profili pubblicati',
      totalNote: 'record pubblici attivi',
      certified: 'Con certificato',
      certifiedNote: 'presenze con fiducia',
      countries: 'Paesi',
      countriesNote: 'copertura del registro',
    },
    labels: {
      directory: 'Profili Cane Corso registrati',
      emptyTitle: 'Nessun profilo Cane Corso pubblico',
      emptyDescription: 'Quando un profilo approvato viene pubblicato, comparirà qui con il suo percorso pubblico e l’accesso alla verifica.',
      owner: 'Proprietario',
      location: 'Località',
      published: 'Pubblicato',
      certificate: 'Certificato',
      verify: 'Verifica',
      open: 'Apri profilo',
      pending: 'In attesa',
      guestGateEyebrow: 'Anteprima pubblica',
      guestGateTitle: 'Esplora il registro liberamente e sblocca i profili più ricchi dopo la registrazione.',
      guestGateDescription:
        'Il visitatore vede la vetrina pubblica e il livello di fiducia della piattaforma. Dopo la registrazione membro si sbloccano dettagli più completi del registro, una storia più profonda del profilo e futuri livelli premium.',
      joinMember: 'Diventa membro',
      signIn: 'Accesso membri',
      memberDepth: 'Accesso membro esteso',
      memberDepthCopy: 'Il catalogo resta pubblico, mentre le sezioni più ricche del profilo sono riservate agli utenti registrati.',
      orientationEyebrow: 'Come funziona il registro',
      orientationTitle: 'Profilo pubblicato, certificato di fiducia e percorso diretto a Verify.',
      orientationDescription:
        'Il registro mostra la presenza pubblica del Cane Corso. Il profilo dimostra la pubblicazione, il certificato aggiunge un segnale separato di fiducia e Verify conferma il record pubblico attivo.',
      orientationA: 'Profilo pubblicato',
      orientationACopy: 'Identità pubblica, sintesi, località e presenza premium per un profilo Cane Corso approvato.',
      orientationB: 'Certificato USG',
      orientationBCopy: 'Segnale di fiducia separato che può comparire su profili selezionati e si conferma autonomamente.',
      orientationC: 'Percorso Verify',
      orientationCCopy: 'Ogni certificato attivo può aprire direttamente Verify per confermare il record pubblico.',
      publishedBadge: 'Pubblicato nel registro',
      certifiedBadge: 'Certificato',
      placeholderNote: 'Layer ufficiale del registro',
      certificateNote: 'Presenza con fiducia verificata',
      communityRating: 'Valutazione della community',
      noRatings: 'Nessuna valutazione',
      communityFavorite: 'Preferito della community',
      usgOfficialRating: 'Valutazione admin / USG',
      usgCommunityRating: 'Valutazione utenti',
      usgSealTitle: 'USG',
      usgSealSubtitle: 'Certificato',
      noUsgRating: 'In attesa della valutazione certificata USG',
      noCommunityVotes: 'Nessun voto della community',
      votes: 'voti',
      galleryDescription: 'Esplora i profili Cane Corso approvati e pubblicati nel Registro ufficiale. La USG Gallery resta una selezione separata curata dall\'admin.',
      registryApproved: 'Pubblicato nel Registro',
      certificateApproved: 'Certificato USG',
      yes: 'Sì',
      no: 'Non ancora',
      mother: 'Madre',
      father: 'Padre',
      parents: 'Linea genitoriale',
      morePhotos: 'Foto del profilo',
      dateOfBirth: 'Data di nascita',
      pedigree: 'Pedigree',
      microchip: 'Microchip',
      adminView: 'Vista admin',
      protectedView: 'Dettagli admin protetti',
      authorityTitle: 'Layer di fiducia del registro',
      authorityDescription: 'Presenza ufficiale del registro preparata per fiducia pubblica e revisione admin.',
      authorityOwner: 'Dichiarato dal proprietario',
      adminActions: 'Azioni admin',
      removeFromRegistry: 'Rimuovi dal registro',
      revokeCertificate: 'Revoca certificato',
      removeDog: 'Elimina Cane Corso',
    },
  },
} as const;

interface PublicRegistryOverviewProps {
  document: PublicRegistryDocument;
  locale: Locale;
  hasMemberAccess: boolean;
  isAdminViewer?: boolean;
}

function formatRegistryClass(locale: Locale, value: string | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  const normalized = value.toLowerCase();

  if (locale === 'bg') {
    if (normalized === 'owner_declared_cane_corso') return 'Профил, деклариран от собственика';
    if (normalized === 'registry_certified_cane_corso') return 'Сертифициран Cane Corso';
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

function formatDateLabel(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(new Date(value));
}

function formatLocation(city: string | null, country: string | null, fallback: string) {
  const parts = [city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : fallback;
}

function formatSexLabel(locale: Locale, value: string | null) {
  if (!value) {
    return '';
  }

  const normalized = value.toLowerCase();
  if (locale === 'bg') {
    if (normalized === 'male') return 'мъжки';
    if (normalized === 'female') return 'женски';
  }

  if (locale === 'it') {
    if (normalized === 'male') return 'maschio';
    if (normalized === 'female') return 'femmina';
  }

  return normalized;
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
    return <ImageLightbox src={profile.photoUrl} alt={profile.name || fallback} imageClassName="registry-parent-card__image" />;
  }

  return <div className="registry-parent-card__placeholder">{(profile.name || fallback).slice(0, 1)}</div>;
}

export function PublicRegistryOverview({ document, locale, hasMemberAccess, isAdminViewer = false }: PublicRegistryOverviewProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const certified = document.entries.filter((entry) => entry.certificate).length;
  const countries = new Set(document.entries.map((entry) => entry.owner.country).filter(Boolean)).size;

  return (
    <div className="member-route-stack">
      <div className="stats-grid three-up registry-stats-grid">
        <OverviewStatCard label={copy.stats.total} value={String(document.total)} detail={copy.stats.totalNote} tone="gold" />
        <OverviewStatCard label={copy.stats.certified} value={String(certified)} detail={copy.stats.certifiedNote} tone="ivory" />
        <OverviewStatCard label={copy.stats.countries} value={String(countries)} detail={copy.stats.countriesNote} tone="gold" />
      </div>

      {!hasMemberAccess ? (
        <section className="content-card registry-access-banner">
          <div className="registry-access-banner__copy">
            <span className="eyebrow-label">{copy.labels.guestGateEyebrow}</span>
            <h2>{copy.labels.guestGateTitle}</h2>
            <p>{copy.labels.guestGateDescription}</p>
          </div>

          <div className="registry-access-banner__aside">
            <div className="registry-access-banner__badge-card">
              <span className="eyebrow-label">{copy.labels.memberDepth}</span>
              <p>{copy.labels.memberDepthCopy}</p>
            </div>
            <div className="registry-access-banner__actions">
              <Link href="/access?intent=member" className="button-primary small">
                {copy.labels.joinMember}
              </Link>
              <Link href="/access?intent=member" className="button-secondary small">
                {copy.labels.signIn}
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="content-card registry-directory-card">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.labels.directory}</span>
            <h2>{copy.labels.directory}</h2>
            <p className="section-head-row__description">{copy.labels.galleryDescription}</p>
          </div>
        </div>

        {document.entries.length === 0 ? (
          <div className="empty-state-panel empty-state-panel--compact">
            <h3>{copy.labels.emptyTitle}</h3>
            <p className="empty-state-panel__description">{copy.labels.emptyDescription}</p>
          </div>
        ) : (
          <div className="registry-card-grid registry-card-grid--gallery">
            {document.entries.map((entry) => {
              const usgScore = entry.certificate ? 5 : null;
              const communityScore = entry.communityRating.totalRatings > 0 ? entry.communityRating.averageRating ?? null : null;
              const galleryImages = getGalleryImages(entry);
              const mainImage = galleryImages[0] ?? null;
              const parents = getParentProfiles(entry);
              const approvalCert = Boolean(entry.certificate?.certificateCode);
              const authorityCard = !mainImage;

              return (
                <article className={`registry-card registry-card--enhanced${authorityCard ? ' registry-card--authority' : ''}`} key={entry.entryId}>
                  <div className="registry-card__media-stack">
                    <div className={`registry-card__media${authorityCard ? ' registry-card__media--authority' : ''}`}>
                      {mainImage ? (
                        <ImageLightbox src={mainImage} alt={entry.dog.name} imageClassName="registry-card__image" />
                      ) : (
                        <div className="registry-card__placeholder registry-card__placeholder--authority">
                          <div className="registry-card__placeholder-inner registry-card__placeholder-inner--authority">
                            <div className="registry-card__authority-copy">
                              <span>UNICO SUO GENERE</span>
                              <strong>{copy.labels.authorityTitle}</strong>
                              <small>{copy.labels.authorityDescription}</small>
                            </div>
                            <div className="registry-card__authority-grid">
                              <div className="registry-card__authority-item">
                                <span>{copy.labels.registryApproved}</span>
                                <strong>{copy.labels.yes}</strong>
                              </div>
                              <div className="registry-card__authority-item">
                                <span>{copy.labels.certificateApproved}</span>
                                <strong>{approvalCert ? copy.labels.yes : copy.labels.no}</strong>
                              </div>
                              <div className="registry-card__authority-item">
                                <span>{copy.labels.authorityOwner}</span>
                                <strong>{entry.owner.displayName}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {entry.certificate ? (
                        <div className="registry-media-seal registry-media-seal--top-right registry-media-seal--official" aria-label={copy.labels.certifiedBadge}>
                          <img src="/brand/seal/usg-official-seal-compact.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                          <span>{copy.labels.usgSealTitle}</span>
                          <small>{copy.labels.usgSealSubtitle}</small>
                        </div>
                      ) : null}
                    </div>

                    {galleryImages.length > 1 ? (
                      <div className="registry-gallery-strip">
                        <span className="eyebrow-label">{copy.labels.morePhotos}</span>
                        <div className="registry-gallery-strip__row">
                          {galleryImages.map((imageUrl, index) => (
                            <div className="registry-gallery-thumb" key={`${entry.entryId}-gallery-${index}`}>
                              <ImageLightbox src={imageUrl} alt={entry.dog.name} imageClassName="registry-gallery-thumb__image" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {authorityCard ? (
                      <div className="registry-authority-panel">
                        <span className="eyebrow-label">{copy.labels.authorityTitle}</span>
                        <div className="registry-authority-panel__grid">
                          <div className="registry-authority-panel__item">
                            <span>{copy.labels.usgOfficialRating}</span>
                            <strong>{formatScore(usgScore)}</strong>
                          </div>
                          <div className="registry-authority-panel__item">
                            <span>{copy.labels.usgCommunityRating}</span>
                            <strong>{entry.communityRating.totalRatings > 0 ? `${entry.communityRating.totalRatings} ${copy.labels.votes}` : copy.labels.noRatings}</strong>
                          </div>
                          <div className="registry-authority-panel__item">
                            <span>{copy.labels.certificate}</span>
                            <strong>{entry.certificate?.certificateCode ?? copy.labels.pending}</strong>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {parents.length > 0 ? (
                      <div className="registry-parents-strip">
                        <span className="eyebrow-label">{copy.labels.parents}</span>
                        <div className="registry-parents-strip__grid">
                          {parents.map((item) => (
                            <div className="registry-parent-card" key={`${entry.entryId}-${item.key}`}>
                              <div className="registry-parent-card__media">{renderParentPhoto(item.profile!, item.key === 'mother' ? copy.labels.mother : copy.labels.father)}</div>
                              <div className="registry-parent-card__copy">
                                <span>{item.key === 'mother' ? copy.labels.mother : copy.labels.father}</span>
                                <strong>{item.profile?.name || copy.labels.pending}</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="registry-card__body">
                    <div className="registry-card__head">
                      <div className="registry-card__identity">
                        <span className="eyebrow-label">{formatRegistryClass(locale, entry.dog.registryClass, copy.labels.pending)}</span>
                        <h3>{entry.title}</h3>
                      </div>
                      <div className="registry-card__badge-stack">
                        {isAdminViewer ? <span className="route-pill route-pill--glow">{copy.labels.adminView}</span> : null}
                        <span className="route-pill subtle">{formatSexLabel(locale, entry.dog.sex)}</span>
                        <span className={`route-pill ${entry.certificate ? 'route-pill--glow' : 'subtle'}`}>
                          {entry.certificate ? copy.labels.certifiedBadge : copy.labels.publishedBadge}
                        </span>
                        {entry.communityRating.badge === 'community_favorite' ? (
                          <span className="route-pill route-pill--glow">{copy.labels.communityFavorite}</span>
                        ) : null}
                      </div>
                    </div>

                    <p className="registry-card__summary">{entry.summary || entry.dog.shortDescription || copy.labels.pending}</p>

                    <div className="registry-rating-stack">
                      <div className="registry-rating-row">
                        <div className="registry-rating-row__copy">
                          <span className="registry-rating-row__label">{copy.labels.usgOfficialRating}</span>
                          <div className="registry-rating-stars">{renderStars(usgScore)}</div>
                        </div>
                        <div className="registry-rating-row__summary">
                          <strong className="registry-rating-row__value">{formatScore(usgScore)}</strong>
                          <span className="registry-rating-row__meta">{entry.certificate ? copy.labels.certifiedBadge : copy.labels.noUsgRating}</span>
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

                    <div className="registry-approval-grid">
                      <div className="registry-approval-card registry-approval-card--approved">
                        <span>{copy.labels.registryApproved}</span>
                        <strong>{copy.labels.yes}</strong>
                      </div>
                      <div className={`registry-approval-card ${approvalCert ? 'registry-approval-card--approved' : 'registry-approval-card--pending'}`}>
                        <span>{copy.labels.certificateApproved}</span>
                        <strong>{approvalCert ? copy.labels.yes : copy.labels.no}</strong>
                      </div>
                    </div>

                    {entry.certificate?.certificateCode ? (
                      <div className="registry-card__certificate-strip">
                        <div className="registry-card__certificate-primary">
                          <span className="eyebrow-label">{copy.labels.certificate}</span>
                          <strong>{entry.certificate.certificateCode}</strong>
                        </div>
                        <span className="registry-card__certificate-note">{copy.labels.certificateNote}</span>
                      </div>
                    ) : null}

                    <div className="registry-card__footer">
                      <dl className="registry-card__meta">
                        <div>
                          <dt>{copy.labels.owner}</dt>
                          <dd>{entry.owner.displayName}</dd>
                        </div>
                        <div>
                          <dt>{copy.labels.location}</dt>
                          <dd>{formatLocation(entry.owner.city, entry.owner.country, copy.labels.pending)}</dd>
                        </div>
                        <div>
                          <dt>{copy.labels.published}</dt>
                          <dd>{formatDateLabel(locale, entry.publishedAt)}</dd>
                        </div>
                        <div>
                          <dt>{copy.labels.certificate}</dt>
                          <dd>{entry.certificate?.certificateCode ?? copy.labels.pending}</dd>
                        </div>
                      </dl>

                      {isAdminViewer ? (
                        <div className="registry-admin-panel">
                          <span className="eyebrow-label">{copy.labels.protectedView}</span>
                          <dl className="registry-admin-panel__grid">
                            <div>
                              <dt>{copy.labels.dateOfBirth}</dt>
                              <dd>{entry.dog.dateOfBirth ?? copy.labels.pending}</dd>
                            </div>
                            <div>
                              <dt>{copy.labels.pedigree}</dt>
                              <dd>{entry.dog.pedigreeNumber ?? copy.labels.pending}</dd>
                            </div>
                            <div>
                              <dt>{copy.labels.microchip}</dt>
                              <dd>{entry.dog.microchipNumber ?? copy.labels.pending}</dd>
                            </div>
                            <div>
                              <dt>{copy.labels.publishedBadge}</dt>
                              <dd>{entry.publicSlug}</dd>
                            </div>
                          </dl>
                        </div>
                      ) : null}

                      <div className="registry-card__actions">
                        <Link href={`/registry/${entry.publicSlug}`} className="button-primary small">
                          {copy.labels.open}
                        </Link>
                        {entry.certificate ? (
                          <Link href={`/verify/${entry.certificate.certificateCode ?? entry.certificate.verificationSlug}`} className="button-secondary small">
                            {copy.labels.verify}
                          </Link>
                        ) : null}
                      </div>

                      {isAdminViewer ? (
                        <div className="registry-admin-actions">
                          <span className="eyebrow-label">{copy.labels.adminActions}</span>
                          <div className="registry-admin-actions__row">
                            <form action={removeRegistryEntryAction}>
                              <input type="hidden" name="dogId" value={entry.dogId} />
                              <button type="submit" className="button-secondary small">
                                {copy.labels.removeFromRegistry}
                              </button>
                            </form>
                            {entry.certificate ? (
                              <form action={revokeCertificateAction}>
                                <input type="hidden" name="dogId" value={entry.dogId} />
                                <button type="submit" className="button-ghost small">
                                  {copy.labels.revokeCertificate}
                                </button>
                              </form>
                            ) : null}
                            <form action={removeDogProfileAction}>
                              <input type="hidden" name="dogId" value={entry.dogId} />
                              <button type="submit" className="button-secondary button-secondary--danger small">
                                {copy.labels.removeDog}
                              </button>
                            </form>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="content-card registry-orientation-panel">
        <div className="registry-orientation-panel__header registry-orientation-panel__header--trust">
          <div>
            <span className="eyebrow-label">{copy.labels.orientationEyebrow}</span>
            <h2>{copy.labels.orientationTitle}</h2>
            <p>{copy.labels.orientationDescription}</p>
          </div>
          <div className="registry-orientation-panel__seal" aria-hidden="true">
            <img src="/brand/seal/usg-official-seal-compact.png" alt="" loading="lazy" decoding="async" />
          </div>
        </div>

        <div className="registry-orientation-panel__grid">
          <article className="registry-orientation-card">
            <span className="eyebrow-label">01</span>
            <h3>{copy.labels.orientationA}</h3>
            <p>{copy.labels.orientationACopy}</p>
          </article>
          <article className="registry-orientation-card">
            <span className="eyebrow-label">02</span>
            <h3>{copy.labels.orientationB}</h3>
            <p>{copy.labels.orientationBCopy}</p>
          </article>
          <article className="registry-orientation-card">
            <span className="eyebrow-label">03</span>
            <h3>{copy.labels.orientationC}</h3>
            <p>{copy.labels.orientationCCopy}</p>
          </article>
        </div>
      </section>
    </div>
  );
}
