import Link from 'next/link';
import type { Dog, DogMedia, DogLifecycleStatus } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import { getPedigreeFilledCount } from '@/lib/dog-pedigree';

export type OwnerPathTimelineSurface = 'member' | 'myDogs';

type OwnerPathStepState = 'complete' | 'current' | 'attention' | 'locked';

type OwnerPathDog = Dog & {
  media?: DogMedia[];
};

interface UsgOwnerPathTimelineProps {
  locale: Locale;
  dogs: OwnerPathDog[];
  surface?: OwnerPathTimelineSurface;
  className?: string;
}

interface OwnerPathStepView {
  id: string;
  label: string;
  description: string;
  href: string;
  state: OwnerPathStepState;
}

const reviewedStatuses: DogLifecycleStatus[] = ['submitted', 'needs_changes', 'approved', 'published'];

const copyByLocale = {
  en: {
    eyebrow: 'USG owner path',
    title: 'Your next Cane Corso action is visible here',
    description:
      'Follow one calm path from private profile to photos, origin, USG review, registry visibility, certificate trust, and daily care.',
    emptyTitle: 'Start with your first private Cane Corso profile',
    emptyDescription: 'Create the profile first. MARK I and the owner workspace will keep the next steps clear as you add photos, origin, and review readiness.',
    activeDogLabel: 'Active profile',
    startLabel: 'Starting point',
    nextActionLabel: 'Next action',
    progressLabel: 'Path readiness',
    open: 'Open',
    start: 'Create profile',
    status: {
      draft: 'Draft',
      submitted: 'Submitted for review',
      needs_changes: 'Needs changes',
      approved: 'Approved',
      published: 'Published',
      archived: 'Archived',
    } satisfies Record<DogLifecycleStatus, string>,
    next: {
      create: 'Create the first private Cane Corso profile.',
      core: 'Complete date of birth, color, short description, and registry class where possible.',
      photos: 'Add clear photos so the profile can be reviewed with better visual context.',
      origin: 'Add pedigree number or known parents/origin details if you have them.',
      review: 'Send or track the profile through USG review. Human review remains the official decision.',
      public: 'Review the public Registry presence after publication.',
      certificate: 'Track certificate/verify only when USG issues that separate trust layer.',
      care: 'Keep health, growth, and community/service actions up to date.',
    },
    steps: {
      profile: { label: 'Private profile', description: 'Create the personal Cane Corso record before anything becomes public.' },
      core: { label: 'Core information', description: 'Name, birth date, color, class, and owner-facing description.' },
      photos: { label: 'Photos', description: 'Clear images help the owner and reviewer understand the profile.' },
      origin: { label: 'Origin / pedigree', description: 'Pedigree number, parents, or known origin details when available.' },
      review: { label: 'USG review', description: 'Submit or follow the human review path without automatic approval.' },
      registry: { label: 'Registry profile', description: 'Public visibility starts only after approval and publication.' },
      certificate: { label: 'Certificate / Verify', description: 'Certificate trust is a separate USG decision, not automatic.' },
      care: { label: 'Care and ecosystem', description: 'Health, growth, services, and community actions continue after setup.' },
    },
  },
  bg: {
    eyebrow: 'USG път на собственика',
    title: 'Следващото действие за твоя Cane Corso е видимо тук',
    description:
      'Следвай един ясен път от личен профил към снимки, произход, USG преглед, видимост в регистъра, сертификатно доверие и ежедневна грижа.',
    emptyTitle: 'Започни с първия си личен Cane Corso профил',
    emptyDescription: 'Първо създай профила. MARK I и зоната на собственика ще държат следващите стъпки ясни, докато добавяш снимки, произход и готовност за преглед.',
    activeDogLabel: 'Активен профил',
    startLabel: 'Начална точка',
    nextActionLabel: 'Следващо действие',
    progressLabel: 'Готовност на пътя',
    open: 'Отвори',
    start: 'Създай профил',
    status: {
      draft: 'Чернова',
      submitted: 'Подаден за преглед',
      needs_changes: 'Изисква корекции',
      approved: 'Одобрен',
      published: 'Публикуван',
      archived: 'Архивиран',
    } satisfies Record<DogLifecycleStatus, string>,
    next: {
      create: 'Създай първия личен Cane Corso профил.',
      core: 'Попълни дата на раждане, цвят, кратко описание и клас на регистъра, когато е възможно.',
      photos: 'Добави ясни снимки, за да има по-добър визуален контекст при преглед.',
      origin: 'Добави pedigree номер или известни родители/произход, ако ги имаш.',
      review: 'Изпрати или следи профила през USG прегледа. Човешкият преглед остава официалното решение.',
      public: 'Прегледай публичното присъствие в Регистъра след публикация.',
      certificate: 'Следи сертификат/проверка само когато USG издаде този отделен слой на доверие.',
      care: 'Поддържай здраве, растеж и действията в общност/услуги актуални.',
    },
    steps: {
      profile: { label: 'Личен профил', description: 'Създай личния Cane Corso запис, преди нещо да стане публично.' },
      core: { label: 'Основна информация', description: 'Име, дата на раждане, цвят, клас и описание за собственика.' },
      photos: { label: 'Снимки', description: 'Ясните снимки помагат на собственика и преглеждащия да разберат профила.' },
      origin: { label: 'Произход / родословие', description: 'Pedigree номер, родители или известен произход, когато има данни.' },
      review: { label: 'USG преглед', description: 'Подай или следи човешкия преглед без автоматично одобрение.' },
      registry: { label: 'Профил в Регистъра', description: 'Публичната видимост започва само след одобрение и публикация.' },
      certificate: { label: 'Сертификат / Проверка', description: 'Сертификатното доверие е отделно USG решение, не автоматично.' },
      care: { label: 'Грижа и екосистема', description: 'Здраве, растеж, услуги и общност продължават след подготовката.' },
    },
  },
  it: {
    eyebrow: 'Percorso proprietario USG',
    title: 'La prossima azione per il tuo Cane Corso è chiara qui',
    description:
      'Segui un percorso ordinato dal profilo privato a foto, origine, revisione USG, registro, fiducia del certificato e cura quotidiana.',
    emptyTitle: 'Inizia con il tuo primo profilo Cane Corso privato',
    emptyDescription: 'Crea prima il profilo. MARK I e l’area proprietario manterranno chiari i passaggi mentre aggiungi foto, origine e preparazione alla revisione.',
    activeDogLabel: 'Profilo attivo',
    startLabel: 'Punto di partenza',
    nextActionLabel: 'Prossima azione',
    progressLabel: 'Preparazione percorso',
    open: 'Apri',
    start: 'Crea profilo',
    status: {
      draft: 'Bozza',
      submitted: 'Inviato alla revisione',
      needs_changes: 'Richiede modifiche',
      approved: 'Approvato',
      published: 'Pubblicato',
      archived: 'Archiviato',
    } satisfies Record<DogLifecycleStatus, string>,
    next: {
      create: 'Crea il primo profilo Cane Corso privato.',
      core: 'Completa data di nascita, colore, breve descrizione e classe del registro quando possibile.',
      photos: 'Aggiungi foto chiare per dare più contesto alla revisione.',
      origin: 'Aggiungi numero pedigree o genitori/origine noti se li hai.',
      review: 'Invia o segui il profilo nella revisione USG. La revisione umana resta la decisione ufficiale.',
      public: 'Controlla la presenza pubblica nel Registro dopo la pubblicazione.',
      certificate: 'Segui certificato/verifica solo quando USG emette questo livello separato di fiducia.',
      care: 'Mantieni aggiornati salute, crescita e azioni community/servizi.',
    },
    steps: {
      profile: { label: 'Profilo privato', description: 'Crea il record Cane Corso personale prima che qualcosa diventi pubblico.' },
      core: { label: 'Informazioni base', description: 'Nome, data di nascita, colore, classe e descrizione.' },
      photos: { label: 'Foto', description: 'Immagini chiare aiutano proprietario e revisore a capire il profilo.' },
      origin: { label: 'Origine / pedigree', description: 'Numero pedigree, genitori o origine nota quando disponibili.' },
      review: { label: 'Revisione USG', description: 'Invia o segui la revisione umana senza approvazione automatica.' },
      registry: { label: 'Profilo Registro', description: 'La visibilità pubblica inizia solo dopo approvazione e pubblicazione.' },
      certificate: { label: 'Certificato / Verifica', description: 'La fiducia del certificato è una decisione USG separata, non automatica.' },
      care: { label: 'Cura ed ecosistema', description: 'Salute, crescita, servizi e community continuano dopo la preparazione.' },
    },
  },
} as const;

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function getImageCount(dog: OwnerPathDog) {
  const urls = new Set<string>();
  if (dog.mainImageUrl) urls.add(dog.mainImageUrl);
  for (const item of dog.media ?? []) {
    if (item.mediaType === 'image' && item.url) urls.add(item.url);
  }
  return urls.size;
}

