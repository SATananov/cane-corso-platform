import Link from 'next/link';
import type { Dog, DogMedia } from '@cane-corso-platform/contracts';
import { MyDogCard, type OwnerWorkspaceDog } from '@/components/my-dog-card';
import { OverviewStatCard } from '@/components/overview-stat-card';
import { EmptyStatePanel } from '@/components/empty-state-panel';
import { SectionCard } from '@/components/section-card';
import { InfoPanelGrid } from '@/components/info-panel-grid';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';
import { getOptionalCookieMemberSession } from '@/lib/session.server';
import { canAccessAdminArea } from '@/lib/access-control';
import { getPedigreeFilledCount, getPedigreePhotoCount } from '@/lib/dog-pedigree';
import { getCurrentMemberDogMediaDocument } from '@/lib/my-dog-media.server';
import { ImageLightbox } from '@/components/image-lightbox';
import { getPublishedRegistryProfileDocument } from '@/lib/registry.server';
import { OwnerPhotoGuidePanel } from '@/components/owner-photo-guide-panel';
import { OwnerReviewReadinessPanel } from '@/components/owner-review-readiness-panel';

interface MyDogsOverviewProps {
  dogs: Dog[];
}

function formatOverviewDate(locale: string, value: string | null) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

function getDogGalleryImages(dog: OwnerWorkspaceDog): string[] {
  const mediaImages = (dog.media ?? [])
    .filter((item) => item.mediaType === 'image' && item.url)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)
    .map((item) => item.url);

  return Array.from(new Set([dog.mainImageUrl, ...mediaImages].filter((value): value is string => Boolean(value)))).slice(0, 3);
}

async function enrichDogsWithMedia(dogs: Dog[]): Promise<OwnerWorkspaceDog[]> {
  const enrichedDogs = await Promise.all(
    dogs.map(async (dog) => {
      try {
        const document = await getCurrentMemberDogMediaDocument(dog.id, { allowDevFallback: false });
        const media = document.media
          .filter((item): item is DogMedia => item.mediaType === 'image')
          .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)
          .slice(0, 3);

        return { ...dog, media };
      } catch {
        return { ...dog, media: [] };
      }
    }),
  );

  return enrichedDogs;
}

