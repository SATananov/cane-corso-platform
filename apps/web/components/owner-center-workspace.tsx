import Link from 'next/link';
import { OverviewStatCard } from '@/components/overview-stat-card';
import { OwnerJourneyCommandCenter } from '@/components/owner-journey-command-center';
import type { Locale } from '@/lib/i18n';
import type { OwnerCenterDocument } from '@/lib/owner-center.server';

type OwnerCenterTaskId =
  | 'create-first-cane-corso'
  | 'finish-cane-corso-drafts'
  | 'dog-review-changes'
  | 'ecosystem-review-changes'
  | 'ecosystem-drafts'
  | 'start-ecosystem-layer'
  | 'workspace-healthy';

interface OwnerCenterTaskView {
  id: OwnerCenterTaskId;
  tone: 'gold' | 'ivory';
  title: string;
  description: string;
  href: string;
  meta: string;
}

const taskCopyByLocale: Record<Locale, Record<OwnerCenterTaskId, { title: string; description: string; meta: string }>> = {
  en: {
    'create-first-cane-corso': {
      title: 'Create your first Cane Corso profile',
      description: 'Start with a private profile. When it is ready, you can send it for registry review.',
      meta: 'First step',
    },
    'finish-cane-corso-drafts': {
      title: 'Finish Cane Corso drafts',
      description: 'Draft profiles stay private until you decide to submit them for review.',
      meta: '{count} draft profile(s)',
    },
    'dog-review-changes': {
      title: 'Review requested Cane Corso changes',
      description: 'Update returned profiles before sending them back for review.',
      meta: '{count} profile(s) need changes',
    },
    'ecosystem-review-changes': {
      title: 'Update returned community/service entries',
      description: 'Reviewer notes are waiting on one or more ecosystem entries.',
      meta: '{count} entry/entries need changes',
    },
    'ecosystem-drafts': {
      title: 'Complete community/service drafts',
      description: 'Draft entries remain private until they pass the review path.',
      meta: '{count} draft entry/entries',
    },
    'start-ecosystem-layer': {
      title: 'Add a useful place or service',
      description: 'Suggest a trusted place, service, event, or Cane Corso opportunity for review.',
      meta: 'Optional',
    },
    'workspace-healthy': {
      title: 'Everything important is up to date',
      description: 'No drafts or returned entries need immediate action right now.',
      meta: 'Ready',
    },
  },
  bg: {
    'create-first-cane-corso': {
      title: 'Създай първия си Cane Corso профил',
      description: 'Започни с личен профил. Когато е готов, можеш да го изпратиш за преглед към регистъра.',
      meta: 'Първа стъпка',
    },
    'finish-cane-corso-drafts': {
      title: 'Довърши черновите на Cane Corso профилите',
      description: 'Черновите остават лични, докато не решиш да ги изпратиш за преглед.',
      meta: '{count} профил(а) в чернова',
    },
    'dog-review-changes': {
      title: 'Прегледай върнатите корекции',
      description: 'Обнови върнатите Cane Corso профили, преди да ги изпратиш отново за преглед.',
      meta: '{count} профил(а) изискват корекции',
    },
    'ecosystem-review-changes': {
      title: 'Обнови върнатите записи за общност/услуги',
      description: 'Има бележки от преглед по един или повече записи в екосистемата.',
      meta: '{count} запис(а) изискват корекции',
    },
    'ecosystem-drafts': {
      title: 'Довърши черновите за общност/услуги',
      description: 'Черновите остават лични, докато не минат през пътя за преглед.',
      meta: '{count} запис(а) в чернова',
    },
    'start-ecosystem-layer': {
      title: 'Добави полезно място или услуга',
      description: 'Предложи доверено място, услуга, събитие или Cane Corso възможност за преглед.',
      meta: 'По избор',
    },
    'workspace-healthy': {
      title: 'Всичко важно е подредено',
      description: 'В момента няма чернови или върнати записи, които изискват незабавно действие.',
      meta: 'Готово',
    },
  },
  it: {
    'create-first-cane-corso': {
      title: 'Crea il tuo primo profilo Cane Corso',
      description: 'Inizia con un profilo privato. Quando è pronto puoi inviarlo alla revisione del registro.',
      meta: 'Primo passo',
    },
    'finish-cane-corso-drafts': {
      title: 'Completa le bozze Cane Corso',
      description: 'Le bozze restano private finché non decidi di inviarle alla revisione.',
      meta: '{count} profilo/i in bozza',
    },
    'dog-review-changes': {
      title: 'Rivedi le correzioni richieste',
      description: 'Aggiorna i profili Cane Corso restituiti prima di inviarli di nuovo.',
      meta: '{count} profilo/i richiedono modifiche',
    },
    'ecosystem-review-changes': {
      title: 'Aggiorna le voci community/servizi restituite',
      description: 'Ci sono note di revisione su una o più voci dell’ecosistema.',
      meta: '{count} voce/i richiedono modifiche',
    },
    'ecosystem-drafts': {
      title: 'Completa le bozze community/servizi',
      description: 'Le bozze restano private finché non passano dal percorso di revisione.',
      meta: '{count} voce/i in bozza',
    },
    'start-ecosystem-layer': {
      title: 'Aggiungi un luogo o servizio utile',
      description: 'Suggerisci un luogo, servizio, evento o opportunità Cane Corso da revisionare.',
      meta: 'Opzionale',
    },
    'workspace-healthy': {
      title: 'Tutto l’essenziale è aggiornato',
      description: 'Non ci sono bozze o voci restituite che richiedono azione immediata.',
      meta: 'Pronto',
    },
  },
};

