import Link from 'next/link';
import type { Dog, DogLifecycleStatus } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import type { OwnerCenterDocument } from '@/lib/owner-center.server';

type JourneyTone = 'complete' | 'active' | 'attention' | 'locked';

interface OwnerJourneyCommandCenterProps {
  document: OwnerCenterDocument;
  locale: Locale;
}

interface JourneyMilestone {
  id: 'private' | 'review' | 'registry' | 'certificate' | 'showcase';
  label: string;
  description: string;
  tone: JourneyTone;
}

const statusOrder: DogLifecycleStatus[] = ['draft', 'needs_changes', 'submitted', 'approved', 'published', 'archived'];

const copyByLocale = {
  en: {
    eyebrow: 'Member Command Center',
    title: 'One calm owner journey from private profile to public trust',
    description:
      'This panel connects the private Cane Corso workspace with review, registry visibility, certificate trust, and showcase eligibility without changing the approval logic.',
    identity: 'Owner journey overview',
    nextAction: 'Recommended next action',
    open: 'Open',
    manage: 'Manage',
    review: 'Review path',
    dogs: 'Cane Corso profiles',
    ecosystem: 'Ecosystem entries',
    noDogs: {
      title: 'Start with your first private Cane Corso profile',
      description: 'Create the profile privately first. Review, registry publication, certificate trust, and showcase placement remain separate steps.',
      href: '/my-dogs/new',
      label: 'Create profile',
    },
    next: {
      needsChanges: 'Fix returned review notes before resubmitting.',
      drafts: 'Complete private draft profiles before sending them into review.',
      review: 'Track review status and wait for the admin decision before public trust layers appear.',
      published: 'Review the public registry presence and strengthen media, pedigree, and presentation quality.',
      certified: 'Keep the certified public trust layer consistent across registry, verify, and showcase surfaces.',
      healthy: 'Everything important is up to date. Add richer ecosystem entries or another Cane Corso profile when ready.',
    },
    labels: {
      private: 'Private profile',
      review: 'Admin review',
      registry: 'Registry',
      certificate: 'USG certificate',
      showcase: 'Gallery / showcase',
      status: 'Status',
      public: 'Public',
      privateVisibility: 'Private',
      certificateIssued: 'Certificate issued',
      certificatePending: 'Separate admin decision',
      galleryReady: 'Eligible after publication quality review',
      galleryPrep: 'Prepare richer media first',
      lastUpdated: 'Updated',
    },
    milestones: {
      privateReady: 'Profile exists in the owner workspace.',
      privateEmpty: 'No private profile has been created yet.',
      reviewReady: 'At least one profile is already inside the review path.',
      reviewAttention: 'One or more profiles need owner corrections.',
      reviewLocked: 'Submit a complete private profile before review.',
      registryReady: 'A published registry profile is already visible.',
      registryLocked: 'Registry visibility comes only after approval and publication.',
      certificateReady: 'At least one USG certificate is issued.',
      certificateLocked: 'Certificate trust remains a separate admin decision.',
      showcaseReady: 'Published/certified records can be considered for premium showcase visibility.',
      showcaseLocked: 'Gallery/showcase consideration starts after public quality exists.',
    },
    status: {
      draft: 'Draft',
      submitted: 'Submitted for review',
      needs_changes: 'Needs changes',
      approved: 'Approved',
      published: 'Published',
      archived: 'Archived',
    } satisfies Record<DogLifecycleStatus, string>,
    cards: [
      {
        eyebrow: 'Private layer',
        title: 'Owner workspace stays personal',
        description: 'My Dogs remains the private preparation area even when one Cane Corso becomes public later.',
        href: '/my-dogs',
        meta: 'Private profiles • media • pedigree',
      },
      {
        eyebrow: 'Official layer',
        title: 'Registry and verify stay separate',
        description: 'Publication, certificate trust, and verification are connected for visitors, but they are not the same approval event.',
        href: '/registry',
        meta: 'Registry • certificate • verify',
      },
      {
        eyebrow: 'Community layer',
        title: 'Ecosystem grows after review',
        description: 'Places, services, transport, events, and opportunities can be submitted without bypassing moderation.',
        href: '/ecosystem',
        meta: 'Owner submissions • reviewed visibility',
      },
    ],
  },
  bg: {
    eyebrow: 'Команден център на члена',
    title: 'Един спокоен път от личен профил до публично доверие',
    description:
      'Този панел свързва личната Cane Corso зона с прегледа, регистъра, сертификатното доверие и showcase възможността, без да променя логиката за одобрение.',
    identity: 'Общ преглед на пътя',
    nextAction: 'Препоръчано следващо действие',
    open: 'Отвори',
    manage: 'Управлявай',
    review: 'Път на прегледа',
    dogs: 'Cane Corso профили',
    ecosystem: 'Записи в екосистемата',
    noDogs: {
      title: 'Започни с първия си личен Cane Corso профил',
      description: 'Първо създай профила лично. Прегледът, публикацията в регистъра, сертификатът и showcase присъствието остават отделни стъпки.',
      href: '/my-dogs/new',
      label: 'Създай профил',
    },
    next: {
      needsChanges: 'Поправи върнатите бележки от прегледа, преди да подадеш отново.',
      drafts: 'Довърши личните чернови, преди да ги изпратиш за преглед.',
      review: 'Следи статуса на прегледа и изчакай админ решението, преди да се появят публичните trust слоеве.',
      published: 'Прегледай публичното присъствие в регистъра и подсили медията, pedigree-то и представянето.',
      certified: 'Поддържай сертификатния trust слой последователен в регистъра, проверката и showcase повърхностите.',
      healthy: 'Всичко важно е подредено. Добави по-богат екосистемен запис или нов Cane Corso профил, когато си готов.',
    },
    labels: {
      private: 'Личен профил',
      review: 'Админ преглед',
      registry: 'Регистър',
      certificate: 'USG сертификат',
      showcase: 'Галерия / showcase',
      status: 'Статус',
      public: 'Публичен',
      privateVisibility: 'Личен',
      certificateIssued: 'Издаден сертификат',
      certificatePending: 'Отделно админ решение',
      galleryReady: 'Възможност след преглед на публичното качество',
      galleryPrep: 'Първо подготви по-силна медия',
      lastUpdated: 'Обновен',
    },
    milestones: {
      privateReady: 'Профилът съществува в личната зона на собственика.',
      privateEmpty: 'Все още няма създаден личен профил.',
      reviewReady: 'Поне един профил вече е в пътя за преглед.',
      reviewAttention: 'Един или повече профили изискват корекции от собственика.',
      reviewLocked: 'Подай завършен личен профил, преди да има преглед.',
      registryReady: 'Вече има публикуван профил в регистъра.',
      registryLocked: 'Видимостта в регистъра идва само след одобрение и публикация.',
      certificateReady: 'Поне един USG сертификат е издаден.',
      certificateLocked: 'Сертификатното доверие остава отделно админ решение.',
      showcaseReady: 'Публикувани/сертифицирани записи могат да се разглеждат за премиум showcase видимост.',
      showcaseLocked: 'Gallery/showcase разглеждането започва след наличие на публично качество.',
    },
    status: {
      draft: 'Чернова',
      submitted: 'Подаден за преглед',
      needs_changes: 'Изисква корекции',
      approved: 'Одобрен',
      published: 'Публикуван',
      archived: 'Архивиран',
    } satisfies Record<DogLifecycleStatus, string>,
    cards: [
      {
        eyebrow: 'Личен слой',
        title: 'Зоната на собственика остава лична',
        description: 'My Dogs остава мястото за подготовка, дори когато един Cane Corso по-късно стане публичен.',
        href: '/my-dogs',
        meta: 'Лични профили • медия • pedigree',
      },
      {
        eyebrow: 'Официален слой',
        title: 'Регистърът и проверката остават отделни',
        description: 'Публикацията, сертификатът и проверката са свързани за посетителя, но не са едно и също решение за одобрение.',
        href: '/registry',
        meta: 'Регистър • сертификат • проверка',
      },
      {
        eyebrow: 'Общностен слой',
        title: 'Екосистемата расте след преглед',
        description: 'Места, услуги, транспорт, събития и възможности могат да се подават, без да заобикалят модерацията.',
        href: '/ecosystem',
        meta: 'Owner submissions • прегледана видимост',
      },
    ],
  },
  it: {
    eyebrow: 'Centro comando membro',
    title: 'Un percorso owner chiaro dal profilo privato alla fiducia pubblica',
    description:
      'Questo pannello collega il workspace Cane Corso privato con review, registro, fiducia del certificato e possibilità showcase senza cambiare la logica di approvazione.',
    identity: 'Panoramica percorso owner',
    nextAction: 'Prossima azione consigliata',
    open: 'Apri',
    manage: 'Gestisci',
    review: 'Percorso review',
    dogs: 'Profili Cane Corso',
    ecosystem: 'Voci ecosistema',
    noDogs: {
      title: 'Inizia con il tuo primo profilo Cane Corso privato',
      description: 'Crea prima il profilo in privato. Review, pubblicazione nel registro, certificato e showcase restano passaggi separati.',
      href: '/my-dogs/new',
      label: 'Crea profilo',
    },
    next: {
      needsChanges: 'Correggi le note restituite dalla review prima di inviare di nuovo.',
      drafts: 'Completa le bozze private prima di mandarle in review.',
      review: 'Segui lo stato della review e attendi la decisione admin prima dei livelli pubblici di fiducia.',
      published: 'Controlla la presenza pubblica nel registro e rafforza media, pedigree e presentazione.',
      certified: 'Mantieni coerente il livello certificato tra registro, verify e showcase.',
      healthy: 'Tutto l’essenziale è aggiornato. Aggiungi una voce ecosistema più ricca o un altro profilo Cane Corso quando vuoi.',
    },
    labels: {
      private: 'Profilo privato',
      review: 'Review admin',
      registry: 'Registro',
      certificate: 'Certificato USG',
      showcase: 'Gallery / showcase',
      status: 'Stato',
      public: 'Pubblico',
      privateVisibility: 'Privato',
      certificateIssued: 'Certificato emesso',
      certificatePending: 'Decisione admin separata',
      galleryReady: 'Possibile dopo review della qualità pubblica',
      galleryPrep: 'Prepara prima media più forti',
      lastUpdated: 'Aggiornato',
    },
    milestones: {
      privateReady: 'Il profilo esiste nel workspace owner.',
      privateEmpty: 'Nessun profilo privato è stato creato.',
      reviewReady: 'Almeno un profilo è già nel percorso review.',
      reviewAttention: 'Uno o più profili richiedono correzioni owner.',
      reviewLocked: 'Invia un profilo privato completo prima della review.',
      registryReady: 'Un profilo pubblicato nel registro è già visibile.',
      registryLocked: 'La visibilità nel registro arriva solo dopo approvazione e pubblicazione.',
      certificateReady: 'Almeno un certificato USG è emesso.',
      certificateLocked: 'La fiducia certificata resta una decisione admin separata.',
      showcaseReady: 'Record pubblicati/certificati possono essere considerati per la visibilità showcase premium.',
      showcaseLocked: 'La valutazione Gallery/showcase inizia dopo una qualità pubblica reale.',
    },
    status: {
      draft: 'Bozza',
      submitted: 'Inviato in review',
      needs_changes: 'Richiede modifiche',
      approved: 'Approvato',
      published: 'Pubblicato',
      archived: 'Archiviato',
    } satisfies Record<DogLifecycleStatus, string>,
    cards: [
      {
        eyebrow: 'Livello privato',
        title: 'Il workspace owner resta personale',
        description: 'My Dogs resta l’area di preparazione privata anche quando un Cane Corso diventa pubblico più tardi.',
        href: '/my-dogs',
        meta: 'Profili privati • media • pedigree',
      },
      {
        eyebrow: 'Livello ufficiale',
        title: 'Registro e verify restano separati',
        description: 'Pubblicazione, certificato e verifica sono collegati per il visitatore, ma non sono lo stesso evento di approvazione.',
        href: '/registry',
        meta: 'Registro • certificato • verify',
      },
      {
        eyebrow: 'Livello community',
        title: 'L’ecosistema cresce dopo review',
        description: 'Luoghi, servizi, trasporti, eventi e opportunità possono essere inviati senza superare la moderazione.',
        href: '/ecosystem',
        meta: 'Owner submissions • visibilità revisionata',
      },
    ],
  },
} as const;

