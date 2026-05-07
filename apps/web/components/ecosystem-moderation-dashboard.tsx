import { OverviewStatCard } from '@/components/overview-stat-card';
import type { Locale } from '@/lib/i18n';
import type { EcosystemModerationDocument, EcosystemModerationItem } from '@cane-corso-platform/contracts';
import {
  approveEcosystemListingAction,
  approveEcosystemMatchRequestAction,
  declineEcosystemMatchRequestAction,
  markEcosystemMatchConnectedAction,
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
      matchQueue: 'Admin-mediated connection requests',
      matchQueueDescription: 'Review member offers before deciding whether to connect both sides privately.',
      listingOwner: 'Listing owner',
      requester: 'Requester',
      requestMessage: 'Proposal',
      contactPreference: 'Contact preference',
      adminNote: 'Admin note',
      approveConnection: 'Allow connection',
      declineConnection: 'Decline',
      markConnected: 'Mark connected',
      matchPending: 'Pending admin review',
      matchApproved: 'Approved to connect',
      matchDeclined: 'Declined',
      matchConnected: 'Connected',
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
      matchQueue: 'Заявки за свързване през админ',
      matchQueueDescription: 'Прегледай предложенията от членове, преди да решиш дали да свържеш двете страни лично.',
      listingOwner: 'Собственик на обявата',
      requester: 'Предлагащ член',
      requestMessage: 'Предложение',
      contactPreference: 'Предпочитан контакт',
      adminNote: 'Бележка от админ',
      approveConnection: 'Позволи свързване',
      declineConnection: 'Откажи',
      markConnected: 'Маркирай като свързани',
      matchPending: 'Чака админ преглед',
      matchApproved: 'Одобрено за свързване',
      matchDeclined: 'Отказано',
      matchConnected: 'Свързани',
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
      matchQueue: 'Richieste di collegamento tramite admin',
      matchQueueDescription: 'Valuta le proposte dei membri prima di decidere se collegare le parti in privato.',
      listingOwner: 'Proprietario scheda',
      requester: 'Membro proponente',
      requestMessage: 'Proposta',
      contactPreference: 'Preferenza contatto',
      adminNote: 'Nota admin',
      approveConnection: 'Consenti collegamento',
      declineConnection: 'Rifiuta',
      markConnected: 'Segna collegati',
      matchPending: 'In revisione admin',
      matchApproved: 'Approvata per collegamento',
      matchDeclined: 'Rifiutata',
      matchConnected: 'Collegati',
    },
  },
} as const;

