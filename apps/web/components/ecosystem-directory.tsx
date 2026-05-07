import Link from 'next/link';
import { FriendlyPlacesMap } from '@/components/friendly-places-map';
import { OverviewStatCard } from '@/components/overview-stat-card';
import type { Locale } from '@/lib/i18n';
import type { EcosystemDirectoryDocument, EcosystemListing, EcosystemListingType } from '@cane-corso-platform/contracts';
import {
  getEcosystemListingTypeLabels,
  getEcosystemSubmissionChannelLabels,
  getEcosystemSubmissionChannelTone,
} from '@/lib/ecosystem-ui';

const moderatedIntentTypes = ['breeding_match', 'adoption_new_home', 'puppy_listing', 'lost_found'] as const satisfies readonly EcosystemListingType[];
const friendlyPlaceTypes = ['walk_play_place', 'pet_friendly_place'] as const satisfies readonly EcosystemListingType[];
const serviceTypes = ['partner_service', 'transport_relocation', 'hotel_boarding'] as const satisfies readonly EcosystemListingType[];

type IntentCardCopy = {
  eyebrow: string;
  title: string;
  description: string;
  meta: string;
  href: string;
  types: readonly EcosystemListingType[];
  urgent?: boolean;
};

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
      intentEyebrow: 'Cane Corso needs',
      intentTitle: 'Cane Corso is looking for:',
      intentIntro:
        'A clear community hub for owners who are searching, offering help, or reporting an urgent case. Public visibility stays moderated and contact is controlled by the administrator.',
      intentCount: 'published',
      intentAdminBridge: 'Admin-mediated connection',
      intentAdminBridgeCopy:
        'For breeding, puppies, adoption, and lost/found cases, public contact details stay protected. Members submit interest and the administrator decides whether to connect the parties.',
      intentListingsEyebrow: 'Current community needs',
      intentListingsTitle: 'Approved Cane Corso searches and signals',
      intentListingsIntro:
        'These are the visible records from the sensitive community layers. They appear only after review and do not expose private contact data.',
      intentListingsEmpty: 'No approved Cane Corso searches or urgent signals yet.',
      adminConnection: 'Connection through admin',
      adminConnectionShort: 'Protected by admin review',
      offerHelp: 'I have an offer',
      placesEyebrow: 'Cane Corso-friendly places',
      placesTitle: 'Approved places for daily Cane Corso life',
      placesIntro:
        'Parks, walk zones, training fields, shops, cafés, hotels, clinics, and services that have passed review before public display.',
      placesEmpty: 'No approved places yet. Members can submit places from the owner workspace.',
      suitability: 'Large-breed suitability',
      mapTitle: 'Cane Corso-friendly map',
      mapEmpty: 'Approved places with coordinates will appear on the map after admin publication.',
      mapManualMode: 'Google Maps key is not configured. Approved places remain available in the list.',
      openMaps: 'Open in Google Maps',
      intentCards: [
        {
          eyebrow: 'Breeding match',
          title: 'Looking for a breeding partner',
          description: 'Female looking for male or male looking for female, with visibility only after administrator review.',
          meta: 'female ⇄ male • admin review',
          href: '#cane-corso-intent-listings',
          types: ['breeding_match'],
        },
        {
          eyebrow: 'New home',
          title: 'Cane Corso looking for a home',
          description: 'Adoption and responsible new-home requests handled with care, privacy, and moderation.',
          meta: 'adoption • new home • privacy',
          href: '#cane-corso-intent-listings',
          types: ['adoption_new_home'],
        },
        {
          eyebrow: 'Puppies',
          title: 'Cane Corso puppies',
          description: 'Puppy visibility and litter-related records stay reviewed before becoming public.',
          meta: 'puppies • responsible visibility',
          href: '#cane-corso-intent-listings',
          types: ['puppy_listing'],
        },
        {
          eyebrow: 'Urgent community signal',
          title: 'Lost / found Cane Corso',
          description: 'Highly visible urgent signals for lost or found Cane Corso cases, still protected by admin review.',
          meta: 'urgent • city • last seen',
          href: '#cane-corso-intent-listings',
          types: ['lost_found'],
          urgent: true,
        },
        {
          eyebrow: 'Places',
          title: 'Cane Corso-friendly places',
          description: 'Approved places for walking, play, training, hotels, shops, cafés, and everyday life with a large breed.',
          meta: 'places • rules • map/list',
          href: '#cane-corso-friendly-places',
          types: friendlyPlaceTypes,
        },
        {
          eyebrow: 'Services',
          title: 'Services and partners',
          description: 'Transport, boarding, training, veterinary care, shops, and approved operators for Cane Corso owners.',
          meta: 'services • transport • boarding',
          href: '#ecosystem-directory',
          types: serviceTypes,
        },
      ] satisfies readonly IntentCardCopy[],
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
      eyebrow: 'Услуги и партньори',
      title: 'Одобрени услуги и партньори',
      intro: 'Публичен каталог за проверени услуги, партньори и полезни предложения, които минават през преглед.',
      emptyTitle: 'Директорията все още е празна',
      emptyDescription:
        'Това е публичният слой за официални услуги, одобрени места, полезни обекти и бъдеща общностна видимост.',
      apply: 'Изпрати заявка',
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
      joinHeadline: 'Официалните партньори и общностните предложения са разделени',
      joinCopy:
        'Официалните записи са проверени услуги и партньори. Общностните записи са места и предложения от членовете. Нищо не става публично без преглед и одобрение.',
      intentEyebrow: 'Нужди на общността',
      intentTitle: 'Cane Corso търси:',
      intentIntro:
        'Първо избери реалната нужда: дом, партньор, малки, спешен сигнал, подходящо място или услуга. Публичната видимост остава модерирана, а връзката между хората се контролира от администратор.',
      intentCount: 'публикувани',
      intentAdminBridge: 'Връзка чрез админ',
      intentAdminBridgeCopy:
        'При разплод, малки, осиновяване и загубени/намерени случаи публичните контакти са защитени. Членовете подават интерес, а администраторът решава дали да свърже страните.',
      intentListingsEyebrow: 'Текущи нужди от общността',
      intentListingsTitle: 'Активни търсения и сигнали',
      intentListingsIntro:
        'Това са видимите записи от чувствителните общностни слоеве. Показват се само след преглед и не излагат лични контакти публично.',
      intentListingsEmpty: 'Все още няма одобрени Cane Corso търсения или спешни сигнали.',
      adminConnection: 'Връзка чрез администратор',
      adminConnectionShort: 'Защитено чрез админ преглед',
      offerHelp: 'Предложи помощ',
      placesEyebrow: 'Подходящи места',
      placesTitle: 'Места, подходящи за Cane Corso',
      placesIntro:
        'Паркове, зони за разходка, тренировъчни полета, магазини, заведения, хотели, клиники и услуги, които са прегледани преди публично показване.',
      placesEmpty: 'Все още няма одобрени места. Членовете могат да изпращат места от личната си зона.',
      suitability: 'Подходящост за едри породи',
      mapTitle: 'Карта с места, подходящи за Cane Corso',
      mapEmpty: 'Одобрените места с координати ще се появят на картата след админ публикация.',
      mapManualMode: 'Google Maps ключът не е настроен. Одобрените места остават достъпни като списък.',
      openMaps: 'Отвори в Google Maps',
      intentCards: [
        {
          eyebrow: 'Спешен сигнал',
          title: 'Загубен / намерен Cane Corso',
          description: 'Спешен сигнал за загубен или намерен Cane Corso, видим само след админ преглед.',
          meta: 'спешно • град • последно видян',
          href: '#cane-corso-intent-listings',
          types: ['lost_found'],
          urgent: true,
        },
        {
          eyebrow: 'Нов дом',
          title: 'Cane Corso търси дом',
          description: 'Осиновяване и отговорен нов дом с внимание, защита на личните данни и модерация.',
          meta: 'осиновяване • нов дом • поверителност',
          href: '#cane-corso-intent-listings',
          types: ['adoption_new_home'],
        },
        {
          eyebrow: 'Разплод',
          title: 'Търси партньор за разплод',
          description: 'Женско търси мъжко или мъжко търси женско, с видимост само след админ преглед.',
          meta: 'женско ⇄ мъжко • админ преглед',
          href: '#cane-corso-intent-listings',
          types: ['breeding_match'],
        },
        {
          eyebrow: 'Малки',
          title: 'Малки Cane Corso',
          description: 'Поколения и записи за малки Cane Corso, видими публично само след преглед.',
          meta: 'малки • отговорна видимост',
          href: '#cane-corso-intent-listings',
          types: ['puppy_listing'],
        },
        {
          eyebrow: 'Места',
          title: 'Места, подходящи за Cane Corso',
          description: 'Одобрени места за разходка, игра, тренировки, хотели, магазини, заведения и ежедневие с едра порода.',
          meta: 'места • правила • карта/списък',
          href: '#cane-corso-friendly-places',
          types: friendlyPlaceTypes,
        },
        {
          eyebrow: 'Услуги',
          title: 'Услуги и партньори',
          description: 'Транспорт, престой, обучение, ветеринарна грижа, магазини и одобрени оператори за Cane Corso собственици.',
          meta: 'услуги • транспорт • престой',
          href: '#ecosystem-directory',
          types: serviceTypes,
        },
      ] satisfies readonly IntentCardCopy[],
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
      intro: 'Una directory pubblica curata per servizi ufficiali, luoghi community approvati e futura visibilità ecosystem.',
      emptyTitle: 'La directory dell’ecosistema è ancora vuota',
      emptyDescription:
        'Questo è il layer pubblico per servizi ufficiali, luoghi community approvati e futura visibilità ecosystem.',
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
      joinHeadline: 'Un solo motore di pubblicazione per visibilità ufficiale e community',
      joinCopy:
        'Le schede ufficiali rappresentano operatori reali. Le schede community rappresentano luoghi utili scoperti dai membri. I suggerimenti restano interni finché non vengono convertiti.',
      intentEyebrow: 'Bisogni della community',
      intentTitle: 'Cane Corso cerca:',
      intentIntro:
        'Un hub chiaro per proprietari che cercano, offrono aiuto o segnalano un caso urgente. La visibilità pubblica resta moderata e il contatto è controllato dall’amministratore.',
      intentCount: 'pubblicate',
      intentAdminBridge: 'Collegamento tramite admin',
      intentAdminBridgeCopy:
        'Per riproduzione, cuccioli, adozione e smarriti/trovati, i contatti pubblici restano protetti. I membri inviano interesse e l’admin decide se collegare le parti.',
      intentListingsEyebrow: 'Bisogni attuali della community',
      intentListingsTitle: 'Ricerche e segnali Cane Corso approvati',
      intentListingsIntro:
        'Queste sono le schede visibili dei layer sensibili. Appaiono solo dopo revisione e non espongono contatti privati.',
      intentListingsEmpty: 'Non ci sono ancora ricerche o segnali urgenti approvati.',
      adminConnection: 'Collegamento tramite amministratore',
      adminConnectionShort: 'Protetto da revisione admin',
      offerHelp: 'Ho una proposta',
      placesEyebrow: 'Luoghi Cane Corso-friendly',
      placesTitle: 'Luoghi approvati per la vita quotidiana con Cane Corso',
      placesIntro:
        'Parchi, aree passeggio, campi training, negozi, locali, hotel, cliniche e servizi valutati prima della visibilità pubblica.',
      placesEmpty: 'Non ci sono ancora luoghi approvati. I membri possono inviarli dall’area proprietario.',
      suitability: 'Idoneità per razze grandi',
      mapTitle: 'Mappa luoghi Cane Corso-friendly',
      mapEmpty: 'I luoghi approvati con coordinate appariranno sulla mappa dopo la pubblicazione admin.',
      mapManualMode: 'La chiave Google Maps non è configurata. I luoghi approvati restano disponibili in elenco.',
      openMaps: 'Apri in Google Maps',
      intentCards: [
        {
          eyebrow: 'Riproduzione',
          title: 'Cerca partner di riproduzione',
          description: 'Femmina cerca maschio o maschio cerca femmina, con visibilità solo dopo revisione admin.',
          meta: 'femmina ⇄ maschio • revisione admin',
          href: '#cane-corso-intent-listings',
          types: ['breeding_match'],
        },
        {
          eyebrow: 'Nuova casa',
          title: 'Cane Corso cerca casa',
          description: 'Adozione e nuova casa responsabile con cura, privacy e moderazione.',
          meta: 'adozione • nuova casa • privacy',
          href: '#cane-corso-intent-listings',
          types: ['adoption_new_home'],
        },
        {
          eyebrow: 'Cuccioli',
          title: 'Cuccioli Cane Corso',
          description: 'Cucciolate e schede cuccioli visibili pubblicamente solo dopo revisione.',
          meta: 'cuccioli • visibilità responsabile',
          href: '#cane-corso-intent-listings',
          types: ['puppy_listing'],
        },
        {
          eyebrow: 'Segnale urgente',
          title: 'Cane Corso smarriti / trovati',
          description: 'Segnali urgenti ad alta visibilità per Cane Corso smarriti o trovati, sempre protetti dalla revisione admin.',
          meta: 'urgente • città • ultimo avvistamento',
          href: '#cane-corso-intent-listings',
          types: ['lost_found'],
          urgent: true,
        },
        {
          eyebrow: 'Luoghi',
          title: 'Luoghi Cane Corso-friendly',
          description: 'Luoghi approvati per passeggiate, gioco, training, hotel, negozi, locali e vita quotidiana con razze grandi.',
          meta: 'luoghi • regole • mappa/elenco',
          href: '#cane-corso-friendly-places',
          types: friendlyPlaceTypes,
        },
        {
          eyebrow: 'Servizi',
          title: 'Servizi e partner',
          description: 'Trasporto, boarding, training, veterinari, negozi e operatori approvati per proprietari Cane Corso.',
          meta: 'servizi • trasporto • boarding',
          href: '#ecosystem-directory',
          types: serviceTypes,
        },
      ] satisfies readonly IntentCardCopy[],
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
    female_seeks_male: 'Female seeks male',
    male_seeks_female: 'Male seeks female',
    looking_for_home: 'Looking for home',
    found_dog: 'Found Cane Corso',
    lost_dog: 'Lost Cane Corso',
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
    female_seeks_male: 'Женско търси мъжко',
    male_seeks_female: 'Мъжко търси женско',
    looking_for_home: 'Търси дом',
    found_dog: 'Намерен Cane Corso',
    lost_dog: 'Загубен Cane Corso',
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
    female_seeks_male: 'Femmina cerca maschio',
    male_seeks_female: 'Maschio cerca femmina',
    looking_for_home: 'Cerca casa',
    found_dog: 'Cane Corso trovato',
    lost_dog: 'Cane Corso smarrito',
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