const copyByLocale = {
  en: {
    identity: 'Owner account',
    role: 'Role',
    location: 'Location',
    noLocation: 'Not set',
    email: 'Email',
    roles: {
      admin: 'Administrator',
      member: 'Member',
      partner: 'Partner',
    },
    stats: {
      caneCorso: 'Cane Corso',
      submitted: 'Need attention',
      published: 'Public',
      certified: 'USG',
      ecosystem: 'Community/services',
    },
    sections: {
      tasksEyebrow: 'Next step',
      tasksTitle: 'What matters now',
      tasksDescription: 'The dashboard starts with the next practical action, then keeps the deeper guidance below.',
      lanesEyebrow: 'Main areas',
      lanesTitle: 'Go directly where you need',
      journeyEyebrow: 'More detail',
      journeyTitle: 'Review the full owner journey',
      journeySummary: 'Open this only when you want the complete path from private profile to public trust.',
    },
    actions: {
      open: 'Open',
      manage: 'Manage',
    },
    lanes: [
      {
        eyebrow: 'Profiles',
        title: 'My Cane Corso',
        description: 'Create, edit, submit, and follow private Cane Corso profiles.',
        href: '/my-dogs',
        meta: 'profiles • photos • review',
      },
      {
        eyebrow: 'Care log',
        title: 'Health and growth',
        description: 'Track weight, height, vaccines, deworming, visits, and notes for one Cane Corso.',
        href: '__health__',
        meta: 'weight • vaccines • vet notes',
      },
      {
        eyebrow: 'Owner',
        title: 'Owner profile',
        description: 'Keep the private owner identity and contact details behind your submissions updated.',
        href: '/profile',
        meta: 'identity • contacts',
      },
      {
        eyebrow: 'Community',
        title: 'Community and services',
        description: 'Submit or follow places, services, events, and Cane Corso requests through review.',
        href: '/ecosystem',
        meta: 'places • services • matching',
      },
    ],
  },
  bg: {
    identity: 'Акаунт на собственика',
    role: 'Роля',
    location: 'Локация',
    noLocation: 'Не е зададена',
    email: 'Имейл',
    roles: {
      admin: 'Администратор',
      member: 'Член',
      partner: 'Партньор',
    },
    stats: {
      caneCorso: 'Cane Corso',
      submitted: 'За внимание',
      published: 'Публични',
      certified: 'USG',
      ecosystem: 'Общност/услуги',
    },
    sections: {
      tasksEyebrow: 'Следваща стъпка',
      tasksTitle: 'Какво е важно сега',
      tasksDescription: 'Таблото започва с реалното следващо действие, а по-дългите насоки остават по-надолу.',
      lanesEyebrow: 'Основни зони',
      lanesTitle: 'Отиди директно там, където ти трябва',
      journeyEyebrow: 'Повече детайл',
      journeyTitle: 'Виж пълния път на собственика',
      journeySummary: 'Отвори това само когато искаш целия път от личен профил до публично доверие.',
    },
    actions: {
      open: 'Отвори',
      manage: 'Управлявай',
    },
    lanes: [
      {
        eyebrow: 'Профили',
        title: 'Моите Cane Corso',
        description: 'Създавай, редактирай, изпращай и следи личните Cane Corso профили.',
        href: '/my-dogs',
        meta: 'профили • снимки • преглед',
      },
      {
        eyebrow: 'Дневник за грижа',
        title: 'Здраве и растеж',
        description: 'Следи тегло, височина, ваксини, обезпаразитяване, прегледи и бележки за един Cane Corso.',
        href: '__health__',
        meta: 'тегло • ваксини • прегледи',
      },
      {
        eyebrow: 'Собственик',
        title: 'Профил на собственика',
        description: 'Поддържай личната идентичност и контактните данни зад твоите заявки актуални.',
        href: '/profile',
        meta: 'идентичност • контакти',
      },
      {
        eyebrow: 'Общност',
        title: 'Общност и услуги',
        description: 'Подавай или следи места, услуги, събития и Cane Corso заявки през преглед.',
        href: '/ecosystem',
        meta: 'места • услуги • свързване',
      },
    ],
  },
  it: {
    identity: 'Account proprietario',
    role: 'Ruolo',
    location: 'Località',
    noLocation: 'Non impostata',
    email: 'Email',
    roles: {
      admin: 'Amministratore',
      member: 'Membro',
      partner: 'Partner',
    },
    stats: {
      caneCorso: 'Cane Corso',
      submitted: 'Da seguire',
      published: 'Pubblici',
      certified: 'USG',
      ecosystem: 'Community/servizi',
    },
    sections: {
      tasksEyebrow: 'Prossimo passo',
      tasksTitle: 'Cosa conta adesso',
      tasksDescription: 'La dashboard inizia dall’azione pratica successiva e lascia la guida più lunga sotto.',
      lanesEyebrow: 'Aree principali',
      lanesTitle: 'Vai direttamente dove ti serve',
      journeyEyebrow: 'Più dettaglio',
      journeyTitle: 'Vedi il percorso completo del proprietario',
      journeySummary: 'Aprilo solo quando vuoi il percorso completo dal profilo privato alla fiducia pubblica.',
    },
    actions: {
      open: 'Apri',
      manage: 'Gestisci',
    },
    lanes: [
      {
        eyebrow: 'Profili',
        title: 'I miei Cane Corso',
        description: 'Crea, modifica, invia e segui i profili Cane Corso privati.',
        href: '/my-dogs',
        meta: 'profili • foto • revisione',
      },
      {
        eyebrow: 'Diario cura',
        title: 'Salute e crescita',
        description: 'Segui peso, altezza, vaccini, sverminazione, visite e note per un Cane Corso.',
        href: '__health__',
        meta: 'peso • vaccini • visite',
      },
      {
        eyebrow: 'Proprietario',
        title: 'Profilo proprietario',
        description: 'Mantieni aggiornati identità privata e contatti collegati ai tuoi invii.',
        href: '/profile',
        meta: 'identità • contatti',
      },
      {
        eyebrow: 'Community',
        title: 'Community e servizi',
        description: 'Invia o segui luoghi, servizi, eventi e richieste Cane Corso con revisione.',
        href: '/ecosystem',
        meta: 'luoghi • servizi • connessioni',
      },
    ],
  },
} as const;