function formatDate(locale: Locale, value: string | null) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

function countFilledPedigree(dog: Dog) {
  if (!dog.pedigree) {
    return 0;
  }

  return Object.values(dog.pedigree).filter((ancestor) => Boolean(ancestor?.name?.trim())).length;
}

function getRepresentativeDog(dogs: Dog[]) {
  return (
    dogs.find((dog) => dog.publication?.certificateCode) ??
    dogs.find((dog) => dog.publication || dog.lifecycleStatus === 'published') ??
    dogs.find((dog) => dog.lifecycleStatus === 'needs_changes') ??
    dogs.find((dog) => dog.lifecycleStatus === 'submitted' || dog.lifecycleStatus === 'approved') ??
    dogs[0] ??
    null
  );
}

function getNextAction(document: OwnerCenterDocument, locale: Locale) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  if (document.dogs.total === 0) {
    return copy.noDogs;
  }

  if (document.dogs.needsChanges > 0) {
    return { title: copy.nextAction, description: copy.next.needsChanges, href: '/my-dogs', label: copy.manage };
  }

  if (document.dogs.draft > 0) {
    return { title: copy.nextAction, description: copy.next.drafts, href: '/my-dogs', label: copy.manage };
  }

  if (document.dogs.submitted + document.dogs.approved > 0) {
    return { title: copy.nextAction, description: copy.next.review, href: '/my-dogs', label: copy.open };
  }

  if (document.dogs.certified > 0) {
    return { title: copy.nextAction, description: copy.next.certified, href: '/verify', label: copy.open };
  }

  if (document.dogs.published > 0) {
    return { title: copy.nextAction, description: copy.next.published, href: '/registry', label: copy.open };
  }

  return { title: copy.nextAction, description: copy.next.healthy, href: '/ecosystem', label: copy.open };
}

