import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface CommunityDiscoveryExperienceProps {
  locale: Locale;
  publishedCount: number;
  countryCount: number;
  featuredCount: number;
}

const copyByLocale = {
  en: {
    eyebrow: 'Global ecosystem discovery',
    title: 'Find the right Cane Corso path before you open a listing',
    intro:
      'Community is the discovery layer: useful public routes, owner suggestions, partner services, places, events, transport, new home paths, and editorial activity. It stays clearly outside the official Registry and Certificate authority.',
    stats: ['Published after review', 'Countries represented', 'Featured by admin'],
    submit: 'Submit through member workspace',
    guide: 'Read community rules',
    lanes: [
      ['Adoption / New Home', 'A calm, moderated path when a Cane Corso needs a safer and better environment.'],
      ['Lost & Found', 'A future public signal layer for urgent community help without replacing admin verification.'],
      ['Events & Training', 'Training fields, events, workshops, and breed-specific educational opportunities.'],
      ['Transport & Relocation', 'Local and cross-border Cane Corso transport with clear service context and review.'],
      ['Boarding & Large-breed stays', 'Hotels and boarding options suitable for strong large-breed handling.'],
      ['Pet-friendly places', 'Restaurants, shops, parks, and public places that can safely welcome Cane Corso.'],
      ['Puppies / Breeding / Match', 'Future moderated discovery for breeding and match paths without mixing with certificates.'],
      ['Partner services', 'Approved services and operators connected to the public partner directory.'],
    ],
    boundaries: [
      'Registry remains the official public Cane Corso profile layer.',
      'USG Certificate remains a separate admin-issued trust decision.',
      'Community popularity and submissions never override official authority.',
    ],
  },
  bg: {
    eyebrow: 'Допълнителна ориентация',
    title: 'Как са разделени нуждите в общността',
    intro:
      'Този блок е само ориентация. Основните действия са по-горе: търсене на дом, разплод, спешен сигнал, подходящи места и услуги. Общността остава отделена от официалния регистър, проверката и сертификатните решения.',
    stats: ['Публикувани след преглед', 'Държави в каталога', 'Отличени от админ'],
    submit: 'Изпрати заявка',
    guide: 'Виж правилата',
    lanes: [
      ['Осиновяване / Нов дом', 'Спокоен модериран път, когато Cane Corso има нужда от по-сигурна и по-добра среда.'],
      ['Загубени / намерени', 'Спешен общностен сигнал, който остава видим само след админ преглед.'],
      ['Събития и обучение', 'Тренировъчни терени, събития, работилници и породоспецифично обучение.'],
      ['Транспорт и преместване', 'Локален и международен Cane Corso транспорт с ясен контекст и преглед.'],
      ['Хотели и престой за едри породи', 'Опции за престой, подходящи за сигурна работа с едри и силни породи.'],
      ['Места, подходящи за Cane Corso', 'Ресторанти, магазини, паркове и обществени места, които могат безопасно да приемат Cane Corso.'],
      ['Малки Cane Corso / разплод / подбор', 'Модериран общностен път за малки, развъждане и подбор, без смесване със сертификати.'],
      ['Партньорски услуги', 'Одобрени услуги и оператори, свързани с публичния партньорски каталог.'],
    ],
    boundaries: [
      'Регистърът остава официалният публичен слой за Cane Corso профили.',
      'USG сертификатът остава отделно админ решение за доверие.',
      'Популярността и предложенията от общността никога не заменят официалните решения.',
    ],
  },
  it: {
    eyebrow: 'Discovery globale ecosystem',
    title: 'Trova il percorso Cane Corso giusto prima di aprire una scheda',
    intro:
      'La community è il layer discovery: percorsi pubblici utili, suggerimenti owner, servizi partner, luoghi, eventi, trasporto, new home e attività editoriale. Resta separata dal Registro ufficiale e dalla certificate authority.',
    stats: ['Pubblicati dopo revisione', 'Paesi presenti', 'Featured da admin'],
    submit: 'Invia dal workspace membro',
    guide: 'Leggi le regole community',
    lanes: [
      ['Adozione / New Home', 'Un percorso moderato quando un Cane Corso ha bisogno di un ambiente più sicuro.'],
      ['Lost & Found', 'Futuro layer di segnale pubblico per aiuto urgente senza sostituire la verifica admin.'],
      ['Eventi e training', 'Campi training, eventi, workshop e opportunità educative specifiche per la razza.'],
      ['Trasporto e relocation', 'Trasporto locale e cross-border Cane Corso con contesto servizio e review.'],
      ['Boarding e soggiorni large-breed', 'Opzioni di boarding adatte alla gestione sicura di razze grandi e forti.'],
      ['Luoghi pet-friendly', 'Ristoranti, negozi, parchi e luoghi pubblici adatti al Cane Corso.'],
      ['Puppies / breeding / match', 'Futuro discovery moderato per breeding e match senza confondere i certificati.'],
      ['Servizi partner', 'Servizi approvati collegati alla directory partner pubblica.'],
    ],
    boundaries: [
      'Il Registro resta il layer pubblico ufficiale dei profili Cane Corso.',
      'Il certificato USG resta una decisione trust separata emessa da admin.',
      'Popolarità community e submission non sostituiscono mai l’autorità ufficiale.',
    ],
  },
} as const;

export function CommunityDiscoveryExperience({ locale, publishedCount, countryCount, featuredCount }: CommunityDiscoveryExperienceProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const stats = [publishedCount, countryCount, featuredCount];

  return (
    <section className="content-card community-discovery-experience" aria-label={copy.title}>
      <div className="community-discovery-experience__hero">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.intro}</p>
          <div className="community-discovery-experience__actions">
            <Link href="/ecosystem" className="button-primary small">{copy.submit}</Link>
            <Link href="/guide?topic=community#community" className="button-secondary small">{copy.guide}</Link>
          </div>
        </div>
        <div className="community-discovery-experience__stats">
          {copy.stats.map((label, index) => (
            <span key={label}>
              <strong>{stats[index]}</strong>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="community-discovery-lane-grid">
        {copy.lanes.map(([title, description]) => (
          <article className="community-discovery-lane" key={title}>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <div className="community-discovery-boundary">
        {copy.boundaries.map((item) => <span key={item}>{item}</span>)}
      </div>
    </section>
  );
}