interface OwnerCenterWorkspaceProps {
  document: OwnerCenterDocument;
  locale: Locale;
}

function withCount(value: string, count: number) {
  return value.replace('{count}', String(count));
}

function createTask(
  locale: Locale,
  id: OwnerCenterTaskId,
  tone: 'gold' | 'ivory',
  href: string,
  count = 0,
): OwnerCenterTaskView {
  const copy = taskCopyByLocale[locale]?.[id] ?? taskCopyByLocale.en[id];

  return {
    id,
    tone,
    href,
    title: copy.title,
    description: copy.description,
    meta: withCount(copy.meta, count),
  };
}

function getOwnerCenterTasks(document: OwnerCenterDocument, locale: Locale): OwnerCenterTaskView[] {
  const tasks: OwnerCenterTaskView[] = [];

  if (document.dogs.total === 0) {
    tasks.push(createTask(locale, 'create-first-cane-corso', 'gold', '/my-dogs/new'));
  }

  if (document.dogs.draft > 0) {
    tasks.push(createTask(locale, 'finish-cane-corso-drafts', 'ivory', '/my-dogs', document.dogs.draft));
  }

  if (document.dogs.needsChanges > 0) {
    tasks.push(createTask(locale, 'dog-review-changes', 'gold', '/my-dogs', document.dogs.needsChanges));
  }

  if (document.ecosystem.summary.needsChanges > 0) {
    tasks.push(createTask(locale, 'ecosystem-review-changes', 'gold', '/ecosystem', document.ecosystem.summary.needsChanges));
  }

  if (document.ecosystem.summary.drafts > 0) {
    tasks.push(createTask(locale, 'ecosystem-drafts', 'ivory', '/ecosystem', document.ecosystem.summary.drafts));
  }

  if (document.dogs.total > 0 && document.ecosystem.summary.total === 0) {
    tasks.push(createTask(locale, 'start-ecosystem-layer', 'ivory', '/ecosystem'));
  }

  if (tasks.length === 0) {
    tasks.push(createTask(locale, 'workspace-healthy', 'gold', '/my-dogs'));
  }

  return tasks.slice(0, 3);
}

