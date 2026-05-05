import Link from 'next/link';
import type { PartnerProfileDocument } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import { CommunityRatingPanel } from '@/components/community-rating-panel';
import {
  formatPartnerDate,
  formatPartnerLocation,
  formatPartnerOwnerName,
  getPartnerCategoryLabel,
  getPartnerUiCopy,
  localizePartnerText,
} from '@/lib/partner-copy';

interface PartnerProfileDetailProps {
  document: PartnerProfileDocument;
  locale: Locale;
  ratingStatus?: string | null;
}

const profileCopy = {
  en: {
    identityEyebrow: 'Partner profile',
    identityTitle: 'A curated service profile for Cane Corso owners',
    identityDescription:
      'This page presents the partner as an approved public service inside the Cane Corso ecosystem, with clear identity, location, contact details, and community context.',
    trustEyebrow: 'Public trust',
    trustTitle: 'Why this profile is useful',
    trustA: 'Approved visibility',
    trustACopy: 'The profile is public only after administrator review.',
    trustB: 'Practical contact',
    trustBCopy: 'Owners can quickly understand where the service is, what it offers, and how to reach it.',
    trustC: 'Ecosystem fit',
    trustCCopy: 'The service is shown as part of the Cane Corso ecosystem, not as a random listing.',
    ownerEyebrow: 'Service context',
    ownerTitle: 'Built for owner decisions',
    ownerCopy: 'The goal of this profile is simple: help owners compare useful services without mixing them with ordinary community posts.',
    quickWebsite: 'Visit website',
    quickDirectory: 'Back to partners',
    quickMail: 'Email partner',
    noMedia: 'Approved partner profile',
  },
  bg: {
    identityEyebrow: 'Партньорски профил',
    identityTitle: 'Курирана услуга за собственици на Cane Corso',
    identityDescription:
      'Тази страница представя партньора като одобрена публична услуга в Cane Corso екосистемата — с ясна идентичност, локация, контакти и контекст за общността.',
    trustEyebrow: 'Публично доверие',
    trustTitle: 'Защо този профил е полезен',
    trustA: 'Одобрена видимост',
    trustACopy: 'Профилът става публичен само след администраторски преглед.',
    trustB: 'Практичен контакт',
    trustBCopy: 'Собствениците бързо виждат къде е услугата, какво предлага и как да се свържат.',
    trustC: 'Място в екосистемата',
    trustCCopy: 'Услугата се показва като част от Cane Corso екосистемата, а не като случаен листинг.',
    ownerEyebrow: 'Контекст на услугата',
    ownerTitle: 'Създадено за реален избор',
    ownerCopy: 'Целта на профила е проста: да помага на собствениците да сравняват полезни услуги, без те да се смесват с обикновени предложения от общността.',
    quickWebsite: 'Отвори сайта',
    quickDirectory: 'Назад към партньорите',
    quickMail: 'Пиши на партньора',
    noMedia: 'Одобрен партньорски профил',
  },
  it: {
    identityEyebrow: 'Profilo partner',
    identityTitle: 'Un servizio curato per proprietari di Cane Corso',
    identityDescription:
      'Questa pagina presenta il partner come servizio pubblico approvato nell’ecosistema Cane Corso, con identità chiara, località, contatti e contesto community.',
    trustEyebrow: 'Fiducia pubblica',
    trustTitle: 'Perché questo profilo è utile',
    trustA: 'Visibilità approvata',
    trustACopy: 'Il profilo diventa pubblico solo dopo revisione amministratore.',
    trustB: 'Contatto pratico',
    trustBCopy: 'I proprietari capiscono rapidamente dove si trova il servizio, cosa offre e come contattarlo.',
    trustC: 'Coerenza ecosystem',
    trustCCopy: 'Il servizio appare come parte dell’ecosistema Cane Corso, non come listing casuale.',
    ownerEyebrow: 'Contesto servizio',
    ownerTitle: 'Pensato per decisioni reali',
    ownerCopy: 'Lo scopo del profilo è semplice: aiutare i proprietari a confrontare servizi utili senza mescolarli con post community ordinari.',
    quickWebsite: 'Visita sito',
    quickDirectory: 'Torna ai partner',
    quickMail: 'Invia email',
    noMedia: 'Profilo partner approvato',
  },
} as const;