function selectFocusDog(dogs: OwnerPathDog[]) {
  return (
    dogs.find((dog) => dog.lifecycleStatus === 'needs_changes') ??
    dogs.find((dog) => dog.lifecycleStatus === 'draft') ??
    dogs.find((dog) => dog.lifecycleStatus === 'submitted') ??
    dogs.find((dog) => dog.lifecycleStatus === 'approved') ??
    dogs.find((dog) => dog.publication || dog.lifecycleStatus === 'published') ??
    dogs[0] ??
    null
  );
}

function makeState(isComplete: boolean, isCurrent: boolean, isAttention = false): OwnerPathStepState {
  if (isAttention) return 'attention';
  if (isComplete) return 'complete';
  if (isCurrent) return 'current';
  return 'locked';
}

function buildTimelineSteps(locale: Locale, dog: OwnerPathDog | null): { steps: OwnerPathStepView[]; nextAction: string; progress: number } {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  if (!dog) {
    const steps: OwnerPathStepView[] = [
      {
        id: 'profile',
        href: '/my-dogs/new',
        state: 'current',
        ...copy.steps.profile,
      },
      {
        id: 'core',
        href: '/my-dogs/new',
        state: 'locked',
        ...copy.steps.core,
      },
      {
        id: 'photos',
        href: '/my-dogs/new',
        state: 'locked',
        ...copy.steps.photos,
      },
      {
        id: 'origin',
        href: '/my-dogs/new',
        state: 'locked',
        ...copy.steps.origin,
      },
      {
        id: 'review',
        href: '/my-dogs/new',
        state: 'locked',
        ...copy.steps.review,
      },
    ];

    return { steps, nextAction: copy.next.create, progress: 0 };
  }

  const editHref = `/my-dogs/${dog.id}/edit`;
  const mediaHref = `/my-dogs/${dog.id}/media`;
  const healthHref = `/my-dogs/${dog.id}/health`;
  const publicHref = dog.publication ? `/registry/${dog.publication.publicSlug}` : '/registry';
  const verifyHref = dog.publication?.certificateCode
    ? `/verify/${dog.publication.certificateCode}`
    : dog.publication?.verificationSlug
      ? `/verify/${dog.publication.verificationSlug}`
      : '/verify';

  const profileComplete = true;
  const coreComplete = Boolean(dog.dateOfBirth && hasText(dog.color) && hasText(dog.shortDescription) && dog.registryClass);
  const photosComplete = getImageCount(dog) >= 3;
  const hasSomePhoto = getImageCount(dog) > 0;
  const originComplete = Boolean(hasText(dog.pedigreeNumber) || getPedigreeFilledCount(dog.pedigree) > 0);
  const reviewStarted = reviewedStatuses.includes(dog.lifecycleStatus);
  const needsAttention = dog.lifecycleStatus === 'needs_changes';
  const registryComplete = Boolean(dog.publication || dog.lifecycleStatus === 'published');
  const certificateComplete = Boolean(dog.publication?.certificateCode);

  const nextKey = needsAttention
    ? 'review'
    : !coreComplete
      ? 'core'
      : !photosComplete
        ? 'photos'
        : !originComplete
          ? 'origin'
          : !reviewStarted
            ? 'review'
            : !registryComplete
              ? 'public'
              : !certificateComplete
                ? 'certificate'
                : 'care';

  const steps: OwnerPathStepView[] = [
    {
      id: 'profile',
      href: editHref,
      state: makeState(profileComplete, false),
      ...copy.steps.profile,
    },
    {
      id: 'core',
      href: editHref,
      state: makeState(coreComplete, nextKey === 'core'),
      ...copy.steps.core,
    },
    {
      id: 'photos',
      href: mediaHref,
      state: makeState(photosComplete, nextKey === 'photos'),
      ...copy.steps.photos,
    },
    {
      id: 'origin',
      href: editHref,
      state: makeState(originComplete, nextKey === 'origin'),
      ...copy.steps.origin,
    },
    {
      id: 'review',
      href: editHref,
      state: makeState(reviewStarted && !needsAttention, nextKey === 'review', needsAttention),
      ...copy.steps.review,
    },
    {
      id: 'registry',
      href: publicHref,
      state: makeState(registryComplete, nextKey === 'public'),
      ...copy.steps.registry,
    },
    {
      id: 'certificate',
      href: verifyHref,
      state: makeState(certificateComplete, nextKey === 'certificate'),
      ...copy.steps.certificate,
    },
    {
      id: 'care',
      href: healthHref,
      state: nextKey === 'care' ? 'current' : hasSomePhoto ? 'complete' : 'locked',
      ...copy.steps.care,
    },
  ];

  const completeCount = steps.filter((step) => step.state === 'complete').length;
  const progress = Math.round((completeCount / steps.length) * 100);

  return { steps, nextAction: copy.next[nextKey], progress };
}

