import Link from 'next/link';
import type { PublicUsgCertifiedDocument } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import { ImageLightbox } from '@/components/image-lightbox';

const copyByLocale = {
  en: {
    eyebrow: 'Issued by admin',
    title: 'USG Certified archive',
    description: 'All active USG certificates issued by the Registry Authority. This is a certificate archive, not the USG Gallery.',
    empty: 'No USG certificates have been issued yet.',
    openCertificate: 'Open certificate',
    verify: 'Verify',
    openProfile: 'Open profile',
    certificate: 'Certificate',
    issued: 'Issued',
    owner: 'Owner',
    location: 'Location',
    noData: 'No data',
  },
  bg: {
    eyebrow: 'Издадени от админ',
    title: 'USG Сертифицирани',
    description: 'Всички активни USG сертификати, издадени от Registry Authority. Това е архив/галерия на сертификати, не USG Галерията със снимки.',
    empty: 'Все още няма издадени USG сертификати.',
    openCertificate: 'Отвори сертификата',
    verify: 'Провери',
    openProfile: 'Отвори профила',
    certificate: 'Сертификат',
    issued: 'Издаден',
    owner: 'Собственик',
    location: 'Локация',
    noData: 'Няма данни',
  },
  it: {
    eyebrow: 'Emessi da admin',
    title: 'USG Certificati',
    description: 'Tutti i certificati USG attivi emessi dalla Registry Authority. È un archivio certificati, non la USG Gallery.',
    empty: 'Nessun certificato USG è ancora stato emesso.',
    openCertificate: 'Apri certificato',
    verify: 'Verifica',
    openProfile: 'Apri profilo',
    certificate: 'Certificato',
    issued: 'Emesso',
    owner: 'Proprietario',
    location: 'Località',
    noData: 'Nessun dato',
  },
} as const;

interface PublicCertifiedOverviewProps {
  document: PublicUsgCertifiedDocument;
  locale: Locale;
}

function formatDateLabel(locale: Locale, value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(value));
}

function formatLocation(city: string | null, country: string | null, fallback: string) {
  const parts = [city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : fallback;
}

export function PublicCertifiedOverview({ document, locale }: PublicCertifiedOverviewProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  if (document.entries.length === 0) {
    return <div className="content-card certified-empty-card">{copy.empty}</div>;
  }

  return (
    <section className="certified-grid" aria-label={copy.title}>
      {document.entries.map((entry) => {
        const certificate = entry.certificate;
        const certificateTarget = certificate?.certificateCode ?? certificate?.verificationSlug ?? null;
        const imageUrl = certificate?.certificateImageUrl ?? entry.heroImageUrl ?? entry.galleryImages[0] ?? null;

        return (
          <article className="certified-card" key={entry.entryId}>
            <div className="certified-card__image">
              {imageUrl ? (
                <ImageLightbox src={imageUrl} alt={entry.title} openLabel={`Open ${entry.title} certificate photo`} />
              ) : (
                <span>USG</span>
              )}
              <span className="certified-card__seal certified-card__seal--official">
                <img src="/brand/seal/usg-official-seal-compact.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <span>USG</span>
              </span>
            </div>
            <div className="certified-card__body">
              <span className="eyebrow-label">{copy.eyebrow}</span>
              <h2>{entry.title}</h2>
              <dl>
                <div><dt>{copy.certificate}</dt><dd>{certificate?.certificateCode ?? copy.noData}</dd></div>
                <div><dt>{copy.issued}</dt><dd>{formatDateLabel(locale, certificate?.issueDate, copy.noData)}</dd></div>
                <div><dt>{copy.owner}</dt><dd>{entry.owner.displayName}</dd></div>
                <div><dt>{copy.location}</dt><dd>{formatLocation(entry.owner.city, entry.owner.country, copy.noData)}</dd></div>
              </dl>
              <div className="certified-card__actions">
                {certificateTarget ? <Link href={`/certificate/${certificateTarget}`} className="button-primary small">{copy.openCertificate}</Link> : null}
                {certificateTarget ? <Link href={`/verify/${certificateTarget}`} className="button-secondary small">{copy.verify}</Link> : null}
                <Link href={`/registry/${entry.publicSlug}`} className="button-ghost small">{copy.openProfile}</Link>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
