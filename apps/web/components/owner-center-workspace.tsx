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
      description: 'Start with a private profile, then submit it for registry review when it is ready.',
      meta: 'Private profile • draft first',
    },
    'finish-cane-corso-drafts': {
      title: 'Finish Cane Corso drafts',
      description: 'Draft profiles stay private until you send them for review.',
      meta: '{count} draft profile(s)',
    },
    'dog-review-changes': {
      title: 'Review requested Cane Corso changes',
      description: 'Update returned profiles before sending them back for review.',
      meta: '{count} profile(s) need changes',
    },
    'ecosystem-review-changes': {
      title: 'Update returned ecosystem entries',
      description: 'Reviewer notes are waiting on one or more ecosystem entries.',
      meta: '{count} ecosystem entry/entries need changes',
    },
    'ecosystem-drafts': {
      title: 'Complete ecosystem drafts',
      description: 'Draft entries can become official listings, community places, or private suggestions after review.',
      meta: '{count} draft ecosystem entry/entries',
    },
    'start-ecosystem-layer': {
      title: 'Add your first ecosystem entry',
      description: 'Suggest a trusted place, service, transport route, event, or Cane Corso opportunity for review.',
      meta: 'Optional • reviewed before public visibility',
    },
    'workspace-healthy': {
      title: 'Workspace is up to date',
      description: 'No drafts or returned entries need immediate action right now.',
      meta: 'Ready for the next submission',
    },
  },
  bg: {
    'create-first-cane-corso': {
      title: 'Създай първия си Cane Corso профил',
      description: 'Започни с личен профил и го изпрати за преглед към регистъра, когато е готов.',
      meta: 'Личен профил • първо чернова',
    },
    'finish-cane-corso-drafts': {
      title: 'Довърши черновите на Cane Corso профилите',
      description: 'Черновите остават лични, докато не ги изпратиш за преглед.',
      meta: '{count} профил(а) в чернова',
    },
    'dog-review-changes': {
      title: 'Прегледай върнатите корекции',
      description: 'Обнови върнатите Cane Corso профили, преди да ги изпратиш отново за преглед.',
      meta: '{count} профил(а) изискват корекции',
    },
    'ecosystem-review-changes': {
      title: 'Обнови върнатите записи в екосистемата',
      description: 'Има бележки от преглед по един или повече записи в екосистемата.',
      meta: '{count} запис(а) изискват корекции',
    },
    'ecosystem-drafts': {
      title: 'Довърши черновите в екосистемата',
      description: 'Черновите могат да станат официални записи, общностни места или лични предложения след преглед.',
      meta: '{count} запис(а) в чернова',
    },
    'start-ecosystem-layer': {
      title: 'Добави първия си запис в екосистемата',
      description: 'Предложи доверено място, услуга, транспорт, събитие или полезна Cane Corso възможност за преглед.',
      meta: 'По избор • преглед преди публичност',
    },
    'workspace-healthy': {
      title: 'Работното пространство е подредено',
      description: 'В момента няма чернови или върнати записи, които изискват незабавно действие.',
      meta: 'Готово за следващ запис',
    },
  },
  it: {
    'create-first-cane-corso': {
      title: 'Crea il tuo primo profilo Cane Corso',
      description: 'Inizia con un profilo privato e invialo alla revisione del registro quando è pronto.',
      meta: 'Profilo privato • prima bozza',
    },
    'finish-cane-corso-drafts': {
      title: 'Completa le bozze Cane Corso',
      description: 'Le bozze restano private finché non le invii alla revisione.',
      meta: '{count} profilo/i in bozza',
    },
    'dog-review-changes': {
      title: 'Rivedi le correzioni richieste',
      description: 'Aggiorna i profili Cane Corso restituiti prima di inviarli di nuovo alla revisione.',
      meta: '{count} profilo/i richiedono modifiche',
    },
    'ecosystem-review-changes': {
      title: 'Aggiorna le voci ecosistema restituite',
      description: 'Ci sono note di revisione su una o più voci dell’ecosistema.',
      meta: '{count} voce/i richiedono modifiche',
    },
    'ecosystem-drafts': {
      title: 'Completa le bozze dell’ecosistema',
      description: 'Le bozze possono diventare schede ufficiali, luoghi community o suggerimenti privati dopo la revisione.',
      meta: '{count} voce/i in bozza',
    },
    'start-ecosystem-layer': {
      title: 'Aggiungi la tua prima voce ecosistema',
      description: 'Suggerisci un luogo, servizio, trasporto, evento o opportunità Cane Corso da revisionare.',
      meta: 'Opzionale • revisione prima della visibilità pubblica',
    },
    'workspace-healthy': {
      title: 'Spazio di lavoro aggiornato',
      description: 'Non ci sono bozze o voci restituite che richiedono azione immediata.',
      meta: 'Pronto per il prossimo invio',
    },
  },
};