export async function MyDogsOverview({ dogs }: MyDogsOverviewProps) {
  const locale = await getCurrentLocale();
  const t = getDictionary(locale);
  const currentSession = await getOptionalCookieMemberSession();
  const isAdminWorkspace = canAccessAdminArea(currentSession?.user.role);
  const dogsWithMedia = await enrichDogsWithMedia(dogs);

  const adminNote = {
    en: {
      eyebrow: 'Admin note',
      title: 'Your published Cane Corso stay here',
      body: 'My Dogs remains your personal owner space, including your published Cane Corso. Use Admin → Registry for every profile and Admin → Members for access control.',
    },
    bg: {
      eyebrow: 'Админ бележка',
      title: 'Твоите публикувани Cane Corso остават тук',
      body: 'My Dogs остава твоето лично пространство като собственик, включително за публикуваните ти Cane Corso. Използвай Админ → Регистър за всички профили и Админ → Потребители за контрол на достъпа.',
    },
    it: {
      eyebrow: 'Nota admin',
      title: 'I tuoi Cane Corso pubblicati restano qui',
      body: 'My Dogs resta il tuo spazio personale da proprietario, inclusi i Cane Corso pubblicati. Usa Admin → Registro per tutti i profili e Admin → Membri per il controllo accessi.',
    },
  }[locale] ?? {
    eyebrow: 'Admin note',
    title: 'Your published Cane Corso stay here',
    body: 'My Dogs remains your personal owner space, including your published Cane Corso. Use Admin → Registry for every profile and Admin → Members for access control.',
  };

  const workspaceCopy = {
    en: {
      eyebrow: 'Център на собственика',
      title: 'Bring the best of the old member world into the new workspace',
      description:
        'The strongest legacy idea was simple: a member should feel they have a real Cane Corso center, not just a list of profiles. My Dogs stays that center in the new platform.',
      cards: [
        {
          eyebrow: 'Идентичност на собственика',
          title: 'Keep your profile and your Cane Corso close together',
          description: 'Your personal identity, published visibility, and Cane Corso history should feel connected inside one clear owner space.',
          href: '/profile',
          meta: 'Profile • identity • owner center',
          icon: 'profile' as const,
        },
        {
          eyebrow: 'Насоки за собственика',
          title: 'Open knowledge, care, and FAQ without getting lost',
          description: 'Standards, owner guidance, FAQ, and practical explanations should always stay one click away from My Dogs.',
          href: '/knowledge',
          meta: 'Knowledge • guide • FAQ',
          icon: 'knowledge' as const,
        },
        {
          eyebrow: 'FUN & community',
          title: 'The platform should still feel alive around your Cane Corso',
          description: 'Gallery, FUN, future match logic, and new home support add life around the official trust path without replacing it.',
          href: '/community',
          meta: 'Community • gallery • new home',
          icon: 'community' as const,
        },
      ],
      trustEyebrow: 'Public trust path',
      trustTitle: 'What stays personal and what becomes public',
      trustBullets: [
        'Your owner space stays personal even after publication.',
        'A published profile can be public without automatically becoming a certificate record.',
        'Registry visibility, verify, and certificate trust remain separate steps.',
      ],
      nextEyebrow: 'Recommended next moves',
      nextTitle: 'What to do from here',
      nextBullets: [
        'Keep your main profile complete before you submit it for review.',
        'Add media and pedigree depth so the public profile feels richer after publication.',
        'Open the public registry and verify flow to understand how trust appears to visitors.',
      ],
    },
    bg: {
      eyebrow: 'Център на собственика',
      title: 'Вземи най-силното от стария членски свят в новата работна зона',
      description:
        'Най-силната идея от стария проект беше проста: членът трябва да усеща, че има истински Cane Corso център, а не просто списък с профили. My Dogs остава точно този център и в новата платформа.',
      cards: [
        {
          eyebrow: 'Идентичност на собственика',
          title: 'Дръж профила си и своите Cane Corso на едно място',
          description: 'Личната ти идентичност, публичната видимост и историята на твоите Cane Corso трябва да се усещат свързани в една ясна зона за собственика.',
          href: '/profile',
          meta: 'Профил • идентичност • център на собственика',
          icon: 'profile' as const,
        },
        {
          eyebrow: 'Насоки за собственика',
          title: 'Отваряй знания, грижа и чести въпроси без да се луташ',
          description: 'Стандарти, насоки за собственици, чести въпроси и практични обяснения трябва винаги да са на една стъпка от My Dogs.',
          href: '/knowledge',
          meta: 'Знания • насоки • чести въпроси',
          icon: 'knowledge' as const,
        },
        {
          eyebrow: 'FUN и общност',
          title: 'Платформата трябва да остава жива и около твоя Cane Corso',
          description: 'Галерията, FUN, бъдещият слой за свързване и подкрепата за нов дом носят живот около официалния път на доверие, без да го заместват.',
          href: '/community',
          meta: 'Общност • галерия • нов дом',
          icon: 'community' as const,
        },
      ],
      trustEyebrow: 'Път на публичното доверие',
      trustTitle: 'Какво остава лично и какво става публично',
      trustBullets: [
        'Твоята зона като собственик остава лична дори след публикуване.',
        'Публикуваният профил може да е публичен, без автоматично да е сертификатен запис.',
        'Видимостта в регистъра, проверката и сертификатното доверие остават отделни стъпки.',
      ],
      nextEyebrow: 'Препоръчани следващи ходове',
      nextTitle: 'Какво да направиш оттук',
      nextBullets: [
        'Поддържай основния профил пълен, преди да го подадеш за преглед.',
        'Добави медия и родословна дълбочина, за да изглежда публичният профил по-богат след публикуване.',
        'Отвори публичния регистър и пътя за проверка, за да разбереш как изглежда доверието за посетителя.',
      ],
    },
    it: {
      eyebrow: 'Център на собственика',
      title: 'Porta il meglio del vecchio mondo membro nel nuovo workspace',
      description:
        'L’idea legacy più forte era semplice: un membro dovrebbe sentire di avere un vero centro Cane Corso, non solo una lista di profili. My Dogs resta quel centro anche nella nuova piattaforma.',
      cards: [
        {
          eyebrow: 'Идентичност на собственика',
          title: 'Tieni profilo e Cane Corso nello stesso centro',
          description: 'La tua identità personale, la visibilità pubblica e la storia dei tuoi Cane Corso dovrebbero sentirsi connesse in uno spazio proprietario chiaro.',
          href: '/profile',
          meta: 'Profilo • identità • owner center',
          icon: 'profile' as const,
        },
        {
          eyebrow: 'Насоки за собственика',
          title: 'Apri knowledge, cura e FAQ senza perderti',
          description: 'Standard, owner guidance, FAQ e spiegazioni pratiche dovrebbero restare sempre a un click da My Dogs.',
          href: '/knowledge',
          meta: 'Knowledge • guida • FAQ',
          icon: 'knowledge' as const,
        },
        {
          eyebrow: 'FUN e community',
          title: 'La piattaforma dovrebbe restare viva intorno al tuo Cane Corso',
          description: 'Gallery, FUN, futura logica match e supporto new home aggiungono vita attorno al percorso official trust senza sostituirlo.',
          href: '/community',
          meta: 'Community • gallery • new home',
          icon: 'community' as const,
        },
      ],
      trustEyebrow: 'Percorso di fiducia pubblica',
      trustTitle: 'Cosa resta personale e cosa diventa pubblico',
      trustBullets: [
        'Il tuo spazio owner resta personale anche dopo la pubblicazione.',
        'Un profilo pubblicato può essere pubblico senza diventare automaticamente un record certificato.',
        'Visibilità nel registry, verify e fiducia del certificato restano passaggi separati.',
      ],
      nextEyebrow: 'Prossimi passi consigliati',
      nextTitle: 'Cosa fare da qui',
      nextBullets: [
        'Mantieni completo il profilo principale prima di inviarlo in review.',
        'Aggiungi media e profondità pedigree così il profilo pubblico sarà più ricco dopo la pubblicazione.',
        'Apri il registro pubblico e il flusso Verify per capire come la fiducia appare al visitatore.',
      ],
    },
  }[locale] ?? {
    eyebrow: 'Център на собственика',
    title: 'Bring the best of the old member world into the new workspace',
    description:
      'The strongest legacy idea was simple: a member should feel they have a real Cane Corso center, not just a list of profiles. My Dogs stays that center in the new platform.',
    cards: [],
    trustEyebrow: 'Public trust path',
    trustTitle: 'What stays personal and what becomes public',
    trustBullets: [],
    nextEyebrow: 'Recommended next moves',
    nextTitle: 'What to do from here',
    nextBullets: [],
  };


  const ownerJourneyByLocale = {
    en: {
      eyebrow: 'Owner workspace path',
      title: 'The strongest owner flow should stay obvious and calm',
      description: 'My Dogs should feel like a real preparation center: profile first, review second, publication later, certificate trust only if it is actually issued.',
      cards: [
        { eyebrow: 'Step 1', title: 'Complete the private profile first', description: 'Identity, data, pedigree, and media should feel solid before submission.', href: '/profile', meta: 'Profile • data • private prep', icon: 'profile' as const },
        { eyebrow: 'Step 2', title: 'Prepare and refine your Cane Corso entry', description: 'Use My Dogs as the owner workspace before anything becomes public.', href: '/my-dogs/new', meta: 'Draft • media • pedigree', icon: 'member' as const },
        { eyebrow: 'Step 3', title: 'Understand review and publication as separate moments', description: 'A stronger owner experience explains what is draft, what is in review, and what is publicly published.', href: '/guide?topic=member-workspace#member-workspace', meta: 'Review • publication • clarity', icon: 'guide' as const },
        { eyebrow: 'Step 4', title: 'Treat verify and certificate trust as a later layer', description: 'Publication does not automatically mean active certificate trust.', href: '/verify', meta: 'Verify • certificate • later trust', icon: 'verify' as const },
      ],
    },
    bg: {
      eyebrow: 'Път в личната работна зона',
      title: 'Най-силният път за собственика трябва да остане очевиден и спокоен',
      description: 'My Dogs трябва да се усеща като истински център за подготовка: първо профил, после преглед, после публикация, а сертификатното доверие идва само ако реално е издадено.',
      cards: [
        { eyebrow: 'Стъпка 1', title: 'Първо завърши личния профил', description: 'Идентичността, данните, pedigree-то и медията трябва да са стабилни преди изпращане.', href: '/profile', meta: 'Профил • данни • лична подготовка', icon: 'profile' as const },
        { eyebrow: 'Стъпка 2', title: 'Подготви и изчисти своя Cane Corso запис', description: 'Използвай My Dogs като лична работна зона, преди нещо да стане публично.', href: '/my-dogs/new', meta: 'Чернова • медия • родословие', icon: 'member' as const },
        { eyebrow: 'Стъпка 3', title: 'Разбирай прегледа и публикацията като отделни моменти', description: 'По-силното преживяване за собственика обяснява кое е чернова, кое е в преглед и кое е публично публикувано.', href: '/guide?topic=member-workspace#member-workspace', meta: 'Преглед • публикация • яснота', icon: 'guide' as const },
        { eyebrow: 'Стъпка 4', title: 'Гледай проверката и сертификатното доверие като по-късен слой', description: 'Публикацията не значи автоматично активен сертификатен запис на доверие.', href: '/verify', meta: 'Проверка • сертификат • по-късно доверие', icon: 'verify' as const },
      ],
    },
    it: {
      eyebrow: 'Percorso owner workspace',
      title: 'Il flusso owner più forte dovrebbe restare ovvio e calmo',
      description: 'My Dogs dovrebbe sembrare un vero centro di preparazione: prima profilo, poi review, poi pubblicazione, e fiducia del certificato solo se davvero emessa.',
      cards: [
        { eyebrow: 'Passo 1', title: 'Completa prima il profilo privato', description: 'Identità, dati, pedigree e media dovrebbero essere solidi prima dell’invio.', href: '/profile', meta: 'Profilo • dati • preparazione privata', icon: 'profile' as const },
        { eyebrow: 'Passo 2', title: 'Prepara e rifinisci la tua scheda Cane Corso', description: 'Usa My Dogs come owner workspace prima che qualcosa diventi pubblico.', href: '/my-dogs/new', meta: 'Bozza • media • pedigree', icon: 'member' as const },
        { eyebrow: 'Passo 3', title: 'Comprendi review e pubblicazione come momenti separati', description: 'Una migliore esperienza owner spiega cosa è bozza, cosa è in review e cosa è pubblicato.', href: '/guide?topic=member-workspace#member-workspace', meta: 'Review • pubblicazione • chiarezza', icon: 'guide' as const },
        { eyebrow: 'Passo 4', title: 'Considera verify e fiducia del certificato come layer successivo', description: 'La pubblicazione non significa automaticamente fiducia certificata attiva.', href: '/verify', meta: 'Verify • certificato • fiducia successiva', icon: 'verify' as const },
      ],
    },
  } as const;
  const ownerJourney = ownerJourneyByLocale[locale] ?? ownerJourneyByLocale.en;

  const totalDogs = dogsWithMedia.length;
  const published = dogsWithMedia.filter((dog) => dog.lifecycleStatus === 'published').length;
  const inReview = dogsWithMedia.filter((dog) => ['submitted', 'approved'].includes(dog.lifecycleStatus)).length;
  const needsChanges = dogsWithMedia.filter((dog) => dog.lifecycleStatus === 'needs_changes').length;
  const drafts = dogsWithMedia.filter((dog) => dog.lifecycleStatus === 'draft').length;

  const featuredDog = dogsWithMedia.find((dog) => dog.publication) ?? dogsWithMedia[0] ?? null;
  const featuredPedigreeFilled = featuredDog ? getPedigreeFilledCount(featuredDog.pedigree) : 0;
  const featuredPedigreePhotos = featuredDog ? getPedigreePhotoCount(featuredDog.pedigree) : 0;
  const featuredStatusLabel = featuredDog
    ? t.form.status[featuredDog.lifecycleStatus as keyof typeof t.form.status]
    : '—';
  const featuredVisibilityLabel = featuredDog
    ? featuredDog.visibility === 'public'
      ? t.form.fields.public
      : t.form.fields.private
    : '—';
  const featuredRegistryClassLabel = featuredDog
    ? t.form.registryClass[(featuredDog.registryClass ?? 'owner_declared_cane_corso') as keyof typeof t.form.registryClass]
    : '—';
  const featuredUpdatedAt = featuredDog ? formatOverviewDate(locale, featuredDog.updatedAt) : '—';
  const featuredPublishedAt = featuredDog?.publication ? formatOverviewDate(locale, featuredDog.publication.publishedAt) : '—';
  const featuredRegistryDocument = featuredDog?.publication
    ? await getPublishedRegistryProfileDocument(featuredDog.publication.publicSlug, currentSession?.user.profileId ?? null)
    : null;
  const featuredRegistryEntry = featuredRegistryDocument?.entry ?? null;
  const featuredPublicHref = featuredRegistryEntry
    ? `/registry/${featuredRegistryEntry.publicSlug}`
    : featuredDog?.publication
      ? `/registry/${featuredDog.publication.publicSlug}`
      : '/registry';
  const featuredVerifyHref = featuredDog?.publication?.certificateCode
    ? `/verify/${featuredDog.publication.certificateCode}`
    : featuredDog?.publication?.verificationSlug
      ? `/verify/${featuredDog.publication.verificationSlug}`
      : '/verify';
  const featuredParents = featuredDog
    ? [
        { relationKey: 'mother' as const, ancestor: featuredDog.pedigree?.mother },
        { relationKey: 'father' as const, ancestor: featuredDog.pedigree?.father },
      ].filter(({ ancestor }) => Boolean(ancestor?.name?.trim() || ancestor?.photoUrl?.trim()))
    : [];

  const spotlightCopy = {
    en: {
      eyebrow: 'Selected Cane Corso',
      title: 'Use the open space as a clear profile summary',
      description: 'The right panel should help you read the current Cane Corso quickly instead of leaving the section visually empty.',
      publicationLead: 'This Cane Corso already has a public registry presence and can be reviewed as a visitor would see it.',
      workspaceLead: 'This Cane Corso still lives inside your private owner workspace and can be refined before review.',
      overviewTitle: 'Profile overview',
      quickActions: 'Quick actions',
      galleryEyebrow: 'Cane Corso gallery',
      galleryTitle: 'Main profile photos',
      assessmentEyebrow: 'Assessment layer',
      communityRating: 'Community rating',
      communityOpen: 'Open for member ratings',
      communityLocked: 'Activates after publication',
      communityNoVotes: 'No community ratings yet',
      adminPending: 'Awaiting admin assessment',
      votes: 'votes',
      adminAssessment: 'Admin assessment',
      certificateTrust: 'USG certificate',
      certificateSeparate: 'Separate admin decision',
      pedigreeEyebrow: 'Family pedigree',
      pedigreeTitle: 'Mother and father preview',
      selfLabel: 'Current Cane Corso',
      emptyName: 'Name pending',
      nextTitle: 'Strongest next step',
      nextPublished: 'Add richer media, deeper pedigree context, or a stronger presentation so the public profile feels even more complete.',
      nextWorkspace: 'Finish the presentation, media, and pedigree depth before you send the profile into review.',
      labels: {
        status: 'Status',
        visibility: 'Visibility',
        registryClass: 'Registry class',
        filledAncestors: 'Filled ancestors',
        ancestorPhotos: 'Ancestor photos',
        certificate: 'Certificate',
        updatedAt: 'Last update',
        publishedAt: 'Published on',
      },
      buttons: {
        edit: 'Edit profile',
        media: 'Manage media',
        publicProfile: 'Public profile',
        verify: 'Open Verify',
      },
      notIssued: 'Not issued yet',
    },
    bg: {
      eyebrow: 'Избран Cane Corso',
      title: 'Използвай празното място като ясно обобщение на профила',
      description: 'Десният панел трябва да ти помага да четеш най-важното за Cane Corso бързо, вместо секцията да остава визуално празна.',
      publicationLead: 'Този Cane Corso вече има публично присъствие в регистъра и можеш да го прегледаш както би го видял посетителят.',
      workspaceLead: 'Този Cane Corso все още е в личната работна зона и може да бъде доизчистен преди преглед.',
      overviewTitle: 'Обобщение на профила',
      quickActions: 'Бързи действия',
      galleryEyebrow: 'Галерия на Cane Corso',
      galleryTitle: 'Основни снимки на профила',
      assessmentEyebrow: 'Оценъчен слой',
      communityRating: 'Оценка от общността',
      communityOpen: 'Отворено за оценки от членове',
      communityLocked: 'Активира се след публикация',
      communityNoVotes: 'Все още няма оценки от общността',
      adminPending: 'Очаква админ оценка',
      votes: 'гласа',
      adminAssessment: 'Админ оценка',
      certificateTrust: 'USG сертификат',
      certificateSeparate: 'Отделно админ решение',
      pedigreeEyebrow: 'Семейно родословие',
      pedigreeTitle: 'Преглед на майка и баща',
      selfLabel: 'Текущ Cane Corso',
      emptyName: 'Име предстои',
      nextTitle: 'Най-силната следваща стъпка',
      nextPublished: 'Добави по-силна медия, по-дълбоко pedigree или по-богато представяне, за да стои публичният профил още по-завършен.',
      nextWorkspace: 'Довърши представянето, медията и родословната дълбочина, преди да подадеш профила за преглед.',
      labels: {
        status: 'Статус',
        visibility: 'Видимост',
        registryClass: 'Клас в регистъра',
        filledAncestors: 'Попълнени предци',
        ancestorPhotos: 'Снимки на предци',
        certificate: 'Сертификат',
        updatedAt: 'Последна редакция',
        publishedAt: 'Публикуван на',
      },
      buttons: {
        edit: 'Редактирай профила',
        media: 'Медии',
        publicProfile: 'Публичен профил',
        verify: 'Отвори проверката',
      },
      notIssued: 'Все още не е издаден',
    },
    it: {
      eyebrow: 'Cane Corso selezionato',
      title: 'Usa lo spazio libero come riepilogo chiaro del profilo',
      description: 'Il pannello a destra dovrebbe aiutarti a leggere subito il Cane Corso corrente invece di lasciare la sezione visivamente vuota.',
      publicationLead: 'Questo Cane Corso ha già una presenza pubblica nel registro e puoi rivederlo come lo vedrebbe un visitatore.',
      workspaceLead: 'Questo Cane Corso vive ancora nel tuo owner workspace privato e può essere rifinito prima della review.',
      overviewTitle: 'Riepilogo profilo',
      quickActions: 'Azioni rapide',
      galleryEyebrow: 'Galleria Cane Corso',
      galleryTitle: 'Foto principali del profilo',
      assessmentEyebrow: 'Layer valutazione',
      communityRating: 'Valutazione community',
      communityOpen: 'Aperta alle valutazioni dei membri',
      communityLocked: 'Si attiva dopo la pubblicazione',
      communityNoVotes: 'Nessuna valutazione community',
      adminPending: 'In attesa della valutazione admin',
      votes: 'voti',
      adminAssessment: 'Valutazione admin',
      certificateTrust: 'Certificato USG',
      certificateSeparate: 'Decisione admin separata',
      pedigreeEyebrow: 'Pedigree familiare',
      pedigreeTitle: 'Anteprima madre e padre',
      selfLabel: 'Cane Corso attuale',
      emptyName: 'Nome in attesa',
      nextTitle: 'Passo successivo più forte',
      nextPublished: 'Aggiungi media più ricchi, più profondità pedigree o una presentazione più forte per rendere il profilo pubblico ancora più completo.',
      nextWorkspace: 'Completa presentazione, media e profondità pedigree prima di inviare il profilo in review.',
      labels: {
        status: 'Stato',
        visibility: 'Visibilità',
        registryClass: 'Classe registro',
        filledAncestors: 'Antenati compilati',
        ancestorPhotos: 'Foto antenati',
        certificate: 'Certificato',
        updatedAt: 'Ultimo aggiornamento',
        publishedAt: 'Pubblicato il',
      },
      buttons: {
        edit: 'Modifica profilo',
        media: 'Media',
        publicProfile: 'Profilo pubblico',
        verify: 'Apri Verify',
      },
      notIssued: 'Non ancora emesso',
    },
  }[locale] ?? {
    eyebrow: 'Selected Cane Corso',
    title: 'Use the open space as a clear profile summary',
    description: 'The right panel should help you read the current Cane Corso quickly instead of leaving the section visually empty.',
    publicationLead: 'This Cane Corso already has a public registry presence and can be reviewed as a visitor would see it.',
    workspaceLead: 'This Cane Corso still lives inside your private owner workspace and can be refined before review.',
    overviewTitle: 'Profile overview',
    quickActions: 'Quick actions',
    galleryEyebrow: 'Cane Corso gallery',
    galleryTitle: 'Main profile photos',
    assessmentEyebrow: 'Assessment layer',
    communityRating: 'Community rating',
    communityOpen: 'Open for member ratings',
    communityLocked: 'Activates after publication',
    communityNoVotes: 'No community ratings yet',
    adminPending: 'Awaiting admin assessment',
    votes: 'votes',
    adminAssessment: 'Admin assessment',
    certificateTrust: 'USG certificate',
    certificateSeparate: 'Separate admin decision',
    pedigreeEyebrow: 'Family pedigree',
    pedigreeTitle: 'Mother and father preview',
    selfLabel: 'Current Cane Corso',
    emptyName: 'Name pending',
    nextTitle: 'Strongest next step',
    nextPublished: 'Add richer media, deeper pedigree context, or a stronger presentation so the public profile feels even more complete.',
    nextWorkspace: 'Finish the presentation, media, and pedigree depth before you send the profile into review.',
    labels: {
      status: 'Status',
      visibility: 'Visibility',
      registryClass: 'Registry class',
      filledAncestors: 'Filled ancestors',
      ancestorPhotos: 'Ancestor photos',
      certificate: 'Certificate',
      updatedAt: 'Last update',
      publishedAt: 'Published on',
    },
    buttons: {
      edit: 'Edit profile',
      media: 'Manage media',
      publicProfile: 'Public profile',
      verify: 'Open Verify',
    },
    notIssued: 'Not issued yet',
  };

  const featuredCommunityRatingLabel =
    !featuredDog?.publication
      ? spotlightCopy.communityLocked
      : featuredRegistryEntry?.communityRating.totalRatings
        ? `${(featuredRegistryEntry.communityRating.averageRating ?? 0).toFixed(1)} / 5 · ${featuredRegistryEntry.communityRating.totalRatings} ${spotlightCopy.votes}`
        : spotlightCopy.communityNoVotes;
  const featuredAdminAssessmentLabel =
    !featuredDog?.publication
      ? spotlightCopy.communityLocked
      : typeof featuredRegistryEntry?.adminAssessment?.overallScore === 'number'
        ? `${featuredRegistryEntry.adminAssessment.overallScore.toFixed(1)} / 5`
        : spotlightCopy.adminPending;
  const featuredCertificateTrustLabel =
    featuredDog?.publication?.certificateCode ?? spotlightCopy.certificateSeparate;
  const featuredGalleryImages = featuredDog ? getDogGalleryImages(featuredDog) : [];
  const featuredGalleryImageCount = featuredGalleryImages.length;


  return (
    <div className="member-route-stack">
      <section className="route-hero-card route-hero-card--member">
        <div>
          <span className="eyebrow-label">{t.pages.myDogs.eyebrow}</span>
          <h1 className="route-title">{t.pages.myDogs.title}</h1>
          <p className="route-copy">{t.pages.myDogs.description}</p>
          <div className="route-hero-pills route-hero-pills--member">
            <span className="route-pill route-pill--glow">{totalDogs} {t.pages.myDogs.labels.totalProfiles.toLowerCase()}</span>
            <span className="route-pill">{published} {t.pages.myDogs.labels.published.toLowerCase()}</span>
            <span className="route-pill subtle">{inReview} {t.pages.myDogs.labels.inReview.toLowerCase()}</span>
          </div>
        </div>
        <div className="route-hero-actions">
          <Link href="/my-dogs/new" className="button-primary">
            {t.common.addNewDog}
          </Link>
          <Link href="/profile" className="button-secondary">
            {t.navigation.profile}
          </Link>
          <Link href="/guide?topic=member-workspace#member-workspace" className="button-ghost small">
            {t.common.help}
          </Link>
          {dogsWithMedia[0] ? (
            <Link href={`/my-dogs/${dogsWithMedia[0].id}/media`} className="button-secondary">
              {t.common.manageMedia}
            </Link>
          ) : (
            <button type="button" className="button-secondary" disabled>
              {t.common.manageMedia}
            </button>
          )}
        </div>
      </section>

      <div className="stats-grid five-up">
        <OverviewStatCard label={t.pages.myDogs.labels.totalProfiles} value={String(totalDogs)} tone="gold" />
        <OverviewStatCard label={t.pages.myDogs.labels.published} value={String(published)} tone="ivory" />
        <OverviewStatCard label={t.pages.myDogs.labels.inReview} value={String(inReview)} tone="gold" />
        <OverviewStatCard label={t.pages.myDogs.labels.needsChanges} value={String(needsChanges)} tone="ivory" />
        <OverviewStatCard label={t.pages.myDogs.labels.drafts} value={String(drafts)} tone="gold" />
      </div>

      <InfoPanelGrid
        eyebrow={ownerJourney.eyebrow}
        title={ownerJourney.title}
        description={ownerJourney.description}
        cards={ownerJourney.cards}
        actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'}
        ariaLabel={ownerJourney.title}
      />

      <section className="content-card">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{workspaceCopy.eyebrow}</span>
            <h2>{workspaceCopy.title}</h2>
            <p className="section-support-copy">{workspaceCopy.description}</p>
          </div>
          <Link href="/registry" className="inline-link-action">
            {locale === 'bg' ? 'Публичен регистър' : locale === 'it' ? 'Registro pubblico' : 'Public registry'}
          </Link>
        </div>

        <div className="section-card-grid section-card-grid--three">
          {workspaceCopy.cards.map((card) => (
            <SectionCard key={card.title} {...card} actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'} />
          ))}
        </div>
      </section>

      <div className="content-grid two-columns-wide-right my-dogs-command-layout">
        <div className="stack-blocks">
          <section className="content-card my-dogs-directory-card">
            <div className="section-head-row">
              <div>
                <span className="eyebrow-label">{t.pages.myDogs.labels.profiles}</span>
                <h2>{t.pages.myDogs.labels.profiles}</h2>
              </div>
              <Link href="/my-dogs/new" className="inline-link-action">
                {t.common.createProfile}
              </Link>
            </div>

            {dogsWithMedia.length > 0 ? (
              <div className="my-dogs-focus-grid">
                <div className="my-dogs-focus-list">
                  <div className="dog-card-grid dog-card-grid--single-column">
                    {dogsWithMedia.map((dog) => (
                      <MyDogCard key={dog.id} dog={dog} />
                    ))}
                  </div>
                </div>

                {featuredDog ? (
                  <aside className="my-dogs-focus-panel">
                    <div className="my-dogs-focus-panel__head">
                      <div>
                        <span className="eyebrow-label">{spotlightCopy.eyebrow}</span>
                        <h3>{spotlightCopy.title}</h3>
                      </div>
                      <span className={`route-pill${featuredDog.publication ? ' route-pill--glow' : ''}`}>{featuredStatusLabel}</span>
                    </div>

                    <p className="my-dogs-focus-panel__description">{spotlightCopy.description}</p>

                    {featuredGalleryImages.length > 0 ? (
                      <div className="my-dogs-focus-panel__media">
                        <ImageLightbox src={featuredGalleryImages[0]} alt={featuredDog.name} imageClassName="my-dogs-focus-panel__media-image" />
                      </div>
                    ) : null}

                    {featuredGalleryImages.length > 0 ? (
                      <div className="my-dogs-focus-gallery" aria-label={spotlightCopy.galleryTitle}>
                        <div className="my-dogs-focus-gallery__head">
                          <span className="eyebrow-label">{spotlightCopy.galleryEyebrow}</span>
                          <strong>{featuredGalleryImages.length}/3</strong>
                        </div>
                        <div className="my-dogs-focus-gallery__row">
                          {featuredGalleryImages.map((imageUrl, index) => (
                            <div className="my-dogs-focus-gallery__thumb" key={`${featuredDog.id}-focus-gallery-${index}`}>
                              <ImageLightbox src={imageUrl} alt={featuredDog.name} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="my-dogs-focus-panel__overview">
                      <div className="my-dogs-focus-panel__title-row">
                        <div>
                          <span className="eyebrow-label">{spotlightCopy.overviewTitle}</span>
                          <h4>{featuredDog.name}</h4>
                        </div>
                      </div>
                      <p className="my-dogs-focus-panel__lead">
                        {featuredDog.publication ? spotlightCopy.publicationLead : spotlightCopy.workspaceLead}
                      </p>
                    </div>

                    <OwnerReviewReadinessPanel
                      locale={locale}
                      context="overview"
                      dogName={featuredDog.name}
                      slug={featuredDog.slug}
                      lifecycleStatus={featuredDog.lifecycleStatus}
                      visibility={featuredDog.visibility}
                      hasPublication={Boolean(featuredDog.publication)}
                      hasCertificate={Boolean(featuredDog.publication?.certificateCode)}
                      hasDateOfBirth={Boolean(featuredDog.dateOfBirth)}
                      hasColor={Boolean(featuredDog.color?.trim())}
                      hasShortDescription={Boolean(featuredDog.shortDescription?.trim())}
                      hasCity={Boolean((featuredDog as { city?: string | null }).city?.trim())}
                      hasCountry={Boolean((featuredDog as { country?: string | null }).country?.trim())}
                      hasPrimaryImage={Boolean(featuredGalleryImages[0])}
                      galleryImageCount={featuredGalleryImageCount}
                      pedigreeFilledCount={featuredPedigreeFilled}
                      pedigreePhotoCount={featuredPedigreePhotos}
                      editHref={`/my-dogs/${featuredDog.id}/edit`}
                      mediaHref={`/my-dogs/${featuredDog.id}/media`}
                      publicHref={featuredPublicHref}
                      verifyHref={featuredVerifyHref}
                      compact
                    />

                    {featuredParents.length > 0 ? (
                      <section className="my-dogs-focus-pedigree" aria-label={spotlightCopy.pedigreeTitle}>
                        <div className="my-dogs-focus-pedigree__head">
                          <span className="eyebrow-label">{spotlightCopy.pedigreeEyebrow}</span>
                          <h4>{spotlightCopy.pedigreeTitle}</h4>
                        </div>
                        <div className="my-dogs-focus-pedigree__tree">
                          <div className="my-dogs-focus-pedigree__node my-dogs-focus-pedigree__node--self">
                            {featuredDog.mainImageUrl ? <ImageLightbox src={featuredDog.mainImageUrl} alt={featuredDog.name} /> : <span aria-hidden="true">USG</span>}
                            <div>
                              <small>{spotlightCopy.selfLabel}</small>
                              <strong>{featuredDog.name}</strong>
                            </div>
                          </div>
                          <div className="my-dogs-focus-pedigree__connector" aria-hidden="true" />
                          <div className="my-dogs-focus-pedigree__parents">
                            {featuredParents.map(({ relationKey, ancestor }) => (
                              <div className="my-dogs-focus-pedigree__node" key={relationKey}>
                                {ancestor?.photoUrl ? <ImageLightbox src={ancestor.photoUrl} alt={ancestor.name || t.form.pedigree.relations[relationKey]} /> : <span aria-hidden="true">USG</span>}
                                <div>
                                  <small>{t.form.pedigree.relations[relationKey]}</small>
                                  <strong>{ancestor?.name || spotlightCopy.emptyName}</strong>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    ) : null}

                    <div className="my-dogs-focus-stats">
                      <div className="my-dogs-focus-stat">
                        <span>{spotlightCopy.labels.status}</span>
                        <strong>{featuredStatusLabel}</strong>
                      </div>
                      <div className="my-dogs-focus-stat">
                        <span>{spotlightCopy.labels.visibility}</span>
                        <strong>{featuredVisibilityLabel}</strong>
                      </div>
                      <div className="my-dogs-focus-stat">
                        <span>{spotlightCopy.labels.registryClass}</span>
                        <strong>{featuredRegistryClassLabel}</strong>
                      </div>
                      <div className="my-dogs-focus-stat">
                        <span>{spotlightCopy.labels.filledAncestors}</span>
                        <strong>{featuredPedigreeFilled}/14</strong>
                      </div>
                      <div className="my-dogs-focus-stat">
                        <span>{spotlightCopy.labels.ancestorPhotos}</span>
                        <strong>{featuredPedigreePhotos}</strong>
                      </div>
                      <div className="my-dogs-focus-stat">
                        <span>{spotlightCopy.labels.certificate}</span>
                        <strong>{featuredDog.publication?.certificateCode ?? spotlightCopy.notIssued}</strong>
                      </div>
                      <div className="my-dogs-focus-stat">
                        <span>{spotlightCopy.labels.updatedAt}</span>
                        <strong>{featuredUpdatedAt}</strong>
                      </div>
                      <div className="my-dogs-focus-stat">
                        <span>{spotlightCopy.labels.publishedAt}</span>
                        <strong>{featuredDog.publication ? featuredPublishedAt : '—'}</strong>
                      </div>
                    </div>

                    <div className="my-dogs-focus-assessment" aria-label={spotlightCopy.assessmentEyebrow}>
                      <span className="eyebrow-label">{spotlightCopy.assessmentEyebrow}</span>
                      <div className="my-dogs-focus-assessment__grid">
                        <div>
                          <span>{spotlightCopy.communityRating}</span>
                          <strong>{featuredCommunityRatingLabel}</strong>
                        </div>
                        <div>
                          <span>{spotlightCopy.adminAssessment}</span>
                          <strong>{featuredAdminAssessmentLabel}</strong>
                        </div>
                        <div>
                          <span>{spotlightCopy.certificateTrust}</span>
                          <strong>{featuredCertificateTrustLabel}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="my-dogs-focus-actions">
                      <Link href={`/my-dogs/${featuredDog.id}/edit`} className="button-secondary small">
                        {spotlightCopy.buttons.edit}
                      </Link>
                      <Link href={`/my-dogs/${featuredDog.id}/media`} className="button-secondary small">
                        {spotlightCopy.buttons.media}
                      </Link>
                      <Link href={featuredPublicHref} className="button-ghost small">
                        {spotlightCopy.buttons.publicProfile}
                      </Link>
                      <Link href={featuredVerifyHref} className="button-ghost small">
                        {spotlightCopy.buttons.verify}
                      </Link>
                    </div>

                    <div className="my-dogs-focus-panel__note">
                      <span className="eyebrow-label">{spotlightCopy.nextTitle}</span>
                      <p>{featuredDog.publication ? spotlightCopy.nextPublished : spotlightCopy.nextWorkspace}</p>
                    </div>
                  </aside>
                ) : null}
              </div>
            ) : (
              <EmptyStatePanel
                title={t.pages.myDogs.noDogsTitle}
                description={t.pages.myDogs.noDogsDescription}
                actionHref="/my-dogs/new"
                actionLabel={t.common.addNewDog}
              />
            )}
          </section>
        </div>

        <aside className="side-stack">
          <OwnerPhotoGuidePanel locale={locale} />

          <section className="side-info-card">
            <span className="eyebrow-label">{workspaceCopy.trustEyebrow}</span>
            <h3>{workspaceCopy.trustTitle}</h3>
            <ul className="side-bullet-list">
              {workspaceCopy.trustBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>

          <section className="side-info-card compact">
            <span className="eyebrow-label">{workspaceCopy.nextEyebrow}</span>
            <h3>{workspaceCopy.nextTitle}</h3>
            <ul className="side-bullet-list side-bullet-list--compact">
              {workspaceCopy.nextBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>

          {isAdminWorkspace ? (
            <section className="side-info-card compact">
              <span className="eyebrow-label">{adminNote.eyebrow}</span>
              <h3>{adminNote.title}</h3>
              <p>{adminNote.body}</p>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
