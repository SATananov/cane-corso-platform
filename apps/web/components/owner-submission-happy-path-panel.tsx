'use client';

import type { DogLifecycleStatus } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';

interface OwnerSubmissionHappyPathPanelProps {
  locale: Locale;
  mode: 'create' | 'edit';
  dogId?: string;
  dogName?: string;
  lifecycleStatus: DogLifecycleStatus;
  hasBlockingIssues: boolean;
  completionCount: number;
  importantFieldsCount: number;
  galleryImageCount: number;
  pedigreeFilledCount: number;
  isSaving: boolean;
  isSubmitting: boolean;
  lastPersistedAtLabel?: string | null;
}

const happyPathCopy = {
  en: {
    eyebrow: 'Owner path',
    title: 'Complete the Cane Corso profile step by step',
    description:
      'Use this as a short checklist after the form. First save the profile, then submit it for review. Publication, certificate, and gallery selection remain separate USG review decisions.',
    activeDog: 'Active profile',
    newDog: 'New Cane Corso profile',
    saved: 'Last saved',
    notSavedYet: 'Not saved in this session yet',
    qualitySignals: 'Review checklist',
    photos: 'profile photos',
    pedigree: 'pedigree entries',
    requiredFields: 'required fields',
    steps: {
      profile: ['Profile details', 'Fill the required fields in the form above.'],
      draft: ['Save draft', 'Save privately before sending the profile for review.'],
      submission: ['Send for review', 'When the profile is ready, submit it for USG review.'],
      admin: ['USG review decision', 'Approval, publication, certificate, and gallery selection are handled separately by USG review.'],
    },
    states: {
      ready: 'Ready',
      attention: 'Needs attention',
      waiting: 'Waiting',
      active: 'Active',
      locked: 'USG review step',
      saving: 'Saving...',
      submitting: 'Submitting...',
      submitted: 'Submitted',
      draft: 'Draft',
    },
    actions: {
      overview: 'Back to My Cane Corso',
      media: 'Open photos',
      edit: 'Continue editing',
    },
  },
  bg: {
    eyebrow: 'Път на собственика',
    title: 'Довърши Cane Corso профила стъпка по стъпка',
    description:
      'Това е кратък чеклист след формата. Първо запази профила, после го изпрати за преглед. Публикуването, сертификатът и галерията остават отделни решения при USG прегледа.',
    activeDog: 'Активен профил',
    newDog: 'Нов Cane Corso профил',
    saved: 'Последно записване',
    notSavedYet: 'Още няма записване в тази сесия',
    qualitySignals: 'Чеклист за преглед',
    photos: 'снимки в профила',
    pedigree: 'родословни записи',
    requiredFields: 'задължителни полета',
    steps: {
      profile: ['Данни за профила', 'Попълни задължителните полета във формата по-горе.'],
      draft: ['Запази чернова', 'Запази лично, преди да изпратиш профила за преглед.'],
      submission: ['Изпрати за преглед', 'Когато профилът е готов, изпрати го за USG преглед.'],
      admin: ['Решение след USG преглед', 'Одобрението, публикуването, сертификатът и изборът за галерия се правят отделно при USG прегледа.'],
    },
    states: {
      ready: 'Готово',
      attention: 'Има нужда от внимание',
      waiting: 'Изчаква',
      active: 'Активно',
      locked: 'Стъпка за USG преглед',
      saving: 'Записване...',
      submitting: 'Изпращане...',
      submitted: 'Изпратено',
      draft: 'Чернова',
    },
    actions: {
      overview: 'Назад към Моите Cane Corso',
      media: 'Отвори снимките',
      edit: 'Продължи редакцията',
    },
  },
  it: {
    eyebrow: 'Percorso proprietario',
    title: 'Completa il profilo Cane Corso passo dopo passo',
    description:
      'Usa questo breve controllo dopo il modulo. Prima salva il profilo, poi invialo alla revisione. Pubblicazione, certificato e galleria restano decisioni separate della revisione USG.',
    activeDog: 'Profilo attivo',
    newDog: 'Nuovo profilo Cane Corso',
    saved: 'Ultimo salvataggio',
    notSavedYet: 'Non ancora salvato in questa sessione',
    qualitySignals: 'Controllo per revisione',
    photos: 'foto profilo',
    pedigree: 'voci pedigree',
    requiredFields: 'campi richiesti',
    steps: {
      profile: ['Dati profilo', 'Compila i campi richiesti nel modulo sopra.'],
      draft: ['Salva bozza', 'Salva privatamente prima di inviare il profilo alla revisione.'],
      submission: ['Invia alla revisione', 'Quando il profilo è pronto, invialo alla revisione USG.'],
      admin: ['Decisione della revisione USG', 'Approvazione, pubblicazione, certificato e scelta galleria sono gestiti separatamente dalla revisione USG.'],
    },
    states: {
      ready: 'Pronto',
      attention: 'Richiede attenzione',
      waiting: 'In attesa',
      active: 'Attivo',
      locked: 'Passo revisione USG',
      saving: 'Salvataggio...',
      submitting: 'Invio...',
      submitted: 'Inviato',
      draft: 'Bozza',
    },
    actions: {
      overview: 'Torna ai miei Cane Corso',
      media: 'Apri foto',
      edit: 'Continua modifica',
    },
  },
} as const;