function formatRole(role: OwnerCenterDocument['member']['role'], locale: Locale) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const roleKey = String(role) as keyof typeof copy.roles;

  return copy.roles[roleKey] ?? String(role);
}

export function OwnerCenterWorkspace({ document, locale }: OwnerCenterWorkspaceProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const tasks = getOwnerCenterTasks(document, locale);
  const firstDog = document.dogs.items[0] ?? null;
  const healthHref = firstDog ? `/my-dogs/${firstDog.id}/health` : '/my-dogs/new';
  const reviewTotal =
    document.dogs.submitted +
    document.dogs.needsChanges +
    document.dogs.approved +
    document.ecosystem.summary.pendingReview +
    document.ecosystem.summary.needsChanges;
  const lanes = copy.lanes.map((lane) => ({ ...lane, href: lane.href === '__health__' ? healthHref : lane.href }));

  return (
    <div className="owner-center-stack owner-center-stack--real-user">
      <section className="owner-center-identity-card owner-center-identity-card--compact" aria-label={copy.identity}>
        <div>
          <span className="eyebrow-label">{copy.identity}</span>
          <h2>{document.member.displayName}</h2>
        </div>
        <dl>
          <div>
            <dt>{copy.email}</dt>
            <dd>{document.member.email}</dd>
          </div>
          <div>
            <dt>{copy.role}</dt>
            <dd>{formatRole(document.member.role, locale)}</dd>
          </div>
          <div>
            <dt>{copy.location}</dt>
            <dd>{document.member.location ?? copy.noLocation}</dd>
          </div>
        </dl>
      </section>

      <div className="stats-grid five-up owner-center-stats-grid owner-center-stats-grid--compact">
        <OverviewStatCard label={copy.stats.caneCorso} value={String(document.dogs.total)} tone="gold" />
        <OverviewStatCard label={copy.stats.submitted} value={String(reviewTotal)} tone="ivory" />
        <OverviewStatCard label={copy.stats.published} value={String(document.dogs.published)} tone="gold" />
        <OverviewStatCard label={copy.stats.certified} value={String(document.dogs.certified)} tone="ivory" />
        <OverviewStatCard label={copy.stats.ecosystem} value={String(document.ecosystem.summary.total)} tone="gold" />
      </div>

      <section className="content-card owner-center-panel owner-center-panel--priority">
        <div className="section-head-row owner-center-section-head">
          <div>
            <span className="eyebrow-label">{copy.sections.tasksEyebrow}</span>
            <h2>{copy.sections.tasksTitle}</h2>
            <p>{copy.sections.tasksDescription}</p>
          </div>
        </div>

        <div className="owner-center-task-grid owner-center-task-grid--priority">
          {tasks.map((task) => (
            <article className={`owner-center-task owner-center-task--${task.tone}`} key={task.id}>
              <div>
                <span className="owner-center-task__meta">{task.meta}</span>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <Link href={task.href} className="button-secondary small">
                {copy.actions.open}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="content-card owner-center-panel owner-center-panel--actions">
        <div className="section-head-row owner-center-section-head">
          <div>
            <span className="eyebrow-label">{copy.sections.lanesEyebrow}</span>
            <h2>{copy.sections.lanesTitle}</h2>
          </div>
        </div>

        <div className="owner-center-lane-grid owner-center-lane-grid--primary">
          {lanes.map((lane) => (
            <article className="owner-center-lane" key={lane.href}>
              <span className="eyebrow-label">{lane.eyebrow}</span>
              <h3>{lane.title}</h3>
              <p>{lane.description}</p>
              <div className="owner-center-lane__footer">
                <span>{lane.meta}</span>
                <Link href={lane.href} className="inline-link-action">
                  {copy.actions.manage}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <details className="member-journey-details">
        <summary>
          <span className="eyebrow-label">{copy.sections.journeyEyebrow}</span>
          <strong>{copy.sections.journeyTitle}</strong>
          <small>{copy.sections.journeySummary}</small>
        </summary>
        <OwnerJourneyCommandCenter document={document} locale={locale} />
      </details>
    </div>
  );
}
