import Link from 'next/link';
import type { PartnerModerationDocument } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import {
  formatPartnerDate,
  formatPartnerLocation,
  getPartnerCategoryLabel,
  getPartnerUiCopy,
} from '@/lib/partner-copy';
import { OverviewStatCard } from '@/components/overview-stat-card';
import { PartnerStatusBadge } from '@/components/partner-status-badge';
import {
  reviewPartnerApplicationAction,
  updatePartnerAdminStateAction,
} from '@/app/(admin)/admin/partners/actions';

interface PartnerModerationDashboardProps {
  document: PartnerModerationDocument;
  locale: Locale;
}

const partnerAdminPolishCopy = {
  en: {
    commandEyebrow: 'Admin command center',
    commandTitle: 'Partner approval workflow',
    commandDescription:
      'Review incoming applications, keep the public directory clean, and control which partners are highlighted without changing registry or certificate logic.',
    pendingLane: '1. Incoming applications',
    pendingLaneDescription: 'Check category, location, contact, and service quality before approval.',
    liveLane: '2. Public partner directory',
    liveLaneDescription: 'Approved partners are visible publicly and synced into the ecosystem layer.',
    trustLane: '3. Trust controls',
    trustLaneDescription: 'Feature trusted entries, suspend outdated profiles, and keep community rating separate.',
    openWebsite: 'Open website',
    noWebsite: 'No website',
    directorySync: 'Synced with ecosystem',
  },
  bg: {
    commandEyebrow: 'Админ контролен център',
    commandTitle: 'Процес за одобрение на партньори',
    commandDescription:
      'Преглеждай кандидатури, пази публичния каталог чист и контролирай кои партньори се отличават, без да променяш регистър или сертификат логиката.',
    pendingLane: '1. Входящи кандидатури',
    pendingLaneDescription: 'Провери категория, локация, контакт и качество на услугата преди одобрение.',
    liveLane: '2. Публичен каталог',
    liveLaneDescription: 'Одобрените партньори са публични и се синхронизират към екосистемния слой.',
    trustLane: '3. Контрол на доверие',
    trustLaneDescription: 'Отличавай надеждни записи, спирай остарели профили и дръж оценките на общността отделно.',
    openWebsite: 'Отвори сайта',
    noWebsite: 'Няма сайт',
    directorySync: 'Синхронизирано с екосистемата',
  },
  it: {
    commandEyebrow: 'Centro comando admin',
    commandTitle: 'Workflow approvazione partner',
    commandDescription:
      'Revisiona candidature, mantieni pulito il catalogo pubblico e controlla i partner in evidenza senza cambiare Registry o certificati.',
    pendingLane: '1. Candidature in arrivo',
    pendingLaneDescription: 'Controlla categoria, località, contatto e qualità del servizio prima dell’approvazione.',
    liveLane: '2. Catalogo pubblico',
    liveLaneDescription: 'I partner approvati sono pubblici e sincronizzati nel layer ecosystem.',
    trustLane: '3. Controlli trust',
    trustLaneDescription: 'Metti in evidenza profili affidabili, sospendi quelli obsoleti e separa il rating community.',
    openWebsite: 'Apri sito',
    noWebsite: 'Nessun sito',
    directorySync: 'Sincronizzato con ecosystem',
  },
} as const;