function clampCount(value: number) {
  return Math.max(0, Number.isFinite(value) ? Math.floor(value) : 0);
}

function getStepClass(isReady: boolean, isActive = false) {
  return `owner-submission-happy-path__step${isReady ? ' is-ready' : ''}${isActive ? ' is-active' : ''}`;
}

export function OwnerSubmissionHappyPathPanel(props: OwnerSubmissionHappyPathPanelProps) {
  const copy = happyPathCopy[props.locale] ?? happyPathCopy.en;
  const completionCount = clampCount(props.completionCount);
  const importantFieldsCount = Math.max(1, clampCount(props.importantFieldsCount));
  const galleryImageCount = clampCount(props.galleryImageCount);
  const pedigreeFilledCount = clampCount(props.pedigreeFilledCount);
  const hasPersistedProfile = Boolean(props.dogId);
  const profileReady = completionCount >= importantFieldsCount && !props.hasBlockingIssues;
  const submittedOrBeyond = ['submitted', 'needs_changes', 'approved', 'published', 'archived'].includes(props.lifecycleStatus);
  const adminControlled = ['needs_changes', 'approved', 'published', 'archived'].includes(props.lifecycleStatus);
  const mediaHref = props.dogId ? `/my-dogs/${props.dogId}/media` : null;
  const editHref = props.dogId ? `/my-dogs/${props.dogId}/edit` : null;

  const steps = [
    {
      id: 'profile',
      label: copy.steps.profile[0],
      description: copy.steps.profile[1],
      ready: profileReady,
      active: !profileReady,
      state: profileReady ? copy.states.ready : copy.states.attention,
    },
    {
      id: 'draft',
      label: copy.steps.draft[0],
      description: copy.steps.draft[1],
      ready: hasPersistedProfile,
      active: hasPersistedProfile && !submittedOrBeyond,
      state: props.isSaving ? copy.states.saving : hasPersistedProfile ? copy.states.ready : copy.states.waiting,
    },
    {
      id: 'submission',
      label: copy.steps.submission[0],
      description: copy.steps.submission[1],
      ready: submittedOrBeyond,
      active: props.lifecycleStatus === 'submitted',
      state: props.isSubmitting ? copy.states.submitting : submittedOrBeyond ? copy.states.submitted : copy.states.draft,
    },
    {
      id: 'admin',
      label: copy.steps.admin[0],
      description: copy.steps.admin[1],
      ready: adminControlled,
      active: adminControlled,
      state: adminControlled ? copy.states.active : copy.states.locked,
    },
  ];

  return (
    <section className="owner-submission-happy-path" aria-label={copy.title}>
      <div className="owner-submission-happy-path__head">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h3>{copy.title}</h3>
          <p>{copy.description}</p>
        </div>
        <div className="owner-submission-happy-path__identity">
          <span>{props.dogName?.trim() ? copy.activeDog : copy.newDog}</span>
          <strong>{props.dogName?.trim() || copy.newDog}</strong>
          <small>
            {copy.saved}: {props.lastPersistedAtLabel ?? copy.notSavedYet}
          </small>
        </div>
      </div>

      <div className="owner-submission-happy-path__steps">
        {steps.map((step, index) => (
          <article className={getStepClass(step.ready, step.active)} key={step.id}>
            <span className="owner-submission-happy-path__index">{index + 1}</span>
            <div>
              <strong>{step.label}</strong>
              <p>{step.description}</p>
            </div>
            <em>{step.state}</em>
          </article>
        ))}
      </div>

      <div className="owner-submission-happy-path__footer">
        <div className="owner-submission-happy-path__metrics" aria-label={copy.qualitySignals}>
          <span>{completionCount}/{importantFieldsCount} {copy.requiredFields}</span>
          <span>{galleryImageCount}/3 {copy.photos}</span>
          <span>{pedigreeFilledCount} {copy.pedigree}</span>
        </div>
        <div className="owner-submission-happy-path__actions">
          <a className="button-secondary" href="/my-dogs">{copy.actions.overview}</a>
          {mediaHref ? <a className="button-ghost" href={mediaHref}>{copy.actions.media}</a> : null}
          {props.mode === 'create' && editHref ? <a className="button-ghost" href={editHref}>{copy.actions.edit}</a> : null}
        </div>
      </div>
    </section>
  );
}
