import Link from 'next/link';
import type { PartnerDirectoryDocument } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import {
  formatPartnerDate,
  formatPartnerLocation,
  formatPartnerOwnerName,
  getPartnerCategoryLabel,
  getPartnerUiCopy,
  localizePartnerText,
} from '@/lib/partner-copy';
import { OverviewStatCard } from '@/components/overview-stat-card';

const ratingCopyByLocale = {
  en: { noRatings: 'No ratings yet', community: 'Community rating', topPartner: 'Top community partner' },
  bg: { noRatings: 'Все още няма оценки', community: 'Оценка от общността', topPartner: 'Топ партньор на общността' },
  it: { noRatings: 'Nessuna valutazione', community: 'Valutazione della community', topPartner: 'Top partner della community' },
} as const;

interface PartnerDirectoryOverviewProps {
  document: PartnerDirectoryDocument;
  locale: Locale;
}

function buildCategoryHref(category: string | null) {
  return category ? `/partners?category=${encodeURIComponent(category)}` : '/partners';
}

export function PartnerDirectoryOverview({ document, locale }: PartnerDirectoryOverviewProps) {
  const copy = getPartnerUiCopy(locale);
  const ratingCopy = ratingCopyByLocale[locale] ?? ratingCopyByLocale.en;

  return (
    <div className="member-route-stack partner-directory-overview" id="partner-directory">
      <section className="content-card partner-cta-panel">
        <div className="partner-cta-panel__column">
          <span className="eyebrow-label">{copy.labels.directory}</span>
          <h2>{copy.labels.partnerCtaTitle}</h2>
          <p>{copy.labels.partnerCtaDescription}</p>
          {document.categories.length > 0 ? (
            <div className="partner-category-filter-row partner-category-filter-row--compact" aria-label={copy.labels.category}>
              {document.categories.slice(0, 4).map((category) => (
                <Link className="partner-category-chip" href={buildCategoryHref(category.key)} key={category.key}>
                  {getPartnerCategoryLabel(locale, category.key)}
                  <span>{category.total}</span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className="partner-cta-panel__column partner-cta-panel__column--accent">
          <span className="eyebrow-label">{copy.labels.workspace}</span>
          <h3>{copy.labels.partnerCtaSecondaryTitle}</h3>
          <p>{copy.labels.partnerCtaSecondaryDescription}</p>
          <div className="partner-cta-panel__actions">
            <Link href="/partners/apply" className="button-primary">
              {copy.labels.openApplyWorkspace}
            </Link>
            <span className="partner-cta-panel__note">{copy.labels.partnerCtaModerationNote}</span>
          </div>
        </div>
      </section>

      <div className="stats-grid three-up partner-stat-grid">
        <OverviewStatCard label={copy.stats.totalVisible} value={String(document.total)} tone="gold" />
        <OverviewStatCard label={copy.stats.totalApproved} value={String(document.totalAll)} tone="ivory" />
        <OverviewStatCard label={copy.stats.featured} value={String(document.featuredTotal)} tone="gold" />
      </div>

      <section className="content-card partner-directory-shell">
        <div className="section-head-row partner-directory-shell__header">
          <div>
            <span className="eyebrow-label">{copy.labels.directory}</span>
            <h2>{copy.labels.directory}</h2>
          </div>
          <div className="partner-directory-shell__header-actions">
            <p className="partner-directory-shell__support-copy">{copy.labels.approvedVisibility}</p>
            <Link href="/partners/apply" className="button-primary small">
              {copy.labels.openApplyWorkspace}
            </Link>
          </div>
        </div>

        <div className="partner-category-filter-row partner-category-filter-row--directory" role="tablist" aria-label={copy.labels.category}>
          <Link
            href={buildCategoryHref(null)}
            className={`partner-category-chip${document.activeCategory ? '' : ' partner-category-chip--active'}`}
          >
            {copy.allCategories}
            <span>{document.totalAll}</span>
          </Link>

          {document.categories.map((category) => (
            <Link
              key={category.key}
              href={buildCategoryHref(category.key)}
              className={`partner-category-chip${document.activeCategory === category.key ? ' partner-category-chip--active' : ''}`}
            >
              {getPartnerCategoryLabel(locale, category.key)}
              <span>{category.total}</span>
            </Link>
          ))}
        </div>

        {document.entries.length === 0 ? (
          <div className="empty-state-panel empty-state-panel--compact partner-empty-state">
            <div>
              <div className="section-heading__eyebrow">{copy.labels.directory}</div>
              <h3 className="section-heading__title">{copy.labels.noDirectoryTitle}</h3>
              <p className="empty-state-panel__description">{copy.labels.noDirectoryDescription}</p>
            </div>
          </div>
        ) : (
          <div className="partner-card-grid">
            {document.entries.map((entry) => {
              const location = formatPartnerLocation(entry.city, entry.country, copy.labels.unknown, locale);
              const publishedAt = formatPartnerDate(locale, entry.publishedAt);
              const contact = entry.email || entry.phone || copy.labels.noContact;

              return (
                <article className="partner-card" key={entry.id}>
                  <div
                    className="partner-card__hero"
                    style={entry.coverImageUrl ? { backgroundImage: `linear-gradient(180deg, rgba(7, 8, 10, 0.2), rgba(7, 8, 10, 0.78)), url(${entry.coverImageUrl})` } : undefined}
                  >
                    <div className="partner-card__hero-top">
                      <span className="status-badge status-badge--approved">
                        {getPartnerCategoryLabel(locale, entry.category)}
                      </span>
                      {entry.isFeatured ? <span className="partner-featured-pill">{copy.labels.featured}</span> : null}
                    </div>
                    <div className="partner-card__hero-bottom">
                      {entry.logoUrl ? (
                        <div className="partner-card__logo-wrap">
                          <img src={entry.logoUrl} alt={entry.businessName} className="partner-card__logo" loading="lazy" decoding="async" />
                        </div>
                      ) : (
                        <div className="partner-card__logo-wrap partner-card__logo-wrap--placeholder">USG</div>
                      )}
                      <div className="partner-card__hero-copy">
                        <strong>{entry.businessName}</strong>
                        <span>{location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="partner-card__body">
                    <div className="partner-card__title-row">
                      <div>
                        <h3>{entry.businessName}</h3>
                        <p className="partner-card__summary">{localizePartnerText(locale, entry.shortDescription, copy.labels.noDescription)}</p>
                      </div>
                    </div>

                    <div className="community-rating-inline">
                      <span className="community-rating-inline__value">
                        {entry.communityRating.totalRatings > 0
                          ? `${entry.communityRating.averageRating?.toFixed(1) ?? '—'} / 5`
                          : ratingCopy.noRatings}
                      </span>
                      <span className="community-rating-inline__meta">
                        {ratingCopy.community} • {entry.communityRating.totalRatings}
                      </span>
                      {entry.communityRating.badge === 'top_partner' ? (
                        <span className="route-pill route-pill--glow">{ratingCopy.topPartner}</span>
                      ) : null}
                    </div>

                    <dl className="partner-card__meta-grid">
                      <div>
                        <dt>{copy.labels.location}</dt>
                        <dd>{location}</dd>
                      </div>
                      <div>
                        <dt>{copy.labels.contact}</dt>
                        <dd>{contact}</dd>
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
                        <dt>{copy.labels.published}</dt>
                        <dd>{publishedAt || copy.labels.unknown}</dd>
                      </div>
                    </dl>

                    <div className="partner-card__footer">
                      <div className="partner-card__owner-line">
                        <span>{copy.labels.owner}</span>
                        <strong>{formatPartnerOwnerName(locale, entry.owner.displayName, copy.labels.unknown)}</strong>
                      </div>
                      <Link href={`/partners/${entry.slug}`} className="button-secondary small">
                        {copy.labels.viewProfile}
                      </Link>
                    </div>
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
