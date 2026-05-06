import Link from 'next/link';
import { FriendlyPlacesMap } from '@/components/friendly-places-map';
import type { EcosystemListing, EcosystemProfileDocument } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import { getEcosystemListingTypeLabels, getEcosystemSubmissionChannelLabels, getEcosystemSubmissionChannelTone } from '@/lib/ecosystem-ui';

interface EcosystemProfileDetailProps {
  document: EcosystemProfileDocument;
  locale: Locale;
}

const copyByLocale = {
  en: {
    back: 'Back to community', visitWebsite: 'Visit website', email: 'Email', phone: 'Phone', website: 'Website', notSet: 'Not set yet',
    featured: 'Featured', published: 'Published', identityEyebrow: 'Public ecosystem profile', identityTitle: 'Approved Cane Corso ecosystem visibility',
    identityCopy: 'This page opens only for a real ecosystem listing that has been published after moderation. Drafts, pending records, approved-only records, and internal suggestions do not receive public detail pages.',
    detailsEyebrow: 'Owner-useful information', detailsTitle: 'Practical details', listingType: 'Layer', channel: 'Publication lane', category: 'Category', location: 'Location',
    contactEyebrow: 'Contact', contactTitle: 'Contact and access', coverageEyebrow: 'Before you go', coverageTitle: 'Coverage and local rules', coverage: 'Coverage', rules: 'Rules',
    trustEyebrow: 'Release guardrail', trustTitle: 'Why this profile is public', trustA: 'Published-only route', trustACopy: 'The profile uses the same public visibility rules as the /community directory.', trustB: 'Suggestions stay internal', trustBCopy: 'Community suggestions stay private until converted and published.', trustC: 'Locked boundary', trustCCopy: 'The foundation does not unlock registry, certificate, partner, gallery, or admin review flows.',
  },
  bg: {
    back: 'Назад към общността', visitWebsite: 'Отвори сайта', email: 'Имейл', phone: 'Телефон', website: 'Уебсайт', notSet: 'Все още няма данни',
    featured: 'Отличен', published: 'Публикуван', identityEyebrow: 'Публичен профил в екосистемата', identityTitle: 'Одобрена Cane Corso видимост',
    identityCopy: 'Тази страница се отваря само за реален запис от екосистемата, който е публикуван след модерация. Чернови, чакащи записи, само одобрени записи и вътрешни предложения не получават публична детайлна страница.',
    detailsEyebrow: 'Информация за собственика', detailsTitle: 'Практични детайли', listingType: 'Слой', channel: 'Поток на публикуване', category: 'Категория', location: 'Локация',
    contactEyebrow: 'Контакт', contactTitle: 'Контакт и достъп', coverageEyebrow: 'Преди да отидеш', coverageTitle: 'Обхват и местни правила', coverage: 'Обхват', rules: 'Правила',
    trustEyebrow: 'Граница на публикуване', trustTitle: 'Защо този профил е публичен', trustA: 'Само публикувани записи', trustACopy: 'Профилът използва същите правила за публична видимост като /community директорията.', trustB: 'Предложенията остават вътрешни', trustBCopy: 'Общностните предложения остават частни, докато не бъдат конвертирани и публикувани.', trustC: 'Заключена граница', trustCCopy: 'Тази стъпка не отключва Registry, Certificate, Partners, Gallery или админ review потоци.',
  },
  it: {
    back: 'Torna alla community', visitWebsite: 'Apri il sito', email: 'Email', phone: 'Telefono', website: 'Sito web', notSet: 'Non ancora disponibile',
    featured: 'In evidenza', published: 'Pubblicata', identityEyebrow: 'Profilo pubblico ecosystem', identityTitle: 'Visibilità Cane Corso approvata',
    identityCopy: 'Questa pagina si apre solo per una scheda reale dell’ecosistema pubblicata dopo moderazione. Bozze, schede in revisione, approvate ma non pubblicate e suggerimenti interni non hanno una pagina detail pubblica.',
    detailsEyebrow: 'Informazioni utili', detailsTitle: 'Dettagli pratici', listingType: 'Layer', channel: 'Percorso pubblicazione', category: 'Categoria', location: 'Località',
    contactEyebrow: 'Contatto', contactTitle: 'Contatti e accesso', coverageEyebrow: 'Prima di andare', coverageTitle: 'Copertura e regole locali', coverage: 'Copertura', rules: 'Regole',
    trustEyebrow: 'Guardrail rilascio', trustTitle: 'Perché questo profilo è pubblico', trustA: 'Solo pubblicate', trustACopy: 'Il profilo usa le stesse regole di visibilità pubblica della directory /community.', trustB: 'Suggerimenti interni', trustBCopy: 'I suggerimenti community restano privati finché non vengono convertiti e pubblicati.', trustC: 'Confine bloccato', trustCCopy: 'La foundation non sblocca registry, certificate, partners, gallery o admin review flows.',
  },
} as const;


