import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface PartnersServicesExperienceProps {
  locale: Locale;
  totalVisible: number;
  totalApproved: number;
  featuredTotal: number;
}

const copyByLocale = {
  en: {
    eyebrow: 'Partner services experience',
    title: 'A useful directory for real Cane Corso decisions',
    intro:
      'Partners are the service layer of the ecosystem: veterinary care, training, transport, relocation, boarding, photography, shops, and other operators that help owners make better decisions.',
    apply: 'Apply as partner',
    community: 'Open community ecosystem',
    stats: ['Visible profiles', 'Approved profiles', 'Featured profiles'],
    groups: [
      ['Health and care', 'Clinics, specialists, grooming, nutrition support, and owner guidance.'],
      ['Training and handling', 'Trainers, handlers, fields, events, and working-dog support.'],
      ['Transport and relocation', 'Local, international, and cross-border Cane Corso movement support.'],
      ['Hotels and boarding', 'Boarding options suitable for large-breed structure, safety, and temperament.'],
      ['Shops and services', 'Useful suppliers, photographers, equipment, and breed-focused services.'],
    ],
    note: 'Partner approval is an admin decision. Community ratings can highlight popularity but do not replace approval.',
  },
  bg: {
    eyebrow: 'Партньорски услуги',
    title: 'Полезен каталог за реални Cane Corso решения',
    intro:
      'Партньорите са сервизният слой на екосистемата: ветеринарна грижа, обучение, транспорт, международно преместване, престой, фотография, магазини и други оператори, които помагат на собствениците.',
    apply: 'Кандидатствай като партньор',
    community: 'Отвори екосистемата',
    stats: ['Видими профили', 'Одобрени профили', 'Отличени профили'],
    groups: [
      ['Здраве и грижа', 'Клиники, специалисти, груминг, хранене и практически насоки за собственици.'],
      ['Обучение и handling', 'Треньори, хендлъри, терени, събития и подкрепа за working-dog контекст.'],
      ['Транспорт и relocation', 'Локален, международен и cross-border Cane Corso транспорт.'],
      ['Хотели и престой', 'Престой, подходящ за структурата, сигурността и характера на едра порода.'],
      ['Магазини и услуги', 'Доставчици, фотографи, оборудване и услуги, фокусирани върху породата.'],
    ],
    note: 'Одобрението на партньор е админ решение. Общностните оценки могат да показват популярност, но не заменят одобрението.',
  },
  it: {
    eyebrow: 'Esperienza servizi partner',
    title: 'Una directory utile per decisioni Cane Corso reali',
    intro:
      'I partner sono il layer servizi dell’ecosistema: veterinaria, training, trasporto, relocation, boarding, fotografia, shop e operatori utili ai proprietari.',
    apply: 'Candidati come partner',
    community: 'Apri ecosystem community',
    stats: ['Profili visibili', 'Profili approvati', 'Profili featured'],
    groups: [
      ['Salute e cura', 'Cliniche, specialisti, grooming, nutrizione e guida pratica owner.'],
      ['Training e handling', 'Trainer, handler, campi, eventi e supporto working-dog.'],
      ['Trasporto e relocation', 'Supporto locale, internazionale e cross-border per Cane Corso.'],
      ['Hotel e boarding', 'Boarding adatto alla struttura, sicurezza e temperamento di razze grandi.'],
      ['Shop e servizi', 'Fornitori, fotografi, attrezzatura e servizi focalizzati sulla razza.'],
    ],
    note: 'L’approvazione partner è una decisione admin. I rating community possono mostrare popolarità ma non sostituiscono l’approvazione.',
  },
} as const;

export function PartnersServicesExperience({ locale, totalVisible, totalApproved, featuredTotal }: PartnersServicesExperienceProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const stats = [totalVisible, totalApproved, featuredTotal];

  return (
    <section className="content-card partners-services-experience" aria-label={copy.title}>
      <div className="partners-services-experience__hero">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.intro}</p>
          <div className="partners-services-experience__actions">
            <Link href="/partners/apply" className="button-primary small">{copy.apply}</Link>
            <Link href="/community" className="button-secondary small">{copy.community}</Link>
          </div>
        </div>
        <div className="partners-services-experience__stats">
          {copy.stats.map((label, index) => (
            <span key={label}>
              <strong>{stats[index]}</strong>
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="partners-services-group-grid">
        {copy.groups.map(([title, description]) => (
          <article className="partners-services-group" key={title}>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <p className="partners-services-experience__note">{copy.note}</p>
    </section>
  );
}
