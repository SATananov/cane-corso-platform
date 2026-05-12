
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

type RegistryCertificateReleaseFlowVariant = 'public' | 'admin';

interface RegistryCertificateReleaseFlowPanelProps {
  locale: Locale;
  variant: RegistryCertificateReleaseFlowVariant;
  publishedCount: number;
  certifiedCount: number;
  queueCount?: number;
}

const copyByLocale = {
  en: {
    eyebrow: 'Registry publication path',
    title: 'Publication, certificate trust, and Verify stay intentionally separate',
    description:
      'A published Registry profile proves public presence. A USG certificate is a second USG review decision. Verify is the public confirmation path for active certificate records only.',
    stats: {
      published: 'Published Registry profiles',
      certified: 'Active certificate records',
      queue: 'Profiles still in moderation',
    },
    steps: [
      ['Registry publish', 'The approved Cane Corso profile becomes publicly visible with its own Registry route.'],
      ['Certificate issue', 'USG may issue a certificate only after the public profile is ready.'],
      ['Verify trust', 'Visitors can confirm the active certificate from the Verify route or certificate code.'],
    ],
    actions: {
      registry: 'Open Registry',
      verify: 'Open Verify',
      admin: 'Open USG review',
    },
  },
  bg: {
    eyebrow: 'Registry publication path',
    title: 'Публикация, сертификатно доверие и проверка остават умишлено разделени',
    description:
      'Публикуваният профил в Регистъра доказва публично присъствие. USG сертификатът е второ USG решение за преглед. Проверката е публичният път за потвърждение само на активни сертификатни записи.',
    stats: {
      published: 'Публикувани профили в Регистъра',
      certified: 'Активни сертификатни записи',
      queue: 'Профили още в модерация',
    },
    steps: [
      ['Публикация в Регистъра', 'Одобреният Cane Corso профил става публично видим със собствена страница в Регистъра.'],
      ['Издаване на сертификат', 'USG може да издаде сертификат само след като публичният профил е готов.'],
      ['Проверка на доверието', 'Посетителите потвърждават активния сертификат през страницата за проверка или чрез сертификатен код.'],
    ],
    actions: {
      registry: 'Отвори Регистъра',
      verify: 'Отвори проверката',
      admin: 'Отвори USG преглед',
    },
  },
  it: {
    eyebrow: 'Percorso di pubblicazione nel Registro',
    title: 'Pubblicazione, fiducia del certificato e verifica restano intenzionalmente separate',
    description:
      'Un profilo pubblicato nel Registro dimostra presenza pubblica. Il certificato USG è una seconda decisione della revisione USG. La verifica conferma solo record certificati attivi.',
    stats: {
      published: 'Profili pubblicati nel Registro',
      certified: 'Record certificati attivi',
      queue: 'Profili ancora in moderazione',
    },
    steps: [
      ['Pubblicazione nel Registro', 'Il profilo Cane Corso approvato diventa pubblico con la propria pagina nel Registro.'],
      ['Emissione del certificato', 'USG può emettere un certificato solo dopo che il profilo pubblico è pronto.'],
      ['Verifica della fiducia', 'I visitatori confermano il certificato attivo dalla pagina di verifica o dal codice del certificato.'],
    ],
    actions: {
      registry: 'Apri Registro',
      verify: 'Apri verifica',
      admin: 'Apri revisione USG',
    },
  },
} as const;

export function RegistryCertificateReleaseFlowPanel({ locale, variant, publishedCount, certifiedCount, queueCount = 0 }: RegistryCertificateReleaseFlowPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const isAdmin = variant === 'admin';

  return (
    <section className={`registry-certificate-release-flow registry-certificate-release-flow--${variant}`} aria-label={copy.title}>
      <div className="registry-certificate-release-flow__copy">
        <span className="eyebrow-label">{copy.eyebrow}</span>
        <h3>{copy.title}</h3>
        <p>{copy.description}</p>
      </div>

      <div className="registry-certificate-release-flow__stats" aria-label="Registry certificate release counters">
        <span><strong>{publishedCount}</strong>{copy.stats.published}</span>
        <span><strong>{certifiedCount}</strong>{copy.stats.certified}</span>
        {isAdmin ? <span><strong>{queueCount}</strong>{copy.stats.queue}</span> : null}
      </div>

      <div className="registry-certificate-release-flow__steps">
        {copy.steps.map(([title, description], index) => (
          <article key={title}>
            <span>{index + 1}</span>
            <strong>{title}</strong>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <div className="registry-certificate-release-flow__actions">
        <Link href="/registry" className="button-secondary small">{copy.actions.registry}</Link>
        <Link href="/verify" className="button-ghost small">{copy.actions.verify}</Link>
        {isAdmin ? <Link href="/review" className="button-primary small">{copy.actions.admin}</Link> : null}
      </div>
    </section>
  );
}
