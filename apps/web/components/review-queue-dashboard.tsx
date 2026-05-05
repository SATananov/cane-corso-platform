import Link from 'next/link';
import { StatusBadge } from '@/components/status-badge';
import { OverviewStatCard } from '@/components/overview-stat-card';
import { ImageLightbox } from '@/components/image-lightbox';
import { ReviewDecisionReadinessPanel } from '@/components/review-decision-readiness-panel';
import { AdminModerationActionFlowPanel } from '@/components/admin-moderation-action-flow-panel';
import type { Locale } from '@/lib/i18n';
import type { ReviewQueueDocument, ReviewQueueStatus } from '@cane-corso-platform/contracts';
import {
  applyReviewDecisionAction,
  issueReviewCertificateAction,
  publishReviewedSubmissionAction,
  revokeReviewCertificateAction,
  updateReviewDogAdminAssessmentAction,
  updateReviewDogMediaControlAction,
} from '@/app/(admin)/review/actions';

const copyByLocale = {
  en: {
    stats: {
      total: 'Profiles in queue',
      submitted: 'Pending review',
      approved: 'Approved',
      needsChanges: 'Needs changes',
      published: 'Published',
    },
    labels: {
      queue: 'Admin profile review',
      emptyTitle: 'No submitted profiles yet',
      emptyDescription:
        'As members submit Cane Corso profiles, they will appear here for approval, publication, certification, or change requests.',
      owner: 'Owner',
      submittedAt: 'Submitted',
      publishedAt: 'Published',
      location: 'Location',
      microchip: 'Microchip',
      pedigree: 'Pedigree',
      reviewNote: 'Latest note',
      requestChanges: 'Request changes',
      approve: 'Approve profile',
      publish: 'Publish to registry',
      openPublicProfile: 'Open public profile',
      verify: 'Verify certificate',
      issueCertificate: 'Issue USG certificate',
      revokeCertificate: 'Revoke certificate',
      openCertificate: 'Open certificate',
      issueCertificateWithPhoto: 'Issue certificate with this photo',
      chooseForCertificate: 'Choose for certificate',
      selectedForCertificate: 'Selected for certificate',
      certificatePhoto: 'Certificate photo',
      certificatePhotoNote: 'Certificate photo: choose any profile photo uploaded by the owner. It does not have to be the main Registry cover photo.',
      certificate: 'Certificate',
      certificatePending: 'Not issued yet',
      noReviewNote: 'No review note yet.',
      unknown: 'Pending',
      ownerPhotos: 'Owner photos',
      ownerPhotosDescription:
        'Photos are uploaded by the owner from My Cane Corso → profile/photos. Admin can choose one as the main Registry photo, a different one for the USG certificate, and separately one for USG Gallery.',
      noOwnerPhotos: 'The owner has not added photos yet.',
      mainPhoto: 'Main',
      makeMain: 'Make main',
      registryVisible: 'Visible in Registry',
      usgGalleryVisible: 'In USG Gallery',
      addToUsgGallery: 'Add this photo to USG Gallery',
      removeFromUsgGallery: 'Remove from USG Gallery',
      gallerySelectionNote: 'Selection is saved separately. It becomes visible on /gallery only when the profile has an active USG certificate.',
      saveMediaFlags: 'Save photo settings',
      visibleBadge: 'Visible',
      hiddenBadge: 'Hidden',
      adminAssessment: 'Admin assessment',
      adminAssessmentDescription:
        'Official admin evaluation stays separate from community votes. Use it to explain Registry approval and USG certificate readiness.',
      registryDecision: 'Registry decision',
      certificateDecision: 'Certificate decision',
      breedTypeScore: 'Breed type',
      temperamentScore: 'Temperament',
      pedigreeScore: 'Pedigree',
      healthScore: 'Health info',
      presentationScore: 'Presentation',
      overallScore: 'Overall',
      publicNote: 'Public admin note',
      privateNote: 'Private admin note',
      publicNotePlaceholder: 'Short public note for the registry profile...',
      privateNotePlaceholder: 'Internal note for admin only...',
      saveAssessment: 'Save assessment',
      selectScore: 'No score',
      notReviewed: 'Not reviewed',
      registryApprovedDecision: 'Registry approved',
      registryNotApprovedDecision: 'Not approved for Registry',
      certificateApprovedDecision: 'Approved for certificate',
      certificateNotApprovedDecision: 'Not approved for certificate',
      needsChangesDecision: 'Needs changes',
      usgCandidateDecision: 'USG candidate',
      usgCertifiedDecision: 'USG certified',
      systemNotePublished: 'Published to the public registry.',
      systemNoteRemoved: 'Removed from the public registry by admin action.',
      systemNoteReturned: 'Returned for corrections.',
      systemNoteSubmitted: 'Submitted for review.'
    },
  },
  bg: {
    stats: {
      total: 'Профили в опашката',
      submitted: 'Чакат преглед',
      approved: 'Одобрени',
      needsChanges: 'Искат корекции',
      published: 'Публикувани',
    },
    labels: {
      queue: 'Админ преглед на профили',
      emptyTitle: 'Все още няма изпратени профили',
      emptyDescription:
        'Когато членовете изпратят Cane Corso профили, те ще се появяват тук за одобрение, публикация в регистъра, издаване на сертификат или връщане за корекции.',
      owner: 'Собственик',
      submittedAt: 'Изпратен',
      publishedAt: 'Публикуван',
      location: 'Локация',
      microchip: 'Микрочип',
      pedigree: 'Родословие',
      reviewNote: 'Последна бележка',
      requestChanges: 'Върни за корекции',
      approve: 'Одобри профила',
      publish: 'Публикувай в регистъра',
      openPublicProfile: 'Отвори публичния профил',
      verify: 'Провери сертификата',
      issueCertificate: 'Издай USG сертификат',
      revokeCertificate: 'Отмени сертификата',
      openCertificate: 'Отвори сертификата',
      issueCertificateWithPhoto: 'Издай сертификат с тази снимка',
      chooseForCertificate: 'Избери за сертификат',
      selectedForCertificate: 'Избрана за сертификата',
      certificatePhoto: 'Снимка за сертификат',
      certificatePhotoNote: 'Снимка за сертификат: избери който и да е кадър, качен в профила от собственика. Не е задължително да е основната снимка/корицата.',
      certificate: 'Сертификат',
      certificatePending: 'Все още не е издаден',
      noReviewNote: 'Все още няма бележка от преглед.',
      unknown: 'В изчакване',
      ownerPhotos: 'Снимки от собственика',
      ownerPhotosDescription:
        'Снимките се качват от собственика в Моите Cane Corso → профил/снимки. Админът може да избере една за основна снимка в Регистъра, друга за USG сертификата и отделно снимка за USG Галерията.',
      noOwnerPhotos: 'Собственикът още не е добавил снимки.',
      mainPhoto: 'Основна',
      makeMain: 'Направи основна',
      registryVisible: 'Видима в Регистъра',
      usgGalleryVisible: 'В USG Галерията',
      addToUsgGallery: 'Добави тази снимка в USG Галерията',
      removeFromUsgGallery: 'Премахни от USG Галерията',
      gallerySelectionNote: 'Изборът се пази отделно. В /gallery се показва само ако профилът има активен USG сертификат.',
      saveMediaFlags: 'Запази настройките на снимката',
      visibleBadge: 'Видима',
      hiddenBadge: 'Скрита',
      adminAssessment: 'Админ оценка',
      adminAssessmentDescription:
        'Официалната админ оценка остава отделна от гласовете на общността. Тук се описва защо профилът е за Регистър и дали е кандидат за USG сертификат.',
      registryDecision: 'Решение за Регистър',
      certificateDecision: 'Решение за сертификат',
      breedTypeScore: 'Породен тип',
      temperamentScore: 'Темперамент',
      pedigreeScore: 'Родословие',
      healthScore: 'Здравна инфо',
      presentationScore: 'Представяне',
      overallScore: 'Обща оценка',
      publicNote: 'Публична админ бележка',
      privateNote: 'Вътрешна админ бележка',
      publicNotePlaceholder: 'Кратка публична бележка за профила в Регистъра...',
      privateNotePlaceholder: 'Вътрешна бележка само за администратора...',
      saveAssessment: 'Запази оценката',
      selectScore: 'Без оценка',
      notReviewed: 'Не е оценено',
      registryApprovedDecision: 'Одобрено за Регистър',
      registryNotApprovedDecision: 'Не е одобрено за Регистър',
      certificateApprovedDecision: 'Одобрено за сертификат',
      certificateNotApprovedDecision: 'Не е одобрено за сертификат',
      needsChangesDecision: 'Иска корекции',
      usgCandidateDecision: 'USG кандидат',
      usgCertifiedDecision: 'USG сертифицирано',
      systemNotePublished: 'Публикувано в публичния регистър.',
      systemNoteRemoved: 'Премахнато от публичния регистър от администратор.',
      systemNoteReturned: 'Върнато за корекции.',
      systemNoteSubmitted: 'Изпратено за преглед.'
    },
  },
  it: {
    stats: {
      total: 'Profili in coda',
      submitted: 'In attesa di revisione',
      approved: 'Approvati',
      needsChanges: 'Da correggere',
      published: 'Pubblicati',
    },
    labels: {
      queue: 'Coda di revisione profili',
      emptyTitle: 'Nessun profilo inviato',
      emptyDescription:
        'Quando i membri inviano profili Cane Corso, compariranno qui per approvazione, pubblicazione nel registro, certificazione o richiesta modifiche.',
      owner: 'Proprietario',
      submittedAt: 'Inviato',
      publishedAt: 'Pubblicato',
      location: 'Località',
      microchip: 'Microchip',
      pedigree: 'Pedigree',
      reviewNote: 'Ultima nota',
      requestChanges: 'Richiedi modifiche',
      approve: 'Approva profilo',
      publish: 'Pubblica nel registro',
      openPublicProfile: 'Apri il profilo pubblico',
      verify: 'Verifica certificato',
      issueCertificate: 'Emetti certificato USG',
      revokeCertificate: 'Revoca certificato',
      openCertificate: 'Apri certificato',
      issueCertificateWithPhoto: 'Emetti certificato con questa foto',
      chooseForCertificate: 'Scegli per certificato',
      selectedForCertificate: 'Scelta per certificato',
      certificatePhoto: 'Foto certificato',
      certificatePhotoNote: 'Foto certificato: scegli qualsiasi foto caricata nel profilo dal proprietario. Non deve essere per forza la foto principale del Registry.',
      certificate: 'Certificato',
      certificatePending: 'Non ancora emesso',
      noReviewNote: 'Nessuna nota di revisione ancora.',
      unknown: 'In attesa',
      ownerPhotos: 'Foto del proprietario',
      ownerPhotosDescription:
        'Le foto vengono caricate dal proprietario da My Cane Corso → profilo/foto. L\'admin può sceglierne una per il Registry, una diversa per il certificato USG e separatamente una per la USG Gallery.',
      noOwnerPhotos: 'Il proprietario non ha ancora aggiunto foto.',
      mainPhoto: 'Principale',
      makeMain: 'Rendi principale',
      registryVisible: 'Visibile nel Registry',
      usgGalleryVisible: 'Nella USG Gallery',
      addToUsgGallery: 'Aggiungi questa foto alla USG Gallery',
      removeFromUsgGallery: 'Rimuovi dalla USG Gallery',
      gallerySelectionNote: 'La selezione resta separata. Compare in /gallery solo quando il profilo ha un certificato USG attivo.',
      saveMediaFlags: 'Salva impostazioni foto',
      visibleBadge: 'Visibile',
      hiddenBadge: 'Nascosta',
      adminAssessment: 'Valutazione admin',
      adminAssessmentDescription:
        'La valutazione ufficiale admin resta separata dai voti community. Usala per spiegare il Registry e la preparazione al certificato USG.',
      registryDecision: 'Decisione Registry',
      certificateDecision: 'Decisione certificato',
      breedTypeScore: 'Tipo di razza',
      temperamentScore: 'Temperamento',
      pedigreeScore: 'Pedigree',
      healthScore: 'Info salute',
      presentationScore: 'Presentazione',
      overallScore: 'Valutazione generale',
      publicNote: 'Nota pubblica admin',
      privateNote: 'Nota privata admin',
      publicNotePlaceholder: 'Breve nota pubblica per il profilo Registry...',
      privateNotePlaceholder: 'Nota interna solo admin...',
      saveAssessment: 'Salva valutazione',
      selectScore: 'Nessun punteggio',
      notReviewed: 'Non valutato',
      registryApprovedDecision: 'Approvato Registry',
      registryNotApprovedDecision: 'Non approvato Registry',
      certificateApprovedDecision: 'Approvato certificato',
      certificateNotApprovedDecision: 'Non approvato certificato',
      needsChangesDecision: 'Da correggere',
      usgCandidateDecision: 'Candidato USG',
      usgCertifiedDecision: 'Certificato USG',
      systemNotePublished: 'Pubblicato nel registro pubblico.',
      systemNoteRemoved: 'Rimosso dal registro pubblico da azione admin.',
      systemNoteReturned: 'Restituito per correzioni.',
      systemNoteSubmitted: 'Inviato per revisione.'
    },
  },
} as const;