const copyByLocale = {
  en: {
    identity: 'Owner profile',
    role: 'Role',
    location: 'Location',
    noLocation: 'Location not set',
    email: 'Email',
    roles: {
      admin: 'Administrator',
      member: 'Member',
      partner: 'Partner',
    },
    stats: {
      caneCorso: 'My Cane Corso',
      submitted: 'In review',
      published: 'Published',
      certified: 'Certified',
      ecosystem: 'Ecosystem entries',
    },
    sections: {
      tasksEyebrow: 'Next actions',
      tasksTitle: 'What needs attention now',
      tasksDescription:
        'This center keeps private profiles, registry preparation, and ecosystem entries in one practical member area.',
      lanesEyebrow: 'Guided paths',
      lanesTitle: 'Move through the platform without losing context',
      ecosystemEyebrow: 'Member ecosystem area',
      ecosystemTitle: 'Create and track ecosystem entries',
      ecosystemDescription:
        'Use the workspace below for official listings, community discoveries, and suggestions that pass review before becoming public.',
    },
    actions: {
      open: 'Open',
      manage: 'Manage',
    },
    lanes: [
      {
        eyebrow: 'Cane Corso profiles',
        title: 'Prepare registry-ready profiles',
        description: 'Create, edit, submit, and follow private profiles without mixing them with the public registry pages.',
        href: '/my-dogs',
        meta: 'Private owner area',
      },
      {
        eyebrow: 'New profile',
        title: 'Add another Cane Corso',
        description: 'Start a private profile first. Publication and certificate decisions remain separate approval steps.',
        href: '/my-dogs/new',
        meta: 'Draft • photos • pedigree',
      },
      {
        eyebrow: 'Partner path',
        title: 'Apply as a partner or service',
        description: 'For real businesses and operators that should enter the trusted ecosystem after review.',
        href: '/partners/apply',
        meta: 'Application • moderation',
      },
      {
        eyebrow: 'Profile settings',
        title: 'Keep your owner profile complete',
        description: 'Maintain the member identity that connects submissions, ownership, and future platform trust.',
        href: '/profile',
        meta: 'Member identity',
      },
    ],
  },
  bg: {
    identity: 'Профил на собственика',
    role: 'Роля',
    location: 'Локация',
    noLocation: 'Локацията не е зададена',
    email: 'Имейл',
    roles: {
      admin: 'Администратор',
      member: 'Член',
      partner: 'Партньор',
    },
    stats: {
      caneCorso: 'Моите Cane Corso',
      submitted: 'В преглед',
      published: 'Публикувани',
      certified: 'Със сертификат',
      ecosystem: 'Записи в екосистемата',
    },
    sections: {
      tasksEyebrow: 'Следващи действия',
      tasksTitle: 'Какво изисква внимание сега',
      tasksDescription:
        'Този център събира личните профили, подготовката за регистъра и записите в екосистемата в една практична зона за члена.',
      lanesEyebrow: 'Водещи пътеки',
      lanesTitle: 'Движение в платформата без загуба на контекст',
      ecosystemEyebrow: 'Зона за записи в екосистемата',
      ecosystemTitle: 'Създаване и проследяване на записи',
      ecosystemDescription:
        'Използвай работното пространство по-долу за официални записи, общностни открития и предложения, които минават през преглед преди публичност.',
    },
    actions: {
      open: 'Отвори',
      manage: 'Управлявай',
    },
    lanes: [
      {
        eyebrow: 'Cane Corso профили',
        title: 'Подготви профили за регистъра',
        description: 'Създавай, редактирай, изпращай и следи личните профили без смесване с публичния регистър.',
        href: '/my-dogs',
        meta: 'Лична зона на собственика',
      },
      {
        eyebrow: 'Нов профил',
        title: 'Добави още един Cane Corso',
        description: 'Първо се създава личен профил. Публикацията и сертификатът остават отделни стъпки за одобрение.',
        href: '/my-dogs/new',
        meta: 'Чернова • снимки • родословие',
      },
      {
        eyebrow: 'Път към партньорство',
        title: 'Кандидатствай като партньор или услуга',
        description: 'За реални бизнеси и оператори, които могат да влязат в доверената екосистема след преглед.',
        href: '/partners/apply',
        meta: 'Кандидатура • модерация',
      },
      {
        eyebrow: 'Профил и настройки',
        title: 'Поддържай профила си завършен',
        description: 'Поддържай идентичността, която свързва записите, собствеността и бъдещия слой на доверие в платформата.',
        href: '/profile',
        meta: 'Идентичност на члена',
      },
    ],
  },
  it: {
    identity: 'Profilo proprietario',
    role: 'Ruolo',
    location: 'Località',
    noLocation: 'Località non impostata',
    email: 'Email',
    roles: {
      admin: 'Amministratore',
      member: 'Membro',
      partner: 'Partner',
    },
    stats: {
      caneCorso: 'I miei Cane Corso',
      submitted: 'In revisione',
      published: 'Pubblicati',
      certified: 'Certificati',
      ecosystem: 'Voci ecosistema',
    },
    sections: {
      tasksEyebrow: 'Prossime azioni',
      tasksTitle: 'Cosa richiede attenzione ora',
      tasksDescription:
        'Questo centro unisce profili privati, preparazione al registro e voci dell’ecosistema in un’area membro pratica.',
      lanesEyebrow: 'Percorsi guidati',
      lanesTitle: 'Muoviti nella piattaforma senza perdere contesto',
      ecosystemEyebrow: 'Area ecosistema membro',
      ecosystemTitle: 'Crea e segui le voci dell’ecosistema',
      ecosystemDescription:
        'Usa lo spazio sotto per schede ufficiali, scoperte community e suggerimenti che passano dalla revisione prima di diventare pubblici.',
    },
    actions: {
      open: 'Apri',
      manage: 'Gestisci',
    },
    lanes: [
      {
        eyebrow: 'Profili Cane Corso',
        title: 'Prepara profili pronti per il registro',
        description: 'Crea, modifica, invia e segui profili privati senza mescolarli con le pagine pubbliche del registro.',
        href: '/my-dogs',
        meta: 'Area privata del proprietario',
      },
      {
        eyebrow: 'Nuovo profilo',
        title: 'Aggiungi un altro Cane Corso',
        description: 'Inizia da un profilo privato. Pubblicazione e certificato restano passaggi separati di approvazione.',
        href: '/my-dogs/new',
        meta: 'Bozza • foto • pedigree',
      },
      {
        eyebrow: 'Percorso partner',
        title: 'Candidati come partner o servizio',
        description: 'Per business e operatori reali che possono entrare nell’ecosistema di fiducia dopo la revisione.',
        href: '/partners/apply',
        meta: 'Candidatura • moderazione',
      },
      {
        eyebrow: 'Profilo e impostazioni',
        title: 'Mantieni completo il tuo profilo',
        description: 'Gestisci l’identità membro che collega invii, proprietà e futuro livello di fiducia della piattaforma.',
        href: '/profile',
        meta: 'Identità membro',
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

  return tasks.slice(0, 6);
}

function formatRole(role: OwnerCenterDocument['member']['role'], locale: Locale) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const roleKey = String(role) as keyof typeof copy.roles;

  return copy.roles[roleKey] ?? String(role);
}

export function OwnerCenterWorkspace({ document, locale }: OwnerCenterWorkspaceProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const tasks = getOwnerCenterTasks(document, locale);
  const reviewTotal = document.dogs.submitted + document.dogs.needsChanges + document.dogs.approved + document.ecosystem.summary.pendingReview + document.ecosystem.summary.needsChanges;

  return (
    <div className="owner-center-stack">
      <section className="owner-center-identity-card" aria-label={copy.identity}>
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

      <div className="stats-grid five-up owner-center-stats-grid">
        <OverviewStatCard label={copy.stats.caneCorso} value={String(document.dogs.total)} tone="gold" />
        <OverviewStatCard label={copy.stats.submitted} value={String(reviewTotal)} tone="ivory" />
        <OverviewStatCard label={copy.stats.published} value={String(document.dogs.published)} tone="gold" />
        <OverviewStatCard label={copy.stats.certified} value={String(document.dogs.certified)} tone="ivory" />
        <OverviewStatCard label={copy.stats.ecosystem} value={String(document.ecosystem.summary.total)} tone="gold" />
      </div>

      <OwnerJourneyCommandCenter document={document} locale={locale} />

      <section className="content-card owner-center-panel">
        <div className="section-head-row owner-center-section-head">
          <div>
            <span className="eyebrow-label">{copy.sections.tasksEyebrow}</span>
            <h2>{copy.sections.tasksTitle}</h2>
            <p>{copy.sections.tasksDescription}</p>
          </div>
        </div>

        <div className="owner-center-task-grid">
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

      <section className="content-card owner-center-panel">
        <div className="section-head-row owner-center-section-head">
          <div>
            <span className="eyebrow-label">{copy.sections.lanesEyebrow}</span>
            <h2>{copy.sections.lanesTitle}</h2>
          </div>
        </div>

        <div className="owner-center-lane-grid">
          {copy.lanes.map((lane) => (
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

      <section className="owner-center-ecosystem-intro">
        <span className="eyebrow-label">{copy.sections.ecosystemEyebrow}</span>
        <h2>{copy.sections.ecosystemTitle}</h2>
        <p>{copy.sections.ecosystemDescription}</p>
      </section>
    </div>
  );
}