export function UsgOwnerPathTimeline({ locale, dogs, surface = 'member', className = '' }: UsgOwnerPathTimelineProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const focusDog = selectFocusDog(dogs);
  const { steps, nextAction, progress } = buildTimelineSteps(locale, focusDog);
  const rootClassName = ['usg-owner-path-timeline', `usg-owner-path-timeline--${surface}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={rootClassName} aria-labelledby={`usg-owner-path-${surface}-title`}>
      <div className="usg-owner-path-timeline__head">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2 id={`usg-owner-path-${surface}-title`}>{focusDog ? copy.title : copy.emptyTitle}</h2>
          <p>{focusDog ? copy.description : copy.emptyDescription}</p>
        </div>
        <div className="usg-owner-path-timeline__meter" aria-label={`${copy.progressLabel}: ${progress}%`}>
          <span>{copy.progressLabel}</span>
          <strong>{progress}%</strong>
          <div className="usg-owner-path-timeline__bar" aria-hidden="true">
            <i style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="usg-owner-path-timeline__summary">
        <div>
          <span>{focusDog ? copy.activeDogLabel : copy.startLabel}</span>
          <strong>{focusDog?.name ?? copy.start}</strong>
          <small>{focusDog ? copy.status[focusDog.lifecycleStatus] : copy.eyebrow}</small>
        </div>
        <div>
          <span>{copy.nextActionLabel}</span>
          <strong>{nextAction}</strong>
        </div>
      </div>

      <div className="usg-owner-path-timeline__steps" aria-label={copy.eyebrow}>
        {steps.map((step, index) => (
          <Link href={step.href} className={`usg-owner-path-step is-${step.state}`} key={step.id}>
            <span className="usg-owner-path-step__index">{String(index + 1).padStart(2, '0')}</span>
            <span className="usg-owner-path-step__body">
              <strong>{step.label}</strong>
              <small>{step.description}</small>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