const reviewAdminPolishCopy = {
  en: {
    commandEyebrow: 'Admin review workflow',
    commandTitle: 'Registry first, USG certificate second',
    commandDescription:
      'This area is for final admin judgment: profile quality, media visibility, Registry publishing, and separate USG certification.',
    intake: '1. Intake',
    intakeDescription: 'Submitted profiles waiting for review or correction.',
    registry: '2. Registry decision',
    registryDescription: 'Approve and publish only profiles that are ready for the official public registry.',
    certificate: '3. USG certificate',
    certificateDescription: 'Issue or revoke certificates separately from normal Registry visibility.',
  },
  bg: {
    commandEyebrow: 'Админ преглед',
    commandTitle: 'Първо Registry, после USG сертификат',
    commandDescription:
      'Тази зона е за финалната админ преценка: качество на профила, видимост на снимките, публикуване в Registry и отделен USG сертификат.',
    intake: '1. Входящи профили',
    intakeDescription: 'Изпратени профили, които чакат преглед или корекции.',
    registry: '2. Registry решение',
    registryDescription: 'Одобрявай и публикувай само профили, готови за официалния публичен регистър.',
    certificate: '3. USG сертификат',
    certificateDescription: 'Издавай или отменяй сертификати отделно от нормалната видимост на Registry.',
  },
  it: {
    commandEyebrow: 'Workflow revisione admin',
    commandTitle: 'Prima Registry, poi certificato USG',
    commandDescription:
      'Questa area serve al giudizio admin finale: qualità profilo, visibilità media, pubblicazione Registry e certificazione USG separata.',
    intake: '1. Profili in arrivo',
    intakeDescription: 'Profili inviati in attesa di revisione o correzione.',
    registry: '2. Decisione Registry',
    registryDescription: 'Approva e pubblica solo profili pronti per il registro pubblico ufficiale.',
    certificate: '3. Certificato USG',
    certificateDescription: 'Emetti o revoca certificati separatamente dalla normale visibilità Registry.',
  },
} as const;

