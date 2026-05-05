import { OverviewStatCard } from '@/components/overview-stat-card';
import { EcosystemSubmissionMatrix } from '@/components/ecosystem-submission-matrix';
import { LuxurySelect } from '@/components/luxury-select';
import type { Locale } from '@/lib/i18n';
import type {
  EcosystemListing,
  EcosystemListingStatus,
  EcosystemOwnerWorkspaceDocument,
  EcosystemSubmissionChannel,
} from '@cane-corso-platform/contracts';
import {
  saveEcosystemDraftAction,
  submitEcosystemListingAction,
} from '@/app/(member)/ecosystem/actions';
import {
  getEcosystemListingTypeLabels,
  getEcosystemListingStatusLabels,
  getEcosystemSubmissionChannelLabels,
  getEcosystemSubmissionChannelTone,
} from '@/lib/ecosystem-ui';

const copyByLocale = {
  en: {
    stats: {
      total: 'My entries',
      official: 'Official lanes',
      community: 'Community lanes',
      suggestions: 'Suggestions',
      published: 'Published',
    },
    labels: {
      formEyebrow: 'Private ecosystem submission',
      formTitle: 'Create a new entry',
      editFormTitle: 'Edit and resubmit this entry',
      formDescription:
        'The form is split into clear sections so the entry can be prepared calmly and reviewed cleanly. Nothing becomes public before admin approval.',
      editFormDescription:
        'Use this panel only for drafts or entries that need changes. Pending, approved, and published entries stay locked to protect the approval path.',
      workspaceNoticeTitle: 'Owner workspace safety',
      workspaceNoticeBody:
        'Drafts and returned entries can be edited here. Pending, approved, and published entries stay locked so public and admin review boundaries remain protected.',
      queueDescription:
        'Use this queue to see what can be changed now and what is waiting for admin review or publication.',
      editableState: 'Editable by you',
      lockedState: 'Protected state',
      draftActionHint: 'Draft — keep editing or submit when ready.',
      needsChangesActionHint: 'Returned for changes — edit the notes and resubmit for review.',
      pendingActionHint: 'Pending review — locked until an admin returns it or approves it.',
      approvedActionHint: 'Approved — locked until admin publication.',
      publishedActionHint: 'Published — the public listing is locked from owner edits.',
      flowSection: 'Submission path',
      flowHelp: 'Choose where this entry belongs before adding the public details.',
      identitySection: 'Core identity',
      identityHelp: 'Name the business, place, service, event, or Cane Corso opportunity clearly. This is the information an admin will review first.',
      contactSection: 'Contact details',
      contactHelp: 'Add only reliable channels that can be shown publicly after approval.',
      locationSection: 'Location and reach',
      locationHelp: 'Describe where the listing applies and whether it is local, national, or cross-border.',
      conditionsSection: 'Rules and notes',
      conditionsHelp: 'Use this area for local rules, large-breed suitability, transport coverage, or conditions that matter for Cane Corso owners.',
      submissionChannel: 'Submission lane',
      type: 'Ecosystem layer',
      title: 'Business, place, or Cane Corso opportunity',
      slug: 'Public slug',
      category: 'Category',
      shortDescription: 'Short description',
      longDescription: 'Long description',
      country: 'Country',
      city: 'City',
      website: 'Website',
      phone: 'Phone',
      email: 'Email',
      coverage: 'Coverage note',
      rules: 'Rules / local conditions',
      saveDraft: 'Save draft',
      saveChanges: 'Save changes',
      submit: 'Submit for review',
      resubmit: 'Resubmit for review',
      queue: 'My ecosystem entries',
      emptyTitle: 'You have not created ecosystem entries yet',
      emptyDescription:
        'Drafts, submissions, public listings, and internal suggestions will appear here after you start using the ecosystem workspace.',
      status: 'Status',
      location: 'Location',
      typeColumn: 'Layer',
      reviewNote: 'Review note',
      lane: 'Lane',
      publication: 'Public result',
      pending: 'Not set yet',
      edit: 'Continue editing',
      locked: 'Locked during review / publication',
      publishOfficial: 'Publishes as official listing',
      publishCommunity: 'Publishes as community listing',
      publishSuggestion: 'Stays internal until admin converts it',
    },
  },
  bg: {
    stats: {
      total: 'Моите записи',
      official: 'Официални пътеки',
      community: 'Общностни пътеки',
      suggestions: 'Предложения',
      published: 'Публикувани',
    },
    labels: {
      formEyebrow: 'Лично подаване към екосистемата',
      formTitle: 'Създай нов запис',
      editFormTitle: 'Редактирай и изпрати отново този запис',
      formDescription:
        'Формата е разделена на ясни части, за да подадеш запис спокойно и без излишно търсене. Записът става публичен само след админ одобрение.',
      editFormDescription:
        'Редакцията е достъпна само за чернови или записи, върнати за корекции. Чакащи, одобрени и публикувани записи остават заключени, за да се пази пътят за одобрение.',
      workspaceNoticeTitle: 'Безопасност на работното пространство',
      workspaceNoticeBody:
        'Тук можеш да редактираш чернови и записи, върнати за корекции. Чакащи, одобрени и публикувани записи остават заключени, за да се пазят публичните и админ границите.',
      queueDescription:
        'Използвай тази опашка, за да виждаш кое можеш да промениш сега и кое чака админ преглед или публикация.',
      editableState: 'Може да се редактира от теб',
      lockedState: 'Защитено състояние',
      draftActionHint: 'Чернова — продължи редакцията или изпрати за преглед, когато е готово.',
      needsChangesActionHint: 'Върнато за корекции — редактирай бележките и изпрати отново за преглед.',
      pendingActionHint: 'Чака преглед — заключено е, докато админ не го върне или одобри.',
      approvedActionHint: 'Одобрено — заключено е до админ публикация.',
      publishedActionHint: 'Публикувано — публичният запис е заключен от редакция от собственика.',
      flowSection: 'Пътека на записа',
      flowHelp: 'Избери къде принадлежи записът, преди да попълниш публичните детайли.',
      identitySection: 'Основна идентичност',
      identityHelp: 'Опиши ясно бизнеса, мястото, услугата, събитието или Cane Corso възможността. Това е първото, което админът ще прегледа.',
      contactSection: 'Контакт за връзка',
      contactHelp: 'Добави само надеждни канали, които могат да се показват публично след одобрение.',
      locationSection: 'Локация и обхват',
      locationHelp: 'Опиши къде важи записът и дали е локален, национален или международен.',
      conditionsSection: 'Условия и уточнения',
      conditionsHelp: 'Използвай тази част за местни правила, подходящост за едри породи, транспортен обхват или важни условия за собственици на Cane Corso.',
      submissionChannel: 'Пътека за изпращане',
      type: 'Слой на екосистемата',
      title: 'Име на бизнес, място или Cane Corso възможност',
      slug: 'Публичен адрес',
      category: 'Категория',
      shortDescription: 'Кратко описание',
      longDescription: 'Подробно описание',
      country: 'Държава',
      city: 'Град',
      website: 'Уебсайт',
      phone: 'Телефон',
      email: 'Имейл',
      coverage: 'Бележка за обхват',
      rules: 'Правила / местни условия',
      saveDraft: 'Запази чернова',
      saveChanges: 'Запази промените',
      submit: 'Изпрати за преглед',
      resubmit: 'Изпрати отново за преглед',
      queue: 'Моите записи в екосистемата',
      emptyTitle: 'Все още нямаш записи в екосистемата',
      emptyDescription:
        'Чернови, изпратени записи, публични обяви и вътрешни предложения ще се появяват тук, след като започнеш да използваш това работно пространство.',
      status: 'Статус',
      location: 'Локация',
      typeColumn: 'Тип',
      reviewNote: 'Бележка от преглед',
      lane: 'Пътека',
      publication: 'Публичен резултат',
      pending: 'Все още няма данни',
      edit: 'Продължи редакцията',
      locked: 'Заключено по време на преглед / публикация',
      publishOfficial: 'Публикува се като официален запис',
      publishCommunity: 'Публикува се като общностен запис',
      publishSuggestion: 'Остава вътрешно, докато админ не го превърне в реален запис',
    },
  },
  it: {
    stats: {
      total: 'Le mie voci',
      official: 'Percorsi ufficiali',
      community: 'Percorsi community',
      suggestions: 'Suggerimenti',
      published: 'Pubblicate',
    },
    labels: {
      formEyebrow: 'Invio privato ecosystem',
      formTitle: 'Crea una nuova voce',
      editFormTitle: 'Modifica e reinvia questa voce',
      formDescription:
        'Il modulo è diviso in sezioni chiare, così la voce può essere preparata con ordine e valutata correttamente. Nulla diventa pubblico prima dell’approvazione admin.',
      editFormDescription:
        'Usa questo pannello solo per bozze o voci che richiedono modifiche. Le voci in revisione, approvate e pubblicate restano bloccate per proteggere il percorso di approvazione.',
      workspaceNoticeTitle: 'Sicurezza dello spazio proprietario',
      workspaceNoticeBody:
        'Qui puoi modificare bozze e voci restituite per correzioni. Le voci in revisione, approvate e pubblicate restano bloccate per proteggere i confini pubblici e admin.',
      queueDescription:
        'Usa questa coda per capire cosa puoi modificare ora e cosa attende revisione admin o pubblicazione.',
      editableState: 'Modificabile da te',
      lockedState: 'Stato protetto',
      draftActionHint: 'Bozza — continua la modifica o invia quando è pronta.',
      needsChangesActionHint: 'Restituita per correzioni — modifica le note e reinvia per revisione.',
      pendingActionHint: 'In revisione — bloccata finché un admin non la restituisce o approva.',
      approvedActionHint: 'Approvata — bloccata fino alla pubblicazione admin.',
      publishedActionHint: 'Pubblicata — la scheda pubblica è bloccata dalle modifiche del proprietario.',
      flowSection: 'Percorso della voce',
      flowHelp: 'Scegli dove appartiene la voce prima di aggiungere i dettagli pubblici.',
      identitySection: 'Identità principale',
      identityHelp: 'Nomina con chiarezza business, luogo, servizio, evento o opportunità Cane Corso. È la prima parte che verrà valutata.',
      contactSection: 'Contatti',
      contactHelp: 'Aggiungi solo canali affidabili che possono essere mostrati pubblicamente dopo l’approvazione.',
      locationSection: 'Località e copertura',
      locationHelp: 'Descrivi dove è valida la voce e se la copertura è locale, nazionale o internazionale.',
      conditionsSection: 'Regole e note',
      conditionsHelp: 'Usa questa area per regole locali, idoneità a razze grandi, copertura trasporto o condizioni importanti per proprietari Cane Corso.',
      submissionChannel: 'Percorso di invio',
      type: 'Layer ecosystem',
      title: 'Titolo business, luogo o opportunità Cane Corso',
      slug: 'Slug pubblico',
      category: 'Categoria',
      shortDescription: 'Descrizione breve',
      longDescription: 'Descrizione estesa',
      country: 'Paese',
      city: 'Città',
      website: 'Sito web',
      phone: 'Telefono',
      email: 'Email',
      coverage: 'Nota copertura',
      rules: 'Regole / condizioni locali',
      saveDraft: 'Salva bozza',
      saveChanges: 'Salva modifiche',
      submit: 'Invia per revisione',
      resubmit: 'Reinvia per revisione',
      queue: 'Le mie voci ecosystem',
      emptyTitle: 'Non hai ancora creato voci ecosystem',
      emptyDescription:
        'Bozze, invii, schede pubbliche e suggerimenti interni appariranno qui dopo aver iniziato a usare questo spazio personale.',
      status: 'Stato',
      location: 'Località',
      typeColumn: 'Layer',
      reviewNote: 'Nota revisione',
      lane: 'Percorso',
      publication: 'Risultato pubblico',
      pending: 'Non ancora disponibile',
      edit: 'Continua modifica',
      locked: 'Bloccata durante revisione / pubblicazione',
      publishOfficial: 'Pubblica come scheda ufficiale',
      publishCommunity: 'Pubblica come scheda community',
      publishSuggestion: 'Resta interno finché l’admin non lo converte',
    },
  },
} as const;

