import { OverviewStatCard } from '@/components/overview-stat-card';
import type { Locale } from '@/lib/i18n';
import type { EcosystemModerationDocument, EcosystemModerationItem } from '@cane-corso-platform/contracts';
import {
  approveEcosystemListingAction,
  publishEcosystemListingAction,
  requestEcosystemChangesAction,
} from '@/app/(admin)/admin/ecosystem/actions';
import {
  getEcosystemListingTypeLabels,
  getEcosystemListingStatusLabels,
  getEcosystemSubmissionChannelLabels,
  getEcosystemSubmissionChannelTone,
} from '@/lib/ecosystem-ui';

const copyByLocale = {
  en: {
    stats: {
      total: 'Ecosystem records',
      pending: 'Pending review',
      official: 'Official lanes',
      community: 'Community lanes',
      suggestions: 'Suggestions',
    },
    labels: {
      queue: 'Ecosystem moderation queue',
      emptyTitle: 'No ecosystem listings yet',
      emptyDescription:
        'As members and businesses start sending services, places, and suggestions, the shared moderation queue will appear here.',
      owner: 'Owner',
      contact: 'Contact',
      location: 'Location',
      reviewNote: 'Review note',
      lane: 'Lane',
      publishState: 'Publication state',
      approve: 'Approve listing',
      requestChanges: 'Request changes',
      publish: 'Publish listing',
      pending: 'Not set yet',
      internalOnly: 'Internal suggestion only',
      internalDescription: 'This suggestion can be approved, but it cannot publish until it is converted into a real listing.',
      draftReadOnly: 'Draft is still private. Wait for the member to submit it for review.',
      needsChangesReadOnly: 'Returned for correction. Wait for the member to update and submit it again.',
      approvedSuggestionReadOnly: 'Approved as an internal suggestion. It cannot be published directly.',
      publishedReadOnly: 'Already published and visible in the public directory.',
      googleMaps: 'Google Maps place',
      openMaps: 'Open in Google Maps',
    },
  },
  bg: {
    stats: {
      total: 'Записи в екосистемата',
      pending: 'Чакат преглед',
      official: 'Официални пътеки',
      community: 'Общностни пътеки',
      suggestions: 'Предложения',
    },
    labels: {
      queue: 'Опашка за модерация на екосистемата',
      emptyTitle: 'Все още няма записи в екосистемата',
      emptyDescription:
        'Когато членове и бизнеси започнат да изпращат услуги, места и предложения, общата опашка за модерация ще се появява тук.',
      owner: 'Собственик',
      contact: 'Контакт',
      location: 'Локация',
      reviewNote: 'Бележка от преглед',
      lane: 'Пътека',
      publishState: 'Статус за публикуване',
      approve: 'Одобри запис',
      requestChanges: 'Върни за корекции',
      publish: 'Публикувай записа',
      pending: 'Все още няма данни',
      internalOnly: 'Само вътрешно предложение',
      internalDescription: 'Това предложение може да бъде одобрено, но не може да се публикува, докато не бъде превърнато в реален запис.',
      draftReadOnly: 'Черновата е лична. Изчакай членът да я изпрати за преглед.',
      needsChangesReadOnly: 'Върнато е за корекция. Изчакай членът да го редактира и изпрати отново.',
      approvedSuggestionReadOnly: 'Одобрено е като вътрешно предложение. Не се публикува директно.',
      publishedReadOnly: 'Вече е публичен запис и се вижда в директорията.',
      googleMaps: 'Място в Google Maps',
      openMaps: 'Отвори в Google Maps',
    },
  },
  it: {
    stats: {
      total: 'Record ecosystem',
      pending: 'In attesa',
      official: 'Percorsi ufficiali',
      community: 'Percorsi community',
      suggestions: 'Suggerimenti',
    },
    labels: {
      queue: 'Coda di moderazione ecosystem',
      emptyTitle: 'Nessuna scheda ecosystem ancora',
      emptyDescription:
        'Quando membri e aziende inizieranno a inviare servizi, luoghi e suggerimenti, la coda condivisa di moderazione apparirà qui.',
      owner: 'Proprietario',
      contact: 'Contatto',
      location: 'Località',
      reviewNote: 'Nota revisione',
      lane: 'Percorso',
      publishState: 'Stato di pubblicazione',
      approve: 'Approva scheda',
      requestChanges: 'Richiedi modifiche',
      publish: 'Pubblica scheda',
      pending: 'Non ancora disponibile',
      internalOnly: 'Solo suggerimento interno',
      internalDescription: 'Questo suggerimento può essere approvato, ma non può essere pubblicato finché non viene convertito in una scheda reale.',
      draftReadOnly: 'La bozza è ancora privata. Attendi che il membro la invii per la revisione.',
      needsChangesReadOnly: 'Rimandata per correzione. Attendi che il membro la aggiorni e la invii di nuovo.',
      approvedSuggestionReadOnly: 'Approvata come suggerimento interno. Non può essere pubblicata direttamente.',
      publishedReadOnly: 'Già pubblicata e visibile nella directory pubblica.',
      googleMaps: 'Luogo Google Maps',
      openMaps: 'Apri in Google Maps',
    },
  },
} as const;

