import Link from 'next/link';
import { OverviewStatCard } from '@/components/overview-stat-card';
import type { Locale } from '@/lib/i18n';
import type { EcosystemDirectoryDocument, EcosystemListing } from '@cane-corso-platform/contracts';
import {
  getEcosystemListingTypeLabels,
  getEcosystemSubmissionChannelLabels,
  getEcosystemSubmissionChannelTone,
} from '@/lib/ecosystem-ui';

const copyByLocale = {
  en: {
    stats: {
      total: 'Published listings',
      official: 'Official listings',
      community: 'Community listings',
      countries: 'Countries',
      featured: 'Featured visibility',
    },
    labels: {
      eyebrow: 'Trusted ecosystem',
      title: 'Trusted Cane Corso ecosystem',
      intro: 'A curated public directory for official services, approved community places, and future ecosystem visibility.',
      emptyTitle: 'The ecosystem directory is still empty',
      emptyDescription:
        'This is the public layer for official services, approved community places, and future ecosystem visibility.',
      apply: 'Submit a listing',
      listingType: 'Layer',
      lane: 'Lane',
      category: 'Category',
      location: 'Location',
      contact: 'Contact',
      website: 'Website',
      coverage: 'Coverage',
      rules: 'Rules',
      pending: 'Not set yet',
      visitWebsite: 'Visit website',
      openDetail: 'Open details',
      joinHeadline: 'One publication engine for official and community visibility',
      joinCopy:
        'Official listings represent real operators. Community listings represent useful places discovered by members. Suggestions stay internal until they are converted.',
      placesEyebrow: 'Cane Corso-friendly places',
      placesTitle: 'Approved places for daily Cane Corso life',
      placesIntro:
        'Parks, walk zones, training fields, shops, cafés, hotels, clinics, and services that have passed review before public display.',
      placesEmpty: 'No approved places yet. Members can submit places from the owner workspace.',
      suitability: 'Large-breed suitability',
    },
  },
  bg: {
    stats: {
      total: 'Публикувани записи',
      official: 'Официални',
      community: 'Общностни',
      countries: 'Държави',
      featured: 'Отличени',
    },
    labels: {
      eyebrow: 'Доверена екосистема',
      title: 'Одобрена Cane Corso екосистема',
      intro: 'Публичен каталог за партньори, услуги, места и полезни предложения, които минават през преглед.',
      emptyTitle: 'Екосистемната директория все още е празна',
      emptyDescription:
        'Това е публичният слой за официални услуги, одобрени места, полезни обекти и бъдеща общностна видимост.',
      apply: 'Изпрати запис',
      listingType: 'Тип',
      lane: 'Поток',
      category: 'Категория',
      location: 'Локация',
      contact: 'Контакт',
      website: 'Уебсайт',
      coverage: 'Обхват',
      rules: 'Правила',
      pending: 'Все още няма данни',
      visitWebsite: 'Отвори сайта',
      openDetail: 'Отвори детайли',
      joinHeadline: 'Официални и общностни записи в един ясен поток',
      joinCopy:
        'Официалните записи са реални услуги и партньори. Общностните записи са полезни места и предложения от членовете. Нищо не става публично без преглед и одобрение.',
      placesEyebrow: 'Cane Corso-friendly места',
      placesTitle: 'Одобрени места за ежедневието с Cane Corso',
      placesIntro:
        'Паркове, зони за разходка, тренировъчни полета, магазини, заведения, хотели, клиники и услуги, които са прегледани преди публично показване.',
      placesEmpty: 'Все още няма одобрени места. Членовете могат да изпращат места от личната си зона.',
      suitability: 'Подходящост за едри породи',
    },
  },
  it: {
    stats: {
      total: 'Annunci pubblicati',
      official: 'Schede ufficiali',
      community: 'Schede community',
      countries: 'Paesi',
      featured: 'Visibilità featured',
    },
    labels: {
      eyebrow: 'Ecosistema di fiducia',
      title: 'Ecosistema Cane Corso di fiducia',
      intro: 'Una directory pubblica curata per servizi official, luoghi community approvati e futura visibilità ecosystem.',
      emptyTitle: 'La directory dell’ecosistema è ancora vuota',
      emptyDescription:
        'Questo è il layer pubblico per servizi official, luoghi community approvati e futura visibilità ecosystem.',
      apply: 'Invia una scheda',
      listingType: 'Layer',
      lane: 'Percorso',
      category: 'Categoria',
      location: 'Località',
      contact: 'Contatto',
      website: 'Sito web',
      coverage: 'Copertura',
      rules: 'Regole',
      pending: 'Non ancora disponibile',
      visitWebsite: 'Apri il sito',
      openDetail: 'Apri dettagli',
      joinHeadline: 'Un solo motore di pubblicazione per visibilità official e community',
      joinCopy:
        'Le schede official rappresentano operatori reali. Le schede community rappresentano luoghi utili scoperti dai membri. I suggerimenti restano interni finché non vengono convertiti.',
      placesEyebrow: 'Luoghi Cane Corso-friendly',
      placesTitle: 'Luoghi approvati per la vita quotidiana con Cane Corso',
      placesIntro:
        'Parchi, aree passeggio, campi training, negozi, locali, hotel, cliniche e servizi valutati prima della visibilità pubblica.',
      placesEmpty: 'Non ci sono ancora luoghi approvati. I membri possono inviarli dall’area proprietario.',
      suitability: 'Idoneità per razze grandi',
    },
  },
} as const;