function WebsiteValue({
  url,
  label,
  emptyLabel,
}: {
  url: string | null | undefined;
  label: string;
  emptyLabel: string;
}) {
  if (!url) {
    return <>{emptyLabel}</>;
  }

  return (
    <a href={url} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

export function PartnerModerationDashboard({ document, locale }: PartnerModerationDashboardProps) {
  const copy = getPartnerUiCopy(locale);
  const adminCopy = partnerAdminPolishCopy[locale] ?? partnerAdminPolishCopy.en;

  return (
    <div className="member-route-stack">
      <section className="content-card admin-command-panel admin-command-panel--partners">
        <div className="admin-command-panel__copy">
          <span className="eyebrow-label">{adminCopy.commandEyebrow}</span>
          <h2>{adminCopy.commandTitle}</h2>
          <p>{adminCopy.commandDescription}</p>
        </div>
        <div className="admin-command-panel__lanes">
          <article className="admin-command-panel__lane">
            <span>{adminCopy.pendingLane}</span>
            <strong>{document.summary.pendingApplications}</strong>
            <p>{adminCopy.pendingLaneDescription}</p>
          </article>
          <article className="admin-command-panel__lane">
            <span>{adminCopy.liveLane}</span>
            <strong>{document.summary.approvedPartners}</strong>
            <p>{adminCopy.liveLaneDescription}</p>
          </article>
          <article className="admin-command-panel__lane">
            <span>{adminCopy.trustLane}</span>
            <strong>{document.summary.featuredPartners}</strong>
            <p>{adminCopy.trustLaneDescription}</p>
          </article>
        </div>
      </section>

      <div className="stats-grid five-up">
        <OverviewStatCard label={copy.stats.pendingApplications} value={String(document.summary.pendingApplications)} tone="gold" />
        <OverviewStatCard label={copy.stats.approvedApplications} value={String(document.summary.approvedApplications)} tone="ivory" />
        <OverviewStatCard label={copy.stats.rejectedApplications} value={String(document.summary.rejectedApplications)} tone="gold" />
        <OverviewStatCard label={copy.stats.totalApproved} value={String(document.summary.approvedPartners)} tone="ivory" />
        <OverviewStatCard label={copy.stats.suspendedPartners} value={String(document.summary.suspendedPartners)} tone="gold" />
      </div>

      <section className="content-card partner-moderation-section">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.labels.applications}</span>
            <h2>{copy.labels.applications}</h2>
          </div>
        </div>

        {document.applications.length === 0 ? (
          <div className="empty-state-panel empty-state-panel--compact partner-empty-state">
            <div>
              <div className="section-heading__eyebrow">{copy.labels.moderation}</div>
              <h3 className="section-heading__title">{copy.labels.noApplicationsTitle}</h3>
              <p className="empty-state-panel__description">{copy.labels.noApplicationsDescription}</p>
            </div>
          </div>
        ) : (
          <div className="partner-moderation-application-list">
            {document.applications.map((application) => (
              <article className="partner-moderation-card" key={application.applicationId}>
                <div className="partner-moderation-card__head">
                  <div>
                    <div className="partner-moderation-card__title-row">
                      <h3>{application.businessName}</h3>
                      <PartnerStatusBadge status={application.status === 'pending_review' ? 'pending_review' : application.status === 'approved' ? 'approved' : 'rejected'} locale={locale} />
                    </div>
                    <p className="partner-moderation-card__summary">
                      {getPartnerCategoryLabel(locale, application.category)} · {application.contactEmail}
                    </p>
                  </div>
                  <div className="partner-moderation-card__meta-pill">
                    <span>{copy.labels.submitted}</span>
                    <strong>{formatPartnerDate(locale, application.submittedAt) || copy.labels.unknown}</strong>
                  </div>
                </div>

                <dl className="partner-moderation-card__meta-grid">
                  <div>
                    <dt>{copy.labels.owner}</dt>
                    <dd>
                      <strong>{application.applicant.displayName}</strong>
                      <span>{application.applicant.email}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>{copy.labels.location}</dt>
                    <dd>{formatPartnerLocation(application.city, application.country, copy.labels.unknown)}</dd>
                  </div>
                  <div>
                    <dt>{copy.labels.email}</dt>
                    <dd>{application.contactEmail}</dd>
                  </div>
                  <div>
                    <dt>{copy.labels.phone}</dt>
                    <dd>{application.contactPhone || copy.labels.unknown}</dd>
                  </div>
                  <div>
                    <dt>{copy.labels.website}</dt>
                    <dd>
                      <WebsiteValue url={application.websiteUrl} label={adminCopy.openWebsite} emptyLabel={adminCopy.noWebsite} />
                    </dd>
                  </div>
                  <div>
                    <dt>{copy.labels.serviceSummary}</dt>
                    <dd>{application.shortDescription}</dd>
                  </div>
                </dl>

                <div className="partner-moderation-card__message-block">
                  <span className="eyebrow-label">{copy.labels.longDescription}</span>
                  <p>{application.longDescription || copy.labels.noDescription}</p>
                </div>

                <div className="partner-moderation-card__message-block compact">
                  <span className="eyebrow-label">{copy.labels.applicationMessage}</span>
                  <p>{application.message || copy.labels.unknown}</p>
                </div>

                <div className="partner-moderation-card__message-block compact">
                  <span className="eyebrow-label">{copy.labels.reviewNote}</span>
                  <p>{application.reviewNote || copy.labels.unknown}</p>
                </div>

                {application.status === 'pending_review' ? (
                  <div className="partner-moderation-card__actions">
                    <form action={reviewPartnerApplicationAction}>
                      <input type="hidden" name="applicationId" value={application.applicationId} />
                      <input type="hidden" name="decision" value="reject" />
                      <button type="submit" className="button-secondary small">
                        {copy.labels.reject}
                      </button>
                    </form>
                    <form action={reviewPartnerApplicationAction}>
                      <input type="hidden" name="applicationId" value={application.applicationId} />
                      <input type="hidden" name="decision" value="approve" />
                      <button type="submit" className="button-primary small review-publish-button">
                        {copy.labels.approve}
                      </button>
                    </form>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="content-card partner-moderation-section">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.labels.liveEntries}</span>
            <h2>{copy.labels.liveEntries}</h2>
          </div>
          <p className="partner-directory-shell__support-copy">{copy.labels.approvedVisibility}</p>
        </div>

        {document.liveEntries.length === 0 ? (
          <div className="empty-state-panel empty-state-panel--compact partner-empty-state">
            <div>
              <div className="section-heading__eyebrow">{copy.labels.liveEntries}</div>
              <h3 className="section-heading__title">{copy.labels.noDirectoryTitle}</h3>
              <p className="empty-state-panel__description">{copy.labels.noDirectoryDescription}</p>
            </div>
          </div>
        ) : (
          <div className="partner-live-grid">
            {document.liveEntries.map((entry) => {
              const publishedAt = formatPartnerDate(locale, entry.publishedAt);

              return (
                <article className="partner-live-card" key={entry.id}>
                  <div className="partner-live-card__header">
                    <div>
                      <div className="partner-moderation-card__title-row">
                        <h3>{entry.businessName}</h3>
                        <PartnerStatusBadge status={entry.status} locale={locale} />
                      </div>
                      <p className="partner-moderation-card__summary">
                        {getPartnerCategoryLabel(locale, entry.category)} · {formatPartnerLocation(entry.city, entry.country, copy.labels.unknown)}
                      </p>
                    </div>
                    <div className="partner-live-card__header-badges">
                      {entry.isFeatured ? <span className="partner-featured-pill">{copy.labels.featured}</span> : null}
                      <span className="partner-sync-pill">{adminCopy.directorySync}</span>
                    </div>
                  </div>

                  <dl className="partner-live-card__meta-grid">
                    <div>
                      <dt>{copy.labels.owner}</dt>
                      <dd>{entry.owner.displayName}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.published}</dt>
                      <dd>{publishedAt || copy.labels.unknown}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.website}</dt>
                      <dd>
                        <WebsiteValue url={entry.websiteUrl} label={adminCopy.openWebsite} emptyLabel={adminCopy.noWebsite} />
                      </dd>
                    </div>
                    <div>
                      <dt>{copy.labels.contact}</dt>
                      <dd>{entry.email || entry.phone || copy.labels.noContact}</dd>
                    </div>
                  </dl>

                  <div className="partner-live-card__actions">
                    <Link href={`/partners/${entry.slug}`} className="button-secondary small">
                      {copy.labels.openPublicProfile}
                    </Link>

                    {entry.isFeatured ? (
                      <form action={updatePartnerAdminStateAction}>
                        <input type="hidden" name="partnerId" value={entry.id} />
                        <input type="hidden" name="intent" value="unfeature" />
                        <input type="hidden" name="partnerSlug" value={entry.slug} />
                        <button type="submit" className="button-ghost small">
                          {copy.labels.unfeature}
                        </button>
                      </form>
                    ) : (
                      <form action={updatePartnerAdminStateAction}>
                        <input type="hidden" name="partnerId" value={entry.id} />
                        <input type="hidden" name="intent" value="feature" />
                        <input type="hidden" name="partnerSlug" value={entry.slug} />
                        <button type="submit" className="button-ghost small">
                          {copy.labels.feature}
                        </button>
                      </form>
                    )}

                    {entry.status === 'suspended' ? (
                      <form action={updatePartnerAdminStateAction}>
                        <input type="hidden" name="partnerId" value={entry.id} />
                        <input type="hidden" name="intent" value="restore" />
                        <input type="hidden" name="partnerSlug" value={entry.slug} />
                        <button type="submit" className="button-primary small">
                          {copy.labels.restore}
                        </button>
                      </form>
                    ) : (
                      <form action={updatePartnerAdminStateAction}>
                        <input type="hidden" name="partnerId" value={entry.id} />
                        <input type="hidden" name="intent" value="suspend" />
                        <input type="hidden" name="partnerSlug" value={entry.slug} />
                        <button type="submit" className="button-secondary small">
                          {copy.labels.suspend}
                        </button>
                      </form>
                    )}
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