const ecosystemAdminPolishCopy = {
  en: {
    commandEyebrow: 'Ecosystem moderation',
    commandTitle: 'One queue for the full Cane Corso ecosystem',
    commandDescription:
      'Use this surface to separate official listings, community listings, and internal suggestions before anything becomes public.',
    official: 'Official listings',
    community: 'Community entries',
    publishGate: 'Publish gate',
    publishGateDescription: 'Only approved real listings can be published. Suggestions stay internal until converted.',
  },
  bg: {
    commandEyebrow: 'Модерация на екосистемата',
    commandTitle: 'Една опашка за цялата Cane Corso екосистема',
    commandDescription:
      'Тук разделяш официални записи, общностни записи и вътрешни предложения преди нещо да стане публично.',
    official: 'Официални записи',
    community: 'Общностни записи',
    publishGate: 'Контрол преди публикуване',
    publishGateDescription: 'Само одобрени реални записи могат да се публикуват. Предложенията остават вътрешни, докато не се превърнат в запис.',
  },
  it: {
    commandEyebrow: 'Moderazione ecosystem',
    commandTitle: 'Una coda per tutto l’ecosistema Cane Corso',
    commandDescription:
      'Usa questa superficie per separare schede ufficiali, community e suggerimenti interni prima della pubblicazione.',
    official: 'Schede ufficiali',
    community: 'Schede community',
    publishGate: 'Gate pubblicazione',
    publishGateDescription: 'Solo schede reali approvate possono essere pubblicate. I suggerimenti restano interni finché non vengono convertiti.',
  },
} as const;

function formatLocation(item: EcosystemModerationItem, fallback: string) {
  const parts = [item.owner.city ?? item.listing.city, item.owner.country ?? item.listing.country].filter(Boolean);
  return parts.length ? parts.join(', ') : fallback;
}

interface EcosystemModerationDashboardProps {
  document: EcosystemModerationDocument;
  locale: Locale;
}

