
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
    eyebrow: 'Registry release flow',
    title: 'Publication, certificate trust, and Verify stay intentionally separate',
    description:
      'A published Registry profile proves public presence. A USG certificate is a second admin decision. Verify is the public confirmation path for active certificate records only.',
    stats: {
      published: 'Published Registry profiles',
      certified: 'Active certificate records',
      queue: 'Profiles still in moderation',
    },
    steps: [
      ['Registry publish', 'The approved Cane Corso profile becomes publicly visible with its own Registry route.'],
      ['Certificate issue', 'Admin may issue a USG certificate only after the public profile is ready.'],
      ['Verify trust', 'Visitors can confirm the active certificate from the Verify route or certificate code.'],
    ],
    actions: {
      registry: 'Open Registry',
      verify: 'Open Verify',
      admin: 'Open admin review',
    },
  },
  bg: {
    eyebrow: 'Registry release flow',
    title: 'Публикация, сертификатно доверие и Verify остават умишлено разделени',
    description:
      'Публикуваният Registry профил доказва публично присъствие. USG сертификатът е второ admin решение. Verify е публичният път за потвърждение само на активни сертификатни записи.',
    stats: {
      published: 'Публикувани Registry профили',
      certified: 'Активни сертификатни записи',
      queue: 'Профили още в модерация',
    },
    steps: [
      ['Registry publish', 'Одобреният Cane Corso профил става публично видим със собствен Registry route.'],
      ['Certificate issue', 'Admin може да издаде USG сертификат само след като публичният профил е готов.'],
      ['Verify trust', 'Посетителите потвърждават активния сертификат през Verify route или certificate code.'],
    ],
    actions: {
      registry: 'Отвори Registry',
      verify: 'Отвори Verify',
      admin: 'Отвори admin review',
    },
  },
  it: {
    eyebrow: 'Registry release flow',
    title: 'Pubblicazione, fiducia certificato e Verify restano separati',
    description:
      'Un profilo Registry pubblicato dimostra presenza pubblica. Il certificato USG e una seconda decisione admin. Verify conferma solo record certificati attivi.',
    stats: {
      published: 'Profili Registry pubblicati',
      certified: 'Record certificati attivi',
      queue: 'Profili ancora in moderazione',
    },
    steps: [
      ['Registry publish', 'Il profilo Cane Corso approvato diventa pubblico con la propria route Registry.'],
      ['Certificate issue', 'Admin puo emettere un certificato USG solo dopo che il profilo pubblico e pronto.'],
      ['Verify trust', 'I visitatori confermano il certificato attivo dalla route Verify o dal codice certificato.'],
    ],
    actions: {
      registry: 'Apri Registry',
      verify: 'Apri Verify',
      admin: 'Apri admin review',
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