const categoryLabelsByLocale: Record<Locale, Record<string, string>> = {
  en: {
    walk_play_place: 'Walk and play place',
    walk_field: 'Walk field',
    transport_relocation: 'Transport and relocation',
    pet_friendly_place: 'Cane Corso friendly place',
    hotel_boarding: 'Hotel and boarding',
    event_idea: 'Event idea',
    veterinary_clinic: 'Veterinary clinic',
    boarding: 'Boarding',
    transport: 'Transport',
    training: 'Training',
    shop: 'Shop',
    other: 'Other',
  },
  bg: {
    walk_play_place: 'Място за разходка и игра',
    walk_field: 'Поле за разходка',
    transport_relocation: 'Транспорт и преместване',
    pet_friendly_place: 'Място, подходящо за Cane Corso',
    hotel_boarding: 'Хотел и престой',
    event_idea: 'Идея за събитие',
    veterinary_clinic: 'Ветеринарна клиника',
    boarding: 'Хотел / престой',
    transport: 'Транспорт',
    training: 'Обучение',
    shop: 'Магазин',
    other: 'Друго',
  },
  it: {
    walk_play_place: 'Area passeggio e gioco',
    walk_field: 'Area passeggio',
    transport_relocation: 'Trasporto e trasferimento',
    pet_friendly_place: 'Luogo adatto a Cane Corso',
    hotel_boarding: 'Hotel e boarding',
    event_idea: 'Idea evento',
    veterinary_clinic: 'Clinica veterinaria',
    boarding: 'Hotel / boarding',
    transport: 'Trasporto',
    training: 'Addestramento',
    shop: 'Negozio',
    other: 'Altro',
  },
};

function locationFor(item: EcosystemListing, fallback: string) {
  const parts = [item.city, item.country].filter(Boolean);
  return parts.length ? parts.join(', ') : fallback;
}

function categoryFor(item: EcosystemListing, locale: Locale, fallback: string) {
  if (!item.category) {
    return fallback;
  }

  const labels = categoryLabelsByLocale[locale] ?? categoryLabelsByLocale.en;
  return labels[item.category] ?? item.category.replace(/[_-]+/g, ' ');
}

function getMapLabels(locale: Locale) {
  if (locale === 'bg') {
    return {
      title: 'Карта на мястото',
      empty: 'Това място още няма координати от Google Maps.',
      manualMode: 'Google Maps ключът не е настроен. Използвай адреса и детайлите от профила.',
      openDetail: 'Детайли',
      openMaps: 'Отвори в Google Maps',
    };
  }

  if (locale === 'it') {
    return {
      title: 'Mappa del luogo',
      empty: 'Questo luogo non ha ancora coordinate Google Maps.',
      manualMode: 'La chiave Google Maps non è configurata. Usa indirizzo e dettagli della scheda.',
      openDetail: 'Dettagli',
      openMaps: 'Apri in Google Maps',
    };
  }

  return {
    title: 'Place map',
    empty: 'This place does not have Google Maps coordinates yet.',
    manualMode: 'Google Maps key is not configured. Use the address and listing details.',
    openDetail: 'Details',
    openMaps: 'Open in Google Maps',
  };
}