type EcosystemOwnerCopy = (typeof copyByLocale)[keyof typeof copyByLocale];

function submissionOptions(locale: Locale) {
  const labels = getEcosystemSubmissionChannelLabels(locale);

  return (Object.entries(labels) as [EcosystemSubmissionChannel, string][]).map(([value, label]) => ({
    value,
    label,
  }));
}

function listingTypeOptions(locale: Locale) {
  const labels = getEcosystemListingTypeLabels(locale);

  return Object.entries(labels).map(([value, label]) => ({
    value,
    label,
  }));
}

function formatLocation(item: EcosystemListing, fallback: string) {
  const parts = [item.city, item.country].filter(Boolean);
  return parts.length ? parts.join(', ') : fallback;
}

function getPublicationSummary(localeCopy: EcosystemOwnerCopy, channel: EcosystemSubmissionChannel) {
  if (channel === 'official_listing') {
    return localeCopy.labels.publishOfficial;
  }

  if (channel === 'community_listing') {
    return localeCopy.labels.publishCommunity;
  }

  return localeCopy.labels.publishSuggestion;
}

function canEditMemberListing(status: EcosystemListingStatus) {
  return status === 'draft' || status === 'needs_changes';
}

function getOwnerActionHint(copy: EcosystemOwnerCopy, status: EcosystemListingStatus) {
  if (status === 'draft') {
    return copy.labels.draftActionHint;
  }

  if (status === 'needs_changes') {
    return copy.labels.needsChangesActionHint;
  }

  if (status === 'pending_review') {
    return copy.labels.pendingActionHint;
  }

  if (status === 'approved') {
    return copy.labels.approvedActionHint;
  }

  return copy.labels.publishedActionHint;
}