export function EcosystemModerationDashboard({ document, locale }: EcosystemModerationDashboardProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const typeLabels = getEcosystemListingTypeLabels(locale);
  const channelLabels = getEcosystemSubmissionChannelLabels(locale);
  const statusLabels = getEcosystemListingStatusLabels(locale);
  const adminCopy = ecosystemAdminPolishCopy[locale] ?? ecosystemAdminPolishCopy.en;

  // Local display-only translations for known system-generated notes
  function translateSystemNote(text?: string | null) {
    if (!text || locale !== 'bg') return text;

    const map: Record<string, string> = {
      'Seeded from approved Partner / Services profile.':
        'Създадено от одобрен профил в Партньори / Услуги.',
      'Backfilled from approved Partner / Services profile.':
        'Попълнено от одобрен профил в Партньори / Услуги.',
      'Official Partner / Services profile approved for the Cane Corso ecosystem.':
        'Официален профил в Партньори / Услуги одобрен за екосистемата Cane Corso.',
      'Synced from approved Partner / Services application.':
        'Синхронизирано от одобрено кандидатстване в Партньори / Услуги.',
      'Synced from Partner / Services admin state.':
        'Синхронизирано от админ състоянието в Партньори / Услуги.',
    };

    return map[text] ?? text;
  }

  // Prefer slash-styled Bulgarian label for partner_service in this page's UI
  if (locale === 'bg') {
    (typeLabels as any).partner_service = 'Партньори / Услуги';
  }

  return (
    <div className="member-route-stack">
      <section className="content-card admin-command-panel admin-command-panel--ecosystem">
        <div className="admin-command-panel__copy">
          <span className="eyebrow-label">{adminCopy.commandEyebrow}</span>
          <h2>{adminCopy.commandTitle}</h2>
          <p>{adminCopy.commandDescription}</p>
        </div>
        <div className="admin-command-panel__lanes">
          <article className="admin-command-panel__lane">
            <span>{adminCopy.official}</span>
            <strong>{document.summary.officialListings}</strong>
            <p>{copy.labels.publishState}</p>
          </article>
          <article className="admin-command-panel__lane">
            <span>{adminCopy.community}</span>
            <strong>{document.summary.communityListings}</strong>
            <p>{copy.labels.lane}</p>
          </article>
          <article className="admin-command-panel__lane">
            <span>{adminCopy.publishGate}</span>
            <strong>{document.summary.pendingReview + document.summary.needsChanges}</strong>
            <p>{adminCopy.publishGateDescription}</p>
          </article>
        </div>
      </section>

      <div className="stats-grid five-up">
        <OverviewStatCard label={copy.stats.total} value={String(document.summary.total)} tone="gold" />
        <OverviewStatCard label={copy.stats.pending} value={String(document.summary.pendingReview + document.summary.needsChanges)} tone="ivory" />
        <OverviewStatCard label={copy.stats.official} value={String(document.summary.officialListings)} tone="gold" />
        <OverviewStatCard label={copy.stats.community} value={String(document.summary.communityListings)} tone="ivory" />
        <OverviewStatCard label={copy.stats.suggestions} value={String(document.summary.suggestions)} tone="gold" />
      </div>

      <section className="content-card ecosystem-moderation-card">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.labels.queue}</span>
            <h2>{copy.labels.queue}</h2>
          </div>
        </div>

        {document.items.length === 0 ? (
          <div className="empty-state-panel empty-state-panel--compact">
            <h3>{copy.labels.emptyTitle}</h3>
            <p className="empty-state-panel__description">{copy.labels.emptyDescription}</p>
          </div>
        ) : (
          <div className="ecosystem-moderation-list">
            {document.items.map((item) => {
              const isSuggestion = item.listing.submissionChannel === 'community_suggestion';
              const canReview = item.listing.status === 'pending_review';
              const canPublish = item.listing.status === 'approved' && !isSuggestion;
              const tone = getEcosystemSubmissionChannelTone(item.listing.submissionChannel);
              const readOnlyReason =
                item.listing.status === 'draft'
                  ? copy.labels.draftReadOnly
                  : item.listing.status === 'needs_changes'
                    ? copy.labels.needsChangesReadOnly
                    : item.listing.status === 'published'
                      ? copy.labels.publishedReadOnly
                      : item.listing.status === 'approved' && isSuggestion
                        ? copy.labels.approvedSuggestionReadOnly
                        : null;

              return (
                <article className="ecosystem-moderation-item" key={item.listing.id}>
                  <div className="ecosystem-moderation-item__head">
                    <div>
                      <div className="ecosystem-owner-item__title-row">
                        <span className={`submission-channel-chip submission-channel-chip--${tone}`}>
                          {channelLabels[item.listing.submissionChannel]}
                        </span>
                        <span className="eyebrow-label">{typeLabels[item.listing.listingType]}</span>
                      </div>
                      <h3>{item.listing.title}</h3>
                      <p className="section-card__description">
                        {translateSystemNote(item.listing.shortDescription) || translateSystemNote(item.listing.longDescription) || copy.labels.pending}
                      </p>
                    </div>
                    <span className={`status-badge status-badge--${item.listing.status.replace('_', '-')}`}>{statusLabels[item.listing.status]}</span>
                  </div>

                  <dl className="ecosystem-moderation-item__meta">
                    <div>
                      <dt>{copy.labels.owner}</dt>
                      <dd>
                        <strong>{item.owner.displayName}</strong>
                        <span>{item.owner.email}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>{copy.labels.lane}</dt>
                      <dd>{channelLabels[item.listing.submissionChannel]}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.contact}</dt>
                      <dd>{item.listing.email || item.listing.phone || copy.labels.pending}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.location}</dt>
                      <dd>{formatLocation(item, copy.labels.pending)}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.googleMaps}</dt>
                      <dd>
                        {item.listing.googlePlaceName || item.listing.googleFormattedAddress || copy.labels.pending}
                        {item.listing.googleMapsUrl ? <a href={item.listing.googleMapsUrl} target="_blank" rel="noreferrer">{copy.labels.openMaps}</a> : null}
                      </dd>
                    </div>
                    <div>
                      <dt>{copy.labels.publishState}</dt>
                      <dd>
                        {item.listing.submissionChannel === 'community_suggestion'
                          ? copy.labels.internalOnly
                          : statusLabels[item.listing.status]}
                      </dd>
                    </div>
                    <div>
                      <dt>{copy.labels.reviewNote}</dt>
                      <dd>{translateSystemNote(item.listing.reviewNote) || copy.labels.pending}</dd>
                    </div>
                  </dl>

                  {isSuggestion ? (
                    <div className="submission-matrix-entry__meta">{copy.labels.internalDescription}</div>
                  ) : null}

                  <div className="ecosystem-moderation-item__actions">
                    {canReview ? (
                      <>
                        <form action={requestEcosystemChangesAction}>
                          <input type="hidden" name="listingId" value={item.listing.id} />
                          <button type="submit" className="button-secondary small">
                            {copy.labels.requestChanges}
                          </button>
                        </form>

                        <form action={approveEcosystemListingAction}>
                          <input type="hidden" name="listingId" value={item.listing.id} />
                          <button type="submit" className="button-ghost small">
                            {copy.labels.approve}
                          </button>
                        </form>
                      </>
                    ) : null}

                    {canPublish ? (
                      <form action={publishEcosystemListingAction}>
                        <input type="hidden" name="listingId" value={item.listing.id} />
                        <button type="submit" className="button-primary small">
                          {copy.labels.publish}
                        </button>
                      </form>
                    ) : null}

                    {readOnlyReason ? <span className="submission-matrix-entry__meta">{readOnlyReason}</span> : null}
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
