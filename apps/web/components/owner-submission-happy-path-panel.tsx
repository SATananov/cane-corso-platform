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
    eyebrow: 'Owner happy path',
    title: 'Submit a complete Cane Corso profile without losing context',
    description:
      'This panel keeps the owner journey visible: create the profile, save the draft, submit it for admin review, then wait for the official Registry / Certificate decisions. It does not change Auth, session, Registry, Certificate, Gallery, Verify, or admin authority boundaries.',
    activeDog: 'Active profile',
    newDog: 'New Cane Corso profile',
    saved: 'Last saved',
    notSavedYet: 'Not saved in this session yet',
    qualitySignals: 'Review quality signals',
    photos: 'profile photos',
    pedigree: 'pedigree entries',
    requiredFields: 'required fields',
    steps: {
      profile: ['Profile data', 'Required fields are ready for the server validation gate.'],
      draft: ['Draft persistence', 'The profile can be saved privately before review submission.'],
      submission: ['Review submission', 'The owner action moves the lifecycle from draft to submitted.'],
      admin: ['Admin decision', 'Only admin can approve, request changes, publish, certify, or curate gallery exposure.'],
    },
    states: {
      ready: 'Ready',
      attention: 'Needs attention',
      waiting: 'Waiting',
      active: 'Active',
      locked: 'Admin controlled',
      saving: 'Saving...',
      submitting: 'Submitting...',
      submitted: 'Submitted',
      draft: 'Draft',
    },
    actions: {
      overview: 'Back to My Cane Corso',
      media: 'Open media workspace',
      edit: 'Continue editing',
    },
  },
  bg: {
    eyebrow: 'Owner happy path',
    title: 'Подай завършен Cane Corso профил без да губиш контекст',
    description:
      'Този панел държи пътя на собственика видим: създаване на профил, запис като draft, подаване за admin преглед и чак след това официални решения за Registry / Certificate. Не променя Auth, session, Registry, Certificate, Gallery, Verify или admin authority границите.',
    activeDog: 'Активен профил',
    newDog: 'Нов Cane Corso профил',
    saved: 'Последно записване',
    notSavedYet: 'Още няма записване в тази сесия',
    qualitySignals: 'Сигнали за качество при преглед',
    photos: 'профилни снимки',
    pedigree: 'родословни записи',
    requiredFields: 'задължителни полета',
    steps: {
      profile: ['Данни на профила', 'Задължителните полета са готови за server validation gate.'],
      draft: ['Draft запис', 'Профилът може да се пази лично преди подаване за преглед.'],
      submission: ['Подаване за преглед', 'Owner действието мести lifecycle от draft към submitted.'],
      admin: ['Admin решение', 'Само admin може да одобри, върне промени, публикува, сертифицира или избере Gallery exposure.'],
    },
    states: {
      ready: 'Готово',
      attention: 'Има нужда от внимание',
      waiting: 'Изчаква',
      active: 'Активно',
      locked: 'Admin controlled',
      saving: 'Записване...',
      submitting: 'Подаване...',
      submitted: 'Подадено',
      draft: 'Draft',
    },
    actions: {
      overview: 'Назад към My Cane Corso',
      media: 'Отвори media workspace',
      edit: 'Продължи редакция',
    },
  },
  it: {
    eyebrow: 'Owner happy path',
    title: 'Invia un profilo Cane Corso completo senza perdere contesto',
    description:
      'Questo pannello mantiene visibile il percorso owner: creare il profilo, salvare il draft, inviarlo alla review admin, poi attendere decisioni ufficiali Registry / Certificate. Non modifica Auth, session, Registry, Certificate, Gallery, Verify o confini di autorita admin.',
    activeDog: 'Profilo attivo',
    newDog: 'Nuovo profilo Cane Corso',
    saved: 'Ultimo salvataggio',
    notSavedYet: 'Non salvato in questa sessione',
    qualitySignals: 'Segnali qualita review',
    photos: 'foto profilo',
    pedigree: 'voci pedigree',
    requiredFields: 'campi richiesti',
    steps: {
      profile: ['Dati profilo', 'I campi richiesti sono pronti per il server validation gate.'],
      draft: ['Persistenza draft', 'Il profilo puo essere salvato privatamente prima della review.'],
      submission: ['Invio review', 'L\'azione owner sposta il lifecycle da draft a submitted.'],
      admin: ['Decisione admin', 'Solo admin puo approvare, richiedere modifiche, pubblicare, certificare o curare la Gallery.'],
    },
    states: {
      ready: 'Pronto',
      attention: 'Richiede attenzione',
      waiting: 'In attesa',
      active: 'Attivo',
      locked: 'Admin controlled',
      saving: 'Salvataggio...',
      submitting: 'Invio...',
      submitted: 'Inviato',
      draft: 'Draft',
    },
    actions: {
      overview: 'Torna a My Cane Corso',
      media: 'Apri media workspace',
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