interface EcosystemListingFormProps {
  copy: EcosystemOwnerCopy;
  locale: Locale;
  item?: EcosystemListing;
  mode: 'create' | 'edit';
}

function EcosystemListingForm({ copy, locale, item, mode }: EcosystemListingFormProps) {
  const submissionLaneOptions = submissionOptions(locale);
  const options = listingTypeOptions(locale);
  const isEdit = mode === 'edit';

  return (
    <form className="ecosystem-owner-submission-form">
      {item ? <input type="hidden" name="listingId" value={item.id} /> : null}

      <fieldset className="ecosystem-form-card ecosystem-form-card--flow">
        <legend>{copy.labels.flowSection}</legend>
        <p className="ecosystem-form-card__description">{copy.labels.flowHelp}</p>
        <div className="ecosystem-form-card__fields ecosystem-form-card__fields--two">
          <div className="field-group">
            <label className="field-label" htmlFor={isEdit ? `submissionChannel-${item?.id}` : 'submissionChannel'}>{copy.labels.submissionChannel}</label>
            <LuxurySelect
              id={isEdit ? `submissionChannel-${item?.id}` : 'submissionChannel'}
              name="submissionChannel"
              defaultValue={item?.submissionChannel ?? 'official_listing'}
              options={submissionLaneOptions}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor={isEdit ? `listingType-${item?.id}` : 'listingType'}>{copy.labels.type}</label>
            <LuxurySelect
              id={isEdit ? `listingType-${item?.id}` : 'listingType'}
              name="listingType"
              defaultValue={item?.listingType ?? 'partner_service'}
              options={options}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="ecosystem-form-card">
        <legend>{copy.labels.identitySection}</legend>
        <p className="ecosystem-form-card__description">{copy.labels.identityHelp}</p>
        <div className="ecosystem-form-card__fields">
          <div className="field-group">
            <label className="field-label" htmlFor={isEdit ? `title-${item?.id}` : 'title'}>{copy.labels.title}</label>
            <input
              className="field-input"
              type="text"
              name="title"
              id={isEdit ? `title-${item?.id}` : 'title'}
              defaultValue={item?.title ?? ''}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor={isEdit ? `slug-${item?.id}` : 'slug'}>{copy.labels.slug}</label>
            <input
              className="field-input"
              type="text"
              name="slug"
              id={isEdit ? `slug-${item?.id}` : 'slug'}
              defaultValue={item?.slug ?? ''}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor={isEdit ? `category-${item?.id}` : 'category'}>{copy.labels.category}</label>
            <input
              className="field-input"
              type="text"
              name="category"
              id={isEdit ? `category-${item?.id}` : 'category'}
              defaultValue={item?.category ?? ''}
            />
          </div>

          <div className="field-group field-group--full">
            <label className="field-label" htmlFor={isEdit ? `shortDescription-${item?.id}` : 'shortDescription'}>{copy.labels.shortDescription}</label>
            <textarea
              className="field-textarea ecosystem-form-textarea--compact"
              name="shortDescription"
              id={isEdit ? `shortDescription-${item?.id}` : 'shortDescription'}
              rows={3}
              defaultValue={item?.shortDescription ?? ''}
            />
          </div>

          <div className="field-group field-group--full">
            <label className="field-label" htmlFor={isEdit ? `longDescription-${item?.id}` : 'longDescription'}>{copy.labels.longDescription}</label>
            <textarea
              className="field-textarea"
              name="longDescription"
              id={isEdit ? `longDescription-${item?.id}` : 'longDescription'}
              rows={4}
              defaultValue={item?.longDescription ?? ''}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="ecosystem-form-card">
        <legend>{copy.labels.contactSection}</legend>
        <p className="ecosystem-form-card__description">{copy.labels.contactHelp}</p>
        <div className="ecosystem-form-card__fields ecosystem-form-card__fields--three">
          <div className="field-group">
            <label className="field-label" htmlFor={isEdit ? `websiteUrl-${item?.id}` : 'websiteUrl'}>{copy.labels.website}</label>
            <input
              className="field-input"
              type="url"
              name="websiteUrl"
              id={isEdit ? `websiteUrl-${item?.id}` : 'websiteUrl'}
              defaultValue={item?.websiteUrl ?? ''}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor={isEdit ? `phone-${item?.id}` : 'phone'}>{copy.labels.phone}</label>
            <input
              className="field-input"
              type="text"
              name="phone"
              id={isEdit ? `phone-${item?.id}` : 'phone'}
              defaultValue={item?.phone ?? ''}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor={isEdit ? `email-${item?.id}` : 'email'}>{copy.labels.email}</label>
            <input
              className="field-input"
              type="email"
              name="email"
              id={isEdit ? `email-${item?.id}` : 'email'}
              defaultValue={item?.email ?? ''}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="ecosystem-form-card">
        <legend>{copy.labels.locationSection}</legend>
        <p className="ecosystem-form-card__description">{copy.labels.locationHelp}</p>
        <div className="ecosystem-form-card__fields">
          <div className="field-group">
            <label className="field-label" htmlFor={isEdit ? `country-${item?.id}` : 'country'}>{copy.labels.country}</label>
            <input
              className="field-input"
              type="text"
              name="country"
              id={isEdit ? `country-${item?.id}` : 'country'}
              defaultValue={item?.country ?? ''}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor={isEdit ? `city-${item?.id}` : 'city'}>{copy.labels.city}</label>
            <input
              className="field-input"
              type="text"
              name="city"
              id={isEdit ? `city-${item?.id}` : 'city'}
              defaultValue={item?.city ?? ''}
            />
          </div>

          <div className="field-group field-group--full">
            <label className="field-label" htmlFor={isEdit ? `coverageNote-${item?.id}` : 'coverageNote'}>{copy.labels.coverage}</label>
            <textarea
              className="field-textarea ecosystem-form-textarea--compact"
              name="coverageNote"
              id={isEdit ? `coverageNote-${item?.id}` : 'coverageNote'}
              rows={3}
              defaultValue={item?.coverageNote ?? ''}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="ecosystem-form-card">
        <legend>{copy.labels.conditionsSection}</legend>
        <p className="ecosystem-form-card__description">{copy.labels.conditionsHelp}</p>
        <div className="ecosystem-form-card__fields">
          <div className="field-group field-group--full">
            <label className="field-label" htmlFor={isEdit ? `rulesNote-${item?.id}` : 'rulesNote'}>{copy.labels.rules}</label>
            <textarea
              className="field-textarea ecosystem-form-textarea--compact"
              name="rulesNote"
              id={isEdit ? `rulesNote-${item?.id}` : 'rulesNote'}
              rows={3}
              defaultValue={item?.rulesNote ?? ''}
            />
          </div>
        </div>
      </fieldset>

      <div className="form-actions-bar ecosystem-form-actions">
        <div className="form-actions-copy">
          <span>{isEdit ? copy.labels.editFormDescription : copy.labels.formDescription}</span>
        </div>
        <div className="form-actions-buttons">
          <button formAction={saveEcosystemDraftAction} type="submit" className="button-secondary">
            {isEdit ? copy.labels.saveChanges : copy.labels.saveDraft}
          </button>
          <button formAction={submitEcosystemListingAction} type="submit" className="button-primary">
            {isEdit ? copy.labels.resubmit : copy.labels.submit}
          </button>
        </div>
      </div>
    </form>
  );
}