function includesListingType(types: readonly EcosystemListingType[], listingType: EcosystemListingType) {
  return types.includes(listingType);
}

function isFriendlyPlace(item: EcosystemListing) {
  return includesListingType(friendlyPlaceTypes, item.listingType);
}

function isModeratedIntentListing(item: EcosystemListing) {
  return includesListingType(moderatedIntentTypes, item.listingType);
}

function isAdminMediatedContactType(item: EcosystemListing) {
  return isModeratedIntentListing(item);
}

function countByTypes(items: readonly EcosystemListing[], types: readonly EcosystemListingType[]) {
  return items.filter((item) => includesListingType(types, item.listingType)).length;
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
  const moderatedIntentItems = document.items.filter(isModeratedIntentListing);
  const friendlyMapPlaces = friendlyPlaces.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    address: item.googleFormattedAddress || formatLocation(item, copy.labels.pending),
    latitude: item.latitude,
    longitude: item.longitude,
    mapsUrl: item.googleMapsUrl,
  }));

  return (
    <div className="member-route-stack">
      <section className="content-card community-intent-hub" id="cane-corso-intent-hub">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.labels.intentEyebrow}</span>
            <h2>{copy.labels.intentTitle}</h2>
            <p className="section-card__description">{copy.labels.intentIntro}</p>
          </div>
          <Link href={applyHref} className="button-primary small">
            {copy.labels.apply}
          </Link>
        </div>

        <div className="community-intent-grid">
          {copy.labels.intentCards.map((card) => {
            const count = countByTypes(document.items, card.types);

            return (
              <a
                className={`community-intent-card${card.urgent ? ' community-intent-card--urgent' : ''}`}
                href={card.href}
                key={card.title}
              >
                <span className="eyebrow-label">{card.eyebrow}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className="community-intent-card__meta">
                  <span>{card.meta}</span>
                  <strong>{count} {copy.labels.intentCount}</strong>
                </div>
              </a>
            );
          })}
        </div>

        <div className="community-admin-bridge-card">
          <span className="eyebrow-label">{copy.labels.intentAdminBridge}</span>
          <p>{copy.labels.intentAdminBridgeCopy}</p>
        </div>
      </section>

      <section className="content-card community-intent-listings" id="cane-corso-intent-listings">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.labels.intentListingsEyebrow}</span>
            <h2>{copy.labels.intentListingsTitle}</h2>
            <p className="section-card__description">{copy.labels.intentListingsIntro}</p>
          </div>
        </div>

        {moderatedIntentItems.length === 0 ? (
          <div className="empty-state-panel empty-state-panel--compact">
            <p className="empty-state-panel__description">{copy.labels.intentListingsEmpty}</p>
          </div>
        ) : (
          <div className="community-intent-listing-grid">
            {moderatedIntentItems.slice(0, 8).map((item) => (
              <article className="community-intent-listing-card" key={item.id}>
                {item.coverImageUrl ? (
                  <img src={item.coverImageUrl} alt="" className="community-intent-listing-card__image" />
                ) : null}
                <div className="ecosystem-owner-item__title-row">
                  <span className="eyebrow-label">{typeLabels[item.listingType]}</span>
                  <span className="submission-channel-chip submission-channel-chip--community">
                    {copy.labels.adminConnectionShort}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p>{localizeStandardText(item.shortDescription || item.longDescription, locale, copy.labels.pending)}</p>
                <dl>
                  <div><dt>{copy.labels.location}</dt><dd>{formatLocation(item, copy.labels.pending)}</dd></div>
                  <div><dt>{copy.labels.category}</dt><dd>{formatCategory(item.category, locale, copy.labels.pending)}</dd></div>
                  <div><dt>{copy.labels.contact}</dt><dd>{copy.labels.adminConnection}</dd></div>
                </dl>
                <div className="ecosystem-card__actions ecosystem-card__actions--friendly">
                  <Link className="button-primary small" href={getCommunityProfileHref(item.slug)}>
                    {copy.labels.openDetail}
                  </Link>
                  <Link className="button-secondary small" href={applyHref}>
                    {copy.labels.offerHelp}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="stats-grid five-up community-summary-stats">
        <OverviewStatCard label={copy.stats.total} value={String(document.summary.total)} tone="gold" />
        <OverviewStatCard label={copy.stats.official} value={String(document.summary.officialPublished)} tone="ivory" />
        <OverviewStatCard label={copy.stats.community} value={String(document.summary.communityPublished)} tone="gold" />
        <OverviewStatCard label={copy.stats.countries} value={String(document.summary.countries)} tone="ivory" />
        <OverviewStatCard label={copy.stats.featured} value={String(document.summary.featured)} tone="gold" />
      </div>

      <section className="content-card friendly-places-public-card" id="cane-corso-friendly-places">
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

        <FriendlyPlacesMap
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? null}
          places={friendlyMapPlaces}
          labels={{
            title: copy.labels.mapTitle,
            empty: copy.labels.mapEmpty,
            manualMode: copy.labels.mapManualMode,
            openDetail: copy.labels.openDetail,
            openMaps: copy.labels.openMaps,
          }}
        />

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
                <div className="ecosystem-card__actions ecosystem-card__actions--friendly">
                  <Link className="button-primary small" href={getCommunityProfileHref(item.slug)}>
                    {copy.labels.openDetail}
                  </Link>
                  {item.googleMapsUrl ? (
                    <a className="button-secondary small" href={item.googleMapsUrl} target="_blank" rel="noreferrer">
                      {copy.labels.openMaps}
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="content-card ecosystem-directory-card" id="ecosystem-directory">
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
              const contactValue = isAdminMediatedContactType(item)
                ? copy.labels.adminConnection
                : item.email || item.phone || copy.labels.pending;

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
                      <dd>{contactValue}</dd>
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
                    {item.websiteUrl && !isAdminMediatedContactType(item) ? (
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