function buildMilestones(document: OwnerCenterDocument, locale: Locale): JourneyMilestone[] {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const hasDogs = document.dogs.total > 0;
  const hasReviewActivity = document.dogs.submitted + document.dogs.approved > 0;
  const needsAttention = document.dogs.needsChanges > 0;
  const hasPublished = document.dogs.published > 0;
  const hasCertified = document.dogs.certified > 0;

  return [
    {
      id: 'private',
      label: copy.labels.private,
      description: hasDogs ? copy.milestones.privateReady : copy.milestones.privateEmpty,
      tone: hasDogs ? 'complete' : 'active',
    },
    {
      id: 'review',
      label: copy.labels.review,
      description: needsAttention ? copy.milestones.reviewAttention : hasReviewActivity ? copy.milestones.reviewReady : copy.milestones.reviewLocked,
      tone: needsAttention ? 'attention' : hasReviewActivity ? 'active' : 'locked',
    },
    {
      id: 'registry',
      label: copy.labels.registry,
      description: hasPublished ? copy.milestones.registryReady : copy.milestones.registryLocked,
      tone: hasPublished ? 'complete' : 'locked',
    },
    {
      id: 'certificate',
      label: copy.labels.certificate,
      description: hasCertified ? copy.milestones.certificateReady : copy.milestones.certificateLocked,
      tone: hasCertified ? 'complete' : 'locked',
    },
    {
      id: 'showcase',
      label: copy.labels.showcase,
      description: hasPublished || hasCertified ? copy.milestones.showcaseReady : copy.milestones.showcaseLocked,
      tone: hasCertified ? 'complete' : hasPublished ? 'active' : 'locked',
    },
  ];
}