interface EcosystemOwnerWorkspaceProps {
  document: EcosystemOwnerWorkspaceDocument;
  locale: Locale;
}

export function EcosystemOwnerWorkspace({ document, locale }: EcosystemOwnerWorkspaceProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const typeLabels = getEcosystemListingTypeLabels(locale);
  const channelLabels = getEcosystemSubmissionChannelLabels(locale);
  const statusLabels = getEcosystemListingStatusLabels(locale);

  return (
    <div className="member-route-stack">
      <div className="stats-grid five-up">
        <OverviewStatCard label={copy.stats.total} value={String(document.summary.total)} tone="gold" />
        <OverviewStatCard label={copy.stats.official} value={String(document.summary.officialListings)} tone="ivory" />
        <OverviewStatCard label={copy.stats.community} value={String(document.summary.communityListings)} tone="gold" />
        <OverviewStatCard label={copy.stats.suggestions} value={String(document.summary.suggestions)} tone="ivory" />
        <OverviewStatCard label={copy.stats.published} value={String(document.summary.published)} tone="gold" />
      </div>

      <EcosystemSubmissionMatrix locale={locale} />

      <section className="ecosystem-owner-guardrail-card" aria-label={copy.labels.workspaceNoticeTitle}>
        <span className="eyebrow-label">{copy.labels.workspaceNoticeTitle}</span>
        <p>{copy.labels.workspaceNoticeBody}</p>
      </section>

      <section className="form-section-card">
        <div className="form-section-head">
          <span className="eyebrow-label">{copy.labels.formEyebrow}</span>
          <h2>{copy.labels.formTitle}</h2>
          <p>{copy.labels.formDescription}</p>
        </div>

        <EcosystemListingForm copy={copy} locale={locale} mode="create" />
      </section>

      <section className="content-card ecosystem-owner-card">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.labels.queue}</span>
            <h2>{copy.labels.queue}</h2>
            <p className="ecosystem-owner-queue-copy">{copy.labels.queueDescription}</p>
          </div>
        </div>

        {document.items.length === 0 ? (
          <div className="empty-state-panel empty-state-panel--compact">
            <h3>{copy.labels.emptyTitle}</h3>
            <p className="empty-state-panel__description">{copy.labels.emptyDescription}</p>
          </div>
        ) : (
          <div className="ecosystem-owner-list">
            {document.items.map((item) => {
              const tone = getEcosystemSubmissionChannelTone(item.submissionChannel);
              const editable = canEditMemberListing(item.status);

              return (
                <article className="ecosystem-owner-item" key={item.id}>
                  <div className="ecosystem-owner-item__head">
                    <div>
                      <div className="ecosystem-owner-item__title-row">
                        <span className={`submission-channel-chip submission-channel-chip--${tone}`}>
                          {channelLabels[item.submissionChannel]}
                        </span>
                        <span className="eyebrow-label">{typeLabels[item.listingType]}</span>
                      </div>
                      <h3>{item.title}</h3>
                    </div>
                    <span className={`status-badge status-badge--${item.status.replace('_', '-')}`}>{statusLabels[item.status]}</span>
                  </div>

                  <dl className="ecosystem-owner-item__meta">
                    <div>
                      <dt>{copy.labels.lane}</dt>
                      <dd>{channelLabels[item.submissionChannel]}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.typeColumn}</dt>
                      <dd>{typeLabels[item.listingType]}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.location}</dt>
                      <dd>{formatLocation(item, copy.labels.pending)}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.status}</dt>
                      <dd>{statusLabels[item.status]}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.publication}</dt>
                      <dd>{getPublicationSummary(copy, item.submissionChannel)}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.reviewNote}</dt>
                      <dd>{item.reviewNote || copy.labels.pending}</dd>
                    </div>
                  </dl>

                  <div
                    className={`ecosystem-owner-item__state-note ${
                      editable
                        ? 'ecosystem-owner-item__state-note--editable'
                        : 'ecosystem-owner-item__state-note--locked'
                    }`}
                  >
                    <strong>{editable ? copy.labels.editableState : copy.labels.lockedState}</strong>
                    <span>{getOwnerActionHint(copy, item.status)}</span>
                  </div>

                  {editable ? (
                    <details className="ecosystem-owner-edit-panel">
                      <summary>{copy.labels.edit}</summary>
                      <div className="ecosystem-owner-edit-panel__body">
                        <div className="form-section-head form-section-head--compact">
                          <span className="eyebrow-label">{copy.labels.formEyebrow}</span>
                          <h3>{copy.labels.editFormTitle}</h3>
                          <p>{copy.labels.editFormDescription}</p>
                        </div>
                        <EcosystemListingForm copy={copy} locale={locale} item={item} mode="edit" />
                      </div>
                    </details>
                  ) : (
                    <div className="ecosystem-owner-item__locked-note">{copy.labels.locked}</div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