interface ReviewQueueDashboardProps {
  document: ReviewQueueDocument;
  locale: Locale;
}

function formatDateLabel(locale: Locale, value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatLocation(city: string | null, country: string | null, fallback: string) {
  const parts = [city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : fallback;
}

function translateSystemNote(note: string | null, copy: any): string {
  if (!note) return '';

  // Map system-generated English notes to translated versions
  const systemNoteMap: Record<string, string> = {
    'Published to the public registry.': copy.labels.systemNotePublished,
    'Removed from the public registry by admin action.': copy.labels.systemNoteRemoved,
    'Returned for corrections.': copy.labels.systemNoteReturned,
    'Submitted for review.': copy.labels.systemNoteSubmitted,
  };

  return systemNoteMap[note] || note;
}

function getVisibleActions(status: ReviewQueueStatus) {
  if (status === 'published') {
    return {
      canRequestChanges: false,
      canApprove: false,
      canPublish: false,
    };
  }

  if (status === 'approved') {
    return {
      canRequestChanges: true,
      canApprove: false,
      canPublish: true,
    };
  }

  return {
    canRequestChanges: true,
    canApprove: true,
    canPublish: false,
  };
}

export function ReviewQueueDashboard({ document, locale }: ReviewQueueDashboardProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const adminCopy = reviewAdminPolishCopy[locale] ?? reviewAdminPolishCopy.en;
  
  const registryDecisionOptions = [
    { value: 'not_reviewed', label: copy.labels.notReviewed },
    { value: 'registry_approved', label: copy.labels.registryApprovedDecision },
    { value: 'needs_changes', label: copy.labels.needsChangesDecision },
  ] as const;

  const certificateDecisionOptions = [
    { value: 'not_reviewed', label: copy.labels.notReviewed },
    { value: 'usg_candidate', label: copy.labels.certificateApprovedDecision },
    { value: 'usg_certified', label: copy.labels.certificateApprovedDecision },
    { value: 'needs_changes', label: copy.labels.needsChangesDecision },
  ] as const;

  const scoreOptions = [1, 2, 3, 4, 5] as const;

  return (
    <div className="member-route-stack">
      <section className="content-card admin-command-panel admin-command-panel--review">
        <div className="admin-command-panel__copy">
          <span className="eyebrow-label">{adminCopy.commandEyebrow}</span>
          <h2>{adminCopy.commandTitle}</h2>
          <p>{adminCopy.commandDescription}</p>
        </div>
        <div className="admin-command-panel__lanes">
          <article className="admin-command-panel__lane">
            <span>{adminCopy.intake}</span>
            <strong>{document.summary.submitted + document.summary.needsChanges}</strong>
            <p>{adminCopy.intakeDescription}</p>
          </article>
          <article className="admin-command-panel__lane">
            <span>{adminCopy.registry}</span>
            <strong>{document.summary.approved + document.summary.published}</strong>
            <p>{adminCopy.registryDescription}</p>
          </article>
          <article className="admin-command-panel__lane">
            <span>{adminCopy.certificate}</span>
            <strong>USG</strong>
            <p>{adminCopy.certificateDescription}</p>
          </article>
        </div>
      </section>

      <AdminModerationActionFlowPanel locale={locale} summary={document.summary} />

      <div className="stats-grid five-up">
        <OverviewStatCard label={copy.stats.total} value={String(document.summary.total)} tone="gold" />
        <OverviewStatCard label={copy.stats.submitted} value={String(document.summary.submitted)} tone="ivory" />
        <OverviewStatCard label={copy.stats.approved} value={String(document.summary.approved)} tone="gold" />
        <OverviewStatCard label={copy.stats.needsChanges} value={String(document.summary.needsChanges)} tone="ivory" />
        <OverviewStatCard label={copy.stats.published} value={String(document.summary.published)} tone="gold" />
      </div>

      <section className="content-card review-queue-card">
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
          <div className="review-queue-list">
            {document.items.map((item) => {
              const actions = getVisibleActions(item.status);
              const hasCertificate = Boolean(item.certificateCode || item.verificationSlug);
              const assessment = item.adminAssessment;

              return (
                <article className="review-queue-item" key={item.submissionId}>
                  <div className="review-queue-item__head">
                    <div>
                      <div className="review-queue-item__title-row">
                        <h3>{item.dog.name}</h3>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="review-queue-item__copy">{item.dog.shortDescription || copy.labels.noReviewNote}</p>
                    </div>
                    <div className="review-queue-item__meta-stack">
                      <div className="review-queue-item__meta-pill">
                        <span>{copy.labels.submittedAt}</span>
                        <strong>{formatDateLabel(locale, item.submittedAt) ?? copy.labels.unknown}</strong>
                      </div>
                      {item.publishedAt ? (
                        <div className="review-queue-item__meta-pill review-queue-item__meta-pill--published">
                          <span>{copy.labels.publishedAt}</span>
                          <strong>{formatDateLabel(locale, item.publishedAt) ?? copy.labels.unknown}</strong>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <dl className="review-queue-item__meta-grid">
                    <div>
                      <dt>{copy.labels.owner}</dt>
                      <dd>
                        <strong>{item.owner.displayName}</strong>
                        <span>{item.owner.email}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>{copy.labels.location}</dt>
                      <dd>{formatLocation(item.owner.city, item.owner.country, copy.labels.unknown)}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.microchip}</dt>
                      <dd>{item.dog.microchipNumber || copy.labels.unknown}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.pedigree}</dt>
                      <dd>{item.dog.pedigreeNumber || copy.labels.unknown}</dd>
                    </div>
                    <div>
                      <dt>{copy.labels.certificate}</dt>
                      <dd>{item.certificateCode || copy.labels.certificatePending}</dd>
                    </div>
                  </dl>

                  <div className="review-queue-item__note">
                    <span className="eyebrow-label">{copy.labels.reviewNote}</span>
                    <p>{translateSystemNote(item.currentReviewNote, copy) || copy.labels.noReviewNote}</p>
                  </div>

                  <ReviewDecisionReadinessPanel
                    locale={locale}
                    status={item.status}
                    dogName={item.dog.name}
                    ownerPhotoCount={item.ownerMedia.length}
                    registryVisiblePhotoCount={item.ownerMedia.filter((media) => media.isVisibleInRegistry).length}
                    gallerySelectedPhotoCount={item.ownerMedia.filter((media) => media.isVisibleInUsgGallery).length}
                    hasPedigree={Boolean(item.dog.pedigreeNumber)}
                    hasMicrochip={Boolean(item.dog.microchipNumber)}
                    hasOwnerStory={Boolean(item.dog.shortDescription)}
                    hasAdminAssessment={Boolean(
                      assessment?.overallScore ||
                      (assessment?.registryDecision && assessment.registryDecision !== 'not_reviewed') ||
                      (assessment?.certificateDecision && assessment.certificateDecision !== 'not_reviewed')
                    )}
                    hasCertificate={hasCertificate}
                    publicHref={item.status === 'published' ? `/registry/${item.publicRegistrySlug ?? item.dog.slug}` : null}
                    verifyHref={hasCertificate ? `/verify/${item.certificateCode ?? item.verificationSlug}` : null}
                  />

                  <div className="review-admin-assessment">
                    <div className="review-admin-assessment__head">
                      <div>
                        <span className="eyebrow-label">{copy.labels.adminAssessment}</span>
                        <h4>{copy.labels.adminAssessment}</h4>
                        <p>{copy.labels.adminAssessmentDescription}</p>
                      </div>
                      {assessment?.overallScore ? (
                        <div className="review-admin-assessment__score-pill">
                          <span>{copy.labels.overallScore}</span>
                          <strong>{assessment.overallScore}/5</strong>
                        </div>
                      ) : null}
                    </div>

                    <form action={updateReviewDogAdminAssessmentAction} className="review-admin-assessment__form">
                      <input type="hidden" name="dogId" value={item.dog.id} />

                      <div className="review-admin-assessment__decision-grid">
                        <label>
                          <span>{copy.labels.registryDecision}</span>
                          <select name="registryDecision" defaultValue={assessment?.registryDecision ?? 'not_reviewed'}>
                            {registryDecisionOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          <span>{copy.labels.certificateDecision}</span>
                          <select name="certificateDecision" defaultValue={assessment?.certificateDecision ?? 'not_reviewed'}>
                            {certificateDecisionOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="review-admin-assessment__score-grid">
                        {[
                          ['breedTypeScore', copy.labels.breedTypeScore, assessment?.breedTypeScore],
                          ['temperamentScore', copy.labels.temperamentScore, assessment?.temperamentScore],
                          ['pedigreeScore', copy.labels.pedigreeScore, assessment?.pedigreeScore],
                          ['healthScore', copy.labels.healthScore, assessment?.healthScore],
                          ['presentationScore', copy.labels.presentationScore, assessment?.presentationScore],
                          ['overallScore', copy.labels.overallScore, assessment?.overallScore],
                        ].map(([name, label, value]) => (
                          <label key={String(name)}>
                            <span>{label}</span>
                            <select name={String(name)} defaultValue={value ? String(value) : ''}>
                              <option value="">{copy.labels.selectScore}</option>
                              {scoreOptions.map((score) => (
                                <option key={score} value={score}>{score}/5</option>
                              ))}
                            </select>
                          </label>
                        ))}
                      </div>

                      <div className="review-admin-assessment__notes-grid">
                        <label>
                          <span>{copy.labels.publicNote}</span>
                          <textarea name="publicNote" rows={3} defaultValue={assessment?.publicNote ?? ''} placeholder={copy.labels.publicNotePlaceholder} />
                        </label>
                        <label>
                          <span>{copy.labels.privateNote}</span>
                          <textarea name="privateNote" rows={3} defaultValue={assessment?.privateNote ?? ''} placeholder={copy.labels.privateNotePlaceholder} />
                        </label>
                      </div>

                      <button type="submit" className="button-primary small review-admin-assessment__submit">
                        {copy.labels.saveAssessment}
                      </button>
                    </form>
                  </div>

                  <div className="review-media-control">
                    <div className="review-media-control__head">
                      <div>
                        <span className="eyebrow-label">{copy.labels.ownerPhotos}</span>
                        <h4>{copy.labels.ownerPhotos}</h4>
                        <p>{copy.labels.ownerPhotosDescription}</p>
                      </div>
                    </div>

                    {item.ownerMedia.length === 0 ? (
                      <p className="review-media-control__empty">{copy.labels.noOwnerPhotos}</p>
                    ) : (
                      <div className="review-media-control__grid">
                        {item.ownerMedia.map((media, index) => (
                          <article className="review-media-control__item" key={media.id}>
                            <div className="review-media-control__preview">
                              {media.url ? (
                                <ImageLightbox
                                  src={media.url}
                                  alt={media.altText || `${item.dog.name} ${index + 1}`}
                                  openLabel={`Open ${item.dog.name} photo ${index + 1}`}
                                />
                              ) : (
                                <span>{item.dog.name.slice(0, 1)}</span>
                              )}
                            </div>

                            <div className="review-media-control__badges">
                              {media.isPrimary ? <span className="route-pill route-pill--glow">{copy.labels.mainPhoto}</span> : null}
                              <span className={`route-pill subtle${media.isVisibleInRegistry ? '' : ' route-pill--muted'}`}>
                                {copy.labels.registryVisible}: {media.isVisibleInRegistry ? copy.labels.visibleBadge : copy.labels.hiddenBadge}
                              </span>
                              <span className={`route-pill subtle${media.isVisibleInUsgGallery ? '' : ' route-pill--muted'}`}>
                                {copy.labels.usgGalleryVisible}: {media.isVisibleInUsgGallery ? copy.labels.visibleBadge : copy.labels.hiddenBadge}
                              </span>
                              {hasCertificate && media.url && item.certificateImageUrl === media.url ? (
                                <span className="route-pill route-pill--glow">{copy.labels.certificatePhoto}</span>
                              ) : null}
                            </div>

                            <form action={updateReviewDogMediaControlAction} className="review-media-control__form">
                              <input type="hidden" name="intent" value="update_visibility" />
                              <input type="hidden" name="dogId" value={item.dog.id} />
                              <input type="hidden" name="mediaId" value={media.id} />
                              <label className="review-media-control__check">
                                <input type="checkbox" name="visibleInRegistry" defaultChecked={media.isVisibleInRegistry} />
                                <span>{copy.labels.registryVisible}</span>
                              </label>
                              <label className="review-media-control__check">
                                <input type="checkbox" name="visibleInUsgGallery" defaultChecked={media.isVisibleInUsgGallery} />
                                <span>{copy.labels.usgGalleryVisible}</span>
                              </label>
                              <button type="submit" className="button-secondary small">
                                {copy.labels.saveMediaFlags}
                              </button>
                            </form>

                            <p className="review-media-control__hint">{copy.labels.gallerySelectionNote}</p>

                            {media.isVisibleInUsgGallery ? (
                              <form action={updateReviewDogMediaControlAction} className="review-media-control__gallery-form">
                                <input type="hidden" name="intent" value="update_visibility" />
                                <input type="hidden" name="dogId" value={item.dog.id} />
                                <input type="hidden" name="mediaId" value={media.id} />
                                {media.isVisibleInRegistry ? <input type="hidden" name="visibleInRegistry" value="on" /> : null}
                                <button type="submit" className="button-secondary button-secondary--danger small">
                                  {copy.labels.removeFromUsgGallery}
                                </button>
                              </form>
                            ) : (
                              <form action={updateReviewDogMediaControlAction} className="review-media-control__gallery-form">
                                <input type="hidden" name="intent" value="update_visibility" />
                                <input type="hidden" name="dogId" value={item.dog.id} />
                                <input type="hidden" name="mediaId" value={media.id} />
                                {media.isVisibleInRegistry ? <input type="hidden" name="visibleInRegistry" value="on" /> : null}
                                <input type="hidden" name="visibleInUsgGallery" value="on" />
                                <button type="submit" className="button-primary small">
                                  {copy.labels.addToUsgGallery}
                                </button>
                              </form>
                            )}

                            {item.status === 'published' && media.url ? (
                              <form action={issueReviewCertificateAction} className="review-media-control__certificate-form">
                                <input type="hidden" name="dogId" value={item.dog.id} />
                                <input type="hidden" name="certificateImageUrl" value={media.url} />
                                <button
                                  type="submit"
                                  className={hasCertificate && item.certificateImageUrl === media.url ? 'button-secondary small' : 'button-primary small'}
                                  disabled={hasCertificate && item.certificateImageUrl === media.url}
                                >
                                  {hasCertificate
                                    ? item.certificateImageUrl === media.url
                                      ? copy.labels.selectedForCertificate
                                      : copy.labels.chooseForCertificate
                                    : copy.labels.issueCertificateWithPhoto}
                                </button>
                              </form>
                            ) : null}

                            {!media.isPrimary ? (
                              <form action={updateReviewDogMediaControlAction} className="review-media-control__primary-form">
                                <input type="hidden" name="intent" value="set_primary" />
                                <input type="hidden" name="dogId" value={item.dog.id} />
                                <input type="hidden" name="mediaId" value={media.id} />
                                <button type="submit" className="button-primary small">
                                  {copy.labels.makeMain}
                                </button>
                              </form>
                            ) : null}
                          </article>
                        ))}
                      </div>
                    )}
                  </div>

                  {item.status === 'published' ? (
                    <div className="review-queue-item__actions">
                      <Link href={`/registry/${item.publicRegistrySlug ?? item.dog.slug}`} className="button-secondary small">
                        {copy.labels.openPublicProfile}
                      </Link>
                      {hasCertificate ? (
                        <>
                          <Link href={`/verify/${item.certificateCode ?? item.verificationSlug}`} className="button-ghost small">
                            {copy.labels.verify}
                          </Link>
                          <Link href={`/certificate/${item.certificateCode ?? item.verificationSlug}`} className="button-primary small">
                            {copy.labels.openCertificate}
                          </Link>
                          <form action={revokeReviewCertificateAction}>
                            <input type="hidden" name="dogId" value={item.dog.id} />
                            <button type="submit" className="button-secondary button-secondary--danger small">
                              {copy.labels.revokeCertificate}
                            </button>
                          </form>
                        </>
                      ) : (
                        <form action={issueReviewCertificateAction}>
                          <input type="hidden" name="dogId" value={item.dog.id} />
                          <button type="submit" className="button-primary small review-publish-button">
                            {copy.labels.issueCertificate}
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    <div className="review-queue-item__actions">
                      {actions.canRequestChanges ? (
                        <form action={applyReviewDecisionAction}>
                          <input type="hidden" name="submissionId" value={item.submissionId} />
                          <input type="hidden" name="decision" value="needs_changes" />
                          <button type="submit" className="button-secondary small">
                            {copy.labels.requestChanges}
                          </button>
                        </form>
                      ) : null}

                      {actions.canApprove ? (
                        <form action={applyReviewDecisionAction}>
                          <input type="hidden" name="submissionId" value={item.submissionId} />
                          <input type="hidden" name="decision" value="approve" />
                          <button type="submit" className="button-primary small review-approve-button">
                            {copy.labels.approve}
                          </button>
                        </form>
                      ) : null}

                      {actions.canPublish ? (
                        <form action={publishReviewedSubmissionAction}>
                          <input type="hidden" name="submissionId" value={item.submissionId} />
                          <button type="submit" className="button-primary small review-publish-button">
                            {copy.labels.publish}
                          </button>
                        </form>
                      ) : null}
                    </div>
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
