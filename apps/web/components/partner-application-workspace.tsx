import Link from 'next/link';
import type { PartnerWorkspaceDocument } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import { submitPartnerApplicationAction } from '@/app/(member)/partners/apply/actions';
import { OverviewStatCard } from '@/components/overview-stat-card';
import { PartnerStatusBadge } from '@/components/partner-status-badge';
import { LuxurySelect } from '@/components/luxury-select';
import {
  canonicalPartnerCategories,
  formatPartnerDate,
  formatPartnerLocation,
  getPartnerCategoryLabel,
  getPartnerUiCopy,
} from '@/lib/partner-copy';

interface PartnerApplicationWorkspaceProps {
  document: PartnerWorkspaceDocument;
  locale: Locale;
  showOnboardingNotice?: boolean;
}

export function PartnerApplicationWorkspace({ document, locale, showOnboardingNotice = false }: PartnerApplicationWorkspaceProps) {
  const copy = getPartnerUiCopy(locale);
  const latestApplication = document.applications[0] ?? null;
  const suggestedDraft = document.suggestedDraft;

  return (
    <div className="member-route-stack">
      <section className="route-hero-card route-hero-card--member partner-application-hero">
        <div>
          {showOnboardingNotice ? (
            <div className="partner-onboarding-note">
              <span className="eyebrow-label">{copy.labels.applicationReady}</span>
              <p>{copy.workspace.formDescription}</p>
            </div>
          ) : null}
          <span className="eyebrow-label">{copy.workspace.eyebrow}</span>
          <h1 className="route-title">{copy.workspace.title}</h1>
          <p className="route-copy">{copy.workspace.description}</p>
          <div className="route-hero-pills route-hero-pills--member">
            <span className="route-pill route-pill--glow">
              {document.summary.pendingApplications} {copy.stats.pendingApplications.toLowerCase()}
            </span>
            <span className="route-pill">{document.summary.liveEntries} {copy.stats.liveEntries.toLowerCase()}</span>
            {latestApplication ? (
              <span className="route-pill subtle">
                {copy.workspace.latestStatus}: {formatPartnerDate(locale, latestApplication.submittedAt) ?? copy.labels.unknown}
              </span>
            ) : null}
          </div>
        </div>
        <div className="route-hero-actions">
          <Link href="/partners" className="button-secondary">
            {copy.labels.openDirectory}
          </Link>
        </div>
      </section>

      <div className="stats-grid four-up">
        <OverviewStatCard label={copy.stats.pendingApplications} value={String(document.summary.pendingApplications)} tone="gold" />
        <OverviewStatCard label={copy.stats.approvedApplications} value={String(document.summary.approvedApplications)} tone="ivory" />
        <OverviewStatCard label={copy.stats.liveEntries} value={String(document.summary.liveEntries)} tone="gold" />
        <OverviewStatCard label={copy.stats.featured} value={String(document.summary.featuredEntries)} tone="ivory" />
      </div>

      <div className="content-grid two-columns-wide-right partner-workspace-grid">
        <div className="stack-blocks">
          <section className="content-card partner-workspace-form-card">
            <div className="section-head-row">
              <div>
                <span className="eyebrow-label">{copy.labels.applicationForm}</span>
                <h2>{copy.labels.applicationForm}</h2>
              </div>
            </div>
            <p className="partner-workspace-form-copy">{copy.workspace.formDescription}</p>

            <form action={submitPartnerApplicationAction} className="form-grid single-column partner-application-form">
              <div className="form-grid two-up">
                <label className="field-group">
                  <span className="field-label">{copy.labels.businessName}</span>
                  <input name="businessName" defaultValue={suggestedDraft.businessName} className="field-input" required />
                </label>
                <label className="field-group">
                  <span className="field-label">{copy.labels.category}</span>
                  <LuxurySelect
                    name="category"
                    defaultValue={suggestedDraft.category}
                    required
                    options={canonicalPartnerCategories.map((category) => ({
                      value: category,
                      label: getPartnerCategoryLabel(locale, category),
                    }))}
                  />
                </label>
              </div>

              <label className="field-group">
                <span className="field-label">{copy.labels.serviceSummary}</span>
                <input
                  name="shortDescription"
                  defaultValue={suggestedDraft.shortDescription}
                  className="field-input"
                  required
                  maxLength={180}
                />
              </label>

              <label className="field-group">
                <span className="field-label">{copy.labels.longDescription}</span>
                <textarea
                  name="longDescription"
                  defaultValue={suggestedDraft.longDescription}
                  className="field-textarea large"
                  required
                />
              </label>

              <div className="form-grid two-up">
                <label className="field-group">
                  <span className="field-label">{copy.labels.city}</span>
                  <input name="city" defaultValue={suggestedDraft.city ?? ''} className="field-input" />
                </label>
                <label className="field-group">
                  <span className="field-label">{copy.labels.country}</span>
                  <input name="country" defaultValue={suggestedDraft.country ?? ''} className="field-input" />
                </label>
              </div>

              <div className="form-grid two-up">
                <label className="field-group">
                  <span className="field-label">{copy.labels.website}</span>
                  <input name="websiteUrl" defaultValue={suggestedDraft.websiteUrl ?? ''} className="field-input" />
                </label>
                <label className="field-group">
                  <span className="field-label">{copy.labels.email}</span>
                  <input name="contactEmail" defaultValue={suggestedDraft.contactEmail} className="field-input" required />
                </label>
              </div>

              <div className="form-grid two-up">
                <label className="field-group">
                  <span className="field-label">{copy.labels.phone}</span>
                  <input name="contactPhone" defaultValue={suggestedDraft.contactPhone ?? ''} className="field-input" />
                </label>
                <label className="field-group">
                  <span className="field-label">{copy.labels.logoImage}</span>
                  <input name="logoUrl" defaultValue={suggestedDraft.logoUrl ?? ''} className="field-input" />
                </label>
              </div>

              <label className="field-group">
                <span className="field-label">{copy.labels.coverImage}</span>
                <input name="coverImageUrl" defaultValue={suggestedDraft.coverImageUrl ?? ''} className="field-input" />
              </label>

              <label className="field-group">
                <span className="field-label">{copy.labels.applicationMessage}</span>
                <textarea name="message" defaultValue={suggestedDraft.message ?? ''} className="field-textarea" />
                <span className="field-optional">{copy.labels.serviceNoteHelp}</span>
              </label>

              <div className="partner-form-submit-row">
                <p>{copy.labels.reviewFlowHint}</p>
                <button type="submit" className="button-primary">
                  {copy.labels.submitApplication}
                </button>
              </div>
            </form>
          </section>

          <section className="content-card partner-moderation-section">
            <div className="section-head-row">
              <div>
                <span className="eyebrow-label">{copy.labels.yourApplications}</span>
                <h2>{copy.labels.yourApplications}</h2>
              </div>
            </div>

            {document.applications.length === 0 ? (
              <div className="empty-state-panel empty-state-panel--compact partner-empty-state">
                <div>
                  <div className="section-heading__eyebrow">{copy.labels.workspace}</div>
                  <h3 className="section-heading__title">{copy.labels.noMemberApplicationsTitle}</h3>
                  <p className="empty-state-panel__description">{copy.labels.noMemberApplicationsDescription}</p>
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
                          <PartnerStatusBadge status={application.status} locale={locale} />
                        </div>
                        <p className="partner-moderation-card__summary">
                          {getPartnerCategoryLabel(locale, application.category)} · {application.contactEmail}
                        </p>
                      </div>
                      <div className="partner-moderation-card__meta-pill">
                        <span>{copy.labels.submitted}</span>
                        <strong>{formatPartnerDate(locale, application.submittedAt) ?? copy.labels.unknown}</strong>
                      </div>
                    </div>

                    <dl className="partner-moderation-card__meta-grid">
                      <div>
                        <dt>{copy.labels.location}</dt>
                        <dd>{formatPartnerLocation(application.city, application.country, copy.labels.unknown)}</dd>
                      </div>
                      <div>
                        <dt>{copy.labels.website}</dt>
                        <dd>{application.websiteUrl || copy.labels.noWebsite}</dd>
                      </div>
                      <div>
                        <dt>{copy.labels.serviceSummary}</dt>
                        <dd>{application.shortDescription}</dd>
                      </div>
                      <div>
                        <dt>{copy.labels.phone}</dt>
                        <dd>{application.contactPhone || copy.labels.unknown}</dd>
                      </div>
                    </dl>

                    <div className="partner-moderation-card__message-block">
                      <span className="eyebrow-label">{copy.labels.longDescription}</span>
                      <p>{application.longDescription}</p>
                    </div>

                    <div className="partner-moderation-card__message-block compact">
                      <span className="eyebrow-label">{copy.labels.reviewNote}</span>
                      <p>{application.reviewNote || copy.labels.unknown}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="side-stack">
          <section className="side-info-card">
            <span className="eyebrow-label">{copy.labels.applyGuidance}</span>
            <h3>{copy.labels.applicationReady}</h3>
            <ol className="step-list">
              {copy.workspace.moderationSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="side-info-card compact">
            <span className="eyebrow-label">{copy.workspace.publicSurface}</span>
            <h3>{copy.labels.yourLiveEntries}</h3>
            {document.liveEntries.length === 0 ? (
              <p>{copy.labels.queueVisibility}</p>
            ) : (
              <div className="partner-workspace-live-list">
                {document.liveEntries.map((entry) => (
                  <article key={entry.id} className="partner-workspace-live-item">
                    <div>
                      <strong>{entry.businessName}</strong>
                      <p>{getPartnerCategoryLabel(locale, entry.category)}</p>
                    </div>
                    <Link href={`/partners/${entry.slug}`} className="inline-link-action">
                      {copy.labels.viewProfile}
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