const categoryLabelsByLocale: Record<Locale, Record<string, string>> = {
  en: {
    veterinary_clinic: 'Veterinary clinic',
    boarding: 'Boarding',
    transport: 'Transport',
    training: 'Training',
    grooming: 'Grooming',
    photographer: 'Photographer',
    shop: 'Shop',
    breeder: 'Breeder',
    park: 'Park / walking area',
    training_field: 'Training field',
    pet_friendly_shop: 'Pet-friendly shop',
    pet_friendly_cafe: 'Pet-friendly café / restaurant',
    dog_friendly_hotel: 'Dog-friendly hotel',
    large_breed_place: 'Large-breed friendly place',
    other: 'Other',
  },
  bg: {
    veterinary_clinic: 'Ветеринарна клиника',
    boarding: 'Хотел / престой',
    transport: 'Транспорт',
    training: 'Обучение',
    grooming: 'Груминг',
    photographer: 'Фотограф',
    shop: 'Магазин',
    breeder: 'Развъдник',
    park: 'Парк / зона за разходка',
    training_field: 'Тренировъчно поле',
    pet_friendly_shop: 'Магазин, подходящ за кучета',
    pet_friendly_cafe: 'Заведение, подходящо за кучета',
    dog_friendly_hotel: 'Хотел, подходящ за кучета',
    large_breed_place: 'Място, подходящо за едри породи',
    other: 'Друго',
  },
  it: {
    veterinary_clinic: 'Clinica veterinaria',
    boarding: 'Hotel / boarding',
    transport: 'Trasporto',
    training: 'Addestramento',
    grooming: 'Toelettatura',
    photographer: 'Fotografo',
    shop: 'Negozio',
    breeder: 'Allevatore',
    park: 'Parco / area passeggio',
    training_field: 'Campo training',
    pet_friendly_shop: 'Negozio pet-friendly',
    pet_friendly_cafe: 'Locale pet-friendly',
    dog_friendly_hotel: 'Hotel dog-friendly',
    large_breed_place: 'Luogo adatto a razze grandi',
    other: 'Altro',
  },
};

const standardTextTranslations: Record<Locale, Record<string, string>> = {
  en: {},
  bg: {
    'A premium Cane Corso-focused veterinary service profile for public directory testing.':
      'Премиум ветеринарен профил за Cane Corso, използван за тест на публичната директория.',
    'Premium boarding and relocation support for large-breed Cane Corso owners.':
      'Премиум престой и съдействие при преместване за собственици на едри Cane Corso.',
    'Official Partner / Services profile approved for the Cane Corso ecosystem.':
      'Официален профил за партньор или услуга, одобрен за Cane Corso екосистемата.',
    'Visible after administrator approval. Community ratings remain separate from official approval.':
      'Видим след одобрение от администратор. Общностните оценки остават отделени от официалното одобрение.',
  },
  it: {
    'Official Partner / Services profile approved for the Cane Corso ecosystem.':
      'Profilo partner o servizio ufficiale approvato per l’ecosistema Cane Corso.',
    'Visible after administrator approval. Community ratings remain separate from official approval.':
      'Visibile dopo approvazione amministratore. Le valutazioni community restano separate dall’approvazione ufficiale.',
  },
};


function isFriendlyPlace(item: EcosystemListing) {
  return item.listingType === 'walk_play_place' || item.listingType === 'pet_friendly_place';
}

function formatCategory(value: string | null | undefined, locale: Locale, fallback: string) {
  if (!value) {
    return fallback;
  }

  const labels = categoryLabelsByLocale[locale] ?? categoryLabelsByLocale.en;
  return labels[value] ?? value.replace(/[_-]+/g, ' ');
}

function localizeStandardText(value: string | null | undefined, locale: Locale, fallback: string) {
  if (!value) {
    return fallback;
  }

  const translations = standardTextTranslations[locale] ?? standardTextTranslations.en;
  return translations[value] ?? value;
}

function formatLocation(item: EcosystemListing, fallback: string) {
  const parts = [item.city, item.country].filter(Boolean);
  return parts.length ? parts.join(', ') : fallback;
}

function getCommunityProfileHref(slug: string) {
  return `/community/${encodeURIComponent(slug)}`;
}

interface EcosystemDirectoryProps {
  document: EcosystemDirectoryDocument;
  locale: Locale;
  applyHref: string;
}

