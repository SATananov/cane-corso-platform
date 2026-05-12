'use client';

import type { Locale } from '@/lib/i18n';

type ShowcaseTrustPanelProps = {
  variant?: 'gallery' | 'certified';
  locale?: Locale;
};

const copyByLocale = {
  en: {
    gallery: {
      eyebrow: 'Curated showcase trust',
      title: 'USG Gallery is a curated showcase layer',
      description:
        'Gallery shows carefully selected photos and public presentation. Owner uploads, Registry photos, and USG Gallery are separate—Gallery stays curated.',
      mark: 'USG Gallery',
      small: 'curated showcase',
      lanes: [
        {
          title: 'Curated selection',
          state: 'USG choice',
          description: 'Photos appear here only when selected for showcase, not automatically on owner upload.',
        },
        {
          title: 'Registry boundary',
          state: 'Separate layer',
          description: 'Registry profile proves public identity; Gallery presents the strongest visual presence.',
        },
        {
          title: 'Certificate boundary',
          state: 'Not a certificate',
          description: 'Gallery participation does not automatically mean USG Certificate. The certificate is a separate decision.',
        },
        {
          title: 'Public trust',
          state: 'Clear reading',
          description: 'Public visitors must understand why a particular Cane Corso is shown as a showcase selection.',
        },
      ],
    },
    certified: {
      eyebrow: 'Certified archive trust',
      title: 'Certified archive is an official trust layer',
      description:
        'Certified section presents Cane Corso profiles with official USG certificate logic. It must stay separate from community popularity and Gallery showcase.',
      mark: 'USG Certified',
      small: 'official archive',
      lanes: [
        {
          title: 'Certificate issued',
          state: 'Official decision',
          description: 'Certified presence means there is a separate USG review decision for USG certificate.',
        },
        {
          title: 'Verify continuity',
          state: 'Verifiable path',
          description: 'User must be able to connect Certified profile, Verify, and Certificate presentation.',
        },
        {
          title: 'Registry foundation',
          state: 'Public foundation',
          description: 'Registry remains the main public identity layer before Certified/Certificate reading.',
        },
        {
          title: 'Gallery boundary',
          state: 'Not automatic showcase',
          description: 'Certified status does not automatically mean Gallery selection—Gallery is a separate curated layer.',
        },
      ],
    },
  },
  bg: {
    gallery: {
      eyebrow: 'Кураторска витрина доверие',
      title: 'USG Галерия е кураторски слой за витрина',
      description:
        'Галерията показва внимателно избрани снимки и публично представяне. Качванията от собственика, снимките в Регистъра и USG Галерия са отделни — Галерията остава подбрано визуално представяне.',
      mark: 'USG Галерия',
      small: 'кураторска витрина',
      lanes: [
        {
          title: 'Кураторски избор',
          state: 'USG решение',
          description: 'Снимките се появяват тук само когато са избрани за витрина, не автоматично при качване.',
        },
        {
          title: 'Граница на Регистъра',
          state: 'Отделен слой',
          description: 'Профилът в Регистъра доказва публична идентичност; Галерията представя най-силното визуално присъствие.',
        },
        {
          title: 'Граница на сертификата',
          state: 'Не е сертификат',
          description: 'Участието в Галерия не означава автоматично USG сертификат. Сертификатът остава отделно решение.',
        },
        {
          title: 'Публично доверие',
          state: 'Ясно четене',
          description: 'Публичният потребител трябва да разбира защо конкретен Cane Corso е показан като витрина.',
        },
      ],
    },
    certified: {
      eyebrow: 'Архив на сертифицирани доверие',
      title: 'Архив на сертифицирани е официален слой доверие',
      description:
        'Секцията на сертифицирани представя Cane Corso профили с официална логика на USG сертификат. Тя трябва да остане отделна от популярност в общността и витрина на Галерия.',
      mark: 'USG Сертифицирани',
      small: 'официален архив',
      lanes: [
        {
          title: 'Издан сертификат',
          state: 'Официално решение',
          description: 'Сертифицирано присъствие означава, че има отделно USG решение за USG сертификат.',
        },
        {
          title: 'Проверяемост',
          state: 'Проверяем път',
          description: 'Потребителят трябва да може да свърже сертифицирания профил, проверката и представянето на сертификата.',
        },
        {
          title: 'Основа на Регистъра',
          state: 'Публична основа',
          description: 'Регистърът остава основната публична част за идентичност преди четене на сертифицирани профили или сертификат.',
        },
        {
          title: 'Граница на Галерия',
          state: 'Не е автоматична витрина',
          description: 'Сертифицираният статус не означава автоматично избор на Галерия — Галерията е отделен кураторски слой.',
        },
      ],
    },
  },
  it: {
    gallery: {
      eyebrow: 'Fiducia vetrina curata',
      title: 'USG Gallery è uno strato di vetrina curata',
      description:
        'La Galleria mostra foto selezionate con cura e presentazione pubblica. I caricamenti del proprietario, le foto nel Registro e la Galleria USG sono separati: la Galleria resta una selezione curata.',
      mark: 'USG Gallery',
      small: 'vetrina curata',
      lanes: [
        {
          title: 'Selezione curata',
          state: 'Scelta USG',
          description: 'Le foto appaiono qui solo quando selezionate per la vetrina, non automaticamente al caricamento.',
        },
        {
          title: 'Confine del Registro',
          state: 'Strato separato',
          description: 'Il profilo nel Registro dimostra l\'identità pubblica; la Galleria presenta la presenza visiva più forte.',
        },
        {
          title: 'Confine del certificato',
          state: 'Non è un certificato',
          description: 'La partecipazione in Gallery non significa automaticamente certificato USG. Il certificato è una decisione separata.',
        },
        {
          title: 'Fiducia pubblica',
          state: 'Lettura chiara',
          description: 'I visitatori pubblici devono capire perché un particolare Cane Corso è mostrato come selezione di vetrina.',
        },
      ],
    },
    certified: {
      eyebrow: 'Fiducia archivio certificato',
      title: 'L\'archivio certificato è uno strato di fiducia ufficiale',
      description:
        'La sezione certificato presenta i profili di Cane Corso con logica ufficiale del certificato USG. Deve rimanere separata dalla popolarità della comunità e dalla vetrina di Gallery.',
      mark: 'USG Certificati',
      small: 'archivio ufficiale',
      lanes: [
        {
          title: 'Certificato rilasciato',
          state: 'Decisione ufficiale',
          description: 'La presenza certificata significa che c\'è una decisione separata della revisione USG per il certificato USG.',
        },
        {
          title: 'Continuità di verifica',
          state: 'Percorso verificabile',
          description: 'L\'utente deve essere in grado di collegare il profilo certificato, la verifica e la presentazione del certificato.',
        },
        {
          title: 'Fondamento del Registro',
          state: 'Fondamento pubblico',
          description: 'Il Registro rimane la base pubblica dell’identità prima della lettura dei profili certificati o del certificato.',
        },
        {
          title: 'Confine della Gallery',
          state: 'Non vetrina automatica',
          description: 'Lo stato certificato non significa automaticamente selezione Gallery—Gallery è uno strato curato separato.',
        },
      ],
    },
  },
} as const;

export function GalleryCertifiedShowcaseTrustPanel({ variant = 'gallery', locale = 'en' }: ShowcaseTrustPanelProps) {
  const localizedCopy = copyByLocale[locale] ?? copyByLocale.en;
  const content = localizedCopy[variant];

  return (
    <section className={`gallery-certified-showcase-trust gallery-certified-showcase-trust--${variant}`} aria-label={content.title}>
      <div className="gallery-certified-showcase-trust__head">
        <div>
          <span className="eyebrow-label">{content.eyebrow}</span>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
        </div>
        <div className="gallery-certified-showcase-trust__mark">
          <span>USG</span>
          <strong>{content.mark}</strong>
          <small>{content.small}</small>
        </div>
      </div>

      <div className="gallery-certified-showcase-trust__grid">
        {content.lanes.map((lane) => (
          <article className="gallery-certified-showcase-trust__lane" key={lane.title}>
            <span>{lane.title}</span>
            <strong>{lane.state}</strong>
            <p>{lane.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