function getDogStatusRank(dog: Dog) {
  const rank = statusOrder.indexOf(dog.lifecycleStatus);
  return rank === -1 ? 0 : rank;
}

export function OwnerJourneyCommandCenter({ document, locale }: OwnerJourneyCommandCenterProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const milestones = buildMilestones(document, locale);
  const nextAction = getNextAction(document, locale);
  const representativeDog = getRepresentativeDog(document.dogs.items);
  const sortedDogs = [...document.dogs.items]
    .sort((a, b) => {
      const publicationRank = Number(Boolean(b.publication)) - Number(Boolean(a.publication));
      if (publicationRank !== 0) {
        return publicationRank;
      }

      return getDogStatusRank(b) - getDogStatusRank(a);
    })
    .slice(0, 4);

  return (
    <section className="owner-journey-command-center" aria-label={copy.title}>
      <div className="owner-journey-command-center__hero">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <article className="owner-journey-next-action">
          <span className="eyebrow-label">{nextAction.title}</span>
          <p>{nextAction.description}</p>
          <Link href={nextAction.href} className="button-secondary small">
            {nextAction.label}
          </Link>
        </article>
      </div>

      <div className="owner-journey-milestones" aria-label={copy.review}>
        {milestones.map((milestone, index) => (
          <article className={`owner-journey-milestone owner-journey-milestone--${milestone.tone}`} key={milestone.id}>
            <div className="owner-journey-milestone__index">{String(index + 1).padStart(2, '0')}</div>
            <div>
              <h3>{milestone.label}</h3>
              <p>{milestone.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="owner-journey-command-grid">
        <article className="owner-journey-summary-card owner-journey-summary-card--featured">
          <span className="eyebrow-label">{copy.identity}</span>
          {representativeDog ? (
            <>
              <h3>{representativeDog.name}</h3>
              <dl className="owner-journey-dog-facts">
                <div>
                  <dt>{copy.labels.status}</dt>
                  <dd>{copy.status[representativeDog.lifecycleStatus]}</dd>
                </div>
                <div>
                  <dt>{copy.labels.registry}</dt>
                  <dd>{representativeDog.publication ? copy.labels.public : copy.labels.privateVisibility}</dd>
                </div>
                <div>
                  <dt>{copy.labels.certificate}</dt>
                  <dd>{representativeDog.publication?.certificateCode ? copy.labels.certificateIssued : copy.labels.certificatePending}</dd>
                </div>
                <div>
                  <dt>{copy.labels.showcase}</dt>
                  <dd>{representativeDog.publication ? copy.labels.galleryReady : copy.labels.galleryPrep}</dd>
                </div>
                <div>
                  <dt>Pedigree</dt>
                  <dd>{countFilledPedigree(representativeDog)}/14</dd>
                </div>
                <div>
                  <dt>{copy.labels.lastUpdated}</dt>
                  <dd>{formatDate(locale, representativeDog.updatedAt)}</dd>
                </div>
              </dl>
              <div className="owner-journey-summary-card__actions">
                <Link href={`/my-dogs/${representativeDog.id}/edit`} className="button-secondary small">
                  {copy.manage}
                </Link>
                {representativeDog.publication ? (
                  <Link href={`/registry/${representativeDog.publication.publicSlug}`} className="button-ghost small">
                    {copy.open}
                  </Link>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <h3>{copy.noDogs.title}</h3>
              <p>{copy.noDogs.description}</p>
              <Link href={copy.noDogs.href} className="button-secondary small">
                {copy.noDogs.label}
              </Link>
            </>
          )}
        </article>

        <article className="owner-journey-summary-card">
          <span className="eyebrow-label">{copy.dogs}</span>
          <div className="owner-journey-mini-stats">
            <div><strong>{document.dogs.total}</strong><span>Total</span></div>
            <div><strong>{document.dogs.draft}</strong><span>Draft</span></div>
            <div><strong>{document.dogs.submitted + document.dogs.approved + document.dogs.needsChanges}</strong><span>Review</span></div>
            <div><strong>{document.dogs.published}</strong><span>Public</span></div>
            <div><strong>{document.dogs.certified}</strong><span>USG</span></div>
          </div>
        </article>

        <article className="owner-journey-summary-card">
          <span className="eyebrow-label">{copy.ecosystem}</span>
          <div className="owner-journey-mini-stats">
            <div><strong>{document.ecosystem.summary.total}</strong><span>Total</span></div>
            <div><strong>{document.ecosystem.summary.drafts}</strong><span>Draft</span></div>
            <div><strong>{document.ecosystem.summary.pendingReview}</strong><span>Review</span></div>
            <div><strong>{document.ecosystem.summary.published}</strong><span>Public</span></div>
            <div><strong>{document.ecosystem.summary.needsChanges}</strong><span>Fix</span></div>
          </div>
        </article>
      </div>

      {sortedDogs.length ? (
        <div className="owner-journey-dog-strip" aria-label={copy.dogs}>
          {sortedDogs.map((dog) => (
            <Link className="owner-journey-dog-row" href={`/my-dogs/${dog.id}/edit`} key={dog.id}>
              <span>{dog.name}</span>
              <strong>{copy.status[dog.lifecycleStatus]}</strong>
              <em>{dog.publication?.certificateCode ?? (dog.publication ? copy.labels.public : copy.labels.privateVisibility)}</em>
            </Link>
          ))}
        </div>
      ) : null}

      <div className="owner-journey-card-grid">
        {copy.cards.map((card) => (
          <Link className="owner-journey-card" href={card.href} key={card.href}>
            <span className="eyebrow-label">{card.eyebrow}</span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <small>{card.meta}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