export function EcosystemDirectory({ document, locale, applyHref }: EcosystemDirectoryProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const typeLabels = getEcosystemListingTypeLabels(locale);
  const channelLabels = getEcosystemSubmissionChannelLabels(locale);
  const friendlyPlaces = document.items.filter(isFriendlyPlace);

  return (
    <div className="member-route-stack">
      <div className="stats-grid five-up">
        <OverviewStatCard label={copy.stats.total} value={String(document.summary.total)} tone="gold" />
        <OverviewStatCard label={copy.stats.official} value={String(document.summary.officialPublished)} tone="ivory" />
        <OverviewStatCard label={copy.stats.community} value={String(document.summary.communityPublished)} tone="gold" />
        <OverviewStatCard label={copy.stats.countries} value={String(document.summary.countries)} tone="ivory" />
        <OverviewStatCard label={copy.stats.featured} value={String(document.summary.featured)} tone="gold" />
      </div>

      <section className="content-card friendly-places-public-card">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.labels.placesEyebrow}</span>
            <h2>{copy.labels.placesTitle}</h2>
            <p className="section-card__description">{copy.labels.placesIntro}</p>
          </div>
          <Link href={applyHref} className="button-secondary small">
            {copy.labels.apply}
          </Link>
        </div>

        {friendlyPlaces.length === 0 ? (
          <div className="empty-state-panel empty-state-panel--compact">
            <p className="empty-state-panel__description">{copy.labels.placesEmpty}</p>
          </div>
        ) : (
          <div className="friendly-places-grid">
            {friendlyPlaces.slice(0, 6).map((item) => (
              <article className="friendly-place-card" key={item.id}>
                <span className="eyebrow-label">{typeLabels[item.listingType]}</span>
                <h3>{item.title}</h3>
                <p>{localizeStandardText(item.shortDescription || item.longDescription, locale, copy.labels.pending)}</p>
                <dl>
                  <div><dt>{copy.labels.location}</dt><dd>{formatLocation(item, copy.labels.pending)}</dd></div>
                  <div><dt>{copy.labels.category}</dt><dd>{formatCategory(item.category, locale, copy.labels.pending)}</dd></div>
                  <div><dt>{copy.labels.suitability}</dt><dd>{localizeStandardText(item.rulesNote || item.coverageNote, locale, copy.labels.pending)}</dd></div>
                </dl>
                <Link className="button-primary small" href={getCommunityProfileHref(item.slug)}>
                  {copy.labels.openDetail}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="content-card ecosystem-directory-card">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.labels.eyebrow}</span>
            <h2>{copy.labels.title}</h2>
            <p className="section-card__description">{copy.labels.intro}</p>
          </div>

          <Link href={applyHref} className="button-primary small">
            {copy.labels.apply}
          </Link>
        </div>

        <div className="ecosystem-callout">
          <span className="eyebrow-label">{copy.labels.joinHeadline}</span>
          <p>{copy.labels.joinCopy}</p>
        </div>

        {document.items.length === 0 ? (
          <div className="empty-state-panel empty-state-panel--compact">
            <h3>{copy.labels.emptyTitle}</h3>
            <p className="empty-state-panel__description">{copy.labels.emptyDescription}</p>
          </div>
        ) : (
          <div className="ecosystem-card-grid">
            {document.items.map((item) => {
              const tone = getEcosystemSubmissionChannelTone(item.submissionChannel);

              return (
                <article className="ecosystem-card" key={item.id}>
                  <div className="ecosystem-card__head">
                    <div>
                      <div className="ecosystem-owner-item__title-row">
                        <span className={`submission-channel-chip submission-channel-chip--${tone}`}>
                          {channelLabels[item.submissionChannel]}
                        </span>
                        <span className="eyebrow-label">{typeLabels[item.listingType]}</span>
                      </div>
                      <h3>{item.title}</h3>
                    </div>
                    {item.isFeatured ? <span className="route-pill route-pill--glow">{locale === 'bg' ? 'Отличен' : locale === 'it' ? 'In evidenza' : 'Featured'}</span> : null}
                  </div>

                  <p className="ecosystem-card__summary">
                    {localizeStandardText(item.shortDescription || item.longDescription, locale, copy.labels.pending)}
                  </p>

                  <dl className="ecosystem-card__meta">
                    <div>
                      <dt>{copy.labels.lane}</dt>
                      <dd>{channelLabels[item.submissionChannel]}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.listingType}</dt>
                      <dd>{typeLabels[item.listingType]}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.category}</dt>
                      <dd>{formatCategory(item.category, locale, copy.labels.pending)}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.location}</dt>
                      <dd>{formatLocation(item, copy.labels.pending)}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.contact}</dt>
                      <dd>{item.email || item.phone || copy.labels.pending}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.coverage}</dt>
                      <dd>{localizeStandardText(item.coverageNote, locale, copy.labels.pending)}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.rules}</dt>
                      <dd>{localizeStandardText(item.rulesNote, locale, copy.labels.pending)}</dd>
                    </div>
                  </dl>

                  <div className="ecosystem-card__actions">
                    <Link
                      className="button-primary small"
                      href={getCommunityProfileHref(item.slug)}
                      aria-label={`${copy.labels.openDetail}: ${item.title}`}
                    >
                      {copy.labels.openDetail}
                    </Link>
                    {item.websiteUrl ? (
                      <a className="button-secondary small" href={item.websiteUrl} target="_blank" rel="noreferrer">
                        {copy.labels.visitWebsite}
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