export function PartnerProfileDetail({ document, locale, ratingStatus }: PartnerProfileDetailProps) {
  const copy = getPartnerUiCopy(locale);
  const profile = profileCopy[locale] ?? profileCopy.en;
  const { entry, relatedEntries } = document;
  const location = formatPartnerLocation(entry.city, entry.country, copy.labels.unknown, locale);
  const publishedAt = formatPartnerDate(locale, entry.publishedAt);
  const heroMedia = entry.coverImageUrl ?? entry.logoUrl ?? null;
  const primaryDescription = localizePartnerText(locale, entry.longDescription || entry.shortDescription, copy.labels.noDescription);

  return (
    <div className="member-route-stack">
      <section className="route-hero-card route-hero-card--member partner-profile-hero">
        <div>
          <span className="eyebrow-label">{getPartnerCategoryLabel(locale, entry.category)}</span>
          <h1 className="route-title">{entry.businessName}</h1>
          <p className="route-copy">{localizePartnerText(locale, entry.shortDescription, copy.labels.noDescription)}</p>
          <div className="route-hero-pills route-hero-pills--member">
            <span className="route-pill route-pill--glow">{location}</span>
            {entry.isFeatured ? <span className="route-pill">{copy.labels.featured}</span> : null}
            {publishedAt ? <span className="route-pill subtle">{publishedAt}</span> : null}
          </div>
        </div>
        <div className="route-hero-actions partner-profile-hero__actions">
          {entry.websiteUrl ? (
            <a href={entry.websiteUrl} target="_blank" rel="noreferrer" className="button-primary">
              {profile.quickWebsite}
            </a>
          ) : null}
          <Link href="/partners" className="button-secondary">
            {profile.quickDirectory}
          </Link>
        </div>
      </section>

      <CommunityRatingPanel
        locale={locale}
        variant="partner"
        slug={entry.slug}
        targetId={entry.id}
        summary={entry.communityRating}
        vote={document.communityVote}
        status={ratingStatus}
      />

      <div className="content-grid two-columns-wide-right">
        <div className="stack-blocks">
          <section className="content-card partner-identity-card">
            <div className="partner-identity-card__media" style={heroMedia ? { backgroundImage: `linear-gradient(180deg, rgba(7, 8, 10, 0.22), rgba(7, 8, 10, 0.78)), url(${heroMedia})` } : undefined}>
              {entry.logoUrl ? (
                <div className="partner-identity-card__logo">
                  <img src={entry.logoUrl} alt={entry.businessName} loading="lazy" decoding="async" />
                </div>
              ) : (
                <div className="partner-identity-card__logo partner-identity-card__logo--placeholder">USG</div>
              )}
              {!heroMedia ? <div className="partner-identity-card__placeholder">{profile.noMedia}</div> : null}
            </div>

            <div className="partner-identity-card__copy">
              <span className="eyebrow-label">{profile.identityEyebrow}</span>
              <h2>{profile.identityTitle}</h2>
              <p>{profile.identityDescription}</p>
              <div className="partner-identity-card__chips">
                <span className="route-pill route-pill--glow">{getPartnerCategoryLabel(locale, entry.category)}</span>
                <span className="route-pill subtle">{location}</span>
                {entry.isFeatured ? <span className="route-pill">{copy.labels.featured}</span> : null}
              </div>
              <div className="partner-identity-card__actions">
                {entry.websiteUrl ? (
                  <a href={entry.websiteUrl} target="_blank" rel="noreferrer" className="button-primary small">
                    {profile.quickWebsite}
                  </a>
                ) : null}
                {entry.email ? (
                  <a href={`mailto:${entry.email}`} className="button-ghost small">
                    {profile.quickMail}
                  </a>
                ) : null}
              </div>
            </div>
          </section>

          <section className="content-card partner-profile-section">
            <div className="section-head-row">
              <div>
                <span className="eyebrow-label">{copy.labels.details}</span>
                <h2>{copy.labels.longDescription}</h2>
              </div>
            </div>
            <p className="partner-profile-section__copy">{primaryDescription}</p>
          </section>

          <section className="content-card partner-trust-card">
            <span className="eyebrow-label">{profile.trustEyebrow}</span>
            <h2>{profile.trustTitle}</h2>
            <div className="partner-trust-card__grid">
              <article className="partner-trust-card__item">
                <span>{profile.trustA}</span>
                <p>{profile.trustACopy}</p>
              </article>
              <article className="partner-trust-card__item">
                <span>{profile.trustB}</span>
                <p>{profile.trustBCopy}</p>
              </article>
              <article className="partner-trust-card__item">
                <span>{profile.trustC}</span>
                <p>{profile.trustCCopy}</p>
              </article>
            </div>
          </section>

          <section className="content-card partner-profile-section">
            <div className="section-head-row">
              <div>
                <span className="eyebrow-label">{copy.labels.relatedServices}</span>
                <h2>{copy.labels.relatedServices}</h2>
              </div>
            </div>

            {relatedEntries.length === 0 ? (
              <div className="empty-state-panel empty-state-panel--compact partner-empty-state">
                <div>
                  <div className="section-heading__eyebrow">{copy.labels.relatedServices}</div>
                  <h3 className="section-heading__title">{copy.labels.relatedServices}</h3>
                  <p className="empty-state-panel__description">{copy.labels.noRelated}</p>
                </div>
              </div>
            ) : (
              <div className="partner-related-grid">
                {relatedEntries.map((relatedEntry) => (
                  <article className="partner-related-card" key={relatedEntry.id}>
                    <span className="status-badge status-badge--approved">
                      {getPartnerCategoryLabel(locale, relatedEntry.category)}
                    </span>
                    <h3>{relatedEntry.businessName}</h3>
                    <p>{localizePartnerText(locale, relatedEntry.shortDescription, copy.labels.noDescription)}</p>
                    <Link href={`/partners/${relatedEntry.slug}`} className="inline-link-action">
                      {copy.labels.viewProfile}
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="side-stack">
          <section className="side-info-card compact partner-contact-panel">
            <span className="eyebrow-label">{copy.labels.contact}</span>
            <h3>{copy.labels.contact}</h3>
            <dl className="partner-contact-list">
              <div>
                <dt>{copy.labels.location}</dt>
                <dd>{location}</dd>
              </div>
              <div>
                <dt>{copy.labels.website}</dt>
                <dd>
                  {entry.websiteUrl ? (
                    <a href={entry.websiteUrl} target="_blank" rel="noreferrer">
                      {copy.labels.openWebsite}
                    </a>
                  ) : (
                    copy.labels.noWebsite
                  )}
                </dd>
              </div>
              <div>
                <dt>{copy.labels.email}</dt>
                <dd>
                  {entry.email ? <a href={`mailto:${entry.email}`}>{entry.email}</a> : copy.labels.unknown}
                </dd>
              </div>
              <div>
                <dt>{copy.labels.phone}</dt>
                <dd>{entry.phone || copy.labels.unknown}</dd>
              </div>
              <div>
                <dt>{copy.labels.owner}</dt>
                <dd>{formatPartnerOwnerName(locale, entry.owner.displayName, copy.labels.unknown)}</dd>
              </div>
              <div>
                <dt>{copy.labels.published}</dt>
                <dd>{publishedAt || copy.labels.unknown}</dd>
              </div>
            </dl>
          </section>

          <section className="side-info-card compact partner-owner-story-card">
            <span className="eyebrow-label">{profile.ownerEyebrow}</span>
            <h3>{profile.ownerTitle}</h3>
            <p>{profile.ownerCopy}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