const ecosystemAdminPolishCopy = {
  en: {
    commandEyebrow: 'Ecosystem moderation',
    commandTitle: 'One queue for the full Cane Corso ecosystem',
    commandDescription:
      'Use this surface to separate official listings, community listings, internal suggestions, and sensitive member-to-member connection requests before anything becomes public.',
    official: 'Official listings',
    community: 'Community entries',
    publishGate: 'Publish gate',
    publishGateDescription: 'Only approved real listings can be published. Sensitive matches stay admin-mediated before people are connected.',
  },
  bg: {
    commandEyebrow: 'Модерация на екосистемата',
    commandTitle: 'Една опашка за цялата Cane Corso екосистема',
    commandDescription:
      'Тук разделяш официални записи, общностни записи, вътрешни предложения и чувствителни заявки за свързване преди нещо да стане публично.',
    official: 'Официални записи',
    community: 'Общностни записи',
    publishGate: 'Контрол преди публикуване',
    publishGateDescription: 'Само одобрени реални записи могат да се публикуват. Чувствителните съвпадения остават през админ преди хората да бъдат свързани.',
  },
  it: {
    commandEyebrow: 'Moderazione ecosystem',
    commandTitle: 'Una coda per tutto l’ecosistema Cane Corso',
    commandDescription:
      'Usa questa superficie per separare schede ufficiali, community, suggerimenti interni e richieste sensibili di collegamento prima della pubblicazione.',
    official: 'Schede ufficiali',
    community: 'Schede community',
    publishGate: 'Gate pubblicazione',
    publishGateDescription: 'Solo schede reali approvate possono essere pubblicate. I match sensibili restano mediati dall’admin prima di collegare le persone.',
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


  function matchStatusLabel(status: string) {
    if (status === 'approved_to_connect') return copy.labels.matchApproved;
    if (status === 'declined') return copy.labels.matchDeclined;
    if (status === 'connected') return copy.labels.matchConnected;
    return copy.labels.matchPending;
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
          <article className="admin-command-panel__lane">
            <span>{copy.labels.matchQueue}</span>
            <strong>{document.summary.pendingMatchRequests}</strong>
            <p>{copy.labels.matchQueueDescription}</p>
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

      <section className="content-card ecosystem-moderation-card ecosystem-match-requests-panel">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.labels.matchQueue}</span>
            <h2>{copy.labels.matchQueue}</h2>
            <p className="section-card__description">{copy.labels.matchQueueDescription}</p>
          </div>
        </div>

        {document.matchRequests.length === 0 ? (
          <div className="empty-state-panel empty-state-panel--compact">
            <h3>{copy.labels.matchQueue}</h3>
            <p className="empty-state-panel__description">{copy.labels.matchQueueDescription}</p>
          </div>
        ) : (
          <div className="ecosystem-moderation-list ecosystem-match-request-list">
            {document.matchRequests.map((matchRequest) => {
              const canReviewRequest = matchRequest.request.status === 'pending_review';
              const canMarkConnected = matchRequest.request.status === 'approved_to_connect';
              return (
                <article className="ecosystem-moderation-item ecosystem-match-request-item" key={matchRequest.request.id}>
                  <div className="ecosystem-moderation-item__head">
                    <div>
                      <div className="ecosystem-owner-item__title-row">
                        <span className="submission-channel-chip submission-channel-chip--community">{copy.labels.matchQueue}</span>
                        <span className="eyebrow-label">{typeLabels[matchRequest.listing.listingType]}</span>
                      </div>
                      <h3>{matchRequest.listing.title}</h3>
                      <p className="section-card__description">{matchRequest.request.message}</p>
                    </div>
                    <span className="status-badge status-badge--pending-review">{matchStatusLabel(matchRequest.request.status)}</span>
                  </div>

                  <dl className="ecosystem-moderation-item__meta">
                    <div>
                      <dt>{copy.labels.listingOwner}</dt>
                      <dd>
                        <strong>{matchRequest.listingOwner.displayName}</strong>
                        <span>{matchRequest.listingOwner.email}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>{copy.labels.requester}</dt>
                      <dd>
                        <strong>{matchRequest.requester.displayName}</strong>
                        <span>{matchRequest.requester.email}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>{copy.labels.contactPreference}</dt>
                      <dd>{matchRequest.request.contactPreference || copy.labels.pending}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.contact}</dt>
                      <dd>{matchRequest.request.email || matchRequest.request.phone || copy.labels.pending}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.location}</dt>
                      <dd>{[matchRequest.requester.city, matchRequest.requester.country].filter(Boolean).join(', ') || copy.labels.pending}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.adminNote}</dt>
                      <dd>{matchRequest.request.adminNote || copy.labels.pending}</dd>
                    </div>
                  </dl>

                  <div className="ecosystem-moderation-item__actions">
                    {canReviewRequest ? (
                      <>
                        <form action={approveEcosystemMatchRequestAction}>
                          <input type="hidden" name="requestId" value={matchRequest.request.id} />
                          <button type="submit" className="button-primary small">{copy.labels.approveConnection}</button>
                        </form>
                        <form action={declineEcosystemMatchRequestAction}>
                          <input type="hidden" name="requestId" value={matchRequest.request.id} />
                          <button type="submit" className="button-secondary small">{copy.labels.declineConnection}</button>
                        </form>
                      </>
                    ) : null}

                    {canMarkConnected ? (
                      <form action={markEcosystemMatchConnectedAction}>
                        <input type="hidden" name="requestId" value={matchRequest.request.id} />
                        <button type="submit" className="button-ghost small">{copy.labels.markConnected}</button>
                      </form>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

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