export function EcosystemProfileDetail({ document, locale }: EcosystemProfileDetailProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const listing = document.listing;
  const mapLabels = getMapLabels(locale);
  const typeLabels = getEcosystemListingTypeLabels(locale);
  const channelLabels = getEcosystemSubmissionChannelLabels(locale);
  const tone = getEcosystemSubmissionChannelTone(listing.submissionChannel);
  const description = listing.longDescription || listing.shortDescription || copy.notSet;

  return (
    <div className="member-route-stack">
      <section className="route-hero-card route-hero-card--member ecosystem-profile-hero">
        <div>
          <div className="ecosystem-owner-item__title-row">
            <span className={`submission-channel-chip submission-channel-chip--${tone}`}>{channelLabels[listing.submissionChannel]}</span>
            <span className="eyebrow-label">{typeLabels[listing.listingType]}</span>
          </div>
          <h1 className="route-title">{listing.title}</h1>
          <p className="route-copy">{listing.shortDescription || description}</p>
          <div className="route-hero-pills route-hero-pills--member">
            <span className="route-pill route-pill--glow">{copy.published}</span>
            <span className="route-pill subtle">{locationFor(listing, copy.notSet)}</span>
            {listing.isFeatured ? <span className="route-pill">{copy.featured}</span> : null}
          </div>
        </div>
        <div className="route-hero-actions ecosystem-profile-hero__actions">
          {listing.websiteUrl ? <a href={listing.websiteUrl} target="_blank" rel="noreferrer" className="button-primary" aria-label={`${copy.visitWebsite}: ${listing.title}`}>{copy.visitWebsite}</a> : null}
          <Link href="/community" className="button-secondary" aria-label={`${copy.back}: /community`}>{copy.back}</Link>
        </div>
      </section>

      <div className="content-grid two-columns-wide-right ecosystem-profile-grid">
        <div className="stack-blocks">
          <section className="content-card ecosystem-profile-section">
            <span className="eyebrow-label">{copy.identityEyebrow}</span>
            <h2>{copy.identityTitle}</h2>
            <p className="ecosystem-profile-section__copy">{copy.identityCopy}</p>
          </section>

          <section className="content-card ecosystem-profile-section">
            <span className="eyebrow-label">{copy.detailsEyebrow}</span>
            <h2>{copy.detailsTitle}</h2>
            <p className="ecosystem-profile-section__copy">{description}</p>
            <dl className="ecosystem-profile-meta-list">
              <div><dt>{copy.listingType}</dt><dd>{typeLabels[listing.listingType]}</dd></div>
              <div><dt>{copy.channel}</dt><dd>{channelLabels[listing.submissionChannel]}</dd></div>
              <div><dt>{copy.category}</dt><dd>{categoryFor(listing, locale, copy.notSet)}</dd></div>
              <div><dt>{copy.location}</dt><dd>{locationFor(listing, copy.notSet)}</dd></div>
            </dl>
          </section>

          <section className="content-card ecosystem-trust-card">
            <span className="eyebrow-label">{copy.trustEyebrow}</span>
            <h2>{copy.trustTitle}</h2>
            <div className="partner-trust-card__grid">
              <article className="partner-trust-card__item"><span>{copy.trustA}</span><p>{copy.trustACopy}</p></article>
              <article className="partner-trust-card__item"><span>{copy.trustB}</span><p>{copy.trustBCopy}</p></article>
              <article className="partner-trust-card__item"><span>{copy.trustC}</span><p>{copy.trustCCopy}</p></article>
            </div>
          </section>
        </div>

        <aside className="stack-blocks">
          <section className="content-card ecosystem-profile-section ecosystem-profile-map-section">
            <span className="eyebrow-label">Google Maps</span>
            <h2>{mapLabels.title}</h2>
            <FriendlyPlacesMap
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? null}
              places={[{
                id: listing.id,
                title: listing.title,
                slug: listing.slug,
                address: listing.googleFormattedAddress || locationFor(listing, copy.notSet),
                latitude: listing.latitude,
                longitude: listing.longitude,
                mapsUrl: listing.googleMapsUrl,
              }]}
              labels={mapLabels}
              className="friendly-places-map--detail"
            />
            {listing.googleMapsUrl ? <a className="button-secondary small" href={listing.googleMapsUrl} target="_blank" rel="noreferrer">{mapLabels.openMaps}</a> : null}
          </section>

          <section className="content-card ecosystem-profile-section">
            <span className="eyebrow-label">{copy.contactEyebrow}</span>
            <h2>{copy.contactTitle}</h2>
            <dl className="partner-contact-list">
              <div><dt>{copy.email}</dt><dd>{listing.email ? <a href={`mailto:${listing.email}`}>{listing.email}</a> : copy.notSet}</dd></div>
              <div><dt>{copy.phone}</dt><dd>{listing.phone || copy.notSet}</dd></div>
              <div><dt>{copy.website}</dt><dd>{listing.websiteUrl ? <a href={listing.websiteUrl} target="_blank" rel="noreferrer">{listing.websiteUrl}</a> : copy.notSet}</dd></div>
            </dl>
          </section>

          <section className="content-card ecosystem-profile-section">
            <span className="eyebrow-label">{copy.coverageEyebrow}</span>
            <h2>{copy.coverageTitle}</h2>
            <dl className="partner-contact-list">
              <div><dt>{copy.coverage}</dt><dd>{listing.coverageNote || copy.notSet}</dd></div>
              <div><dt>{copy.rules}</dt><dd>{listing.rulesNote || copy.notSet}</dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
